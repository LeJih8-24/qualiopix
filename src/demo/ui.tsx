import type { ReactNode } from "react";

/** Composants d'interface du prototype. */

export function PageHeader({ title, lead, actions }: { title: string; lead?: string; actions?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end gap-4 border-b border-filet pb-5">
      <div className="mr-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight text-encre">{title}</h1>
        {lead && <p className="mt-1.5 text-[15px] leading-relaxed text-gris">{lead}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function Button({ children, variant = "primary", href }: { children: ReactNode; variant?: "primary" | "ghost"; href?: string }) {
  const cls =
    variant === "primary"
      ? "bg-tampon text-white hover:bg-tampon-2"
      : "border border-filet bg-white text-encre hover:border-encre/40";
  const base = `inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${cls}`;
  return href ? <a href={href} className={base}>{children}</a> : <button type="button" className={base}>{children}</button>;
}

const PILL = {
  vert: "bg-tampon/12 text-tampon-2",
  brique: "bg-brique/12 text-brique",
  encre: "bg-encre text-white",
  neutre: "bg-filet/70 text-gris",
  jaune: "bg-surligneur text-encre",
} as const;

export function Pill({ tone, children }: { tone: keyof typeof PILL; children: ReactNode }) {
  return <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${PILL[tone]}`}>{children}</span>;
}

/** Une preuve : toujours au surligneur, c'est la signature visuelle du produit. */
export function Proof({ children, indicators }: { children: ReactNode; indicators?: number[] }) {
  return (
    <span className="text-[13px] text-encre">
      <span className="preuve">{children}</span>
      {indicators && indicators.length > 0 && (
        <span className="ml-1.5 text-xs text-gris">ind. {indicators.join(", ")}</span>
      )}
    </span>
  );
}

export function Panel({ title, action, children, className = "" }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg border border-filet bg-white ${className}`}>
      {title && (
        <div className="flex items-center gap-3 border-b border-filet px-5 py-3">
          <h2 className="mr-auto font-display text-base font-bold">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function sessionTone(status: string): keyof typeof PILL {
  switch (status) {
    case "En cours": return "jaune";
    case "Confirmée": return "vert";
    case "Clôturée":
    case "Terminée": return "neutre";
    case "Payée": return "vert";
    case "En retard": return "brique";
    case "En attente": return "neutre";
    default: return "neutre";
  }
}
