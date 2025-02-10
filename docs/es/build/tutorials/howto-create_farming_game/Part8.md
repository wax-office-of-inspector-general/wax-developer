---
title: Parte 8. Mejoras de los objetos del juego en WAX
order: 40
---

En artículos anteriores, exploramos cómo recolectar recursos usando nuestros NFT. Ahora, profundizaremos en la mejora de objetos para hacer más eficiente la minería de recursos. Mejorar los objetos implica potenciar sus capacidades, haciéndolos más efectivos en la minería de recursos. Este proceso es clave para avanzar y alcanzar una mayor eficiencia en el juego. Comenzaremos agregando el código necesario para implementar las mejoras de objetos, enfocándonos en mejorar el rendimiento de nuestros NFT para la recolección de recursos.

```C
void game::upgradeitem(
    const name& owner,
    const uint64_t& item_to_upgrade,
    const uint8_t& next_level,
    const uint64_t& staked_at_farmingitem
)
{
    require_auth(owner);

    const int32_t& time_now = current_time_point().sec_since_epoch();

    auto assets     = atomicassets::get_assets(get_self());
    auto asset_itr  = assets.require_find(item_to_upgrade, ("Could not find staked item[" + std::to_string(item_to_upgrade) +"]").c_str());

    staked_t staked_table(get_self(), owner.value);
    auto staked_table_itr = staked_table.require_find(staked_at_farmingitem, "Could not find staked farming item");

    check(std::find(std::begin(staked_table_itr->staked_items), std::end(staked_table_itr->staked_items), item_to_upgrade) != std::end(staked_table_itr->staked_items),
        "Item [" + std::to_string(item_to_upgrade) + "] is not staked at farming item");

    // Reclamo de recursos minados antes de la mejora
    const std::pair<std::string, float> item_reward = claim_item(asset_itr, 2, time_now); // 2 es el porcentaje de aumento en la tasa de minería por cada nivel
    if(item_reward != std::pair<std::string,float>())
    {
        if(item_reward.second > 0)
        {
            increase_owner_resources_balance(owner, std::map<std::string, float>({item_reward}));
        }
    }
    // Mejora del objeto
    upgrade_item(asset_itr, 2, owner, next_level, time_now); // 2 es el porcentaje de aumento en la tasa de minería por cada nivel
}
```

1. **Confirmación de Autenticación**:

   ```C
   require_auth(owner);
   ```
   Verificar que la transacción está autorizada por el propietario (`owner`).

2. **Obtener el Tiempo Actual**:

   ```C
   const int32_t& time_now = current_time_point().sec_since_epoch();
   ```
   Obtener el tiempo actual en segundos desde la época.

3. **Obtención de Activos y Verificación de Disponibilidad para Mejorar**:

   ```C
   auto assets     = atomicassets::get_assets(get_self());
   auto asset_itr  = assets.require_find(item_to_upgrade, ("Could not find staked item[" + std::to_string(item_to_upgrade) +"]").c_str());
   ```
   Obtener los activos y verificar la existencia del activo con el identificador `item_to_upgrade`.

4. **Obtención de la Tabla de Staking y Verificación de Disponibilidad del Staking para Mejorar**:

   ```C
   staked_t staked_table(get_self(), owner.value);
   auto staked_table_itr = staked_table.require_find(staked_at_farmingitem, "Could not find staked farming item");
   ```
   Obtener la tabla de staking para el propietario y verificar la existencia del staking correspondiente para la mejora.

5. **Verificar la Presencia del Activo en el Staking**:

   ```C
   check(std::find(std::begin(staked_table_itr->staked_items), std::end(staked_table_itr->staked_items), item_to_upgrade) != std::end(staked_table_itr->staked_items),
       "Item [" + std::to_string(item_to_upgrade) + "] is not staked at farming item");
   ```
   Comprobar que el activo a mejorar esté realmente en el staking.

6. **Recolección de Recursos Minados Antes de la Mejora**:

   ```C
   const std::pair<std::string, float> item_reward = claim_item(asset_itr, 2, time_now);

   if(item_reward != std::pair<std::string,float>()) {
       if(item_reward.second > 0) {
           increase_owner_resources_balance(owner, std::map<std::string, float>({item_reward}));
       }
   }
   ```
   Llamar a la función `claim_item` para recolectar los recursos minados antes de la mejora. Si se recibe una recompensa, se agrega al balance del propietario.

7. **Mejora del Objeto**:

   ```C
   upgrade_item(asset_itr, 2, owner, next_level, time_now);
   ```
   Llamar a la función `upgrade_item` para mejorar el activo. En este caso, la mejora se realiza con un incremento en la velocidad de minería del 2% por cada nivel.

Junto con la explicación del proceso de mejora del objeto, también detallaremos las funciones auxiliares involucradas. Estas funciones son fundamentales para implementar las mejoras de manera efectiva, facilitando el aumento de las capacidades de minería de recursos de los objetos.

### Funciones Detalladas para la Mejora

```C
void game::upgrade_item(
  atomicassets::assets_t::const_iterator& assets_itr,
  const uint8_t& upgrade_percentage,
  const name& owner,
  const uint8_t& new_level,
  const uint32_t& time_now
)
{
  auto mdata          = get_mdata(assets_itr);
  auto template_idata = get_template_idata(assets_itr->template_id, assets_itr->collection_name);

  const float& mining_rate   = std::get<float>(template_idata["miningRate"]);
  const uint8_t& current_lvl = std::get<uint8_t>(mdata["level"]);
  const std::string& resource_name = std::get<std::string>(template_idata["farmResource"]);
  check(current_lvl < new_level, "El nuevo nivel debe ser mayor que el nivel actual");
  check(new_level <= std::get<uint8_t>(template_idata["maxLevel"]), "El nuevo nivel no puede ser superior al nivel máximo");
  check(std::get<uint32_t>(mdata["lastClaim"]) < time_now, "El objeto está siendo mejorado");

  float miningRate_according2lvl = mining_rate;
  for(uint8_t i = 1; i < new_level; ++i)
    miningRate_according2lvl = miningRate_according2lvl + (miningRate_according2lvl * upgrade_percentage / 100);

  const int32_t& upgrade_time  = get_upgrading_time(new_level) - get_upgrading_time(current_lvl);
  const float& resource_price = upgrade_time * miningRate_according2lvl;

  std::get<uint8_t>(mdata["level"]) = new_level;
  std::get<uint32_t>(mdata["lastClaim"]) = time_now + upgrade_time;

  reduce_owner_resources_balance(owner, std::map<std::string, float>({{resource_name, resource_price}}));

  update_mdata(assets_itr, mdata, get_self());
}
```

### Explicación Detallada de las Funciones de Mejora

1. **Obtención de Metadatos y Datos de Plantilla**:

   ```C
   auto mdata  = get_mdata(assets_itr);
   auto template_idata = get_template_idata(assets_itr->template_id, assets_itr->collection_name);
   ```
   Obtener los metadatos y los datos de la plantilla para el procesamiento del activo.

2. **Obtención de los Valores Requeridos**:

   ```C
   const float& mining_rate   = std::get<float>(template_idata["miningRate"]);
   const uint8_t& current_lvl = std::get<uint8_t>(mdata["level"]);
   const std::string& resource_name = std::get<std::string>(template_idata["farmResource"]);
   ```
   Obtener la tasa de minería, el nivel actual y el nombre del recurso para un activo determinado.

3. **Verificación de Condiciones**:

   ```C
   check(current_lvl < new_level, "El nuevo nivel debe ser mayor que el nivel actual");
   check(new_level <= std::get<uint8_t>(template_idata["maxLevel"]), "El nuevo nivel no puede ser superior al nivel máximo");
   check(std::get<uint32_t>(mdata["lastClaim"]) < time_now, "El objeto está siendo mejorado");
   ```
   Verificar varias condiciones que deben cumplirse antes de mejorar un activo.

4. **Cálculo de los Nuevos Valores de Velocidad de Minería**:

   ```C
   float miningRate_according2lvl = mining_rate;
   for(uint8_t i = 1; i < new_level; ++i)
     miningRate_according2lvl = miningRate_according2lvl + (miningRate_according2lvl * upgrade_percentage / 100);
   ```
   Calcular la nueva velocidad de minería, teniendo en cuenta el porcentaje de mejora para cada nivel.

5. **Cálculo del Costo de la Mejora**:

   ```C
   const int32_t& upgrade_time  = get_upgrading_time(new_level) - get_upgrading_time(current_lvl);
   const float& resource_price = upgrade_time * miningRate_according2lvl;
   ```
   Calcular el tiempo de mejora y el costo de la mejora en función de la diferencia entre los tiempos de mejora de los niveles nuevo y actual.

6. **Actualización de Datos y Reducción del Balance del Propietario**:

   ```C
   std::get<uint8_t>(mdata["level"]) = new_level;
   std::get<uint32_t>(mdata["lastClaim"]) = time_now + upgrade_time;
   reduce_owner_resources_balance(owner, std::map<std::string, float>({{resource_name, resource_price}}));
   update_mdata(assets_itr, mdata, get_self());
   ```
   Actualizar los datos del activo, establecer el nuevo nivel y el tiempo del último reclamo. Reducir el balance del propietario por el costo de la mejora. Actualizar la tabla de datos del activo.

### Reducción del Balance de Recursos del Propietario

El siguiente código incluye un mecanismo para deducir los recursos del balance del jugador como pago por la mejora:

```C
void game::reduce_owner_resources_balance(const name& owner, const std::map<std::string, float>& resources)
{
  resources_t resources_table(get_self(), owner.value);

  for(const auto& map_itr : resources)
  {
    const uint64_t& key_id = stringToUint64(map_itr.first);
    auto resources_table_itr = resources_table.require_find(key_id,
      ("No se encontró el balance de " + map_itr.first).c_str());
    check(resources_table_itr->amount >= map_itr.second, ("Balance insuficiente: " + map_itr.first).c_str());

    if(resources_table_itr->amount == map_itr.second)
      resources_table.erase(resources_table_itr);
    else
    {
      resources_table.modify(resources_table_itr, get_self(), [&](auto &new_row)
      {
        new_row.amount -= map_itr.second;
      });
    }
  }
}
```

Este código detalla el proceso para reducir el balance de recursos del propietario, asegurando que el pago por la mejora se realice de forma adecuada antes de proceder con la actualización del objeto.

### Explicación Detallada de la Mejora del Objeto de Granja

1. **Declaración e Inicialización de la Tabla de Recursos**:

   ```C
   resources_t resources_table(get_self(), owner.value);
   ```
   Crear un objeto de tabla `resources_table` para almacenar el balance de recursos de un propietario específico (`owner`).

2. **Bucle de Recursos**:

   ```C
   for(const auto& map_itr : resources)
   {
     // ...
   }
   ```
   El proceso de mejora implica un bucle que recorre cada recurso listado en un mapa (`resources`). En este mapa, el nombre de cada recurso es la clave, y la cantidad a deducir del balance del jugador es el valor. Este paso es crucial para ajustar con precisión el balance de recursos del jugador según los costos de las mejoras que desean aplicar a sus objetos.

3. **Obtención de la Clave y Búsqueda en la Tabla de Recursos**:

   ```C
   const uint64_t& key_id = stringToUint64(map_itr.first);
   auto resources_table_itr = resources_table.require_find(key_id, ("No se encontró el balance de " + map_itr.first).c_str());
   ```
   Obtener un identificador único (`key_id`) a partir de una cadena y usarlo para encontrar la entrada correspondiente en la tabla `resources_table`.

4. **Verificación de Suficiencia del Balance**:

   ```C
   check(resources_table_itr->amount >= map_itr.second, ("Balance insuficiente: " + map_itr.first).c_str());
   ```
   Verificar si hay suficientes fondos en el balance para realizar el retiro.

5. **Actualización de la Tabla de Recursos**:

   ```C
   if(resources_table_itr->amount == map_itr.second)
     resources_table.erase(resources_table_itr);
   else
   {
     resources_table.modify(resources_table_itr, get_self(), [&](auto &new_row)
     {
       new_row.amount -= map_itr.second;
     });
   }
   ```
   - Si la cantidad del recurso en el balance es igual a la cantidad a restar (`map_itr.second`), entonces se elimina el registro correspondiente de la tabla.
   - De lo contrario, se actualiza la cantidad del recurso, reduciéndola en la cantidad adecuada. La función `modify` actualiza una entrada en la tabla.

### Mejora del Objeto de Granja

El siguiente código describe cómo mejorar un objeto de granja:

```C
void game::upgfarmitem(const name& owner, const uint64_t& farmingitem_to_upgrade, const bool& staked)
{
    require_auth(owner);

    if(staked)
    {
        auto assets     = atomicassets::get_assets(get_self());
        auto asset_itr  = assets.require_find(farmingitem_to_upgrade, ("No se encontró el objeto apostado [" + std::to_string(farmingitem_to_upgrade) +"]").c_str());

        staked_t staked_table(get_self(), owner.value);
        staked_table.require_find(farmingitem_to_upgrade, "No se encontró el objeto de granja apostado");

        upgrade_farmingitem(asset_itr, get_self());
    }
    else
    {
        auto assets     = atomicassets::get_assets(owner);
        auto asset_itr  = assets.require_find(farmingitem_to_upgrade, ("No posees el objeto de granja [" + std::to_string(farmingitem_to_upgrade) +"]").c_str());
        upgrade_farmingitem(asset_itr, owner);
    }
}
```

### Pasos Principales de la Función de Mejora

1. **Confirmación de Autenticación**:

   ```C
   require_auth(owner);
   ```
   Verificar que la transacción esté autorizada por el propietario (`owner`).

2. **Comprobación de si el Objeto Está Apostado**:

   ```C
   if(staked)
   {
       auto assets = atomicassets::get_assets(get_self());
       auto asset_itr = assets.require_find(farmingitem_to_upgrade, ("No se encontró el objeto apostado [" + std::to_string(farmingitem_to_upgrade) +"]").c_str());

       staked_t staked_table(get_self(), owner.value);
       staked_table.require_find(farmingitem_to_upgrade, "No se encontró el objeto de granja apostado");
   }
   else
   {
       auto assets = atomicassets::get_assets(owner);
       auto asset_itr = assets.require_find(farmingitem_to_upgrade, ("No posees el objeto de granja [" + std::to_string(farmingitem_to_upgrade) +"]").c_str());
   }
   ```
   Dependiendo de si el objeto de granja está apostado, se realizan diferentes pasos para verificar la propiedad o el estado de apuesta del objeto.

3. **Mejora del Objeto de Granja**:

   ```C
   upgrade_farmingitem(asset_itr, get_self());
   ```
   Llamar a la función `upgrade_farmingitem` para mejorar el objeto de granja. La función toma un iterador al NFT y el nombre del propietario.

### Lógica de Mejora del Objeto de Granja

```C
void pixelfarm::upgrade_farmingitem(atomicassets::assets_t::const_iterator& assets_itr, const name& owner)
{
    auto mdata          = get_mdata(assets_itr);
    auto template_idata = get_template_idata(assets_itr->template_id, assets_itr->collection_name);

    check(std::get<uint8_t>(mdata["slots"])++ < std::get<uint8_t>(template_idata["maxSlots"]), "El objeto de granja tiene el máximo de espacios");

    update_mdata(assets_itr, mdata, owner);
}
```

1. **Obtención de Metadatos y Datos de Plantilla**:

   ```C
   auto mdata = get_mdata(assets_itr);
   auto template_idata = get_template_idata(assets_itr->template_id, assets_itr->collection_name);
   ```
   Obtener los metadatos y los datos de la plantilla para el procesamiento del activo.

2. **Comprobación del Número de Espacios**:

   ```C
   check(std::get<uint8_t>(mdata["slots"])++ < std::get<uint8_t>(template_idata["maxSlots"]), "El objeto de granja tiene el máximo de espacios");
   ```
   Verificar si el número de espacios del objeto de granja después del incremento no excede el número máximo de espacios definido en la plantilla del NFT. Ten en cuenta que aquí se usa un incremento posterior (`++` antes de `std::get<uint8_t>(mdata["slots"])`), por lo que el valor de espacios se incrementará antes de la comparación.

3. **Actualización de los Datos del Objeto de Granja**:

   ```C
   update_mdata(assets_itr, mdata, owner);
   ```
   Actualizar los metadatos del objeto de granja en la tabla utilizando la función `update_mdata`. Esta función se usa para guardar los nuevos datos después de una mejora.

### Próximos Pasos

En el siguiente artículo, cubriremos una función similar, que es la creación de nuevos objetos, también conocidos como "blends".

PS. [El siguiente enlace](https://github.com/dapplicaio/GamItemUpgrades) lleva a un repositorio que corresponde a todo lo descrito, para que puedas simplemente construir ese código y usarlo como desees.

