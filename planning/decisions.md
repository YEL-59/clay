# Architecture & Technical Decisions Log

> This document records confirmed technical choices, architectural patterns, and design trade-offs. Once recorded and approved, agents must adhere to these decisions and not alter them without human approval.

---

## Decision Records

### ADR-001: Adoption of Hierarchical Multi-Agent System (Avengers Protocol)
- **Date**: 2026-11-02
- **Status**: APPROVED
- **Context**: Monolithic single-agent workflows lead to high token burn, context contamination, and lack of specialized domain discipline.
- **Decision**: Adopt a Chief Orchestrator (`iron_man`) with 6 specialized agents (`jarvis`, `friday`, `edith`, `thor`, `thanos`, `ultron`).
- **Consequences**:
  - Positive: Clean context isolation, reduced token waste, independent testing verification.
  - Trade-off: Requires task decomposition and contract-driven communication through `docs/` and `planning/task.md`.

### ADR-002: Default Technology Stack Selection
- **Date**: 2026-11-02
- **Status**: APPROVED
- **Context**: The template requires modern, scalable, and type-safe default technologies.
- **Decision**:
  - Frontend: Next.js (App Router), TypeScript, Tailwind CSS, Zustand, TanStack Query.
  - Backend: NestJS, TypeScript, PostgreSQL, Prisma ORM, Redis.
  - Mobile (Optional): Flutter (Dart) with Riverpod/Bloc.
  - Infrastructure: Docker multi-stage builds and Nginx reverse proxy.
- **Consequences**:
  - High developer velocity, end-to-end type safety, production-ready containerization.

### ADR-003: MERN Full-Stack Architecture for Raye Striped-Shirt Suite
- **Date**: 2026-11-05
- **Status**: APPROVED
- **Context**: Per explicit client instructions and confirmed requirements in `README.md`, the project requires the complete integration of the provided e-commerce dashboard source code (`clay.zip`), an interactive customer-facing User Storefront (browse shirts, size finder, shopping bag, checkout with bKash/Nagad/COD/Card, order tracking), and a Node.js + Express + Mongoose (MERN) backend.
- **Decision**:
  - Integrate dashboard source code into `development/frontend/` using React 19 + Vite + TypeScript + Tailwind CSS v4 + GSAP.
  - Build the customer-facing User Storefront inside `development/frontend/` with quick toggle between Storefront (`#/shop` or `#/`) and Admin Dashboard (`#/overview`).
  - Implement the Node.js + Express REST API backend in `development/backend/` using Mongoose 8 for MongoDB with a deterministic fallback in-memory seeded engine (`seed = 220`) for zero-dependency execution.
- **Consequences**:
  - Flawless synergy between the provided reference clone and new storefront.
  - Zero-friction developer setup (works with or without MongoDB running locally).
  - Clean separation of concerns between Friday (Storefront & Dashboard) and Edith (Backend & Mongoose).
