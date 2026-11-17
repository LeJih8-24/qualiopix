/**
 * Textes de l'interface (exigence « Langue » : textes séparés du code).
 * Ajouter une langue = ajouter un fichier de même forme.
 */
export const fr = {
  app: {
    name: "Qualiopix",
    tagline: "Concevez, animez, facturez vos formations. Le dossier Qualiopi se construit tout seul.",
  },
  nav: {
    dashboard: "Tableau de bord",
    organization: "Mon organisme",
    logout: "Se déconnecter",
  },
  auth: {
    signupTitle: "Créer mon espace formateur",
    loginTitle: "Se connecter",
    fullName: "Votre nom",
    legalName: "Nom de l'organisme (raison sociale)",
    email: "Adresse e-mail",
    password: "Mot de passe",
    passwordHint: "12 caractères minimum.",
    signupSubmit: "Créer mon espace",
    loginSubmit: "Se connecter",
    haveAccount: "Déjà un compte ?",
    noAccount: "Pas encore de compte ?",
    invalidCredentials: "Adresse e-mail ou mot de passe incorrect.",
    emailTaken: "Un compte existe déjà avec cette adresse.",
  },
  dashboard: {
    title: "Tableau de bord",
    hello: (name: string) => `Bonjour ${name}`,
    profileProgress: "Profil de l'organisme",
    profileMissing: "Champs à compléter :",
    profileComplete: "Votre profil est complet.",
    completeProfile: "Compléter mon profil",
    comingSoon: "Les sessions, le catalogue et le score Qualiopi arrivent dans les prochains lots.",
  },
  organization: {
    title: "Mon organisme",
    intro: "Ces informations figurent sur vos programmes, conventions, attestations et factures.",
    sections: {
      identity: "Identité",
      qualiopi: "Certification Qualiopi",
      tax: "TVA",
      contact: "Coordonnées",
      legal: "Mentions légales",
    },
    fields: {
      legalName: "Raison sociale",
      siret: "SIRET",
      nda: "Numéro de déclaration d'activité",
      qualiopiCertNumber: "Numéro du certificat",
      qualiopiCertValidFrom: "Valide du",
      qualiopiCertValidUntil: "Valide jusqu'au",
      vatRegime: "Régime de TVA",
      address: "Adresse",
      postalCode: "Code postal",
      city: "Ville",
      phone: "Téléphone",
      contactEmail: "E-mail de contact",
      legalMentions: "Mentions légales complémentaires",
    },
    vat: {
      none: "— Choisir —",
      exoneration: "Exonération (art. 261-4-4° a du CGI, attestation fournie)",
      franchise: "Franchise en base (art. 293 B du CGI)",
    },
    save: "Enregistrer",
    saved: "Profil enregistré.",
  },
  validation: {
    required: "Champ obligatoire.",
    email: "Adresse e-mail invalide.",
    passwordLength: "12 caractères minimum.",
    siret: "SIRET invalide (14 chiffres, clé de contrôle).",
    nda: "Le numéro de déclaration d'activité compte 11 chiffres.",
    postalCode: "Code postal à 5 chiffres.",
    date: "Date invalide.",
    certDates: "La date de fin doit suivre la date de début.",
  },
} as const;

export type FieldLabels = typeof fr.organization.fields;
