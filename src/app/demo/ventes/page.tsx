import type { Metadata } from "next";
import { PlayCircle, Star } from "lucide-react";
import { sales } from "@/demo/data";
import { PageHeader, Panel } from "@/demo/ui";

export const metadata: Metadata = { title: "Ventes en ligne" };

export default function VentesDemo() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Ventes en ligne"
        lead="Vendez un cours en ligne sans autre outil : la page de vente reprend la fiche programme, le paiement ouvre l'accès, la facture part seule."
      />

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          ["Acheteurs", String(sales.buyers)],
          ["Chiffre d'affaires", sales.revenue],
          ["Visiteurs qui achètent", sales.conversion],
          ["Remboursements", String(sales.refunds)],
        ].map(([l, v]) => (
          <div key={l} className="rounded-lg border border-filet bg-white px-5 py-4">
            <p className="text-sm text-gris">{l}</p>
            <p className="mt-1 font-display text-3xl font-extrabold">{v}</p>
          </div>
        ))}
      </div>

      <Panel title="Aperçu de la page de vente" action={<span className="text-sm text-gris">atelier-morel.qualiopix.fr/excel-tcd</span>}>
        <div className="grid gap-8 p-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="grid aspect-video place-items-center rounded-lg bg-encre text-white">
              <PlayCircle size={56} strokeWidth={1.4} aria-label="Vidéo de présentation" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-bold">{sales.course}</h2>
            <p className="mt-2 leading-relaxed text-gris">
              Sept heures en ligne, à votre rythme, avec des exercices tirés de vrais cas de PME. Une évaluation finale et une attestation de fin de formation.
            </p>
            <ol className="mt-5 space-y-2">
              {sales.modules.map((m, i) => (
                <li key={m} className="flex gap-3 border-b border-filet pb-2 text-[15px]">
                  <span className="w-5 text-gris">{i + 1}.</span>{m}
                </li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col gap-5">
            <div className="rounded-lg border-2 border-encre p-5">
              <p className="font-display text-4xl font-extrabold">{sales.price}</p>
              <p className="text-sm text-gris">TTC · ou 3 × 83 € sans frais</p>
              <button type="button" className="mt-4 w-full rounded-md bg-tampon py-3 font-medium text-white hover:bg-tampon-2">Acheter le cours</button>
              <p className="mt-3 text-xs leading-relaxed text-gris">
                Accès immédiat après paiement. Droit de rétractation de 14 jours, auquel vous renoncez si vous demandez l&apos;accès immédiat.
              </p>
            </div>
            <div>
              <p className="flex items-center gap-2 font-medium">
                <Star size={16} className="fill-surligneur text-encre" aria-hidden /> 4,7 / 5
                <span className="text-sm font-normal text-gris">· 31 avis de stagiaires ayant terminé le cours</span>
              </p>
              <ul className="mt-3 space-y-3">
                {sales.reviews.map((r) => (
                  <li key={r.name} className="border-l-2 border-surligneur pl-3 text-sm">
                    <p>« {r.text} »</p>
                    <p className="mt-1 text-gris">{r.name} · {r.score} / 5</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
