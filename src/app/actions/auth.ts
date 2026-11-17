"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { fr } from "@/i18n/fr";
import { loginSchema, signupSchema } from "@/lib/validation";
import { EmailTakenError, login, logout, signup } from "@/server/auth-core";
import { clearSessionCookie, readSessionToken, setSessionCookie } from "@/server/session";

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: Record<string, string>;
  ok?: boolean;
};

function formValues(formData: FormData, keys: string[]) {
  return Object.fromEntries(keys.map((k) => [k, String(formData.get(k) ?? "")]));
}

export async function signupAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = formValues(formData, ["fullName", "legalName", "email", "password"]);
  const parsed = signupSchema.safeParse(values);
  // Le mot de passe n'est jamais renvoyé au navigateur.
  const safeValues = { ...values, password: "" };
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors, values: safeValues };
  }
  try {
    const { token, expiresAt } = await signup(getDb(), parsed.data);
    await setSessionCookie(token, expiresAt);
  } catch (e) {
    if (e instanceof EmailTakenError) return { error: fr.auth.emailTaken, values: safeValues };
    throw e;
  }
  redirect("/app/organisme?bienvenue=1");
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = formValues(formData, ["email", "password"]);
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { error: fr.auth.invalidCredentials, values: { email: values.email } };
  }
  const result = await login(getDb(), parsed.data);
  if (!result) return { error: fr.auth.invalidCredentials, values: { email: values.email } };
  await setSessionCookie(result.token, result.expiresAt);
  redirect("/app");
}

export async function logoutAction() {
  const token = await readSessionToken();
  if (token) await logout(getDb(), token);
  await clearSessionCookie();
  redirect("/connexion");
}
