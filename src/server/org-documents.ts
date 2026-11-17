/**
 * ACC-07 – Documents de l'organisme : modèles éditables fournis par défaut.
 * Les textes sont des points de départ à faire relire par un juriste avant la
 * mise en production (cahier des charges, « Exigences réglementaires »).
 */
import { renderTemplate } from "./email-templates";

export type OrgDocumentDef = { kind: string; title: string; description: string; template: string };

const REVIEW = "Modèle fourni par Qualiopix, à adapter à votre activité et à faire relire par un juriste.";

export const ORG_DOCUMENTS: OrgDocumentDef[] = [
  {
    kind: "reglement_interieur",
    title: "Règlement intérieur",
    description: "Remis aux stagiaires avant ou au début de chaque session (Code du travail, art. L6352-3).",
    template: `# Objet et champ d'application
Le présent règlement s'applique à toute personne participant à une action de formation organisée par {{organisme}}, quel que soit le lieu où elle se déroule, y compris à distance.

# Hygiène et sécurité
Chaque stagiaire respecte les consignes d'hygiène et de sécurité en vigueur sur le lieu de formation. Lorsque la formation a lieu dans une entreprise, les consignes de cette entreprise s'appliquent.
- Il est interdit de pénétrer sur le lieu de formation en état d'ivresse ou sous l'emprise de stupéfiants.
- Il est interdit de fumer ou de vapoter dans les locaux.
- Les consignes d'évacuation en cas d'incendie sont affichées ou communiquées en début de session.

# Discipline
Les stagiaires respectent les horaires communiqués dans la convocation et signent la feuille d'émargement pour chaque demi-journée. Toute absence ou tout retard est signalé au formateur.

# Prévention des violences et du harcèlement
Toute forme de violence, de harcèlement moral ou sexuel, d'agissement sexiste ou de discrimination est interdite. Tout stagiaire victime ou témoin peut le signaler au référent désigné par {{organisme}} selon la procédure décrite dans le livret d'accueil. Le signalement est traité de manière confidentielle.

# Sanctions
Tout manquement au présent règlement peut faire l'objet d'une sanction : avertissement ou exclusion temporaire ou définitive de la formation. Aucune sanction n'est prise sans que le stagiaire ait été informé des griefs retenus contre lui et ait pu s'expliquer.

# Représentation des stagiaires
Pour les actions d'une durée supérieure à 500 heures, un délégué titulaire et un suppléant sont élus selon les modalités prévues par le Code du travail.

${REVIEW}`,
  },
  {
    kind: "livret_accueil",
    title: "Livret d'accueil",
    description: "Joint à chaque convocation : déroulement, contacts, accessibilité, signalement.",
    template: `# Bienvenue
{{organisme}} vous remercie de votre confiance. Ce livret présente les informations utiles au bon déroulement de votre formation.

# Déroulement
Le programme, les horaires et le lieu ou le lien de connexion figurent dans votre convocation. Vous signerez une feuille d'émargement pour chaque demi-journée. Une évaluation de positionnement est proposée en début de formation, une évaluation des acquis à la fin, ainsi qu'un questionnaire de satisfaction.

# Contacts
- Formateur : {{formateur}}, {{email}}, {{telephone}}
- Référent handicap : {{referent_handicap}}
- Référent violences et harcèlement : {{referent_violences}}

# Accessibilité et adaptations
Si vous êtes en situation de handicap ou avez un besoin particulier, signalez-le avant la formation au référent handicap. Les adaptations possibles (rythme, supports, lieu) seront étudiées avec vous en toute confidentialité.

# Signaler une difficulté, une réclamation ou une violence
Vous pouvez faire part d'une difficulté ou d'une réclamation à tout moment depuis votre espace stagiaire ou par e-mail. En cas de violence, de harcèlement ou de discrimination, contactez le référent désigné ; si la personne mise en cause est le formateur, votre signalement est transmis directement à un suppléant extérieur. Un accusé de réception vous est adressé sous 48 heures.

${REVIEW}`,
  },
  {
    kind: "cgv",
    title: "Conditions générales de vente",
    description: "Applicables aux entreprises et aux particuliers ; jointes aux devis.",
    template: `# Objet
Les présentes conditions s'appliquent aux prestations de formation proposées par {{organisme}}.

# Inscription
Toute inscription est confirmée par la signature d'une convention de formation (entreprise) ou d'un contrat de formation (particulier).

# Prix et paiement
Les prix sont indiqués hors taxes ou nets de taxes selon le régime de TVA de l'organisme. Pour les particuliers, aucune somme n'est exigible avant l'expiration du délai de rétractation de dix jours suivant la signature du contrat ; un éventuel acompte est plafonné conformément au Code du travail.

# Rétractation (particuliers)
Le stagiaire particulier peut se rétracter par lettre recommandée avec accusé de réception dans un délai de dix jours à compter de la signature du contrat.

# Annulation et report
Les conditions d'annulation et de report sont précisées dans la convention ou le contrat.

# Réclamations
Toute réclamation peut être adressée à {{email}}. Elle reçoit une réponse dans un délai annoncé à sa réception.

# Données personnelles
Les données des stagiaires sont traitées pour l'organisation et le suivi de la formation, dans le respect du RGPD.

${REVIEW}`,
  },
  {
    kind: "politique_violences",
    title: "Politique de prévention des violences",
    description: "Engagements et procédure de signalement (violences, harcèlement, discriminations).",
    template: `# Engagement
{{organisme}} s'engage à prévenir et à traiter toute situation de violence, de harcèlement moral ou sexuel, d'agissement sexiste ou de discrimination survenant pendant ses formations.

# Information
Cette politique et la procédure de signalement sont remises à chaque stagiaire avec sa convocation.

# Procédure de signalement
- Le signalement est adressé au référent violences et harcèlement : {{referent_violences}}.
- Si le formateur est mis en cause, le signalement est transmis directement au suppléant extérieur : {{suppleant}}.
- Un accusé de réception est adressé sous 48 heures.
- Seul le référent désigné a accès au signalement.

# Traitement
Le référent écoute les personnes concernées, prend les mesures de protection nécessaires et oriente, si besoin, vers les services compétents (services de police ou de gendarmerie, 3919, associations d'aide aux victimes, Défenseur des droits).

${REVIEW}`,
  },
];

export function orgDocumentDef(kind: string) {
  return ORG_DOCUMENTS.find((d) => d.kind === kind);
}

export function fillOrgTemplate(template: string, vars: Record<string, string | null | undefined>) {
  return renderTemplate(template, vars);
}
