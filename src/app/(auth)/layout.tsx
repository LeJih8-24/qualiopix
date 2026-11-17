import Link from "next/link";
import { fr } from "@/i18n/fr";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-4 py-10">
      <Link href="/" className="text-xl font-semibold">
        {fr.app.name}
      </Link>
      <div className="rounded-lg border border-line bg-surface p-6 shadow-sm">{children}</div>
    </main>
  );
}
