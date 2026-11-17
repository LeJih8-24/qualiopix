/**
 * Liens sécurisés à durée limitée pour les personnes sans compte.
 * Le jeton n'existe en clair que dans l'URL envoyée ; la base n'en garde
 * que l'empreinte.
 */
import { createHash, randomBytes } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { withOrg, type Db, getDb, type Tx } from "@/db";
import { accessLinks } from "@/db/schema";

export const DEFAULT_LINK_DAYS = 30;

export function hashLinkToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createAccessLink(
  tx: Tx,
  input: {
    organizationId: string;
    purpose: string;
    subjectType: string;
    subjectId: string;
    recipientName?: string | null;
    recipientEmail?: string | null;
    validDays?: number;
  },
) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + (input.validDays ?? DEFAULT_LINK_DAYS) * 86_400_000);
  await tx.insert(accessLinks).values({
    tokenHash: hashLinkToken(token),
    organizationId: input.organizationId,
    purpose: input.purpose,
    subjectType: input.subjectType,
    subjectId: input.subjectId,
    recipientName: input.recipientName ?? null,
    recipientEmail: input.recipientEmail ?? null,
    expiresAt,
  });
  return { token, expiresAt };
}

export type ResolvedLink = {
  organizationId: string;
  purpose: string;
  subjectType: string;
  subjectId: string;
  recipientName: string | null;
  recipientEmail: string | null;
  tokenHash: string;
};

/** Résout un jeton valide (non expiré, non révoqué), sinon null. */
export async function resolveAccessLink(
  token: string,
  expectedPurpose: string,
  db: Db = getDb(),
): Promise<ResolvedLink | null> {
  if (!/^[A-Za-z0-9_-]{20,100}$/.test(token)) return null;
  const tokenHash = hashLinkToken(token);
  const rows = await db.execute<{
    organization_id: string; purpose: string; subject_type: string; subject_id: string;
    recipient_name: string | null; recipient_email: string | null;
  }>(sql`select * from resolve_access_link(${tokenHash})`);
  const r = rows[0];
  if (!r || r.purpose !== expectedPurpose) return null;
  await withOrg(
    r.organization_id,
    (tx) => tx.update(accessLinks).set({ lastUsedAt: new Date() }).where(eq(accessLinks.tokenHash, tokenHash)),
    db,
  );
  return {
    organizationId: r.organization_id,
    purpose: r.purpose,
    subjectType: r.subject_type,
    subjectId: r.subject_id,
    recipientName: r.recipient_name,
    recipientEmail: r.recipient_email,
    tokenHash,
  };
}

export async function revokeAccessLink(orgId: string, tokenHash: string, db?: Db) {
  await withOrg(
    orgId,
    (tx) => tx.update(accessLinks).set({ revokedAt: new Date() }).where(eq(accessLinks.tokenHash, tokenHash)),
    db,
  );
}
