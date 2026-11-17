"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { withOrg } from "@/db";
import { organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { fr } from "@/i18n/fr";
import { createAccessLink, resolveAccessLink } from "@/server/access-links";
import {
  createDraft,
  createNewVersion,
  freezeDocument,
  updateDraft,
} from "@/server/documents";
import { markAllRead, resetEmailTemplate, saveEmailTemplate, sendTemplatedEmail } from "@/server/messaging";
import { fillOrgTemplate, orgDocumentDef } from "@/server/org-documents";
import { listReferents, saveReferent, type ReferentRole } from "@/server/referents";
import { AlreadySignedError, signDocument } from "@/server/signatures";
import { getOrganization } from "@/server/organization";
import { requireUser } from "@/server/session";
import type { FormState } from "./auth";

const appUrl = () => process.env.APP_URL ?? "http://localhost:3000";
const dateFr = (d: Date) => d.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" });

// --- Documents (ACC-07, RG-02) --------------------------------------------

export async function createOrgDocumentAction(formData: FormData) {
  const user = await requireUser();
  const def = orgDocumentDef(String(formData.get("kind")));
  if (!def) throw new Error("Type de document inconnu");
  const org = await getOrganization(user.organizationId);
  const refs = await listReferents(user.organizationId);
  const ref = (role: ReferentRole) => {
    const r = refs.find((x) => x.role === role);
    return r ? `${r.fullName} (${r.email})` : null;
  };
  const body = fillOrgTemplate(def.template, {
    organisme: org?.legalName,
    formateur: user.fullName,
    email: org?.contactEmail ?? user.email,
    telephone: org?.phone,
    referent_handicap: ref("handicap"),
    referent_violences: ref("violences"),
    suppleant: ref("suppleant_externe"),
  });
  const doc = await createDraft(user.organizationId, user.userId, { kind: def.kind, title: def.title, body });
  redirect(`/app/documents/${doc.id}`);
}

const draftSchema = z.object({
  id: z.uuid(),
  title: z.string().trim().min(1, fr.validation.required).max(200),
  body: z.string().max(100_000),
});

export async function saveDraftAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const values = {
    id: String(formData.get("id")),
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
  };
  const parsed = draftSchema.safeParse(values);
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  await updateDraft(user.organizationId, user.userId, parsed.data.id, parsed.data);
  revalidatePath(`/app/documents/${parsed.data.id}`);
  return { ok: true, values };
}

export async function freezeDocumentAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id"));
  await freezeDocument(user.organizationId, user.userId, id);
  revalidatePath(`/app/documents/${id}`);
}

export async function newVersionAction(formData: FormData) {
  const user = await requireUser();
  const next = await createNewVersion(user.organizationId, user.userId, String(formData.get("id")));
  redirect(`/app/documents/${next.id}`);
}

const signRequestSchema = z.object({
  id: z.uuid(),
  signerName: z.string().trim().min(1, fr.validation.required).max(200),
  signerEmail: z.string().trim().toLowerCase().email(fr.validation.email),
});

export async function requestSignatureAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const values = {
    id: String(formData.get("id")),
    signerName: String(formData.get("signerName") ?? ""),
    signerEmail: String(formData.get("signerEmail") ?? ""),
  };
  const parsed = signRequestSchema.safeParse(values);
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  const { id, signerName, signerEmail } = parsed.data;

  // Le document est figé avant l'envoi : le destinataire signe exactement ce qui a été envoyé.
  const doc = await freezeDocument(user.organizationId, user.userId, id);
  const { token, expiresAt } = await withOrg(user.organizationId, (tx) =>
    createAccessLink(tx, {
      organizationId: user.organizationId,
      purpose: "sign_document",
      subjectType: "document",
      subjectId: doc.id,
      recipientName: signerName,
      recipientEmail: signerEmail,
    }),
  );
  await sendTemplatedEmail(user.organizationId, {
    templateKey: "signature_request",
    to: signerEmail,
    toName: signerName,
    vars: {
      destinataire: signerName,
      document: doc.title,
      lien: `${appUrl()}/signer/${token}`,
      expiration: dateFr(expiresAt),
      formateur: user.fullName,
    },
  });
  revalidatePath(`/app/documents/${id}`);
  return { ok: true, values: { signerEmail } };
}

// --- Signature publique ---------------------------------------------------

export type SignState = { error?: string; done?: boolean; sha256?: string };

export async function signAction(_prev: SignState, formData: FormData): Promise<SignState> {
  const token = String(formData.get("token") ?? "");
  const link = await resolveAccessLink(token, "sign_document");
  if (!link) return { error: fr.signature.invalid };
  const signerName = String(formData.get("signerName") ?? "").trim();
  if (!signerName) return { error: fr.validation.required };
  if (formData.get("consent") !== "on") return { error: fr.signature.consentRequired };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? null;
  try {
    const { document, signature } = await signDocument(link.organizationId, {
      documentId: link.subjectId,
      signerName,
      signerEmail: link.recipientEmail,
      signerRole: "stagiaire",
      ip,
      userAgent: h.get("user-agent"),
    });
    if (link.recipientEmail) {
      await sendTemplatedEmail(link.organizationId, {
        templateKey: "signature_confirmation",
        to: link.recipientEmail,
        toName: signerName,
        vars: {
          destinataire: signerName,
          document: document.title,
          date: signature.signedAt.toLocaleString("fr-FR", { timeZone: "Europe/Paris" }),
          empreinte: signature.documentSha256,
        },
      });
    }
    return { done: true, sha256: signature.documentSha256 };
  } catch (e) {
    if (e instanceof AlreadySignedError) return { error: fr.signature.already };
    throw e;
  }
}

// --- Référents (ACC-08) ---------------------------------------------------

const referentSchema = z.object({
  role: z.enum(["handicap", "violences", "suppleant_externe"]),
  fullName: z.string().trim().min(1, fr.validation.required).max(200),
  email: z.string().trim().toLowerCase().email(fr.validation.email),
  phone: z.string().trim().max(30).transform((v) => v || null),
});

export async function saveReferentAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const values = Object.fromEntries(
    ["role", "fullName", "email", "phone"].map((k) => [k, String(formData.get(k) ?? "")]),
  );
  const parsed = referentSchema.safeParse(values);
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  await saveReferent(user.organizationId, user.userId, parsed.data);
  revalidatePath("/app/referents");
  return { ok: true, values };
}

// --- Qualiopi -------------------------------------------------------------

export async function setOffersCertifyingAction(formData: FormData) {
  const user = await requireUser();
  const value = formData.get("offersCertifying") === "on";
  await withOrg(user.organizationId, (tx) =>
    tx.update(organizations).set({ offersCertifying: value }).where(eq(organizations.id, user.organizationId)),
  );
  revalidatePath("/app/qualiopi");
}

// --- E-mails et notifications (NOT-01, NOT-02) -----------------------------

const templateSchema = z.object({
  key: z.string().min(1),
  subject: z.string().trim().min(1, fr.validation.required).max(300),
  body: z.string().trim().min(1, fr.validation.required).max(20_000),
});

export async function saveEmailTemplateAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const values = Object.fromEntries(["key", "subject", "body"].map((k) => [k, String(formData.get(k) ?? "")]));
  const parsed = templateSchema.safeParse(values);
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  await saveEmailTemplate(user.organizationId, parsed.data);
  revalidatePath("/app/emails");
  return { ok: true, values };
}

export async function resetEmailTemplateAction(formData: FormData) {
  const user = await requireUser();
  await resetEmailTemplate(user.organizationId, String(formData.get("key")));
  revalidatePath("/app/emails");
}

export async function markAllReadAction() {
  const user = await requireUser();
  await markAllRead(user.organizationId);
  revalidatePath("/app", "layout");
}
