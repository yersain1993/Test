# API Agent Memory (REST + GraphQL)

Memoria operativa para agentes que consumen `server-authenticator`.

## Snapshot del servicio

- API actual: `REST`.
- Base URL: `http://localhost:8000/api`.
- Autenticacion: JWT con cookies `httpOnly` (`accessToken` y `refreshToken`).
- GraphQL nativo: `NO` (no existe endpoint `/graphql` en el backend actual).

## REST Contract (source of truth)

### 1) Register

- Method: `POST`
- Path: `/auth/register`
- Body JSON:

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

- Success: `201 { "message": "User registered" }`
- Errors:
  - `400 VALIDATION_ERROR`
  - `400 USER_ALREADY_EXISTS`

### 2) Login

- Method: `POST`
- Path: `/auth/login`
- Body JSON:

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

- Success:

```json
{
  "message": "Login successful",
  "user": {
    "email": "user@example.com"
  }
}
```

- Errors:
  - `400 VALIDATION_ERROR`
  - `400 INVALID_CREDENTIALS`

### 3) Refresh Session

- Method: `POST`
- Path: `/auth/refresh`
- Auth: cookie `refreshToken`
- Success:

```json
{
  "message": "Session refreshed",
  "user": {
    "email": "user@example.com"
  }
}
```

- Errors:
  - `401 AUTH_TOKEN_MISSING`
  - `403 AUTH_TOKEN_INVALID`

### 4) Logout

- Method: `POST`
- Path: `/auth/logout`
- Auth: cookie session
- Success:

```json
{
  "message": "Logout successful"
}
```

- Errors:
  - none expected for the happy path

### 5) Current User

- Method: `GET`
- Path: `/user`
- Header: `Cookie: accessToken=<jwt_access_token>`
- Success:

```json
{
  "user": {
    "email": "user@example.com"
  }
}
```

- Errors:
  - `401 AUTH_TOKEN_MISSING`
  - `403 AUTH_TOKEN_INVALID`

## Error Shape (all endpoints)

```json
{
  "message": "text",
  "code": "ERROR_CODE"
}
```

## Agent Playbook (REST)

1. Registrar usuario (`POST /auth/register`) si no existe.
2. Hacer login (`POST /auth/login`) con `credentials: include` para que el backend emita cookies.
3. Para mantener la sesión, preferir `POST /auth/refresh` y luego `GET /user` cuando se necesite el usuario actual.
4. Para endpoints protegidos, confiar en la cookie `accessToken`; en desarrollo el backend también acepta `Authorization: Bearer <accessToken>`.
5. Si `refresh` devuelve `403 AUTH_TOKEN_INVALID`, tratar la sesión como expirada y pedir login otra vez.

## Minimal state for an autonomous agent

- `baseUrl`: `http://localhost:8000/api`
- `email`: ultimo email autenticado
- `isAuthenticated`: boolean
- `lastSessionCheckAt`: timestamp local
- `authStrategy`: `cookie-httpOnly`

## Security notes

- Nunca loggear tokens completos en texto plano.
- Tratar las cookies como la fuente de verdad de la sesión.
- Forzar password de al menos 8 caracteres solo para registro; login solo valida presencia de email y password.
