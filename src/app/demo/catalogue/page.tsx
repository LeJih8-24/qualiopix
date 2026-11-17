import Link from "next/link";
import type { Metadata } from "next";
import { Plus, Sparkles } from "lucide-react";
import { programmes } from "@/demo/data";
import { Button, PageHeader, Pill } from "@/demo/ui";

export const metadata: Metadata = { title: "Catalogue" };

export default function CatalogueDemo() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Catalogue"
        lead="Vos programmes, avec tous les champs exigés par l'indicateur 1. Un programme incomplet ne peut pas être publié."
        actions={
          <>
            <Button variant="ghost"><Sparkles size={16} aria-hidden /> Créer à partir d&apos;un descriptif</Button>
            <Button><Plus size={16} aria-hidden /> Nouveau programme</Button>
          </>
        }
      />
      <ul className="grid gap-5 md:grid-cols-2">
        {programmes.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/demo/catalogue/${p.slug}`}
              className="flex h-full flex-col rounded-lg border border-filet bg-white p-5 transition-colors hover:border-encre/40"
            >
              <div className="flex items-start gap-3">
                <h2 className="mr-auto font-display text-xl font-bold leading-snug">{p.title}</h2>
                <Pill tone={p.status === "publié" ? "vert" : "neutre"}>{p.status === "publié" ? "Publié" : "Brouillon"}</Pill>
              </div>
              <p className="mt-1 text-sm text-gris">{p.duration} · {p.modality}</p>
              <p className="mt-4 line-clamp-2 text-[15px] leading-relaxed">{p.objectives[0]}.</p>
              <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-filet pt-4 text-sm">
                <div><dt className="text-gris">Prix</dt><dd className="font-medium">{p.price.split(" (")[0]}</dd></div>
                <div><dt className="text-gris">Satisfaction</dt><dd className="font-medium">{p.satisfaction ? `${p.satisfaction.toLocaleString("fr-FR")} / 5` : "—"}</dd></div>
                <div><dt className="text-gris">Objectifs atteints</dt><dd className="font-medium">{p.success ? `${p.success} %` : "—"}</dd></div>
              </dl>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
