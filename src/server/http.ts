export function pdfResponse(bytes: Uint8Array, filename: string) {
  return new Response(Buffer.from(bytes), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "cache-control": "private, no-store",
    },
  });
}
