"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/actions/auth";
import { resetEmailTemplateAction, saveEmailTemplateAction } from "@/app/actions/foundations";
import { Alert, Field, inputClass, SubmitButton } from "@/components/form";
import { StatusBadge } from "@/components/status";
import { fr } from "@/i18n/fr";

const t = fr.emails;

export function TemplateForm(props: {
  templateKey: string;
  label: string;
  variables: string[];
  customized: boolean;
  subject: string;
  body: string;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveEmailTemplateAction, {});
  const v = state.values ?? { subject: props.subject, body: props.body };
  const err = state.fieldErrors ?? {};
  const id = (k: string) => `${props.templateKey}-${k}`;
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-5">
      <div className="flex items-center gap-2">
        <h2 className="mr-auto font-medium">{props.label}</h2>
        {props.customized && <StatusBadge tone="neutral">{t.customized}</StatusBadge>}
      </div>
      <form action={action} className="flex flex-col gap-3">
        <input type="hidden" name="key" value={props.templateKey} />
        {state.ok && <Alert kind="success">{t.saved}</Alert>}
        <Field name={id("subject")} label={t.subject} errors={err.subject}>
          <input id={id("subject")} name="subject" defaultValue={v.subject} className={inputClass} />
        </Field>
        <Field name={id("body")} label={t.body} errors={err.body}>
          <textarea id={id("body")} name="body" rows={9} defaultValue={v.body} className={inputClass} />
        </Field>
        <p className="text-xs text-muted">
          {t.variables} {props.variables.map((x) => `{{${x}}}`).join(", ")}
        </p>
        <div><SubmitButton pending={pending}>{t.save}</SubmitButton></div>
      </form>
      {props.customized && (
        <form action={resetEmailTemplateAction}>
          <input type="hidden" name="key" value={props.templateKey} />
          <button className="text-sm text-muted underline hover:text-ink">{t.reset}</button>
        </form>
      )}
    </section>
  );
}
