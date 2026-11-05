# ⚙️ Project Configuration: Avengerse

> **Version**: 1.0  
> **Codename**: Avengers Protocol  
> **Primary AI Environment**: OpenAI Codex & Compatible Multi-Agent Assistants  
> **Architecture**: Hierarchical Multi-Agent Full-Stack System  
> **Chief Orchestrator**: `iron_man`  

---

> [!NOTE]
> **Developer Directive**:  
> This file is the **Single Source of Truth** for technical stack configuration.  
> `iron_man`, `jarvis`, `friday`, `edith`, `thor`, `thanos`, and `ultron` strictly read this file to determine what libraries, frameworks, databases, and architectural patterns to implement. You can use the default stack below or customize it before running the discovery phase.

---

## 1. Project Information & Metadata

- **Project Name**: [PROJECT_NAME - e.g., NovaDesk / ApexCRM / MedPulse]
- **Project Type**: Full-Stack Web + Backend + Optional Mobile
- **Project Status**: `new` <!-- Options: new / existing / migration -->
- **Client Requirements Source**: [README.md](README.md)
- **Problem & Product Summary**: [Concise one-line summary of what this application does]
- **Target Audience / End Users**: [Target audience e.g., Operations teams, general public]
- **Target Delivery / Milestones**: [e.g., MVP in 4 weeks, Production release in 8 weeks]

---

## 2. Avengers Multi-Agent Roster & System Mapping

| Agent Name | Hero Identity | Primary Domain | Configuration File | Target Directory |
|---|---|---|---|---|
| **`iron_man`** | **Chief Orchestrator** | Planning, Delegation, Work Breakdown & Verification | `.codex/agents/iron_man.toml` | Root, `planning/`, `docs/` |
| **`jarvis`** | **UI/UX & Design** | Design Tokens, Typography, Figma Parsing, 6 UI States | `.codex/agents/jarvis.toml` | `development/frontend/src/styles/`, UI Primitives |
| **`friday`** | **Frontend Web** | Next.js, React, TypeScript, Forms, Client State | `.codex/agents/friday.toml` | `development/frontend/` |
| **`edith`** | **Backend & Data** | NestJS, Prisma, PostgreSQL, Redis, REST APIs | `.codex/agents/edith.toml` | `development/backend/` |
| **`thor`** | **Mobile (Optional)** | Flutter, Dart, Riverpod/Bloc, Cross-Platform App | `.codex/agents/thor.toml` | `development/mobile/` |
| **`thanos`** | **QA & Verification** | Unit, Integration, E2E, Acceptance, Bug Snapping | `.codex/agents/thanos.toml` | Test suites across repository |
| **`ultron`** | **DevOps & Security** | Docker, Nginx, CI/CD, Cyber Security Hardening | `.codex/agents/ultron.toml` | `infrastructure/`, `.github/` |

---

## 3. Technology Stack Specification

### 3.1 Frontend Configuration (`development/frontend/`)
> *Friday and Jarvis strictly adhere to these frontend choices.*
- **Directory**: `development/frontend/`
- **Framework**: `Next.js (App Router)` <!-- Options: Next.js (App Router) / React (Vite) / Vue / Nuxt / SvelteKit -->
- **Language**: `TypeScript` (Strict Mode)
- **Styling**: `Tailwind CSS` + Semantic CSS Variables (`globals.css`)
- **UI Primitives**: `Radix UI` / `Shadcn UI primitives`
- **Client UI State**: `Zustand`
- **Server State / Data Fetching**: `TanStack Query (React Query)`
- **Form & Validation**: `React Hook Form` + `Zod`
- **Testing**: `Vitest` + `React Testing Library` + `Playwright` (E2E)

### 3.2 Backend Configuration (`development/backend/`)
> *Edith strictly adheres to these backend choices.*
- **Directory**: `development/backend/`
- **Framework**: `NestJS (Modular Domain Architecture)` <!-- Options: NestJS / Express / Fastify / Django / FastAPI / Go -->
- **Language**: `TypeScript` (Strict Mode)
- **ORM / Database Client**: `Prisma ORM` <!-- Options: Prisma / Drizzle / TypeORM -->
- **Primary Database**: `PostgreSQL (v15+)` <!-- Options: PostgreSQL / MySQL / MongoDB / SQLite -->
- **Cache & Queue**: `Redis` (Session caching, rate limiting, background jobs)
- **Object Storage**: `Local Storage` / `Cloudflare R2` / `AWS S3 compatible`
- **API Documentation**: `REST (OpenAPI / Swagger via @nestjs/swagger)`
- **Validation**: `class-validator` + `class-transformer`
- **Testing**: `Jest` + `Supertest`

### 3.3 Mobile Configuration (`development/mobile/` — Optional)
> *Thor is activated only when mobile is set to true.*
- **Enabled**: `false` <!-- Set to true if client README.md requires mobile application -->
- **Directory**: `development/mobile/`
- **Framework**: `Flutter (Dart >= 3.0)`
- **State Management**: `Flutter Riverpod` / `BLoC`
- **API Client**: `Dio` (Connected to `docs/08-api-contract.md`)
- **Secure Storage**: `flutter_secure_storage`
- **Testing**: `Flutter Test (Widget & Unit)`

### 3.4 Infrastructure & DevOps (`infrastructure/`)
> *Ultron strictly adheres to these infrastructure choices.*
- **Docker**: `infrastructure/docker/` (Multi-stage Dockerfiles for minimal production images)
- **Reverse Proxy**: `infrastructure/nginx/` (Nginx reverse proxy, SSL termination, gzip)
- **CI/CD Pipeline**: `.github/workflows/ci.yml` (Automated validation, lint, test, build)
- **Package Manager**: `pnpm` (default) or `npm`
- **Runtime Environment**: `Node.js >= 20.x LTS`
- **Production Hosting Target**: `Linux VPS / Docker Swarm / Cloud VPS` (TBD)

---

## 4. Shared Project Contracts & Directory Mapping

| Artifact Type | File / Path | Primary Agent Responsibility |
|---|---|---|
| **Client Intent / Brief** | [README.md](README.md) | Single Source of Truth filled by Developer/Client |
| **System Blueprints** | [docs/](docs/) (`01` to `14`) | Maintained by `iron_man`, `edith`, `jarvis`, `ultron` |
| **API Contract** | [docs/08-api-contract.md](docs/08-api-contract.md) | Shared bridge between `edith`, `friday`, and `thor` |
| **Task Management** | [planning/task.md](planning/task.md) | Work breakdown with `Assignee` tags |
| **Session Continuity** | [planning/updateplanning.md](planning/updateplanning.md) | Checkpoints, test evidence, and active task state |
| **Architecture Decisions** | [planning/decisions.md](planning/decisions.md) | Approved ADRs and design decisions |
| **Open Questions** | [planning/open-questions.md](planning/open-questions.md) | Unresolved client queries (Zero-Assumption Policy) |
| **Application Code** | [development/](development/) | Domain code for `frontend/`, `backend/`, and `mobile/` |

---

## 5. Working Agreements & Human Approval Gates

1. **Human Approval Gates (Strict Authorization Required)**:
   - ⚠️ Destructive database migrations (dropping tables, altering production data).
   - ⚠️ Live production deployments or publishing releases.
   - ⚠️ Altering production secrets, API keys, or environment files (`.env`).
   - ⚠️ Major architectural deviations from `docs/` or `project.config.md`.
2. **Zero-Assumption Policy**: Unconfirmed requirements must be recorded in `planning/open-questions.md` rather than guessed by agents.
3. **Context Isolation**: Every agent loads only the specific files required for its current task to ensure **minimum token usage and maximum output quality**.
4. **Evidence-Based Verification**: No task is marked `DONE` without verification by `thanos` with actual test execution evidence.
