# Qualiopix – consignes pour l'assistant

- Le cahier des charges fait foi : `docs/cahier-des-charges.md`. L'avancement est dans
  `docs/ROADMAP-V1.md` : le mettre à jour quand une fonctionnalité est livrée.
- Interface et textes en français, placés dans `src/i18n/fr.ts`, jamais en dur.
- Toute table métier porte `organization_id` + RLS (voir `docs/ARCHITECTURE.md`) ; tout accès
  passe par `withOrg()`. Ne jamais se connecter avec le rôle propriétaire dans l'application.
- Logique métier dans `src/server/`, base passée en paramètre, testée dans `tests/integration`.
- Chaque règle de gestion RG-xx a un test qui porte son identifiant.
- Un document envoyé ou signé, un émargement, une facture émise, une preuve : jamais modifiés,
  on crée une version ou un avoir. Aucune date de preuve saisie dans le passé.
- Avant de terminer : `npm run typecheck && npm run lint && npm test`.
- Commits : `feat(ID): …` avec l'identifiant de fonctionnalité du cahier des charges.
