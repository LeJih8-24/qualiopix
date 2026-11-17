"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeCheck,
  BookOpen,
  CalendarDays,
  LayoutDashboard,
  Receipt,
  ShoppingBag,
  Smartphone,
  Users,
} from "lucide-react";
import { trainer } from "@/demo/data";

const ITEMS = [
  { href: "/demo/tableau-de-bord", label: "Aujourd'hui", icon: LayoutDashboard },
  { href: "/demo/catalogue", label: "Catalogue", icon: BookOpen },
  { href: "/demo/clients", label: "Clients", icon: Users },
  { href: "/demo/sessions", label: "Sessions", icon: CalendarDays },
  { href: "/demo/jour-j", label: "Jour J", icon: Smartphone },
  { href: "/demo/facturation", label: "Facturation", icon: Receipt },
  { href: "/demo/qualiopi", label: "Qualiopi", icon: BadgeCheck },
  { href: "/demo/ventes", label: "Ventes en ligne", icon: ShoppingBag },
];

export function DemoNav() {
  const path = usePathname();
  return (
    <aside className="bg-encre text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-60 lg:shrink-0 lg:flex-col">
      <div className="flex items-center gap-3 px-4 py-4 lg:px-5 lg:py-6">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight">
          Qualiopix
        </Link>
      </div>
      <nav aria-label="Navigation de la démo" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                active ? "bg-white text-encre font-medium" : "text-white/75 hover:bg-encre-2 hover:text-white"
              }`}
            >
              <Icon size={17} strokeWidth={1.8} aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="hidden items-center gap-3 border-t border-white/10 px-5 py-4 lg:flex">
        <span className="grid size-9 place-items-center rounded-full bg-surligneur font-display text-sm font-bold text-encre">
          {trainer.initials}
        </span>
        <div className="min-w-0 text-sm leading-tight">
          <p className="truncate font-medium">{trainer.name}</p>
          <p className="truncate text-white/60">{trainer.plan}</p>
        </div>
      </div>
    </aside>
  );
}
