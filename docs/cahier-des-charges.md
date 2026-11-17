# Cahier des charges – Outil tout-en-un pour formateurs indépendants

Nov 17, 2026 · @lejih

## Objet et périmètre

**L'outil est une application web unique qui permet à un formateur seul de concevoir, vendre, animer, évaluer et facturer ses formations, tout en constituant automatiquement son dossier de preuves Qualiopi.** Il réunit quatre familles d'outils aujourd'hui séparées : gestion administrative, plateforme d'apprentissage en ligne, vente de cours en ligne et préparation d'audit. L'étude de marché qui justifie ces choix est dans le document [Outil tout-en-un pour formateurs indépendants – Étude de marché et plan produit](https://claude.ai/artifact/USzn7tuCrSu6mdKcBtxcv4).

### Dans le périmètre

- Organismes de formation « solo » (un seul formateur), certifiés Qualiopi ou non.
- Actions de formation en présentiel, en classe virtuelle et en ligne (modules à distance).
- Formations inter-entreprises, intra-entreprise et pour des particuliers.
- Sessions animées en sous-traitance pour un autre organisme (mode sous-traitant).
- Vente de cours en ligne aux particuliers et aux entreprises : page de vente, paiement, accès automatique au cours.
- Référentiel Qualiopi à 33 indicateurs (décret n° 2026-728, en vigueur au 1er novembre 2026).

### Hors périmètre

- Apprentissage, alternance, CFA et actions de formation en situation de travail (indicateurs 13 à 15, 20, 28, 29, 33).
- Bilans de compétences et VAE.
- Organismes de plusieurs formateurs, multi-sites, gestion d'équipe.
- Outils marketing avancés : tunnels de vente complexes, tests A/B, communauté ou réseau social intégré.
- Tenue de la comptabilité (seul un export vers le comptable est prévu).

### Conventions du document

- **V1 / V2 / V3** : lot de livraison où la fonction est attendue (détail en section « Lots de livraison »).
- **Ind.** : numéro de l'indicateur Qualiopi que la fonction aide à prouver.
- Les références juridiques sont données pour orienter les développeurs ; elles doivent être validées par un juriste avant la mise en production.

## Utilisateurs et rôles

**Un seul utilisateur paie et administre l'espace : le formateur. Les autres accèdent à des pages dédiées par lien sécurisé, sans créer de compte complet.**

| Rôle | Accès | Ce qu'il peut faire | Lot |
| --- | --- | --- | --- |
| Formateur (titulaire) | Compte complet, ordinateur et téléphone | Tout : catalogue, clients, sessions, documents, facturation, ventes en ligne, Qualiopi, paramètres, abonnement | V1 |
| Stagiaire | Lien personnel (sans mot de passe) ou espace stagiaire | Émarger, répondre aux quiz et questionnaires, signer, consulter ses supports, télécharger ses attestations, faire une réclamation ou un signalement | V1 (espace complet en V2) |
| Acheteur en ligne (particulier ou entreprise) | Compte stagiaire créé à l'achat | Consulter la page de vente, payer, accéder au cours, télécharger facture et attestation, exercer son droit de rétractation | V2 |
| Contact client (entreprise ou particulier) | Lien sécurisé | Remplir le questionnaire de besoin, signer devis et convention, répondre au questionnaire commanditaire, télécharger factures et attestations | V1 |
| Donneur d'ordre (mode sous-traitant) | Lien sécurisé | Recevoir et télécharger le dossier de preuves d'une session sous-traitée, s'inscrire gratuitement | V1 |
| Intervenant ponctuel | Lien sécurisé | Émargement formateur, dépôt de justificatifs de compétences | V2 |
| Partenaire (consultant Qualiopi) | Accès en lecture accordé par le formateur | Consulter le tableau de bord Qualiopi d'un client, laisser des commentaires | V2 |
| Administrateur de la plateforme | Back-office interne | Support, gestion des abonnements, modèles de documents, référentiel Qualiopi, contenus de veille | V1 |

Le formateur peut déléguer un accès à un assistant ou à son comptable en V3 seulement, pour rester fidèle à la cible solo.

## Parcours principal

**Le parcours de référence est une session en entreprise financée par un OPCO ; toutes les fonctionnalités de la V1 servent ce parcours.**

&#91;embedded content: parcours d'une session · 12 étapes en 3 temps\]

Chaque étape produit une trace datée que le moteur de preuves range sous ses indicateurs. Les variantes (particulier avec délai de rétractation, session sous-traitée sans contrat avec les stagiaires) suivent le même schéma avec les règles RG-04, RG-05 et RG-15.

## Fonctionnalités détaillées

**Le produit compte 115 fonctionnalités réparties en 15 modules ; 70 sont attendues en V1, dont beaucoup de petite taille. La vente de cours en ligne arrive en V2, car elle s'appuie sur l'e-learning.** Chaque fonctionnalité a un identifiant stable, à reprendre dans les tickets de développement et la recette.

### A. Compte et paramètres

| ID | Fonctionnalité | Description | Ind. | Lot |
| --- | --- | --- | --- | --- |
| ACC-01 | Inscription et connexion | E-mail et mot de passe ou lien de connexion par e-mail ; double authentification en option | — | V1 |
| ACC-02 | Profil de l'organisme | Raison sociale, SIRET, numéro de déclaration d'activité, certificat Qualiopi (numéro, dates), régime de TVA (exonération ou franchise), logo, mentions légales | — | V1 |
| ACC-03 | Assistant de démarrage | Parcours guidé de 10 minutes ; import d'un programme existant (Word ou PDF) par IA ; import de clients en CSV | — | V1 |
| ACC-04 | Abonnement | Choix de formule, paiement par carte, factures de l'abonnement, changement ou résiliation | — | V1 |
| ACC-05 | Export complet | Archive ZIP de toutes les données (CSV) et documents (PDF), à tout moment | — | V1 |
| ACC-06 | Suppression du compte | Effacement des données après export proposé et délai de grâce de 30 jours | — | V1 |
| ACC-07 | Documents de l'organisme | Modèles éditables : règlement intérieur, livret d'accueil, conditions générales de vente, politique de prévention des violences | 9, 12 | V1 |
| ACC-08 | Référents | Référent handicap, référent violences et harcèlement, suppléant extérieur (si le formateur est mis en cause) | 12, 26 | V1 |

### B. Catalogue et conception pédagogique

| ID | Fonctionnalité | Description | Ind. | Lot |
| --- | --- | --- | --- | --- |
| CAT-01 | Fiche programme complète | Tous les champs exigés par l'indicateur 1 ; publication bloquée tant qu'un champ obligatoire manque | 1 | V1 |
| CAT-02 | Objectifs évaluables | Assistant de rédaction (verbes d'action), alerte sur un objectif non mesurable, reformulation par IA | 5 | V1 |
| CAT-03 | Déroulé pédagogique | Séquences avec minutage, méthode, support et objectif visé ; total de durée contrôlé | 6 | V1 |
| CAT-04 | Matrice objectifs ↔ évaluations | Chaque objectif relié à au moins une évaluation (positionnement, fin, à froid) | 5, 8, 11 | V1 |
| CAT-05 | Banque de questions | QCM, vrai/faux, cas pratique, auto-évaluation ; rattachées aux objectifs ; génération par IA | 8, 11 | V1 |
| CAT-06 | Supports | Fichiers et liens rattachés aux séquences, remis automatiquement aux stagiaires | 19 | V1 |
| CAT-07 | Versions de programme | Historique des versions, motif de chaque modification, lien avec une action d'amélioration | 32 | V1 |
| CAT-08 | Page catalogue publique | Page publique par organisme, intégrable sur un site existant, mise à jour automatique | 1 | V1 |
| CAT-09 | Indicateurs de résultats publics | Satisfaction, taux d'atteinte des objectifs, nombre de stagiaires, période et méthode de calcul affichées | 2 | V1 |
| CAT-10 | Détection des mentions à risque | Alerte sur « éligible CPF », « diplôme », « certifiant » sans certification enregistrée | 1 | V1 |
| CAT-11 | Variantes par public | Variantes d'un même programme (niveau, intra / inter) avec déroulés adaptés | 6 | V2 |
| CAT-12 | Formations certifiantes | Fiche RNCP ou RS, blocs de compétences, taux d'obtention, frais d'examen | 3, 7 | V3 |

### C. Clients et commercial

| ID | Fonctionnalité | Description | Ind. | Lot |
| --- | --- | --- | --- | --- |
| CLI-01 | Entreprises et contacts | Fiche entreprise (secteur, OPCO, historique des sessions et factures), contacts | 4 | V1 |
| CLI-02 | Particuliers | Fiche client particulier, distincte pour appliquer le contrat de formation | — | V1 |
| CLI-03 | Analyse du besoin | Questionnaire envoyé par lien (contexte, public, niveau, contraintes, handicap), réponses horodatées et reprises dans le devis | 4 | V1 |
| CLI-04 | Demandes entrantes | Formulaire sur la page catalogue qui crée une demande à traiter | — | V1 |
| CLI-05 | Devis | Généré depuis le programme, acceptation et signature en ligne, transformation en session | — | V1 |
| CLI-06 | Suivi des opportunités | Statuts simples (à relancer, gagnée, perdue) et rappels | — | V2 |
| CLI-07 | Simulateur de financement | Information sur les financements possibles (OPCO, CPF, personnel) | — | V3 |

### D. Sessions et administratif

| ID | Fonctionnalité | Description | Ind. | Lot |
| --- | --- | --- | --- | --- |
| SES-01 | Création de session | Depuis un programme : dates, horaires, lieu ou lien de visio, modalité, inter ou intra, places | — | V1 |
| SES-02 | Inscription des stagiaires | Saisie, import, lien d'inscription ; questions sur les prérequis et le besoin d'adaptation (handicap) | 4, 26 | V1 |
| SES-03 | Convention de formation | Générée pour une entreprise, signée en ligne, version figée | — | V1 |
| SES-04 | Contrat avec un particulier | Contrat de formation, délai de rétractation de 10 jours, aucun paiement exigible avant sa fin | — | V1 |
| SES-05 | Convocation | Envoi automatique avec programme, livret d'accueil, règlement intérieur et dispositif de signalement | 9, 12 | V1 |
| SES-06 | Rappels | E-mails à J-7 et J-1 ; SMS en option | 9 | V1 (SMS V2) |
| SES-07 | Statuts de session | Brouillon, confirmée, en cours, terminée, clôturée, annulée | — | V1 |
| SES-08 | Attestations | Attestation de fin de formation et certificat de réalisation générés à la clôture | 11 | V1 |
| SES-09 | Annulations et reports | Motif, information des stagiaires, trace dans le registre des aléas | 31 | V1 |
| SES-10 | Lieux et logistique | Fiche lieu (accessibilité, capacité, équipements), checklist avant session | 17 | V2 |
| SES-11 | Agenda | Calendrier des sessions, synchronisation avec Google Agenda et Outlook | 17, 18 | V2 |
| SES-12 | Passeport de prévention | Export des formations santé-sécurité au format de dépôt en masse | — | V2 |

### E. Jour J sur téléphone

| ID | Fonctionnalité | Description | Ind. | Lot |
| --- | --- | --- | --- | --- |
| JJ-01 | Mode session | Vue téléphone : stagiaires, déroulé minuté, séquence en cours | — | V1 |
| JJ-02 | Émargement stagiaires | Par QR code ou sur l'écran du formateur, par demi-journée ; signature, horodatage, adresse IP | 12 | V1 |
| JJ-03 | Émargement du formateur | Signature du formateur par demi-journée | 12 | V1 |
| JJ-04 | Quiz en direct | Positionnement et évaluation de fin lancés par QR code, résultats en temps réel | 8, 11 | V1 |
| JJ-05 | Notes et adaptations | Notes par stagiaire, adaptations décidées (rythme, handicap, niveau) en un geste | 10 | V1 |
| JJ-06 | Satisfaction à chaud | Questionnaire de fin de session par QR code | 30 | V1 |
| JJ-07 | Classe virtuelle | Lien de visio, émargement en ligne, présence tracée | 19 | V1 |
| JJ-08 | Mode hors connexion | Fonctionne sans réseau, synchronisation au retour de la connexion | — | V2 |

### F. Évaluation et suivi des compétences

| ID | Fonctionnalité | Description | Ind. | Lot |
| --- | --- | --- | --- | --- |
| EVA-01 | Résultats par objectif | Acquis, en cours, non acquis, par stagiaire et par objectif | 11 | V1 |
| EVA-02 | Fiche compétences du stagiaire | Progression entre positionnement et fin de session | 10 | V1 |
| EVA-03 | Suivi des absences | Alertes sur absences, retards et abandons ; relance automatique ; motif d'abandon | 12 | V1 |
| EVA-04 | Évaluation à froid | Questionnaires à J+30 pour le stagiaire et le commanditaire | 30 | V2 |
| EVA-05 | Évaluation des contenus | Questionnaire dédié aux contenus, distinct de la satisfaction | 33 | V3 |

### G. Espace stagiaire et e-learning

| ID | Fonctionnalité | Description | Ind. | Lot |
| --- | --- | --- | --- | --- |
| LMS-01 | Espace stagiaire simple | Page par lien personnel : supports, attestations, quiz, réclamation | 19 | V1 |
| LMS-02 | Modules en ligne | Création de modules (texte, vidéo, PDF, quiz) | 19 | V2 |
| LMS-03 | Suivi effectif | Complétion, temps passé, journaux de connexion, quiz de validation par module | 19 | V2 |
| LMS-04 | Parcours mixtes | Modules avant ou après une session en présentiel | — | V2 |
| LMS-05 | Temps à distance certifié | Prise en compte du temps en ligne dans le certificat de réalisation | 19 | V2 |
| LMS-06 | Import SCORM | Import de modules existants au format SCORM | — | V3 |

### H. Facturation et paiements

| ID | Fonctionnalité | Description | Ind. | Lot |
| --- | --- | --- | --- | --- |
| FAC-01 | Factures | Depuis un devis ou une session ; numérotation continue ; mentions d'exonération ou de franchise de TVA | — | V1 |
| FAC-02 | Subrogation OPCO | Facture à l'OPCO et facture du reste à charge à l'entreprise | — | V1 |
| FAC-03 | Acomptes et avoirs | Acomptes, avoirs liés à la facture d'origine | — | V1 |
| FAC-04 | Suivi des paiements | Statuts, relances automatiques, retards | — | V1 |
| FAC-05 | Pièces pour l'OPCO | Convention, émargements et certificat de réalisation réunis en un fichier | — | V1 |
| FAC-06 | Export comptable | Export des factures et paiements pour le comptable (CSV) | — | V1 |
| FAC-07 | Paiement en ligne | Paiement par carte pour les particuliers | — | V2 |
| FAC-08 | Facture électronique | Émission au format Factur-X via une plateforme agréée | — | V2 (avant le 1er sept. 2027) |

### I. Qualité et Qualiopi

| ID | Fonctionnalité | Description | Ind. | Lot |
| --- | --- | --- | --- | --- |
| QUA-01 | Référentiel paramétrable | 33 indicateurs, applicabilité calculée selon le profil (non applicable automatique) ; mise à jour sans redéveloppement | Tous | V1 |
| QUA-02 | Classement des preuves | Chaque document ou action rangé sous ses indicateurs | Tous | V1 |
| QUA-03 | Score de préparation | Score « prêt pour l'audit », liste des manques par indicateur | Tous | V1 |
| QUA-04 | Preuves manuelles | Dépôt de preuves complémentaires avec date et indicateur | Tous | V1 |
| QUA-05 | Dossier d'audit | Export d'une période : sommaire PDF et archive par indicateur | Tous | V1 |
| QUA-06 | Registre des réclamations | Réclamations, difficultés et aléas ; statut, délai, réponse, action | 31 | V1 |
| QUA-07 | Registre des signalements | Violences, harcèlement, discriminations ; accès restreint ; procédure et délais ; orientation externe | 12 | V1 |
| QUA-08 | Calendrier des audits | Dates d'audit initial, de surveillance et de renouvellement ; rappels | — | V1 |
| QUA-09 | Plan d'amélioration | Actions issues des retours et réclamations, responsable, échéance, effet mesuré | 32 | V2 |
| QUA-10 | Analyse des risques | Cartographie préremplie (annulation, indisponibilité, violences, distanciel), revue trimestrielle | 32 | V2 |
| QUA-11 | Accès auditeur | Lien temporaire en lecture seule pour l'auditeur | — | V2 |
| QUA-12 | Audit blanc guidé | Questions de l'auditeur indicateur par indicateur | Tous | V2 |

### J. Veille et compétences du formateur

| ID | Fonctionnalité | Description | Ind. | Lot |
| --- | --- | --- | --- | --- |
| VEI-01 | Annuaire handicap | Contacts Agefiph, Ressource Handicap Formation, Cap emploi | 26 | V1 |
| VEI-02 | Fil de veille | Actualités réglementaires, métiers et pédagogiques commentées | 23, 24, 25 | V2 |
| VEI-03 | Journal de veille | Lu, action décidée, lien avec une modification de programme | 23, 24, 25 | V2 |
| VEI-04 | Fiche compétences du formateur | CV, diplômes, habilitations avec dates d'expiration et alertes | 21 | V2 |
| VEI-05 | Plan de développement | Formations suivies par le formateur, justificatifs | 22 | V2 |

### K. Sous-traitance

| ID | Fonctionnalité | Description | Ind. | Lot |
| --- | --- | --- | --- | --- |
| SST-01 | Session sous-traitée | Session pour un donneur d'ordre, programme fourni par lui, sans contrat avec les stagiaires | — | V1 |
| SST-02 | Dossier pour le donneur d'ordre | Émargements, évaluations et satisfaction transmis par lien | 27 | V1 |
| SST-03 | Facture au donneur d'ordre | Facture de la prestation sous-traitée | — | V1 |
| SST-04 | Invitation | Proposition au donneur d'ordre de créer un compte gratuit | — | V1 |
| SST-05 | Contrat de sous-traitance | Modèle avec répartition des responsabilités et clauses Qualiopi | 27 | V2 |

### L. Pilotage

| ID | Fonctionnalité | Description | Ind. | Lot |
| --- | --- | --- | --- | --- |
| TDB-01 | Tableau de bord du jour | À faire aujourd'hui, sessions à venir, impayés, score Qualiopi | — | V1 |
| TDB-02 | Chiffre d'affaires | Par mois, par financeur, par programme | — | V1 |
| TDB-03 | Indicateurs qualité | Satisfaction, atteinte des objectifs, abandons | 2 | V1 |
| TDB-04 | Bilan pédagogique et financier | Préremplissage annuel à partir des sessions et des factures | — | V2 |

### M. Assistance par IA

| ID | Fonctionnalité | Description | Ind. | Lot |
| --- | --- | --- | --- | --- |
| IA-01 | Programme à partir d'un descriptif | Proposition de fiche programme et de déroulé | 1, 5, 6 | V1 |
| IA-02 | Quiz à partir des supports | Proposition de questions reliées aux objectifs | 8, 11 | V1 |
| IA-03 | Reformulation des objectifs | Objectifs rendus mesurables | 5 | V1 |
| IA-04 | Synthèse des retours | Analyse des questionnaires, propositions d'amélioration | 32 | V2 |
| IA-05 | Assistant Qualiopi | Réponses aux questions sur un indicateur, à partir du référentiel | — | V2 |

Toute proposition de l'IA est validée par le formateur avant d'être enregistrée ; l'IA ne produit jamais de preuve.

### N. Notifications

| ID | Fonctionnalité | Description | Ind. | Lot |
| --- | --- | --- | --- | --- |
| NOT-01 | Centre de notifications | Notifications dans l'application et par e-mail, réglables | — | V1 |
| NOT-02 | Modèles d'e-mails | Textes des e-mails automatiques modifiables | 9 | V1 |

### O. Vente de cours en ligne

| ID | Fonctionnalité | Description | Ind. | Lot |
| --- | --- | --- | --- | --- |
| VEN-01 | Page de vente | Page par cours : présentation, vidéo, programme repris de la fiche Qualiopi, prix, bouton d'achat | 1 | V2 |
| VEN-02 | Paiement en ligne | Carte bancaire, paiement en plusieurs fois, remboursement depuis l'application | — | V2 |
| VEN-03 | Accès automatique | Création du compte stagiaire et ouverture du cours dès le paiement confirmé | 19 | V2 |
| VEN-04 | Conditions de vente | Conditions générales de vente en ligne, information avant achat, consentement et gestion du droit de rétractation | — | V2 |
| VEN-05 | Factures automatiques | Facture émise à chaque achat, mention de TVA adaptée, données prêtes pour l'e-reporting | — | V2 |
| VEN-06 | Codes promo | Réductions en pourcentage ou en montant, dates de validité, offres de lancement | — | V2 |
| VEN-07 | Formats de vente | Cours en accès libre ou session tutorée avec dates (cohorte) | — | V2 |
| VEN-08 | Avis vérifiés | Affichage des appréciations réellement recueillies, avec l'accord des stagiaires | 2, 30 | V2 |
| VEN-09 | Attestation de fin de cours | Délivrée automatiquement quand le cours est terminé et l'évaluation réussie | 11 | V2 |
| VEN-10 | Statistiques de vente | Chiffre d'affaires, visites, taux de conversion, remboursements | — | V2 |
| VEN-11 | Vente aux entreprises | Achat de plusieurs places, attribution des accès aux salariés, facture unique | — | V3 |
| VEN-12 | Packs de cours | Plusieurs cours vendus ensemble à un prix groupé | — | V3 |
| VEN-13 | Abonnement | Accès à une bibliothèque de cours par paiement mensuel ou annuel | — | V3 |
| VEN-14 | Liste d'e-mails | Formulaire d'inscription, séquence d'e-mails simple après inscription ou achat | — | V3 |
| VEN-15 | Affiliation et parrainage | Lien de recommandation, commission ou réduction pour le parrain | — | V3 |
| VEN-16 | TVA des ventes dans l'UE | Taux de TVA par pays et déclaration via le guichet unique européen (OSS) | — | V3 |

Les vidéos sont hébergées par un service spécialisé et lues dans l'application, pour éviter le téléchargement libre des contenus.

## Règles de gestion

**Trois règles priment sur toutes les autres : la session est l'objet central, un document envoyé ou signé ne se modifie plus, et aucune preuve n'est créée après coup.**

| ID | Règle |
| --- | --- |
| RG-01 | Une session est rattachée à une seule version de programme. Modifier le programme crée une nouvelle version ; les sessions passées gardent la leur. |
| RG-02 | Un document est en brouillon tant qu'il n'est ni envoyé ni signé. Ensuite il est figé (PDF, empreinte numérique, horodatage) ; une correction crée une nouvelle version et conserve l'ancienne. |
| RG-03 | La date d'une preuve est celle de l'événement réel (envoi, signature, réponse). Aucune date ne peut être saisie dans le passé sur une preuve générée par l'outil. Une preuve déposée à la main porte sa date de dépôt et la date déclarée. |
| RG-04 | Une session ne peut pas passer « confirmée » sans convention ou contrat signé, sauf en mode sous-traitant. |
| RG-05 | Pour un particulier, aucune facture ni paiement n'est exigible avant la fin du délai de rétractation de 10 jours après la signature du contrat ; l'acompte éventuel est plafonné (30 % selon le Code du travail, à valider). |
| RG-06 | Une session ne peut être « clôturée » que si les émargements de chaque demi-journée sont complets ou justifiés (absence motivée). |
| RG-07 | À la clôture, l'outil génère attestations, certificats de réalisation, questionnaire à chaud manquant et facture finale proposée. |
| RG-08 | La numérotation des factures est continue et sans trou ; une facture émise ne se supprime pas, elle s'annule par un avoir. |
| RG-09 | La mention de TVA dépend du profil : exonération (attestation fournie) ou franchise en base ; le choix est verrouillé par exercice. |
| RG-10 | Un objectif sans évaluation reliée bloque la publication du programme (avertissement, contournable une fois avec justification). |
| RG-11 | Un indicateur Qualiopi est « couvert » s'il a au moins une preuve sur les 12 derniers mois ; « à risque » sinon ; « non applicable » selon le profil (par exemple, pas de formation certifiante). |
| RG-12 | Les indicateurs de résultats publics sont recalculés chaque nuit ; ils ne sont publiés qu'à partir de 5 réponses, avec la période et le nombre de répondants. |
| RG-13 | Un signalement (violences, harcèlement, discriminations) n'est visible que par le référent désigné ; s'il vise le formateur, il est transmis directement au suppléant extérieur. Il fait l'objet d'un accusé de réception sous 48 h (délai paramétrable). |
| RG-14 | Une réclamation reçoit un statut (nouvelle, en cours, traitée) et un délai cible ; une réclamation non traitée à l'échéance déclenche une alerte. |
| RG-15 | En mode sous-traitant, les données des stagiaires appartiennent au donneur d'ordre : l'outil agit comme sous-traitant des données et les transmet ou les supprime à la fin de la mission. |
| RG-16 | Une absence non justifiée à une demi-journée déclenche une relance au stagiaire et, en intra, une information au contact entreprise. |
| RG-17 | Les comptes gratuits sont limités à 2 sessions en propre par mois ; les sessions en sous-traitance sont illimitées. |
| RG-18 | Les données sont conservées pendant toute la durée du cycle de certification, puis selon les durées légales (factures : 10 ans) ; le formateur est alerté avant toute suppression automatique. |

### Règles propres à la vente en ligne

| ID | Règle |
| --- | --- |
| RG-19 | Un achat par un particulier d'une formation professionnelle suit le contrat de formation (rétractation de 10 jours, RG-05). Un contenu numérique vendu hors formation professionnelle suit le Code de la consommation (rétractation de 14 jours, avec renonciation expresse si l'accès immédiat est demandé). Le type de vente est choisi à la création du cours ; à valider par un juriste. |
| RG-20 | L'accès au cours s'ouvre au paiement confirmé (ou à la fin du délai prévu par RG-19) et se ferme en cas de remboursement. |
| RG-21 | Une attestation de fin de cours n'est délivrée que si le suivi effectif est prouvé (complétion, temps passé, évaluation réussie). |
| RG-22 | Les avis affichés sur une page de vente sont uniquement des appréciations réellement recueillies, avec l'accord du stagiaire ; ils ne sont ni modifiables ni sélectionnés à la main, et la note suit la méthode de RG-12. |
| RG-23 | Les pages de vente passent par le contrôle des mentions à risque (CAT-10) : pas de « éligible CPF » sans référencement réel. |

## Modèle de données

**Onze objets principaux ; la session est au centre et chaque preuve pointe vers l'événement réel qui l'a produite.**

&#91;embedded content: modèle de données simplifié · 11 objets\]

Les traces, documents et registres créent des preuves ; une preuve peut servir plusieurs indicateurs.

- Chaque objet porte l'identifiant de l'organisme, pour garantir l'isolation des données entre comptes.
- Les objets figés (document envoyé, émargement, facture émise, preuve) ne sont jamais modifiés : on ajoute une version ou un avoir.
- Un journal des actions (qui, quoi, quand) est tenu sur tous les objets, sans possibilité de suppression.

La vente en ligne ajoute deux objets en V2 : le **produit** (un cours mis en vente, son prix, son type de vente) et la **commande** (acheteur, paiement, remboursement), qui crée une inscription et une facture.

## Exigences réglementaires et documents obligatoires

**L'outil doit produire 11 documents ou déclarations conformes au Code du travail, au Code général des impôts et au référentiel Qualiopi.** Les modèles sont fournis par défaut, modifiables par le formateur, et revus par un juriste avant la V1.

| Document | Moment | Contenu attendu | Référence indicative |
| --- | --- | --- | --- |
| Programme de formation | Avant toute inscription | Objectifs, prérequis, durée, modalités pédagogiques et d'évaluation, tarifs, délais d'accès, accessibilité, contact | Code du travail ; Qualiopi ind. 1 |
| Convention de formation | Avant la session (entreprise) | Intitulé, objectif, programme, durée, dates, effectif, prix, modalités de règlement | Code du travail, art. L6353-1 et suivants |
| Contrat de formation | Avant la session (particulier) | Mêmes éléments + délai de rétractation de 10 jours, modalités de paiement | Code du travail, art. L6353-3 à L6353-7 ([L6353-5 cité ici](https://www.lafabriquedunet.fr/logiciels/gestion/logiciel-organisme-formation/)) |
| Règlement intérieur | Remis avant ou au début de la session | Hygiène et sécurité, discipline, sanctions, représentation des stagiaires si sessions longues | Code du travail, art. L6352-3 |
| Convocation et livret d'accueil | Avant la session | Date, lieu ou lien, horaires, contacts, accessibilité, dispositif de signalement | Qualiopi ind. 9 et 12 |
| Feuilles d'émargement | Chaque demi-journée | Nom, signature, date, demi-journée, signature du formateur | Exigées par les financeurs |
| Certificat de réalisation | Fin de session | Modèle officiel fixé par arrêté, durée réalisée, y compris à distance | Financeurs (OPCO, CPF) |
| Attestation de fin de formation | Fin de session | Objectifs, nature, durée, résultats de l'évaluation des acquis | Code du travail, art. L6353-1 |
| Facture | Après la prestation (ou acompte) | Mentions légales, numéro continu, mention d'exonération (art. 261-4-4° a du CGI) ou de franchise de TVA | Code général des impôts ; facture électronique au 1er sept. 2027 |
| Bilan pédagogique et financier | Une fois par an | Chiffre d'affaires par financeur, nombre de stagiaires et d'heures | Déclaration annuelle obligatoire |
| Passeport de prévention | Après certaines formations santé-sécurité | Formations suivies par chaque stagiaire | Loi n° 2026-534 du 25 juin 2026 |

### Autres obligations à intégrer

- **Qualiopi :** les 33 indicateurs du décret n° 2026-728 ; le détail des preuves par indicateur est dans la feuille [Qualiopi – Indicateurs, automatisation et preuves](https://claude.ai/artifact/LpHTZM84V3HnvkRk9gg3Wc).
- **Données personnelles (RGPD) :** information des stagiaires, registre des traitements, contrat de sous-traitance des données avec chaque formateur, droits d'accès et d'effacement, données de santé (handicap) limitées au strict besoin d'adaptation.
- **Signature électronique :** signature simple au sens du règlement européen eIDAS, avec dossier de preuve (identité, horodatage, adresse IP, empreinte du document).
- **Accessibilité :** interfaces stagiaires conformes au référentiel général d'amélioration de l'accessibilité (RGAA), niveau AA visé.

### Vente en ligne aux particuliers

- **Code de la consommation :** information avant l'achat (prix, contenu, durée d'accès), confirmation de commande, droit de rétractation de 14 jours pour un contenu numérique, sauf renonciation expresse en cas d'accès immédiat.
- **Médiation de la consommation :** tout vendeur à des particuliers doit proposer un médiateur ; ses coordonnées figurent dans les conditions de vente.
- **TVA :** exonération seulement pour la formation professionnelle couverte par l'attestation d'exonération ; sinon TVA au taux du pays de l'acheteur pour les ventes dans l'Union européenne au-delà du seuil, déclarée via le guichet unique (OSS).
- **Facture électronique :** les ventes aux particuliers relèvent de l'e-reporting, au même calendrier que l'émission pour les TPE (1er septembre 2027).
- **Avis en ligne :** les avis publiés doivent être authentiques et leur mode de collecte indiqué.

## Intégrations externes

**Neuf services externes ; quatre sont indispensables dès la V1 (e-mail, paiement de l'abonnement, IA, stockage).** Chaque intégration passe par une couche d'adaptation pour pouvoir changer de fournisseur.

| Service | Usage | Fournisseur envisagé | Lot |
| --- | --- | --- | --- |
| E-mail transactionnel | Convocations, rappels, liens de signature, questionnaires | Brevo ou équivalent européen | V1 |
| Paiement de l'abonnement | Formules, cartes, factures de l'outil | Stripe | V1 |
| IA générative | Programmes, objectifs, quiz, synthèses | API d'un modèle de langage, données non utilisées pour l'entraînement | V1 |
| Stockage de fichiers | Documents figés, supports, preuves | Stockage objet hébergé dans l'Union européenne | V1 |
| Agenda | Synchronisation des sessions | Google Agenda, Microsoft Outlook | V2 |
| Paiement des stagiaires particuliers | Paiement par carte des formations | Stripe | V2 |
| Facture électronique | Émission Factur-X | Plateforme agréée (à choisir) | V2, avant le 1er sept. 2027 |
| SMS | Rappels | Fournisseur européen | V2 |
| CPF / EDOF | Dossiers Mon Compte Formation | Partenaire déjà connecté (type Wedof) | V3 |

La visioconférence n'est pas intégrée : le formateur colle le lien de son outil habituel (Zoom, Teams, Google Meet) et l'émargement en ligne se fait dans l'application.

Pour la vente de cours en ligne (V2), Stripe gère aussi le paiement en plusieurs fois et les remboursements, et un service d'hébergement vidéo européen (par exemple Bunny Stream ou Vimeo) diffuse les vidéos des cours.

## Exigences non fonctionnelles

**Les exigences sont dimensionnées pour 1 500 formateurs et 100 000 stagiaires par an à 3 ans, avec une priorité absolue à l'intégrité des preuves.**

| Domaine | Exigence | Mesure de réussite |
| --- | --- | --- |
| Disponibilité | Service accessible en continu, maintenances hors heures de formation | 99,5 % par mois ; maintenance planifiée la nuit ou le week-end |
| Performance | Pages rapides, y compris sur téléphone en 4G | Affichage en moins de 2 s ; émargement enregistré en moins de 1 s |
| Montée en charge | Pics le lundi matin et en fin de mois (facturation) | 500 émargements simultanés sans dégradation |
| Intégrité des preuves | Documents figés, horodatés, empreinte numérique, journal des actions non modifiable | Toute modification d'une preuve est détectable |
| Sauvegardes | Sauvegarde quotidienne, copie dans un second centre de données européen | Perte maximale 24 h ; restauration en moins de 4 h |
| Sécurité | Chiffrement en transit et au repos, mots de passe hachés, double authentification, liens sécurisés à durée limitée | Test d'intrusion avant le lancement public puis chaque année |
| Cloisonnement | Les données d'un formateur ne sont jamais visibles d'un autre | Tests automatisés d'isolation |
| Données personnelles | Hébergement en France ou dans l'Union européenne, export et effacement à la demande | Registre tenu, demande traitée en moins de 30 jours |
| Accessibilité | Interfaces stagiaires et pages publiques accessibles | RGAA niveau AA visé sur les écrans stagiaires |
| Téléphone | Application installable (PWA), parcours jour J entièrement utilisable sur téléphone | iOS et Android, deux dernières versions |
| Navigateurs | Chrome, Edge, Firefox, Safari | Deux dernières versions |
| Langue | Interface en français, textes séparés du code | Ajout d'une langue sans modifier le code |
| Prise en main | Aucune formation nécessaire | Première session créée en moins de 30 minutes par un nouvel utilisateur |
| Support | Aide intégrée, réponse par e-mail ou messagerie | Réponse en moins de 1 jour ouvré |
| Supervision | Suivi des erreurs et des performances, alertes | Incident détecté en moins de 5 minutes |

## Offres et droits par formule

**Les formules se distinguent par le volume de sessions en propre et par les modules Qualité et e-learning, jamais par le nombre de stagiaires.**

| Module | Découverte (0 €) | Solo (29 € HT/mois) | Solo Qualiopi (49 € HT/mois) |
| --- | --- | --- | --- |
| Sessions en propre | 2 par mois | Illimitées | Illimitées |
| Mode sous-traitant (SST) | Illimité | Illimité | Illimité |
| Catalogue et conception (CAT) | Oui, page publique avec mention de l'outil | Oui | Oui |
| Clients et devis (CLI) | Oui | Oui | Oui |
| Administratif de session (SES) | Oui | Oui | Oui |
| Jour J et évaluation (JJ, EVA) | Oui | Oui | Oui |
| Facturation (FAC) | Non | Oui | Oui |
| Assistance par IA (IA) | 10 générations par mois | 100 par mois | 300 par mois |
| Tableau de bord Qualiopi, registres, export d'audit (QUA) | Score seul | Score + registres | Complet |
| Veille et compétences (VEI) | Non | Non | Oui |
| E-learning (LMS-02 à LMS-06) | Non | Non | Oui |
| Vente de cours en ligne (VEN) | Non | 1 cours en vente, commission de 5 % par vente | Cours illimités, sans commission |
| Pilotage (TDB) | Tableau du jour | Complet | Complet |

Les limites d'IA sont indicatives : à ajuster selon le coût réel par génération observé en bêta. La facture au donneur d'ordre (SST-03) reste incluse dans la formule Découverte. La commission sur les ventes de la formule Solo est une proposition à tester en bêta.

## Lots de livraison et critères d'acceptation

**Trois lots ; la V1 est acceptée quand un formateur peut mener une session complète, de la demande du client à la facture, et présenter un dossier d'audit sans autre outil.**

| Lot | Contenu | Échéance cible | Critères d'acceptation |
| --- | --- | --- | --- |
| V1 – Session complète | 70 fonctionnalités marquées V1 : compte, catalogue, conception, clients, sessions, jour J, évaluation, facturation, Qualiopi de base, sous-traitance, IA de rédaction | Fin avril 2027 (bêta), mai 2027 (lancement) | Voir les scénarios ci-dessous |
| V2 – Formateur complet | E-learning et suivi effectif, vente de cours en ligne (VEN-01 à VEN-10), veille, compétences, amélioration continue, risques, bilan annuel, agenda, paiement en ligne, facture électronique | Octobre 2027 ; facture électronique avant le 1er sept. 2027 | Un module en ligne suivi avec temps passé prouvé ; un cours acheté par carte, ouvert automatiquement, facturé et remboursé dans le délai de rétractation ; facture émise au format Factur-X et acceptée par la plateforme agréée ; bilan annuel prérempli juste |
| V3 – Élargissement | Formations certifiantes, CPF, SCORM, vente aux entreprises, packs, abonnements, affiliation, TVA européenne, évaluation des contenus, délégation d'accès, simulateur de financement | 2028 | À définir après la V2 |

### Scénarios d'acceptation de la V1

1. **Première prise en main :** un formateur qui découvre l'outil crée son profil, importe un programme existant et publie sa page catalogue en moins de 30 minutes.
2. **Session entreprise financée par OPCO :** questionnaire de besoin → devis signé → convention signée → convocations → émargement par QR code sur 2 demi-journées → quiz de début et de fin → satisfaction à chaud → clôture → attestations, certificats, factures OPCO et reste à charge, pièces pour l'OPCO en un fichier.
3. **Particulier :** contrat signé, aucune facture possible pendant les 10 jours de rétractation, facture émise ensuite.
4. **Session sous-traitée :** session créée pour un donneur d'ordre, émargements et évaluations transmis par lien, facture au donneur d'ordre, invitation reçue par celui-ci.
5. **Incidents :** une absence déclenche une relance ; une réclamation et un signalement sont traités dans leurs registres, le signalement visant le formateur part au suppléant.
6. **Audit :** le score Qualiopi reflète les preuves réelles ; l'export d'une période produit un sommaire et une archive par indicateur ; aucune preuve n'est antidatable.
7. **Portabilité :** l'export complet contient toutes les données et tous les documents du compte.

## Livrables, recette et points ouverts

**Le prestataire ou l'équipe de développement livre le code, l'application en service et la documentation ; la recette se fait sur les scénarios d'acceptation avec 5 formateurs réels.**

### Livrables attendus

- Code source dans un dépôt appartenant au porteur du projet, avec historique.
- Environnements de test et de production, déploiement automatisé.
- Tests automatisés couvrant les règles de gestion RG-01 à RG-18 et l'isolation des données entre comptes.
- Modèles de documents relus par un juriste.
- Documentation technique (architecture, modèle de données, intégrations) et aide en ligne pour les utilisateurs.
- Registre des traitements de données personnelles et modèle de contrat de sous-traitance des données.

### Organisation de la recette

1. Recette interne de chaque fonctionnalité sur son identifiant (ACC-01, CAT-01…).
2. Recette métier : les 7 scénarios d'acceptation de la V1, joués par le porteur du projet.
3. Bêta : 20 à 30 formateurs pendant 6 à 8 semaines, dont au moins 5 qui mènent une vraie session de bout en bout.
4. Correction des anomalies bloquantes avant le lancement public ; les autres sont planifiées.

### Points ouverts

- [ ] Contenu exact du guide de lecture Qualiopi V10 (preuves attendues pour les indicateurs 12, 19 et 32).
- [ ] Statut des indicateurs 29 et 33 (réservés aux CFA ?).
- [ ] Choix de la plateforme agréée de facture électronique, et confirmation du calendrier d'émission pour les TPE.
- [ ] Format exact du dépôt en masse du passeport de prévention.
- [ ] Plafond d'acompte et mentions obligatoires des contrats avec les particuliers, à valider par un juriste.
- [ ] Partenaire pour la connexion CPF / EDOF (V3).
- [ ] Coût réel de l'IA par génération, pour fixer les limites par formule.
- [ ] Mode de développement retenu : seul avec l'IA, développeur indépendant, agence ou associé technique.

* [ ] Règles de rétractation et de TVA applicables à chaque type de cours vendu en ligne, à valider par un juriste et un expert-comptable.
* [ ] Choix du médiateur de la consommation et de l'hébergeur vidéo.
* [ ] Modèle de commission sur les ventes en ligne de la formule Solo.
