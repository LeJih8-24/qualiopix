import { z } from "zod";
import { fr } from "@/i18n/fr";

const m = fr.validation;

/** Clé de Luhn, utilisée par le SIREN et le SIRET. */
function luhn(digits: string): boolean {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

/** Retire espaces et points saisis par habitude (« 123 456 789 00012 »). */
export function compactDigits(value: string): string {
  return value.replace(/[\s.]/g, "");
}

/**
 * SIRET : 14 chiffres, clé de Luhn.
 * Exception : les établissements de La Poste (SIREN 356000000) peuvent suivre
 * une règle où la somme des chiffres est un multiple de 5.
 */
export function isValidSiret(raw: string): boolean {
  const s = compactDigits(raw);
  if (!/^\d{14}$/.test(s)) return false;
  if (luhn(s)) return true;
  if (s.startsWith("356000000")) {
    const sum = [...s].reduce((a, c) => a + Number(c), 0);
    return sum % 5 === 0;
  }
  return false;
}

/** Numéro de déclaration d'activité : 11 chiffres. */
export function isValidNda(raw: string): boolean {
  return /^\d{11}$/.test(compactDigits(raw));
}

const optionalText = (max = 500) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional();

const optionalDate = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .refine((v) => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v), m.date)
  .nullable()
  .optional();

export const passwordSchema = z.string().min(12, m.passwordLength).max(200);

export const signupSchema = z.object({
  fullName: z.string().trim().min(1, m.required).max(200),
  legalName: z.string().trim().min(1, m.required).max(200),
  email: z.string().trim().toLowerCase().email(m.email),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(m.email),
  password: z.string().min(1, m.required),
});

/** ACC-02 – Profil de l'organisme. */
export const organizationProfileSchema = z
  .object({
    legalName: z.string().trim().min(1, m.required).max(200),
    siret: optionalText(20)
      .transform((v) => (v ? compactDigits(v) : v))
      .refine((v) => !v || isValidSiret(v), m.siret),
    nda: optionalText(20)
      .transform((v) => (v ? compactDigits(v) : v))
      .refine((v) => !v || isValidNda(v), m.nda),
    qualiopiCertNumber: optionalText(100),
    qualiopiCertValidFrom: optionalDate,
    qualiopiCertValidUntil: optionalDate,
    vatRegime: z
      .enum(["exoneration", "franchise", ""])
      .transform((v) => (v === "" ? null : v))
      .nullable()
      .optional(),
    address: optionalText(300),
    postalCode: optionalText(10).refine((v) => !v || /^\d{5}$/.test(v), m.postalCode),
    city: optionalText(100),
    phone: optionalText(30),
    contactEmail: optionalText(200).refine(
      (v) => !v || z.string().email().safeParse(v).success,
      m.email,
    ),
    legalMentions: optionalText(5000),
  })
  .refine(
    (o) =>
      !o.qualiopiCertValidFrom ||
      !o.qualiopiCertValidUntil ||
      o.qualiopiCertValidFrom < o.qualiopiCertValidUntil,
    { message: m.certDates, path: ["qualiopiCertValidUntil"] },
  );

export type OrganizationProfileInput = z.infer<typeof organizationProfileSchema>;

/** Champs du profil requis pour émettre des documents conformes. */
export const REQUIRED_PROFILE_FIELDS = [
  "legalName",
  "siret",
  "nda",
  "vatRegime",
  "address",
  "postalCode",
  "city",
] as const;

export function profileCompleteness(org: Record<string, unknown>) {
  const missing = REQUIRED_PROFILE_FIELDS.filter((k) => !org[k]);
  return {
    missing,
    percent: Math.round(
      ((REQUIRED_PROFILE_FIELDS.length - missing.length) / REQUIRED_PROFILE_FIELDS.length) * 100,
    ),
  };
}
