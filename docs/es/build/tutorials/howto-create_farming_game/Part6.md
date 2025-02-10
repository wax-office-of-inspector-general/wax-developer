---
title: Parte 6. Tipos de Cultivo y Proceso de Cultivo
order: 30
---

En este artículo, desglosaremos el proceso de cultivo de recursos. Basándonos en el código de staking de nuestro artículo anterior, introduciremos tablas y funciones adicionales específicas para el cultivo de recursos.

El primer paso es agregar una tabla a nuestro código para el almacenamiento de recursos. Esta tabla es clave para gestionar y rastrear los recursos que los jugadores recolectan y utilizan dentro del juego.

```C
//scope: owner
 struct [[eosio::table]] resources_j
 {
   uint64_t    key_id;
   float       amount;
   std::string resource_name;

   uint64_t primary_key() const { return key_id; }
 };
 typedef multi_index< "resources"_n, resources_j > resources_t;
```

En la tabla de cultivo de recursos, tenemos los siguientes campos:

- **key_id**: Es el identificador único para cada recurso, representado como un número para facilitar las búsquedas en la tabla.
- **amount**: La cantidad del recurso específico.
- **resource_name**: El nombre del recurso, como "piedra", "madera", etc.

Además, utilizaremos una función auxiliar para convertir el nombre del recurso en un `key_id` numérico. Esta función simplifica el proceso de gestionar y hacer referencia a los recursos en nuestra tabla.

```C
const uint64_t pixelfarm::stringToUint64(const std::string& str)
{
 uint64_t hash = 0;

 if (str.size() == 0) return hash;

 for (int i = 0; i < str.size(); ++i)
 {
   int char_s = str[i];
   hash = ((hash << 4) - hash) + char_s;
   hash = hash & hash;
 }

 return hash;
}
```

La función toma la cadena `str` como parámetro de entrada y devuelve un entero sin signo de 64 bits de tipo `uint64_t`. La función utiliza un algoritmo de hashing simple para convertir una cadena en un valor entero único.

- Inicializa una variable `hash` sin signo de 64 bits en 0.
- Verifica la longitud de la cadena de entrada `str`. Si está vacía (longitud 0), devuelve el valor de `hash`.
- Itera a través de cada carácter en `str`.
  - Calcula y almacena el código ASCII de cada carácter en `char_s`.
  - Realiza la operación de hashing:
    - Desplaza el valor de `hash` 4 bits a la izquierda: `hash << 4`.
    - Resta `hash` del valor desplazado: `(hash << 4) - hash`.
    - Agrega el código ASCII del carácter: `+ char_s`.
  - Aplica `hash = hash & hash` para limitar el valor de `hash` a 64 bits y evitar desbordamientos.
- Devuelve el valor final de `hash` después de finalizar el bucle.

Luego, incorporaremos la función de reclamación en nuestro código para continuar con el procesamiento.

```C
void claim(const name& owner, const uint64_t& farmingitem);
```

Y funciones de soporte para realizar la reclamación.

### Explicación Paso a Paso

1. `auto item_mdata = get_mdata(assets_itr);` Obtiene los metadatos del NFT utilizando el iterador `assets_itr`.

2. `const uint32_t& lastClaim = std::get<uint32_t>(item_mdata["lastClaim"]);` Obtiene el valor de "lastClaim" de los metadatos del NFT. Esto representa la última vez que se generó el recurso.

3. `std::pair<std::string, float> mined_resource;` Crea un objeto de tipo `std::pair`, que se utilizará para almacenar el recurso extraído y su cantidad.

4. `if(time_now > lastClaim) { ... }` Verifica si ha pasado suficiente tiempo desde la última reclamación del recurso. Si es así, se toman pasos adicionales.

5. `auto item_template_idata = get_template_idata(assets_itr->template_id, assets_itr->collection_name);` Obtiene los datos de la plantilla del NFT utilizando su identificador y el nombre de la colección.

6. Obtener los datos necesarios de la plantilla:
    - `const float& miningRate = std::get<float>(item_template_idata["miningRate"]);` Obtiene la tasa de extracción del recurso.
    - `const std::string& farmResource = std::get<std::string>(item_template_idata["farmResource"]);` Obtiene el nombre del recurso a extraer.

7. `const uint8_t& current_lvl = std::get<uint8_t>(item_mdata["level"]);` Obtiene el nivel actual del NFT de los metadatos.

8. Calculando la tasa de extracción de recursos según el nivel:
    ```C
    float miningRate_according2lvl = miningRate;
    for(uint8_t i = 1; i < current_lvl; ++i)
        miningRate_according2lvl = miningRate_according2lvl + (miningRate_according2lvl * upgrade_percentage / 100);
    ```

9. Calculando la cantidad de recursos extraídos:
    ```C
    const float& reward = (time_now - lastClaim) * miningRate_according2lvl;
    ```

10. `item_mdata["lastClaim"] = time_now;` Actualiza el valor de "lastClaim" en los metadatos del NFT al tiempo actual.

11. `update_mdata(assets_itr, item_mdata, get_self());` Actualiza los metadatos del NFT con el nuevo valor de "lastClaim".

12. Llenar el objeto `mined_resource` con los datos del recurso extraído y su cantidad.

13. `return mined_resource;` Devuelve el objeto `mined_resource` como resultado de la función.

### Función para Incrementar el Balance de Recursos

```C
void game::increase_owner_resources_balance(const name& owner, const std::map<std::string, float>& resources)
{
  resources_t resources_table(get_self(), owner.value);
  for(const auto& map_itr : resources)
  {
    const uint64_t& key_id = stringToUint64(map_itr.first);

    auto resources_table_itr = resources_table.find(key_id);
    if(resources_table_itr == std::end(resources_table))
    {
      resources_table.emplace(get_self(), [&](auto &new_row)
      {
        new_row.key_id          = key_id;
        new_row.resource_name   = map_itr.first;
        new_row.amount          = map_itr.second;
      });
    }
    else
    {
      resources_table.modify(resources_table_itr, get_self(), [&](auto &new_row)
      {
        new_row.amount += map_itr.second;
      });
    }
  }
}
```

### Descripción de la Funcionalidad

1. `resources_t resources_table(get_self(), owner.value);` Declaración e inicialización del objeto de tabla `resources_t`, que se utiliza para almacenar los recursos del propietario del juego (`owner`). Se crea un objeto de tabla para el contrato usando el ID del propietario.

2. `for(const auto& map_itr : resources) { ... }` Un bucle que recorre todos los pares clave-valor en el diccionario de entrada `resources`.

3. `const uint64_t& key_id = stringToUint64(map_itr.first);` Obtiene un identificador único (`key_id`) para un recurso basado en el nombre del recurso del diccionario de entrada. Se utiliza la función `stringToUint64` proporcionada anteriormente.

4. `auto resources_table_itr = resources_table.find(key_id);` Busca una entrada en la tabla con el `key_id` recibido.

5. `if(resources_table_itr == std::end(resources_table)) { ... }` Verifica si existe una entrada para el `key_id` especificado en la tabla.

6. Si no se encuentra el registro (rama `if`):
    - `resources_table.emplace(get_self(), [&](auto &new_row) { ... });` Agrega un nuevo registro a la tabla usando la función `emplace`. El registro contiene un `key_id` único, el nombre del recurso y su cantidad.

7. Si el registro existe (rama `else`):
    - `resources_table.modify(resources_table_itr, get_self(), [&](auto &new_row) { ... });` Modifica una entrada existente en la tabla, aumentando su cantidad por el valor del diccionario de entrada.

### Función de Reclamación

```C
void pixelfarm::claim(const name& owner, const uint64_t& farmingitem)
{
    require_auth(owner);

    staked_t staked_table(get_self(), owner.value);
    auto staked_table_itr = staked_table.require_find(farmingitem, "Could not find staked farming item");
    auto assets = atomicassets::get_assets(get_self());
    auto assets_itr = assets.find(farmingitem);

    // to get mining boost
    auto farmingitem_mdata = get_mdata(assets_itr);
    float miningBoost = 1;
    if(farmingitem_mdata.find("miningBoost") != std::end(farmingitem_mdata))
        miningBoost = std::get<float>(farmingitem_mdata["miningBoost"]);

    // first - resource name, second - resource amount
    std::map<std::string, float> mined_resources;
    const uint32_t& time_now = current_time_point().sec_since_epoch();
    for(const uint64_t& item_to_collect : staked_table_itr->staked_items)
    {
        auto assets_itr = assets.find(item_to_collect);
        const std::pair<std::string, float> item_reward = claim_item(assets_itr, 2, time_now); // 2 es el porcentaje de aumento en la tasa de minería por cada nivel

        if(item_reward != std::pair<std::string,float>())
            if(item_reward.second > 0)
                mined_resources[item_reward.first] += item_reward.second;
    }
    check(mined_resources.size() > 0, "Nothing to claim");

    increase_owner_resources_balance(owner, mined_resources);
}
```

1. `require_auth(owner);` Verifica si el usuario que llamó a la función tiene suficientes derechos de autorización para el propietario (`owner`).

2. `staked_t staked_table(get_self(), owner.value);` Declaración e inicialización de la tabla `staked_t` para rastrear los elementos anidados del propietario del juego (`owner`).

3. `auto staked_table_itr = staked_table.require_find(farmingitem, "Could not find staked farming item");` Busca una entrada en la tabla de elementos anidados usando el identificador único `farmingitem`. Si no se encuentra el registro, se genera un error.

4. `auto assets = atomicassets::get_assets(get_self());` Obtiene todos los activos usando la función `atomicassets::get_assets`.

5. `auto assets_itr = assets.find(farmingitem);` Busca un activo con el identificador único `farmingitem` en la colección de activos.

6. `auto farmingitem_mdata = get_mdata(assets_itr);` Obtiene los metadatos del activo especificado.

7. `float miningBoost = 1;` Inicializa la variable `miningBoost` con el valor 1.

8. `if(farmingitem_mdata.find("miningBoost") != std::end(farmingitem_mdata)) miningBoost = std::get<float>(farmingitem_mdata["miningBoost"]);` Verifica la presencia de la clave "miningBoost" en los metadatos del activo y actualiza `miningBoost` si está presente.

9. `std::map<std::string, float> mined_resources;` Crea un diccionario para almacenar los recursos extraídos, donde la clave es el nombre del recurso y el valor es su cantidad.

10. `const uint32_t& time_now = current_time_point().sec_since_epoch();` Obtiene el tiempo actual en segundos desde la época.

11. Bucle a través de cada elemento en staking:
    - `const std::pair<std::string, float> item_reward = claim_item(assets_itr, 2, time_now);` Llama a la función `claim_item` para obtener una recompensa por la minería del activo especificado.
    - `if(item_reward != std::pair<std::string,float>()) if(item_reward.second > 0) mined_resources[item_reward.first] += item_reward.second;` Agrega un recurso extraído al diccionario `mined_resources` si se ha recibido la recompensa y es positiva.

12. `check(mined_resources.size() > 0, "Nothing to claim");` Verifica si hay algo que reclamar usando la función `check`.

13. `increase_owner_resources_balance(owner, mined_resources);` Llama a la función `increase_owner_resources_balance` para aumentar el balance de recursos del propietario del juego.

### Recursos Adicionales

Para una referencia completa y ejemplos adicionales, puedes encontrar más información en el [repositorio de staking y cultivo](https://github.com/dapplicaio/FarmingResources).
