import type { Metadata } from "next";
import { fr } from "@/i18n/fr";
import { resolveAccessLink } from "@/server/access-links";
import { getOrganization } from "@/server/organization";
import { getDocumentForSigning } from "@/server/signatures";
import { SignForm } from "./sign-form";

export const metadata: Metadata = { title: fr.signature.title, robots: { index: false } };

/** Page publique de signature, accessible par lien sécurisé (sans compte). */
export default async function SignPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const link = await resolveAccessLink(token, "sign_document");
  const t = fr.signature;
  const doc = link && (await getDocumentForSigning(link.organizationId, link.subjectId));
  const org = link && (await getOrganization(link.organizationId));

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-semibold">{t.title}</h1>
      {!link || !doc || !org ? (
        <p role="alert" className="text-danger">{t.invalid}</p>
      ) : (
        <>
          <p>{t.intro(org.legalName)}</p>
          <section className="rounded-lg border border-line bg-surface p-5">
            <h2 className="text-lg font-medium">{doc.title}</h2>
            <a href={`/signer/${token}/pdf`} className="mt-2 inline-block text-accent underline">{t.readPdf}</a>
            <pre className="mt-4 max-h-[50vh] overflow-auto whitespace-pre-wrap font-sans text-sm">{doc.body}</pre>
          </section>
          <SignForm token={token} defaultName={link.recipientName ?? ""} />
        </>
      )}
    </main>
  );
}
