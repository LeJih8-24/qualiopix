"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/actions/auth";
import { updateOrganizationAction } from "@/app/actions/organization";
import { Alert, Field, inputClass, SubmitButton } from "@/components/form";
import { fr, type FieldLabels } from "@/i18n/fr";

const t = fr.organization;

export function OrganizationForm({ initial }: { initial: Record<string, string> }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    updateOrganizationAction,
    {},
  );
  const values = state.values ?? initial;
  const err = state.fieldErrors ?? {};

  const text = (name: keyof FieldLabels, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <Field name={name} label={t.fields[name]} errors={err[name]}>
      <input id={name} name={name} defaultValue={values[name]} aria-invalid={!!err[name]}
        aria-describedby={err[name] ? `${name}-error` : undefined} className={inputClass} {...props} />
    </Field>
  );

  // La clé force le remontage des champs après une erreur, pour réafficher la saisie.
  return (
    <form action={action} key={JSON.stringify(state.values ?? null)} className="flex flex-col gap-6" noValidate>
      {state.ok && <Alert kind="success">{t.saved}</Alert>}

      <Section title={t.sections.identity}>
        {text("legalName", { required: true, autoComplete: "organization" })}
        {text("siret", { inputMode: "numeric", placeholder: "123 456 789 00012" })}
        {text("nda", { inputMode: "numeric" })}
      </Section>

      <Section title={t.sections.qualiopi}>
        {text("qualiopiCertNumber")}
        {text("qualiopiCertValidFrom", { type: "date" })}
        {text("qualiopiCertValidUntil", { type: "date" })}
      </Section>

      <Section title={t.sections.tax}>
        <Field name="vatRegime" label={t.fields.vatRegime} errors={err.vatRegime}>
          <select id="vatRegime" name="vatRegime" defaultValue={values.vatRegime} className={inputClass}>
            <option value="">{t.vat.none}</option>
            <option value="exoneration">{t.vat.exoneration}</option>
            <option value="franchise">{t.vat.franchise}</option>
          </select>
        </Field>
      </Section>

      <Section title={t.sections.contact}>
        {text("address", { autoComplete: "street-address" })}
        {text("postalCode", { inputMode: "numeric", autoComplete: "postal-code" })}
        {text("city", { autoComplete: "address-level2" })}
        {text("phone", { type: "tel", autoComplete: "tel" })}
        {text("contactEmail", { type: "email", autoComplete: "email" })}
      </Section>

      <Section title={t.sections.legal}>
        <Field name="legalMentions" label={t.fields.legalMentions} errors={err.legalMentions}>
          <textarea id="legalMentions" name="legalMentions" rows={4} defaultValue={values.legalMentions}
            className={inputClass} />
        </Field>
      </Section>

      <div>
        <SubmitButton pending={pending}>{t.save}</SubmitButton>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-4 rounded-lg border border-line bg-surface p-5 sm:grid-cols-2">
      <legend className="px-1 text-sm font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}
