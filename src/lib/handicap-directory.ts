/**
 * VEI-01 – Annuaire handicap (ind. 26). Données nationales ; les contacts
 * régionaux (Ressource Handicap Formation, Cap emploi) se trouvent depuis ces
 * sites. Liens à revérifier périodiquement par l'administrateur.
 */
export type DirectoryEntry = { name: string; role: string; url: string };

export const HANDICAP_DIRECTORY: DirectoryEntry[] = [
  {
    name: "Agefiph",
    role:
      "Aides et services pour l'emploi et la formation des personnes handicapées dans le secteur privé ; " +
      "anime les Ressources Handicap Formation (RHF) en région, qui conseillent les organismes de formation sur les adaptations.",
    url: "https://www.agefiph.fr",
  },
  {
    name: "Cap emploi",
    role: "Accompagnement des personnes handicapées et des employeurs ; contacts départementaux.",
    url: "https://www.francetravail.fr",
  },
  {
    name: "FIPHFP",
    role: "Équivalent de l'Agefiph pour les employeurs publics (stagiaires agents publics).",
    url: "https://www.fiphfp.fr",
  },
  {
    name: "Mon parcours handicap",
    role: "Portail public d'information sur les droits, la formation et l'emploi des personnes handicapées.",
    url: "https://www.monparcourshandicap.gouv.fr",
  },
  {
    name: "MDPH",
    role: "Maison départementale des personnes handicapées : reconnaissance de la qualité de travailleur handicapé (RQTH).",
    url: "https://www.monparcourshandicap.gouv.fr/annuaire",
  },
];
