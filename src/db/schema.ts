/**
 * Schéma de la base de données.
 *
 * Règle de cloisonnement (cahier des charges, « Modèle de données ») :
 * toute table métier porte `organization_id` et active la sécurité au niveau
 * des lignes (RLS) dans la migration `0001_rls_and_audit.sql`.
 * Le test `tests/integration/isolation.test.ts` échoue si une table portant
 * `organization_id` n'a pas la RLS activée.
 *
 * Exceptions volontaires, lues avant que l'organisme soit connu :
 * `users` et `auth_sessions` (connexion). Elles ne sont accessibles que via
 * `src/server/auth.ts`.
 */
import { sql } from "drizzle-orm";
import {
  bigserial,
  date,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const vatRegime = pgEnum("vat_regime", ["exoneration", "franchise"]);
export const plan = pgEnum("plan", ["decouverte", "solo", "solo_qualiopi"]);

/** ACC-02 – Profil de l'organisme. */
export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  legalName: text("legal_name").notNull(),
  siret: text("siret"),
  /** Numéro de déclaration d'activité (11 chiffres). */
  nda: text("nda"),
  qualiopiCertNumber: text("qualiopi_cert_number"),
  qualiopiCertValidFrom: date("qualiopi_cert_valid_from"),
  qualiopiCertValidUntil: date("qualiopi_cert_valid_until"),
  vatRegime: vatRegime("vat_regime"),
  address: text("address"),
  postalCode: text("postal_code"),
  city: text("city"),
  phone: text("phone"),
  contactEmail: text("contact_email"),
  logoUrl: text("logo_url"),
  legalMentions: text("legal_mentions"),
  plan: plan("plan").notNull().default("decouverte"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** ACC-01 – Le formateur titulaire : un seul compte par organisme (cible solo). */
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    fullName: text("full_name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("users_email_unique").on(sql`lower(${t.email})`),
    uniqueIndex("users_one_per_org").on(t.organizationId),
  ],
);

/** Sessions de connexion (à ne pas confondre avec les sessions de formation). */
export const authSessions = pgTable("auth_sessions", {
  /** Empreinte SHA-256 du jeton ; le jeton en clair n'est que dans le cookie. */
  tokenHash: text("token_hash").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Journal des actions (qui, quoi, quand), sans possibilité de modification
 * ni de suppression : un déclencheur l'interdit (migration 0001).
 */
export const auditLog = pgTable("audit_log", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "restrict" }),
  actorUserId: uuid("actor_user_id"),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  data: jsonb("data"),
  at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
});

export type Organization = typeof organizations.$inferSelect;
export type User = typeof users.$inferSelect;
