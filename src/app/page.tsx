import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { protoFonts } from "@/demo/fonts";
import { getCurrentUser } from "@/server/session";

export const metadata: Metadata = {
  title: "Qualiopix · l'outil du formateur indépendant",
  description:
    "Concevez, vendez, animez, évaluez et facturez vos formations. Chaque étape laisse une preuve datée : votre dossier Qualiopi se constitue tout seul.",
};

const HERO_STEPS = [
  { label: "Questionnaire de besoin reçu", proof: "ind. 4", when: "2 oct." },
  { label: "Convention signée en ligne", proof: "PDF figé", when: "14 oct." },
  { label: "Convocations envoyées", proof: "ind. 9 et 12", when: "4 nov." },
  { label: "6 stagiaires ont émargé", proof: "ind. 12", when: "18 nov., 8 h 52" },
  { label: "Quiz de fin : 92 % d'objectifs atteints", proof: "ind. 11", when: "19 nov." },
];

const ARC = [
  { verb: "Concevoir", text: "Fiche programme complète, objectifs évaluables, déroulé minuté. L'assistant reformule un objectif flou." },
  { verb: "Vendre", text: "Page catalogue, devis signé en ligne, convention ou contrat. Cours en ligne avec paiement par carte." },
  { verb: "Animer", text: "Sur votre téléphone : émargement par QR code, quiz en direct, notes d'adaptation en un geste." },
  { verb: "Évaluer", text: "Acquis par objectif et par stagiaire, satisfaction à chaud, évaluation à froid à un mois." },
  { verb: "Facturer", text: "Subrogation OPCO, reste à charge, acomptes et avoirs. Pièces pour l'OPCO réunies en un fichier." },
  { verb: "Prouver", text: "Chaque étape est rangée sous ses indicateurs Qualiopi. Le jour de l'audit, vous exportez." },
];

const PLANS = [
  {
    name: "Découverte",
    price: "0 €",
    note: "pour démarrer",
    items: ["2 sessions par mois", "Sous-traitance illimitée", "Catalogue public", "Score Qualiopi"],
  },
  {
    name: "Solo",
    price: "29 € HT",
    note: "par mois",
    items: ["Sessions illimitées", "Facturation et OPCO", "Registres réclamations et signalements", "1 cours en ligne en vente"],
  },
  {
    name: "Solo Qualiopi",
    price: "49 € HT",
    note: "par mois",
    items: ["Tout Solo", "Dossier d'audit complet", "E-learning et suivi du temps", "Veille et compétences", "Cours en ligne illimités"],
    featured: true,
  },
];

export default async function Home() {
  if (await getCurrentUser()) redirect("/app");
  return (
    <div className={`proto ${protoFonts} min-h-screen`}>
      <header className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-5 lg:px-8">
        <span className="mr-auto font-display text-xl font-extrabold tracking-tight">Qualiopix</span>
        <Link href="/connexion" className="text-sm text-gris hover:text-encre">Se connecter</Link>
        <Link href="/demo" className="rounded-md bg-encre px-3.5 py-2 text-sm font-medium text-white hover:bg-encre-2">
          Voir la démo
        </Link>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-10 lg:grid-cols-[1.1fr_1fr] lg:px-8 lg:pt-16">
        <div>
          <h1 className="font-display text-[2.6rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Vous formez. Le dossier Qualiopi se remplit pendant ce temps.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gris">
            Un seul outil pour le formateur indépendant : programmes, devis, conventions, émargement sur téléphone,
            évaluations, factures OPCO. Chaque action laisse une preuve datée, rangée sous le bon indicateur.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/demo" className="rounded-md bg-tampon px-5 py-3 font-medium text-white hover:bg-tampon-2">
              Parcourir la démo
            </Link>
            <Link href="/inscription" className="rounded-md border border-filet bg-white px-5 py-3 font-medium hover:border-encre/40">
              Créer mon espace
            </Link>
          </div>
        </div>

        <figure className="rounded-xl border border-filet bg-white p-6 shadow-[0_1px_0_#d8ddd6,0_20px_40px_-24px_rgba(23,35,63,0.35)]">
          <figcaption className="mb-5">
            <span className="block font-display text-lg font-bold leading-tight">Manager une équipe à distance</span>
            <span className="text-sm text-gris">Session intra, Brasserie Kléber</span>
          </figcaption>
          <ol className="relative space-y-5 border-l-2 border-filet pl-6">
            {HERO_STEPS.map((s, i) => (
              <li key={s.label} className="relative">
                <span className="absolute -left-[31px] top-1 size-3 rounded-full border-2 border-white bg-tampon ring-2 ring-tampon/25" aria-hidden />
                <p className="font-medium leading-snug">{s.label}</p>
                <p className="mt-0.5 text-sm text-gris">
                  {s.when}
                  <span className="ml-2 text-encre">
                    <span className="preuve-anim" style={{ animationDelay: `${0.5 + i * 0.45}s` }}>{s.proof}</span>
                  </span>
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-6 flex flex-wrap items-baseline gap-x-3 border-t border-filet pt-4">
            <span className="font-display text-3xl font-extrabold">19 / 23</span>
            <span className="text-sm text-gris">indicateurs Qualiopi couverts, sans saisie</span>
          </p>
        </figure>
      </section>

      <section className="border-y border-filet bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
          <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight">
            Six outils remplacés par un seul, dans l&apos;ordre où vous travaillez.
          </h2>
          <ol className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {ARC.map((a, i) => (
              <li key={a.verb} className="border-t-2 border-encre pt-4">
                <p className="font-display text-xl font-bold">
                  <span className="mr-2 text-gris">{i + 1}.</span>
                  {a.verb}
                </p>
                <p className="mt-2 leading-relaxed text-gris">{a.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        <h2 className="font-display text-3xl font-bold tracking-tight">Des formules au nombre de sessions, jamais au nombre de stagiaires.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`flex flex-col rounded-xl p-6 ${p.featured ? "bg-encre text-white" : "border border-filet bg-white"}`}
            >
              <p className="font-display text-lg font-bold">{p.name}</p>
              <p className="mt-3">
                <span className="font-display text-4xl font-extrabold">{p.price}</span>{" "}
                <span className={p.featured ? "text-white/70" : "text-gris"}>{p.note}</span>
              </p>
              <ul className="mt-6 space-y-2.5 text-[15px]">
                {p.items.map((it) => (
                  <li key={it} className="flex gap-2.5">
                    <Check size={18} className={p.featured ? "text-surligneur" : "text-tampon"} aria-hidden />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-filet">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-4 px-4 py-6 text-sm text-gris lg:px-8">
          <span className="mr-auto">Qualiopix · hébergé dans l&apos;Union européenne</span>
          <Link href="/demo" className="hover:text-encre">Démo</Link>
          <Link href="/connexion" className="hover:text-encre">Se connecter</Link>
        </div>
      </footer>
    </div>
  );
}
