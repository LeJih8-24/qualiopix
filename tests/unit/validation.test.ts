import { describe, expect, it } from "vitest";
import {
  isValidNda,
  isValidSiret,
  organizationProfileSchema,
  profileCompleteness,
} from "@/lib/validation";

describe("SIRET", () => {
  it("accepte un SIRET valide, avec ou sans espaces", () => {
    expect(isValidSiret("73282932000074")).toBe(true);
    expect(isValidSiret("732 829 320 00074")).toBe(true);
  });
  it("refuse une mauvaise clé ou une mauvaise longueur", () => {
    expect(isValidSiret("73282932000075")).toBe(false);
    expect(isValidSiret("7328293200007")).toBe(false);
    expect(isValidSiret("abcdefghijklmn")).toBe(false);
  });
  it("applique la règle particulière de La Poste", () => {
    expect(isValidSiret("35600000000048")).toBe(true); // siège, clé de Luhn
    expect(isValidSiret("35600000000015")).toBe(true); // somme multiple de 5
    expect(isValidSiret("35600000000016")).toBe(false);
  });
});

describe("numéro de déclaration d'activité", () => {
  it("exige 11 chiffres", () => {
    expect(isValidNda("11 75 12345 67")).toBe(true);
    expect(isValidNda("1175123456")).toBe(false);
  });
});

describe("profil de l'organisme", () => {
  const base = { legalName: "Formation Durand" };

  it("normalise les champs vides en null et compacte le SIRET", () => {
    const r = organizationProfileSchema.parse({ ...base, siret: "732 829 320 00074", city: "" });
    expect(r.siret).toBe("73282932000074");
    expect(r.city).toBeNull();
  });

  it("refuse des dates de certificat inversées", () => {
    const r = organizationProfileSchema.safeParse({
      ...base,
      qualiopiCertValidFrom: "2027-01-01",
      qualiopiCertValidUntil: "2026-01-01",
    });
    expect(r.success).toBe(false);
  });

  it("calcule le taux de complétude", () => {
    expect(profileCompleteness({ legalName: "X" }).percent).toBe(14);
    expect(
      profileCompleteness({
        legalName: "X", siret: "1", nda: "1", vatRegime: "franchise",
        address: "1 rue", postalCode: "67000", city: "Strasbourg",
      }),
    ).toEqual({ missing: [], percent: 100 });
  });
});
