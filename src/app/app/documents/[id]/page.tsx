import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { freezeDocumentAction, newVersionAction } from "@/app/actions/foundations";
import { StatusBadge } from "@/components/status";
import { fr } from "@/i18n/fr";
import { getDocument, versionHistory } from "@/server/documents";
import { requireUser } from "@/server/session";
import { listSignatures } from "@/server/signatures";
import { ConfirmButton, DraftEditor, SignatureRequestForm } from "./client";

const fmt = (d: Date) => d.toLocaleString("fr-FR", { timeZone: "Europe/Paris", dateStyle: "short", timeStyle: "short" });

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const user = await requireUser();
  const doc = await getDocument(user.organizationId, id);
  if (!doc) notFound();
  const [history, sigs] = await Promise.all([
    versionHistory(user.organizationId, doc.kind),
    listSignatures(user.organizationId, doc.id),
  ]);
  const t = fr.documents;
  const frozen = doc.status === "frozen";
  const latest = history[0]?.id === doc.id;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/app/documents" className="text-sm text-accent underline">← {t.back}</Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-2xl font-semibold">{doc.title}</h1>
        <StatusBadge tone={frozen ? "ok" : "neutral"}>
          {frozen ? t.statusFrozen : t.statusDraft} · {t.version(doc.version)}
        </StatusBadge>
      </div>

      {frozen ? (
        <section className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-5 text-sm">
          <p>{t.frozenAt(fmt(doc.frozenAt!))}</p>
          <p className="break-all text-muted">{t.fingerprint} : <code>{doc.sha256}</code></p>
          <div className="flex flex-wrap gap-3">
            <a href={`/app/documents/${doc.id}/pdf`} className="rounded-md border border-line px-3 py-1.5 hover:bg-bg">{t.downloadPdf}</a>
            {latest && (
              <form action={newVersionAction}>
                <input type="hidden" name="id" value={doc.id} />
                <button className="rounded-md border border-line px-3 py-1.5 hover:bg-bg">{t.newVersion}</button>
              </form>
            )}
          </div>
          <pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap rounded border border-line bg-bg p-3 font-sans">{doc.body}</pre>
        </section>
      ) : (
        <>
          <DraftEditor id={doc.id} title={doc.title} body={doc.body} />
          <form action={freezeDocumentAction}>
            <input type="hidden" name="id" value={doc.id} />
            <ConfirmButton message={t.freezeConfirm}>{t.freeze}</ConfirmButton>
          </form>
        </>
      )}

      {latest && (
        <section className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-5">
          <h2 className="font-medium">{t.requestSignature}</h2>
          <SignatureRequestForm id={doc.id} />
        </section>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="font-medium">{t.signatures}</h2>
        {sigs.length === 0 ? (
          <p className="text-sm text-muted">{t.noSignatures}</p>
        ) : (
          <ul className="text-sm">
            {sigs.map((s) => (
              <li key={s.id}>{s.signerName} {s.signerEmail && `(${s.signerEmail})`} · {fmt(s.signedAt)}</li>
            ))}
          </ul>
        )}
      </section>

      {history.length > 1 && (
        <section className="flex flex-col gap-2">
          <h2 className="font-medium">{t.history}</h2>
          <ul className="text-sm">
            {history.map((v) => (
              <li key={v.id}>
                <Link href={`/app/documents/${v.id}`} className={v.id === doc.id ? "font-medium" : "text-accent underline"}>
                  {t.version(v.version)}
                </Link>{" "}
                · {v.status === "frozen" ? t.frozenAt(fmt(v.frozenAt!)) : t.statusDraft}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
