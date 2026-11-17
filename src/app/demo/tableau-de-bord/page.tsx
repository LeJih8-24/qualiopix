import Link from "next/link";
import type { Metadata } from "next";
import { Check, ChevronRight } from "lucide-react";
import { indicatorStates, invoices, revenueByMonth, sessions, todo, trainer } from "@/demo/data";
import { Panel, Pill, sessionTone } from "@/demo/ui";

export const metadata: Metadata = { title: "Aujourd'hui" };

export default function DashboardDemo() {
  const upcoming = sessions.filter((s) => s.status === "En cours" || s.status === "Confirmée").slice(0, 4);
  const late = invoices.filter((i) => i.status === "En retard" || i.status === "En attente");
  const applicable = indicatorStates.filter((i) => i.state !== "non applicable");
  const covered = applicable.filter((i) => i.state === "couvert").length;
  const max = Math.max(...revenueByMonth.map((m) => m.value));

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-sm text-gris">Mardi 18 novembre</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">Bonjour {trainer.name.split(" ")[0]}, vous êtes en session ce matin.</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="À faire aujourd'hui">
          <ul className="divide-y divide-filet">
            {todo.map((t) => (
              <li key={t.text}>
                <Link href={t.href} className="flex items-center gap-4 px-5 py-3.5 hover:bg-papier">
                  <span className="w-20 shrink-0 text-sm text-gris">{t.time}</span>
                  <span className={`grid size-5 shrink-0 place-items-center rounded-full border ${t.done ? "border-tampon bg-tampon text-white" : "border-filet"}`}>
                    {t.done && <Check size={12} strokeWidth={3} aria-label="Fait" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block font-medium ${t.done ? "text-gris line-through" : ""}`}>{t.text}</span>
                    <span className="block text-sm text-gris">{t.detail}</span>
                  </span>
                  <ChevronRight size={16} className="text-gris" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Préparation Qualiopi" action={<Link href="/demo/qualiopi" className="text-sm text-tampon hover:underline">Détail</Link>}>
          <div className="px-5 py-5">
            <p className="font-display text-4xl font-extrabold">{covered} <span className="text-2xl text-gris">/ {applicable.length}</span></p>
            <p className="text-sm text-gris">indicateurs couverts sur les 12 derniers mois</p>
            <div className="mt-4 grid grid-cols-[repeat(23,minmax(0,1fr))] gap-1" aria-hidden>
              {applicable.map((i) => (
                <span key={i.n} className={`h-6 rounded-sm ${i.state === "couvert" ? "bg-tampon" : "bg-brique/70"}`} />
              ))}
            </div>
            <p className="mt-4 text-sm">
              Prochain audit de surveillance le <strong>12 mars 2027</strong>. Quatre indicateurs demandent une preuve.
            </p>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Sessions à venir" className="lg:col-span-2" action={<Link href="/demo/sessions" className="text-sm text-tampon hover:underline">Toutes</Link>}>
          <ul className="divide-y divide-filet">
            {upcoming.map((s) => (
              <li key={s.id}>
                <Link href={s.id === "kleber-nov" ? "/demo/sessions/kleber-nov" : "/demo/sessions"} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3.5 hover:bg-papier">
                  <span className="w-32 shrink-0 text-sm font-medium">{s.dates}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{s.programme}</span>
                    <span className="block text-sm text-gris">{s.client} · {s.trainees} stagiaires · {s.place}</span>
                  </span>
                  <Pill tone={sessionTone(s.status)}>{s.status}</Pill>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Chiffre d'affaires" action={<span className="text-sm text-gris">milliers d&apos;€</span>}>
          <div className="flex h-44 items-end gap-3 px-5 pb-3 pt-6">
            {revenueByMonth.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-xs text-gris">{m.value.toLocaleString("fr-FR")}</span>
                <div className={`w-full rounded-t ${m.month === "nov." ? "bg-encre/35" : "bg-encre"}`} style={{ height: `${(m.value / max) * 100}px` }} />
                <span className="text-xs text-gris">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-filet px-5 py-3 text-sm">
            <span className="text-gris">À encaisser : </span>
            <Link href="/demo/facturation" className="font-medium hover:underline">
              {late.length} factures, dont 1 en retard
            </Link>
          </div>
        </Panel>
      </div>
    </div>
  );
}
