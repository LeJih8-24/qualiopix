/** NOT-01 / NOT-02 – Envoi d'e-mails tracés et notifications dans l'application. */
import { and, desc, eq, isNull } from "drizzle-orm";
import { withOrg, type Db, type Tx } from "@/db";
import { emailOutbox, emailTemplates, notifications, organizations } from "@/db/schema";
import { findTemplate, renderTemplate } from "./email-templates";
import { recordEvidence } from "./evidence";
import { getEmailSender } from "./integrations/email";

export async function sendTemplatedEmail(
  orgId: string,
  input: {
    templateKey: string;
    to: string;
    toName?: string | null;
    vars: Record<string, string | null | undefined>;
  },
  db?: Db,
) {
  const def = findTemplate(input.templateKey);
  const { org, override } = await withOrg(
    orgId,
    async (tx) => {
      const [org] = await tx.select().from(organizations).where(eq(organizations.id, orgId));
      const [override] = await tx
        .select()
        .from(emailTemplates)
        .where(eq(emailTemplates.key, input.templateKey));
      return { org, override };
    },
    db,
  );
  const vars = { organisme: org.legalName, ...input.vars };
  const subject = renderTemplate(override?.subject ?? def.subject, vars);
  const text = renderTemplate(override?.body ?? def.body, vars);
  const sender = getEmailSender();

  let messageId: string | null = null;
  let error: string | null = null;
  try {
    ({ messageId } = await sender.send({
      to: input.to,
      toName: input.toName,
      subject,
      text,
      fromName: org.legalName,
      replyTo: org.contactEmail,
    }));
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return withOrg(
    orgId,
    async (tx) => {
      const [row] = await tx
        .insert(emailOutbox)
        .values({
          organizationId: orgId,
          templateKey: input.templateKey,
          toEmail: input.to,
          subject,
          body: text,
          provider: sender.name,
          providerMessageId: messageId,
          error,
          sentAt: error ? null : new Date(),
        })
        .returning();
      if (error) {
        await notify(tx, orgId, {
          kind: "email_failed",
          title: `Échec d'envoi à ${input.to}`,
          body: error,
        });
      } else if (def.indicators.length) {
        await recordEvidence(tx, {
          organizationId: orgId,
          source: "event",
          sourceId: row.id,
          title: `E-mail « ${subject} » envoyé à ${input.to}`,
          indicators: def.indicators,
        });
      }
      return row;
    },
    db,
  );
}

export async function notify(
  tx: Tx,
  orgId: string,
  n: { kind: string; title: string; body?: string | null; link?: string | null },
) {
  await tx.insert(notifications).values({ organizationId: orgId, ...n });
}

export async function listNotifications(orgId: string, db?: Db) {
  return withOrg(
    orgId,
    (tx) => tx.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(50),
    db,
  );
}

export async function unreadCount(orgId: string, db?: Db) {
  return withOrg(
    orgId,
    async (tx) =>
      (await tx.select({ id: notifications.id }).from(notifications).where(isNull(notifications.readAt))).length,
    db,
  );
}

export async function markAllRead(orgId: string, db?: Db) {
  await withOrg(
    orgId,
    (tx) =>
      tx
        .update(notifications)
        .set({ readAt: new Date() })
        .where(and(eq(notifications.organizationId, orgId), isNull(notifications.readAt))),
    db,
  );
}

export async function saveEmailTemplate(
  orgId: string,
  input: { key: string; subject: string; body: string },
  db?: Db,
) {
  findTemplate(input.key);
  await withOrg(
    orgId,
    (tx) =>
      tx
        .insert(emailTemplates)
        .values({ organizationId: orgId, ...input })
        .onConflictDoUpdate({
          target: [emailTemplates.organizationId, emailTemplates.key],
          set: { subject: input.subject, body: input.body, updatedAt: new Date() },
        }),
    db,
  );
}

export async function resetEmailTemplate(orgId: string, key: string, db?: Db) {
  await withOrg(orgId, (tx) => tx.delete(emailTemplates).where(eq(emailTemplates.key, key)), db);
}

export async function listEmailTemplateOverrides(orgId: string, db?: Db) {
  return withOrg(orgId, (tx) => tx.select().from(emailTemplates), db);
}
