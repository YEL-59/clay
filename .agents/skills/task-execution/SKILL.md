---
name: task-execution
description: Standard workflow for executing a single assigned task under the Avengers Protocol, including context isolation, focused editing, and progress tracking.
---

# Task Execution Workflow

## Purpose
Standard operating procedure for any agent (Jarvis, Friday, Edith, Thor, Thanos, Ultron) when implementing an assigned task from `planning/task.md`.

## Execution Steps

### 1. Task Intake & Ownership
- Identify the requested `TASK-ID` in `planning/task.md` and load its dedicated file: `planning/tasks/${TASK-ID}.md`.
- Verify you are the assigned agent (`Assignee`).
- Check that all prerequisite `Dependencies` are marked `DONE`.
- Confirm that the task status is `READY`. Change status to `IN_PROGRESS` in both `planning/task.md` and `planning/tasks/${TASK-ID}.md`.

### 2. Context Loading (Isolated & Focused — 90% Token Reduction)
- Load **only** the direct files required for this task:
  - The granular task file: `planning/tasks/${TASK-ID}.md`.
  - The relevant technical contract referenced in the task file (e.g., `docs/08-api-contract.md` or `development/frontend/DESIGN_GUIDELINES.md`).
  - The specific source code files to modify or test.
- **Rule**: Do not read unrelated directories or full repository listings.

### 3. Implementation
- Make focused, surgical changes.
- Reuse existing components, hooks, domain services, and utilities.
- Never rewrite entire files when replacing a targeted function or block.
- Follow the domain rules:
  - Frontend: 6 UI States, accessible markup, WCAG 2.2 AA.
  - Backend: DTO validation, service business logic, transaction safety.

### 4. Verification Check
- Run focused checks (type-check, linter, unit test for modified file).
- If checks fail, fix the issue immediately before reporting completion.

### 5. Checkpoint & Reporting
- Update `planning/tasks/${TASK-ID}.md` with actual test verification logs and mark status (`IN_REVIEW` or `DONE`).
- Synchronize status in the master board: `planning/task.md`.
- Update `planning/updateplanning.md` with:
  - Task ID and Assignee.
  - Files modified.
  - Verification commands run and results.
  - Next ready task.
  - **Fresh Session Handoff Command**: Always output the exact command (`planning/updateplanning.md পড়ে [NEXT-TASK-ID] শুরু করো`) and advise the developer to open a new chat window to eliminate token compounding and maintain 95% token efficiency.

