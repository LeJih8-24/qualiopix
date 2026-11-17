import { pdfResponse } from "@/server/http";
import { resolveAccessLink } from "@/server/access-links";
import { getStorage } from "@/server/integrations/storage";
import { getDocumentForSigning } from "@/server/signatures";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const link = await resolveAccessLink(token, "sign_document");
  if (!link) return new Response("Lien invalide ou expiré", { status: 404 });
  const doc = await getDocumentForSigning(link.organizationId, link.subjectId);
  if (!doc?.fileKey) return new Response("Introuvable", { status: 404 });
  const bytes = await getStorage().get(doc.fileKey);
  if (!bytes) return new Response("Fichier manquant", { status: 410 });
  return pdfResponse(bytes, `${doc.title}.pdf`);
}
