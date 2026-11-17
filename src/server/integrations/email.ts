/**
 * E-mail transactionnel derrière une interface, pour changer de fournisseur.
 * - Sans BREVO_API_KEY : envoi simulé (journal serveur), pratique en développement.
 * - Avec BREVO_API_KEY : API Brevo (fournisseur européen).
 */
export type OutgoingEmail = {
  to: string;
  toName?: string | null;
  subject: string;
  text: string;
  replyTo?: string | null;
  fromName: string;
};

export interface EmailSender {
  readonly name: string;
  send(email: OutgoingEmail): Promise<{ messageId: string | null }>;
}

export class LogEmailSender implements EmailSender {
  readonly name = "log";
  sent: OutgoingEmail[] = [];
  async send(email: OutgoingEmail) {
    this.sent.push(email);
    if (process.env.NODE_ENV !== "test") {
      console.info(`[e-mail simulé] à ${email.to} : ${email.subject}\n${email.text}\n`);
    }
    return { messageId: null };
  }
}

export class BrevoEmailSender implements EmailSender {
  readonly name = "brevo";
  constructor(private apiKey: string, private fromEmail: string) {}
  async send(email: OutgoingEmail) {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": this.apiKey, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { email: this.fromEmail, name: email.fromName },
        to: [{ email: email.to, name: email.toName ?? undefined }],
        replyTo: email.replyTo ? { email: email.replyTo } : undefined,
        subject: email.subject,
        textContent: email.text,
      }),
    });
    if (!res.ok) throw new Error(`Brevo ${res.status} : ${await res.text()}`);
    const json = (await res.json()) as { messageId?: string };
    return { messageId: json.messageId ?? null };
  }
}

let sender: EmailSender | null = null;

export function getEmailSender(): EmailSender {
  if (!sender) {
    const key = process.env.BREVO_API_KEY;
    sender = key
      ? new BrevoEmailSender(key, process.env.EMAIL_FROM ?? "no-reply@qualiopix.fr")
      : new LogEmailSender();
  }
  return sender;
}

export function setEmailSender(s: EmailSender) {
  sender = s;
}
