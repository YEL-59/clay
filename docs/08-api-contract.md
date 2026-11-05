# 08 — API Contracts (Backend & Frontend Bridge)

> Maintained by `edith`. Consulted by `friday` and `thor`.

---

## 1. Global Conventions
- **Base URL**: `/api/v1`
- **Standard Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <access_token>`

---

## 2. Authentication Endpoints

### 2.1 User Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```
- **Success Response (200 OK)**:
```json
{
  "accessToken": "eyJhbGciOi...",
  "user": {
    "id": "uuid-v4",
    "email": "user@example.com",
    "role": "MEMBER"
  }
}
```
- **Error Response (401 Unauthorized)**:
```json
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized"
}
```

---

## 3. Contract Change Protocol
1. Edith updates endpoint contract here first.
2. Friday updates Next.js query hooks and DTO types.
3. Thor updates Flutter API models (if mobile is active).
