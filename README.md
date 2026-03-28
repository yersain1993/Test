
# Software Design Document (SDD) - Memory Game: Rick and Morty

---

## 1. Introducción

### 1.1 Propósito
Este documento describe el diseño técnico y la estrategia de desarrollo del juego de memoria basado en personajes de Rick and Morty. El objetivo es proporcionar una guía clara sobre la arquitectura, las decisiones tecnológicas y la experiencia de usuario.

### 1.2 Alcance
Aplicación web SPA (Single Page Application) responsiva que permite a usuarios autenticados jugar un juego de memoria. Incluye un sistema de autenticación seguro, consumo de API externa mediante GraphQL y una gestión de estado optimizada.

---

## 2. Enfoque de Desarrollo

### 2.1 Experiencia de Usuario (UX)
El enfoque principal es el **feedback constante**. La interfaz busca ser amigable mediante:
- **Validaciones Inline:** Mensajes de error en tiempo real en los formularios de `LoginPage` y `RegisterPage` usando Zod.
- **Flujos Intuitivos:** Redirección automática tras el registro y estados visuales claros (ej. deshabilitar botones durante el juego).
- **Indicadores de Carga:** Uso de un *Loader* personalizado (Rick giratorio) para reducir la percepción de latencia.
- **Feedback de Partida:** Pantalla de `Game Over` con estadísticas detalladas (turnos y aciertos) para dar cierre a la experiencia de juego.

### 2.2 Interfaz de Usuario (UI)
- **Diseño Adaptativo (PWA):** La web app es totalmente responsiva, permitiendo una experiencia cómoda tanto en escritorio como en dispositivos móviles.
- **Estética Coherente:** Se implementaron ligeras variantes a la maqueta original en las secciones de Registro y Fin del Juego para mejorar la composición visual, utilizando Tailwind CSS v4 para una gestión de estilos moderna y eficiente.

---

## 3. Arquitectura del Sistema

### 3.1 Stack Tecnológico

| Categoría | Tecnología | Razón Principal |
| :--- | :--- | :--- |
| **Framework** | React 19 | Uso de las últimas mejoras en concurrencia y hooks. |
| **Estado (Auth)** | React Context | Ideal para datos transversales y simples (sesión). |
| **Estado (Game)** | Zustand | Ligero, sin boilerplate, perfecto para lógica de juegos. |
| **Estilos** | Tailwind CSS v4 | Enfoque CSS-first y alto rendimiento. |
| **Validación** | Zod + Hook Form | Tipado fuerte en esquemas de formularios. |
| **Animaciones** | Framer Motion | Gestión sencilla de estados de salida y animaciones 3D (Flip). |
| **API** | Axios + GraphQL | Manejo de errores simplificado y eficiencia en datos. |

### 3.2 Diagrama de Alto Nivel

```text
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│   │ Auth Module  │    │ Game Module  │    │ Shared Module│  │
│   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘  │
│          └────────────────────┼──────────────────┘          │
│                               │                             │
│                ┌──────────────┴──────────────┐              │
│                │     State Management        │              │
│                │   (Context + Zustand)       │              │
│                └──────────────┬──────────────┘              │
└───────────────────────────────┼─────────────────────────────┘
                                │
            ┌───────────────────┼───────────────────┐
            │                   │                   │
            ▼                   ▼                   ▼
    ┌───────────────┐   ┌──────────────────┐   ┌───────────────┐
    │ Auth Backend  │   │ Rick & Morty API │   │ LocalStorage  │
    │   (REST API)  │   │    (GraphQL)     │   │ (session flag)│
    │   :8000/api   │   │                  │   │               │
    | JWT + Cookies |   |                  |   |               | 
    └───────────────┘   └──────────────────┘   └───────────────┘
```

---

## 4. Decisiones Técnicas y Razonamiento

### 4.1 Gestión de Estado: Zustand vs. Redux
Para la lógica del juego se optó por **Zustand**. A diferencia de Redux, permite manejar flujos reactivos de manera mínima y directa. Siendo el juego un aplicativo de escala pequeña/mediana, Zustand reduce el código necesario (boilerplate) y facilita las transiciones rápidas de estado (ej. voltear cartas).

### 4.2 Autenticación Segura y Persistencia
- **Cookies HTTP-only:** Se prefieren sobre `localStorage` para almacenar el JWT debido a su resistencia contra ataques XSS.
- **Manejo de Sesión:** Se utiliza un flag en `localStorage` (`auth.session.active`) únicamente para decidir si el cliente debe intentar un `refresh` de sesión al cargar la app, evitando el parpadeo (flicker) entre rutas protegidas.
- **Screaming Architecture:** La estructura de carpetas por "features" (auth, game) permite que el código sea autodescriptivo y escalable.

### 4.3 Comunicación con APIs
- **GraphQL:** Se utiliza para la API de Rick and Morty para evitar el *overfetching*. Se solicita exclusivamente el ID, nombre, imagen, estatus y especie de 6 personajes para formar los 6 pares (12 cartas).
- **Axios:** Elegido sobre `fetch` por su capacidad de lanzar errores automáticamente en códigos 4xx/5xx y la transformación automática de JSON, lo que simplifica la lógica de los servicios.

---

## 5. Diseño de Componentes y Lógica

### 5.1 El Store del Juego (Máquina de Estados)
El juego se razona como una máquina de estados para evitar comportamientos inválidos:
- **`idle`**: Tablero cargado, esperando acción del usuario.
- **`preview`**: Las cartas se muestran durante **3 segundos** para memorización (clicks bloqueados).
- **`playing`**: Se permite la interacción.
- **`finished`**: Condición de victoria alcanzada (`matches === totalPairs`).

### 5.2 Diagrama de Ciclo de Vida del Juego

```text
┌─────────┐   initGame()   ┌─────────┐   startGame()   ┌─────────┐
│  idle   │ ─────────────► │  idle   │ ───────────────►│ preview │
└─────────┘                └─────────┘                 └────┬────┘
                                                             │ 3s
                                                             ▼
                                                        ┌─────────┐
                                                        │ playing │
                                                        └────┬────┘
                                                             │
                           flipCard(uid) + evaluación 1s     │
                                                             ▼
                                                        ┌─────────┐
                                                        │finished │
                                                        └─────────┘
```

### 5.3 Reglas de Negocio Implementadas
- **Selección:** Máximo 2 cartas por turno.
- **Evaluación:** Delay de **1 segundo** tras abrir la segunda carta para permitir feedback visual antes de ocultarlas o marcarlas como "match".
- **Protección:** No se puede interactuar con cartas ya emparejadas o que ya estén volteadas.

---

## 6. Flujos de Datos

### 6.1 Flujo de Login y Rehidratación

```text
Usuario               LoginCard             useAuth/login         apiClient            Backend
  │                      │                      │                    │                    │
  │── email/password ───▶│                      │                    │                    │
  │                      │── submit() ─────────▶│                    │                    │
  │                      │                      │── POST /auth/login ────────────────▶    │
  │                      │                      │                    │◀── Set-Cookie ────│
  │                      │                      │◀── result ─────────│                    │
  │                      │── onSuccess() ──────▶│ setUser + marker   │                    │
  │◀──── redirect /game ─│                      │                    │                    │
```

---

## 7. Routing y Seguridad

| Ruta | Componente | Acceso | Redirect si... |
| :--- | :--- | :--- | :--- |
| `/login` | `LoginPage` | Público | `/game` si ya hay sesión activa. |
| `/game` | `GamePage` | Protegido | `/login` si no hay sesión. |

- **Seguridad:** El `ProtectedRoute` verifica el estado del `UserContext` antes de renderizar el módulo del juego.
- **CORS:** Configurado estrictamente para el dominio del frontend con `withCredentials: true` para permitir el flujo de cookies.

---

## 8. Consideraciones Finales
- **Rendimiento:** Las imágenes se cargan mediante la URL de la API oficial, optimizadas por el navegador.
- **Mantenimiento:** La separación de servicios (`authSessionService`, `loginService`, etc.) asegura que los cambios en la API no afecten la UI directamente.
- **Escalabilidad:** El sistema de variantes del componente `Button` permite añadir nuevos estilos fácilmente sin duplicar lógica.

---

## 9. Estrategia de Testing (Frontend `memory-game-RyM`)

El frontend incorpora testing con **Vitest + React Testing Library** para cubrir la logica critica:

- **Utilidades puras:** `buildShuffledCards` (duplicado de pares + shuffle Fisher-Yates).
- **Store de juego (Zustand):** transiciones de estado, reglas de `flipCard`, turnos, matches y `resetGame`.
- **Hook de juego:** `useCharacters` (flujo exitoso, error y delegacion de `startGame`).
- **Servicio API:** `fetchCharacters` con mocks de Axios y validacion de transformacion de respuesta.
- **Formulario de registro:** `RegisterCard` con validacion Zod, errores de backend y flujo exitoso.

### Setup global de tests

En `memory-game-RyM/vitest.setup.ts` se configuro:

- `@testing-library/jest-dom`.
- Limpieza del DOM tras cada test.
- Limpieza/restauracion de mocks (`vi.clearAllMocks`, `vi.restoreAllMocks`).
- Reset del estado global de `useGameStore` (Zustand) en cada test para evitar contaminacion entre suites.

### Timers en pruebas

- No se fuerzan timers falsos globalmente.
- Solo las suites de juego usan `vi.useFakeTimers()` para avanzar los delays de 3s (preview) y 1s (evaluacion) sin esperar tiempo real.

### Cobertura

La cobertura esta focalizada en modulos criticos del frontend:

- `src/features/game/utils/buildShuffleCards.ts`
- `src/features/game/store/useGameStore.ts`
- `src/features/game/hooks/useCharacters.ts`
- `src/features/game/services/rickAndMortyService.ts`
- `src/features/auth/components/RegisterCard.tsx`

---

# INSTRUCCIONES DE USO - Memory Game + Server Authenticator

Guia rapida para ejecutar y usar el aplicativo completo.

## 1. Requisitos

- Node.js 18+
- npm
- Dos terminales abiertas

## 2. Orden correcto de arranque

Importante: **primero debe correr `server-authenticator`**.  
Si el backend no esta activo, el login/registro del juego no funcionara.

## 3. Configurar y ejecutar backend (`server-authenticator`)

1. Ir a la carpeta:

```bash
cd server-authenticator
```

2. Crear `.env` (puedes copiar `.env.example`) con al menos:

```env
ACCESS_SECRET=your_access_secret
REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d
PORT=8000
CORS_ORIGIN=http://localhost:5173
```

3. Instalar y ejecutar:

```bash
npm install
npm run dev
```

4. Verificar que el servidor este activo en:

```text
http://localhost:8000
```

## 4. Configurar y ejecutar frontend (`memory-game-RyM`)

1. En otra terminal, ir a la carpeta:

```bash
cd memory-game-RyM
```

2. Crear `.env` con:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

3. Instalar y ejecutar:

```bash
npm install
npm run dev
```

4. (Opcional) Ejecutar tests del frontend:

```bash
npm run test
npm run test:watch
npm run test:coverage
```

5. Abrir la URL que muestre Vite (normalmente):

```text
http://localhost:5173
```

## 5. Flujo de uso del aplicativo

1. Entrar a la app.
2. Registrarse en `/register`.
3. Iniciar sesion en `/login`.
4. Ir a `/game` y presionar **Inicio** para comenzar partida.
5. Al finalizar:
- **Repetir**: reinicia el tablero.
- **Inicio**: cierra sesion y vuelve al flujo publico.

## 6. Comprobaciones rapidas si algo falla

- Si no puedes iniciar sesion: confirma que backend sigue corriendo en `:8000`.
- Si hay errores CORS/cookies: valida `CORS_ORIGIN=http://localhost:5173` en backend.
- Si frontend no conecta al backend: valida `VITE_API_BASE_URL=http://localhost:8000/api`.
- Si reinicias backend, los usuarios se pierden (repositorio en memoria): vuelve a registrarte.
