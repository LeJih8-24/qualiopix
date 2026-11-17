import "dotenv/config";
import { randomUUID } from "node:crypto";
import postgres from "postgres";
import { createDb } from "@/db";
import { signup } from "@/server/auth-core";

/** Connexion avec le rôle applicatif (RLS active), comme en production. */
export const appDb = createDb(process.env.TEST_DATABASE_URL!);

/** Connexion propriétaire, pour inspecter le catalogue PostgreSQL. */
export const adminSql = postgres(process.env.TEST_DATABASE_ADMIN_URL!, { max: 1, onnotice: () => {} });

export async function newAccount(label = "Organisme") {
  return signup(appDb, {
    fullName: `Formateur ${label}`,
    legalName: `${label} Formation`,
    email: `${randomUUID()}@exemple.test`,
    password: "un-mot-de-passe-solide",
  });
}
