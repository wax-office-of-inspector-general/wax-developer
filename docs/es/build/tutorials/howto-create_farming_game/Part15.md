---
title: Parte 15. Interfaz Gráfica para intercambios, staking y gobernanza
order: 75
---

En esta sección, ampliamos los artículos anteriores integrándolo en una interfaz de ReactJS y leyendo datos desde una tabla de contratos inteligentes de WAX. También profundizaremos en los intercambios. Exploraremos el uso de tokens WAX o NFTs en los juegos y cómo funciona la gobernanza por parte de los usuarios o jugadores.

**Intercambio de Tokens**
-------------------------

El intercambio está diseñado para intercambiar la cantidad de un recurso al tipo de cambio especificado en la tabla llamada "**resourcecost**". Después de completar la acción, el contrato envía tokens WAX (no están en staking, el jugador puede ponerlos en staking más tarde).

En términos simples, vendes tu recurso y recibes tokens WAX a cambio. Para hacerlo, necesitas llamar a la acción del contrato "**swap**".

```js
export const swap = async ({ activeUser, resource, amount2swap }) => {
  return await signTransaction({
      activeUser,
      account: 'dappgamemine',
      action: 'swap',
      data: {
          owner: activeUser.accountName,
          resource: resource,
          amount2swap: amount2swap
      }
  });
};
```

Aquí usamos una acción del juego llamada "swap".

-   **owner** -- este es el apodo del usuario que conectó su cartera, lo tomamos de activeUser.accountName;
-   **resource** -- nombre del recurso;
-   **amount2swap** (número) -- cantidad a intercambiar.

Ahora echemos un vistazo a la tabla "**resourcecost**".

```js
export const resourceCost = async () => {
const { rows } = await fetchRows({
        contract: 'dappgamemine',
        scope: 'dappgamemine',
        table: "resourcecost"
});
   return rows;
}

```

La tabla está estructurada de la siguiente manera: cada fila está identificada por un 'id', que es un identificador único. Junto a él se encuentra el 'nombre del recurso', que es el tipo o nombre del recurso. Además, la columna 'ratio' indica la proporción del recurso al token WAX. Este 'ratio' esencialmente cuantifica la relación entre el recurso y su token WAX asociado, proporcionando una medida de su intercambiabilidad o equivalencia.

Así es como se ve en la interfaz:

![](/public/assets/images/tutorials/howto-create_farming_game/part15/image1.png)

El usuario selecciona el recurso en el molino aleatorio e ingresa la cantidad. Después de eso, la cantidad de WAX cambiará automáticamente en el campo inferior.

Aquí está el enlace a la acción en el contrato inteligente para intercambio:

<https://testnet.waxblock.io/account/dappgamemine?action=swap#contract-actions>

y la tabla **resourcecost:**

<https://testnet.waxblock.io/account/dappgamemine?code=dappgamemine&scope=dappgamemine&table=resourcecost&lower_bound=&upper_bound=&limit=10&reverse=false#contract-tables>

**Staking de Tokens en juegos**
------------------------------

¡Entendido! Vamos a profundizar en el proceso de staking de tokens WAX y su uso para votar. Exploraremos cómo llamar la acción necesaria para poner nuestros tokens WAX en staking y obtener el derecho a votar.

```js
export const tokenStake = async ({ activeUser, quantity }) => {
  return await signTransaction({
      activeUser,
      account: 'eosio.token',
      action: 'transfer',
      data: {
        from: activeUser.accountName,
        to: 'dappgamemine',
        quantity: quantity,
        memo: 'staking'
      }
  });
};

```

Aquí usamos una acción llamada "transfer" para poner en staking los tokens WAX.

-   **from** -- este es el apodo del usuario que conectó su cartera, lo tomamos de activeUser.accountName;
-   **to** -- nombre del contrato del juego;
-   **quantity** (cadena, como '10.00000000 WAX') -- cantidad para poner en staking.
-   **memo** -- si queremos hacer staking con nuestros WAX en nuestro juego, utilizamos el MEMO 'staking'.

Y así es como podemos obtener los datos de la tabla de balance mencionada anteriormente.

```js
export const fetchBalance = async () => {
  const { rows } = await fetchRows({
      contract: 'dappgamemine',
      scope: 'dappgamemine',
      table: "balance"
  });

  return rows;
}

```

En la interfaz, se ve así: el usuario ingresa la cantidad de WAX que desea apostar y, tras hacer clic en el botón "stake", se llama a la acción descrita anteriormente.

![](/public/assets/images/tutorials/howto-create_farming_game/part15/image2.png)

Aquí está el enlace a la acción en el contrato inteligente para hacer staking de tokens WAX:

<https://testnet.waxblock.io/account/eosio.token?action=transfer#contract-actions>

y la tabla de balances:

<https://testnet.waxblock.io/account/dappgamemine?code=dappgamemine&scope=dappgamemine&table=balance&lower_bound=&upper_bound=&limit=10&reverse=false#contract-tables>

**Gobernanza del juego por parte de los usuarios/jugadores**
------------------------------------

Vamos a delinear la estructura del sistema de votación:

-   La votación puede originarse de los desarrolladores (votación del sistema) o de jugadores con suficientes tokens en staking (votación comunitaria).
-   La votación puede estar relacionada con variables del contrato (automática) o puede ser una propuesta que el equipo se compromete a cumplir (general).
-   Una votación se considera válida si una parte suficiente de la comunidad del juego ha participado en ella (límite inferior).

Estas son las condiciones para cerrar una votación:

-   La cantidad de tokens bloqueados en la votación alcanza un límite predeterminado (límite de cierre).
-   El tiempo especificado para la votación expira (fecha límite).

Al crear una encuesta, eliges el tipo de finalización. Puede ser 1 o 2, o un híbrido (1 o 2).

El poder de voto de un jugador depende directamente de la cantidad de tokens WAX en staking.

Ahora veamos cómo integrar esto en React JS. Para crear una encuesta, tenemos una función llamada **createVoting()**.

```js
export const createVoting = async ({ activeUser, resName, ratio }) => {
  return await signTransaction({
      activeUser,
      account: 'dappgamemine',
      action: 'createvoting',
      data: {
        player: activeUser.accountName,
        resource_name: resName,
        new_ratio: ratio,
      }
  });
};

```

Aquí utilizamos una acción llamada "**createvoting**" para crear una votación para cambiar el ratio.

-   **player** -- este es el apodo del usuario que conectó su cartera, lo tomamos de activeUser.accountName;
-   **resource_name (string)** -- nombre del recurso;
-   **new_ratio** (float32) -- nuevo ratio.

En la imagen de la interfaz, vemos una votación para cambiar el ratio.

![](/public/assets/images/tutorials/howto-create_farming_game/part15/image3.png)

También se enumeran el propósito de la encuesta, la fecha límite, el autor, el número de participantes y el número total de tokens contribuidos.

Ahora veamos cómo votar. Primero, necesitamos asegurar tokens WAX. Hemos descrito cómo hacerlo anteriormente.

```js
export const vote = async ({ activeUser, id }) => {
  return await signTransaction({
      activeUser,
      account: 'dappgamemine',
      action: 'vote',
      data: {
        player: activeUser.accountName,
        voting_id: id,
      }
  });
};

```

Aquí usamos una acción llamada "vote" para emitir tu voto.

-   **player** -- este es el apodo del usuario que conectó su cartera, lo tomamos de activeUser.accountName;
-   **voting_id** -- ID de la votación de la tabla сhangeration;

Una vez creada, tu voto se añade a la tabla '**changeration**'. Para extraerlo para nuestra interfaz, utilizamos la función **changeRation()**.

```js
export const changeRation = async () => {
      const { rows } = await fetchRows({
        contract: 'dappgamemine',
        scope: 'dappgamemine',
        table: "changeration"
      });
      return rows;
    }

```

Aquí está el enlace a la acción en el contrato inteligente para crear una votación:

<https://testnet.waxblock.io/account/dappgamemine?action=createvoting#contract-actions>

acción para votar:

<https://testnet.waxblock.io/account/dappgamemine?action=vote#contract-actions>

una tabla con todas las votaciones creadas para cambios de tasa:

<https://testnet.waxblock.io/account/dappgamemine?code=dappgamemine&scope=dappgamemine&table=changeration&lower_bound=&upper_bound=&limit=10&reverse=false#contract-tables>

**PS.** El [enlace siguiente](https://github.com/dapplicaio/GUIStakingGovernanceSwaps) nos lleva a un repositorio que corresponde a todo lo descrito.
