# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite development server
npm run build     # TypeScript check + production build
npm run lint      # Run ESLint
npm run format    # Format with Prettier
npm run preview   # Preview production build
```

## Architecture

This is a Rick and Morty memory card game built with React 19, TypeScript, and Vite 8.

### Feature-based Structure

```
src/
├── features/
│   ├── auth/           # Authentication module
│   │   ├── api/        # Axios instance (apiClient)
│   │   ├── components/ # LoginCard, RegisterCard
│   │   ├── pages/      # LoginPage, RegisterPage, RecoverPasswordPage
│   │   ├── services/   # Auth API calls (login, register, session)
│   │   ├── schemas/    # Zod validation schemas
│   │   ├── types/      # TypeScript interfaces
│   │   └── utils/      # Error handlers
│   └── game/           # Game module
│       ├── animations/ # Framer Motion presets (FlipAnimation)
│       ├── components/ # Card components (CharacterCard, GridCard)
│       ├── hooks/      # useCharacters
│       ├── pages/      # GamePage
│       ├── services/   # Rick and Morty GraphQL API
│       ├── store/      # Zustand store (useGameStore)
│       ├── types/      # Character, Card, GameStatus types
│       └── utils/      # Card shuffling logic
└── shared/
    ├── components/ui/  # Button, Layout, PasswordVisibilityButton
    ├── context/        # UserContext (auth state via React Context)
    └── utils/          # mergeClassNames (tailwind-merge wrapper)
```

### State Management

- **Authentication**: React Context (`UserProvider` in `src/shared/context/userContext.ts`) manages user state, login/logout, and session bootstrapping via localStorage marker + HTTP-only cookies.
- **Game State**: Zustand store (`useGameStore`) handles card deck, flipped cards, matches, turns, and game status lifecycle (`idle` → `preview` → `playing` → `finished`).

### API Integration

- **Auth Backend**: Axios client (`apiClient`) configured with `withCredentials: true` for cookie-based auth. Base URL from `VITE_API_BASE_URL` env var (defaults to `http://localhost:8000/api`).
- **Rick and Morty API**: GraphQL endpoint at `https://rickandmortyapi.com/graphql` for fetching character data.

### Routing

Protected routes (`/game`) redirect to `/login` when unauthenticated. Public routes (`/login`, `/register`) redirect to `/game` when already authenticated.

## Import Alias

Use `@/*` to import from `src/*`:

```typescript
import { useAuth } from '@/shared/context/userContext';
import type { Character } from '@/features/game/types/character';
```

## Key Patterns

- Forms use `react-hook-form` with Zod resolvers for validation
- Card flip animations use Framer Motion with 3D transforms
- Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- Result types for service functions: `{ ok: true; data } | { ok: false; reason }`

## UI Components

### Button Variants
The `Button` component (`src/shared/components/ui/Button.tsx`) supports three variants:

```typescript
<Button variant="submit" />  // Teal bg, lime shadow (auth forms, default)
<Button variant="play" />    // Cyan bg #A2F2F9, lime border #D8E054
<Button variant="home" />    // Lime bg #D8E054, cyan border #A2F2F9
```
