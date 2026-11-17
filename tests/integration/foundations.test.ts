/** QUA-01 (applicabilité), NOT-01/02 (e-mails, notifications), ACC-08 (référents). */
import { afterAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { withOrg } from "@/db";
import { emailOutbox, organizations } from "@/db/schema";
import { listNotifications, saveEmailTemplate, sendTemplatedEmail, unreadCount } from "@/server/messaging";
import { indicatorBoard } from "@/server/qualiopi";
import { saveReferent } from "@/server/referents";
import { setEmailSender, type EmailSender } from "@/server/integrations/email";
import { adminSql, appDb, newAccount } from "./helpers";
import { outbox } from "./setup-integrations";

afterAll(async () => {
  await adminSql.end();
});

describe("QUA-01 – référentiel et applicabilité", () => {
  it("contient 33 indicateurs, non modifiables par l'application", async () => {
    const a = await newAccount("A");
    const board = await indicatorBoard(a.organizationId, appDb);
    expect(board.rows).toHaveLength(33);
    await expect(appDb.execute("update qualiopi_indicators set title = 'x' where number = 1")).rejects.toThrow();
  });

  it("met hors champ l'apprentissage et, par défaut, les formations certifiantes", async () => {
    const a = await newAccount("A");
    const board = await indicatorBoard(a.organizationId, appDb);
    const na = board.rows.filter((r) => r.status === "not_applicable").map((r) => r.number);
    expect(na).toEqual([3, 7, 13, 14, 15, 16, 20, 28, 29, 33]);
    expect(board.applicable).toBe(23);

    await withOrg(a.organizationId, (tx) =>
      tx.update(organizations).set({ offersCertifying: true }).where(eq(organizations.id, a.organizationId)), appDb);
    const certifying = await indicatorBoard(a.organizationId, appDb);
    expect(certifying.applicable).toBe(26);
  });

  it("RG-11 – une preuve de plus de 12 mois ne couvre plus l'indicateur", async () => {
    const a = await newAccount("A");
    await saveReferent(a.organizationId, a.userId, { role: "handicap", fullName: "Moi", email: "moi@exemple.test" }, appDb);
    const now = await indicatorBoard(a.organizationId, appDb);
    expect(now.rows.find((r) => r.number === 26)?.status).toBe("covered");
    const inThirteenMonths = new Date(Date.now() + 400 * 86_400_000);
    const later = await indicatorBoard(a.organizationId, appDb, inThirteenMonths);
    expect(later.rows.find((r) => r.number === 26)?.status).toBe("at_risk");
  });
});

describe("ACC-08 – référents", () => {
  it("un seul référent par rôle ; une nouvelle preuve seulement si la désignation change", async () => {
    const a = await newAccount("A");
    const save = () => saveReferent(a.organizationId, a.userId, { role: "violences", fullName: "Moi", email: "moi@exemple.test" }, appDb);
    await save();
    await save();
    await saveReferent(a.organizationId, a.userId, { role: "violences", fullName: "Autre", email: "autre@exemple.test" }, appDb);
    const board = await indicatorBoard(a.organizationId, appDb);
    expect(board.rows.find((r) => r.number === 12)?.evidenceCount).toBe(2);
  });
});

describe("NOT-01 / NOT-02 – e-mails et notifications", () => {
  it("envoie le modèle par défaut avec ses variables et trace l'envoi", async () => {
    const a = await newAccount("A");
    outbox.sent.length = 0;
    await sendTemplatedEmail(a.organizationId, {
      templateKey: "signature_request", to: "lea@exemple.test",
      vars: { destinataire: "Léa", document: "Règlement", lien: "https://x/y", expiration: "1er janvier", formateur: "Moi" },
    }, appDb);
    expect(outbox.sent[0].subject).toBe("A Formation – document à signer : Règlement");
    expect(outbox.sent[0].text).toContain("https://x/y");
    const rows = await withOrg(a.organizationId, (tx) => tx.select().from(emailOutbox), appDb);
    expect(rows[0]).toMatchObject({ toEmail: "lea@exemple.test", provider: "log", error: null });
  });

  it("utilise le texte personnalisé par le formateur", async () => {
    const a = await newAccount("A");
    await saveEmailTemplate(a.organizationId, { key: "signature_request", subject: "Signez {{document}}", body: "Lien : {{lien}}" }, appDb);
    outbox.sent.length = 0;
    await sendTemplatedEmail(a.organizationId, { templateKey: "signature_request", to: "x@exemple.test", vars: { document: "RI", lien: "L" } }, appDb);
    expect(outbox.sent[0]).toMatchObject({ subject: "Signez RI", text: "Lien : L" });
  });

  it("un échec d'envoi est tracé et notifié au formateur", async () => {
    const a = await newAccount("A");
    const failing: EmailSender = { name: "test", send: async () => { throw new Error("boîte inconnue"); } };
    setEmailSender(failing);
    try {
      await sendTemplatedEmail(a.organizationId, { templateKey: "signature_request", to: "x@exemple.test", vars: {} }, appDb);
    } finally {
      setEmailSender(outbox);
    }
    expect(await unreadCount(a.organizationId, appDb)).toBe(1);
    const [n] = await listNotifications(a.organizationId, appDb);
    expect(n.body).toBe("boîte inconnue");
  });
});
