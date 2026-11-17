import Link from "next/link";
import type { Metadata } from "next";
import { markAllReadAction } from "@/app/actions/foundations";
import { fr } from "@/i18n/fr";
import { listNotifications } from "@/server/messaging";
import { requireUser } from "@/server/session";

export const metadata: Metadata = { title: fr.notifications.title };

/** NOT-01 – Centre de notifications. */
export default async function NotificationsPage() {
  const user = await requireUser();
  const items = await listNotifications(user.organizationId);
  const t = fr.notifications;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h1 className="mr-auto text-2xl font-semibold">{t.title}</h1>
        {items.some((n) => !n.readAt) && (
          <form action={markAllReadAction}>
            <button className="text-sm text-accent underline">{t.markAllRead}</button>
          </form>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted">{t.empty}</p>
      ) : (
        <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
          {items.map((n) => (
            <li key={n.id} className={`px-4 py-3 text-sm ${n.readAt ? "text-muted" : ""}`}>
              <p className="font-medium">{n.link ? <Link href={n.link} className="underline">{n.title}</Link> : n.title}</p>
              {n.body && <p className="text-muted">{n.body}</p>}
              <p className="text-xs text-muted">
                {n.createdAt.toLocaleString("fr-FR", { timeZone: "Europe/Paris", dateStyle: "short", timeStyle: "short" })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
