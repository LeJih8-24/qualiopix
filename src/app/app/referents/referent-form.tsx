"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/actions/auth";
import { saveReferentAction } from "@/app/actions/foundations";
import { Alert, Field, inputClass, SubmitButton } from "@/components/form";
import { fr } from "@/i18n/fr";

const t = fr.referents;
type Role = keyof typeof t.roles;

export function ReferentForm({ role, initial }: { role: Role; initial: Record<string, string> }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveReferentAction, {});
  const v = state.values ?? initial;
  const err = state.fieldErrors ?? {};
  const id = (k: string) => `${role}-${k}`;
  return (
    <form action={action} className="grid gap-4 rounded-lg border border-line bg-surface p-5 sm:grid-cols-3">
      <input type="hidden" name="role" value={role} />
      <div className="sm:col-span-3">
        <h2 className="font-medium">{t.roles[role]}</h2>
        <p className="text-sm text-muted">{t.hints[role]}</p>
      </div>
      {state.ok && <div className="sm:col-span-3"><Alert kind="success">{t.saved}</Alert></div>}
      <Field name={id("fullName")} label={t.fullName} errors={err.fullName}>
        <input id={id("fullName")} name="fullName" defaultValue={v.fullName} className={inputClass} />
      </Field>
      <Field name={id("email")} label={t.email} errors={err.email}>
        <input id={id("email")} name="email" type="email" defaultValue={v.email} className={inputClass} />
      </Field>
      <Field name={id("phone")} label={t.phone} errors={err.phone}>
        <input id={id("phone")} name="phone" type="tel" defaultValue={v.phone} className={inputClass} />
      </Field>
      <div><SubmitButton pending={pending}>{t.save}</SubmitButton></div>
    </form>
  );
}
