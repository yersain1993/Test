# Memory Game RyM - Architecture Context

This document is for agents working in `memory-game-RyM`.

## Project goals
- React + Vite frontend for a memory game.
- Auth flows are implemented as feature-scoped modules with cookie-based sessions.
- UI is built with Tailwind CSS utility classes.
- TypeScript strict mode is enabled.

## Folder structure
- `src/App.tsx`: application routes.
- `src/main.tsx`: app bootstrap.
- `src/features/auth/`: auth feature slice.
  - `components/`: reusable UI cards and form components.
  - `screens/`: route-level pages.
  - `services/`: API calls and side effects.
  - `schemas/`: Zod schemas for form validation.
  - `types/`: TypeScript types for API and form contracts.
- `src/shared/`: reusable code shared across features.
  - `components/ui/`: generic UI building blocks.
  - `utils/`: helper functions.
- `codex/context.md`: agent-facing architecture notes and project conventions.
- `public/`: static assets.
- `src/assets/`: imported assets such as the logo.

## Auth architecture
- `LoginPage` and `RegisterPage` are route entry points.
- Pages should compose `Layout` with a feature card component.
- `LoginCard` and `RegisterCard` contain the form UI and local form logic.
- `GamePage` is the authenticated landing page after login.
- API calls must live in `src/features/auth/services/`.
- Validation schemas must live in `src/features/auth/schemas/`.
- Shared visual primitives should stay in `src/shared/components/ui/`.
- Password visibility toggles are shared through `PasswordVisibilityButton`.
- Session state must live in `src/shared/context/userContext.ts`.
- Use the auth context as the source of truth for `user`, `isAuthenticated`, and logout.

## API contract
Source of truth: `server-authenticator/API_AGENT_MEMORY.md`

- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Refresh session: `POST /api/auth/refresh`
- Logout: `POST /api/auth/logout`
- Current user: `GET /api/user`

Expected auth base URL:
- `VITE_AUTH_API_URL` when defined
- fallback for local dev:
  - login: `http://localhost:8000/api/auth/login`
  - register: `http://localhost:8000/api/auth/register`
  - refresh: `http://localhost:8000/api/auth/refresh`
  - logout: `http://localhost:8000/api/auth/logout`
  - current user: `http://localhost:8000/api/user`

## Form patterns
- Use `react-hook-form` for controlled submission flow.
- Use Zod for client-side validation.
- For password confirmation, validate both values on the frontend before calling the service.
- The project currently uses a custom Zod resolver pattern in the auth cards instead of `@hookform/resolvers`.
- Keep user-facing error messages short and localized in Spanish.

## UI patterns
- Tailwind CSS is the default styling system.
- Prefer compact layouts for auth cards to reduce viewport overflow.
- Reuse the existing visual language from `LoginCard` when building new auth views.
- Avoid adding new layout wrappers unless the screen truly needs them.

## Naming conventions
- Feature folders follow screaming architecture by domain.
- Use `*Card.tsx` for form containers.
- Use `*Page.tsx` for route-level components.
- Use `*Service.ts` for API interaction.
- Use `*Schema.ts` for Zod schemas.
- Use `*Types.ts` for DTOs and result types.

## Implementation notes for agents
- Do not modify config files unless the user explicitly asks.
- Prefer feature-local changes over shared changes.
- Do not move code out of `features/auth` unless it is truly reusable.
- Keep imports aligned with the existing `@/` alias.
- When adding a new auth flow, keep screen navigation in the screen component and API logic in the service layer.

## Current auth behavior
- Login uses `credentials: 'include'` and relies on `httpOnly` cookies set by the backend.
- `UserContext` hydrates the session on app startup and redirects authenticated users to `/game`.
- Register currently posts credentials and returns to `/login` on success.
- Backend login returns `{ message, user }` and sets auth cookies.
- Backend register endpoint returns `201` with `{ "message": "User registered" }` on success.
- Common register errors:
  - `VALIDATION_ERROR`
  - `USER_ALREADY_EXISTS`

## Troubleshooting notes
- If the browser console shows `page-events.js` errors, verify whether the stack trace comes from a browser extension or injected script.
- That script is not part of this repo, so it should be treated as an external noise source unless proven otherwise.

## Useful files
- `src/features/auth/components/LoginCard.tsx`
- `src/features/auth/components/RegisterCard.tsx`
- `src/features/auth/services/loginService.ts`
- `src/features/auth/services/authSessionService.ts`
- `src/features/auth/services/registerService.ts`
- `src/shared/context/userContext.ts`
- `src/shared/components/ui/PasswordVisibilityButton.tsx`
- `src/shared/components/ui/Layout.tsx`
- `server-authenticator/API_AGENT_MEMORY.md`
