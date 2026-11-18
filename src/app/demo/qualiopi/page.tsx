import type { Metadata } from "next";
import { FileArchive } from "lucide-react";
import { Button, PageHeader } from "@/demo/ui";
import { QualiopiBoard } from "./board";

export const metadata: Metadata = { title: "Qualiopi" };

export default function QualiopiDemo() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Préparation Qualiopi"
        lead="Les 33 indicateurs du référentiel. Un indicateur est couvert s'il a au moins une preuve datée des 12 derniers mois ; ceux qui ne vous concernent pas sont écartés automatiquement."
        actions={<Button><FileArchive size={16} aria-hidden /> Exporter le dossier d&apos;audit</Button>}
      />
      <QualiopiBoard />
    </div>
  );
}
