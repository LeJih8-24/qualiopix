# Feuille de route V1

Les 70 fonctionnalités V1 du [cahier des charges](./cahier-des-charges.md), ordonnées pour que
chaque jalon s'appuie sur le précédent et suive le parcours principal (session OPCO).
Cocher une case = fonctionnalité livrée **et** testée. Reprendre l'identifiant dans les
commits et les tickets (`feat(CAT-01): …`).

Légende : ✅ fait · 🟡 partiel · ⬜ à faire

## Jalon 0 – Socle ✅

| ID | Fonctionnalité | État | Reste à faire |
| --- | --- | --- | --- |
| ACC-01 | Inscription et connexion | 🟡 | Lien de connexion par e-mail, double authentification, limitation des tentatives, mot de passe oublié |
| ACC-02 | Profil de l'organisme | 🟡 | Envoi du logo (attend le stockage de fichiers) ; verrouillage du régime de TVA par exercice (RG-09, avec FAC-01) |
| — | Cloisonnement RLS, journal des actions non modifiable | ✅ | — |

## Jalon 1 – Briques transverses ✅

| ID | Fonctionnalité | État | Reste à faire |
| --- | --- | --- | --- |
| — | Documents figés (RG-02) | ✅ | Stockage objet UE en production (interface `FileStorage` prête, disque local en dev) |
| — | Dates de preuve imposées par la base (RG-03) | ✅ | — |
| — | Liens sécurisés | ✅ | Révocation depuis l'interface |
| — | Signature électronique simple (eIDAS) | ✅ | Signature du formateur ; signature par plusieurs personnes d'un même document (convention) |
| QUA-01 | Référentiel paramétrable | 🟡 | Intitulés des 33 indicateurs à vérifier contre le guide de lecture du décret 2026-728 ; statut de l'indicateur 33 (point ouvert) |
| QUA-02 | Classement des preuves | ✅ | Chaque nouveau module doit appeler `recordEvidence()` |
| NOT-01 | Centre de notifications | 🟡 | Envoi par e-mail des notifications et réglages |
| NOT-02 | Modèles d'e-mails | ✅ | Ajouter les modèles de chaque module (convocation, rappels…) |
| ACC-07 | Documents de l'organisme | 🟡 | Textes à faire relire par un juriste |
| ACC-08 | Référents | ✅ | — |
| VEI-01 | Annuaire handicap | ✅ | Liens à revérifier périodiquement |

Intégrations : e-mail Brevo prêt (activé si `BREVO_API_KEY` est renseigné, sinon envoi simulé dans le journal du serveur).

## Jalon 2 – Catalogue et conception

| ID | Fonctionnalité |
| --- | --- |
| CAT-01 | Fiche programme complète |
| CAT-02 | Objectifs évaluables |
| CAT-03 | Déroulé pédagogique |
| CAT-04 | Matrice objectifs ↔ évaluations (RG-10) |
| CAT-05 | Banque de questions |
| CAT-06 | Supports |
| CAT-07 | Versions de programme (RG-01) |
| CAT-10 | Détection des mentions à risque |
| IA-01 | Programme à partir d'un descriptif |
| IA-02 | Quiz à partir des supports |
| IA-03 | Reformulation des objectifs |

## Jalon 3 – Clients et commercial

| ID | Fonctionnalité |
| --- | --- |
| CLI-01 | Entreprises et contacts |
| CLI-02 | Particuliers |
| CLI-03 | Analyse du besoin |
| CLI-05 | Devis |
| CAT-08 | Page catalogue publique |
| CLI-04 | Demandes entrantes |

## Jalon 4 – Sessions et administratif

| ID | Fonctionnalité |
| --- | --- |
| SES-01 | Création de session |
| SES-07 | Statuts de session (RG-04, RG-06) |
| SES-02 | Inscription des stagiaires |
| SES-03 | Convention de formation |
| SES-04 | Contrat avec un particulier (RG-05) |
| SES-05 | Convocation |
| SES-06 | Rappels (e-mail ; SMS en V2) |
| SES-09 | Annulations et reports |
| SES-08 | Attestations (RG-07) |

## Jalon 5 – Jour J, évaluation, espace stagiaire

| ID | Fonctionnalité |
| --- | --- |
| JJ-01 | Mode session |
| JJ-02 | Émargement stagiaires |
| JJ-03 | Émargement du formateur |
| JJ-04 | Quiz en direct |
| JJ-05 | Notes et adaptations |
| JJ-06 | Satisfaction à chaud |
| JJ-07 | Classe virtuelle |
| EVA-01 | Résultats par objectif |
| EVA-02 | Fiche compétences du stagiaire |
| EVA-03 | Suivi des absences (RG-16) |
| LMS-01 | Espace stagiaire simple |

## Jalon 6 – Facturation

| ID | Fonctionnalité |
| --- | --- |
| FAC-01 | Factures (RG-08, RG-09) |
| FAC-02 | Subrogation OPCO |
| FAC-03 | Acomptes et avoirs |
| FAC-04 | Suivi des paiements |
| FAC-05 | Pièces pour l'OPCO |
| FAC-06 | Export comptable |

## Jalon 7 – Qualité et pilotage

| ID | Fonctionnalité |
| --- | --- |
| QUA-03 | Score de préparation (RG-11) |
| QUA-04 | Preuves manuelles |
| QUA-05 | Dossier d'audit |
| QUA-06 | Registre des réclamations (RG-14) |
| QUA-07 | Registre des signalements (RG-13) |
| QUA-08 | Calendrier des audits |
| CAT-09 | Indicateurs de résultats publics (RG-12) |
| TDB-01 | Tableau de bord du jour (amorcé) |
| TDB-02 | Chiffre d'affaires |
| TDB-03 | Indicateurs qualité |

## Jalon 8 – Sous-traitance

| ID | Fonctionnalité |
| --- | --- |
| SST-01 | Session sous-traitée (RG-15) |
| SST-02 | Dossier pour le donneur d'ordre |
| SST-03 | Facture au donneur d'ordre |
| SST-04 | Invitation |

## Jalon 9 – Compte, abonnement, portabilité

| ID | Fonctionnalité |
| --- | --- |
| ACC-03 | Assistant de démarrage |
| ACC-04 | Abonnement (Stripe, RG-17) |
| ACC-05 | Export complet |
| ACC-06 | Suppression du compte (purge hors journal à concevoir, RG-18) |

## Règles de gestion et tests

Chaque règle RG-01 à RG-18 doit avoir au moins un test d'intégration nommé d'après elle
(`describe("RG-04 …")`), exigence du cahier des charges (« Livrables »).
