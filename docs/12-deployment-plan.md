# 12 — Deployment & Infrastructure Plan

> Owned and maintained by `ultron`.

---

## 1. Environments
- **Local Development**: Docker Compose with PostgreSQL + Redis + hot-reloading app servers.
- **Staging / Preview**: Automated PR preview environments via CI/CD.
- **Production**: Hardened Linux VPS / Cloud Cluster with Nginx reverse proxy and SSL.

---

## 2. Docker Architecture
- Multi-stage builds:
  - Base: Node.js 20 Alpine
  - Builder: pnpm install, prisma generate, build
  - Runner: Minimal production footprint without devDependencies.

---

## 3. Rollback & Disaster Recovery
- Keep previous image tags versioned in container registry.
- Automated daily database backup scripts with 30-day retention.
- Zero-downtime rolling restart via Docker Swarm or Nginx upstream reload.
