import type { Metadata } from "next";
import { Plus, Send } from "lucide-react";
import { clients } from "@/demo/data";
import { Button, PageHeader, Panel, Pill } from "@/demo/ui";

export const metadata: Metadata = { title: "Clients" };

const STATUS_TONE = { Actif: "vert", "Devis envoyé": "jaune", Nouveau: "neutre" } as const;

export default function ClientsDemo() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Clients"
        lead="Entreprises, particuliers et organismes qui vous sous-traitent des sessions."
        actions={
          <>
            <Button variant="ghost"><Send size={16} aria-hidden /> Envoyer un questionnaire de besoin</Button>
            <Button><Plus size={16} aria-hidden /> Nouveau client</Button>
          </>
        }
      />

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-filet text-gris">
              <tr>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Financeur</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 text-right font-medium">Sessions</th>
                <th className="px-5 py-3 text-right font-medium">Facturé en 2026</th>
                <th className="px-5 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-filet">
              {clients.map((c) => (
                <tr key={c.name} className="hover:bg-papier">
                  <td className="px-5 py-3.5">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-gris">{c.sector}</p>
                  </td>
                  <td className="px-5 py-3.5">{c.kind}</td>
                  <td className="px-5 py-3.5">{c.opco ?? "—"}</td>
                  <td className="px-5 py-3.5">{c.contact}</td>
                  <td className="px-5 py-3.5 text-right">{c.sessions}</td>
                  <td className="px-5 py-3.5 text-right font-medium">{c.revenue}</td>
                  <td className="px-5 py-3.5"><Pill tone={STATUS_TONE[c.status]}>{c.status}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Dernière demande reçue depuis votre page catalogue">
        <div className="grid gap-6 px-5 py-5 md:grid-cols-[1fr_1fr]">
          <div>
            <p className="font-medium">Clinique des Vosges · Dr Anne Roth</p>
            <p className="mt-1 text-sm text-gris">« Huit cadres de santé passent en organisation hybride en janvier. Nous cherchons une formation de deux jours sur site. »</p>
          </div>
          <ol className="space-y-2 text-sm">
            <li className="flex gap-3"><span className="text-gris">4 nov.</span>Demande reçue</li>
            <li className="flex gap-3"><span className="text-gris">6 nov.</span><span>Questionnaire de besoin rempli <span className="preuve">ind. 4</span></span></li>
            <li className="flex gap-3"><span className="text-gris">12 nov.</span>Devis envoyé, 2 800 € HT</li>
            <li className="flex gap-3 text-gris"><span>—</span>En attente de signature</li>
          </ol>
        </div>
      </Panel>
    </div>
  );
}
