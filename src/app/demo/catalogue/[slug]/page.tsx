import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, CircleAlert, Sparkles } from "lucide-react";
import { programmes } from "@/demo/data";
import { Button, PageHeader, Panel, Pill } from "@/demo/ui";

export function generateStaticParams() {
  return programmes.map((p) => ({ slug: p.slug }));
}

const SEQUENCES = [
  { time: "9 h 00", dur: "30 min", title: "Positionnement et attentes", method: "Quiz par QR code, tour de table" },
  { time: "9 h 30", dur: "1 h 30", title: "Les rituels d'une équipe hybride", method: "Apport, étude de cas Brasserie" },
  { time: "11 h 15", dur: "1 h 15", title: "Construire sa semaine type", method: "Atelier en binômes" },
  { time: "14 h 00", dur: "2 h", title: "L'entretien individuel à distance", method: "Jeux de rôle filmés" },
  { time: "16 h 15", dur: "45 min", title: "Signaux d'isolement", method: "Grille d'observation" },
];

const FIELDS = [
  ["Prérequis", "Encadrer au moins une personne"],
  ["Public", "Managers de proximité, chefs d'équipe"],
  ["Délai d'accès", "15 jours après signature de la convention"],
  ["Accessibilité", "Adaptations étudiées avec le référent handicap"],
  ["Évaluation", "Positionnement, quiz de fin, mise en situation"],
];

export default async function ProgrammeDemo({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = programmes.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <div className="flex flex-col gap-8">
      <Link href="/demo/catalogue" className="text-sm text-tampon hover:underline">Catalogue</Link>
      <PageHeader
        title={p.title}
        lead={`${p.duration} · ${p.modality} · ${p.price}`}
        actions={
          <>
            <Pill tone={p.status === "publié" ? "vert" : "neutre"}>{p.status === "publié" ? `Publié · version ${p.version}` : "Brouillon"}</Pill>
            <Button href="/demo/sessions">Planifier une session</Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Panel title="Objectifs et évaluations" action={<span className="text-sm text-gris">ind. 5, 8, 11</span>}>
          <ul className="divide-y divide-filet">
            {p.objectives.map((o, i) => (
              <li key={o} className="flex gap-3 px-5 py-3.5">
                <Check size={18} className="mt-0.5 shrink-0 text-tampon" aria-hidden />
                <div>
                  <p className="leading-snug">{o}</p>
                  <p className="mt-1 text-sm text-gris">Évalué par : {i % 2 ? "mise en situation" : "quiz de fin, questions " + (i * 3 + 1) + " à " + (i * 3 + 3)}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-start gap-3 border-t border-filet bg-surligneur/25 px-5 py-3.5 text-sm">
            <Sparkles size={16} className="mt-0.5 shrink-0" aria-hidden />
            <p>
              Suggestion : « Comprendre le management à distance » n&apos;est pas mesurable.
              Proposition : « Citer trois rituels d&apos;équipe et en planifier un pour la semaine suivante ».
            </p>
          </div>
        </Panel>

        <Panel title="Fiche programme" action={<span className="text-sm text-gris">ind. 1</span>}>
          <dl className="divide-y divide-filet text-sm">
            {FIELDS.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[8rem_1fr] gap-3 px-5 py-3">
                <dt className="text-gris">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
            <div className="flex items-center gap-2 px-5 py-3 text-brique">
              <CircleAlert size={16} aria-hidden />
              <span>Aucune mention « éligible CPF » détectée : rien à corriger.</span>
            </div>
          </dl>
        </Panel>
      </div>

      <Panel title="Déroulé du premier jour" action={<span className="text-sm text-gris">6 h 00 sur 7 h prévues · ind. 6</span>}>
        <ol className="divide-y divide-filet">
          {SEQUENCES.map((s) => (
            <li key={s.time} className="grid grid-cols-[4.5rem_1fr] gap-4 px-5 py-3.5 sm:grid-cols-[4.5rem_4.5rem_1fr_1fr]">
              <span className="font-medium">{s.time}</span>
              <span className="hidden text-gris sm:block">{s.dur}</span>
              <span className="font-medium">{s.title}</span>
              <span className="col-start-2 text-sm text-gris sm:col-start-auto">{s.method}</span>
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}
