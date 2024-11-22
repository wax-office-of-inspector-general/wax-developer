---
title: Parte 18. GUI para misiones y tablas de clasificación
dorder: 90
---

En nuestro artículo anterior, analizamos los intercambios, la apuesta de tokens y los mecanismos de gobernanza.

Basándonos en esa base, en este artículo también exploraremos la funcionalidad de las tablas de clasificación y profundizaremos en las misiones en el contexto del ecosistema del juego.

**Tabla de Clasificación**
----------------

Una tabla de clasificación es esencial para rastrear y mostrar el rendimiento y el progreso de los participantes en un entorno de juego. Sirve como una representación visual de los rankings, motivando a los jugadores a esforzarse por posiciones más altas y fomentando una competencia saludable.

La tabla de clasificación suele clasificarse en función de los puntos acumulados por cada participante, mostrando su éxito relativo. Dentro de este marco, incluye áreas como madera, piedra, alimentos y gemas recolectadas o ganadas por hora.

Por ejemplo, un jugador usa la acción **claim** y recibe 100 piedras. Luego, en la tabla **lboards("Stone")** en el campo correspondiente, **points = points + 100**.

En la interfaz de usuario, la tabla de clasificación se ve así:

![](/public/assets/images/tutorials/howto-create_farming_game/part18/image1.png)

Todos nuestros datos se almacenan en una tabla de contratos inteligentes, donde cada alcance tiene una tabla separada. Estos datos se pueden recuperar utilizando la función **leaderboadrTable()**.

Es decir, los alcances posibles son: **stone, wood, food, gems, tokens, miningpwr**

```js
export const leaderboadrTable = async () => {
  const { rows } = await fetchRows({
      contract: "dappgamemine",
      scope: "stone",
      table: "lboards"
  });

  return rows;
}
```

Aquí hay un enlace a la tabla de clasificación en el contrato inteligente:

<https://testnet.waxblock.io/account/dappgamemine?code=dappgamemine&scope=stone&table=lboards&lower_bound=&upper_bound=&limit=10&reverse=false#contract-tables>

**Sistema de Misiones**
-----------------

Cada misión es una acción específica que el jugador debe realizar y la cantidad de tiempo que tarda en completarse. Por ejemplo, "Recolectar 10 piedras" o "Fabricar 3 herramientas". El estado de la misión se actualiza con la acción correspondiente. Cuando se cumplen las condiciones de la misión, el jugador puede completar la misión (eliminarla de la lista de misiones) y recoger la recompensa (si la hay).

Las misiones permiten dirigir el juego del jugador al revelar gradualmente las mecánicas del juego. Por ejemplo, al principio del juego, las misiones serán del tipo "construir una granja", "fabricar una herramienta", "obtener 100 unidades de alimentos", etc.

En la interfaz de usuario, la tabla de misiones se ve así:

![](/public/assets/images/tutorials/howto-create_farming_game/part18/image2.png)

Cuando la misión está completada, podemos llamar a la acción **Claim** para recoger la recompensa. Para hacer esto, utilizamos la función **collectQuest()**:

```js
export const collectQuest = async ({ activeUser, index }) => {
  return await signTransaction({
      activeUser,
      account: 'dappgamemine',
      action: 'compltquest',
      data: {
        player: activeUser.accountName,
        quest_index: index,
      }
  });
};
```

Aquí utilizamos una acción llamada **"compltquest"** para reclamar la recompensa.

-   **player** -- este es nuestro apodo del usuario que conectó su billetera, lo tomamos de **activeUser.accountName**;
-   **quest_index** -- ID de la misión de la tabla **"quests"**;

Para recuperar todas las misiones creadas por el contrato, debes llamar a la función **fetchQuests()**:

```js
export const fetchQuests = async () => {
  const { rows } = await fetchRows({
       contract: 'dappgamemine',
       scope: 'dappgamemine',
       table: "quests"
     });
        return rows;
}
```

Aquí hay un enlace para reclamar la misión completada:

<https://testnet.waxblock.io/account/dappgamemine?action=cmpltquest#contract-actions>

y la tabla de misiones:

<https://testnet.waxblock.io/account/dappgamemine?code=dappgamemine&scope=dappgamemine&table=quests&lower_bound=&upper_bound=&limit=10&reverse=false#contract-tables>

En este artículo hicimos una visión general de los elementos finales de nuestra serie de desarrollo de juegos en WAX. Así, cubrimos las tablas de clasificación y las misiones como características principales de la mayoría de los juegos modernos de web3.

**PS. PS.** El [siguiente enlace](https://github.com/dapplicaio/GUIQuestsLeaderboards) lleva a un repositorio que corresponde a todo lo descrito.
