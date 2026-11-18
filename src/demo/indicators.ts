/**
 * Fiches des 33 indicateurs pour la démo : ce que demande l'indicateur
 * (résumé, à vérifier contre le guide de lecture officiel), pourquoi il est
 * couvert ou non, et les preuves qui le remplissent, avec un lien vers
 * l'écran du produit d'où elles viennent.
 */

export type ProofSource = { label: string; date: string; href?: string; place: string };

export type IndicatorDetail = {
  requirement: string;
  why: string;
  proofs: ProofSource[];
  /** Ce qu'il faudrait faire (indicateurs à risque). */
  todo?: string;
};

const CERTIFYING =
  "Cet indicateur ne concerne que les formations qui préparent à une certification enregistrée (RNCP ou répertoire spécifique). Votre profil indique que vous n'en proposez pas : il est écarté automatiquement. Cochez « formations certifiantes » dans votre profil s'il le faut.";
const APPRENTICESHIP =
  "Cet indicateur concerne l'apprentissage, l'alternance ou les CFA, que Qualiopix ne gère pas. Il n'est pas applicable à votre activité de formateur indépendant et l'auditeur ne vous le demandera pas.";

const S = "/demo/sessions/kleber-nov";
const P = "/demo/catalogue/manager-a-distance";

export const INDICATOR_DETAILS: Record<number, IndicatorDetail> = {
  1: {
    requirement:
      "Diffuser au public une information détaillée et vérifiable sur chaque formation : objectifs, prérequis, public, durée, modalités et délais d'accès, tarifs, contacts, méthodes, modalités d'évaluation et accessibilité aux personnes handicapées.",
    why:
      "Vos programmes publiés comportent tous les champs exigés : Qualiopix bloque la publication tant qu'un champ manque. Chaque publication de votre page catalogue est enregistrée avec sa date.",
    proofs: [
      { label: "Fiche « Manager une équipe à distance », version 3 publiée", date: "3 nov. 2026", href: P, place: "Catalogue" },
      { label: "Page catalogue publique mise à jour", date: "3 nov. 2026", href: "/demo/catalogue", place: "Catalogue" },
      { label: "Page de vente du cours Excel en ligne", date: "12 sept. 2026", href: "/demo/ventes", place: "Ventes en ligne" },
    ],
  },
  2: {
    requirement:
      "Publier des indicateurs de résultats adaptés à vos formations et à vos publics, par exemple le taux de satisfaction et le taux d'atteinte des objectifs, avec la période et la méthode de calcul.",
    why:
      "Les résultats sont recalculés chaque nuit à partir des questionnaires et des évaluations réellement recueillis, puis affichés sur votre page catalogue dès 5 réponses.",
    proofs: [
      { label: "Satisfaction 4,7 / 5 et 92 % d'objectifs atteints affichés", date: "17 nov. 2026", href: "/demo/catalogue", place: "Catalogue" },
      { label: "Avis vérifiés affichés sur la page de vente", date: "15 nov. 2026", href: "/demo/ventes", place: "Ventes en ligne" },
    ],
  },
  3: { requirement: "Publier les taux d'obtention des certifications préparées et les possibilités de valider des blocs de compétences.", why: CERTIFYING, proofs: [] },
  4: {
    requirement:
      "Analyser le besoin du bénéficiaire en lien avec l'entreprise ou le financeur avant la formation : contexte, public, niveau, contraintes, éventuel besoin d'adaptation.",
    why:
      "Chaque demande passe par le questionnaire de besoin envoyé au client. Ses réponses sont horodatées et reprises dans le devis.",
    proofs: [
      { label: "Questionnaire de besoin rempli par la Brasserie Kléber", date: "2 oct. 2026", href: S, place: "Session Brasserie Kléber" },
      { label: "Questionnaire de besoin rempli par la Clinique des Vosges", date: "6 nov. 2026", href: "/demo/clients", place: "Clients" },
    ],
  },
  5: {
    requirement: "Définir des objectifs opérationnels et évaluables pour chaque formation.",
    why:
      "Chaque objectif de vos programmes est rédigé avec un verbe d'action et relié à au moins une évaluation. L'assistant signale les objectifs non mesurables.",
    proofs: [
      { label: "4 objectifs reliés à leurs évaluations, « Manager à distance » v3", date: "3 nov. 2026", href: P, place: "Fiche programme" },
      { label: "3 objectifs reliés à leurs évaluations, « Prendre la parole » v2", date: "8 sept. 2026", href: "/demo/catalogue/prise-de-parole", place: "Fiche programme" },
    ],
  },
  6: {
    requirement: "Établir des contenus et des modalités de mise en œuvre adaptés aux objectifs et aux publics.",
    why: "Le déroulé pédagogique de chaque programme précise séquences, durées, méthodes et supports ; Qualiopix contrôle que la durée totale correspond à la durée annoncée.",
    proofs: [{ label: "Déroulé minuté du premier jour, « Manager à distance »", date: "3 nov. 2026", href: P, place: "Fiche programme" }],
  },
  7: { requirement: "Vérifier l'adéquation des contenus aux exigences de la certification visée.", why: CERTIFYING, proofs: [] },
  8: {
    requirement: "Positionner les bénéficiaires et évaluer leurs acquis à l'entrée de la formation.",
    why: "Un questionnaire de positionnement est envoyé avant chaque session ou lancé par QR code le premier matin. Les résultats sont gardés par stagiaire et par objectif.",
    proofs: [
      { label: "Positionnement des 6 stagiaires de la Brasserie Kléber", date: "12 nov. 2026", href: S, place: "Session Brasserie Kléber" },
      { label: "Résultats du positionnement par objectif", date: "18 nov. 2026", href: "/demo/jour-j", place: "Jour J, onglet Quiz" },
    ],
  },
  9: {
    requirement: "Informer les bénéficiaires des conditions de déroulement : dates, horaires, lieu ou lien, contacts, règlement intérieur, livret d'accueil.",
    why: "Les convocations partent automatiquement avec le programme, le livret d'accueil et le règlement intérieur. Chaque envoi est tracé.",
    proofs: [
      { label: "Convocations envoyées aux 6 stagiaires", date: "4 nov. 2026", href: S, place: "Session Brasserie Kléber" },
      { label: "Rappel envoyé la veille de la session", date: "17 nov. 2026", href: S, place: "Session Brasserie Kléber" },
    ],
  },
  10: {
    requirement: "Adapter la formation aux bénéficiaires et assurer leur accompagnement et leur suivi pendant la formation.",
    why: "Les adaptations décidées pendant la session (rythme, niveau, handicap) sont notées et datées pour chaque stagiaire.",
    proofs: [
      { label: "Adaptation notée pour Thomas Klein : supports agrandis, pauses", date: "18 nov. 2026", href: "/demo/jour-j", place: "Jour J, onglet Notes" },
      { label: "Progression des stagiaires entre positionnement et fin", date: "16 oct. 2026", href: "/demo/sessions", place: "Sessions" },
    ],
  },
  11: {
    requirement: "Évaluer l'atteinte des objectifs par les bénéficiaires.",
    why: "Le quiz de fin et les mises en situation donnent un résultat par objectif et par stagiaire, repris dans l'attestation de fin de formation.",
    proofs: [
      { label: "Quiz de fin, Cabinet Hartmann : 95 % d'objectifs atteints", date: "16 oct. 2026", href: "/demo/sessions", place: "Sessions" },
      { label: "5 attestations de fin de formation générées", date: "16 oct. 2026", href: "/demo/sessions", place: "Sessions" },
    ],
  },
  12: {
    requirement:
      "Favoriser l'engagement des bénéficiaires et prévenir les ruptures de parcours ; depuis 2026, prévenir aussi les violences, le harcèlement et les discriminations, avec un dispositif de signalement.",
    why: "Les émargements de chaque demi-journée et les relances d'absence montrent le suivi de l'assiduité. La politique de prévention des violences et le référent désigné figurent dans le livret d'accueil.",
    proofs: [
      { label: "Émargement du mardi matin : 5 présents sur 6", date: "18 nov. 2026", href: S, place: "Session Brasserie Kléber" },
      { label: "Relance d'absence envoyée à Yanis Meyer", date: "18 nov. 2026", href: S, place: "Session Brasserie Kléber" },
      { label: "Émargement par QR code, signatures horodatées", date: "18 nov. 2026", href: "/demo/jour-j", place: "Jour J" },
    ],
  },
  13: { requirement: "Alternance : coordonner le centre de formation et l'entreprise d'accueil.", why: APPRENTICESHIP, proofs: [] },
  14: { requirement: "Apprentissage : favoriser l'exercice de la citoyenneté des apprentis.", why: APPRENTICESHIP, proofs: [] },
  15: { requirement: "Apprentissage : informer les apprentis de leurs droits et devoirs.", why: APPRENTICESHIP, proofs: [] },
  16: { requirement: "S'assurer des conditions de présentation des bénéficiaires aux épreuves de certification.", why: CERTIFYING, proofs: [] },
  17: {
    requirement: "Mettre à disposition des moyens humains et techniques adaptés et un environnement approprié.",
    why: "Chaque lieu de formation a sa fiche (accessibilité, capacité, équipement) et une liste de vérification est cochée avant la session.",
    proofs: [{ label: "Fiche lieu et liste de vérification, salle Kléber", date: "17 nov. 2026", href: S, place: "Session Brasserie Kléber" }],
  },
  18: {
    requirement: "Mobiliser et coordonner les différents intervenants, internes ou externes.",
    why: "Aucune preuve sur les 12 derniers mois. Travaillant seule, vous coordonnez surtout avec les organismes qui vous sous-traitent des sessions.",
    proofs: [],
    todo: "Décrivez comment vous vous coordonnez avec Forma'Est (réunion de préparation, échanges sur le programme) et déposez le compte rendu.",
  },
  19: {
    requirement: "Mettre à disposition des bénéficiaires des ressources pédagogiques et leur permettre de se les approprier.",
    why: "Les supports rattachés aux séquences sont remis automatiquement aux stagiaires dans leur espace. Pour les cours en ligne, le temps passé et la progression sont suivis.",
    proofs: [
      { label: "Supports remis aux 6 stagiaires de la Brasserie Kléber", date: "18 nov. 2026", href: S, place: "Session Brasserie Kléber" },
      { label: "Suivi du temps passé, cours Excel en ligne", date: "17 nov. 2026", href: "/demo/ventes", place: "Ventes en ligne" },
    ],
  },
  20: { requirement: "Disposer de personnels dédiés à l'appui des apprentis (CFA).", why: APPRENTICESHIP, proofs: [] },
  21: {
    requirement: "Déterminer, mobiliser et évaluer les compétences des intervenants.",
    why: "Votre fiche formateur contient votre CV, vos diplômes et vos habilitations, avec leurs dates de validité.",
    proofs: [{ label: "CV et diplômes mis à jour dans la fiche formateur", date: "5 févr. 2026", place: "Mon organisme" }],
  },
  22: {
    requirement: "Entretenir et développer les compétences des intervenants.",
    why: "Aucune formation suivie n'a été enregistrée sur les 12 derniers mois.",
    proofs: [],
    todo: "Ajoutez une formation que vous avez suivie cette année, avec son attestation ou son justificatif.",
  },
  23: {
    requirement: "Assurer une veille légale et réglementaire sur la formation professionnelle et l'exploiter.",
    why: "Votre journal de veille contient des actualités lues et l'action décidée pour chacune.",
    proofs: [
      { label: "Décret Qualiopi 2026 lu : livret d'accueil mis à jour", date: "4 nov. 2026", place: "Journal de veille" },
      { label: "Loi sur le passeport de prévention lue", date: "2 juil. 2026", place: "Journal de veille" },
    ],
  },
  24: {
    requirement: "Assurer une veille sur les emplois, les métiers et les compétences de votre domaine et l'exploiter.",
    why: "Aucune veille métier n'a été notée sur les 12 derniers mois.",
    proofs: [],
    todo: "Notez une veille métier : un article ou une étude lus, et ce qu'ils changent pour vos programmes de management.",
  },
  25: {
    requirement: "Assurer une veille sur les innovations pédagogiques et technologiques et l'exploiter.",
    why: "Votre journal de veille relie une lecture à la modification d'un programme.",
    proofs: [{ label: "Article sur les classes hybrides : déroulé « Manager à distance » v3", date: "28 oct. 2026", href: P, place: "Journal de veille, fiche programme" }],
  },
  26: {
    requirement: "Mobiliser l'expertise et le réseau nécessaires pour accueillir et accompagner les personnes en situation de handicap.",
    why: "Vous avez désigné un référent handicap, l'annuaire des contacts est à jour et une adaptation a été mise en place pendant une session.",
    proofs: [
      { label: "Référent handicap désigné", date: "5 févr. 2026", place: "Référents" },
      { label: "Adaptation mise en place pour Thomas Klein", date: "18 nov. 2026", href: "/demo/jour-j", place: "Jour J, onglet Notes" },
    ],
  },
  27: {
    requirement: "En cas de sous-traitance, s'assurer du respect du référentiel par chacun et en garder la trace.",
    why: "Pour les sessions que Forma'Est vous sous-traite, le dossier (émargements, évaluations, satisfaction) lui est transmis par lien après chaque session.",
    proofs: [{ label: "Dossier de la session de Colmar transmis à Forma'Est", date: "7 nov. 2026", href: "/demo/sessions", place: "Sessions" }],
  },
  28: { requirement: "Formation en situation de travail : mobiliser un réseau de partenaires.", why: APPRENTICESHIP, proofs: [] },
  29: { requirement: "Développer des actions concourant à l'insertion professionnelle ou à la poursuite d'études (CFA).", why: APPRENTICESHIP, proofs: [] },
  30: {
    requirement: "Recueillir les appréciations de toutes les parties prenantes : bénéficiaires, entreprises, financeurs, intervenants.",
    why: "Un questionnaire de satisfaction est lancé à la fin de chaque session et un questionnaire à froid part un mois après, au stagiaire et au commanditaire.",
    proofs: [
      { label: "Satisfaction à chaud, Cabinet Hartmann : 4,8 / 5", date: "16 oct. 2026", href: "/demo/sessions", place: "Sessions" },
      { label: "Questionnaire à froid envoyé au commanditaire", date: "15 nov. 2026", href: "/demo/clients", place: "Clients" },
      { label: "31 avis recueillis sur le cours Excel", date: "17 nov. 2026", href: "/demo/ventes", place: "Ventes en ligne" },
    ],
  },
  31: {
    requirement: "Traiter les difficultés rencontrées, les réclamations et les aléas survenus pendant les formations.",
    why: "Chaque réclamation ou aléa est enregistré dans le registre avec son statut, son délai et la réponse apportée.",
    proofs: [
      { label: "Réclamation sur l'horaire d'une session : traitée en 3 jours", date: "21 oct. 2026", place: "Registre des réclamations" },
      { label: "Report d'une session pour indisponibilité de salle", date: "9 sept. 2026", href: "/demo/sessions", place: "Sessions" },
    ],
  },
  32: {
    requirement: "Mettre en œuvre des mesures d'amélioration à partir des appréciations et des réclamations.",
    why: "La réclamation d'octobre a été traitée mais n'a pas encore donné lieu à une action d'amélioration enregistrée.",
    proofs: [],
    todo: "Transformez la réclamation d'octobre en action d'amélioration : ce que vous changez, pour quand, et comment vous en mesurerez l'effet.",
  },
  33: {
    requirement: "Indicateur ajouté par le décret n° 2026-728. Son intitulé et son périmètre exacts restent à confirmer.",
    why: "Il est marqué hors périmètre en attendant la confirmation de ce qu'il demande.",
    proofs: [],
  },
};
