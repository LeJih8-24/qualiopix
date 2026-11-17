/** ACC-02 – Profil de l'organisme. */
import { eq } from "drizzle-orm";
import { withOrg, type Db } from "@/db";
import { organizations } from "@/db/schema";
import type { OrganizationProfileInput } from "@/lib/validation";
import { logAction } from "./audit";

export async function getOrganization(orgId: string, db?: Db) {
  return withOrg(
    orgId,
    async (tx) => {
      const [org] = await tx.select().from(organizations).where(eq(organizations.id, orgId));
      return org ?? null;
    },
    db,
  );
}

export async function updateOrganization(
  orgId: string,
  actorUserId: string,
  input: OrganizationProfileInput,
  db?: Db,
) {
  return withOrg(
    orgId,
    async (tx) => {
      const [before] = await tx.select().from(organizations).where(eq(organizations.id, orgId));
      if (!before) throw new Error("Organisme introuvable");

      const [after] = await tx
        .update(organizations)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(organizations.id, orgId))
        .returning();

      const changed = Object.keys(input).filter(
        (k) =>
          (before as Record<string, unknown>)[k] !== (after as Record<string, unknown>)[k],
      );
      if (changed.length) {
        await logAction(tx, {
          organizationId: orgId,
          actorUserId,
          action: "organization.updated",
          entity: "organization",
          entityId: orgId,
          data: { fields: changed },
        });
      }
      return after;
    },
    db,
  );
}
