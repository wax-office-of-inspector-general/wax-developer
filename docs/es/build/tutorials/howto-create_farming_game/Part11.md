---
title: Parte 11. Interfaz para Mezclas, Mejoras y Avatares
order: 55
---

Basándonos en nuestra guía de interacción con contratos inteligentes de ReactJS y WAX, este artículo avanza en el desarrollo de nuestra aplicación. Nos adentraremos en las complejidades de las mezclas y mejoras del espacio de trabajo, junto con las herramientas necesarias. Además, se proporcionará una guía sobre acciones de la interfaz sincronizadas con nuestro contrato inteligente, mejorando la funcionalidad y la experiencia del usuario en la aplicación.

**Mezclando activos**
-------------------

Las mezclas en contratos inteligentes permiten a los propietarios de colecciones crear nuevos activos mejorados al combinar los existentes. Imagina mejorar tus herramientas mezclando dos del mismo tipo, resultando en una herramienta que extrae significativamente más recursos.

Este proceso enriquece la experiencia del usuario al agregar profundidad a la gestión de recursos y la estrategia de juego, todo integrado sin problemas en la interfaz de usuario para una interacción fácil.

Así es como se ve.

![](/public/assets/images/tutorials/howto-create_farming_game/part11/image1.png)

El contrato inteligente cuenta con recetas de mezcla predefinidas que los usuarios pueden utilizar a través de la función `fetchBlends`. Esta funcionalidad permite la extracción de varias recetas de mezcla desde el contrato, permitiendo a los usuarios crear herramientas y activos mejorados siguiendo instrucciones específicas de mezcla directamente desde la interfaz de la aplicación.

```Js
export const fetchBlends = async () => {
    const { rows } = await fetchRows({
        contract: 'dappgamemine',
        scope: 'dappgamemine',
        table: "blendrecipes"
    });

    const templateOneRequests = rows.map(row => axios.get(`https://test.wax.api.atomicassets.io/atomicassets/v1/templates?collection_name=minersgamers&template_id=${row.blend_components}`));

    const responsesOne = await Promise.all(templateOneRequests);

    const templateTwoRequests = rows.map(row => axios.get(`https://test.wax.api.atomicassets.io/atomicassets/v1/templates?collection_name=minersgamers&template_id=${row.resulting_item}`));

    const responsesTwo = await Promise.all(templateTwoRequests);

    const updatedRows = rows.map((row, index) => {
      const { data:dataOne } = responsesOne[index];
      const { data:dataTwo } = responsesTwo[index];
      return { ...row, blend_components: dataOne.data, resulting_item: dataTwo.data[0] };
    })

    return updatedRows;
  }
```

- Dentro de la función, primero se obtienen filas de datos de una tabla especificada (blendrecipes) utilizando la función fetchRows.
- Una vez que se han obtenido las filas, la función procede a crear un array de solicitudes para obtener datos desde una API usando Axios. Itera sobre cada fila y construye una URL para obtener datos relacionados con los componentes de mezcla y elementos resultantes.
- Estas solicitudes luego se realizan de forma simultánea usando Promise.all, lo que espera a que todas las solicitudes se resuelvan.
- Las respuestas de estas consultas se almacenan en dos arrays separados (responsesOne y responsesTwo).
- Habiendo obtenido las respuestas para los componentes de la mezcla y los elementos resultantes, la función vuelve a mapear las filas originales.
- Dentro de la función map, extrae los datos relevantes (dataOne y dataTwo) de las respuestas correspondientes.
- Finalmente, crea filas actualizadas fusionando los datos originales con los componentes de mezcla y el elemento resultante obtenidos.

También hemos implementado una función que verifica si el usuario puede hacer una mezcla con el inventario disponible según una de las recetas. Comprobamos esto usando la siguiente función:

```js
const blendComponentsMatch = userToolAsset.some(asset => asset.template.template_id === item.blend_components[0].template_id || asset.template.template_id === item.blend_components[1].template_id);

const isAvailable = blendComponentsMatch &&
userToolAsset.some(asset => Number(asset.template.template_id) !== Number(item.blend_components[0].template_id) && Number(asset.template.template_id) !== Number(item.blend_components[1].template_id));
```

- **userToolAsset** -- array de herramientas del usuario;
- **item** -- cada elemento del array que contiene las recetas;

Si la función isAvailable es true, el usuario puede hacer una mezcla; si es false, el usuario no tiene suficientes herramientas para una receta en particular.

Ahora veamos cómo la interfaz de usuario interactúa con el contrato inteligente para crear una mezcla.

```js

export const blend = async ({ activeUser, componentIds, assets, blendId }) =>   {
  return await signTransaction({
      activeUser,
      account: 'atomicassets',
      action: 'transfer',
      data: {
          from: activeUser.accountName,
          to: 'dappgamemine',
          assets_ids: assets,
        memo: `blend:${blendId}`
      }
  });
};
```

Para una mezcla exitosa de nuestras herramientas, veamos las configuraciones que debemos pasar a nuestra función:

- **owner** -- este es el apodo del usuario que conectó su billetera, lo tomamos de activeUser.accountName;
- **component_ids** -- este es un array con nuestros activos de herramientas para mezclar;
- **blend_id** -- este es el id de la mezcla.

Aquí hay un enlace a la acción en el contrato inteligente para mezclar herramientas:

<https://testnet.waxblock.io/account/atomicassets?action=transfer#contract-actions>

**Mejorando activos**
--------------------

Lo siguiente que vamos a ver es cómo mejorar nuestras herramientas y espacios de trabajo.

Nuestra herramienta comienza en el nivel 1, pero podemos mejorarla. Cuando esta herramienta está en staking en el espacio de trabajo, calcula la cantidad de recursos necesarios para mejorarla y, si el usuario tiene suficientes, aumenta la tasa de extracción (mining_rate) del ítem. Como sabemos del artículo anterior, esto afecta cuán rápido se extraen nuestros recursos.

![](/public/assets/images/tutorials/howto-create_farming_game/part11/image2.png)

Primero, debemos decidir qué herramienta o espacio de trabajo queremos mejorar. Para realizar esta acción, nuestra herramienta debe estar en staking. Luego la pasamos a la configuración de nuestra acción.

La interfaz de usuario debe verificar el nivel máximo permitido de la herramienta que queremos mejorar antes de llamar a la acción. Esto está escrito en los datos de la herramienta.

El siguiente nivel debe ser superior al actual. En nuestro ejemplo, supongamos que nuestro instrumento tiene un primer nivel inicial.

Acción para mejorar herramienta:

Al inicio de la función, usamos una comprobación para ver si nuestra herramienta ha alcanzado el nivel máximo.

```js
export const upgradeTool = async ({ activeUser, toolID, wpID }) => {
  const maxLevel = toolID.data.maxLevel;
  const currentLevel = toolID.data.level;

  const nextLvl = currentLevel + 1;

  if (nextLvl > maxLevel) {
    throw new Error('Error: El siguiente nivel excede el nivel máximo del instrumento.');
  }

  return await signTransaction({
    activeUser,
    account: 'dappgamemine',
    action: 'upgradeitem',
    data: {
      owner: activeUser.accountName,
      item_to_upgrade: toolID.asset_id,
      next_level: nextLvl,
      staked_at_farmingitem: wpID
    }
  });
};
```

Aquí utilizamos una acción del juego llamada "upgradeitem".

- **owner** -- este es nuestro apodo del usuario que conectó su billetera, lo tomamos de activeUser.accountName;
- **item_to-upgrade** -- ID de la herramienta que queremos mejorar;
- **stake_at_farmingitem** -- el ID del espacio de trabajo donde la herramienta está en staking;

Después de una mejora exitosa, nuestra herramienta se convierte en nivel 2:

![](/public/assets/images/tutorials/howto-create_farming_game/part11/image3.png)

Acción para mejorar el espacio de trabajo:

```js
export const upgradeWorkplace = async ({ activeUser, wpID, stakedBool}) => {
  return await signTransaction({
      activeUser,
      account: 'dappgamemine',
      action: 'upgfarmitem',
      data: {
          owner: activeUser.accountName,
          farmingitem_to_upgrade: wpID,
          staked: stakedBool,
      }
  });
};
```

Aquí utilizamos una acción del juego llamada "upgfarmitem".

- **owner** -- este es nuestro apodo del usuario que conectó su billetera, lo tomamos de activeUser.accountName;
- **farmingitem_to_upgrade** -- ID del espacio de trabajo que queremos mejorar;
- **staked** (booleano) -- Si está en staking, entonces true; si no, entonces false.

Aquí hay un enlace a la acción en el contrato inteligente para mejorar herramientas:

<https://testnet.waxblock.io/account/dappgamemine?action=upgradeitem#contract-actions>

y para mejorar espacios de trabajo:

<https://testnet.waxblock.io/account/dappgamemine?action=upgfarmitem#contract-actions>

**Avatares**
-----------

Veamos qué son los avatares y para qué sirven.

Los avatares son personajes que tienen atributos adicionales. También se les pueden poner objetos que mejoren esos atributos.

![](/public/assets/images/tutorials/howto-create_farming_game/part11/image4.png)

Esta acción te permite establecer el avatar seleccionado como activo y devolver el antiguo a nuestro inventario.

Función para establecer avatar:

```js
export const setAvatar = async ({ activeUser, avatarId }) => {
  return await signTransaction({
      activeUser,
      account: 'atomicassets',
      action: 'transfer',
      data: {
        from: activeUser.accountName,
        to: 'dappgamemine',
        asset_ids: avatarId,
        memo: 'set avatar'
      }
  });
};
```

Para esta acción, utilizamos las siguientes configuraciones:

- **from** -- este es nuestro apodo del usuario que conectó su billetera, lo tomamos de activeUser.accountName;
- **to** -- nombre del contrato del juego;
- **asset_ids** -- array de avatares;
- **memo** -- "set avatar" -- para establecer tu avatar.

Función para establecer equipamiento:

```js
export const setEquipment = async ({ activeUser, equipments }) => {
  return await signTransaction({
      activeUser,
      account: 'atomicassets',
      action: 'transfer',
      data: {
          from: activeUser.accountName,
          to: 'dappgamemine',
          asset_ids: equipments,
          memo: 'set equipment'
      }
  });
};
```

Las configuraciones son las mismas que en la acción anterior, solo cambia el memo.

- **asset_ids** -- array de equipamientos;
- **memo** -- "set equipment" -- para establecer el equipamiento de tu avatar.

Aquí hay un enlace a la acción en el contrato inteligente para establecer avatar y equipamiento:

<https://testnet.waxblock.io/account/atomicassets?action=transfer#contract-actions>

También tenemos una tabla de avatares, donde para cada usuario hay un array con los id que contiene su avatar y equipamiento. Para esto utilizaremos una lectura de la tabla. En el último artículo vimos la función fetchRows.

```js
export const fetchAvatars = async ({ activeUser }) => {
    const { rows } = await fetchRows({
        contract: 'dappgamemine',
        scope: activeUser.accountName,
        table: "avatars"
    });

    return rows;
  }
```

La tabla de estadísticas, que contiene las características actuales del usuario (la suma de los atributos del avatar y el equipamiento).

```js
export const fetchStats = async ({ activeUser }) => {
  const { rows } = await fetchRows({
      contract: 'dappgamemine',
      scope: activeUser.accountName,
      table: "stats"
  });

  return rows;
}
```

Aquí hay un enlace a la acción en el contrato inteligente para ver avatares:

<https://testnet.waxblock.io/account/dappgamemine?code=dappgamemine&scope=dappgamemine&table=avatars&lower_bound=&upper_bound=&limit=10&reverse=false#contract-tables>

y estadísticas:

<https://testnet.waxblock.io/account/dappgamemine?code=dappgamemine&scope=dappgamemine&table=stats&lower_bound=&upper_bound=&limit=10&reverse=false#contract-tables>

**PD.** El [siguiente enlace](https://github.com/dapplicaio/GameAvatars) nos lleva a un repositorio que corresponde a todo lo descrito, para que puedas simplemente construir ese código y usarlo como quieras.