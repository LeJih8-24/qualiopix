import { z } from "zod";
import { getDocument } from "@/server/documents";
import { getStorage } from "@/server/integrations/storage";
import { pdfResponse } from "@/server/http";
import { getCurrentUser } from "@/server/session";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return new Response("Non autorisé", { status: 401 });
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) return new Response("Introuvable", { status: 404 });
  const doc = await getDocument(user.organizationId, id);
  if (!doc?.fileKey) return new Response("Introuvable", { status: 404 });
  const bytes = await getStorage().get(doc.fileKey);
  if (!bytes) return new Response("Fichier manquant", { status: 410 });
  return pdfResponse(bytes, `${doc.title} v${doc.version}.pdf`);
}

