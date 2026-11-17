/** ACC-08 – Référents handicap, violences et harcèlement, suppléant extérieur. */
import { eq } from "drizzle-orm";
import { withOrg, type Db } from "@/db";
import { referents } from "@/db/schema";
import { logAction } from "./audit";
import { recordEvidence } from "./evidence";

export type ReferentRole = (typeof referents.$inferInsert)["role"];

export const REFERENT_INDICATORS: Record<ReferentRole, number[]> = {
  handicap: [26],
  violences: [12],
  suppleant_externe: [12],
};

export async function listReferents(orgId: string, db?: Db) {
  return withOrg(orgId, (tx) => tx.select().from(referents), db);
}

export async function saveReferent(
  orgId: string,
  actorUserId: string,
  input: { role: ReferentRole; fullName: string; email: string; phone?: string | null },
  db?: Db,
) {
  return withOrg(
    orgId,
    async (tx) => {
      const [before] = await tx.select().from(referents).where(eq(referents.role, input.role));
      const [row] = await tx
        .insert(referents)
        .values({ organizationId: orgId, ...input })
        .onConflictDoUpdate({
          target: [referents.organizationId, referents.role],
          set: { fullName: input.fullName, email: input.email, phone: input.phone ?? null, updatedAt: new Date() },
        })
        .returning();
      const changed =
        !before || before.fullName !== row.fullName || before.email !== row.email || before.phone !== row.phone;
      if (changed) {
        await recordEvidence(tx, {
          organizationId: orgId,
          source: "event",
          sourceId: row.id,
          title: `Désignation du référent (${input.role}) : ${input.fullName}`,
          indicators: REFERENT_INDICATORS[input.role],
        });
        await logAction(tx, {
          organizationId: orgId, actorUserId, action: "referent.saved", entity: "referent", entityId: row.id,
          data: { role: input.role },
        });
      }
      return row;
    },
    db,
  );
}
