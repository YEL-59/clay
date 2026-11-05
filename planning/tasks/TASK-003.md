# TASK-003: Design Database Schema & Prisma Models

> **Status**: `BACKLOG`  
> **Assignee**: `edith` (Backend & Data Architect)  
> **Priority**: `P0` (Critical)  
> **Dependencies**: `TASK-001`  
> **Master Board**: [planning/task.md](../task.md)

---

## 1. Objective & User Story
As Backend and Data Specialist (`edith`), design the normalized relational database schema in PostgreSQL, create Prisma models with strict relations, indexes, and constraints, and generate the initial migration.

---

## 2. Inputs & Context Documents
- **Database Design Doc**: [docs/07-database-design.md](../../docs/07-database-design.md)
- **Data Dictionary**: [docs/03-data-dictionary.md](../../docs/03-data-dictionary.md)
- **Prisma Schema**: [development/backend/prisma/schema.prisma](../../development/backend/prisma/schema.prisma)

---

## 3. Step-by-Step Execution Plan
1. Review entity relationships (One-to-Many, Many-to-Many) from `docs/07-database-design.md`.
2. Define models in `development/backend/prisma/schema.prisma`:
   - Primary keys: UUID (`@default(uuid())`) or CUID.
   - Timestamps: `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt`.
   - Appropriate indexes on high-frequency query fields (e.g. `email`, `status`, foreign keys).
3. Generate Prisma client: `npx prisma generate`.
4. Create initial migration: `npx prisma migrate dev --name init_db_schema`.
5. Verify schema integrity and foreign key constraints.

---

## 4. Expected Outputs
- `development/backend/prisma/schema.prisma` with defined entities.
- Generated migration files in `development/backend/prisma/migrations/`.
- `docs/07-database-design.md` synced with actual Prisma models.

---

## 5. Acceptance Criteria
- [ ] Prisma schema validates cleanly with `npx prisma validate`.
- [ ] All foreign keys have explicit cascade/restrict deletion rules.
- [ ] Common lookup and query fields have database indexes.
- [ ] No destructive migrations executed without explicit human consent.

---

## 6. Verification Evidence (Thanos)
- **Command**: `cd development/backend && npx prisma validate`
- **Status**: `Pending Verification`
- **Output Log**: Awaiting execution.

---

## 7. Fresh Session Handoff
```markdown
planning/updateplanning.md পড়ে TASK-004 শুরু করো।
```
