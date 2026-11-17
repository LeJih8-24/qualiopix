import Link from "next/link";
import { redirect } from "next/navigation";
import { fr } from "@/i18n/fr";
import { getCurrentUser } from "@/server/session";

export default async function Home() {
  if (await getCurrentUser()) redirect("/app");
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-4">
      <h1 className="text-4xl font-semibold tracking-tight">{fr.app.name}</h1>
      <p className="text-lg text-muted">{fr.app.tagline}</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/inscription" className="rounded-md bg-accent px-4 py-2 text-on-accent hover:bg-accent-strong">
          {fr.auth.signupTitle}
        </Link>
        <Link href="/connexion" className="rounded-md border border-line px-4 py-2 hover:bg-surface">
          {fr.auth.loginTitle}
        </Link>
      </div>
    </main>
  );
}
