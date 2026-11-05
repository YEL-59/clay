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
