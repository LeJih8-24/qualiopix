import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { fr } from "@/i18n/fr";
import { requireUser } from "@/server/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-surface">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-3 text-sm">
          <Link href="/app" className="mr-auto text-base font-semibold">{fr.app.name}</Link>
          <Link href="/app" className="hover:text-accent">{fr.nav.dashboard}</Link>
          <Link href="/app/organisme" className="hover:text-accent">{fr.nav.organization}</Link>
          <span className="hidden text-muted sm:inline">{user.fullName}</span>
          <form action={logoutAction}>
            <button type="submit" className="text-muted hover:text-ink">{fr.nav.logout}</button>
          </form>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
