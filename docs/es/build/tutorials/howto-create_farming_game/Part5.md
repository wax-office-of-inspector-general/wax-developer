---
title: Parte 5. Staking de NFTs
order: 25
---

Hoy vamos a profundizar en el staking de NFTs dentro del contrato inteligente de nuestro juego. Esta estrategia ayuda a gestionar los precios del mercado al bloquear los NFTs en el contrato. Imagina establecer un período de desbloqueo de entre 3 y 30 días para tener mayor control.

El staking de NFTs simplifica el seguimiento de la propiedad, lo cual es crucial para recompensar a los propietarios periódicamente, incluso por cada bloque de la cadena. Este método evita la necesidad de sistemas centralizados para rastrear la propiedad, un desafío común con alternativas que dependen del historial de transacciones o APIs externas.

El staking de NFTs en nuestro juego es un proceso sencillo:

1. El jugador elige un NFT para hacer staking.
2. Envía este NFT a nuestro contrato.
3. Nuestro contrato reconoce y procesa la transferencia.
4. Finalmente, el contrato registra el NFT en staking del jugador en una tabla, listo para futuras interacciones.

Este proceso asegura una experiencia de staking eficiente y fluida, integral para la dinámica del juego.

### Código fuente de Staking y Ejemplo

Archivo principal: `game.hpp`

```cpp
#include <eosio/eosio.hpp>
#include <eosio/singleton.hpp>
#include <eosio/asset.hpp>
#include "atomicassets.hpp"

using namespace eosio;
```

Al comienzo del archivo, conectamos todas las bibliotecas y espacios de nombres necesarios.

```cpp
class [[eosio::contract]] game : public contract
{
  public:
    using contract::contract;
  private:
};
```

Así es como se ve una clase vacía llamada `game`. En ella implementaremos todas las funciones necesarias para el staking.

El primer paso es añadir una función para escuchar la transferencia. Hazla pública:

```cpp
// escuchando transferencias de atomicassets
[[eosio::on_notify("atomicassets::transfer")]]
void receive_asset_transfer
(
  const name& from,
  const name& to,
  std::vector<uint64_t>& asset_ids,
  const std::string& memo
);
```

Respecto a `eosio::on_notify`, puedes encontrar más información [aquí](https://developers.eos.io/welcome/v2.0/smart-contract-guides/payable-actions/#the-on_notify-attribute).

En esta función, la configuramos para escuchar el contrato de Atomic Assets y su función de transferencia. Aquí hay un resumen:

- `from`: Representa al jugador que envía el NFT.
- `to`: Debe estar configurado como nuestro contrato.
- `asset_ids`: Son los NFTs de juego involucrados en la transacción.
- `memo`: Un mensaje incluido con la transferencia. Los memos futuros se especificarán para guiar a nuestro contrato sobre cómo procesar los datos.

Esta configuración es crucial para manejar correctamente las transferencias de NFTs en el entorno de nuestro juego.

```cpp
// scope: propietario
struct [[eosio::table]] staked_j
{
  uint64_t              asset_id; // ítem
  std::vector<uint64_t> staked_items; // elementos para farming

  uint64_t primary_key() const { return asset_id; }
};
typedef multi_index<"staked"_n, staked_j> staked_t;
```

En esta parte, hemos configurado una tabla para hacer un seguimiento de los NFTs en staking:

- **Scope**: Definido por el apodo del jugador.
- **asset_id**: Identifica el NFT específico (ítem).
- **staked_items**: Un array que contiene los NFTs en staking (elementos de farming).
- **primary_key**: Una función necesaria en todas las tablas, que determina la clave de búsqueda de los registros.

Además, hemos creado funciones auxiliares para mejorar la legibilidad del código dentro del contrato:

```cpp
void stake_farmingitem(const name& owner, const uint64_t& asset_id);
void stake_items(const name& owner, const uint64_t& farmingitem, const std::vector<uint64_t>& items_to_stake);

// obtener datos mutables del NFT
atomicassets::ATTRIBUTE_MAP get_mdata(atomicassets::assets_t::const_iterator& assets_itr);
// obtener datos inmutables de la plantilla del NFT
atomicassets::ATTRIBUTE_MAP get_template_idata(const int32_t& template_id, const name& collection_name);
// actualizar datos mutables del NFT
void update_mdata(atomicassets::assets_t::const_iterator& assets_itr, const atomicassets::ATTRIBUTE_MAP& new_mdata, const name& owner);
    }
  ]
}
```
Ahora, nos sumergimos más profundamente en el archivo `game.cpp` para detallar la implementación de la función que monitorea las transferencias atómicas. Aquí es donde ocurre la magia al manejar transacciones de NFTs dentro del marco de nuestro juego.

```cpp
void game::receive_asset_transfer
(
  const name& from,
  const name& to,
  std::vector<uint64_t>& asset_ids,
  const std::string& memo
)
{
  if (to != get_self())
    return;

  if (memo == "stake farming item")
  {
    check(asset_ids.size() == 1, "Debes transferir solo un ítem de farming para hacer staking");
    stake_farmingitem(from, asset_ids[0]);
  }
  else if (memo.find("stake items:") != std::string::npos)
  {
    const uint64_t farmingitem_id = std::stoll(memo.substr(12));
    stake_items(from, farmingitem_id, asset_ids);
  }
  else
    check(0, "Memo inválido");
}
```

Primero, verificamos si el NFT fue enviado a nuestro contrato usando `get_self()`. Dependiendo del memo, distinguimos entre hacer staking de un ítem de farming y otros ítems.

- **Ítem de Farming**: Confirmamos que solo se envíe un NFT, siguiendo la regla del juego de hacer staking de un ítem a la vez. Luego, invocamos `stake_farmingitem`.
- **Otros ítems**: Para hacer staking de otros ítems, el memo debe incluir el ID del ítem de farming donde los NFTs serán puestos en staking, con el formato "stake items:id", con el ID real del ítem de farming.

```cpp
std::stoll(memo.substr(12));
```

Aquí, analizamos el ID desde el string (`memo`) y luego llamamos a la función interna para el staking de ítems.

```cpp
else
  check(0, "Memo inválido");
```

Si la transferencia al contrato no coincide con los memos especificados para staking, el contrato marcará un error. Esto asegura que solo se procesen transacciones válidas. A continuación, exploraremos funciones adicionales utilizadas en este proceso, detallando cómo opera el contrato.

### Función: `stake_farmingitem`

```cpp
void game::stake_farmingitem(const name& owner, const uint64_t& asset_id)
{
    auto assets = atomicassets::get_assets(get_self());
    auto asset_itr = assets.find(asset_id);

    auto farmingitem_mdata = get_mdata(asset_itr);
    if (farmingitem_mdata.find("slots") == std::end(farmingitem_mdata))
    {
        auto farmingitem_template_idata = get_template_idata(asset_itr->template_id, asset_itr->collection_name);
        check(farmingitem_template_idata.find("maxSlots") != std::end(farmingitem_template_idata),
              "Las ranuras del ítem de farming no fueron inicializadas. Contacta al equipo de desarrollo");
        check(farmingitem_template_idata.find("stakeableResources") != std::end(farmingitem_template_idata),
              "Los elementos stakeables en el ítem de farming actual no fueron inicializados. Contacta al equipo de desarrollo");

        farmingitem_mdata["slots"] = (uint8_t)1;
        farmingitem_mdata["level"] = (uint8_t)1;

        update_mdata(asset_itr, farmingitem_mdata, get_self());
    }

    staked_t staked_table(get_self(), owner.value);
    staked_table.emplace(get_self(), [&](auto &new_row)
    {
        new_row.asset_id = asset_id;
    });
}
```

A continuación se explica esta función:

```cpp
auto assets = atomicassets::get_assets(get_self());
auto asset_itr = assets.find(asset_id);
```

Esta parte cubre cómo recuperamos un registro del saldo de nuestro contrato desde la tabla `atomicassets` y localizamos el NFT específico que el usuario desea poner en staking. Usaremos funciones del espacio de nombres `atomicassets`. Estas se detallan en los archivos de encabezado incluidos con el artículo, proporcionando un tutorial sencillo sobre cómo trabajar con el estándar de activos atómicos.

```cpp
auto farmingitem_mdata = get_mdata(asset_itr);
```

Aquí, extraemos los metadatos del NFT para trabajar posteriormente con los datos localizados en el NFT.

```cpp
atomicassets::ATTRIBUTE_MAP game::get_mdata(atomicassets::assets_t::const_iterator& assets_itr)
{
  auto schemas = atomicassets::get_schemas(assets_itr->collection_name);
  auto schema_itr = schemas.find(assets_itr->schema_name.value);

  atomicassets::ATTRIBUTE_MAP deserialized_mdata = atomicdata::deserialize
  (
    assets_itr->mutable_serialized_data,
    schema_itr->format
  );

  return deserialized_mdata;
}
```

Esta es nuestra función de extracción de datos, donde se recupera el esquema (categoría):

```cpp
auto schemas = atomicassets::get_schemas(assets_itr->collection_name);
auto schema_itr = schemas.find(assets_itr->schema_name.value);
```

El proceso implica pasar los datos a la función de deserialización de datos atómicos en `atomicdata`. Incluiremos estos archivos con el código para una referencia fácil. En cuanto al staking, cuando recibimos los metadatos del NFT, seguimos pasos específicos para asegurar un procesamiento y registro precisos dentro del contrato.

```cpp
if(farmingitem_mdata.find("slots") == std::end(farmingitem_mdata))
{
    auto farmingitem_template_idata = get_template_idata(asset_itr->template_id, asset_itr->collection_name);
    check(farmingitem_template_idata.find("maxSlots") != std::end(farmingitem_template_idata),
          "Las ranuras del ítem de farming no fueron inicializadas. Contacta al equipo de desarrollo");
    check(farmingitem_template_idata.find("stakeableResources") != std::end(farmingitem_template_idata),
          "Los elementos stakeables en el ítem de farming actual no fueron inicializados. Contacta al equipo de desarrollo");

    farmingitem_mdata["slots"] = (uint8_t)1;
    farmingitem_mdata["level"] = (uint8_t)1;

    update_mdata(asset_itr, farmingitem_mdata, get_self());
}
```

Cuando se pone en staking un NFT por primera vez, verificamos si existe el campo 'slots'. Si no está presente, seguimos los requisitos del juego para inicializar los campos, configurando las ranuras y el nivel del ítem de farming. Esta inicialización es crucial solo para el staking inicial de un NFT.

```cpp
staked_t staked_table(get_self(), owner.value);
staked_table.emplace(get_self(), [&](auto &new_row)
{
    new_row.asset_id = asset_id;
});
```

A continuación, registramos el NFT en staking en nuestra tabla, usando `owner.value` como el ámbito. Esto asegura que la entrada sea específica para el usuario. Luego, la función `emplace` toma el control, donde el primer parámetro es la cuenta autorizada para pagar la RAM, y el segundo es una función lambda para agregar un nuevo registro a la tabla.

Esto prepara el escenario para detallar la función de staking de ítems.

```cpp
void game::stake_items(const name& owner, const uint64_t& farmingitem, const std::vector<uint64_t>& items_to_stake)
{
    auto assets = atomicassets::get_assets(get_self());

    staked_t staked_table(get_self(), owner.value);
    auto staked_table_itr = staked_table.require_find(farmingitem, "No se pudo encontrar el ítem de farming en staking");
    auto asset_itr = assets.find(farmingitem);

    auto farmingitem_mdata = get_mdata(asset_itr);
    auto farmingitem_template_idata = get_template_idata(asset_itr->template_id, asset_itr->collection_name);

    check(std::get<uint8_t>(farmingitem_mdata["slots"]) >= staked_table_itr->staked_items.size() + items_to_stake.size(),
          "No tienes suficientes ranuras vacías en el ítem de farming actual para hacer staking de esta cantidad de ítems");

    atomicdata::string_VEC stakeableResources = std::get<atomicdata::string_VEC>(farmingitem_template_idata["stakeableResources"]);
    for (const uint64_t& item_to_stake : items_to_stake)
    {
        asset_itr = assets.find(item_to_stake);
        auto item_mdata = get_mdata(asset_itr);

        item_mdata["lastClaim"] = current_time_point().sec_since_epoch();
        auto template_idata = get_template_idata(asset_itr->template_id, asset_itr->collection_name);
        if (item_mdata.find("level") == std::end(item_mdata))
        {
            check(template_idata.find("farmResource") != std::end(template_idata),
                  "El recurso de cultivo en el ítem [" + std::to_string(item_to_stake) + "] no fue inicializado. Contacta al equipo de desarrollo");
            check(template_idata.find("miningRate") != std::end(template_idata),
                  "La tasa de minado en el ítem [" + std::to_string(item_to_stake) + "] no fue inicializada. Contacta al equipo de desarrollo");
            check(template_idata.find("maxLevel") != std::end(template_idata),
                  "El nivel máximo en el ítem [" + std::to_string(item_to_stake) + "] no fue inicializado. Contacta al equipo de desarrollo");

            item_mdata["level"] = (uint8_t)1;
        }

        check(std::find(std::begin(stakeableResources), std::end(stakeableResources), std::get<std::string>(template_idata["farmResource"])) != std::end(stakeableResources),
              "El ítem [" + std::to_string(item_to_stake) + "] no puede ser puesto en staking en el ítem de farming actual");
        update_mdata(asset_itr, item_mdata, get_self());
    }

    staked_table.modify(staked_table_itr, get_self(), [&](auto &new_row)
    {
        new_row.staked_items.insert(std::end(new_row.staked_items), std::begin(items_to_stake), std::end(items_to_stake));
    });
}
```
En esta función, detallamos el staking de múltiples ítems, incluyendo verificaciones para comprobar los espacios disponibles y asegurando que cada ítem cumpla con los criterios necesarios antes de ser puesto en staking.

### Desglose Paso a Paso

```cpp
auto assets = atomicassets::get_assets(get_self());
```

Aquí, estamos recuperando los NFTs del contrato. Esta línea obtiene la colección de activos propiedad del contrato.

```cpp
staked_t staked_table(get_self(), owner.value);
auto staked_table_itr = staked_table.require_find(farmingitem, "Could not find farming staked item");
```

Este paso implica extraer la tabla del jugador y buscar el ID del ítem de farming especificado en el memo. Si el ID especificado no se encuentra, el sistema desencadena un mensaje de error.

```cpp
auto asset_itr = assets.find(farmingitem);
```

A continuación, localizamos el NFT en la tabla atómica para extraer sus datos.

```cpp
auto farmingitem_mdata = get_mdata(asset_itr);
auto farmingitem_template_idata = get_template_idata(asset_itr->template_id, asset_itr->collection_name);
```

En este paso, extraemos los metadatos del NFT y los datos del template inmutable. La función `get_template_idata` se usa para este propósito, funcionando de manera similar a `get_mdata`. Esta extracción es vital para comprender y utilizar correctamente las características del NFT dentro del juego.

```cpp
atomicassets::ATTRIBUTE_MAP game::get_template_idata(const int32_t& template_id, const name& collection_name)
{
  auto templates = atomicassets::get_templates(collection_name);
  auto template_itr = templates.find(template_id);

  auto schemas = atomicassets::get_schemas(collection_name);
  auto schema_itr = schemas.find(template_itr->schema_name.value);

  return atomicdata::deserialize
  (
    template_itr->immutable_serialized_data,
    schema_itr->format
  );
}
```

En esta parte, estamos extrayendo información sobre el template del NFT. De estos datos del template, luego extraemos los detalles específicos que necesitamos.

```cpp
check(std::get<uint8_t>(farmingitem_mdata["slots"]) >= staked_table_itr->staked_items.size() + items_to_stake.size(),
      "You don't have empty slots on the current farming item to stake this amount of items");
```

El siguiente paso implica verificar si hay suficiente espacio en el ítem de farming para almacenar nuevos ítems. Esta verificación es esencial para asegurar que la capacidad del ítem se alinee con las reglas y mecánicas del juego.

```cpp
atomicdata::string_VEC stakeableResources = std::get<atomicdata::string_VEC>(farmingitem_template_idata["stakeableResources"]);
```

En esta fase, utilizamos un vector o arreglo de tipos. Aquí es donde registraremos todos los recursos que los ítems elegidos por el jugador están destinados a farmear.

---

```cpp
for (const uint64_t& item_to_stake : items_to_stake)
{
    asset_itr = assets.find(item_to_stake);
    auto item_mdata = get_mdata(asset_itr);

    item_mdata["lastClaim"] = current_time_point().sec_since_epoch();
    auto template_idata = get_template_idata(asset_itr->template_id, asset_itr->collection_name);
    if (item_mdata.find("level") == std::end(item_mdata))
    {
        check(template_idata.find("farmResource") != std::end(template_idata),
              "farmResource at item [" + std::to_string(item_to_stake) + "] was not initialized. Contact the dev team");
        check(template_idata.find("miningRate") != std::end(template_idata),
              "miningRate at item [" + std::to_string(item_to_stake) + "] was not initialized. Contact the dev team");
        check(template_idata.find("maxLevel") != std::end(template_idata),
              "maxLevel at item [" + std::to_string(item_to_stake) + "] was not initialized. Contact the dev team");

        item_mdata["level"] = (uint8_t)1;
    }

    check(std::find(std::begin(stakeableResources), std::end(stakeableResources), std::get<std::string>(template_idata["farmResource"])) != std::end(stakeableResources),
          "Item [" + std::to_string(item_to_stake) + "] cannot be staked at the current farming item");
    update_mdata(asset_itr, item_mdata, get_self());
}
```

A continuación, iteramos a través de los ítems que el jugador quiere poner en staking, extrayendo los datos del NFT para cada uno, similar a los pasos anteriores.

```cpp
item_mdata["lastClaim"] = current_time_point().sec_since_epoch();
```

Luego registramos el campo 'lastClaim' para cada ítem, que es crucial para futuros cálculos de farmear recursos. Este timestamp se establece por defecto en el momento en que el ítem es procesado.

### Verificando y Actualizando Ítems en Staking

```cpp
if(item_mdata.find("level") == std::end(item_mdata))
{
    check(template_idata.find("farmResource") != std::end(template_idata),
          "El campo farmResource del ítem [" + std::to_string(item_to_stake) + "] no fue inicializado. Contacta al equipo de desarrollo");
    check(template_idata.find("miningRate") != std::end(template_idata),
          "El campo miningRate del ítem [" + std::to_string(item_to_stake) + "] no fue inicializado. Contacta al equipo de desarrollo");
    check(template_idata.find("maxLevel") != std::end(template_idata),
          "El campo maxLevel del ítem [" + std::to_string(item_to_stake) + "] no fue inicializado. Contacta al equipo de desarrollo");

    item_mdata["level"] = (uint8_t)1;
}
```

En este punto, verificamos si el ítem está siendo puesto en staking por primera vez. Si es la primera instancia de staking y falta el campo 'level', esto indica que debemos agregar este campo al NFT. Además, comprobamos otros campos obligatorios en la plantilla para asegurarnos de que estén correctamente inicializados.

```cpp
check(std::find(std::begin(stakeableResources), std::end(stakeableResources), std::get<std::string>(template_idata["farmResource"])) != std::end(stakeableResources),
      "El ítem [" + std::to_string(item_to_stake) + "] no puede ser puesto en staking en el ítem de farming actual");
```

En este paso, evaluamos si el ítem de farming puede acomodar el staking de un ítem que mina un recurso específico. Esto implica comprobar el arreglo de recursos que el ítem de farming puede minar y asegurar que los ítems que el jugador quiere poner en staking estén alineados con las capacidades del ítem de farming correspondiente.

```cpp
update_mdata(asset_itr, item_mdata, get_self());
```

Una vez que confirmamos que todo está en orden, procedemos a actualizar los metadatos del NFT como se describió en los pasos anteriores. Esto asegura que el NFT sea modificado correctamente para reflejar su nuevo estado y capacidades dentro del ecosistema del juego.

### Actualizando la Tabla de Staking

```cpp
void game::update_mdata(atomicassets::assets_t::const_iterator& assets_itr, const atomicassets::ATTRIBUTE_MAP& new_mdata, const name& owner)
{
  action
  (
    permission_level{get_self(),"active"_n},
    atomicassets::ATOMICASSETS_ACCOUNT,
    "setassetdata"_n,
    std::make_tuple
    (
      get_self(),
      owner,
      assets_itr->asset_id,
      new_mdata
    )
  ).send();
}
```

Luego, llamamos a la función atómica, ingresando todos los datos relevantes. Después de actualizar los metadatos del NFT, también hacemos los cambios correspondientes en la tabla de staking.

```cpp
staked_table.modify(staked_table_itr, get_self(), [&](auto &new_row)
{
    new_row.staked_items.insert(std::end(new_row.staked_items), std::begin(items_to_stake), std::end(items_to_stake));
});
```

Aquí usamos `modify`, ya que tal entrada ya existe en la tabla y solo necesitamos actualizarla. El primer parámetro es un iterador que apunta a la entrada a modificar, el segundo es quién paga por la RAM, y el tercero es una función lambda para editar la entrada en la tabla.

### Notas Adicionales

PD. El [enlace siguiente](https://github.com/dapplicaio/StakingNFTS) lleva a un repositorio que corresponde a todo lo descrito aquí, por lo que simplemente puedes construir ese código y usarlo según sea necesario. Los futuros artículos también incluirán ejemplos de código anteriores, permitiendo que nuestro marco evolucione con el tiempo mientras incorpora todos los artículos previos.
