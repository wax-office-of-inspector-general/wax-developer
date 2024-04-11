---
title: Cliente de Juego
order: 2
---

# Tres en Raya: Cliente de Juego

Este contrato de tres en raya proporciona un ejemplo de cómo construir un juego en WAX, incluyendo el uso seguro de valores aleatorios para determinar los resultados del juego.

[Tutorial de Frontend en github.com](https://github.com/worldwide-asset-exchange/tic-tac-toe-front-end)

Esto te guiará sobre cómo hacer el contrato del juego Tictactoe que se ejecuta en la blockchain de Wax. La lógica del juego de tictactoe sigue el ejemplo de eosio en el tutorial de Tres en Raya de EOS, pero agregaremos más lógica que soporte aleatorizar el primer turno y movimientos de juego aleatorios si juegas contra un bot.


## Cómo Jugar

[Tres en Raya](https://tictactoe.wax.io/) es un juego clásico disfrutado por personas de todas las edades. Es simple de aprender pero puede ser sorprendentemente estratégico. Aquí tienes una guía paso a paso sobre cómo jugar:

1. **Configuración**: Haz clic en `Jugar Juego`
<img src="/assets/images/tutorials/tic-tac-toe/splash.png"/>
Y elige `Nuevo Juego`
<img src="/assets/images/tutorials/tic-tac-toe/new_game.png"/>

2. **Jugadores**: Tres en Raya se juega típicamente por dos jugadores. A un jugador se le asigna "X" y al otro "O".
<img src="/assets/images/tutorials/tic-tac-toe/new_game_popup.png"/>

3. **Objetivo**: El objetivo es ser el primero en crear una fila de tres de tus marcas (X's o O's) ya sea horizontal, vertical o diagonalmente.

4. **Jugabilidad**: Los jugadores se turnan para colocar su marca (X o O) en un cuadrado vacío en la cuadrícula.

5. **Turnos**: Al jugador asignado "X" generalmente va primero, seguido por el jugador asignado "O". Los jugadores continúan tomando turnos hasta que un jugador gana o la cuadrícula está llena (resultando en un empate).
<img src="/assets/images/tutorials/tic-tac-toe/playing_game.png"/>

6. **Ganar**: Un jugador gana el juego si logra crear una fila de tres de sus marcas ya sea horizontal, vertical o diagonalmente. Si un jugador logra esto, declara "¡Tres en Raya!" y es declarado ganador.

7. **Empates**: Si todos los cuadrados están llenos sin que ningún jugador logre tres en fila, el juego termina en un empate.
<img src="/assets/images/tutorials/tic-tac-toe/winner.png"/>

**Notas: El ganador del juego recibirá una recompensa de 10 tokens TIC (el token emitido por el juego)**

8. **Revancha**: Los jugadores pueden fácilmente comenzar un nuevo juego y empezar de nuevo.


## 🛠️ Tecnologías Utilizadas

- **Vite**: Eleva tu flujo de trabajo de desarrollo con Vite, un conjunto de herramientas diseñado para la creación rápida y eficiente de proyectos web.
- **Blockchain WAXP**: Adopta el espíritu descentralizado con la blockchain WAXP, fomentando interacciones de contratos inteligentes seguras y transparentes para experiencias de juego.
  

## 🚀 Cómo Empezar


Asegúrate de que se cumplan los siguientes requisitos previos antes de embarcarte en tu viaje:

```
Node.js (Versión: 16.16.0) o Yarn (Versión: 1.22.17) & npm (Versión: 9.6.7) instalados en tu máquina.
```

## 📋 Instalación y Configuración

1. **Clonar el Repositorio**:
```
git clone git@github.com:worldwide-asset-exchange/tic-tac-toe-front-end.git
```

2. **Navegar al Directorio del Proyecto**:
```
cd tic-tac-toe-front-end
```

3. **Instalar Dependencias**:
```
npm install
```
**O**
```
yarn
```

4. **Configurar Variables de Entorno**:
Crea un archivo `.env` con la siguiente configuración:
```env
VITE_PUBLIC_URL=http://localhost:5173
```

5. **Iniciar el Servidor de Desarrollo**:
```
npm run dev


```
**O**
```
yarn run dev
```

6. **Acceder y Participar**:
Navega a `http://localhost:5173` y sumérgete en la experiencia de Tres en Raya potenciada por blockchain.


## 🐳 Integración con Docker

Para configurar rápidamente un entorno de desarrollo se utiliza Docker.

### 🛠️ Construir y Lanzar Contenedores

Ejecuta el siguiente comando en tu terminal dentro del directorio del proyecto:
```
docker-compose up --build
```

Accede a tu aplicación en `http://localhost:5173` (o el puerto designado como se especifica en tu [docker-compose.yml](docker-compose.yml)).

### 🛑 Terminar Contenedores

Para detener y remover los contenedores de manera ordenada, ejecuta:
```
docker-compose down
```