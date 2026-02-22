# Architecture Overview

GarantFacile est une plateforme SaaS construite sur une architecture moderne découplée, séparant les responsabilités entre un Backend API robuste et un Frontend réactif.

## Structure du Système

Le projet est divisé en deux packages principaux :

### 1. Backend (NestJS)

Le noyau logique de l'application, utilisant TypeScript et le framework NestJS.

- **Modules** : Organisation par domaines fonctionnels (Auth, Garants, Documents, Abonnements, RGPD).
- **Persistance** : PostgreSQL avec Prisma ORM pour garantir l'intégrité des types.
- **Asynchronisme** : Redis et BullMQ pour gérer les tâches lourdes comme le filigranage des documents sans bloquer l'API.

### 2. Frontend (Next.js)

Une application web moderne utilisant Next.js 14 avec l'App Router.

- **Rendu** : Utilisation du Server-Side Rendering (SSR) pour l'optimisation SEO et la rapidité de chargement.
- **UI** : Bibliothèque HeroUI pour des composants accessibles et performants, stylisés avec Tailwind CSS.

## Flux de Données

1. **Authentification** : Gestion via JWT avec stockage sécurisé des cookies côté frontend.
2. **Gestion Documentaire** :
   - Upload vers le backend.
   - Mise en file d'attente (Redis).
   - Traitement (Filigrane Facile) via BullMQ.
   - Notification de statut au client.
3. **Paiements** : Intégration Stripe avec gestion des webhooks pour synchroniser l'état des abonnements en temps réel.

## Services Partenaires

- **DossierFacile** : Utilisé pour la vérification de l'identité et de la solvabilité des garants.
- **Filigrane Facile** : Service de protection des documents sensibles par ajout de filigranes.
