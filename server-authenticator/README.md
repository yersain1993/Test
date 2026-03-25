# Server Authenticator API

API de autenticación con JWT y cookies `httpOnly` para registro, login, refresh y lectura del usuario autenticado.

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

## Sesión

- `POST /api/auth/login` y `POST /api/auth/refresh` establecen cookies `httpOnly`.
- El frontend debe enviar requests con `credentials: include`.
- En desarrollo, el middleware acepta tanto cookie `accessToken` como `Authorization: Bearer <token>`.

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

Autentica usuario y setea cookies seguras.

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
  "user": {
    "email": "user@example.com"
  }
}
```

Errores comunes:

- `400 VALIDATION_ERROR`
- `400 INVALID_CREDENTIALS`

### `POST /auth/refresh`

Renueva la sesión usando la cookie `refreshToken` y vuelve a setear ambas cookies.

Response `200`:

```json
{
  "message": "Session refreshed",
  "user": {
    "email": "user@example.com"
  }
}
```

Errores comunes:

- `401 AUTH_TOKEN_MISSING`
- `403 AUTH_TOKEN_INVALID`

### `POST /auth/logout`

Cierra la sesión y borra las cookies de autenticación.

Response `200`:

```json
{
  "message": "Logout successful"
}
```

### `GET /user`

Retorna el usuario autenticado actual.

Headers:

```http
Cookie: accessToken=<jwt_access_token>
```

Response `200`:

```json
{
  "user": {
    "email": "user@example.com"
  }
}
```

Errores comunes:

- `401 AUTH_TOKEN_MISSING`
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

Refresh:

```bash
curl -X POST "http://localhost:8000/api/auth/refresh" \
  -H "Content-Type: application/json"
```

Usuario autenticado:

```bash
curl "http://localhost:8000/api/user" \
  -H "Cookie: accessToken=<jwt_access_token>"
```
