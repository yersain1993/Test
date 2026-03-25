# Memory Game RyM

Frontend en React + TypeScript + Vite para un juego tipo memory game con autenticación basada en cookies `httpOnly`.

## Stack

- React 19
- TypeScript
- Vite
- React Router
- React Hook Form
- Zod
- Tailwind CSS

## Estructura

- `src/main.tsx`: arranque de la app.
- `src/App.tsx`: rutas principales.
- `src/features/auth/`: login, registro y sesión.
- `src/features/games/`: pantalla autenticada del juego.
- `src/shared/`: componentes reutilizables, utilidades y contexto global.

## Flujo de autenticación

- El login usa `credentials: 'include'`.
- El backend responde con cookies `httpOnly` para `accessToken` y `refreshToken`.
- `src/shared/context/userContext.ts` mantiene el estado de sesión en memoria.
- Al iniciar la app, el contexto intenta rehidratar la sesión con `POST /api/auth/refresh`.
- Después de iniciar sesión, el usuario se redirige a `/game`.

## Rutas

- `/login`
- `/register`
- `/recover-password`
- `/game`

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
