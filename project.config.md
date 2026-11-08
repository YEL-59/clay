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

- **Project Name**: Shifatdevs Admin & Commerce Suite (Raye Striped-Shirt)
- **Project Type**: Full-Stack MERN (Storefront + Admin Dashboard + Express API)
- **Project Status**: `existing` <!-- Options: new / existing / migration -->
- **Client Requirements Source**: [README.md](README.md)
- **Problem & Product Summary**: A direct-to-consumer apparel commerce suite with real-time sales telemetry, drag-and-drop Kanban fulfillment, size-matrix inventory, customer CRM, anthropometric Size Finder, and live promotional drop engine.
- **Target Audience / End Users**: Store founders & fulfillment operators (Admin), retail shoppers in Bangladesh (Storefront).
- **Target Delivery / Milestones**: Full MERN suite with live Storefront and Admin Dashboard.

---

## 2. Avengers Multi-Agent Roster & System Mapping

| Agent Name | Hero Identity | Primary Domain | Configuration File | Target Directory |
|---|---|---|---|---|
| **`iron_man`** | **Chief Orchestrator** | Planning, Delegation, Work Breakdown & Verification | `.codex/agents/iron_man.toml` | Root, `planning/`, `docs/` |
| **`jarvis`** | **UI/UX & Design** | Design Tokens, Typography, Figma Parsing, 6 UI States | `.codex/agents/jarvis.toml` | `development/frontend/src/`, UI Primitives |
| **`friday`** | **Frontend Web** | React 19, Vite, Storefront, Admin Dashboard, Client State | `.codex/agents/friday.toml` | `development/frontend/` |
| **`edith`** | **Backend & Data** | Express.js, Node.js, Mongoose/MongoDB, In-Memory Store, REST APIs | `.codex/agents/edith.toml` | `development/backend/` |
| **`thor`** | **Mobile (Optional)** | Flutter, Dart, Riverpod/Bloc (Inactive for web-only) | `.codex/agents/thor.toml` | `development/mobile/` |
| **`thanos`** | **QA & Verification** | Unit, Integration, E2E, Acceptance, Bug Snapping | `.codex/agents/thanos.toml` | Test suites across repository |
| **`ultron`** | **DevOps & Security** | Docker, Nginx, CI/CD, Cyber Security Hardening | `.codex/agents/ultron.toml` | `infrastructure/`, `.github/` |

---

## 3. Technology Stack Specification

### 3.1 Frontend Configuration (`development/frontend/`)
> *Friday and Jarvis strictly adhere to these frontend choices.*
- **Directory**: `development/frontend/`
- **Framework**: `React 19 (Vite 8)` <!-- Options: Next.js (App Router) / React (Vite) / Vue / Nuxt / SvelteKit -->
- **Language**: `TypeScript` (Strict Mode)
- **Styling**: `Tailwind CSS v4` + Glassmorphic Design Tokens (`index.css`)
- **Animation & Motion**: `GSAP` + Native View Transitions API
- **Client UI State**: Custom Reactive Store (`adminStore.ts` + Storefront Cart Store)
- **Media & Asset Management**: `JSZip` + Browser `CacheStorage` API
- **Testing**: `Vitest` / Testing Scripts

### 3.2 Backend Configuration (`development/backend/`)
> *Edith strictly adheres to these backend choices.*
- **Directory**: `development/backend/`
- **Framework**: `Express.js (Node.js v22 LTS)` <!-- Options: NestJS / Express / Fastify / Django / FastAPI / Go -->
- **Language**: `TypeScript` (Strict Mode with `tsx` / `ts-node`)
- **ORM / Database Client**: `Mongoose 8` + Fallback In-Memory Seeded Store (`seed = 220`)
- **Primary Database**: `MongoDB (v7.0+ / Atlas)` with seamless zero-config fallback
- **API Architecture**: `RESTful Modular Controllers (/api/v1/*)`
- **Validation**: `Zod` request/response schemas
- **Testing**: `Jest` + Supertest

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
