# Memory Game - Rick and Morty (Frontend)

Aplicacion frontend construida con React + TypeScript + Vite para un memory game de Rick and Morty con autenticacion basada en cookies `httpOnly`.

## Objetivo

El proyecto permite:

- Registro de usuarios.
- Inicio de sesion con persistencia de sesion via refresh token.
- Juego de memoria con personajes de Rick and Morty.
- Flujo protegido para que solo usuarios autenticados accedan al juego.

## Stack

- React 19
- TypeScript
- Vite 8
- React Router DOM 7
- React Hook Form
- Zod
- Zustand
- Axios
- Tailwind CSS v4
- Framer Motion
- Vitest
- React Testing Library
- Testing Library User Event
- JSDOM

## Arquitectura de carpetas

```text
src/
  features/
    auth/
      api/
      components/
      context/
      pages/
      schemas/
      services/
      types/
      utils/
    game/
      animations/
      components/
      hooks/
      pages/
      services/
      store/
      types/
      utils/
  shared/
    components/ui/
    utils/
```

## Flujo de autenticacion

1. El login envia credenciales a `POST /auth/login` con `withCredentials: true`.
2. El backend devuelve cookies `httpOnly` (access/refresh token).
3. Se guarda un marcador local `auth.session.active` en `localStorage`.
4. Al montar la app, `UserProvider` intenta renovar sesion con `POST /auth/refresh`.
5. Si la renovacion falla, se limpia el marcador local y el usuario queda deslogueado.
6. El logout ejecuta `POST /auth/logout` y limpia estado local.

## Flujo del juego

- Se obtienen 6 personajes aleatorios desde la API GraphQL de Rick and Morty.
- Se duplican cartas (pares), se mezclan con Fisher-Yates y se inicializa el estado.
- El juego tiene estados: `idle -> preview -> playing -> finished`.
- En `preview` se muestran cartas por 3 segundos.
- En cada turno se comparan 2 cartas:
- Si coinciden, se marcan como `isMatched`.
- Si no coinciden, se voltean despues de 1 segundo.
- El juego termina cuando `matches === totalPairs`.

## Rutas

- `/` -> redirecciona a `/game`
- `/login` -> publico (si hay sesion redirige a `/game`)
- `/register` -> publico (si hay sesion redirige a `/game`)
- `/game` -> protegido (si no hay sesion redirige a `/login`)
- `*` -> redirecciona a `/login`

## Variables de entorno

Crear un archivo `.env` en la raiz del proyecto:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

## Scripts disponibles

```bash
npm run dev      # entorno local
npm run build    # build de produccion
npm run preview  # vista previa del build
npm run lint     # analisis estatico
npm run format   # formateo con prettier
npm run test     # ejecuta todos los tests con vitest
npm run test:watch # ejecuta tests en modo watch
npm run test:coverage # ejecuta tests con reporte de cobertura
```

## Testing

La suite usa **Vitest + React Testing Library** y esta orientada a la logica critica del proyecto:

- Utilidades puras: `buildShuffledCards` (cobertura 100%).
- Store de juego (Zustand): transiciones `idle -> preview -> playing -> finished`, reglas de `flipCard`, turnos, matches, reset y temporizadores.
- Hook de carga: `useCharacters` (flujo exitoso, error y delegacion de `startGame`).
- Servicio de API: `fetchCharacters` con mocks de Axios y validacion de transformacion de datos.
- Formulario de registro: `RegisterCard` con validaciones Zod, errores de backend y flujo exitoso.

### Setup global de tests

`vitest.setup.ts` incluye:

- `@testing-library/jest-dom` para matchers de UI.
- Limpieza automatica del DOM en cada test.
- Limpieza y restauracion de mocks (`vi.clearAllMocks`, `vi.restoreAllMocks`).
- Reset del estado global de `useGameStore` (Zustand) en cada test para evitar contaminacion entre suites.

### Timers en pruebas

- El proyecto **no fuerza fake timers globales**.
- Los tests de juego activan `vi.useFakeTimers()` solo en sus suites, para avanzar los delays (3s preview, 1s comparacion) sin esperar tiempo real.

### Cobertura

- La cobertura esta focalizada en modulos criticos:
  - `src/features/game/utils/buildShuffleCards.ts`
  - `src/features/game/store/useGameStore.ts`
  - `src/features/game/hooks/useCharacters.ts`
  - `src/features/game/services/rickAndMortyService.ts`
  - `src/features/auth/components/RegisterCard.tsx`

## Ejecutar en local

```bash
npm install
npm run dev
```

## Backend esperado

Este frontend asume un backend con estos endpoints:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

Todos deben aceptar CORS con credenciales para el origen del frontend.

## Notas de mantenimiento

- `README.md` es la documentacion principal del repositorio.
- Si cambian rutas, servicios o reglas del juego, actualizar este archivo junto con `SDD.md`.
