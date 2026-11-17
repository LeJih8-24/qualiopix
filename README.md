# Qualiopix

Application web tout-en-un pour formateurs indépendants : concevoir, vendre, animer, évaluer
et facturer ses formations, en constituant automatiquement le dossier de preuves Qualiopi.

- Cahier des charges : [docs/cahier-des-charges.md](docs/cahier-des-charges.md)
- Feuille de route V1 et état d'avancement : [docs/ROADMAP-V1.md](docs/ROADMAP-V1.md)
- Architecture et règles techniques : [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Démarrer

Prérequis : Node.js 22 ou plus, Docker.

```bash
npm install
cp .env.example .env
npm run db:up        # PostgreSQL dans Docker (port 5433)
npm run db:migrate   # applique les migrations
npm run dev          # http://localhost:3000
```

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm test` | Tests unitaires et d'intégration (base de test recréée à chaque lancement) |
| `npm run test:unit` | Tests unitaires seuls, sans base |
| `npm run typecheck` | Vérification TypeScript |
| `npm run lint` | ESLint |
| `npm run db:generate` | Génère une migration depuis `src/db/schema.ts` |
| `npm run db:migrate` | Applique les migrations (`-- --test` pour la base de test) |
| `npm run db:studio` | Explorateur de la base |
