# Avengers Task Board

> **Statuses**: `BACKLOG` | `READY` | `IN_PROGRESS` | `BLOCKED` | `IN_REVIEW` | `FAILED` | `DONE` | `CANCELLED`  
> **Priorities**: `P0` (Critical) | `P1` (High) | `P2` (Normal) | `P3` (Low)  
> **Rule**: A task is `READY` only when all dependencies are `DONE`. A task is `DONE` only when acceptance criteria are met and Thanos has verified the actual test execution.

---

## Active Task Board

| Task ID | Task Title | Assignee | Dependencies | Status | Priority | Verification |
|---|---|---|---|---|---|---|
| [`TASK-001`](tasks/TASK-001.md) | Analyze client requirements & brief | `iron_man` | None | `READY` | `P0` | Pending |
| [`TASK-002`](tasks/TASK-002.md) | Define design tokens & UI states | `jarvis` | `TASK-001` | `BACKLOG` | `P1` | Pending |
| [`TASK-003`](tasks/TASK-003.md) | Design database schema & Prisma models | `edith` | `TASK-001` | `BACKLOG` | `P0` | Pending |
| [`TASK-004`](tasks/TASK-004.md) | Define API contracts & DTO schemas | `edith` | `TASK-003` | `BACKLOG` | `P0` | Pending |
| [`TASK-005`](tasks/TASK-005.md) | Build frontend foundation & design system | `friday` | `TASK-002` | `BACKLOG` | `P1` | Pending |
| [`TASK-006`](tasks/TASK-006.md) | Implement backend core authentication API | `edith` | `TASK-004` | `BACKLOG` | `P0` | Pending |
| [`TASK-007`](tasks/TASK-007.md) | Implement frontend login & registration UI | `friday` | `TASK-002` | `BACKLOG` | `P1` | Pending |
| [`TASK-008`](tasks/TASK-008.md) | Integrate frontend authentication with API | `friday` | `TASK-006`, `TASK-007` | `BACKLOG` | `P0` | Pending |
| [`TASK-009`](tasks/TASK-009.md) | Optional: Build mobile auth flow | `thor` | `TASK-006` | `BACKLOG` | `P2` | Pending |
| [`TASK-010`](tasks/TASK-010.md) | Full authentication flow verification | `thanos` | `TASK-008` | `BACKLOG` | `P0` | Pending |
| [`TASK-011`](tasks/TASK-011.md) | Docker containerization & security review | `ultron` | `TASK-006` | `BACKLOG` | `P1` | Pending |

---

## Granular Task Architecture (`planning/tasks/`)

To preserve **Context Isolation** and eliminate token waste, tasks are separated into individual markdown files inside `planning/tasks/`:

- **Token Efficiency Benefit**: Instead of an agent reading a monolithic 5,000+ line task document, the specialist loads **only** its assigned task file (e.g., `planning/tasks/TASK-005.md` ~ 60 lines), reducing context consumption by **85–90%**.
- **Dynamic Task Creation**: When `iron_man` analyzes new requirements, Iron Man dynamically creates or refines task files in `planning/tasks/` using the specification template below.
- **Master Board Index**: This document (`planning/task.md`) serves as the high-level dashboard and clickable index.

---

## Detailed Task Specification Template (for `planning/tasks/TASK-XXX.md`)

```markdown
# TASK-ID — [Task Title]

> **Status**: [BACKLOG / READY / IN_PROGRESS / BLOCKED / IN_REVIEW / FAILED / DONE]  
> **Assignee**: [iron_man / jarvis / friday / edith / thor / thanos / ultron]  
> **Priority**: [P0 / P1 / P2 / P3]  
> **Dependencies**: [List of Task IDs]  
> **Master Board**: [planning/task.md](../task.md)

---

## 1. Objective & User Story
[Clear user story: As a <role>, I want <goal>, so that <benefit>]

---

## 2. Inputs & Context Documents
- Contract: [docs/08-api-contract.md](../../docs/08-api-contract.md)
- Design Guidelines: [development/frontend/DESIGN_GUIDELINES.md](../../development/frontend/DESIGN_GUIDELINES.md)

---

## 3. Step-by-Step Execution Plan
1. [Step 1]
2. [Step 2]
3. [Step 3]

---

## 4. Expected Outputs
- [List of files created/modified]

---

## 5. Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

---

## 6. Verification Evidence (Thanos)
- **Command**: [Command executed]
- **Status**: [Pending / Passed / Failed]
- **Output Log**: [Actual test run results]

---

## 7. Fresh Session Handoff
```markdown
planning/updateplanning.md পড়ে [NEXT-TASK-ID] শুরু করো।
```
```
