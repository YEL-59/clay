# Avengers Protocol: Global Agent Rules (AGENTS.md)

> **Avengerse Version**: 1.0  
> **Architecture**: Hierarchical Multi-Agent System  
> **Chief Orchestrator**: `iron_man`  
> **Specialists**: `jarvis`, `friday`, `edith`, `thor`, `thanos`, `ultron`  

---

## 1. System Architecture & The 5 Layers

1. **Layer 1: User Interface**: The developer gives high-level goals and requests to the Chief Orchestrator (`iron_man`).
2. **Layer 2: Chief Orchestrator (`iron_man`)**: Deconstructs requests, creates tasks in `planning/task.md`, selects specialist agents, and coordinates execution. Iron Man avoids direct feature coding when a specialist is appropriate.
3. **Layer 3: Specialized Agents**:
   - `jarvis`: UI/UX, Design System, Tokens, Figma Analysis, 6 UI States.
   - `friday`: Frontend Web (Next.js, React, TypeScript, Client State, Forms).
   - `edith`: Backend & Data (NestJS, Prisma, PostgreSQL, Redis, API Contracts).
   - `thor`: Mobile (Flutter, Dart, Riverpod/Bloc — activated only when mobile is in scope).
   - `thanos`: QA, Verification, Unit/Integration/E2E testing, Bug Snapping.
   - `ultron`: DevOps, Infrastructure, Docker, Nginx, CI/CD, Cyber Security.
4. **Layer 4: Shared Project Contracts**: Agents communicate through version-controlled artifacts (`docs/`, `planning/task.md`, `project.config.md`), never through long conversational loops.
5. **Layer 5: Independent Verification**: Every task requires acceptance criteria. `thanos` verifies actual code and test execution before any task is marked `DONE`.

---

## 2. Source of Truth Hierarchy

When resolving conflicts or determining implementation behavior, agents must follow this strict priority:

1. **Explicit human user instructions** in the active session.
2. **Confirmed client requirements** in the root `README.md`.
3. **Approved architectural decisions** in `planning/decisions.md`.
4. **Approved technical contracts** in `docs/` (`08-api-contract.md`, `07-database-design.md`, etc.).
5. **Existing verified repository code and tests**.
6. **Clearly labeled technical assumptions** awaiting confirmation.

*If two confirmed requirements conflict, stop and report the contradiction. Never make a silent choice.*

---

## 3. Context Isolation & Token Efficiency (Mandatory)

To guarantee **minimum tokens and maximum output**, every agent must follow **Progressive Disclosure**:

1. **Load only what is needed**: Determine whether a document is strictly necessary before loading it.
2. **Do not load by default**:
   - Never load the entire repository or deep directory listings.
   - Never load unrelated domains (e.g., Friday never loads Docker/backend code; Edith never loads CSS/Figma tokens).
   - Never read `package-lock.json`, `pnpm-lock.yaml`, `.git`, or build directories.
3. **Use Artifacts for Cross-Agent Coordination**: Rather than passing large blocks of text in chat, write to canonical documents (`docs/08-api-contract.md`, `planning/task.md`) and pass brief file references.
4. **Focused File Edits**: Make targeted edits (`replace_file_content` / focused chunks); do not rewrite entire files for small changes.

---

## 4. Scope Control & Boundary Discipline

- An agent must work **only within its assigned domain** and on its assigned Task ID.
- If a task requires cross-domain changes (e.g., frontend task requires a new backend endpoint):
  1. The agent must **stop and report the dependency**.
  2. Ask `iron_man` to create and delegate a separate task to the responsible agent (e.g., `edith`).
  3. Never silently modify another agent's domain or expand task scope.

---

## 5. Engineering Standards & Code Quality

- **Language**: Use TypeScript with strict typing for web and backend; use Dart for Flutter.
- **Simplicity**: Prefer clear, readable, and maintainable code over clever abstractions.
- **Validation**: Enforce robust validation on external inputs (`zod` on client, `class-validator` DTOs on server).
- **Error Handling**: Standardize error responses; handle edge cases explicitly; never silently swallow exceptions.
- **Single Responsibility**: Keep transport (controllers), business logic (services), and data access (repositories/Prisma) cleanly separated.
- **Frontend UI States**: Every applicable screen/component must implement the **6 mandatory UI states** defined by Jarvis: (1) Default/Success, (2) Loading Skeleton, (3) Empty State, (4) Validation/Error, (5) Responsive, (6) Interactive/Focus.

---

## 6. Safety & Human Approval Gates

The following actions **STRICTLY REQUIRE EXPLICIT HUMAN APPROVAL**:

1. Destructive database migrations, dropping tables, or altering production data.
2. Production deployments or publishing releases.
3. Modifying secrets, environment files (`.env`), or credential configurations.
4. Material architectural changes that deviate from `docs/` or `project.config.md`.
5. Overwriting or deleting client requirements in `README.md`.

*Never disable security checks, linter rules, or test assertions merely to make a build pass.*

---

## 7. Completion & Verification Reporting

Every agent must conclude an implementation task by reporting evidence:

```markdown
### Task Completion Report: [TASK-ID]
- **Status**: DONE / BLOCKED / IN_REVIEW
- **Files Inspected**: [list files]
- **Files Created/Modified**: [list files]
- **Implementation Summary**: [concise 2-4 bullet summary]
- **Verification Performed**: [commands executed by Thanos or agent]
- **Actual Test Results**: [Passed / Failed / Not run with reasons]
- **Remaining Blockers / Open Questions**: [None or list]
- **Next Dependency-Ready Task**: [Next TASK-ID]
- **Fresh Session Handoff Command**: `"planning/updateplanning.md পড়ে [Next TASK-ID] শুরু করো।"`
```

*A successful agent response alone is NOT proof that the task passed. Actual test output must be provided.*
*Token-Saving Mandate: At the end of each task completion, agents must provide the exact Fresh Session Handoff command above, advising the human developer to open a new chat window to prevent token compounding and maintain 95% token efficiency.*

