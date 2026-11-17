import { describe, expect, it } from "vitest";
import { renderTemplate } from "@/server/email-templates";
import { parseBlocks } from "@/server/pdf";
import { ORG_DOCUMENTS } from "@/server/org-documents";

describe("modèles", () => {
  it("remplace les variables et laisse visibles celles qui manquent", () => {
    expect(renderTemplate("Bonjour {{ nom }}, {{inconnu}}", { nom: "Léa" })).toBe("Bonjour Léa, {{inconnu}}");
  });

  it("découpe le Markdown simple en blocs", () => {
    expect(parseBlocks("# Titre\nligne 1\nligne 2\n\n- point\n## Sous-titre")).toEqual([
      { type: "h1", text: "Titre" },
      { type: "p", text: "ligne 1 ligne 2" },
      { type: "li", text: "point" },
      { type: "h2", text: "Sous-titre" },
    ]);
  });

  it("fournit les 4 documents de l'organisme (ACC-07)", () => {
    expect(ORG_DOCUMENTS.map((d) => d.kind)).toEqual([
      "reglement_interieur", "livret_accueil", "cgv", "politique_violences",
    ]);
  });
});
