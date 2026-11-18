"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { indicatorStates, qualiopiGaps } from "@/demo/data";
import { INDICATOR_DETAILS } from "@/demo/indicators";
import { Panel, Pill } from "@/demo/ui";

const CELL = {
  couvert: "bg-tampon text-white hover:bg-tampon-2",
  "à risque": "bg-white text-brique ring-2 ring-inset ring-brique hover:bg-brique/10",
  "non applicable": "bg-transparent text-gris/60 ring-1 ring-inset ring-filet hover:bg-white",
} as const;

const TONE = { couvert: "vert", "à risque": "brique", "non applicable": "neutre" } as const;

const CRITERIA = [
  "Information du public",
  "Conception des prestations",
  "Accueil, suivi, évaluation",
  "Moyens pédagogiques",
  "Compétences des intervenants",
  "Environnement professionnel",
  "Appréciations et amélioration",
];

export function QualiopiBoard() {
  const [selected, setSelected] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (selected !== null && !d.open) d.showModal();
    if (selected === null && d.open) d.close();
  }, [selected]);

  const applicable = indicatorStates.filter((i) => i.state !== "non applicable");
  const covered = applicable.filter((i) => i.state === "couvert").length;
  const proofs = indicatorStates.reduce((a, i) => a + i.proofs, 0);

  return (
    <>
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
          <p className="mt-6 text-sm text-gris">Cliquez sur un indicateur pour voir ce qu&apos;il demande et les preuves qui le remplissent.</p>
        </div>

        <div className="space-y-3">
          {CRITERIA.map((name, idx) => {
            const c = idx + 1;
            return (
              <div key={c} className="grid items-center gap-3 md:grid-cols-[15rem_1fr]">
                <p className="text-sm"><span className="text-gris">Critère {c}</span> · {name}</p>
                <ul className="flex flex-wrap gap-1.5">
                  {indicatorStates.filter((i) => i.c === c).map((i) => (
                    <li key={i.n}>
                      <button
                        type="button"
                        onClick={() => setSelected(i.n)}
                        aria-haspopup="dialog"
                        aria-label={`Indicateur ${i.n}, ${i.title} : ${i.state}`}
                        title={i.title}
                        className={`grid size-11 place-items-center rounded-md font-display text-sm font-bold transition-colors ${CELL[i.state]}`}
                      >
                        {i.n}
                      </button>
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
              <li key={g.n}>
                <button type="button" onClick={() => setSelected(g.n)} aria-haspopup="dialog" className="flex w-full gap-4 px-5 py-3.5 text-left hover:bg-papier">
                  <span className="grid size-9 shrink-0 place-items-center rounded-md font-display font-bold text-brique ring-2 ring-inset ring-brique">{g.n}</span>
                  <span>
                    <span className="block font-medium">{ind.title}</span>
                    <span className="block text-sm text-gris">{g.text}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Panel>

      <dialog
        ref={dialogRef}
        onClose={() => setSelected(null)}
        onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
        aria-labelledby="indicator-title"
        className="proto m-0 ml-auto h-dvh max-h-dvh w-full max-w-lg overflow-y-auto bg-white p-0 text-encre shadow-2xl backdrop:bg-encre/40 max-sm:mt-auto max-sm:h-[85dvh] max-sm:rounded-t-2xl"
      >
        {selected !== null && <IndicatorDetailView n={selected} onClose={() => setSelected(null)} onSelect={setSelected} />}
      </dialog>
    </>
  );
}

function IndicatorDetailView({ n, onClose, onSelect }: { n: number; onClose: () => void; onSelect: (n: number) => void }) {
  const ind = indicatorStates.find((i) => i.n === n)!;
  const d = INDICATOR_DETAILS[n];
  const more = Math.max(0, ind.proofs - d.proofs.length);
  const prev = n > 1 ? n - 1 : null;
  const next = n < 33 ? n + 1 : null;

  return (
    <article className="flex min-h-full flex-col">
      <header className="sticky top-0 flex items-start gap-4 border-b border-filet bg-white px-6 py-5">
        <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-encre font-display text-lg font-extrabold text-white">{n}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-gris">Critère {ind.c} · {CRITERIA[ind.c - 1]}</p>
          <h2 id="indicator-title" className="font-display text-xl font-bold leading-snug">{ind.title}</h2>
          <div className="mt-2"><Pill tone={TONE[ind.state]}>{ind.state.charAt(0).toUpperCase() + ind.state.slice(1)}</Pill></div>
        </div>
        <button type="button" onClick={onClose} aria-label="Fermer" className="rounded-md p-1.5 text-gris hover:bg-papier hover:text-encre">
          <X size={20} />
        </button>
      </header>

      <div className="flex-1 space-y-7 px-6 py-6">
        <section>
          <h3 className="font-display text-base font-bold">Ce que demande l&apos;indicateur</h3>
          <p className="mt-2 leading-relaxed">{d.requirement}</p>
        </section>

        <section>
          <h3 className="font-display text-base font-bold">
            {ind.state === "couvert" ? "Pourquoi il est couvert" : ind.state === "à risque" ? "Pourquoi il est à risque" : "Pourquoi il ne vous concerne pas"}
          </h3>
          <p className="mt-2 leading-relaxed">{d.why}</p>
          {d.todo && (
            <p className="mt-3 rounded-md border-l-4 border-brique bg-brique/8 px-4 py-3 text-sm leading-relaxed">
              <strong className="font-semibold">À faire : </strong>{d.todo}
            </p>
          )}
        </section>

        {d.proofs.length > 0 && (
          <section>
            <h3 className="font-display text-base font-bold">Preuves dans Qualiopix</h3>
            <ul className="mt-3 divide-y divide-filet border-y border-filet">
              {d.proofs.map((p) => (
                <li key={p.label} className="py-3">
                  <p className="leading-snug"><span className="preuve">{p.label}</span></p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-gris">
                    <span>{p.date}</span>
                    {p.href ? (
                      <Link href={p.href} className="inline-flex items-center gap-1 text-tampon hover:underline">
                        Voir dans {p.place}<ArrowUpRight size={14} aria-hidden />
                      </Link>
                    ) : (
                      <span>{p.place}</span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
            {more > 0 && <p className="mt-2 text-sm text-gris">et {more} autres preuves sur les 12 derniers mois.</p>}
          </section>
        )}

        <p className="text-xs leading-relaxed text-gris">
          Résumé rédigé par Qualiopix à partir du référentiel national qualité. Pour l&apos;audit, référez-vous au guide de lecture officiel.
        </p>
      </div>

      <footer className="sticky bottom-0 flex justify-between border-t border-filet bg-white px-6 py-3 text-sm">
        <button type="button" disabled={!prev} onClick={() => prev && onSelect(prev)} className="text-tampon hover:underline disabled:invisible">
          Indicateur {prev}
        </button>
        <button type="button" disabled={!next} onClick={() => next && onSelect(next)} className="text-tampon hover:underline disabled:invisible">
          Indicateur {next}
        </button>
      </footer>
    </article>
  );
}
