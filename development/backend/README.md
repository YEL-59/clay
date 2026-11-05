# Backend Application (`development/backend/`)

This directory houses the backend application. The framework, language, database, and ORM are configured centrally in `project.config.md`.

## Stack Overview
- Defined in: `project.config.md`
- Architecture: Modular service boundaries, transport controllers/handlers, and server-side validation.

## Getting Started

```bash
cd development/backend
npm install
npx prisma generate
npm run start:dev
```

The API will be available at [http://localhost:4000](http://localhost:4000) (or configured port).
Swagger documentation will be available at [http://localhost:4000/api/docs](http://localhost:4000/api/docs).

## Scripts
- `npm run start:dev` - Start development server with reload
- `npm run build` - Compile backend application build
- `npm run start:prod` - Run compiled production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npx prisma migrate dev` - Run Prisma migrations locally
- `npx prisma studio` - Launch visual Prisma database inspector
