/**
 * Applique les migrations avec la connexion propriétaire.
 * Usage : npm run db:migrate            (base de développement)
 *         npm run db:migrate -- --test  (base de test)
 */
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

export async function runMigrations(url: string) {
  const client = postgres(url, { max: 1, onnotice: () => {} });
  try {
    await migrate(drizzle(client), { migrationsFolder: "./drizzle" });
  } finally {
    await client.end();
  }
}

const isMain = process.argv[1]?.endsWith("migrate.ts");
if (isMain) {
  const test = process.argv.includes("--test");
  const url = test ? process.env.TEST_DATABASE_ADMIN_URL : process.env.DATABASE_ADMIN_URL;
  if (!url) throw new Error("URL d'administration de la base manquante");
  runMigrations(url)
    .then(() => console.log(`Migrations appliquées (${test ? "test" : "dev"}).`))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
