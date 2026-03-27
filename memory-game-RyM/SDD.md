# Software Design Document (SDD)

## Memory Game - Rick and Morty

**Versión:** 1.0
**Fecha:** 2026-03-26

---

## 1. Introducción

### 1.1 Propósito

Este documento describe el diseño técnico del juego de memoria basado en personajes de Rick and Morty. Incluye la arquitectura, componentes, flujos de datos y decisiones de diseño.

### 1.2 Alcance

Aplicación web SPA que permite a usuarios autenticados jugar un juego de memoria con cartas de personajes obtenidos de la API de Rick and Morty.

### 1.3 Stack Tecnológico

| Categoría     | Tecnología            |
| ------------- | --------------------- |
| Framework     | React 19              |
| Lenguaje      | TypeScript            |
| Bundler       | Vite 8                |
| Estilos       | Tailwind CSS v4       |
| Estado (Auth) | React Context         |
| Estado (Game) | Zustand               |
| Formularios   | react-hook-form + Zod |
| Animaciones   | Framer Motion         |
| HTTP Client   | Axios                 |
| Routing       | React Router DOM      |

---

## 2. Arquitectura del Sistema

### 2.1 Diagrama de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │    Auth     │    │    Game     │    │   Shared    │     │
│  │   Module    │    │   Module    │    │   Module    │     │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘     │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                │
│              ┌─────────────┴─────────────┐                  │
│              │      State Management     │                  │
│              │  (Context + Zustand)      │                  │
│              └─────────────┬─────────────┘                  │
└────────────────────────────┼────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Auth Backend  │ │ Rick & Morty    │ │   LocalStorage  │
│   (REST API)    │ │ GraphQL API     │ │   (Session)     │
│   :8000/api     │ │                 │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 2.2 Estructura de Directorios

```
src/
├── features/
│   ├── auth/                    # Módulo de autenticación
│   │   ├── api/                 # apiClient (Axios)
│   │   ├── components/          # LoginCard, RegisterCard
│   │   ├── pages/               # LoginPage, RegisterPage
│   │   ├── services/            # login(), register(), session()
│   │   ├── schemas/             # Zod schemas
│   │   ├── types/               # User, Credentials
│   │   └── utils/               # handleAuthError()
│   │
│   └── game/                    # Módulo del juego
│       ├── animations/          # FlipAnimation
│       ├── components/          # CharacterCard, GridCard
│       ├── hooks/               # useCharacters
│       ├── pages/               # GamePage
│       ├── services/            # fetchCharacters()
│       ├── store/               # useGameStore
│       ├── types/               # Character, Card, GameStatus
│       └── utils/               # shuffleCards()
│
└── shared/
    ├── components/ui/           # Button, Layout
    ├── context/                 # UserProvider
    └── utils/                   # mergeClassNames()
```

---

## 3. Diseño de Componentes

### 3.1 Módulo de Autenticación

#### 3.1.1 UserContext

Gestiona el estado global de autenticación.

```typescript
interface UserContextValue {
  user: User | null;
  isLoading: boolean;
  login: (credentials: Credentials) => Promise<Result>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<Result>;
}
```

**Flujo de sesión:**

1. Al montar `UserProvider`, verifica marcador en localStorage
2. Si existe, hace request a `/session` para validar cookie HTTP-only
3. Actualiza estado `user` según respuesta

#### 3.1.2 Servicios de Auth

| Servicio       | Endpoint         | Método | Descripción                     |
| -------------- | ---------------- | ------ | ------------------------------- |
| `login()`      | `/auth/login`    | POST   | Autentica usuario, setea cookie |
| `register()`   | `/auth/register` | POST   | Crea cuenta nueva               |
| `getSession()` | `/auth/session`  | GET    | Valida sesión actual            |
| `logout()`     | `/auth/logout`   | POST   | Invalida sesión                 |

**Patrón Result:**

```typescript
type Result<T> = { ok: true; data: T } | { ok: false; reason: string };
```

### 3.2 Módulo del Juego

#### 3.2.1 Game Store (Zustand)

```typescript
interface GameState {
  cards: Card[];
  flippedCards: number[];
  matchedPairs: number[];
  turns: number;
  status: GameStatus;

  // Actions
  initGame: (characters: Character[]) => void;
  flipCard: (index: number) => void;
  checkMatch: () => void;
  resetGame: () => void;
}

type GameStatus = 'idle' | 'preview' | 'playing' | 'finished';
```

#### 3.2.2 Ciclo de Vida del Juego

```
┌─────────┐   initGame()   ┌─────────┐   3s timeout   ┌─────────┐
│  idle   │ ─────────────► │ preview │ ─────────────► │ playing │
└─────────┘                └─────────┘                └────┬────┘
                                                          │
     ┌────────────────────────────────────────────────────┤
     │                                                    │
     │  flipCard() → checkMatch()                         │
     │  ┌─────────────────────────────────┐               │
     │  │ match: remove cards, +aciertos  │               │
     │  │ no match: flip back after 1s    │               │
     │  │ +1 turn                         │               │
     │  └─────────────────────────────────┘               │
     │                                                    │
     │         all pairs matched                          │
     │                                                    ▼
     │                                            ┌──────────┐
     └───────────────────────────────────────────►│ finished │
                                                  └──────────┘
```

#### 3.2.3 Tipos de Datos

```typescript
interface Character {
  id: string;
  name: string;
  image: string;
  status: string;
  species: string;
}

interface Card {
  id: string;
  characterId: string;
  character: Character;
  isFlipped: boolean;
  isMatched: boolean;
}
```

#### 3.2.4 Servicio Rick and Morty API

```typescript
// GraphQL Query
const GET_CHARACTERS_QUERY = `
  query GetCharacters($page: Int!) {
    characters(page: $page) {
      results { id, name, image, status, species }
    }
  }
`;

// Endpoint: https://rickandmortyapi.com/graphql
const fetchCharacters = async (page: number, limit: number): Promise<Character[]>
```

### 3.3 Componentes UI Compartidos

#### 3.3.1 Button

| Prop        | Tipo                           | Default    | Descripción     |
| ----------- | ------------------------------ | ---------- | --------------- |
| `variant`   | `'submit' \| 'play' \| 'home'` | `'submit'` | Estilo visual   |
| `isLoading` | `boolean`                      | `false`    | Estado de carga |

**Variantes de color:**

| Variante | Background | Border  | Shadow  |
| -------- | ---------- | ------- | ------- |
| submit   | #21838d    | #1d8993 | #c8df3f |
| play     | #A2F2F9    | #D8E054 | #D8E054 |
| home     | #D8E054    | #A2F2F9 | #A2F2F9 |

---

## 4. Flujos de Datos

### 4.1 Flujo de Login

```
Usuario                LoginCard              loginService           apiClient            Backend
   │                       │                       │                     │                   │
   │──── email/pass ──────►│                       │                     │                   │
   │                       │──── login() ─────────►│                     │                   │
   │                       │                       │─── POST /login ────►│                   │
   │                       │                       │                     │────── auth ──────►│
   │                       │                       │                     │◄─── Set-Cookie ───│
   │                       │                       │◄── { ok, data } ────│                   │
   │                       │◄── Result ────────────│                     │                   │
   │                       │                       │                     │                   │
   │                       │─── setUser() ────────►│ UserContext         │                   │
   │                       │─── navigate('/game')  │                     │                   │
   │◄── redirect ──────────│                       │                     │                   │
```

### 4.2 Flujo del Juego

```
GamePage              useCharacters          useGameStore              UI
   │                       │                     │                     │
   │── mount ─────────────►│                     │                     │
   │                       │── fetchCharacters() │                     │
   │                       │◄── characters[] ────│                     │
   │                       │                     │                     │
   │── initGame(chars) ───►│                     │                     │
   │                       │                     │── shuffle & dup ────│
   │                       │                     │── status: preview ──│
   │                       │                     │                     │── show cards 3s
   │                       │                     │                     │
   │                       │                     │── status: playing ──│
   │                       │                     │                     │── hide cards
   │                       │                     │                     │
   │◄───────────────────── user click ───────────│                     │
   │── flipCard(idx) ─────►│                     │                     │
   │                       │                     │── flippedCards[] ───│
   │                       │                     │                     │── animate flip
   │                       │                     │                     │
   │── checkMatch() ──────►│ (when 2 flipped)    │                     │
   │                       │                     │── compare cards ────│
   │                       │                     │── update state ─────│
   │                       │                     │── turns++ ──────────│
```

---

## 5. Reglas de Negocio

### 5.1 Inicio del Juego

- Las cartas se barajan aleatoriamente al comenzar
- Todas las cartas se muestran por **3 segundos** (preview)
- Después del preview, las cartas se voltean boca abajo

### 5.2 Mecánica de Juego

- El jugador selecciona **2 cartas** por turno
- **Match:** Mostrar 1 segundo → eliminar cartas → +1 acierto
- **No match:** Mostrar 1 segundo → voltear boca abajo
- Cada intento de par incrementa el contador de turnos

### 5.3 Fin del Juego

- El juego termina cuando se encuentran todos los pares
- Se muestra mensaje con total de turnos
- Opciones: **Repetir** (reinicia) o **Inicio** (va a home)

---

## 6. Routing y Navegación

| Ruta                | Componente          | Acceso    | Redirect si...               |
| ------------------- | ------------------- | --------- | ---------------------------- |
| `/login`            | LoginPage           | Público   | → `/game` si autenticado     |
| `/register`         | RegisterPage        | Público   | → `/game` si autenticado     |
| `/recover-password` | RecoverPasswordPage | Público   | -                            |
| `/game`             | GamePage            | Protegido | → `/login` si no autenticado |

---

## 7. Variables de Entorno

| Variable            | Descripción                  | Default                     |
| ------------------- | ---------------------------- | --------------------------- |
| `VITE_API_BASE_URL` | URL base del backend de auth | `http://localhost:8000/api` |

---

## 8. Dependencias Externas

### 8.1 Rick and Morty API

- **Tipo:** GraphQL
- **Endpoint:** `https://rickandmortyapi.com/graphql`
- **Rate Limit:** Sin autenticación requerida
- **Datos:** Personajes con id, nombre, imagen, status, especie

### 8.2 Backend de Autenticación

- **Tipo:** REST API
- **Auth:** Cookies HTTP-only
- **CORS:** Requiere `withCredentials: true`

---

## 9. Consideraciones de Seguridad

- Autenticación basada en cookies HTTP-only (no expuestas a JS)
- Validación de formularios con Zod en cliente
- Marcador de sesión en localStorage solo como flag, no contiene datos sensibles
- CORS configurado para endpoints específicos
