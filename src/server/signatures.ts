/**
 * Signature électronique simple (règlement eIDAS) avec dossier de preuve :
 * identité déclarée, consentement, horodatage (base), adresse IP, navigateur,
 * empreinte du PDF signé.
 */
import { and, eq } from "drizzle-orm";
import { withOrg, type Db } from "@/db";
import { documents, signatures } from "@/db/schema";
import { fr } from "@/i18n/fr";
import { logAction } from "./audit";
import { freezeInTx } from "./documents";
import { recordEvidence } from "./evidence";

export class AlreadySignedError extends Error {}

export const SIGNATURE_CONSENT = fr.signature.consent;

/** Indicateurs prouvés par la signature d'un type de document. */
export const SIGNATURE_INDICATORS: Record<string, number[]> = {
  reglement_interieur: [9],
  livret_accueil: [9],
};

export async function signDocument(
  orgId: string,
  input: {
    documentId: string;
    signerName: string;
    signerEmail?: string | null;
    signerRole: string;
    ip?: string | null;
    userAgent?: string | null;
  },
  db?: Db,
) {
  return withOrg(
    orgId,
    async (tx) => {
      // Signer fige le document : la signature porte sur une version immuable.
      const doc = await freezeInTx(tx, orgId, null, input.documentId);

      if (input.signerEmail) {
        const existing = await tx
          .select({ id: signatures.id })
          .from(signatures)
          .where(and(eq(signatures.documentId, doc.id), eq(signatures.signerEmail, input.signerEmail)));
        if (existing.length) throw new AlreadySignedError();
      }

      const [sig] = await tx
        .insert(signatures)
        .values({
          organizationId: orgId,
          documentId: doc.id,
          signerName: input.signerName,
          signerEmail: input.signerEmail ?? null,
          signerRole: input.signerRole,
          documentSha256: doc.sha256!,
          consentText: SIGNATURE_CONSENT,
          ip: input.ip ?? null,
          userAgent: input.userAgent?.slice(0, 500) ?? null,
        })
        .returning();

      await recordEvidence(tx, {
        organizationId: orgId,
        source: "signature",
        sourceId: sig.id,
        title: `Signature de « ${doc.title} » par ${input.signerName}`,
        indicators: SIGNATURE_INDICATORS[doc.kind] ?? [],
        fileKey: doc.fileKey,
        sha256: doc.sha256,
      });
      await logAction(tx, {
        organizationId: orgId, actorUserId: null, action: "document.signed", entity: "document", entityId: doc.id,
        data: { signatureId: sig.id, signerRole: input.signerRole },
      });
      return { signature: sig, document: doc };
    },
    db,
  );
}

export async function listSignatures(orgId: string, documentId: string, db?: Db) {
  return withOrg(
    orgId,
    (tx) => tx.select().from(signatures).where(eq(signatures.documentId, documentId)).orderBy(signatures.signedAt),
    db,
  );
}

export async function getDocumentForSigning(orgId: string, documentId: string, db?: Db) {
  return withOrg(
    orgId,
    async (tx) => (await tx.select().from(documents).where(eq(documents.id, documentId)))[0] ?? null,
    db,
  );
}
