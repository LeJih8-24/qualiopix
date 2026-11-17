/** ACC-01 – Inscription et connexion. */
import { describe, expect, it } from "vitest";
import { EmailTakenError, getSessionUser, login, logout, signup } from "@/server/auth-core";
import { appDb, newAccount } from "./helpers";

describe("inscription et connexion", () => {
  it("crée un organisme, un compte et une session valide", async () => {
    const acc = await newAccount("A");
    const user = await getSessionUser(appDb, acc.token);
    expect(user).toMatchObject({ userId: acc.userId, organizationId: acc.organizationId });
  });

  it("refuse une adresse déjà utilisée, sans tenir compte de la casse", async () => {
    await signup(appDb, { fullName: "X", legalName: "X", email: "doublon@exemple.test", password: "un-mot-de-passe-solide" });
    await expect(
      signup(appDb, { fullName: "Y", legalName: "Y", email: "DOUBLON@exemple.test", password: "un-mot-de-passe-solide" }),
    ).rejects.toBeInstanceOf(EmailTakenError);
  });

  it("connecte avec le bon mot de passe et refuse le mauvais", async () => {
    await signup(appDb, { fullName: "C", legalName: "C", email: "c@exemple.test", password: "un-mot-de-passe-solide" });
    expect(await login(appDb, { email: "C@exemple.test", password: "un-mot-de-passe-solide" })).not.toBeNull();
    expect(await login(appDb, { email: "c@exemple.test", password: "mauvais-mot-de-passe" })).toBeNull();
    expect(await login(appDb, { email: "inconnu@exemple.test", password: "peu-importe" })).toBeNull();
  });

  it("invalide la session à la déconnexion", async () => {
    const acc = await newAccount("A");
    await logout(appDb, acc.token);
    expect(await getSessionUser(appDb, acc.token)).toBeNull();
  });

  it("ne stocke pas le jeton de session en clair", async () => {
    const acc = await newAccount("A");
    const rows = await appDb.query.authSessions.findMany();
    expect(rows.some((r) => r.tokenHash === acc.token)).toBe(false);
  });
});
