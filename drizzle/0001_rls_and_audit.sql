-- Cloisonnement des données entre organismes (exigence « Cloisonnement »)
-- et journal des actions non modifiable (« Intégrité des preuves »).
--
-- L'application se connecte avec le rôle qualiopix_app, non propriétaire des
-- tables : la RLS s'applique donc toujours à elle. Chaque requête métier passe
-- par withOrg() (src/db/index.ts) qui fixe app.org_id pour la transaction.

CREATE OR REPLACE FUNCTION app_current_org() RETURNS uuid
LANGUAGE sql STABLE AS $$
  SELECT nullif(current_setting('app.org_id', true), '')::uuid
$$;
--> statement-breakpoint

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY org_isolation ON organizations
  USING (id = app_current_org())
  WITH CHECK (id = app_current_org());
--> statement-breakpoint

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY org_isolation ON audit_log
  USING (organization_id = app_current_org())
  WITH CHECK (organization_id = app_current_org());
--> statement-breakpoint

-- Journal : aucune modification ni suppression, même par le propriétaire.
CREATE OR REPLACE FUNCTION audit_log_immutable() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit_log est en ajout seul (% interdit)', TG_OP;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER audit_log_no_update_delete
  BEFORE UPDATE OR DELETE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION audit_log_immutable();
--> statement-breakpoint

-- Droits du rôle applicatif.
GRANT USAGE ON SCHEMA public TO qualiopix_app;
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO qualiopix_app;
--> statement-breakpoint
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO qualiopix_app;
--> statement-breakpoint
REVOKE UPDATE, DELETE ON audit_log FROM qualiopix_app;
--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO qualiopix_app;
--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO qualiopix_app;
