"use client";

import { useActionState } from "react";
import { signAction, type SignState } from "@/app/actions/foundations";
import { Alert, Field, inputClass, SubmitButton } from "@/components/form";
import { fr } from "@/i18n/fr";

const t = fr.signature;

export function SignForm({ token, defaultName }: { token: string; defaultName: string }) {
  const [state, action, pending] = useActionState<SignState, FormData>(signAction, {});
  if (state.done) {
    return (
      <div className="flex flex-col gap-2">
        <Alert kind="success">{t.done}</Alert>
        <p className="break-all text-xs text-muted">{t.fingerprint} : <code>{state.sha256}</code></p>
      </div>
    );
  }
  return (
    <form action={action} className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-5">
      <input type="hidden" name="token" value={token} />
      {state.error && <Alert kind="error">{state.error}</Alert>}
      <Field name="signerName" label={t.name}>
        <input id="signerName" name="signerName" defaultValue={defaultName} autoComplete="name" className={inputClass} required />
      </Field>
      <label className="flex gap-3 text-sm">
        <input type="checkbox" name="consent" className="mt-1 size-4 shrink-0" required />
        <span>{t.consent}</span>
      </label>
      <div><SubmitButton pending={pending}>{t.submit}</SubmitButton></div>
    </form>
  );
}
