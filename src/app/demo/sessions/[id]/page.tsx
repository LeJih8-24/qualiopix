import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Smartphone } from "lucide-react";
import { sessions, sessionSteps, trainees } from "@/demo/data";
import { Button, PageHeader, Panel, Pill, Proof } from "@/demo/ui";

export const metadata: Metadata = { title: "Session Brasserie Kléber" };

export function generateStaticParams() {
  return [{ id: "kleber-nov" }];
}

export default async function SessionDemo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = sessions.find((x) => x.id === id);
  if (!s || id !== "kleber-nov") notFound();
  const doneCount = sessionSteps.flatMap((p) => p.steps).filter((x) => x.done).length;
  const total = sessionSteps.flatMap((p) => p.steps).length;

  return (
    <div className="flex flex-col gap-8">
      <Link href="/demo/sessions" className="text-sm text-tampon hover:underline">Sessions</Link>
      <PageHeader
        title={s.programme}
        lead={`${s.client} · ${s.dates} · ${s.place} · financement ${s.financing}`}
        actions={
          <>
            <Pill tone="jaune">En cours</Pill>
            <Button href="/demo/jour-j"><Smartphone size={16} aria-hidden /> Ouvrir le mode session</Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <Panel title="Parcours de la session" action={<span className="text-sm text-gris">{doneCount} étapes sur {total}</span>}>
          <div className="px-5 py-5">
            {sessionSteps.map((phase) => (
              <section key={phase.phase} className="mb-6 last:mb-0">
                <h3 className="mb-3 font-display text-base font-bold text-gris">{phase.phase}</h3>
                <ol className="relative space-y-4 border-l-2 border-filet pl-6">
                  {phase.steps.map((st) => (
                    <li key={st.label} className="relative">
                      <span
                        aria-hidden
                        className={`absolute -left-[31px] top-1 size-3 rounded-full border-2 border-white ${
                          st.done ? "bg-tampon ring-2 ring-tampon/25" : "bg-white ring-2 ring-filet"
                        }`}
                      />
                      <p className={`leading-snug ${st.done ? "font-medium" : "text-gris"}`}>{st.label}</p>
                      <p className="mt-0.5 text-sm text-gris">
                        {st.date}
                        {st.proof && <span className="ml-2"><Proof indicators={st.indicators}>{st.proof}</Proof></span>}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel title="Stagiaires" action={<span className="text-sm text-gris">mardi matin : 5 / 6</span>}>
            <ul className="divide-y divide-filet text-sm">
              {trainees.map((t) => (
                <li key={t.name} className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{t.name}</span>
                      <span className="block text-gris">{t.role}</span>
                    </span>
                    {t.am ? <Pill tone="vert">Présent</Pill> : <Pill tone="brique">Absent</Pill>}
                  </div>
                  {t.adaptation && <p className="mt-1.5 text-gris">Adaptation : {t.adaptation}</p>}
                </li>
              ))}
            </ul>
            <p className="border-t border-filet px-5 py-3 text-sm text-gris">
              Yanis Meyer est absent : une relance lui a été envoyée et Julie Wendling a été informée.
            </p>
          </Panel>

          <Panel title="Documents de la session">
            <ul className="divide-y divide-filet text-sm">
              {[
                ["Convention de formation", "signée le 14 oct."],
                ["Convocations et livret d'accueil", "envoyés le 4 nov."],
                ["Feuilles d'émargement", "1 demi-journée sur 4"],
                ["Certificats de réalisation", "à la clôture"],
                ["Pièces pour Akto", "à la clôture"],
              ].map(([d, st]) => (
                <li key={d} className="flex justify-between gap-3 px-5 py-3">
                  <span>{d}</span>
                  <span className="text-gris">{st}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
