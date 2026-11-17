import type { Metadata } from "next";
import { protoFonts } from "@/demo/fonts";
import { DemoNav } from "./nav";

export const metadata: Metadata = {
  title: { default: "Démo", template: "%s · Démo Qualiopix" },
  robots: { index: false },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`proto ${protoFonts} min-h-screen lg:flex`}>
      <DemoNav />
      <div className="min-w-0 flex-1">
        <div className="border-b border-filet bg-white/70 px-4 py-2 text-center text-xs text-gris lg:px-10">
          Prototype de démonstration : les personnes, entreprises et montants sont fictifs.
        </div>
        <main className="mx-auto max-w-6xl px-4 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
