/**
 * QUA-01 – Référentiel paramétrable et applicabilité selon le profil.
 * RG-11 – Un indicateur est « couvert » s'il a au moins une preuve sur les
 * 12 derniers mois, « à risque » sinon, « non applicable » selon le profil.
 */
import { and, count, eq, gte, max } from "drizzle-orm";
import { withOrg, type Db } from "@/db";
import {
  evidence,
  evidenceIndicators,
  organizations,
  qualiopiIndicators,
  type QualiopiIndicator,
} from "@/db/schema";

export type IndicatorStatus = "covered" | "at_risk" | "not_applicable";

export function isApplicable(
  indicator: Pick<QualiopiIndicator, "applicability" | "outOfProductScope">,
  profile: { offersCertifying: boolean },
) {
  if (indicator.outOfProductScope) return false;
  switch (indicator.applicability) {
    case "all":
      return true;
    case "certifying":
      return profile.offersCertifying;
    default:
      return false;
  }
}

export const COVERAGE_WINDOW_DAYS = 365;

export async function indicatorBoard(orgId: string, db?: Db, now = new Date()) {
  return withOrg(
    orgId,
    async (tx) => {
      const [org] = await tx.select().from(organizations).where(eq(organizations.id, orgId));
      const indicators = await tx.select().from(qualiopiIndicators).orderBy(qualiopiIndicators.number);
      const since = new Date(now.getTime() - COVERAGE_WINDOW_DAYS * 86_400_000);

      const stats = await tx
        .select({
          number: evidenceIndicators.indicatorNumber,
          n: count(),
          last: max(evidence.occurredAt),
        })
        .from(evidenceIndicators)
        .innerJoin(evidence, eq(evidence.id, evidenceIndicators.evidenceId))
        .where(gte(evidence.occurredAt, since))
        .groupBy(evidenceIndicators.indicatorNumber);
      const byNumber = new Map(stats.map((s) => [s.number, s]));

      const rows = indicators.map((ind) => {
        const s = byNumber.get(ind.number);
        const status: IndicatorStatus = !isApplicable(ind, org)
          ? "not_applicable"
          : s && s.n > 0
            ? "covered"
            : "at_risk";
        return { ...ind, status, evidenceCount: s?.n ?? 0, lastEvidenceAt: s?.last ?? null };
      });
      const applicable = rows.filter((r) => r.status !== "not_applicable");
      const covered = applicable.filter((r) => r.status === "covered").length;
      return {
        rows,
        covered,
        applicable: applicable.length,
        score: applicable.length ? Math.round((covered / applicable.length) * 100) : 0,
      };
    },
    db,
  );
}

export async function evidenceForIndicator(orgId: string, indicatorNumber: number, db?: Db) {
  return withOrg(
    orgId,
    (tx) =>
      tx
        .select({
          id: evidence.id,
          title: evidence.title,
          source: evidence.source,
          occurredAt: evidence.occurredAt,
          declaredDate: evidence.declaredDate,
          sha256: evidence.sha256,
        })
        .from(evidence)
        .innerJoin(evidenceIndicators, eq(evidenceIndicators.evidenceId, evidence.id))
        .where(and(eq(evidenceIndicators.indicatorNumber, indicatorNumber)))
        .orderBy(evidence.occurredAt),
    db,
  );
}
