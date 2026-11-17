"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signupAction, type FormState } from "@/app/actions/auth";
import { Alert, Field, inputClass, SubmitButton } from "@/components/form";
import { fr } from "@/i18n/fr";

const t = fr.auth;

export default function SignupPage() {
  const [state, action, pending] = useActionState<FormState, FormData>(signupAction, {});
  const err = state.fieldErrors ?? {};
  const v = state.values ?? {};
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <h1 className="text-xl font-semibold">{t.signupTitle}</h1>
      {state.error && <Alert kind="error">{state.error}</Alert>}
      <Field name="fullName" label={t.fullName} errors={err.fullName}>
        <input id="fullName" name="fullName" autoComplete="name" defaultValue={v.fullName}
          aria-invalid={!!err.fullName} className={inputClass} required />
      </Field>
      <Field name="legalName" label={t.legalName} errors={err.legalName}>
        <input id="legalName" name="legalName" autoComplete="organization" defaultValue={v.legalName}
          aria-invalid={!!err.legalName} className={inputClass} required />
      </Field>
      <Field name="email" label={t.email} errors={err.email}>
        <input id="email" name="email" type="email" autoComplete="email" defaultValue={v.email}
          aria-invalid={!!err.email} className={inputClass} required />
      </Field>
      <Field name="password" label={t.password} hint={t.passwordHint} errors={err.password}>
        <input id="password" name="password" type="password" autoComplete="new-password"
          aria-invalid={!!err.password} className={inputClass} required minLength={12} />
      </Field>
      <SubmitButton pending={pending}>{t.signupSubmit}</SubmitButton>
      <p className="text-sm text-muted">
        {t.haveAccount}{" "}
        <Link href="/connexion" className="text-accent underline">{t.loginTitle}</Link>
      </p>
    </form>
  );
}
