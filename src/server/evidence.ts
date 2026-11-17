/**
 * QUA-02 – Moteur de preuves : chaque événement daté est rangé sous ses
 * indicateurs. Les dates sont imposées par la base (RG-03).
 */
import type { Tx } from "@/db";
import { evidence, evidenceIndicators } from "@/db/schema";

export async function recordEvidence(
  tx: Tx,
  input: {
    organizationId: string;
    source: "document" | "signature" | "event" | "manual";
    sourceId?: string | null;
    title: string;
    indicators: number[];
    declaredDate?: string | null;
    fileKey?: string | null;
    sha256?: string | null;
  },
) {
  const [row] = await tx
    .insert(evidence)
    .values({
      organizationId: input.organizationId,
      source: input.source,
      sourceId: input.sourceId ?? null,
      title: input.title,
      declaredDate: input.declaredDate ?? null,
      fileKey: input.fileKey ?? null,
      sha256: input.sha256 ?? null,
    })
    .returning();
  const unique = [...new Set(input.indicators)];
  if (unique.length) {
    await tx.insert(evidenceIndicators).values(
      unique.map((n) => ({
        evidenceId: row.id,
        organizationId: input.organizationId,
        indicatorNumber: n,
      })),
    );
  }
  return row;
}
