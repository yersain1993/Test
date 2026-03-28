# Software Design Document (SDD)

## Memory Game - Rick and Morty

Version: 1.1  
Fecha: 2026-03-27

---

## 1. Introduccion

### 1.1 Proposito

Definir el diseño tecnico del frontend `memory-game-RyM`: arquitectura, componentes, flujos, estado y dependencias.

### 1.2 Alcance

Aplicacion SPA que implementa:

- Autenticacion de usuario (registro, login, refresh, logout).
- Memory game con personajes de Rick and Morty.
- Control de acceso a rutas protegidas.

### 1.3 Tecnologias

| Categoria | Tecnologia |
| --- | --- |
| Framework UI | React 19 |
| Lenguaje | TypeScript |
| Build tool | Vite 8 |
| Routing | React Router DOM 7 |
| Formularios | React Hook Form + Zod |
| Estado auth | React Context |
| Estado juego | Zustand |
| HTTP | Axios |
| Estilos | Tailwind CSS v4 |
| Animaciones | Framer Motion |

---

## 2. Arquitectura del sistema

### 2.1 Vista de alto nivel

- Capa de presentacion: componentes y paginas React.
- Capa de estado:
- `UserContext` para autenticacion.
- `useGameStore` (Zustand) para estado del juego.
- Capa de datos:
- Backend auth via REST (`/auth/*`).
- Rick and Morty API via GraphQL.

### 2.2 Estructura de modulos

```text
src/
  features/
    auth/
      api/axiosInstance.ts
      context/userContext.ts
      services/{loginService,registerService,authSessionService}.ts
      components/{LoginCard,RegisterCard}.tsx
      pages/{LoginPage,RegisterPage}.tsx
      schemas/registerSchema.ts
      types/
      utils/
    game/
      store/useGameStore.ts
      hooks/useCharacters.ts
      services/rickAndMortyService.ts
      components/{GridCard,GameOver,game-card/*}.tsx
      animations/cards-animations/*
      utils/buildShuffleCards.ts
      types/character.ts
  shared/
    components/ui/{Layout,Button,Loader,PasswordVisibilityButton}.tsx
    utils/{mergeClassNames,index}.ts
```

### 2.3 Enrutamiento

Definido en `src/App.tsx`.

| Ruta | Tipo | Comportamiento |
| --- | --- | --- |
| `/` | Redirect | Redirige a `/game` |
| `/login` | Publica | Si autenticado, redirige a `/game` |
| `/register` | Publica | Si autenticado, redirige a `/game` |
| `/game` | Protegida | Si no autenticado, redirige a `/login` |
| `*` | Fallback | Redirige a `/login` |

---

## 3. Diseño de autenticacion

### 3.1 Contexto de usuario

Archivo: `src/features/auth/context/userContext.ts`

Contrato principal:

```ts
type UserContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  logout: () => Promise<void>;
  bootstrapSession: () => Promise<void>;
};
```

Responsabilidades:

- Gestionar usuario autenticado en memoria.
- Exponer `isAuthenticated` y `isLoading` para guards de ruta.
- Rehidratar sesion al cargar la aplicacion.
- Limpiar estado al cerrar sesion.

### 3.2 Persistencia de sesion

- No se guardan tokens en frontend.
- Se usa marcador local: `auth.session.active` (valor `1`).
- Si existe el marcador al iniciar:
- Se llama `POST /auth/refresh`.
- Si devuelve usuario, se mantiene sesion.
- Si falla, se elimina marcador y se limpia usuario.

### 3.3 Servicios de auth

| Servicio | Endpoint | Metodo | Resultado |
| --- | --- | --- | --- |
| `loginWithCredentials` | `/auth/login` | POST | `LoginResult` |
| `registerUser` | `/auth/register` | POST | `RegisterResult` |
| `refreshSession` | `/auth/refresh` | POST | `AuthUser | undefined` |
| `logoutSession` | `/auth/logout` | POST | `void` |

Cliente HTTP:

- `apiClient` con `baseURL = VITE_API_BASE_URL`.
- `withCredentials: true` habilitado para cookies.

### 3.4 Validacion de formularios

- Login: validacion basica con `react-hook-form`.
- Register: `registerSchema` (Zod) con reglas:
- email valido.
- password minimo 8 caracteres.
- confirmacion igual a password.

---

## 4. Diseño del juego

### 4.1 Modelo de datos

Archivo: `src/features/game/types/character.ts`

```ts
interface Character {
  id: string;
  name: string;
  image: string;
  status: string;
  species: string;
}

interface Card {
  uid: string;
  characterId: string;
  name: string;
  image: string;
  status: string;
  species: string;
  isFlipped: boolean;
  isMatched: boolean;
}

type GameStatus = 'idle' | 'preview' | 'playing' | 'finished';
```

### 4.2 Estado global del juego

Archivo: `src/features/game/store/useGameStore.ts`

Estado:

- `characters`, `cards`, `flippedCards`
- `turns`, `matches`, `status`

Acciones:

- `initGame(characters)`
- `startGame()`
- `flipCard(uid)`
- `resetGame()`
- `setStatus(status)`

Reglas implementadas:

- Solo se permite voltear cartas en estado `playing`.
- Maximo 2 cartas activas en `flippedCards`.
- Comparacion por `characterId`.
- Resolucion de turno a 1 segundo (match/no match).
- Fin de juego cuando `matches === cards.length / 2`.

### 4.3 Ciclo de vida

1. `useCharacters` obtiene personajes y ejecuta `initGame`.
2. Usuario pulsa boton de inicio y se ejecuta `startGame`.
3. Estado pasa a `preview` por 3 segundos.
4. Estado pasa a `playing`.
5. Usuario juega turnos hasta `finished`.
6. En `finished`, UI muestra `GameOver` con opciones:
- `Repetir` (`resetGame`).
- `Inicio` (`logout`).

### 4.4 Carga de personajes

Archivo: `src/features/game/services/rickAndMortyService.ts`

- Endpoint GraphQL: `https://rickandmortyapi.com/graphql`
- Query `GetCharacters(page)`.
- Se extraen personajes y se aplica `slice(0, limit)`.
- `useCharacters` solicita `limit = 6` y `page` aleatoria entre 1 y 5.

### 4.5 Mezcla de cartas

Archivo: `src/features/game/utils/buildShuffleCards.ts`

- Duplica cada personaje en dos cartas (`_a`, `_b`).
- Aplica algoritmo Fisher-Yates para orden aleatorio.

---

## 5. Componentes UI clave

### 5.1 Layout

- Wrapper visual global.
- Muestra header solo si `isAuthenticated` es verdadero.

### 5.2 Button

Variantes soportadas:

- `submit`
- `play`
- `home`
- `disabled`

Propiedades destacadas:

- `isLoading`
- `disabled`
- `variant`

### 5.3 GridCard

- Renderiza estado de carga (`Loader`), tablero o pantalla final (`GameOver`).
- Usa store de juego para `cards` y `status`.

---

## 6. Flujos

### 6.1 Login

1. Usuario completa formulario en `LoginCard`.
2. `useAuth().login()` llama `loginWithCredentials`.
3. Si es exitoso:
- Guarda `auth.session.active=1`.
- Actualiza `user` en contexto.
- Navega a `/game`.
4. Si falla, muestra mensaje de error en UI.

### 6.2 Registro

1. Usuario completa `RegisterCard`.
2. Se valida con Zod.
3. `registerUser` llama `POST /auth/register`.
4. Si es exitoso, muestra confirmacion y navega a `/login`.

### 6.3 Bootstrap de sesion

1. `UserProvider` se monta en `main.tsx`.
2. Ejecuta `bootstrapSession()`.
3. Si existe marcador local, llama refresh.
4. Actualiza estado de autenticacion y carga.

---

## 7. Seguridad

- Tokens solo en cookies `httpOnly`.
- Frontend nunca persiste tokens.
- Validaciones de formulario del lado cliente (Zod) como primera barrera UX.
- El estado local solo guarda un flag de existencia de sesion previa.

---

## 8. Configuracion

### 8.1 Variable de entorno

| Variable | Uso | Default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Base URL del backend auth | `http://localhost:8000/api` |

### 8.2 Scripts del proyecto

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
- `npm run format`

---

## 9. Riesgos y mejoras sugeridas

- El store usa `setTimeout`; podria centralizarse la limpieza en un mecanismo cancelable para evitar efectos colgantes en escenarios de desmontaje.
- En `GridCard` existe un `console.log(status)` que conviene retirar para produccion.
- Faltan pruebas unitarias/integracion en auth y game store.
