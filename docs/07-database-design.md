# 07 — Database Design & Prisma Schema

> Owned and maintained by `edith`.

---

## 1. Database Specifications
- **Database Engine**: PostgreSQL 15+
- **ORM**: Prisma ORM
- **Migration Strategy**: Version-controlled SQL migrations (`prisma migrate dev`)
- **Naming Conventions**: `snake_case` for database tables and columns; `camelCase` for Prisma fields.

---

## 2. Core Entities & Schema Blueprint

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  SUPERADMIN
  ADMIN
  MEMBER
}

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String    @map("password_hash")
  firstName    String?   @map("first_name")
  lastName     String?   @map("last_name")
  role         Role      @default(MEMBER)
  isActive     Boolean   @default(true) @map("is_active")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  @@index([email])
  @@map("users")
}
```

---

## 3. Query Optimization & Indexing Rules
- Index all foreign keys, unique constraint columns, and high-frequency filter columns.
- Use cursor-based pagination for large data sets (`take: limit, skip: 1, cursor: { id }`).
