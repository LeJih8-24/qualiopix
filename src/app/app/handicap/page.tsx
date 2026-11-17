import type { Metadata } from "next";
import { fr } from "@/i18n/fr";
import { HANDICAP_DIRECTORY } from "@/lib/handicap-directory";

export const metadata: Metadata = { title: fr.handicap.title };

/** VEI-01 – Annuaire handicap. */
export default function HandicapPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{fr.handicap.title}</h1>
      <p className="text-sm text-muted">{fr.handicap.intro}</p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {HANDICAP_DIRECTORY.map((e) => (
          <li key={e.name} className="rounded-lg border border-line bg-surface p-4">
            <a href={e.url} target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline">
              {e.name}
            </a>
            <p className="mt-1 text-sm text-muted">{e.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
