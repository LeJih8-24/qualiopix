import Link from "next/link";
import type { Metadata } from "next";
import { createOrgDocumentAction } from "@/app/actions/foundations";
import { StatusBadge } from "@/components/status";
import { fr } from "@/i18n/fr";
import { latestByKind } from "@/server/documents";
import { ORG_DOCUMENTS } from "@/server/org-documents";
import { requireUser } from "@/server/session";

export const metadata: Metadata = { title: fr.documents.title };

/** ACC-07 – Documents de l'organisme. */
export default async function DocumentsPage() {
  const user = await requireUser();
  const latest = await latestByKind(user.organizationId, ORG_DOCUMENTS.map((d) => d.kind));
  const t = fr.documents;
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{t.title}</h1>
      <p className="text-sm text-muted">{t.intro}</p>
      <ul className="flex flex-col gap-3">
        {ORG_DOCUMENTS.map((def) => {
          const doc = latest[def.kind];
          return (
            <li key={def.kind} className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-surface p-4">
              <div className="mr-auto min-w-0">
                <p className="font-medium">{def.title}</p>
                <p className="text-sm text-muted">{def.description}</p>
              </div>
              {doc ? (
                <>
                  <StatusBadge tone={doc.status === "frozen" ? "ok" : "neutral"}>
                    {doc.status === "frozen" ? t.statusFrozen : t.statusDraft} · {t.version(doc.version)}
                  </StatusBadge>
                  <Link href={`/app/documents/${doc.id}`} className="text-sm text-accent underline">{t.open}</Link>
                </>
              ) : (
                <form action={createOrgDocumentAction}>
                  <input type="hidden" name="kind" value={def.kind} />
                  <button className="rounded-md border border-line px-3 py-1.5 text-sm hover:bg-bg">{t.createFromTemplate}</button>
                </form>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
