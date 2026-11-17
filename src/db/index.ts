import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "./schema";

export type Db = ReturnType<typeof createDb>;
export type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];

export function createDb(url: string) {
  const client = postgres(url, { max: 10 });
  return drizzle(client, { schema });
}

const globalForDb = globalThis as unknown as { db?: Db };

/** Connexion partagée (rôle applicatif, soumis à la RLS). */
export function getDb(): Db {
  if (!globalForDb.db) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL manquant");
    globalForDb.db = createDb(url);
  }
  return globalForDb.db;
}

/**
 * Exécute `fn` dans une transaction limitée aux données d'un organisme.
 * C'est le SEUL point d'accès aux tables métier : sans lui, la RLS ne renvoie
 * aucune ligne et refuse toute écriture.
 */
export async function withOrg<T>(
  orgId: string,
  fn: (tx: Tx) => Promise<T>,
  db: Db = getDb(),
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('app.org_id', ${orgId}, true)`);
    return fn(tx);
  });
}

export { schema };
