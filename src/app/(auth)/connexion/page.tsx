"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type FormState } from "@/app/actions/auth";
import { Alert, Field, inputClass, SubmitButton } from "@/components/form";
import { fr } from "@/i18n/fr";

const t = fr.auth;

export default function LoginPage() {
  const [state, action, pending] = useActionState<FormState, FormData>(loginAction, {});
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <h1 className="text-xl font-semibold">{t.loginTitle}</h1>
      {state.error && <Alert kind="error">{state.error}</Alert>}
      <Field name="email" label={t.email}>
        <input id="email" name="email" type="email" autoComplete="email"
          defaultValue={state.values?.email} className={inputClass} required />
      </Field>
      <Field name="password" label={t.password}>
        <input id="password" name="password" type="password" autoComplete="current-password"
          className={inputClass} required />
      </Field>
      <SubmitButton pending={pending}>{t.loginSubmit}</SubmitButton>
      <p className="text-sm text-muted">
        {t.noAccount}{" "}
        <Link href="/inscription" className="text-accent underline">{t.signupTitle}</Link>
      </p>
    </form>
  );
}
