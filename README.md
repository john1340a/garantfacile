# GarantFacile

Plateforme SaaS mettant en relation locataires et propriétaires avec un service de garant premium vérifié.

## Documentation Technique

La documentation technique détaillée est disponible dans le dossier [docs/](file:///c:/Users/jean-/Downloads/garantfacile/docs) :

- [Architecture Overview](file:///c:/Users/jean-/Downloads/garantfacile/docs/architecture/overview.md) : Structure du code, flux de données NestJS/Next.js.
- [Core Stack](file:///c:/Users/jean-/Downloads/garantfacile/docs/libs/core.md) : Détails sur NestJS, Prisma, Redis et BullMQ.
- [Interface UI](file:///c:/Users/jean-/Downloads/garantfacile/docs/libs/ui.md) : Guide sur HeroUI, Tailwind CSS et Material Symbols.
- [Conformité RGPD](file:///c:/Users/jean-/Downloads/garantfacile/docs/compliance/rgpd.md) : Chiffrement AES-256, gestion des consentements et droits ARCO.

## Démarrage Rapide (Docker)

```bash
# Copier les variables d'environnement
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Éditer les variables (Stripe, clés API, etc.)
nano backend/.env

# Lancement des services
docker compose up -d

# Initialisation base de données
docker compose exec backend npx prisma migrate deploy
```

L'application est accessible sur :

- Frontend : http://localhost:3000
- Backend API : http://localhost:3001/api

## Installation Développement Local

### Backend

```bash
cd backend
npm install
cp .env.example .env
docker compose up postgres redis -d
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Licence

Propriété exclusive de GarantFacile.
