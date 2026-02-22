# Core Stack Technical Documentation

Cette section détaille les technologies fondamentales utilisées dans le backend de GarantFacile.

## Framework Backend : NestJS

NestJS a été choisi pour sa structure modulaire et sa compatibilité totale avec TypeScript.

- **Modules** : Encapsulation de la logique par domaine (`UsersModule`, `AuthModule`, `GarantsModule`).
- **Services** : Injection de dépendances pour la logique métier.
- **Controllers** : Routes REST exposant les fonctionnalités au Frontend.

## Accès aux Données : Prisma & PostgreSQL

L'utilisation de Prisma permet une interaction type-safe avec la base de données PostgreSQL.

- **Schema** : Déclaré dans `backend/prisma/schema.prisma`.
- **Migrations** : Suivi rigoureux de l'évolution de la base.
- **Prisma Client** : Utilisé par tous les services du backend.

## Tâches Asynchrones : Redis & BullMQ

Pour garantir une expérience utilisateur fluide, les opérations chronophages sont déportées.

- **Redis** : Utilisé comme broker de messages rapide et fiable.
- **BullMQ** : Système de gestion de files d'attente pour le filigranage des documents.
- **Retry Logic** : Gestion automatique des erreurs et tentatives de traitement.

## Authentification

- **JWT (JSON Web Tokens)** : Utilisé pour sécuriser les appels API.
- **Bcrypt** : Hachage sécurisé des mots de passe utilisateurs.
