---
name: project-planning
description: Workflow for analyzing client requirements in README.md, preparing technical documentation in docs/, and initializing tasks in planning/task.md under the Avengers Protocol.
---

# Project Planning Workflow (Iron Man)

## Purpose
Guide the Chief Orchestrator (`iron_man`) to translate client requirements into structured technical blueprints and prioritized task boards without inventing details or burning excessive tokens.

## Prerequisites
- Read root `README.md` (single source of truth for requirements).
- Read `project.config.md` (stack settings).
- Read `AGENTS.md` (global rules).

## Execution Steps

### 1. Requirements Discovery
- Extract functional requirements (`REQ-F-001`, `REQ-F-002`, ...), non-functional requirements, constraints, and external integrations from `README.md`.
- Identify ambiguities or missing specifications.
- **Rule**: If a requirement is missing or unclear, record it in `planning/open-questions.md`. Never guess client intent.

### 2. Technical Blueprint Generation (`docs/`)
Create or incrementally update the core technical specifications:
- `docs/01-requirements-analysis.md`: Detailed functional/non-functional breakdown.
- `docs/02-system-architecture.md`: High-level component and data flow.
- `docs/07-database-design.md`: Tables, models, relations, and indexes.
- `docs/08-api-contract.md`: Endpoints, request/response DTOs, and error codes.
- `docs/10-security-plan.md`: Authentication, authorization, and rate limiting.
- `docs/13-acceptance-criteria.md`: Verifiable completion criteria for each feature.

*Token Optimization Tip: Use compact markdown tables and concise TypeScript/DTO interfaces instead of long conversational text.*

### 3. Task Board Initialization & Granular Decomposition (`planning/tasks/`)
Decompose the work into sequential and parallel tasks:
- **Master Board (`planning/task.md`)**: Maintain the high-level Kanban overview linking each task ID to its file in `tasks/TASK-XXX.md`.
- **Dynamic Granular Task Creation (`planning/tasks/TASK-XXX.md`)**: Generate or update an individual specification markdown file for each task (e.g. `planning/tasks/TASK-001.md`, `TASK-002.md`). Each file must include:
  1. Status, Assignee, Priority, Dependencies, and Master Board Link.
  2. Objective and User Story.
  3. Direct inputs and contract references (`docs/08-api-contract.md`, `DESIGN_GUIDELINES.md`).
  4. Granular step-by-step execution plan.
  5. Acceptance criteria checklist.
  6. Verification evidence block for Thanos.
  7. Fresh session handoff command.
- Assign each task to the appropriate hero agent:
  - `[jarvis]`: Design tokens, UI states, component primitives.
  - `[edith]`: DB schema, migrations, backend services, REST APIs.
  - `[friday]`: Next.js web components, forms, client integration.
  - `[thor]`: Flutter mobile views (if mobile enabled).
  - `[thanos]`: Verification, tests, acceptance validation.
  - `[ultron]`: Docker, Nginx, CI/CD, cyber security.

*Token Optimization Tip: Granular task files isolate context so specialist agents only load their active task (~60 lines) instead of reading a massive monolithic document, cutting token consumption by 85–90%.*

### 4. Human Approval Gate
Present the planning summary to the human developer. Do not start coding until the plan is approved.

