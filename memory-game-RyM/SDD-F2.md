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
