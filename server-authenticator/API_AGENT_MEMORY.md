# API Agent Memory (REST + GraphQL)

Memoria operativa para agentes que consumen `server-authenticator`.

## Snapshot del servicio

- API actual: `REST`.
- Base URL: `http://localhost:8000/api`.
- Autenticacion: JWT por header `Authorization: Bearer <accessToken>`.
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
  "accessToken": "jwt",
  "refreshToken": "jwt"
}
```

- Errors:
  - `400 VALIDATION_ERROR`
  - `400 INVALID_CREDENTIALS`

### 3) Current User

- Method: `GET`
- Path: `/user`
- Header: `Authorization: Bearer <accessToken>`
- Success:

```json
{
  "email": "user@example.com"
}
```

- Errors:
  - `401 AUTH_TOKEN_MISSING`
  - `401 AUTH_TOKEN_MALFORMED`
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
2. Hacer login (`POST /auth/login`), guardar `accessToken` y `refreshToken`.
3. Para endpoints protegidos, enviar `Authorization: Bearer <accessToken>`.
4. Si recibe `403 AUTH_TOKEN_INVALID`, repetir login y renovar token.
5. Si recibe `401 AUTH_TOKEN_MISSING` o `401 AUTH_TOKEN_MALFORMED`, reconstruir header y reintentar 1 vez.

## Minimal state for an autonomous agent

- `baseUrl`: `http://localhost:8000/api`
- `email`: ultimo email autenticado
- `accessToken`: JWT actual
- `refreshToken`: JWT actual
- `lastLoginAt`: timestamp local
- `authStrategy`: `bearer-jwt`

## Security notes

- Nunca loggear tokens completos en texto plano.
- Limpiar tokens al finalizar ejecucion del agente.
- Forzar password de al menos 8 caracteres (alineado con backend).
