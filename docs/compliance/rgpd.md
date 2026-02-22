# RGPD & Data Compliance

La protection des données personnelles est une priorité absolue pour GarantFacile. Cette documentation détaille les mesures techniques et organisationnelles mises en place.

## Mesures de Sécurité Techniques

### 1. Chiffrement (Security by Design)

- **Données sensibles** : Les informations hautement confidentielles (revenus, pièces d'identité) sont chiffrées en base de données.
- **Algorithme** : Utilisation de l'AES-256-GCM (Authenticated Encryption with Associated Data).
- **Communication** : Tous les flux passent par HTTPS (TLS 1.3).

### 2. Anonymisation (Droit à l'oubli)

Conformément à l'Article 17 du RGPD :

- La suppression d'un compte entraîne une anonymisation irréversible des données nominatives.
- L'adresse email est convertie en `deleted-xxxxx@deleted.local`.

## Gestion du Consentement

### Consentements Granulaires

Le système distingue deux types de consentements :

- **Obligatoire** : Traitement nécessaire au bon fonctionnement du service.
- **Optionnel** : Marketing et communications partenaires.

### Traçabilité

Chaque consentement est loggé avec :

- Timestamp précis.
- Adresse IP (hashée pour l'audit partiel).
- User Agent du navigateur.

## Audit Logging

Toutes les actions sensibles (Accès, Modification, Suppression) sont tracées via un middleware automatique dans le backend, permettant de fournir un historique complet en cas de contrôle de la CNIL.

## Exercice des Droits (ARCO)

Les utilisateurs peuvent automatiser l'exercice de leurs droits via l'interface `/rgpd` :

- **Export (Accès)** : Génération d'un fichier JSON conforme (Article 15).
- **Effacement** : Suppression totale et anonymisée (Article 17).
- **Rectification** : Possibilité de modifier ses informations via les formulaires de profil.
