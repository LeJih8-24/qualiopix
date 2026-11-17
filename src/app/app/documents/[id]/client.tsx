"use client";

import { useActionState, type ReactNode } from "react";
import type { FormState } from "@/app/actions/auth";
import { requestSignatureAction, saveDraftAction } from "@/app/actions/foundations";
import { Alert, Field, inputClass, SubmitButton } from "@/components/form";
import { fr } from "@/i18n/fr";

const t = fr.documents;

export function DraftEditor({ id, title, body }: { id: string; title: string; body: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveDraftAction, {});
  const v = state.values ?? { title, body };
  const err = state.fieldErrors ?? {};
  const unfilled = [...new Set(v.body.match(/\{\{\s*\w+\s*\}\}/g) ?? [])];
  return (
    <form action={action} className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-5">
      <input type="hidden" name="id" value={id} />
      {state.ok && <Alert kind="success">{t.saved}</Alert>}
      {unfilled.length > 0 && (
        <Alert kind="error">{t.unfilled} {unfilled.join(", ")}</Alert>
      )}
      <Field name="title" label={t.fieldTitle} errors={err.title}>
        <input id="title" name="title" defaultValue={v.title} className={inputClass} required />
      </Field>
      <Field name="body" label={t.fieldBody} hint={t.bodyHint} errors={err.body}>
        <textarea id="body" name="body" defaultValue={v.body} rows={22} className={`${inputClass} font-mono text-xs`} />
      </Field>
      <div><SubmitButton pending={pending}>{t.save}</SubmitButton></div>
    </form>
  );
}

export function SignatureRequestForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(requestSignatureAction, {});
  const err = state.fieldErrors ?? {};
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end" key={state.ok ? "sent" : "form"}>
      <input type="hidden" name="id" value={id} />
      {state.ok && (
        <div className="sm:col-span-3"><Alert kind="success">{t.linkSent(state.values?.signerEmail ?? "")}</Alert></div>
      )}
      <Field name="signerName" label={t.signerName} errors={err.signerName}>
        <input id="signerName" name="signerName" defaultValue={state.ok ? "" : state.values?.signerName} className={inputClass} />
      </Field>
      <Field name="signerEmail" label={t.signerEmail} errors={err.signerEmail}>
        <input id="signerEmail" name="signerEmail" type="email" defaultValue={state.ok ? "" : state.values?.signerEmail} className={inputClass} />
      </Field>
      <SubmitButton pending={pending}>{t.sendLink}</SubmitButton>
    </form>
  );
}

export function ConfirmButton({ message, children }: { message: string; children: ReactNode }) {
  return (
    <button
      type="submit"
      onClick={(e) => { if (!confirm(message)) e.preventDefault(); }}
      className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:bg-accent-strong"
    >
      {children}
    </button>
  );
}
