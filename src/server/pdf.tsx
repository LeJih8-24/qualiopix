/**
 * Rendu PDF des documents à partir d'un Markdown simple :
 * « # » / « ## » titres, « - » listes, lignes vides = paragraphes.
 */
import { Document, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import type { Organization } from "@/db/schema";

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 10.5, lineHeight: 1.45, fontFamily: "Helvetica", color: "#1c1f24" },
  header: { marginBottom: 20, borderBottom: "1pt solid #d9d6cd", paddingBottom: 8 },
  org: { fontSize: 9, color: "#5b616b" },
  title: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 14 },
  h1: { fontSize: 14, fontFamily: "Helvetica-Bold", marginTop: 12, marginBottom: 6 },
  h2: { fontSize: 12, fontFamily: "Helvetica-Bold", marginTop: 10, marginBottom: 4 },
  p: { marginBottom: 6 },
  li: { flexDirection: "row", marginBottom: 3, paddingLeft: 8 },
  bullet: { width: 10 },
  footer: { position: "absolute", bottom: 24, left: 48, right: 48, fontSize: 8, color: "#5b616b", textAlign: "center" },
});

type Block = { type: "h1" | "h2" | "p" | "li"; text: string };

export function parseBlocks(body: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) blocks.push({ type: "p", text: para.join(" ") });
    para = [];
  };
  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) flush();
    else if (line.startsWith("## ")) { flush(); blocks.push({ type: "h2", text: line.slice(3) }); }
    else if (line.startsWith("# ")) { flush(); blocks.push({ type: "h1", text: line.slice(2) }); }
    else if (/^[-*] /.test(line)) { flush(); blocks.push({ type: "li", text: line.slice(2) }); }
    else para.push(line);
  }
  flush();
  return blocks;
}

export async function renderDocumentPdf(input: {
  title: string;
  body: string;
  version: number;
  organization: Pick<Organization, "legalName" | "siret" | "nda" | "address" | "postalCode" | "city">;
}): Promise<Uint8Array> {
  const o = input.organization;
  const orgLine = [o.legalName, o.siret && `SIRET ${o.siret}`, o.nda && `NDA ${o.nda}`]
    .filter(Boolean)
    .join(" · ");
  const address = [o.address, [o.postalCode, o.city].filter(Boolean).join(" ")].filter(Boolean).join(", ");

  const doc = (
    <Document title={input.title} author={o.legalName} producer="Qualiopix">
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Text style={styles.org}>{orgLine}</Text>
          {address ? <Text style={styles.org}>{address}</Text> : null}
        </View>
        <Text style={styles.title}>{input.title}</Text>
        {parseBlocks(input.body).map((b, i) =>
          b.type === "li" ? (
            <View key={i} style={styles.li}>
              <Text style={styles.bullet}>•</Text>
              <Text style={{ flex: 1 }}>{b.text}</Text>
            </View>
          ) : (
            <Text key={i} style={styles[b.type]}>{b.text}</Text>
          ),
        )}
        <Text
          style={styles.footer}
          fixed
          render={({ pageNumber, totalPages }) =>
            `${input.title} · version ${input.version} · page ${pageNumber}/${totalPages}`
          }
        />
      </Page>
    </Document>
  );
  return new Uint8Array(await renderToBuffer(doc));
}
