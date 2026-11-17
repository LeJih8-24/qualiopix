import type { Metadata } from "next";
import { Download, FileStack } from "lucide-react";
import { invoices } from "@/demo/data";
import { Button, PageHeader, Panel, Pill, sessionTone } from "@/demo/ui";

export const metadata: Metadata = { title: "Facturation" };

export default function FacturationDemo() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Facturation"
        lead="Numérotation continue, mention d'exonération de TVA, subrogation OPCO. Une facture émise ne se supprime pas : elle s'annule par un avoir."
        actions={
          <>
            <Button variant="ghost"><Download size={16} aria-hidden /> Export pour le comptable</Button>
            <Button><FileStack size={16} aria-hidden /> Pièces pour l&apos;OPCO</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Encaissé en novembre", "1 530 €", "vert"],
          ["En attente", "1 050 €", "neutre"],
          ["En retard", "1 800 €", "brique"],
        ].map(([l, v, tone]) => (
          <div key={l} className="rounded-lg border border-filet bg-white px-5 py-4">
            <p className="text-sm text-gris">{l}</p>
            <p className={`mt-1 font-display text-3xl font-extrabold ${tone === "brique" ? "text-brique" : ""}`}>{v}</p>
          </div>
        ))}
      </div>

      <Panel title="Factures">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-filet text-gris">
              <tr>
                <th className="px-5 py-3 font-medium">Numéro</th>
                <th className="px-5 py-3 font-medium">Facturé à</th>
                <th className="px-5 py-3 font-medium">Objet</th>
                <th className="px-5 py-3 font-medium">Émise</th>
                <th className="px-5 py-3 font-medium">Échéance</th>
                <th className="px-5 py-3 text-right font-medium">Montant</th>
                <th className="px-5 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-filet">
              {invoices.map((i) => (
                <tr key={i.number} className="hover:bg-papier">
                  <td className="px-5 py-3.5 font-medium">{i.number}</td>
                  <td className="px-5 py-3.5">{i.client}</td>
                  <td className="px-5 py-3.5 text-gris">{i.label}</td>
                  <td className="px-5 py-3.5">{i.issued}</td>
                  <td className="px-5 py-3.5">{i.due}</td>
                  <td className="px-5 py-3.5 text-right font-medium">{i.amount}</td>
                  <td className="px-5 py-3.5"><Pill tone={i.status === "Brouillon" ? "jaune" : sessionTone(i.status)}>{i.status}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-filet px-5 py-3 text-sm text-gris">
          FA-2026-0047 a été proposée automatiquement à la clôture de la session : 2 380 € pour Akto, 420 € de reste à charge pour la Brasserie Kléber.
        </p>
      </Panel>
    </div>
  );
}
