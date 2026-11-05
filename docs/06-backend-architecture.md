# 06 — Backend Architecture

> Owned and maintained by `edith`.

---

## 1. Directory Structure (`development/backend/`)
```text
development/backend/
├── src/
│   ├── modules/
│   │   ├── auth/               # Authentication (JWT, strategies, guards)
│   │   ├── users/              # User domain service, controller, DTOs
│   │   └── [domain]/           # Business domain modules
│   ├── common/
│   │   ├── decorators/         # @CurrentUser(), @Public()
│   │   ├── filters/            # Global HttpExceptionFilter
│   │   ├── guards/             # JwtAuthGuard, RolesGuard
│   │   └── interceptors/       # Logging & Transform interceptors
│   ├── database/               # PrismaService and database module
│   ├── main.ts                 # Bootstrap with validation pipes & CORS
│   └── app.module.ts           # Root module
├── prisma/
│   ├── schema.prisma           # Prisma models & relations
│   └── migrations/             # Versioned SQL migrations
└── test/                       # E2E test suites
```

---

## 2. Request Lifecycle
1. Incoming HTTP request hits Nginx reverse proxy.
2. NestJS Global ValidationPipe transforms and validates payload against DTOs.
3. Guards execute (Authentication verification via JWT; Authorization via Roles).
4. Controller calls Domain Service.
5. Domain Service executes business logic and transactional operations using `PrismaService`.
6. Standardized JSON response returned to caller.
