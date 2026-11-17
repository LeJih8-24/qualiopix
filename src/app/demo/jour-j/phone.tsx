"use client";

import { useState } from "react";
import { Check, QrCode } from "lucide-react";
import { trainees } from "@/demo/data";

type Tab = "emargement" | "quiz" | "notes";

/** Faux QR code déterministe, purement illustratif. */
function FakeQr() {
  const size = 21;
  const cells: boolean[] = [];
  let seed = 7;
  for (let i = 0; i < size * size; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    cells.push(seed / 233280 > 0.52);
  }
  // Les trois carrés de repérage d'un QR code ; null hors de ces zones.
  const finderOn = (x: number, y: number) => {
    for (const [fx, fy] of [[0, 0], [size - 7, 0], [0, size - 7]]) {
      const dx = x - fx, dy = y - fy;
      if (dx >= 0 && dy >= 0 && dx <= 6 && dy <= 6) {
        const ring = Math.max(Math.abs(dx - 3), Math.abs(dy - 3));
        return ring !== 2;
      }
    }
    return null;
  };
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="size-40" role="img" aria-label="QR code d'émargement (illustration)">
      {Array.from({ length: size * size }, (_, i) => {
        const x = i % size, y = Math.floor(i / size);
        const on = finderOn(x, y) ?? cells[i];
        return on ? <rect key={i} x={x} y={y} width={1} height={1} fill="#17233f" /> : null;
      })}
    </svg>
  );
}

export function PhoneSession() {
  const [tab, setTab] = useState<Tab>("emargement");
  const [signed, setSigned] = useState<Record<string, string>>({});
  const count = Object.keys(signed).length;

  const sign = (name: string) =>
    setSigned((s) => {
      if (s[name]) return s;
      // Heure fictive cohérente avec la démo (mardi après-midi).
      const minutes = 31 + Object.keys(s).length;
      return { ...s, [name]: `13 h ${minutes}` };
    });

  return (
    <div className="mx-auto w-full max-w-[360px] rounded-[2.4rem] border-[10px] border-encre bg-encre shadow-[0_30px_60px_-30px_rgba(23,35,63,0.6)]">
      <div className="overflow-hidden rounded-[1.7rem] bg-papier">
        <div className="bg-encre px-5 pb-4 pt-5 text-white">
          <p className="text-xs text-white/70">Mardi 18 nov. · après-midi</p>
          <p className="font-display text-lg font-bold leading-tight">Manager une équipe à distance</p>
          <p className="mt-2 text-sm text-white/80">En cours : L&apos;entretien individuel à distance · 14 h 00 – 16 h 00</p>
        </div>

        <div role="tablist" aria-label="Mode session" className="grid grid-cols-3 border-b border-filet bg-white text-sm">
          {([["emargement", "Émargement"], ["quiz", "Quiz"], ["notes", "Notes"]] as const).map(([k, l]) => (
            <button
              key={k}
              role="tab"
              aria-selected={tab === k}
              onClick={() => setTab(k)}
              className={`py-2.5 font-medium ${tab === k ? "border-b-2 border-tampon text-encre" : "text-gris"}`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="h-[460px] overflow-y-auto">
          {tab === "emargement" && (
            <div className="p-4">
              <div className="flex items-center gap-4 rounded-lg border border-filet bg-white p-3">
                <FakeQr />
                <div className="text-sm">
                  <p className="flex items-center gap-1.5 font-medium"><QrCode size={15} aria-hidden /> À scanner</p>
                  <p className="mt-1 text-gris">Valable jusqu&apos;à 14 h 30</p>
                  <p className="mt-3 font-display text-2xl font-bold">{count} / {trainees.length}</p>
                  <p className="text-gris">signatures</p>
                </div>
              </div>
              <ul className="mt-3 space-y-2">
                {trainees.map((t) => (
                  <li key={t.name}>
                    <button
                      onClick={() => sign(t.name)}
                      className="flex w-full items-center gap-3 rounded-lg border border-filet bg-white px-3 py-2.5 text-left hover:border-encre/40"
                    >
                      <span className={`grid size-6 shrink-0 place-items-center rounded-full border ${signed[t.name] ? "border-tampon bg-tampon text-white" : "border-filet"}`}>
                        {signed[t.name] && <Check size={14} strokeWidth={3} aria-hidden />}
                      </span>
                      <span className="min-w-0 flex-1 text-sm">
                        <span className="block font-medium">{t.name}</span>
                        {signed[t.name] ? (
                          <span className="text-xs"><span className="preuve">signé à {signed[t.name]}</span></span>
                        ) : (
                          <span className="block text-xs text-gris">Toucher pour signer sur cet écran</span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === "quiz" && (
            <div className="space-y-4 p-4 text-sm">
              <p className="font-medium">Positionnement d&apos;hier matin, par objectif</p>
              {[
                ["Organiser les rituels d'une équipe hybride", 33, 83],
                ["Conduire un entretien à distance", 17, 67],
                ["Formuler des objectifs SMART", 50, 100],
                ["Repérer les signaux d'isolement", 0, 83],
              ].map(([o, before, after]) => (
                <div key={o as string}>
                  <p>{o}</p>
                  <div className="mt-1.5 h-2 rounded bg-filet">
                    <div className="h-2 rounded bg-encre/40" style={{ width: `${before}%` }} />
                  </div>
                  <div className="mt-1 h-2 rounded bg-filet">
                    <div className="h-2 rounded bg-tampon" style={{ width: `${after}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-gris">Entrée {before} % · objectif visé demain {after} %</p>
                </div>
              ))}
              <button className="w-full rounded-md bg-tampon py-2.5 font-medium text-white">Lancer le quiz de fin</button>
            </div>
          )}

          {tab === "notes" && (
            <div className="space-y-3 p-4 text-sm">
              {trainees.filter((t) => t.adaptation).map((t) => (
                <div key={t.name} className="rounded-lg border border-filet bg-white p-3">
                  <p className="font-medium">{t.name}</p>
                  <p className="mt-1">{t.adaptation}</p>
                  <p className="mt-2 text-xs"><span className="preuve">noté le 18 nov. à 9 h 12</span> <span className="text-gris">ind. 10, 26</span></p>
                </div>
              ))}
              <div className="rounded-lg border border-dashed border-filet p-3 text-gris">
                Ajouter une note : rythme, niveau, handicap, comportement…
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
