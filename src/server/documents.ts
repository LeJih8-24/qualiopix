/**
 * RG-02 – Documents : brouillon → figé (PDF + empreinte + horodatage) →
 * nouvelle version en cas de correction. La base refuse toute modification
 * d'un document figé.
 */
import { createHash } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { withOrg, type Db, type Tx } from "@/db";
import { documents, organizations } from "@/db/schema";
import { logAction } from "./audit";
import { recordEvidence } from "./evidence";
import { getStorage } from "./integrations/storage";
import { renderDocumentPdf } from "./pdf";

export class DocumentFrozenError extends Error {}

export function sha256(bytes: Uint8Array) {
  return createHash("sha256").update(bytes).digest("hex");
}

/** Indicateurs prouvés par chaque type de document une fois figé. */
export const DOCUMENT_INDICATORS: Record<string, number[]> = {
  reglement_interieur: [9],
  livret_accueil: [9, 12],
  cgv: [1],
  politique_violences: [12],
};

export async function createDraft(
  orgId: string,
  actorUserId: string | null,
  input: { kind: string; title: string; body: string },
  db?: Db,
) {
  return withOrg(
    orgId,
    async (tx) => {
      const [doc] = await tx
        .insert(documents)
        .values({ organizationId: orgId, ...input })
        .returning();
      await logAction(tx, {
        organizationId: orgId, actorUserId, action: "document.created", entity: "document", entityId: doc.id,
      });
      return doc;
    },
    db,
  );
}

export async function updateDraft(
  orgId: string,
  actorUserId: string | null,
  documentId: string,
  input: { title: string; body: string },
  db?: Db,
) {
  return withOrg(
    orgId,
    async (tx) => {
      const doc = await getForUpdate(tx, documentId);
      if (doc.status === "frozen") throw new DocumentFrozenError();
      const [after] = await tx
        .update(documents)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(documents.id, documentId))
        .returning();
      await logAction(tx, {
        organizationId: orgId, actorUserId, action: "document.updated", entity: "document", entityId: documentId,
      });
      return after;
    },
    db,
  );
}

/**
 * Fige un document : rend le PDF, le stocke, calcule l'empreinte et crée la
 * preuve correspondante. À appeler à l'envoi ou à la publication.
 */
export async function freezeDocument(
  orgId: string,
  actorUserId: string | null,
  documentId: string,
  db?: Db,
) {
  return withOrg(orgId, (tx) => freezeInTx(tx, orgId, actorUserId, documentId), db);
}

export async function freezeInTx(tx: Tx, orgId: string, actorUserId: string | null, documentId: string) {
  const doc = await getForUpdate(tx, documentId);
  if (doc.status === "frozen") return doc;
  const [org] = await tx.select().from(organizations).where(eq(organizations.id, orgId));

  const pdf = await renderDocumentPdf({
    title: doc.title,
    body: doc.body,
    version: doc.version,
    organization: org,
  });
  const hash = sha256(pdf);
  const fileKey = `${orgId}/documents/${doc.id}/v${doc.version}-${hash.slice(0, 12)}.pdf`;
  await getStorage().put(fileKey, pdf, "application/pdf");

  const [frozen] = await tx
    .update(documents)
    .set({ status: "frozen", fileKey, sha256: hash, updatedAt: new Date() })
    .where(eq(documents.id, documentId))
    .returning();

  await recordEvidence(tx, {
    organizationId: orgId,
    source: "document",
    sourceId: doc.id,
    title: `${doc.title} (version ${doc.version})`,
    indicators: DOCUMENT_INDICATORS[doc.kind] ?? [],
    fileKey,
    sha256: hash,
  });
  await logAction(tx, {
    organizationId: orgId, actorUserId, action: "document.frozen", entity: "document", entityId: doc.id,
    data: { sha256: hash, version: doc.version },
  });
  return frozen;
}

/** Correction d'un document figé : nouvelle version en brouillon, l'ancienne est conservée. */
export async function createNewVersion(
  orgId: string,
  actorUserId: string | null,
  documentId: string,
  db?: Db,
) {
  return withOrg(
    orgId,
    async (tx) => {
      const doc = await getForUpdate(tx, documentId);
      if (doc.status !== "frozen") return doc;
      const [next] = await tx
        .insert(documents)
        .values({
          organizationId: orgId,
          kind: doc.kind,
          title: doc.title,
          body: doc.body,
          version: doc.version + 1,
          previousVersionId: doc.id,
        })
        .returning();
      await logAction(tx, {
        organizationId: orgId, actorUserId, action: "document.versioned", entity: "document", entityId: next.id,
        data: { previous: doc.id },
      });
      return next;
    },
    db,
  );
}

async function getForUpdate(tx: Tx, documentId: string) {
  const [doc] = await tx.select().from(documents).where(eq(documents.id, documentId)).for("update");
  if (!doc) throw new Error("Document introuvable");
  return doc;
}

export async function getDocument(orgId: string, documentId: string, db?: Db) {
  return withOrg(
    orgId,
    async (tx) => (await tx.select().from(documents).where(eq(documents.id, documentId)))[0] ?? null,
    db,
  );
}

/** Dernière version de chaque type de document demandé. */
export async function latestByKind(orgId: string, kinds: string[], db?: Db) {
  return withOrg(
    orgId,
    async (tx) => {
      const out: Record<string, typeof documents.$inferSelect | undefined> = {};
      for (const kind of kinds) {
        const [d] = await tx
          .select()
          .from(documents)
          .where(and(eq(documents.organizationId, orgId), eq(documents.kind, kind)))
          .orderBy(desc(documents.version))
          .limit(1);
        out[kind] = d;
      }
      return out;
    },
    db,
  );
}

export async function versionHistory(orgId: string, kind: string, db?: Db) {
  return withOrg(
    orgId,
    (tx) =>
      tx.select().from(documents).where(eq(documents.kind, kind)).orderBy(desc(documents.version)),
    db,
  );
}
