import Link from "next/link";
import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { sessions } from "@/demo/data";
import { Button, PageHeader, Pill, sessionTone } from "@/demo/ui";

export const metadata: Metadata = { title: "Sessions" };

export default function SessionsDemo() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Sessions"
        lead="Chaque session suit le même parcours, de la convention à la facture. Ouvrez celle de la Brasserie Kléber pour le voir en entier."
        actions={<Button><Plus size={16} aria-hidden /> Nouvelle session</Button>}
      />
      <ul className="flex flex-col gap-3">
        {sessions.map((s) => {
          const linkable = s.id === "kleber-nov";
          const body = (
            <div className="grid items-center gap-x-6 gap-y-2 p-5 md:grid-cols-[9rem_1fr_auto]">
              <div>
                <p className="font-display text-lg font-bold leading-tight">{s.dates}</p>
                <p className="text-sm text-gris">{s.place}</p>
              </div>
              <div className="min-w-0">
                <p className="font-medium">{s.programme}</p>
                <p className="text-sm text-gris">
                  {s.client} · {s.financing} · {s.trainees}/{s.seats} places · {s.amount}
                </p>
              </div>
              <div className="flex gap-2">
                {s.subcontracted && <Pill tone="encre">Sous-traitance</Pill>}
                <Pill tone={sessionTone(s.status)}>{s.status}</Pill>
              </div>
            </div>
          );
          return (
            <li key={s.id}>
              {linkable ? (
                <Link href={`/demo/sessions/${s.id}`} className="block rounded-lg border-2 border-encre bg-white transition-colors hover:bg-papier">
                  {body}
                </Link>
              ) : (
                <div className="rounded-lg border border-filet bg-white">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
