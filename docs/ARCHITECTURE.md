# Architecture

## Pile technique

| Couche | Choix | Pourquoi |
| --- | --- | --- |
| Application | Next.js 15 (App Router, Server Actions), React 19, TypeScript | Un seul langage, rendu serveur rapide sur téléphone, PWA possible |
| Style | Tailwind CSS 4, jetons de couleur dans `src/app/globals.css` | Contraste AA visé (RGAA) |
| Base | PostgreSQL 17 | RLS pour le cloisonnement, transactions, JSONB |
| Accès aux données | Drizzle ORM, migrations SQL dans `drizzle/` | SQL lisible, migrations relisibles |
| Validation | Zod (`src/lib/validation.ts`) | Même schéma côté formulaire et côté serveur |
| Mots de passe | Argon2id (`@node-rs/argon2`) | |
| Tests | Vitest : `unit` (sans base) et `integration` (base réelle) | |

## Cloisonnement des organismes

Exigence « Cloisonnement » : les données d'un formateur ne sont jamais visibles d'un autre.

1. Chaque table métier porte `organization_id`.
2. La sécurité au niveau des lignes (RLS) est activée sur chacune, avec la politique
   `organization_id = app_current_org()`.
3. L'application se connecte avec le rôle `qualiopix_app`, **ni superutilisateur ni
   propriétaire** des tables : la RLS s'applique toujours.
4. Tout accès métier passe par `withOrg(orgId, tx => …)` (`src/db/index.ts`), qui fixe
   `app.org_id` pour la transaction. Sans lui, aucune ligne n'est visible.
5. `tests/integration/isolation.test.ts` échoue si une nouvelle table avec `organization_id`
   n'active pas la RLS.

Exceptions : `users` et `auth_sessions`, lues avant de connaître l'organisme (connexion),
accessibles uniquement par `src/server/auth-core.ts`.

**Ajouter une table métier** : la déclarer dans `src/db/schema.ts` avec `organization_id`,
`npm run db:generate`, puis ajouter dans une migration personnalisée
(`npx drizzle-kit generate --custom --name …`) :

```sql
ALTER TABLE ma_table ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON ma_table
  USING (organization_id = app_current_org())
  WITH CHECK (organization_id = app_current_org());
```

## Intégrité des preuves

- `audit_log` : ajout seul. Un déclencheur refuse `UPDATE` et `DELETE`, même au propriétaire ;
  le rôle applicatif n'a de toute façon pas ces droits.
- À venir (jalon 1) : documents figés avec empreinte et horodatage, dates de preuve
  impossibles à saisir dans le passé (RG-02, RG-03).

## Organisation du code

```
src/
  app/            pages (App Router) et actions serveur (app/actions)
    (auth)/       inscription, connexion
    app/          espace formateur, protégé par requireUser()
  components/     composants d'interface partagés
  db/             schéma Drizzle, connexion, withOrg()
  i18n/           textes de l'interface (aucun texte en dur dans les composants)
  lib/            logique pure : validation, calculs
  server/         logique métier côté serveur (testable sans Next.js)
drizzle/          migrations SQL
tests/unit/       tests sans base
tests/integration tests sur base PostgreSQL réelle (recréée à chaque lancement)
```

Règle : la logique métier vit dans `src/server/` et prend la base en paramètre, pour être
testée sans Next.js. Les actions serveur ne font que valider, appeler et rediriger.

## Intégrations externes

Chaque service externe (e-mail, Stripe, IA, stockage) passera par une interface dans
`src/server/integrations/<service>.ts` avec une implémentation factice pour les tests et le
développement, afin de pouvoir changer de fournisseur (exigence « Intégrations »).
