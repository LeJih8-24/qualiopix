import type { Tx } from "@/db";
import { auditLog } from "@/db/schema";

/** Ajoute une entrée au journal des actions (qui, quoi, quand). */
export async function logAction(
  tx: Tx,
  entry: {
    organizationId: string;
    actorUserId: string | null;
    action: string;
    entity: string;
    entityId?: string | null;
    data?: unknown;
  },
) {
  await tx.insert(auditLog).values({
    organizationId: entry.organizationId,
    actorUserId: entry.actorUserId,
    action: entry.action,
    entity: entry.entity,
    entityId: entry.entityId ?? null,
    data: entry.data ?? null,
  });
}
