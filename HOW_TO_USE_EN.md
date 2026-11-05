# 🛡️ Avengerse: Developer Onboarding & Usage Guide

> **Version**: 1.0  
> **Codename**: Avengers Protocol  
> **Architecture**: Hierarchical Multi-Agent Full-Stack System  
> **Supported Agents**: `iron_man`, `jarvis`, `friday`, `edith`, `thor`, `thanos`, `ultron`  
> **Bengali Guide**: [HOW_TO_USE_BN.md](HOW_TO_USE_BN.md) | **A to Z Folder Guide**: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

---

## 1. 🌟 Introduction

**Avengerse** is a production-grade AI Multi-Agent Full-Stack Project Template. Instead of having a single AI agent try to do everything (which causes context confusion and burns thousands of unnecessary tokens), Avengerse establishes a **Chief Orchestrator (Iron Man)** and **6 Specialized Sub-Agents**:

```text
               👤 Developer / Commander
                          │
                          ▼
            🤖 Iron Man (Chief Orchestrator)
                          │
  ┌──────────┬────────────┼────────────┬──────────┬──────────┐
  ▼          ▼            ▼            ▼          ▼          ▼
🎨 Jarvis  💻 Friday    ⚙️ Edith     ⚡ Thor    🧤 Thanos  🛡️ Ultron
 (UI/UX)   (Frontend)   (Backend)   (Flutter)     (QA)     (DevOps)
```

---

## 2. 🗂️ Clean Project Directory Structure

```text
ai-fullstack-project-template/
│
├── README.md                          # Client Requirements Form (Single Source of Truth)
├── AGENTS.md                          # Master Multi-Agent Rules & 5-Layer Protocol
├── project.config.md                  # Centralized Tech Stack & Agent Configurations
├── HOW_TO_USE_EN.md                   # Developer Onboarding & Workflow Guide (English Manual)
├── HOW_TO_USE_BN.md                   # Bengali Detailed Workflow Guide (বাংলা গাইড)
├── PROJECT_STRUCTURE.md               # A to Z Folder & Architecture Guide
├── CONTRIBUTING.md                    # Contribution Guidelines
│
├── .codex/                            # OpenAI Codex Custom Agent Definitions
│   ├── config.toml                    # Codex configuration
│   └── agents/                        # 7 Agent instruction TOML files
│       ├── iron_man.toml              # Orchestrator
│       ├── jarvis.toml                # UI/UX & Design Tokens
│       ├── friday.toml                # Next.js Web Frontend
│       ├── edith.toml                 # NestJS Backend & Prisma DB
│       ├── thor.toml                  # Flutter Mobile (Optional)
│       ├── thanos.toml                # QA & Verification
│       └── ultron.toml                # Docker, Nginx & Cyber Security
│
├── .agents/skills/                    # Reusable Executable Agent Skills
│   ├── project-planning/SKILL.md
│   ├── task-execution/SKILL.md
│   ├── frontend-development/SKILL.md
│   ├── backend-development/SKILL.md
│   ├── design-system/SKILL.md
│   ├── api-contract-validation/SKILL.md
│   ├── testing/SKILL.md
│   └── deployment-security/SKILL.md
│
├── planning/                          # Project Governance & Session Continuity
│   ├── task.md                        # Task Board with Assignee & Status tracking
│   ├── updateplanning.md              # Active session checkpoint & test evidence
│   ├── decisions.md                   # Architecture Decision Records (ADR)
│   ├── open-questions.md              # Client ambiguities (Zero-Assumption Policy)
│   └── checkpoints/                   # Saved project milestones
│
├── docs/                              # Technical Blueprints (01 to 14)
│   ├── 01-requirements-analysis.md
│   ├── 02-system-architecture.md
│   ├── 03-figma-analysis.md
│   ├── 04-design-system.md
│   ├── 05-frontend-architecture.md
│   ├── 06-backend-architecture.md
│   ├── 07-database-design.md
│   ├── 08-api-contract.md             # Shared contract between Edith, Friday & Thor
│   ├── 09-mobile-architecture.md
│   ├── 10-security-plan.md
│   ├── 11-testing-strategy.md
│   ├── 12-deployment-plan.md
│   ├── 13-acceptance-criteria.md
│   └── 14-implementation-roadmap.md
│
├── development/                       # Application Source Code
│   ├── AGENTS.md                      # Development boundary rules
│   ├── frontend/                      # Web App (Next.js App Router, Tailwind, Zustand)
│   ├── backend/                       # Backend App (NestJS, Prisma, PostgreSQL, Redis)
│   └── mobile/                        # Mobile App (Flutter, Dart - Optional)
│
├── infrastructure/                    # DevOps & Containerization
│   ├── docker/                        # Multi-stage Dockerfiles
│   ├── nginx/                         # Nginx reverse proxy & SSL config
│   └── ci-cd/                         # CI/CD deployment configs
│
├── tests/                             # Independent Verification Suites (Thanos)
│   ├── integration/
│   ├── e2e/
│   └── acceptance/
│
└── scripts/                           # Quality Assurance Scripts
    ├── validate-project.sh            # Validates full repository integrity
    ├── check-task.sh                  # Inspects task status in planning/task.md
    └── validate-contracts.sh          # Validates API contract syntax
```

---

## 3. 🚀 How to Use (Step-by-Step Workflow)

### Step 1: Clone and Set Up
```bash
git clone <REPO_URL> my-new-project
cd my-new-project
./scripts/validate-project.sh
```

### Step 2: Fill Client Requirements in `README.md`
Open the root `README.md` and complete:
- Functional requirements (`REQ-F-001`, `REQ-F-002`, etc.)
- Non-functional requirements (performance, scale, accessibility)
- Brand colors, Figma links, and integrations.

### Step 3: Trigger Iron Man (Discovery & Planning)
In your AI chat (OpenAI Codex, Antigravity IDE, Claude, or Cursor), command Iron Man:
> *"Iron Man, review README.md and project.config.md. Generate the technical specifications in docs/ (01-14) and initialize the task board in planning/task.md with appropriate assignments for Jarvis, Friday, Edith, Thor, Thanos, and Ultron."*

Iron Man will:
1. Generate the technical contracts in `docs/`.
2. Record unconfirmed details in `planning/open-questions.md`.
3. Populate `planning/task.md` with master task IDs and hero agent assignees.
4. Dynamically generate individual granular task specification files in `planning/tasks/` (`TASK-001.md`, `TASK-002.md`, ...), ensuring isolated context and 85–90% token reduction per agent session.

### Step 4: Human Approval Gate
Review `planning/task.md` and `planning/open-questions.md`. If you are satisfied:
> *"Plan approved. Proceed with implementation."*

### Step 5: Execute Tasks by Delegating to Specialists
Execute tasks one by one with **Context Isolation**:

- **For UI & Design Foundation (Jarvis)**:
  > *"Jarvis, implement TASK-002. Set up design tokens in globals.css and shared UI primitives (Button, Input, Skeleton, EmptyState)."*

- **For Database & Backend API (Edith)**:
  > *"Edith, implement TASK-003 and TASK-004. Create the Prisma schema models, migration, and authentication REST API. Update docs/08-api-contract.md."*

- **For Web Frontend (Friday)**:
  > *"Friday, implement TASK-007 and TASK-008. Build the Login and Dashboard pages based on docs/08-api-contract.md and Jarvis's design tokens. Ensure the 6 mandatory UI states."*

- **For Mobile App (Thor - Optional)**:
  > *"Thor, implement TASK-009. Build the Flutter authentication flow connected to docs/08-api-contract.md."*

- **For QA & Verification (Thanos)**:
  > *"Thanos, verify TASK-008. Run backend integration tests and frontend component tests. Report verification evidence."*

- **For Docker & Security (Ultron)**:
  > *"Ultron, implement TASK-011. Set up multi-stage Dockerfiles and Nginx reverse proxy with security headers."*

---

## 🔥 4. Token Efficiency Golden Rules: Fresh Session Strategy (Save 95% Tokens)

> [!IMPORTANT]
> ### 🚨 The Risk: "Token Compounding Trap (Single Continuous Chat)"
> **The Problem**:  
> If you keep using a single continuous chat session for 10-15 tasks, the conversation history grows massively. By the 10th task, every single message re-sends the entire past history, burning **30,000 to 50,000+ tokens per turn**, drastically slowing down the model and increasing costs!

---

### 💡 The Magic Solution: "Fresh Chat per Task"

After completing 1 or 2 tasks, **close the current chat window and open a fresh new chat session**.

In the new chat window, you do NOT need to re-explain the project or paste old code. **Simply provide this single command:**

```text
Read planning/updateplanning.md and proceed with the next task.
```
*(Or specify the target agent: `Read planning/updateplanning.md and implement TASK-005 with Friday.`)*

---

### ❓ Will the AI remember previous work in a fresh chat?
**Answer: Yes, 100%!**  
Because under the Avengers Protocol:
1. At the end of every completed task, the active agent saves full progress, changed files, test results, and next actions into `planning/updateplanning.md`.
2. When a new chat session reads `updateplanning.md` and `planning/task.md`, it absorbs the exact state in **less than 1,500 tokens**.
3. **Result:** You bypass the 50,000-token conversation backlog, **saving up to 95% of token consumption** while keeping the AI focused and lightning fast!

---

### ⚡ Additional Token Optimization Rules:
1. **Domain Context Isolation**: When Friday works on web frontend, she never inspects Docker configs or backend controller implementations.
2. **API Contract as Single Bridge**: Friday and Thor communicate with the backend exclusively via `docs/08-api-contract.md`.
3. **Atomic Task Batching**: Group tightly coupled work into single tasks (e.g. `TASK-003: Auth API [DTO + Route + Controller + Service + Unit Test]`).

---

## 5. 🛠️ Useful Terminal Scripts

```bash
# Verify project structure and agent configurations
./scripts/validate-project.sh

# Inspect status of a specific task
./scripts/check-task.sh TASK-001

# Validate API Contract format
./scripts/validate-contracts.sh
```
