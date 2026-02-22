# GarantFacile 🏠

Plateforme SaaS mettant en relation locataires et propriétaires avec un service de garant premium vérifié.

## Stack technique

- **Frontend** : Next.js 14 (App Router, SSR/SEO) + TypeScript
- **Backend** : NestJS + TypeScript
- **Base de données** : PostgreSQL via Prisma ORM
- **Cache & Files** : Redis (BullMQ pour le filigranage asynchrone)
- **Paiements** : Stripe (abonnements mensuel/annuel)
- **Filigranage** : Filigrane Facile API (avec mock de développement)
- **Vérification** : GarantFacile API (avec mock de développement)
- **RGPD** : Chiffrement AES-256-GCM, consentements granulaires, Axeptio

## Structure du projet

```
garantfacile/
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/         # JWT auth (register, login, refresh)
│   │   │   ├── users/        # Gestion des utilisateurs
│   │   │   ├── garants/      # Profils garants + vérification
│   │   │   ├── documents/    # Upload + filigranage BullMQ
│   │   │   ├── abonnements/  # Stripe subscriptions + webhooks
│   │   │   └── rgpd/         # Droits ARCO + audit logging
│   │   └── prisma/           # PrismaService
│   ├── prisma/schema.prisma
│   ├── Dockerfile
│   └── package.json
├── frontend/                 # Next.js 14
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx    # Root layout + Axeptio consent
│   │   │   ├── page.tsx      # Landing page + pricing
│   │   │   ├── dashboard/    # Dashboard locataire
│   │   │   ├── garant/[id]/  # Profil garant
│   │   │   ├── checkout/     # Stripe checkout
│   │   │   └── rgpd/         # Droits RGPD (ARCO)
│   │   ├── components/
│   │   └── lib/              # API client, auth helpers
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Lancement rapide avec Docker

```bash
# Copier les variables d'environnement
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Éditer les variables (Stripe, clés API, etc.)
nano backend/.env

# Lancer tous les services
docker compose up -d

# Appliquer les migrations Prisma
docker compose exec backend npx prisma migrate deploy
```

L'application sera disponible sur :
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:3001/api
- **Swagger Docs** : http://localhost:3001/api/docs

## Installation en développement local

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Éditer .env avec vos clés

# Démarrer PostgreSQL et Redis (via Docker)
docker compose up postgres redis -d

# Générer le client Prisma et migrer
npx prisma generate
npx prisma migrate dev --name init

# Démarrer le backend
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Éditer .env.local

npm run dev
```

## Variables d'environnement

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret JWT (min 32 chars) |
| `REDIS_HOST` / `REDIS_PORT` | Redis pour BullMQ |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe |
| `STRIPE_PRICE_MENSUEL` | Price ID plan mensuel |
| `STRIPE_PRICE_ANNUEL` | Price ID plan annuel |
| `FILIGRANE_API_URL` | URL API Filigrane Facile |
| `FILIGRANE_API_KEY` | Clé API Filigrane Facile |
| `GARANTFACILE_API_URL` | URL API GarantFacile |
| `GARANTFACILE_API_KEY` | Clé API GarantFacile |
| `AES_ENCRYPTION_KEY` | Clé AES-256 (exactement 32 chars) |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL de l'API backend |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe |
| `NEXT_PUBLIC_AXEPTIO_CLIENT_ID` | ID client Axeptio (RGPD) |

## Déploiement

### Vercel (Frontend)

```bash
# Installer Vercel CLI
npm i -g vercel

cd frontend
vercel --prod

# Configurer les variables d'environnement dans le dashboard Vercel
```

### Railway (Backend + PostgreSQL + Redis)

1. Créer un projet Railway
2. Ajouter les services : PostgreSQL, Redis, et un service Node.js
3. Lier le répertoire `backend/`
4. Configurer les variables d'environnement dans Railway
5. La commande de démarrage : `npm run prisma:migrate && npm start`

## API Endpoints

### Auth
- `POST /api/auth/register` - Inscription avec consentement RGPD
- `POST /api/auth/login` - Connexion (retourne JWT)
- `GET /api/auth/refresh` - Renouveler le token
- `GET /api/auth/me` - Profil courant

### Garants
- `GET /api/garants` - Liste des garants vérifiés
- `GET /api/garants/:id` - Profil d'un garant
- `POST /api/garants` - Créer son profil garant
- `PUT /api/garants/me` - Mettre à jour son profil
- `POST /api/garants/:id/verify` - Déclencher la vérification

### Documents
- `POST /api/documents` - Uploader un document (déclenche filigranage)
- `GET /api/documents` - Mes documents
- `DELETE /api/documents/:id` - Supprimer un document

### Abonnements
- `POST /api/abonnements/checkout` - Créer une session Stripe
- `POST /api/abonnements/webhook` - Webhook Stripe
- `GET /api/abonnements/my` - Mon abonnement courant
- `DELETE /api/abonnements/cancel` - Annuler l'abonnement

### RGPD
- `GET /api/rgpd/export` - Exporter mes données (Article 15)
- `DELETE /api/rgpd/delete` - Supprimer mes données (Article 17)
- `PUT /api/rgpd/consent` - Mettre à jour les consentements
- `GET /api/rgpd/consent/history` - Historique des consentements

## Conformité RGPD

- **Chiffrement** : AES-256-GCM pour les données sensibles et clés de documents
- **Consentements granulaires** : RGPD obligatoire + marketing optionnel (loggé avec IP/UA)
- **Audit logging** : Middleware automatique sur toutes les routes
- **Soft delete** : Les comptes supprimés sont anonymisés, pas effacés brutalement
- **Droit à l'effacement** : Email anonymisé en `deleted-xxxxx@deleted.local`
- **Export de données** : JSON complet sans champs sensibles (passwordHash, encryptedData)
- **Axeptio** : Bandeau de consentement cookies intégré dans le layout Next.js

## Tests

```bash
cd backend
npm test              # Tous les tests
npm run test:cov      # Avec couverture
```

Tests unitaires inclus :
- `auth.service.spec.ts` - Register, login, gestion des erreurs
- `garants.service.spec.ts` - CRUD garants
- `rgpd.service.spec.ts` - Export, suppression, consentements, chiffrement AES

