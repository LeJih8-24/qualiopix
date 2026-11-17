import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { fr } from "@/i18n/fr";
import "./globals.css";

const sans = Inter({ variable: "--font-sans-family", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: fr.app.name, template: `%s · ${fr.app.name}` },
  description: fr.app.tagline,
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${sans.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
