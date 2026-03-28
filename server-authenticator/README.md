# Server Authenticator

Servidor de autenticacion en Node.js + Express + TypeScript para registro, login, refresh y logout con JWT en cookies `httpOnly`.

## Que hace este servidor

- Registra usuarios (`/api/auth/register`).
- Inicia sesion y emite `accessToken` + `refreshToken` en cookies `httpOnly` (`/api/auth/login`).
- Renueva sesion usando `refreshToken` (`/api/auth/refresh`).
- Cierra sesion limpiando cookies (`/api/auth/logout`).
- Expone usuario autenticado actual (`/api/user`).

## Stack

- Node.js
- Express 5
- TypeScript
- jsonwebtoken
- bcryptjs
- cookie-parser
- cors
- dotenv

## Estructura del proyecto

```text
src/
  app/create-app.ts                 # Config de Express, CORS, middlewares y router /api
  config/env.ts                     # Carga y validacion de variables de entorno
  controllers/                      # Controladores HTTP (auth, user)
  middlewares/                      # Auth middleware + error handler
  repositories/                     # Repositorio de usuarios (in-memory)
  routes/                           # Rutas /auth y /user
  services/                         # Logica de auth, hash y JWT
  utils/auth-cookies.ts             # Politica de cookies (set/clear)
  server.ts                         # Wiring de dependencias + arranque
app.ts                              # Entry point
```

## Requisitos

- Node.js 18+
- npm

## Variables de entorno

Este servidor requiere un archivo `.env` (puedes partir de `.env.example`).

| Variable | Requerida | Default | Descripcion |
| --- | --- | --- | --- |
| `ACCESS_SECRET` | Si | - | Secreto para firmar access token |
| `REFRESH_SECRET` | Si | - | Secreto para firmar refresh token |
| `ACCESS_TOKEN_EXPIRATION` | No | `15m` | Expiracion de access token (`ms|s|m|h|d`) |
| `REFRESH_TOKEN_EXPIRATION` | No | `7d` | Expiracion de refresh token (`ms|s|m|h|d`) |
| `PORT` | No | `8000` | Puerto HTTP |
| `CORS_ORIGIN` | No | `*` | Origen CORS permitido |

Ejemplo:

```env
ACCESS_SECRET=your_access_secret
REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d
PORT=8000
CORS_ORIGIN=http://localhost:5173
```

## Instalacion y ejecucion

```bash
npm install
npm run dev
```

Servidor por defecto:

```text
http://localhost:8000
```

Scripts disponibles:

```bash
npm run dev      # desarrollo con watch
npm run start    # ejecucion directa
npm run build    # type-check (tsc --noEmit)
```

## Base URL y rutas

Base API:

```text
http://localhost:8000/api
```

Rutas:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /user` (protegida)

## Contrato de autenticacion

### Cookies

`login` y `refresh` seteaan:

- `accessToken`
- `refreshToken`

Politica de cookies (`src/utils/auth-cookies.ts`):

- `httpOnly: true`
- `path: /`
- `secure: true` en produccion, `false` en desarrollo
- `sameSite: none` en produccion, `lax` en desarrollo
- `maxAge` segun expiracion configurada

### Middleware protegido

`GET /api/user` valida token en este orden:

1. Cookie `accessToken`.
2. Header `Authorization: Bearer <token>` (fallback).

Si el token es valido, inyecta `req.user`.

## Endpoints

### `POST /api/auth/register`

Body:

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

Validaciones:

- `email` requerido (se aplica `trim`).
- `password` requerida y minimo 8 caracteres.

Respuesta `201`:

```json
{
  "message": "User registered"
}
```

Errores comunes:

- `400 VALIDATION_ERROR`
- `400 USER_ALREADY_EXISTS`

### `POST /api/auth/login`

Body:

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

Respuesta `200` (y cookies seteadas):

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

### `POST /api/auth/refresh`

Requiere cookie `refreshToken`.

Respuesta `200` (y cookies renovadas):

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

### `POST /api/auth/logout`

Limpia `accessToken` y `refreshToken`.

Respuesta `200`:

```json
{
  "message": "Logout successful"
}
```

### `GET /api/user`

Ruta protegida.

Respuesta `200`:

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

Todas las respuestas de error siguen este formato:

```json
{
  "message": "Human readable message",
  "code": "ERROR_CODE"
}
```

Codigos de error esperados:

- `VALIDATION_ERROR`
- `USER_ALREADY_EXISTS`
- `INVALID_CREDENTIALS`
- `AUTH_TOKEN_MISSING`
- `AUTH_TOKEN_INVALID`
- `ROUTE_NOT_FOUND`
- `INTERNAL_ERROR`

## Ejemplos curl (con jar de cookies)

Registro:

```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123"}'
```

Login (guarda cookies):

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123"}' \
  -c cookies.txt
```

Usuario actual (usa cookies):

```bash
curl "http://localhost:8000/api/user" \
  -b cookies.txt
```

Refresh (renueva cookies):

```bash
curl -X POST "http://localhost:8000/api/auth/refresh" \
  -b cookies.txt \
  -c cookies.txt
```

Logout:

```bash
curl -X POST "http://localhost:8000/api/auth/logout" \
  -b cookies.txt
```

## Nota importante para desarrollo

El repositorio de usuarios actual es en memoria (`InMemoryUserRepository`), por lo que los usuarios se pierden cuando se reinicia el proceso. Si necesitas persistencia real, debes reemplazar esa implementacion por una base de datos.
