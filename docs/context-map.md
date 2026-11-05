# Avengers Task-to-Context Map

> **Context Routing Guide**: Use this map to pick the smallest sufficient context. Each agent loads only its specific assigned documents and direct dependencies.

| Agent | Task Domain | Read First | Inspect When Needed |
|---|---|---|---|
| **`iron_man`** | Project Discovery & Planning | `README.md`, `project.config.md`, `AGENTS.md` | `docs/01-requirements-analysis.md`, `planning/open-questions.md` |
| **`jarvis`** | UI/UX & Design System | `docs/04-design-system.md`, `docs/03-figma-analysis.md` | `development/frontend/DESIGN_GUIDELINES.md`, CSS tokens |
| **`friday`** | Frontend Web Component / Page | Task entry, `docs/04-design-system.md`, `docs/08-api-contract.md` | `docs/05-frontend-architecture.md`, target React files |
| **`edith`** | Database Schema / Migration | Task entry, `docs/07-database-design.md` | `prisma/schema.prisma`, target domain services |
| **`edith`** | Backend API & Services | Task entry, `docs/08-api-contract.md`, `docs/06-backend-architecture.md` | `docs/10-security-plan.md`, target NestJS controller/service |
| **`thor`** | Flutter Mobile Application | Task entry, `docs/09-mobile-architecture.md`, `docs/08-api-contract.md` | `development/mobile/lib/`, target Dart widgets/providers |
| **`thanos`** | QA, Testing & Verification | Task entry, `docs/11-testing-strategy.md`, `docs/13-acceptance-criteria.md` | Target test files, package scripts, failure output |
| **`ultron`** | Docker, Nginx & DevOps | Task entry, `docs/12-deployment-plan.md`, `docs/10-security-plan.md` | `infrastructure/`, `.github/workflows/`, `.env.example` |

---

## Strict Context Expansion Rule
If a direct dependency is not listed above, inspect only the targeted file. Never load the entire repository or unrelated agent domains.
