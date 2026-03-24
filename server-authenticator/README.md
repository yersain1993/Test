# Server Authenticator API

API de autenticacion con JWT para registro, login y lectura del usuario autenticado.

## Base URL

- `http://localhost:8000/api`

## Requisitos

- Node.js 18+ recomendado
- Variables de entorno:
  - `ACCESS_SECRET` (requerida)
  - `REFRESH_SECRET` (requerida)
  - `ACCESS_TOKEN_EXPIRATION` (opcional, default `15m`)
  - `REFRESH_TOKEN_EXPIRATION` (opcional, default `7d`)
  - `PORT` (opcional, default `8000`)
  - `CORS_ORIGIN` (opcional, default `*`)

## Ejecucion

```bash
npm install
npm run dev
```

Servidor local:

```text
http://localhost:8000
```

## Endpoints

### `POST /auth/register`

Registra un usuario nuevo.

Request:

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

Reglas:

- `email` obligatorio (se hace `trim`).
- `password` obligatoria, minimo 8 caracteres.

Response `201`:

```json
{
  "message": "User registered"
}
```

Errores comunes:

- `400 VALIDATION_ERROR`
- `400 USER_ALREADY_EXISTS`

### `POST /auth/login`

Autentica usuario y retorna tokens.

Request:

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

Response `200`:

```json
{
  "message": "Login successful",
  "accessToken": "<jwt_access_token>",
  "refreshToken": "<jwt_refresh_token>"
}
```

Errores comunes:

- `400 VALIDATION_ERROR`
- `400 INVALID_CREDENTIALS`

### `GET /user`

Retorna el usuario autenticado actual.

Headers:

```http
Authorization: Bearer <accessToken>
```

Response `200`:

```json
{
  "email": "user@example.com"
}
```

Errores comunes:

- `401 AUTH_TOKEN_MISSING`
- `401 AUTH_TOKEN_MALFORMED`
- `403 AUTH_TOKEN_INVALID`

## Formato de errores

Todas las respuestas de error siguen:

```json
{
  "message": "Human readable message",
  "code": "ERROR_CODE"
}
```

Ejemplos de codigos:

- `VALIDATION_ERROR`
- `USER_ALREADY_EXISTS`
- `INVALID_CREDENTIALS`
- `AUTH_TOKEN_MISSING`
- `AUTH_TOKEN_MALFORMED`
- `AUTH_TOKEN_INVALID`
- `ROUTE_NOT_FOUND`
- `INTERNAL_ERROR`

## Ejemplos curl

Registro:

```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user@example.com\",\"password\":\"Password123\"}"
```

Login:

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user@example.com\",\"password\":\"Password123\"}"
```

Usuario autenticado:

```bash
curl "http://localhost:8000/api/user" \
  -H "Authorization: Bearer <accessToken>"
```

