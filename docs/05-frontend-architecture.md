# 05 — Frontend Architecture

> Owned and maintained by `friday`.

---

## 1. Directory Structure (`development/frontend/`)
```text
development/frontend/
├── src/
│   ├── app/                    # Next.js App Router routes & layouts
│   │   ├── (auth)/             # Login, Register, Forgot Password
│   │   ├── (dashboard)/        # Protected app views
│   │   ├── layout.tsx          # Root layout with theme & query providers
│   │   └── page.tsx            # Landing or initial redirect
│   ├── components/
│   │   ├── ui/                 # Jarvis design primitives (Button, Input, Card)
│   │   └── modules/            # Domain-specific components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # API client, utility functions, validators
│   ├── store/                  # Zustand stores for client-only state
│   └── styles/                 # globals.css with Jarvis CSS variables
├── public/                     # Static assets
└── package.json
```

---

## 2. State Management Strategy
- **Server State**: Managed exclusively by **TanStack Query** (caching, deduplication, optimistic updates, background refetching).
- **Client State**: Lightweight **Zustand** stores for transient UI states (sidebar collapse, active filters, modal states).
- **Form State**: Managed via **React Hook Form** paired with **Zod** schema resolvers.

---

## 3. API Communication Layer
- Centralized Axios / Fetch wrapper with automatic Bearer token injection.
- Global response interceptor for 401 unauthorized automatic logout.
