import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fr } from "@/i18n/fr";
import { getOrganization } from "@/server/organization";
import { requireUser } from "@/server/session";
import { OrganizationForm } from "./organization-form";

export const metadata: Metadata = { title: fr.organization.title };

/** ACC-02 – Profil de l'organisme. */
export default async function OrganizationPage() {
  const user = await requireUser();
  const org = await getOrganization(user.organizationId);
  if (!org) notFound();

  const initial = Object.fromEntries(
    Object.entries(org).map(([k, v]) => [k, v == null ? "" : String(v)]),
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{fr.organization.title}</h1>
      <p className="text-sm text-muted">{fr.organization.intro}</p>
      <OrganizationForm initial={initial} />
    </div>
  );
}
