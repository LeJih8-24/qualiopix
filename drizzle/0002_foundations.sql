CREATE TYPE "public"."document_status" AS ENUM('draft', 'frozen');--> statement-breakpoint
CREATE TYPE "public"."evidence_source" AS ENUM('document', 'signature', 'event', 'manual');--> statement-breakpoint
CREATE TYPE "public"."indicator_applicability" AS ENUM('all', 'certifying', 'apprenticeship', 'skills_assessment_vae');--> statement-breakpoint
CREATE TYPE "public"."referent_role" AS ENUM('handicap', 'violences', 'suppleant_externe');--> statement-breakpoint
CREATE TABLE "access_links" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"purpose" text NOT NULL,
	"subject_type" text NOT NULL,
	"subject_id" uuid NOT NULL,
	"recipient_name" text,
	"recipient_email" text,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"last_used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"title" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"status" "document_status" DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"previous_version_id" uuid,
	"file_key" text,
	"sha256" text,
	"frozen_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_outbox" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"template_key" text NOT NULL,
	"to_email" text NOT NULL,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"provider" text NOT NULL,
	"provider_message_id" text,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sent_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "email_templates" (
	"organization_id" uuid NOT NULL,
	"key" text NOT NULL,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "email_templates_organization_id_key_pk" PRIMARY KEY("organization_id","key")
);
--> statement-breakpoint
CREATE TABLE "evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"source" "evidence_source" NOT NULL,
	"source_id" text,
	"title" text NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"declared_date" date,
	"file_key" text,
	"sha256" text
);
--> statement-breakpoint
CREATE TABLE "evidence_indicators" (
	"evidence_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"indicator_number" integer NOT NULL,
	CONSTRAINT "evidence_indicators_evidence_id_indicator_number_pk" PRIMARY KEY("evidence_id","indicator_number")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"title" text NOT NULL,
	"body" text,
	"link" text,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "qualiopi_indicators" (
	"number" integer PRIMARY KEY NOT NULL,
	"criterion" integer NOT NULL,
	"title" text NOT NULL,
	"applicability" "indicator_applicability" DEFAULT 'all' NOT NULL,
	"out_of_product_scope" boolean DEFAULT false NOT NULL,
	"guidance" text
);
--> statement-breakpoint
CREATE TABLE "referents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"role" "referent_role" NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "signatures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"document_id" uuid NOT NULL,
	"signer_name" text NOT NULL,
	"signer_email" text,
	"signer_role" text NOT NULL,
	"document_sha256" text NOT NULL,
	"consent_text" text NOT NULL,
	"ip" text,
	"user_agent" text,
	"signed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "offers_certifying" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "access_links" ADD CONSTRAINT "access_links_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_outbox" ADD CONSTRAINT "email_outbox_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_templates" ADD CONSTRAINT "email_templates_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_indicators" ADD CONSTRAINT "evidence_indicators_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_indicators" ADD CONSTRAINT "evidence_indicators_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_indicators" ADD CONSTRAINT "evidence_indicators_indicator_number_qualiopi_indicators_number_fk" FOREIGN KEY ("indicator_number") REFERENCES "public"."qualiopi_indicators"("number") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referents" ADD CONSTRAINT "referents_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signatures" ADD CONSTRAINT "signatures_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signatures" ADD CONSTRAINT "signatures_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "referents_one_per_role" ON "referents" USING btree ("organization_id","role");