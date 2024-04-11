---
title: Contrato Inteligente
order: 3
---

# Tres en Raya: Contrato Inteligente

Este contrato de tres en raya proporciona un ejemplo de cómo construir un juego en WAX, incluyendo el uso seguro de valores aleatorios para determinar los resultados del juego.

Esta guía te mostrará cómo crear el contrato del juego de Tictactoe que se ejecuta en la blockchain de Wax. La lógica del juego de tictactoe sigue el ejemplo de eosio en el [tutorial del Juego Tres en Raya de EOS](https://developers.eos.io/welcome/v2.1/tutorials/tic-tac-toe-game-smart-contract-single-node), pero agregaremos más lógica que soporte aleatorizar el primer turno y movimientos aleatorios del juego si se juega contra un bot.

[Tutorial de Contrato Inteligente en github.com](https://github.com/worldwide-asset-exchange/tic-tac-toe)

### Lo que aprenderás
- [Cómo Funciona el Juego](/es/build/tutorials/tic-tac-toe-game/client.html#how-to-play)
- [Flujo de Desarrollo](#flujo-de-desarrollo)
  - [Prerrequisitos](#prerrequisitos)
  - [Construir y Probar](#construir-y-probar)
  - [Despliegue](#despliegue)
- [Implementación del Contrato del Juego](#implementación-del-contrato-del-juego)
  - [Lógica del Juego](#lógica-del-juego)
  - [Entendiendo el Juego](#entendiendo-el-juego)
  - [Contrato Inteligente Tres en Raya](#contrato-inteligente-tres-en-raya)
  - [Acciones del Contrato](#acciones-del-contrato)
    - [Solicitud de Valores Aleatorios](#solicitando-valores-aleatorios)
    - [Acción de Movimiento](#acción-de-movimiento)
- [Uso del Contrato de Token](#uso-del-contrato-de-token)
- [Emisión de Recompensas de Tokens](#emisiones-de-recompensas-de-tokens)

## Flujo de Desarrollo
&nbsp;

### 1. Prerrequisitos
  - https://github.com/AntelopeIO/cdt: Kit de herramientas de desarrollo de contratos para desarrollar el contrato.
  - https://github.com/AntelopeIO/leap: Incluye la herramienta de línea de comandos **cleos** para interactuar con la blockchain.
  - Node.js (Versión: 16.16.0) o Yarn (Versión: 1.22.17) y npm (Versión: 9.6.7) instalados en tu máquina.

### 2. Construir y Probar
```sh
    make build
    npm run test
```

### 3. Despliegue

1. Crear nuevas cuentas para los contratos tictactoe y tic.token

```sh
    cleos system newaccount eosio tictactoe EOS79McmuaymB8tPJmMVqUAjbbfLKBv5D13aVpgPXcZEdLYMQBL2b EOS79McmuaymB8tPJmMVqUAjbbfLKBv5D13aVpgPXcZEdLYMQBL2b --stake-net "10.00000000 WAX" --stake-cpu "10.00000000 WAX" --buy-ram-bytes 559700 -p eosio
    cleos system newaccount eosio tic.token EOS79McmuaymB8tPJmMVqUAjbbfLKBv5D13aVpgPXcZEdLYMQBL2b EOS79McmuaymB8tPJmMVqUAjbbfLKBv5D13aVpgPXcZEdLYMQBL2b --stake-net "10.00000000 WAX" --stake-cpu "10.00000000 WAX" --buy-ram-bytes 559700 -p eosio
```

2. Desplegar el juego y el token

```sh
    cleos set contract tictactoe ./build tictactoe.wasm tictactoe.abi -p tictactoe@active
    cleos set contract tic.token ./build token.wasm token.abi -p tic.token@active
    cleos set account permission tictactoe active --add-code
    cleos set account permission tic.token active --add-code
```

3. Iniciar juego

```sh
    cleos push action tictactoe init '[]' -p tictactoe@active
```

4. Acuñar token para el contrato del juego

```sh
cleos push action tic.token create '["tictactoe","1000000.0000 TIC"]' -p tic.token@active
cleos push action tic.token issue '["tictactoe","1000000.0000 TIC","issue token"]' -p tictactoe@active
```

## Implementación del Contrato del Juego
&nbsp;

### 1. Lógica del Juego
  - El jugador puede crear el juego en uno de dos modos: jugador contra jugador o jugador contra bot
  - El tablero del juego es un rectángulo de 3x3
  - El primer movimiento será aleatorio por contrato
  - El primer jugador en completar una fila o diagonal de X's o O's gana el juego.
  - Al jugar con un bot, el contrato llamará al contrato orgn.wax para obtener un número aleatorio
  - El ganador del juego recibirá una recompensa de 10 tokens TIC (el token emitido por el juego)

### 2. Entendiendo el Juego
Para un juego básico como tictactoe, podemos visualizar que el juego tendría estas acciones:
- create: crear un nuevo juego
- move: movimiento por un usuario si es su turno
- close: limpiar el juego por el anfitrión
- restart: reiniciar el juego

La lógica del juego seguirá los siguientes diagramas:

- Creando un nuevo juego:
  
  <img src="/assets/images/tutorials/tic-tac-toe/tictactoe-new.png"/>


- Modo Jugador contra Jugador:
  
  <img src="/assets/images/tutorials/tic-tac-toe/tictactoe-pvp.png"/>

- Jugador contra Bot:
  
  <img src="/assets/images/tutorials/tic-tac-toe/tictactoe-bot.png"/>


### 3. Contrato Inteligente Tres en Raya
Sumerjámonos en cómo podemos implementar estas acciones en el contrato inteligente de tres en raya.

El contrato inteligente tendrá el [archivo de encabezado tictactoe.hpp](https://github.com/worldwide-asset-exchange/tic-tac-toe/tree/master/include/tictactoe.hpp) y el [archivo de implementación tictactoe.cpp](https://github.com/worldwide-asset-exchange/tic-tac-toe/tree/master/include/tictactoe.cpp).

Coloquemos estas declaraciones en el archivo de encabezado, estas son las acciones principales de nuestro contrato inteligente:

```cpp
  ACTION init();
  ACTION create(const name &challenger,const name &host);
  ACTION restart(uint64_t game_id, const name &by);
  ACTION close(uint64_t game_id);
  ACTION move(uint64_t game_id, const name &by, const uint16_t &row, const uint16_t &column);
```

y la tabla de juego para almacenar los datos del juego:
```cpp
 TABLE game
  {
    static constexpr uint16_t boardWidth = 3;
    static constexpr uint16_t boardHeight = boardWidth;

    uint64_t id;
    name challenger;
    name host;
    name turn;
    name winner = "none"_n;
    std::vector<uint8_t> board;
    uint64_t primary_key() const { return id; }

    void initializeBoard() { board.assign(boardWidth * boardHeight, 0); }

    void resetGame()
    {
      initializeBoard();
      turn = host;
      winner = "none"_n;
    }
  };
  typedef multi_index<"games"_n, game> games;

```

Aquí podemos ver la estructura de datos para almacenar el juego. Cada juego tendrá un 'host', el jugador que crea el juego, 'challenger' el otro jugador y un 'tablero' que almacena todos los movimientos. Otras variables aquí son 'turn' para indicar qué jugador puede mover ahora, y 'winner' para almacenar el resultado del juego.

El tablero de juego es un arreglo bidimensional, pero en la tabla del juego usaremos una dimensión para representar el tablero. Por ejemplo, este tablero:

| Fila  | 0 | 1 | 2 |
|------|---|---|---|
|   0  | 1 | 2 | 1 |
|   1  | 1 | 2 | 2 |
|   2  | 2 | 1 | 1 |

Será representado como `[1, 2, 1, 1, 2, 2, 2, 1, 1]`.

### Acciones del Contrato:

- init(): Esta acción se utiliza para inicializar la tabla y el singleton en el contrato inteligente. Necesitamos llamar a esta acción justo después del despliegue para que el contrato tenga los datos iniciales que queremos.
- create(): Esta acción inicia un nuevo juego y crea un nuevo arreglo para el tablero del juego. La acción de crear tendrá parámetros que permiten al host elegir al desafiante. Definimos que cuando el desafiante es el nombre tiactactoe (el propio nombre del contrato) entonces el host quiere jugar con el bot.
- restart(): Esta acción limpia los datos de un arreglo de tablero de juego existente.
- close(): Esta acción elimina y remueve los datos de juego existentes y libera cualquier almacenamiento que el juego utilice.
- move(): Esta acción coloca un marcador en el tablero del juego y actualiza el arreglo del tablero del juego.

#### Solicitando Valores Aleatorios

Hablamos sobre usar números aleatorios del contrato orng.wax para aleatorizar quién toma el primer turno. Para hacer eso, en la acción create() para crear un juego, tendremos que hacer una llamada al contrato orng.wax:

```cpp
   action(
        {get_self(), "active"_n},
        "orng.wax"_n, "requestrand"_n,
        std::tuple(game_id, turn_count, get_self()))
        .send();        
```

Esta acción envía un comando **requestrand** al contrato orng.wax, luego esperaremos la devolución de llamada para obtener nuestro número aleatorio.

La declaración de requestrand en orng.wax es la siguiente. Pasaremos el game_id como assoc_id ya que este valor estará en la devolución de llamada y nos permitirá saber qué game_id correspondiente necesita el número aleatorio.

```cpp
ACTION orng::requestrand(uint64_t assoc_id,
                         uint64_t signing_value,
                         const name& caller)
```

La devolución de llamada invocará una acción predefinida en nuestro contrato, que es **receiverand**. Tenemos que implementar esta acción con la interfaz correcta para permitir la devolución de llamada de orng.wax en nuestro contrato:

```cpp
void tictactoe::receiverand(uint64_t assoc_id, const eosio::checksum256 &random_value)
{
  require_auth("orng.wax"_n);
  uint64_t result = _hash_to_int(random_value);
  games existingHostGames(get_self(), get_self().value);
  auto itr = existingHostGames.find(assoc_id);
  check(itr != existingHostGames.end(), "El juego no existe.");
  if (itr->turn == "none"_n){
    uint64_t move = result % 2;
    if (move == 0) {
      existingHostGames.modify(itr, get_self(), [&](auto &g) { g.turn = itr->host; });
    } else {
      existingHostGames.modify(itr, get_self(), [&](auto &g) { g.turn = itr->challenger; });
    }
  }
  // resto de código ...
}
```

Así que aquí, cuando recibimos el **random_value**, lo convertiremos en un número uint64_t, luego simplemente lo aplicamos para decidir quién es el primer jugador. Si este número es par entonces el turno es del host, si es impar entonces el challenger es el primer jugador.

Puedes echar un vistazo al contrato de número aleatorio de WAX aquí https://github.com/worldwide-asset-exchange/wax-orng. Todo lo que necesitas hacer es llamar a la acción **requestrand** y escuchar el resultado en **receiverand**.

Una nota importante sobre la acción **requestrand** es el parámetro **signing_value**, este debe ser diferente para cada llamada. Una forma simple de obtener una semilla aleatoria es usando el hash de la transacción.

```cpp
  const auto &tx_hash = _get_transaction_hash();
  auto next_seed = _hash_to_int(tx_hash);
```

#### Acción de movimiento

Veamos la acción **move** (mover), que es la lógica principal de nuestro juego.
Esta acción toma el movimiento de un jugador con fila y columna como coordenadas en el tablero. Verificaremos la validez del movimiento y luego lo guardaremos en el juego.

```cpp
 // Verifica si el usuario hace un movimiento válido
  check(isValidMove(row, column, itr->board), "No es un movimiento válido.");

  // Llena la celda, 1 para el host, 2 para el desafiante
  // TODO podría usar constante para 1 y 2 también
  const uint8_t cellValue = itr->turn == itr->host ? 1 : 2;
  const auto turn = itr->turn == itr->host ? itr->challenger : itr->host;
  auto gameBoard = *itr;
  gameBoard.board[row * game::boardWidth + column] = cellValue;
  auto winner = getWinner(gameBoard);
  auto turn_count = _next_seed();
  existingHostGames.modify(itr, by, [&](auto &g) {
    g.board[row * game::boardWidth + column] = cellValue;
    g.turn = turn;
    g.winner = winner;
  });
```

Una lógica importante aquí es verificar el ganador:

- Si el juego tiene un ganador, el juego se detiene y no acepta nuevos movimientos. Una cantidad de tokens TIC se envía al ganador.
- Si el juego no se ha detenido, actualizaremos el turno para el siguiente jugador. Si el siguiente jugador es un bot, entonces solicitaremos el siguiente movimiento mediante un número aleatorio.

Puedes ver que solicitamos el siguiente número aleatorio y procesamos el resultado en la acción **receiverand**. Con un número aleatorio que recibimos, calculamos un próximo movimiento válido y continuamos llamando a mover en nombre del bot (que es el propio contrato del juego).


## Uso del Contrato de Token

El juego cubre una lógica cuando encontramos al ganador, lo recompensaremos con una cantidad de tokens TIC. Puedes usar esta lógica para emitir tokens del juego, permitir que los jugadores comercien y compren artículos dentro del juego,...

Puedes seguir el tutorial sobre la emisión de nuevos tokens en Antelope aquí: [Crear y Acuñar un Token de Activo Fungible](/es/build/tutorials/create-issue-token/)

Después de desplegar el token, tendrás que crear un nuevo token llamado TIC y emitir una cantidad predefinida de tokens al contrato del juego. Después de eso, el juego puede transferir tokens al ganador.

```sh
cleos push action tic.token create '["tictactoe","1000000.0000 TIC"]' -p tic.token@active
cleos push action tic.token issue '["tictactoe","1000000.0000 TIC","emisión de token"]' -p tictactoe@active
```

### Emisiones de Recompensas de Tokens

Como parte de la lógica de la acción `move`, cuando encontramos que alguien ha ganado el juego, enviamos al ganador una recompensa de 10 tokens TIC. Aquí está la subsección que hace eso.

```cpp
    auto payout = asset(100000, TIC_SYMBOL);
    string memo = "pago";
    if (winner == itr->host){
        eosio::action(eosio::permission_level{get_self(), eosio::name("active")}, TOKEN_CONTRACT, eosio::name("transfer"),
          make_tuple(get_self(), itr->host, payout, memo))
                .send();
    }else if (winner == itr->challenger && itr->challenger != PLAYER_BOT){
        eosio::action(eosio::permission_level{get_self(), eosio::name("active")}, TOKEN_CONTRACT, eosio::name("transfer"),
          make_tuple(get_self(), itr->challenger, payout, memo))
                .send();
    }
```
Si el host o el desafiante ganan, llamamos al método eosio.token#transfer que tiene una firma de función de `(const name& from, const name& to, const asset& quantity, const string& memo)`. Nótese que los 4 decimales del token TIC se implican en la representación entera, así que 100000 en la línea de definición de `payout` en realidad representa 10.0000 tokens TIC.