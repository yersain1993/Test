# Spec-Driven Development (SDD)

## Memory Game - Rick and Morty

Este documento define las especificaciones que guían el desarrollo. Cada feature incluye criterios de aceptación verificables y tareas de implementación.

---

## Feature 1: Autenticación de Usuario

### 1.1 Login

**Como** usuario registrado
**Quiero** iniciar sesión con email y contraseña
**Para** acceder al juego

#### Criterios de Aceptación

- [ ] El formulario valida email con formato correcto
- [ ] El formulario requiere contraseña mínimo 8 caracteres
- [ ] Muestra errores de validación inline bajo cada campo
- [ ] Muestra estado de carga en el botón durante request
- [ ] Redirige a `/game` tras login exitoso
- [ ] Muestra mensaje de error si credenciales son inválidas
- [ ] Usuario autenticado que visita `/login` es redirigido a `/game`

#### Tareas

- [ ] Crear `LoginCard` con react-hook-form
- [ ] Definir `loginSchema` con Zod
- [ ] Implementar `loginService` con manejo de errores
- [ ] Integrar con `UserContext` para actualizar estado
- [ ] Agregar redirect en `LoginPage` si ya autenticado

---

### 1.2 Registro

**Como** usuario nuevo
**Quiero** crear una cuenta
**Para** poder jugar

#### Criterios de Aceptación

- [ ] El formulario requiere: nombre, email, contraseña, confirmar contraseña
- [ ] Valida que las contraseñas coincidan
- [ ] Muestra errores de validación inline
- [ ] Redirige a `/game` tras registro exitoso
- [ ] Muestra error si el email ya está registrado

#### Tareas

- [ ] Crear `RegisterCard` con react-hook-form
- [ ] Definir `registerSchema` con Zod (incluir confirmación)
- [ ] Implementar `registerService`
- [ ] Manejar error de email duplicado

---

### 1.3 Persistencia de Sesión

**Como** usuario autenticado
**Quiero** mantener mi sesión al recargar la página
**Para** no tener que iniciar sesión cada vez

#### Criterios de Aceptación

- [ ] La sesión persiste tras recargar la página
- [ ] Si la cookie expira, redirige a login
- [ ] El logout limpia la sesión completamente

#### Tareas

- [ ] Implementar `getSession` service
- [ ] Guardar marcador en localStorage al login
- [ ] Verificar sesión en `UserProvider` al montar
- [ ] Implementar `logout` con limpieza de estado

---

## Feature 2: Juego de Memoria

### 2.1 Carga de Personajes

**Como** jugador
**Quiero** ver personajes de Rick and Morty como cartas
**Para** jugar con contenido de la serie

#### Criterios de Aceptación

- [ ] Se cargan personajes desde la API GraphQL
- [ ] Cada personaje aparece exactamente 2 veces (par)
- [ ] Se muestran mínimo 6 pares (12 cartas)
- [ ] Las cartas muestran imagen y nombre del personaje
- [ ] Muestra estado de carga mientras obtiene datos
- [ ] Muestra error si falla la carga con opción de reintentar

#### Tareas

- [ ] Implementar `fetchCharacters` con GraphQL query
- [ ] Crear hook `useCharacters` con estados loading/error
- [ ] Duplicar personajes para crear pares
- [ ] Crear componente `CharacterCard`

---

### 2.2 Inicio del Juego

**Como** jugador
**Quiero** que las cartas se barajen y muestren brevemente
**Para** memorizar sus posiciones

#### Criterios de Aceptación

- [ ] Las cartas se barajan aleatoriamente cada partida
- [ ] Todas las cartas se muestran boca arriba por 3 segundos
- [ ] Después de 3 segundos, todas se voltean boca abajo
- [ ] Durante el preview, no se pueden seleccionar cartas
- [ ] El contador de turnos inicia en 0

#### Tareas

- [ ] Implementar `shuffleCards` utility
- [ ] Agregar estado `preview` en game store
- [ ] Implementar timer de 3 segundos
- [ ] Bloquear interacción durante preview
- [ ] Animar transición de preview a playing

---

### 2.3 Selección de Cartas

**Como** jugador
**Quiero** voltear cartas para encontrar pares
**Para** avanzar en el juego

#### Criterios de Aceptación

- [ ] Click en carta la voltea con animación
- [ ] Solo se pueden voltear 2 cartas por turno
- [ ] No se puede voltear una carta ya emparejada
- [ ] No se puede voltear la misma carta dos veces
- [ ] La animación de volteo usa efecto 3D (flip)

#### Tareas

- [ ] Implementar `flipCard` action en store
- [ ] Crear `FlipAnimation` con Framer Motion
- [ ] Validar máximo 2 cartas volteadas
- [ ] Deshabilitar cartas emparejadas

---

### 2.4 Comparación de Cartas

**Como** jugador
**Quiero** que el juego compare las cartas seleccionadas
**Para** saber si encontré un par

#### Criterios de Aceptación

- [ ] Al voltear 2 cartas, se comparan automáticamente
- [ ] **Match:** Las cartas permanecen visibles 1 segundo, luego se eliminan/ocultan
- [ ] **No match:** Las cartas permanecen visibles 1 segundo, luego se voltean
- [ ] El contador de turnos incrementa en 1 por cada intento
- [ ] El contador de aciertos incrementa en 1 por cada match

#### Tareas

- [ ] Implementar `checkMatch` action
- [ ] Agregar delay de 1 segundo antes de resolver
- [ ] Actualizar `matchedPairs` en match
- [ ] Incrementar `turns` en cada comparación
- [ ] Bloquear nuevas selecciones durante comparación

---

### 2.5 Fin del Juego

**Como** jugador
**Quiero** ver mi resultado al completar el juego
**Para** conocer mi desempeño

#### Criterios de Aceptación

- [ ] El juego detecta cuando todos los pares están encontrados
- [ ] Se muestra modal/mensaje con el total de turnos
- [ ] El botón "Repetir" reinicia el juego con nuevas cartas barajadas
- [ ] El botón "Inicio" redirige a la página principal
- [ ] Los botones usan las variantes `play` y `home` respectivamente

#### Tareas

- [ ] Detectar condición de victoria (all pairs matched)
- [ ] Cambiar status a `finished`
- [ ] Crear componente `GameOverModal`
- [ ] Implementar `resetGame` action
- [ ] Conectar navegación a home

---

## Feature 3: UI/UX

### 3.1 Layout Responsivo

**Como** jugador
**Quiero** jugar en cualquier dispositivo
**Para** tener una buena experiencia

#### Criterios de Aceptación

- [ ] Grid de cartas se adapta a pantallas móviles
- [ ] Cartas mantienen proporción cuadrada
- [ ] Botones son touch-friendly (min 44px altura)
- [ ] Texto es legible en todos los tamaños

#### Tareas

- [ ] Definir breakpoints para grid (sm, md, lg)
- [ ] Usar Tailwind responsive utilities
- [ ] Testear en viewport móvil (375px)

---

### 3.2 Feedback Visual

**Como** jugador
**Quiero** feedback visual en mis acciones
**Para** entender el estado del juego

#### Criterios de Aceptación

- [ ] Hover en cartas muestra indicador de interactividad
- [ ] Cartas emparejadas tienen estilo distintivo
- [ ] Botones tienen estados hover, active, disabled
- [ ] Loading states son claros y no bloquean toda la UI

#### Tareas

- [ ] Agregar hover states a `CharacterCard`
- [ ] Estilizar cartas matched (opacity, scale, o remove)
- [ ] Verificar Button variants tienen todos los estados

---

## Checklist de Desarrollo

### Pre-desarrollo

- [ ] Configurar variables de entorno (`.env.local`)
- [ ] Verificar conexión con backend de auth
- [ ] Verificar conexión con Rick and Morty API

### Testing Manual

- [ ] Flujo completo de registro → login → juego → logout
- [ ] Juego completo hasta victoria
- [ ] Refresh de página mantiene sesión
- [ ] Responsive en móvil

### Pre-deploy

- [ ] `npm run build` sin errores
- [ ] `npm run lint` sin warnings
- [ ] Variables de producción configuradas
