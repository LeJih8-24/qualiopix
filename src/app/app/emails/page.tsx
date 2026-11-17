import type { Metadata } from "next";
import { fr } from "@/i18n/fr";
import { DEFAULT_EMAIL_TEMPLATES } from "@/server/email-templates";
import { listEmailTemplateOverrides } from "@/server/messaging";
import { requireUser } from "@/server/session";
import { TemplateForm } from "./template-form";

export const metadata: Metadata = { title: fr.emails.title };

/** NOT-02 – Modèles d'e-mails. */
export default async function EmailsPage() {
  const user = await requireUser();
  const overrides = await listEmailTemplateOverrides(user.organizationId);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{fr.emails.title}</h1>
      <p className="text-sm text-muted">{fr.emails.intro}</p>
      {DEFAULT_EMAIL_TEMPLATES.map((def) => {
        const o = overrides.find((x) => x.key === def.key);
        return (
          <TemplateForm
            key={`${def.key}-${o?.updatedAt?.getTime() ?? 0}`}
            templateKey={def.key}
            label={def.label}
            variables={def.variables}
            customized={!!o}
            subject={o?.subject ?? def.subject}
            body={o?.body ?? def.body}
          />
        );
      })}
    </div>
  );
}
