/**
 * ACC-01 – Inscription et connexion (logique pure, sans cookies Next.js,
 * pour pouvoir être testée directement).
 *
 * À venir : lien de connexion par e-mail, double authentification,
 * limitation du nombre de tentatives.
 */
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { and, eq, gt, sql } from "drizzle-orm";
import { hash, verify } from "@node-rs/argon2";
import type { Db } from "@/db";
import { authSessions, organizations, users } from "@/db/schema";
import { logAction } from "./audit";

export const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

// Empreinte factice pour garder un temps de réponse constant si l'e-mail est inconnu.
let dummyHash: string | null = null;

export class EmailTakenError extends Error {}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function createSession(db: Db, userId: string, organizationId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await db.insert(authSessions).values({
    tokenHash: hashToken(token),
    userId,
    organizationId,
    expiresAt,
  });
  return { token, expiresAt };
}

export async function signup(
  db: Db,
  input: { fullName: string; legalName: string; email: string; password: string },
) {
  const email = input.email.trim().toLowerCase();
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(sql`lower(${users.email}) = ${email}`);
  if (existing.length) throw new EmailTakenError();

  const passwordHash = await hash(input.password);
  const orgId = randomUUID();

  const userId = await db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('app.org_id', ${orgId}, true)`);
    await tx.insert(organizations).values({ id: orgId, legalName: input.legalName });
    const [user] = await tx
      .insert(users)
      .values({ organizationId: orgId, email, passwordHash, fullName: input.fullName })
      .returning({ id: users.id });
    await logAction(tx, {
      organizationId: orgId,
      actorUserId: user.id,
      action: "account.created",
      entity: "organization",
      entityId: orgId,
    });
    return user.id;
  });

  return { userId, organizationId: orgId, ...(await createSession(db, userId, orgId)) };
}

export async function login(db: Db, input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const [user] = await db
    .select()
    .from(users)
    .where(sql`lower(${users.email}) = ${email}`);

  if (!user) {
    dummyHash ??= await hash("mot-de-passe-factice");
    await verify(dummyHash, input.password);
    return null;
  }
  if (!(await verify(user.passwordHash, input.password))) return null;

  return {
    userId: user.id,
    organizationId: user.organizationId,
    ...(await createSession(db, user.id, user.organizationId)),
  };
}

export async function getSessionUser(db: Db, token: string) {
  const [row] = await db
    .select({
      userId: users.id,
      organizationId: users.organizationId,
      email: users.email,
      fullName: users.fullName,
    })
    .from(authSessions)
    .innerJoin(users, eq(users.id, authSessions.userId))
    .where(and(eq(authSessions.tokenHash, hashToken(token)), gt(authSessions.expiresAt, new Date())));
  return row ?? null;
}

export async function logout(db: Db, token: string) {
  await db.delete(authSessions).where(eq(authSessions.tokenHash, hashToken(token)));
}

export type SessionUser = NonNullable<Awaited<ReturnType<typeof getSessionUser>>>;
