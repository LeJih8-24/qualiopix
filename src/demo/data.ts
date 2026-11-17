/**
 * Données fictives du prototype de démonstration (/demo).
 * Aucune n'est lue en base : toute ressemblance avec des personnes ou
 * entreprises réelles serait fortuite. Les OPCO sont de vrais financeurs.
 */

export const today = "2026-11-18";

export const trainer = {
  name: "Claire Morel",
  initials: "CM",
  org: "Atelier Morel Formation",
  city: "Strasbourg",
  plan: "Solo Qualiopi",
};

export type Programme = {
  slug: string;
  title: string;
  duration: string;
  modality: string;
  price: string;
  status: "publié" | "brouillon";
  version: number;
  objectives: string[];
  sessions: number;
  satisfaction: number | null;
  success: number | null;
  online?: boolean;
};

export const programmes: Programme[] = [
  {
    slug: "manager-a-distance",
    title: "Manager une équipe à distance",
    duration: "2 jours · 14 h",
    modality: "Présentiel ou classe virtuelle",
    price: "1 400 € HT / jour (intra)",
    status: "publié",
    version: 3,
    objectives: [
      "Organiser les rituels d'une équipe hybride sur une semaine type",
      "Conduire un entretien individuel à distance avec la grille fournie",
      "Formuler des objectifs SMART pour chaque membre de l'équipe",
      "Repérer trois signaux d'isolement et choisir une réponse adaptée",
    ],
    sessions: 9,
    satisfaction: 4.7,
    success: 92,
  },
  {
    slug: "prise-de-parole",
    title: "Prendre la parole en public",
    duration: "2 jours · 14 h",
    modality: "Présentiel",
    price: "690 € net / personne (inter)",
    status: "publié",
    version: 2,
    objectives: [
      "Structurer une intervention de 5 minutes en trois parties",
      "Gérer son trac avec deux techniques de respiration",
      "Répondre à une objection sans perdre le fil",
    ],
    sessions: 6,
    satisfaction: 4.8,
    success: 95,
  },
  {
    slug: "tcd-excel",
    title: "Excel : maîtriser les tableaux croisés dynamiques",
    duration: "7 h en ligne",
    modality: "E-learning tutoré",
    price: "249 € TTC",
    status: "publié",
    version: 1,
    objectives: [
      "Construire un tableau croisé à partir d'une base de 5 000 lignes",
      "Ajouter un champ calculé et des segments",
      "Mettre à jour un rapport mensuel en moins de deux minutes",
    ],
    sessions: 0,
    satisfaction: 4.6,
    success: 88,
    online: true,
  },
  {
    slug: "stress-au-travail",
    title: "Prévenir le stress au travail",
    duration: "1 jour · 7 h",
    modality: "Présentiel",
    price: "1 200 € HT / jour (intra)",
    status: "brouillon",
    version: 1,
    objectives: [
      "Identifier les facteurs de stress de son poste",
      "Construire un plan d'action personnel en trois mesures",
    ],
    sessions: 0,
    satisfaction: null,
    success: null,
  },
];

export type Client = {
  name: string;
  kind: "Entreprise" | "Particulier" | "Donneur d'ordre";
  sector: string;
  opco: string | null;
  contact: string;
  sessions: number;
  revenue: string;
  status: "Actif" | "Devis envoyé" | "Nouveau";
};

export const clients: Client[] = [
  { name: "Brasserie Kléber SAS", kind: "Entreprise", sector: "Hôtellerie-restauration", opco: "Akto", contact: "Julie Wendling", sessions: 3, revenue: "8 400 €", status: "Actif" },
  { name: "Transports Vogel", kind: "Entreprise", sector: "Transport", opco: "OPCO Mobilités", contact: "Marc Heitz", sessions: 2, revenue: "5 600 €", status: "Actif" },
  { name: "Clinique des Vosges", kind: "Entreprise", sector: "Santé", opco: "OPCO Santé", contact: "Dr Anne Roth", sessions: 1, revenue: "2 800 €", status: "Devis envoyé" },
  { name: "Cabinet Hartmann", kind: "Entreprise", sector: "Expertise comptable", opco: "Atlas", contact: "Paul Hartmann", sessions: 2, revenue: "4 200 €", status: "Actif" },
  { name: "Forma'Est", kind: "Donneur d'ordre", sector: "Organisme de formation", opco: null, contact: "Sophie Bauer", sessions: 4, revenue: "6 300 €", status: "Actif" },
  { name: "Nadia Ferhat", kind: "Particulier", sector: "Reconversion", opco: null, contact: "—", sessions: 1, revenue: "690 €", status: "Nouveau" },
];

export type Step = {
  label: string;
  date: string;
  done: boolean;
  proof?: string;
  indicators?: number[];
};

export type Trainee = {
  name: string;
  role: string;
  am: boolean | null;
  pm: boolean | null;
  start: number;
  end: number | null;
  adaptation?: string;
};

export type Session = {
  id: string;
  programme: string;
  client: string;
  financing: string;
  dates: string;
  place: string;
  status: "Confirmée" | "En cours" | "Terminée" | "Brouillon" | "Clôturée";
  trainees: number;
  seats: number;
  amount: string;
  subcontracted?: boolean;
};

export const sessions: Session[] = [
  { id: "kleber-nov", programme: "Manager une équipe à distance", client: "Brasserie Kléber SAS", financing: "Akto (subrogation)", dates: "18 – 19 nov. 2026", place: "Strasbourg, salle Kléber", status: "En cours", trainees: 6, seats: 8, amount: "2 800 € HT" },
  { id: "vogel-dec", programme: "Manager une équipe à distance", client: "Transports Vogel", financing: "OPCO Mobilités", dates: "3 – 4 déc. 2026", place: "Classe virtuelle", status: "Confirmée", trainees: 5, seats: 8, amount: "2 800 € HT" },
  { id: "inter-dec", programme: "Prendre la parole en public", client: "Inter-entreprises", financing: "Mixte", dates: "10 – 11 déc. 2026", place: "Strasbourg, Le Shadok", status: "Confirmée", trainees: 7, seats: 10, amount: "4 830 € net" },
  { id: "formaest-jan", programme: "Gestion de conflits (programme Forma'Est)", client: "Forma'Est", financing: "Sous-traitance", dates: "14 janv. 2027", place: "Colmar", status: "Confirmée", trainees: 9, seats: 12, amount: "1 050 € HT", subcontracted: true },
  { id: "clinique-jan", programme: "Manager une équipe à distance", client: "Clinique des Vosges", financing: "OPCO Santé", dates: "21 – 22 janv. 2027", place: "Épinal", status: "Brouillon", trainees: 0, seats: 8, amount: "2 800 € HT" },
  { id: "hartmann-oct", programme: "Prendre la parole en public", client: "Cabinet Hartmann", financing: "Atlas", dates: "15 – 16 oct. 2026", place: "Strasbourg", status: "Clôturée", trainees: 5, seats: 6, amount: "2 100 € HT" },
];

/** Parcours de référence (cahier des charges) de la session en cours. */
export const sessionSteps: { phase: string; steps: Step[] }[] = [
  {
    phase: "Avant",
    steps: [
      { label: "Questionnaire de besoin rempli par Julie Wendling", date: "2 oct.", done: true, proof: "Réponses horodatées", indicators: [4] },
      { label: "Devis signé en ligne", date: "9 oct.", done: true, proof: "Signature électronique", indicators: [] },
      { label: "Convention de formation signée", date: "14 oct.", done: true, proof: "PDF figé + empreinte", indicators: [] },
      { label: "Convocations envoyées aux 6 stagiaires", date: "4 nov.", done: true, proof: "Accusés d'envoi", indicators: [9, 12] },
      { label: "Positionnement à l'entrée", date: "12 nov.", done: true, proof: "6 réponses / 6", indicators: [8] },
    ],
  },
  {
    phase: "Pendant",
    steps: [
      { label: "Émargement mardi matin", date: "18 nov.", done: true, proof: "6 signatures, IP, heure", indicators: [12] },
      { label: "Adaptation notée pour Thomas Klein", date: "18 nov.", done: true, proof: "Note datée", indicators: [10, 26] },
      { label: "Émargement mardi après-midi", date: "18 nov.", done: false },
      { label: "Quiz de fin et satisfaction à chaud", date: "19 nov.", done: false },
    ],
  },
  {
    phase: "Après",
    steps: [
      { label: "Clôture : attestations et certificats de réalisation", date: "19 nov.", done: false },
      { label: "Facture à Akto et reste à charge à l'entreprise", date: "20 nov.", done: false },
      { label: "Évaluation à froid stagiaires et commanditaire", date: "19 déc.", done: false },
    ],
  },
];

export const trainees: Trainee[] = [
  { name: "Léa Martin", role: "Cheffe de rang", am: true, pm: null, start: 2, end: null },
  { name: "Thomas Klein", role: "Responsable de salle", am: true, pm: null, start: 1, end: null, adaptation: "Supports agrandis, pauses toutes les 45 min" },
  { name: "Inès Bouaziz", role: "Responsable cuisine", am: true, pm: null, start: 3, end: null },
  { name: "Hugo Schmitt", role: "Sommelier", am: true, pm: null, start: 2, end: null },
  { name: "Camille Durand", role: "Responsable bar", am: true, pm: null, start: 2, end: null },
  { name: "Yanis Meyer", role: "Second de cuisine", am: false, pm: null, start: 1, end: null },
];

export type Invoice = {
  number: string;
  client: string;
  label: string;
  amount: string;
  issued: string;
  due: string;
  status: "Payée" | "En attente" | "En retard" | "Brouillon";
};

export const invoices: Invoice[] = [
  { number: "FA-2026-0047", client: "Akto (pour Brasserie Kléber)", label: "Manager à distance · 18–19 nov.", amount: "2 380,00 €", issued: "—", due: "—", status: "Brouillon" },
  { number: "FA-2026-0046", client: "Forma'Est", label: "Sous-traitance · 6 nov.", amount: "1 050,00 €", issued: "7 nov.", due: "7 déc.", status: "En attente" },
  { number: "FA-2026-0045", client: "Atlas (pour Cabinet Hartmann)", label: "Prise de parole · 15–16 oct.", amount: "1 800,00 €", issued: "17 oct.", due: "16 nov.", status: "En retard" },
  { number: "FA-2026-0044", client: "Cabinet Hartmann", label: "Reste à charge · 15–16 oct.", amount: "300,00 €", issued: "17 oct.", due: "16 nov.", status: "Payée" },
  { number: "FA-2026-0043", client: "Transports Vogel", label: "Acompte 30 % · 3–4 déc.", amount: "840,00 €", issued: "2 oct.", due: "2 nov.", status: "Payée" },
  { number: "FA-2026-0042", client: "Nadia Ferhat", label: "Prise de parole · 10–11 déc.", amount: "690,00 €", issued: "28 sept.", due: "28 oct.", status: "Payée" },
];

export const revenueByMonth = [
  { month: "juin", value: 4.2 },
  { month: "juil.", value: 2.1 },
  { month: "août", value: 0.6 },
  { month: "sept.", value: 5.8 },
  { month: "oct.", value: 7.4 },
  { month: "nov.", value: 6.1 },
];

export type IndicatorState = "couvert" | "à risque" | "non applicable";

/** État des 33 indicateurs dans la démo. */
export const indicatorStates: { n: number; c: number; title: string; state: IndicatorState; proofs: number }[] = [
  [1, 1, "Information du public sur les prestations", "couvert", 14],
  [2, 1, "Indicateurs de résultats", "couvert", 3],
  [3, 1, "Taux d'obtention des certifications", "non applicable", 0],
  [4, 2, "Analyse du besoin", "couvert", 11],
  [5, 2, "Objectifs opérationnels et évaluables", "couvert", 8],
  [6, 2, "Contenus et modalités adaptés", "couvert", 8],
  [7, 2, "Adéquation à la certification", "non applicable", 0],
  [8, 2, "Positionnement à l'entrée", "couvert", 23],
  [9, 3, "Information sur le déroulement", "couvert", 31],
  [10, 3, "Adaptation et suivi", "couvert", 6],
  [11, 3, "Évaluation des acquis", "couvert", 22],
  [12, 3, "Engagement, prévention des ruptures et des violences", "couvert", 48],
  [13, 3, "Alternance : coordination", "non applicable", 0],
  [14, 3, "Apprentissage : citoyenneté", "non applicable", 0],
  [15, 3, "Apprentissage : droits et devoirs", "non applicable", 0],
  [16, 3, "Présentation aux certifications", "non applicable", 0],
  [17, 4, "Moyens humains et techniques", "couvert", 5],
  [18, 4, "Coordination des intervenants", "à risque", 0],
  [19, 4, "Ressources pédagogiques", "couvert", 17],
  [20, 4, "Personnels d'appui (CFA)", "non applicable", 0],
  [21, 5, "Compétences des intervenants", "couvert", 2],
  [22, 5, "Développement des compétences", "à risque", 0],
  [23, 6, "Veille légale et réglementaire", "couvert", 4],
  [24, 6, "Veille emplois et métiers", "à risque", 0],
  [25, 6, "Veille pédagogique et technologique", "couvert", 2],
  [26, 6, "Réseau handicap", "couvert", 3],
  [27, 6, "Sous-traitance", "couvert", 4],
  [28, 6, "Formation en situation de travail", "non applicable", 0],
  [29, 6, "Insertion professionnelle (CFA)", "non applicable", 0],
  [30, 7, "Recueil des appréciations", "couvert", 26],
  [31, 7, "Réclamations et aléas", "couvert", 2],
  [32, 7, "Amélioration continue", "à risque", 0],
  [33, 7, "Indicateur 2026 (à confirmer)", "non applicable", 0],
].map(([n, c, title, state, proofs]) => ({
  n: n as number,
  c: c as number,
  title: title as string,
  state: state as IndicatorState,
  proofs: proofs as number,
}));

export const qualiopiGaps = [
  { n: 22, text: "Ajoutez une formation suivie cette année (justificatif ou attestation)." },
  { n: 24, text: "Notez une veille métier : un article lu et ce qu'il change pour vos programmes." },
  { n: 32, text: "Transformez la réclamation d'octobre en action d'amélioration." },
  { n: 18, text: "Décrivez comment vous vous coordonnez avec Forma'Est sur les sessions sous-traitées." },
];

export const todo = [
  { time: "8 h 45", text: "Émargement du mardi matin", detail: "Brasserie Kléber · 6 stagiaires", href: "/demo/jour-j", done: true },
  { time: "13 h 30", text: "Émargement du mardi après-midi", detail: "QR code prêt dans le mode session", href: "/demo/jour-j", done: false },
  { time: "Aujourd'hui", text: "Relancer Atlas pour la facture FA-2026-0045", detail: "Échue depuis 2 jours · 1 800 €", href: "/demo/facturation", done: false },
  { time: "Aujourd'hui", text: "Répondre à la demande de la Clinique des Vosges", detail: "Devis envoyé le 12 nov., pas encore signé", href: "/demo/clients", done: false },
];

export const sales = {
  course: "Excel : maîtriser les tableaux croisés dynamiques",
  price: "249 €",
  buyers: 38,
  revenue: "9 462 €",
  conversion: "4,1 %",
  refunds: 1,
  reviews: [
    { name: "Martine G.", text: "Enfin compris les segments. Le rapport mensuel me prend dix minutes au lieu d'une heure.", score: 5 },
    { name: "Karim B.", text: "Bien rythmé, les exercices sont tirés de vrais cas de PME.", score: 5 },
    { name: "Élodie P.", text: "Très clair. J'aurais aimé un module sur Power Query.", score: 4 },
  ],
  modules: [
    "Préparer une base propre",
    "Premier tableau croisé en 10 minutes",
    "Filtres, segments et chronologies",
    "Champs et éléments calculés",
    "Mettre à jour un rapport mensuel",
    "Évaluation finale",
  ],
};
