"use server";

import { revalidatePath } from "next/cache";
import { organizationProfileSchema } from "@/lib/validation";
import { updateOrganization } from "@/server/organization";
import { requireUser } from "@/server/session";
import type { FormState } from "./auth";

const FIELDS = [
  "legalName",
  "siret",
  "nda",
  "qualiopiCertNumber",
  "qualiopiCertValidFrom",
  "qualiopiCertValidUntil",
  "vatRegime",
  "address",
  "postalCode",
  "city",
  "phone",
  "contactEmail",
  "legalMentions",
] as const;

export async function updateOrganizationAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const values = Object.fromEntries(FIELDS.map((k) => [k, String(formData.get(k) ?? "")]));
  const parsed = organizationProfileSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors, values };
  }
  await updateOrganization(user.organizationId, user.userId, parsed.data);
  revalidatePath("/app", "layout");
  return { ok: true };
}
