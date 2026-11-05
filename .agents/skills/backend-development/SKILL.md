---
name: backend-development
description: Workflow for implementing NestJS modular architecture, Prisma ORM schemas, PostgreSQL migrations, Redis caching, and REST APIs with Edith.
---

# Backend Development Workflow (Edith)

## Purpose
Guide the Backend Specialist (`edith`) to implement scalable, secure, and type-safe server logic in `development/backend/`.

## Architecture Principles
- **Transport Separation**: Controllers only handle HTTP concerns (request parsing, status codes, calling services).
- **Domain Services**: Business logic, calculations, and invariants live in domain services.
- **Data Access**: Prisma Client operations, query optimization, indexing, and transactional boundaries.

## Step-by-Step Procedure

### 1. Database Schema & Migration
- Open `docs/07-database-design.md` and check the entity relationship.
- Update `prisma/schema.prisma` with explicit relations, indexes, and constraints.
- Generate migration:
  ```bash
  pnpm --filter backend prisma migrate dev --name <migration_name>
  ```
- *Human Approval Gate*: If migration drops columns or tables, stop and ask the user for approval.

### 2. DTO & Validation
- Define request and response DTOs using `class-validator` and `class-transformer`.
- Sanitize inputs to prevent SQL injection and parameter tampering.

### 3. Business Logic & Transactions
- Implement domain logic inside dedicated services.
- Use `prisma.$transaction` for multi-step mutations where consistency is required.

### 4. Auth & Guards
- Apply JWT guards or role-based permission guards on protected endpoints.
- Extract user context securely via custom `@CurrentUser()` decorators.

### 5. Contract Synchronization
- Document the newly built endpoint in `docs/08-api-contract.md` so Friday and Thor can integrate seamlessly.
- Run unit/integration tests:
  ```bash
  pnpm --filter backend test
  ```
