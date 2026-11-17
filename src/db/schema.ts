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
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
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
  /** Propose des formations certifiantes (RNCP / RS) : rend applicables les indicateurs dédiés. */
  offersCertifying: boolean("offers_certifying").notNull().default(false),
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

// ---------------------------------------------------------------------------
// Jalon 1 – Briques transverses
// ---------------------------------------------------------------------------

export const documentStatus = pgEnum("document_status", ["draft", "frozen"]);

/**
 * RG-02 – Document : brouillon modifiable, puis figé (PDF, empreinte,
 * horodatage). Un document figé ne change plus (déclencheur) ; une correction
 * crée une nouvelle version qui pointe vers la précédente.
 */
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  /** Type : reglement_interieur, livret_accueil, cgv, politique_violences, convention… */
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  /** Texte source (Markdown simple : titres « # », paragraphes, listes « - »). */
  body: text("body").notNull().default(""),
  status: documentStatus("status").notNull().default("draft"),
  version: integer("version").notNull().default(1),
  previousVersionId: uuid("previous_version_id"),
  /** Clé du PDF figé dans le stockage. */
  fileKey: text("file_key"),
  sha256: text("sha256"),
  frozenAt: timestamp("frozen_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Liens sécurisés pour les personnes sans compte (stagiaire, client, donneur
 * d'ordre). Le jeton en clair n'est jamais stocké. Résolution avant de
 * connaître l'organisme via la fonction SQL resolve_access_link().
 */
export const accessLinks = pgTable("access_links", {
  tokenHash: text("token_hash").primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  /** sign_document, trainee_space, needs_questionnaire… */
  purpose: text("purpose").notNull(),
  subjectType: text("subject_type").notNull(),
  subjectId: uuid("subject_id").notNull(),
  recipientName: text("recipient_name"),
  recipientEmail: text("recipient_email"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Signature électronique simple (eIDAS) et son dossier de preuve. Non modifiable. */
export const signatures = pgTable("signatures", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "restrict" }),
  signerName: text("signer_name").notNull(),
  signerEmail: text("signer_email"),
  signerRole: text("signer_role").notNull(),
  /** Empreinte du document au moment de la signature. */
  documentSha256: text("document_sha256").notNull(),
  consentText: text("consent_text").notNull(),
  ip: text("ip"),
  userAgent: text("user_agent"),
  signedAt: timestamp("signed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const indicatorApplicability = pgEnum("indicator_applicability", [
  "all",
  "certifying",
  "apprenticeship",
  "skills_assessment_vae",
]);

/** QUA-01 – Référentiel Qualiopi, commun à tous les organismes, modifiable sans redéveloppement. */
export const qualiopiIndicators = pgTable("qualiopi_indicators", {
  number: integer("number").primaryKey(),
  criterion: integer("criterion").notNull(),
  title: text("title").notNull(),
  applicability: indicatorApplicability("applicability").notNull().default("all"),
  /** Hors du périmètre du produit (CFA, AFEST…) : toujours « non applicable ». */
  outOfProductScope: boolean("out_of_product_scope").notNull().default(false),
  guidance: text("guidance"),
});

export const evidenceSource = pgEnum("evidence_source", [
  "document",
  "signature",
  "event",
  "manual",
]);

/**
 * QUA-02 / RG-03 – Preuve. Pour une preuve générée par l'outil, la date est
 * celle de l'enregistrement (imposée par la base). Une preuve manuelle porte sa
 * date de dépôt et la date déclarée. Non modifiable.
 */
export const evidence = pgTable("evidence", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  source: evidenceSource("source").notNull(),
  sourceId: text("source_id"),
  title: text("title").notNull(),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
  declaredDate: date("declared_date"),
  fileKey: text("file_key"),
  sha256: text("sha256"),
});

export const evidenceIndicators = pgTable(
  "evidence_indicators",
  {
    evidenceId: uuid("evidence_id")
      .notNull()
      .references(() => evidence.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    indicatorNumber: integer("indicator_number")
      .notNull()
      .references(() => qualiopiIndicators.number),
  },
  (t) => [primaryKey({ columns: [t.evidenceId, t.indicatorNumber] })],
);

/** NOT-01 – Notifications dans l'application. */
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  link: text("link"),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** NOT-02 – Textes d'e-mails personnalisés (remplacent les modèles par défaut). */
export const emailTemplates = pgTable(
  "email_templates",
  {
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    subject: text("subject").notNull(),
    body: text("body").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.organizationId, t.key] })],
);

/** Trace de chaque e-mail envoyé (preuve d'envoi, ind. 9). */
export const emailOutbox = pgTable("email_outbox", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  templateKey: text("template_key").notNull(),
  toEmail: text("to_email").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  provider: text("provider").notNull(),
  providerMessageId: text("provider_message_id"),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  sentAt: timestamp("sent_at", { withTimezone: true }),
});

export const referentRole = pgEnum("referent_role", [
  "handicap",
  "violences",
  "suppleant_externe",
]);

/** ACC-08 – Référents (handicap, violences et harcèlement, suppléant extérieur). */
export const referents = pgTable(
  "referents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    role: referentRole("role").notNull(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("referents_one_per_role").on(t.organizationId, t.role)],
);

export type Organization = typeof organizations.$inferSelect;
export type User = typeof users.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type Evidence = typeof evidence.$inferSelect;
export type QualiopiIndicator = typeof qualiopiIndicators.$inferSelect;
