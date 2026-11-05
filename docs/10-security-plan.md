# 10 — Security Plan & Hardening

> Owned and maintained by `ultron` and `edith`.

---

## 1. Authentication & Session Security
- Passwords hashed using `bcrypt` (salt rounds >= 10) or `argon2`.
- JWT access tokens with short TTL (15 minutes).
- Refresh tokens stored in HTTP-only, Secure, SameSite=Strict cookies.

---

## 2. API & Network Protection
- **Rate Limiting**: Throttler in NestJS & Nginx limit (e.g., max 10 requests/minute on `/auth/*`).
- **CORS Policy**: Restrict `Access-Control-Allow-Origin` to verified frontend domains.
- **Input Sanitization**: Global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })`.

---

## 3. Infrastructure & Secret Hygiene
- Never commit `.env` or secrets to Git.
- Enforce automated vulnerability scans (`pnpm audit`).
- Apply least privilege to database users.
