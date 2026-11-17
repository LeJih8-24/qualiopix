import type { Metadata } from "next";
import { fr } from "@/i18n/fr";
import { listReferents } from "@/server/referents";
import { requireUser } from "@/server/session";
import { ReferentForm } from "./referent-form";

export const metadata: Metadata = { title: fr.referents.title };

const ROLES = ["handicap", "violences", "suppleant_externe"] as const;

/** ACC-08 – Référents. */
export default async function ReferentsPage() {
  const user = await requireUser();
  const refs = await listReferents(user.organizationId);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{fr.referents.title}</h1>
      <p className="text-sm text-muted">{fr.referents.intro}</p>
      {ROLES.map((role) => {
        const r = refs.find((x) => x.role === role);
        return (
          <ReferentForm
            key={role}
            role={role}
            initial={{ fullName: r?.fullName ?? "", email: r?.email ?? "", phone: r?.phone ?? "" }}
          />
        );
      })}
    </div>
  );
}
