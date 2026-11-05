---
name: deployment-security
description: Workflow for containerization with Docker, Nginx reverse proxy configuration, CI/CD pipeline setup, and cyber security auditing with Ultron.
---

# Deployment and Security Workflow (Ultron)

## Purpose
Guide the DevOps and Security Specialist (`ultron`) to containerize the application, configure reverse proxies, set up automated CI/CD pipelines, and harden system security.

## Key Focus Areas
- **Containerization**: Multi-stage Docker builds for minimal production image sizes.
- **Nginx**: Reverse proxy, SSL/TLS termination, rate limiting, gzip/brotli compression.
- **Cyber Security**: Security headers, CORS, CSRF, cookie security, secret hygiene.
- **CI/CD**: GitHub Actions workflows for automated linting, testing, and security scanning.

## Step-by-Step Procedure

### 1. Docker Build & Multi-Stage Architecture
- Frontend Dockerfile: Build Next.js standalone output for ultra-lightweight containers.
- Backend Dockerfile: Transpile NestJS to JavaScript and prune development dependencies.
- Docker Compose: Configure app services, PostgreSQL, Redis, and health checks with resource limits.

### 2. Nginx & Reverse Proxy Configuration
- Set up reverse proxy routing:
  - `/` -> Frontend Next.js container (port 3000)
  - `/api/` -> Backend NestJS container (port 4000)
- Enforce strict security headers:
  ```nginx
  add_header X-Frame-Options "DENY" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none';" always;
  ```

### 3. Cyber Security Audit
- Run dependency vulnerability scan:
  ```bash
  pnpm audit
  ```
- Verify that `.env` files and API secrets are never tracked in Git (check `.gitignore`).
- Verify rate limiting is active on `/api/v1/auth/*` routes.

### 4. Human Approval Gate
- Production deployment or changing production environment variables **ALWAYS** requires explicit human confirmation.
