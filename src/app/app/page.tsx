import Link from "next/link";
import type { Metadata } from "next";
import { fr } from "@/i18n/fr";
import { profileCompleteness } from "@/lib/validation";
import { getOrganization } from "@/server/organization";
import { requireUser } from "@/server/session";

export const metadata: Metadata = { title: fr.dashboard.title };

/** TDB-01 – Tableau de bord du jour (amorce). */
export default async function DashboardPage() {
  const user = await requireUser();
  const org = await getOrganization(user.organizationId);
  const { missing, percent } = profileCompleteness(org ?? {});
  const t = fr.dashboard;
  const labels = fr.organization.fields;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">{t.hello(user.fullName)}</h1>
      <section className="rounded-lg border border-line bg-surface p-5">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-medium">{t.profileProgress}</h2>
          <span className="text-sm tabular-nums text-muted">{percent} %</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded bg-line" role="progressbar"
          aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={t.profileProgress}>
          <div className="h-full bg-accent" style={{ width: `${percent}%` }} />
        </div>
        {missing.length ? (
          <div className="mt-4 text-sm">
            <p className="text-muted">{t.profileMissing}</p>
            <ul className="mt-1 list-inside list-disc">
              {missing.map((k) => <li key={k}>{labels[k]}</li>)}
            </ul>
            <Link href="/app/organisme" className="mt-3 inline-block text-accent underline">
              {t.completeProfile}
            </Link>
          </div>
        ) : (
          <p className="mt-4 text-sm text-success">{t.profileComplete}</p>
        )}
      </section>
      <p className="text-sm text-muted">{t.comingSoon}</p>
    </div>
  );
}
