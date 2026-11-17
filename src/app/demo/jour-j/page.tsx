import type { Metadata } from "next";
import { PageHeader } from "@/demo/ui";
import { PhoneSession } from "./phone";

export const metadata: Metadata = { title: "Jour J" };

const POINTS = [
  { title: "Émargement par QR code", text: "Les stagiaires scannent et signent sur leur téléphone, ou sur le vôtre. Heure, adresse IP et signature sont conservées pour chaque demi-journée." },
  { title: "Quiz en direct", text: "Positionnement le matin, évaluation de fin le lendemain. Les résultats tombent par objectif, en temps réel." },
  { title: "Adaptations en un geste", text: "Rythme, handicap, niveau : la note est datée et rattachée au stagiaire. C'est une preuve pour les indicateurs 10 et 26." },
  { title: "Absences suivies", text: "Une absence déclenche une relance au stagiaire et, en intra, une information à l'entreprise." },
];

export default function JourJDemo() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Le jour J, sur votre téléphone"
        lead="Pendant la session, tout tient dans la poche. Essayez : touchez un stagiaire pour le faire émarger."
      />
      <div className="grid items-start gap-10 xl:grid-cols-[380px_1fr]">
        <PhoneSession />
        <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {POINTS.map((p) => (
            <li key={p.title} className="border-t-2 border-encre pt-3">
              <p className="font-display text-lg font-bold">{p.title}</p>
              <p className="mt-1.5 leading-relaxed text-gris">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
