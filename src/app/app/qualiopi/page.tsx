import type { Metadata } from "next";
import { setOffersCertifyingAction } from "@/app/actions/foundations";
import { StatusBadge } from "@/components/status";
import { fr } from "@/i18n/fr";
import { getOrganization } from "@/server/organization";
import { indicatorBoard } from "@/server/qualiopi";
import { requireUser } from "@/server/session";

export const metadata: Metadata = { title: fr.qualiopi.title };

const TONE = { covered: "ok", at_risk: "warn", not_applicable: "neutral" } as const;

/** QUA-01 / QUA-02 – Référentiel et classement des preuves (amorce du score QUA-03). */
export default async function QualiopiPage() {
  const user = await requireUser();
  const [board, org] = await Promise.all([
    indicatorBoard(user.organizationId),
    getOrganization(user.organizationId),
  ]);
  const t = fr.qualiopi;
  const criteria = [...new Set(board.rows.map((r) => r.criterion))];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">{t.title}</h1>
      <p className="text-sm text-muted">{t.intro}</p>

      <section className="flex flex-wrap items-center gap-6 rounded-lg border border-line bg-surface p-5">
        <div>
          <p className="text-3xl font-semibold tabular-nums">{board.covered} / {board.applicable}</p>
          <p className="text-sm text-muted">{t.score}</p>
        </div>
        <form action={setOffersCertifyingAction} className="ml-auto">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="offersCertifying" defaultChecked={org?.offersCertifying} className="size-4" />
            {t.offersCertifying}
            <button className="ml-2 rounded-md border border-line px-2 py-1 text-xs hover:bg-bg">OK</button>
          </label>
        </form>
      </section>

      {criteria.map((c) => (
        <section key={c} className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{t.criterion(c)}</h2>
          <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
            {board.rows.filter((r) => r.criterion === c).map((r) => (
              <li key={r.number} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                <span className="w-8 shrink-0 font-semibold tabular-nums">{r.number}</span>
                <span className={`mr-auto min-w-0 flex-1 ${r.status === "not_applicable" ? "text-muted" : ""}`}>{r.title}</span>
                {r.evidenceCount > 0 && <span className="text-xs text-muted">{t.evidence(r.evidenceCount)}</span>}
                <StatusBadge tone={TONE[r.status]}>{t.status[r.status]}</StatusBadge>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="text-xs text-muted">{t.reviewNote}</p>
    </div>
  );
}
