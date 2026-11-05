# 02 — System Architecture

> Maintained by `iron_man` and `edith`.

---

## 1. High-Level Architecture
The system follows a modular client-server architecture with strict API contracts and optional mobile support:

```mermaid
graph TD
    ClientWeb["Next.js Web Client (Friday)"] -->|REST / HTTPS| Gateway["Reverse Proxy Nginx (Ultron)"]
    ClientMobile["Flutter Mobile App (Thor)"] -->|REST / HTTPS| Gateway
    Gateway -->|Forward /api| NestBackend["NestJS Backend (Edith)"]
    Gateway -->|Forward /| NextServer["Next.js Server (Friday)"]
    NestBackend -->|Prisma Client| Postgres[(PostgreSQL DB)]
    NestBackend -->|ioredis| Redis[(Redis Cache / Queue)]
```

---

## 2. Component Boundaries
- **Frontend Layer**: Next.js App Router (React Server & Client Components).
- **Mobile Layer (Optional)**: Flutter (Dart) with clean architecture.
- **Backend Layer**: NestJS Modular Monolith with Domain-Driven Design (Controllers, Services, Repositories).
- **Data Layer**: PostgreSQL 15+ managed via Prisma ORM.
- **Caching & Queue**: Redis for session caching, rate limiting, and background jobs.
