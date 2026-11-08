# Avengers Task Board

> **Statuses**: `BACKLOG` | `READY` | `IN_PROGRESS` | `BLOCKED` | `IN_REVIEW` | `FAILED` | `DONE` | `CANCELLED`  
> **Priorities**: `P0` (Critical) | `P1` (High) | `P2` (Normal) | `P3` (Low)  
> **Rule**: A task is `READY` only when all dependencies are `DONE`. A task is `DONE` only when acceptance criteria are met and Thanos has verified the actual test execution.

---

## Active Task Board

| Task ID | Task Title | Assignee | Dependencies | Status | Priority | Verification |
|---|---|---|---|---|---|---|
| [`TASK-001`](tasks/TASK-001.md) | Analyze client requirements & MERN discovery | `iron_man` | None | `DONE` | `P0` | Passed |
| [`TASK-002`](tasks/TASK-002.md) | Relocate Admin Dashboard to `development/dashboard/` (Port 3006) | `jarvis`, `friday` | `TASK-001` | `DONE` | `P0` | Passed |
| [`TASK-003`](tasks/TASK-003.md) | Build E-Mart Clone Storefront & User Portal in `development/frontend/` (Port 3005) | `friday` | `TASK-002` | `DONE` | `P0` | Passed |
| [`TASK-004`](tasks/TASK-004.md) | Expand Dashboard: Manufacturer Portal, Store HR (Managers, Salesmen, CV Checker) | `jarvis`, `friday` | `TASK-003` | `DONE` | `P0` | Passed |
| [`TASK-005`](tasks/TASK-005.md) | Implement Node.js MERN Backend API & Schemas in `development/backend/` | `edith` | `TASK-004` | `DONE` | `P0` | Passed |
| [`TASK-006`](tasks/TASK-006.md) | Connect Frontend & Dashboard to Backend REST API | `friday`, `edith` | `TASK-005` | `READY` | `P0` | Pending |
| [`TASK-007`](tasks/TASK-007.md) | Full Thanos Verification & End-to-End Test Suite | `thanos` | `TASK-006` | `BACKLOG` | `P0` | Pending |
| [`TASK-008`](tasks/TASK-008.md) | Unified Dev Script, Docker Setup & Security Audit | `ultron` | `TASK-007` | `BACKLOG` | `P1` | Pending |

---

## Granular Task Architecture (`planning/tasks/`)

To preserve **Context Isolation** and eliminate token waste, tasks are separated into individual markdown files inside `planning/tasks/`:

- **Token Efficiency Benefit**: Specialist agents load **only** their active task file, reducing context consumption by **85–90%**.
- **Master Board Index**: This document (`planning/task.md`) serves as the high-level dashboard and clickable index.
