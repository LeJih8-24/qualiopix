import "dotenv/config";
import postgres from "postgres";
import { runMigrations } from "../../scripts/migrate";

/** Repart d'une base de test vide et migrée à chaque lancement. */
export default async function setup() {
  const url = process.env.TEST_DATABASE_ADMIN_URL;
  if (!url) throw new Error("TEST_DATABASE_ADMIN_URL manquant (voir .env.example)");
  const admin = postgres(url, { max: 1, onnotice: () => {} });
  await admin.unsafe(
    "drop schema if exists public cascade; create schema public; drop schema if exists drizzle cascade;",
  );
  await admin.end();
  await runMigrations(url);
}
