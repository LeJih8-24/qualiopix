/**
 * NOT-02 – Modèles d'e-mails par défaut. Le formateur peut remplacer l'objet
 * et le texte ; les variables {{nom}} restent disponibles.
 */
export type EmailTemplateDef = {
  key: string;
  label: string;
  subject: string;
  body: string;
  variables: string[];
  /** Indicateurs prouvés par l'envoi. */
  indicators: number[];
};

export const DEFAULT_EMAIL_TEMPLATES: EmailTemplateDef[] = [
  {
    key: "signature_request",
    label: "Demande de signature",
    subject: "{{organisme}} – document à signer : {{document}}",
    body:
      "Bonjour {{destinataire}},\n\n" +
      "{{organisme}} vous invite à lire et signer le document « {{document}} ».\n\n" +
      "Ouvrir le document : {{lien}}\n\n" +
      "Ce lien est personnel et valable jusqu'au {{expiration}}.\n\n" +
      "Bien cordialement,\n{{formateur}}",
    variables: ["destinataire", "organisme", "document", "lien", "expiration", "formateur"],
    indicators: [],
  },
  {
    key: "signature_confirmation",
    label: "Confirmation de signature",
    subject: "{{organisme}} – vous avez signé « {{document}} »",
    body:
      "Bonjour {{destinataire}},\n\n" +
      "Votre signature du document « {{document}} » a bien été enregistrée le {{date}}.\n" +
      "Empreinte du document signé (SHA-256) : {{empreinte}}\n\n" +
      "Bien cordialement,\n{{organisme}}",
    variables: ["destinataire", "organisme", "document", "date", "empreinte"],
    indicators: [],
  },
];

export function findTemplate(key: string) {
  const t = DEFAULT_EMAIL_TEMPLATES.find((x) => x.key === key);
  if (!t) throw new Error(`Modèle d'e-mail inconnu : ${key}`);
  return t;
}

/** Remplace {{variable}} ; une variable absente reste visible pour être repérée. */
export function renderTemplate(text: string, vars: Record<string, string | null | undefined>) {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, name: string) => vars[name] ?? m);
}
