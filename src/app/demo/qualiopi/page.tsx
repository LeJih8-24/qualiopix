import type { Metadata } from "next";
import { FileArchive } from "lucide-react";
import { indicatorStates, qualiopiGaps } from "@/demo/data";
import { Button, PageHeader, Panel } from "@/demo/ui";

export const metadata: Metadata = { title: "Qualiopi" };

const CELL = {
  couvert: "bg-tampon text-white",
  "à risque": "bg-white text-brique ring-2 ring-inset ring-brique",
  "non applicable": "bg-transparent text-gris/60 ring-1 ring-inset ring-filet",
} as const;

const CRITERIA = [
  "Information du public",
  "Conception des prestations",
  "Accueil, suivi, évaluation",
  "Moyens pédagogiques",
  "Compétences des intervenants",
  "Environnement professionnel",
  "Appréciations et amélioration",
];

export default function QualiopiDemo() {
  const applicable = indicatorStates.filter((i) => i.state !== "non applicable");
  const covered = applicable.filter((i) => i.state === "couvert").length;
  const proofs = indicatorStates.reduce((a, i) => a + i.proofs, 0);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Préparation Qualiopi"
        lead="Les 33 indicateurs du référentiel. Un indicateur est couvert s'il a au moins une preuve datée des 12 derniers mois ; ceux qui ne vous concernent pas sont écartés automatiquement."
        actions={<Button><FileArchive size={16} aria-hidden /> Exporter le dossier d&apos;audit</Button>}
      />

      <section className="grid gap-8 xl:grid-cols-[13rem_1fr]">
        <div>
          <p className="font-display text-6xl font-extrabold leading-none">{covered}<span className="text-3xl text-gris"> / {applicable.length}</span></p>
          <p className="mt-2 text-gris">indicateurs couverts</p>
          <p className="mt-6 text-sm"><span className="preuve">{proofs} preuves</span> collectées sans saisie depuis janvier</p>
          <ul className="mt-6 space-y-2 text-sm">
            <li className="flex items-center gap-2"><span className="size-4 rounded-sm bg-tampon" aria-hidden /> Couvert</li>
            <li className="flex items-center gap-2"><span className="size-4 rounded-sm ring-2 ring-inset ring-brique" aria-hidden /> À risque</li>
            <li className="flex items-center gap-2"><span className="size-4 rounded-sm ring-1 ring-inset ring-filet" aria-hidden /> Non applicable</li>
          </ul>
        </div>

        <div className="space-y-3">
          {CRITERIA.map((name, idx) => {
            const c = idx + 1;
            const cells = indicatorStates.filter((i) => i.c === c);
            return (
              <div key={c} className="grid items-center gap-3 md:grid-cols-[15rem_1fr]">
                <p className="text-sm"><span className="text-gris">Critère {c}</span> · {name}</p>
                <ul className="flex flex-wrap gap-1.5">
                  {cells.map((i) => (
                    <li
                      key={i.n}
                      title={`${i.n}. ${i.title} : ${i.state}${i.proofs ? `, ${i.proofs} preuves` : ""}`}
                      className={`grid size-11 place-items-center rounded-md font-display text-sm font-bold ${CELL[i.state]}`}
                    >
                      <span className="sr-only">Indicateur </span>{i.n}
                      <span className="sr-only"> : {i.state}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <Panel title="Ce qu'il manque avant l'audit du 12 mars 2027">
        <ul className="divide-y divide-filet">
          {qualiopiGaps.map((g) => {
            const ind = indicatorStates.find((i) => i.n === g.n)!;
            return (
              <li key={g.n} className="flex gap-4 px-5 py-3.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-md font-display font-bold text-brique ring-2 ring-inset ring-brique">{g.n}</span>
                <div>
                  <p className="font-medium">{ind.title}</p>
                  <p className="text-sm text-gris">{g.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}
