/** RG-02 (documents figés), RG-03 (dates de preuve), signature et liens sécurisés. */
import { afterAll, describe, expect, it } from "vitest";
import { eq, sql } from "drizzle-orm";
import { withOrg } from "@/db";
import { accessLinks, documents, evidence } from "@/db/schema";
import { createAccessLink, hashLinkToken, resolveAccessLink, revokeAccessLink } from "@/server/access-links";
import {
  createDraft,
  createNewVersion,
  DocumentFrozenError,
  freezeDocument,
  sha256,
  updateDraft,
} from "@/server/documents";
import { getStorage } from "@/server/integrations/storage";
import { recordEvidence } from "@/server/evidence";
import { indicatorBoard } from "@/server/qualiopi";
import { AlreadySignedError, signDocument } from "@/server/signatures";
import { adminSql, appDb, newAccount } from "./helpers";
import "./setup-integrations";

afterAll(async () => {
  await adminSql.end();
});

async function draft(orgId: string, kind = "reglement_interieur") {
  return createDraft(orgId, null, { kind, title: "Règlement intérieur", body: "# Objet\nTexte." }, appDb);
}

describe("RG-02 – document figé", () => {
  it("un brouillon se modifie, un document figé non", async () => {
    const a = await newAccount("A");
    const doc = await draft(a.organizationId);
    await updateDraft(a.organizationId, null, doc.id, { title: "RI", body: "v1 corrigée" }, appDb);

    const frozen = await freezeDocument(a.organizationId, null, doc.id, appDb);
    expect(frozen.status).toBe("frozen");
    expect(frozen.frozenAt).toBeInstanceOf(Date);

    await expect(
      updateDraft(a.organizationId, null, doc.id, { title: "x", body: "x" }, appDb),
    ).rejects.toBeInstanceOf(DocumentFrozenError);
  });

  it("la base refuse la modification ou la suppression d'un document figé, même en SQL direct", async () => {
    const a = await newAccount("A");
    const doc = await draft(a.organizationId);
    await freezeDocument(a.organizationId, null, doc.id, appDb);
    await expect(
      withOrg(a.organizationId, (tx) => tx.update(documents).set({ body: "falsifié" }).where(eq(documents.id, doc.id)), appDb),
    ).rejects.toThrow();
    await expect(adminSql`delete from documents where id = ${doc.id}`).rejects.toThrow(/RG-02/);
  });

  it("le PDF stocké correspond à l'empreinte enregistrée", async () => {
    const a = await newAccount("A");
    const doc = await draft(a.organizationId);
    const frozen = await freezeDocument(a.organizationId, null, doc.id, appDb);
    const bytes = await getStorage().get(frozen.fileKey!);
    expect(bytes).not.toBeNull();
    expect(Buffer.from(bytes!.slice(0, 5)).toString()).toBe("%PDF-");
    expect(sha256(bytes!)).toBe(frozen.sha256);
  });

  it("une correction crée une nouvelle version et conserve l'ancienne", async () => {
    const a = await newAccount("A");
    const doc = await draft(a.organizationId);
    const v1 = await freezeDocument(a.organizationId, null, doc.id, appDb);
    const v2 = await createNewVersion(a.organizationId, null, doc.id, appDb);
    expect(v2).toMatchObject({ version: 2, status: "draft", previousVersionId: v1.id });
    const rows = await withOrg(a.organizationId, (tx) => tx.select().from(documents), appDb);
    expect(rows.find((r) => r.id === v1.id)).toMatchObject({ status: "frozen", sha256: v1.sha256 });
  });

  it("figer crée une preuve rangée sous les indicateurs du type de document", async () => {
    const a = await newAccount("A");
    const before = await indicatorBoard(a.organizationId, appDb);
    expect(before.rows.find((r) => r.number === 9)?.status).toBe("at_risk");
    const doc = await draft(a.organizationId, "livret_accueil");
    await freezeDocument(a.organizationId, null, doc.id, appDb);
    const after = await indicatorBoard(a.organizationId, appDb);
    expect(after.rows.find((r) => r.number === 9)?.status).toBe("covered");
    expect(after.rows.find((r) => r.number === 12)?.status).toBe("covered");
    expect(after.covered).toBe(before.covered + 2);
  });
});

describe("RG-03 – aucune preuve antidatée", () => {
  it("la date d'une preuve générée est imposée par la base", async () => {
    const a = await newAccount("A");
    const past = new Date("2020-01-01T00:00:00Z");
    const [row] = await withOrg(
      a.organizationId,
      (tx) =>
        tx
          .insert(evidence)
          .values({ organizationId: a.organizationId, source: "event", title: "x", occurredAt: past, recordedAt: past, declaredDate: "2020-01-01" })
          .returning(),
      appDb,
    );
    expect(Date.now() - row.occurredAt.getTime()).toBeLessThan(60_000);
    expect(row.declaredDate).toBeNull();
  });

  it("une preuve manuelle porte sa date de dépôt et la date déclarée", async () => {
    const a = await newAccount("A");
    const row = await withOrg(
      a.organizationId,
      (tx) => recordEvidence(tx, { organizationId: a.organizationId, source: "manual", title: "Attestation", indicators: [22], declaredDate: "2026-03-01" }),
      appDb,
    );
    expect(row.declaredDate).toBe("2026-03-01");
    expect(Date.now() - row.recordedAt.getTime()).toBeLessThan(60_000);
  });

  it("une preuve manuelle sans date déclarée ou datée dans le futur est refusée", async () => {
    const a = await newAccount("A");
    const add = (declaredDate: string | null) =>
      withOrg(a.organizationId, (tx) => recordEvidence(tx, { organizationId: a.organizationId, source: "manual", title: "x", indicators: [], declaredDate }), appDb);
    await expect(add(null)).rejects.toThrow();
    await expect(add("2999-01-01")).rejects.toThrow();
  });

  it("une preuve ne se modifie ni ne se supprime", async () => {
    const a = await newAccount("A");
    const row = await withOrg(a.organizationId, (tx) => recordEvidence(tx, { organizationId: a.organizationId, source: "event", title: "x", indicators: [9] }), appDb);
    await expect(adminSql`update evidence set title = 'y' where id = ${row.id}`).rejects.toThrow(/ajout seul/);
    await expect(adminSql`delete from evidence where id = ${row.id}`).rejects.toThrow(/ajout seul/);
  });
});

describe("liens sécurisés et signature", () => {
  async function linkFor(orgId: string, documentId: string, validDays = 30) {
    return withOrg(orgId, (tx) => createAccessLink(tx, {
      organizationId: orgId, purpose: "sign_document", subjectType: "document", subjectId: documentId,
      recipientName: "Léa Martin", recipientEmail: "lea@exemple.test", validDays,
    }), appDb);
  }

  it("résout un lien valide, refuse un mauvais usage, un lien expiré ou révoqué", async () => {
    const a = await newAccount("A");
    const doc = await draft(a.organizationId);
    const { token } = await linkFor(a.organizationId, doc.id);
    expect(await resolveAccessLink(token, "sign_document", appDb)).toMatchObject({ organizationId: a.organizationId, subjectId: doc.id });
    expect(await resolveAccessLink(token, "trainee_space", appDb)).toBeNull();
    expect(await resolveAccessLink("x".repeat(43), "sign_document", appDb)).toBeNull();

    const expired = await linkFor(a.organizationId, doc.id, -1);
    expect(await resolveAccessLink(expired.token, "sign_document", appDb)).toBeNull();

    const revoked = await linkFor(a.organizationId, doc.id);
    await revokeAccessLink(a.organizationId, hashLinkToken(revoked.token), appDb);
    expect(await resolveAccessLink(revoked.token, "sign_document", appDb)).toBeNull();
    expect(await resolveAccessLink(token, "sign_document", appDb)).not.toBeNull();
  });

  it("le jeton n'est pas stocké en clair et la table reste cloisonnée", async () => {
    const a = await newAccount("A");
    const b = await newAccount("B");
    const doc = await draft(a.organizationId);
    const { token } = await linkFor(a.organizationId, doc.id);
    const all = await adminSql`select token_hash from access_links`;
    expect(all.some((r) => r.token_hash === token)).toBe(false);
    const seenByB = await withOrg(b.organizationId, (tx) => tx.select().from(accessLinks), appDb);
    expect(seenByB).toEqual([]);
  });

  it("signer fige le document et conserve le dossier de preuve", async () => {
    const a = await newAccount("A");
    const doc = await draft(a.organizationId);
    const { signature, document } = await signDocument(a.organizationId, {
      documentId: doc.id, signerName: "Léa Martin", signerEmail: "lea@exemple.test", signerRole: "stagiaire",
      ip: "203.0.113.7", userAgent: "Vitest",
    }, appDb);
    expect(document.status).toBe("frozen");
    expect(signature).toMatchObject({ documentSha256: document.sha256, ip: "203.0.113.7", signerName: "Léa Martin" });
    expect(signature.consentText.length).toBeGreaterThan(20);

    await expect(signDocument(a.organizationId, {
      documentId: doc.id, signerName: "Léa Martin", signerEmail: "lea@exemple.test", signerRole: "stagiaire",
    }, appDb)).rejects.toBeInstanceOf(AlreadySignedError);

    await expect(adminSql`update signatures set signer_name = 'x' where id = ${signature.id}`).rejects.toThrow(/ajout seul/);
  });

  it("la date de signature est imposée par la base", async () => {
    const a = await newAccount("A");
    const doc = await draft(a.organizationId);
    await freezeDocument(a.organizationId, null, doc.id, appDb);
    const [d] = await withOrg(a.organizationId, (tx) => tx.select().from(documents).where(eq(documents.id, doc.id)), appDb);
    const [row] = await withOrg(a.organizationId, (tx) => tx.execute<{ signed_at: Date }>(sql`
      insert into signatures (organization_id, document_id, signer_name, signer_role, document_sha256, consent_text, signed_at)
      values (${a.organizationId}, ${doc.id}, 'X', 'stagiaire', ${d.sha256}, 'ok', '2020-01-01') returning signed_at`), appDb);
    expect(new Date(row.signed_at).getFullYear()).toBeGreaterThan(2020);
  });
});
