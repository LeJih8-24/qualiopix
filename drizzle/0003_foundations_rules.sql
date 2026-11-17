-- Jalon 1 : cloisonnement des nouvelles tables, objets figés (RG-02),
-- dates de preuve non antidatables (RG-03), liens sécurisés, référentiel Qualiopi.

-- 1. Cloisonnement -----------------------------------------------------------
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['documents','access_links','signatures','evidence',
    'evidence_indicators','notifications','email_templates','email_outbox','referents']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY org_isolation ON %I USING (organization_id = app_current_org())
                    WITH CHECK (organization_id = app_current_org())', t);
  END LOOP;
END $$;
--> statement-breakpoint

-- 2. Objets non modifiables ---------------------------------------------------
CREATE OR REPLACE FUNCTION forbid_update_delete() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION '% est en ajout seul (% interdit)', TG_TABLE_NAME, TG_OP;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER signatures_immutable BEFORE UPDATE OR DELETE ON signatures
  FOR EACH ROW EXECUTE FUNCTION forbid_update_delete();
--> statement-breakpoint
CREATE TRIGGER evidence_immutable BEFORE UPDATE OR DELETE ON evidence
  FOR EACH ROW EXECUTE FUNCTION forbid_update_delete();
--> statement-breakpoint
CREATE TRIGGER evidence_indicators_immutable BEFORE UPDATE OR DELETE ON evidence_indicators
  FOR EACH ROW EXECUTE FUNCTION forbid_update_delete();
--> statement-breakpoint
REVOKE UPDATE, DELETE ON signatures, evidence, evidence_indicators FROM qualiopix_app;
--> statement-breakpoint

-- 3. RG-02 : un document figé ne change plus ----------------------------------
CREATE OR REPLACE FUNCTION documents_guard() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.status = 'frozen' THEN
      RAISE EXCEPTION 'document figé : suppression interdite (RG-02)';
    END IF;
    RETURN OLD;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'frozen' THEN
    RAISE EXCEPTION 'document figé : modification interdite, créer une nouvelle version (RG-02)';
  END IF;
  IF NEW.status = 'frozen' THEN
    IF NEW.file_key IS NULL OR NEW.sha256 IS NULL THEN
      RAISE EXCEPTION 'un document figé exige un fichier et une empreinte';
    END IF;
    NEW.frozen_at := now();
  END IF;
  RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER documents_guard BEFORE INSERT OR UPDATE OR DELETE ON documents
  FOR EACH ROW EXECUTE FUNCTION documents_guard();
--> statement-breakpoint

-- 4. RG-03 : la date d'une preuve est celle de l'événement réel ----------------
CREATE OR REPLACE FUNCTION evidence_dates() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.recorded_at := now();
  NEW.occurred_at := now();
  IF NEW.source = 'manual' THEN
    IF NEW.declared_date IS NULL THEN
      RAISE EXCEPTION 'une preuve déposée à la main exige une date déclarée (RG-03)';
    END IF;
    IF NEW.declared_date > current_date THEN
      RAISE EXCEPTION 'la date déclarée ne peut pas être dans le futur';
    END IF;
  ELSE
    NEW.declared_date := NULL;
  END IF;
  RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER evidence_dates BEFORE INSERT ON evidence
  FOR EACH ROW EXECUTE FUNCTION evidence_dates();
--> statement-breakpoint

-- Les signatures sont datées par la base, jamais par l'application.
CREATE OR REPLACE FUNCTION signatures_date() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.signed_at := now();
  RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER signatures_date BEFORE INSERT ON signatures
  FOR EACH ROW EXECUTE FUNCTION signatures_date();
--> statement-breakpoint

-- 5. Liens sécurisés : résolution avant de connaître l'organisme --------------
CREATE OR REPLACE FUNCTION resolve_access_link(p_token_hash text)
RETURNS TABLE (organization_id uuid, purpose text, subject_type text, subject_id uuid,
               recipient_name text, recipient_email text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT organization_id, purpose, subject_type, subject_id, recipient_name, recipient_email
  FROM access_links
  WHERE token_hash = p_token_hash AND revoked_at IS NULL AND expires_at > now()
$$;
--> statement-breakpoint
REVOKE ALL ON FUNCTION resolve_access_link(text) FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION resolve_access_link(text) TO qualiopix_app;
--> statement-breakpoint

-- 6. Référentiel Qualiopi : lecture seule pour l'application -------------------
REVOKE INSERT, UPDATE, DELETE ON qualiopi_indicators FROM qualiopix_app;
--> statement-breakpoint
-- Intitulés résumés, à vérifier contre le guide de lecture du décret n° 2026-728.
INSERT INTO qualiopi_indicators (number, criterion, title, applicability, out_of_product_scope) VALUES
 (1, 1, 'Information du public sur les prestations (objectifs, prérequis, durée, modalités, délais d''accès, tarifs, accessibilité, contacts)', 'all', false),
 (2, 1, 'Indicateurs de résultats adaptés à la nature des prestations et des publics', 'all', false),
 (3, 1, 'Taux d''obtention des certifications préparées et possibilités de valider des blocs', 'certifying', false),
 (4, 2, 'Analyse du besoin du bénéficiaire en lien avec l''entreprise ou le financeur', 'all', false),
 (5, 2, 'Objectifs opérationnels et évaluables de la prestation', 'all', false),
 (6, 2, 'Contenus et modalités de mise en œuvre adaptés aux objectifs et aux publics', 'all', false),
 (7, 2, 'Adéquation des contenus aux exigences de la certification visée', 'certifying', false),
 (8, 2, 'Positionnement et évaluation des acquis à l''entrée de la prestation', 'all', false),
 (9, 3, 'Information des publics sur les conditions de déroulement de la prestation', 'all', false),
 (10, 3, 'Adaptation de la prestation, accompagnement et suivi des bénéficiaires', 'all', false),
 (11, 3, 'Évaluation de l''atteinte des objectifs par les bénéficiaires', 'all', false),
 (12, 3, 'Engagement des bénéficiaires, prévention des ruptures et des violences', 'all', false),
 (13, 3, 'Alternance : coordination entre le centre et l''entreprise', 'apprenticeship', true),
 (14, 3, 'Apprentissage : exercice de la citoyenneté', 'apprenticeship', true),
 (15, 3, 'Apprentissage : information sur les droits et devoirs de l''apprenti', 'apprenticeship', true),
 (16, 3, 'Conditions de présentation aux épreuves de certification', 'certifying', false),
 (17, 4, 'Moyens humains et techniques adaptés, environnement approprié', 'all', false),
 (18, 4, 'Coordination des différents intervenants', 'all', false),
 (19, 4, 'Ressources pédagogiques mises à disposition des bénéficiaires', 'all', false),
 (20, 4, 'Personnels dédiés à l''appui des apprentis (CFA)', 'apprenticeship', true),
 (21, 5, 'Compétences des intervenants internes et externes', 'all', false),
 (22, 5, 'Développement des compétences des personnels', 'all', false),
 (23, 6, 'Veille légale et réglementaire', 'all', false),
 (24, 6, 'Veille sur les emplois, les métiers et les compétences', 'all', false),
 (25, 6, 'Veille sur les innovations pédagogiques et technologiques', 'all', false),
 (26, 6, 'Mobilisation de l''expertise et du réseau handicap', 'all', false),
 (27, 6, 'Respect du référentiel par les sous-traitants et le portage salarial', 'all', false),
 (28, 6, 'Formation en situation de travail : réseau de partenaires', 'apprenticeship', true),
 (29, 6, 'Insertion professionnelle ou poursuite d''études (CFA)', 'apprenticeship', true),
 (30, 7, 'Recueil des appréciations des parties prenantes', 'all', false),
 (31, 7, 'Traitement des difficultés, réclamations et aléas', 'all', false),
 (32, 7, 'Mesures d''amélioration continue', 'all', false),
 (33, 7, 'Indicateur ajouté par le décret n° 2026-728 (intitulé et périmètre à confirmer)', 'apprenticeship', true);
