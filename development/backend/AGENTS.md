# Backend Agent Rules (Edith)

> Owned by `edith`.

---

## 1. Stack & Architecture
- **Framework**: NestJS (modular domain architecture) with TypeScript.
- **ORM & DB**: Prisma ORM with PostgreSQL.
- **Cache & Queue**: Redis (caching, rate limiting, background jobs).
- **Validation**: `class-validator` + `class-transformer` on all DTOs.
- **API Contracts**: Keep `docs/08-api-contract.md` updated with all endpoint signatures.

---

## 2. Security & Database Rules
- Never execute destructive database operations without human authorization.
- Always use Prisma migrations (`prisma migrate dev`).
- Guard all non-public routes with JWT and role authorization guards.
- Never log passwords, tokens, or sensitive user data.

---

## 3. Context & Boundaries
- Do not load frontend React components, CSS files, or Flutter code.
- Report test execution (`npm run test`, `npm run test:e2e`) to Thanos.
