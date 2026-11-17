import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { fr } from "@/i18n/fr";
import { unreadCount } from "@/server/messaging";
import { requireUser } from "@/server/session";

const LINKS = [
  ["/app", fr.nav.dashboard],
  ["/app/organisme", fr.nav.organization],
  ["/app/documents", fr.nav.documents],
  ["/app/referents", fr.nav.referents],
  ["/app/qualiopi", fr.nav.qualiopi],
  ["/app/emails", fr.nav.emails],
  ["/app/handicap", fr.nav.handicap],
] as const;

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const unread = await unreadCount(user.organizationId);
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 pt-3 text-sm">
          <Link href="/app" className="mr-auto text-base font-semibold">{fr.app.name}</Link>
          <Link href="/app/notifications" className="hover:text-accent">
            {fr.nav.notifications}
            {unread > 0 && (
              <span className="ml-1 rounded-full bg-accent px-1.5 text-xs text-on-accent">{unread}</span>
            )}
          </Link>
          <span className="hidden text-muted sm:inline">{user.fullName}</span>
          <form action={logoutAction}>
            <button type="submit" className="text-muted hover:text-ink">{fr.nav.logout}</button>
          </form>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-4 overflow-x-auto px-4 py-2 text-sm">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} className="whitespace-nowrap text-muted hover:text-ink">
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
