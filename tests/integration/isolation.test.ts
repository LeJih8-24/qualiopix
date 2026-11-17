/**
 * Exigence « Cloisonnement » : les données d'un formateur ne sont jamais
 * visibles d'un autre. Exigence « Intégrité » : journal non modifiable.
 */
import { afterAll, describe, expect, it } from "vitest";
import { eq, sql } from "drizzle-orm";
import { withOrg } from "@/db";
import { auditLog, organizations } from "@/db/schema";
import { organizationProfileSchema } from "@/lib/validation";
import { getOrganization, updateOrganization } from "@/server/organization";
import { adminSql, appDb, newAccount } from "./helpers";

afterAll(async () => {
  await adminSql.end();
});

/** Tables exemptées de RLS, lues avant que l'organisme soit connu (connexion). */
const RLS_EXEMPT = new Set(["users", "auth_sessions"]);

describe("cloisonnement entre organismes", () => {
  it("toute table métier active la RLS", async () => {
    const rows = await adminSql<{ table: string; rls: boolean }[]>`
      select c.relname as table, c.relrowsecurity as rls
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind = 'r'
        and (exists (select 1 from information_schema.columns col
                     where col.table_schema = 'public' and col.table_name = c.relname
                       and col.column_name = 'organization_id')
             or c.relname = 'organizations')`;
    const missing = rows.filter((r) => !r.rls && !RLS_EXEMPT.has(r.table)).map((r) => r.table);
    expect(missing).toEqual([]);
  });

  it("un organisme ne lit pas le profil d'un autre", async () => {
    const a = await newAccount("A");
    const b = await newAccount("B");

    const seenByA = await withOrg(a.organizationId, (tx) => tx.select().from(organizations), appDb);
    expect(seenByA.map((o) => o.id)).toEqual([a.organizationId]);

    // Même en demandant explicitement l'identifiant de B.
    const leak = await withOrg(
      a.organizationId,
      (tx) => tx.select().from(organizations).where(eq(organizations.id, b.organizationId)),
      appDb,
    );
    expect(leak).toEqual([]);
  });

  it("un organisme ne modifie pas le profil d'un autre", async () => {
    const a = await newAccount("A");
    const b = await newAccount("B");
    await withOrg(
      a.organizationId,
      (tx) =>
        tx.update(organizations).set({ legalName: "piraté" }).where(eq(organizations.id, b.organizationId)),
      appDb,
    );
    const orgB = await getOrganization(b.organizationId, appDb);
    expect(orgB?.legalName).toBe("B Formation");
  });

  it("un organisme n'écrit pas dans le journal d'un autre", async () => {
    const a = await newAccount("A");
    const b = await newAccount("B");
    await expect(
      withOrg(
        a.organizationId,
        (tx) =>
          tx.insert(auditLog).values({
            organizationId: b.organizationId,
            action: "x",
            entity: "y",
          }),
        appDb,
      ),
    ).rejects.toThrow();
  });

  it("sans organisme courant, aucune ligne n'est visible", async () => {
    await newAccount("A");
    const rows = await appDb.select().from(organizations);
    expect(rows).toEqual([]);
  });
});

describe("journal des actions", () => {
  it("trace la création du compte et les modifications du profil", async () => {
    const a = await newAccount("A");
    await updateOrganization(
      a.organizationId,
      a.userId,
      organizationProfileSchema.parse({ legalName: "A Formation", city: "Strasbourg" }),
      appDb,
    );
    const entries = await withOrg(
      a.organizationId,
      (tx) => tx.select().from(auditLog).orderBy(auditLog.id),
      appDb,
    );
    expect(entries.map((e) => e.action)).toEqual(["account.created", "organization.updated"]);
    expect(entries[1].data).toEqual({ fields: ["city"] });
  });

  it("refuse toute modification ou suppression, même au propriétaire", async () => {
    const a = await newAccount("A");
    await expect(
      withOrg(a.organizationId, (tx) => tx.delete(auditLog), appDb),
    ).rejects.toThrow();
    await expect(
      adminSql`update audit_log set action = 'falsifié' where organization_id = ${a.organizationId}`,
    ).rejects.toThrow(/ajout seul/);
    await expect(
      adminSql`delete from audit_log where organization_id = ${a.organizationId}`,
    ).rejects.toThrow(/ajout seul/);
  });

  it("le rôle applicatif n'a pas le droit de contourner la RLS", async () => {
    const [row] = await appDb.execute<{ bypass: boolean; superuser: boolean }>(
      sql`select rolbypassrls as bypass, rolsuper as superuser from pg_roles where rolname = current_user`,
    );
    expect(row).toEqual({ bypass: false, superuser: false });
  });
});
