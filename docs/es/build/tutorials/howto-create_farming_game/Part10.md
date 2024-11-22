---
title: Parte 10. Implementación de avatares en juegos WAX
order: 50
---

Este artículo explorará cómo crear avatares y su equipo, enfocándose en los aspectos de personalización que mejoran la experiencia del jugador. Al detallar el proceso de diseño de avatares y la selección de sus accesorios, nuestro objetivo es brindar ideas para construir elementos de juego más atractivos e interactivos, permitiendo a los jugadores sumergirse profundamente en el mundo del juego con personajes que reflejen su estilo y preferencias.

### 1. Creación de categorías

Crear una categoría de avatares implica definir un personaje con características específicas, que luego pueden ser mejoradas al equipar ítems. Este paso fundamental permite la personalización de los avatares, proporcionando a los jugadores la capacidad de adaptar los personajes a su estilo de juego y preferencias, enriqueciendo así la experiencia de juego al agregar profundidad al desarrollo e interacción del personaje dentro del mundo del juego.

![](/public/assets/images/tutorials/howto-create_farming_game/part10/image1.png)

| Nombre del Atributo | Tipo de Atributo | Descripción                                      |
|---------------------|------------------|----------------------------------------------------|
| name                | string           | Nombre del avatar                                  |
| description         | string           | Descripción de la historia y propiedades del avatar |
| img                 | image            | Imagen del avatar                                  |
| economic            | uint32           | Reduce el costo de mejora                          |
| productivity        | uint32           | Aumenta la tasa de extracción                      |
| vitality            | uint32           | Incrementa el porcentaje de mejora                 |
| bravery             | uint32           | Afecta a las misiones                              |
| diplomacy           | uint32           | Afecta las interacciones con otros jugadores       |

Tabla 1: Atributos del "avatar"

Crear una categoría para los ítems de equipo refleja el proceso de creación de avatares, ya que cada pieza de equipo también posee características distintas.

![](/public/assets/images/tutorials/howto-create_farming_game/part10/image2.png)

| Nombre del Atributo | Tipo de Atributo | Descripción                                             |
|---------------------|------------------|---------------------------------------------------------|
| name                | string           | Nombre del ítem                                         |
| description         | string           | Descripción de la historia y propiedades del ítem       |
| img                 | image            | Imagen del ítem                                         |
| type                | string           | Representa el tipo de ítem (joyería, bandera, corona, etc.)|
| economic            | uint32           | Reduce el costo de mejora                                |
| productivity        | uint32           | Aumenta la tasa de extracción                            |
| vitality            | uint32           | Incrementa el porcentaje de mejora                       |
| bravery             | uint32           | Afecta a las misiones                                    |
| diplomacy           | uint32           | Afecta las interacciones con otros jugadores             |

Tabla 2: Atributos del "equipo"

### 2. Creación de plantillas

A continuación, se presenta un ejemplo de cómo crear un avatar y un ítem de equipo.

![](/public/assets/images/tutorials/howto-create_farming_game/part10/image3.png)

![](/public/assets/images/tutorials/howto-create_farming_game/part10/image4.png)

La acuñación de avatares y equipo sigue los procesos descritos en artículos anteriores, que implican la creación y registro de estos elementos en la blockchain.

### 3. Agregar nuevas tablas al código del contrato

Agregar una tabla que vincule a cada jugador con su avatar activo y los ítems equipados es un paso estratégico de desarrollo. Esta tabla no solo hace seguimiento de los avatares y ítems que están en uso actualmente, sino que también facilita las interacciones dentro del juego, como batallas o recolección de recursos, en función de los atributos de los ítems equipados.

```C
struct [[eosio::table]] avatars_j
  {
    name owner;
    std::vector<uint64_t> equipment;

    uint64_t primary_key() const { return owner.value; }
  };
  typedef multi_index< "avatarsc"_n, avatars_j> avatars_t;
```

- **owner**: La cuenta que usa el avatar y el equipo.
- **equipment**: Un vector de identificadores `uint64_t` que indica el avatar y equipo activos.

Crear una tabla para las estadísticas del jugador implica agregar los atributos del avatar y los ítems equipados para reflejar las capacidades actuales del jugador dentro del juego.

```C
struct [[eosio::table]] stats_j
  {
    name owner;
    std::map<std::string, uint32_t> stats;

    uint64_t primary_key() const {return owner.value;}
  };
  typedef multi_index<"stats"_n, stats_j> stats_t;
```

- **owner**: Una cuenta cuyas características se especifican en la tabla.
- **stats**: Un mapa que contiene las características en el formato `{"economic": 10, "bravery": 7, etc}`.

### 4. Lógica para establecer avatares y equipo

La lógica para establecer avatares y equipo en el juego implica que los jugadores seleccionen su personaje y lo equipen con varios ítems para mejorar sus estadísticas.

```C
 else if (memo == "set avatar")
  {
    check(asset_ids.size() == 1, "You must transfer only one avatar");
    set_avatar(from, asset_ids[0]);
  }
  else if (memo == "set equipment")
  {
    check(asset_ids.size() <= 4, "You can wear only 4 different equipment types at once");
    set_equipment_list(from, asset_ids);
  }
```

Incorporar dos opciones de memo en la función `receive_asset_transfer()` permite a los jugadores establecer su avatar transfiriendo un NFT de avatar con el memo "set avatar" o equipar hasta cuatro ítems diferentes especificando **"set equipment"**. La función luego asigna el asset del avatar transferido con el `asset_id` especificado al registro del propietario del usuario, actualizando efectivamente el personaje o la configuración de equipo del jugador en el juego.

```C
void game::set_avatar(const name &owner, const uint64_t &asset_id)
{
  auto assets = atomicassets::get_assets(get_self());
  auto asset_itr = assets.find(asset_id);

  check(asset_itr->collection_name == "collname"_n, "Wrong collection");
  check(asset_itr->schema_name == "avatar"_n, "Not an avatar asset");

  avatars_t avatars_table(get_self(), get_self().value);
  auto owner_avatar_itr = avatars_table.find(owner.value);

  if (owner_avatar_itr == std::end(avatars_table))
  {
    avatars_table.emplace(get_self(), [&](auto &new_row)
                          {
         new_row.owner = owner;
         new_row.equipment.resize(5);
         new_row.equipment[0] = asset_id; });
  }
  else
  {
    // should return avatar asset back to player
    const uint64_t old_avatar_id = owner_avatar_itr->equipment[0];

    const std::vector<uint64_t> assets_to_transfer = {old_avatar_id};
    const std::string memo = "return avatar";

    action(
        permission_level{get_self(), "active"_n},
        atomicassets::ATOMICASSETS_ACCOUNT,
        "transfer"_n,
        std::make_tuple(
            get_self(),
            owner,
            assets_to_transfer,
            memo))
        .send();

    avatars_table.modify(owner_avatar_itr, get_self(), [&](auto &row)
                         { row.equipment[0] = asset_id; });
  }

  recalculate_stats(owner);
}
```

1. **Validación del asset transferido**:
   La función tiene como propósito validar el asset transferido por el jugador, asegurándose de que pertenece a la colección correcta y categoría para avatares o equipo.
   
   ```C
   auto assets = atomicassets::get_assets(get_self());
   auto asset_itr = assets.find(asset_id);

   check(asset_itr->collection_name == "collname"_n, "Wrong collection");
   check(asset_itr->schema_name == "avatar"_n, "Not an avatar asset");
   ```

2. **Recuperar información del jugador de la tabla de avatares**:
   Para actualizar el avatar de un jugador en el juego, la función recupera la información del jugador desde la tabla de avatares usando su nombre de usuario.

   ```C
   avatars_t avatars_table(get_self(), get_self().value);
   auto owner_avatar_itr = avatars_table.find(owner.value);
   ```

3. **Agregar un nuevo jugador a la tabla de avatares**:
   Si el usuario no existe aún en la tabla de avatares, la función lo añade configurando un vector con cinco elementos inicializados en ceros. Luego, el ID del avatar se coloca en la primera posición de este vector, registrando efectivamente el nuevo avatar bajo el nombre de usuario del jugador.

   ```C
   if (owner_avatar_itr == std::end(avatars_table))
   {
     avatars_table.emplace(get_self(), [&](auto &new_row)
                           {
          new_row.owner = owner;
          new_row.equipment.resize(5);
          new_row.equipment[0] = asset_id; });
   }
   ```

4. **Actualizar el avatar de un jugador existente**:
   Si el jugador ya existe en la tabla de avatares, la función actualiza su avatar con el nuevo proporcionado en el argumento. Luego, el avatar anterior es devuelto al jugador a través de un `atomicassets::transfer`, asegurando que el jugador retenga la propiedad de su avatar anterior.

   ```C
   else
   {
     // should return avatar asset back to player
     const uint64_t old_avatar_id = owner_avatar_itr->equipment[0];

     const std::vector<uint64_t> assets_to_transfer = {old_avatar_id};
     const std::string memo = "return avatar";

     action(
         permission_level{get_self(), "active"_n},
         atomicassets::ATOMICASSETS_ACCOUNT,
         "transfer"_n,
         std::make_tuple(
             get_self(),
             owner,
             assets_to_transfer,
             memo))
         .send();

     avatars_table.modify(owner_avatar_itr, get_self(), [&](auto &row)
                          { row.equipment[0] = asset_id; });
   }
   ```

5. **Recalcular Estadísticas**:

```Cpp
  recalculate_stats(owner);
```

Este paso recalcula las estadísticas del jugador después de actualizar su avatar o equipo, asegurándose de que todos los bonos o cambios se reflejen con precisión en el perfil del jugador.

### Resumen de la función para equipar ítems

La función para equipar ítems implica listar los IDs de los assets del equipo que serán usados por el avatar del jugador. Este proceso verifica la compatibilidad de cada ítem con el avatar y actualiza la lista de equipo del jugador en la base de datos del juego.

```Cpp
void game::set_equipment_list(const name &owner,
const std::vector<uint64_t> &asset_ids)
{
  std::vector<uint64_t> assets_to_return;

  std::map<std::string, uint32_t> equiped_types;
  equiped_types.insert(std::pair<std::string, uint32_t>("flag", 0));
  equiped_types.insert(std::pair<std::string, uint32_t>("jewelry", 0));
  equiped_types.insert(std::pair<std::string, uint32_t>("crown", 0));
  equiped_types.insert(std::pair<std::string, uint32_t>("cloak", 0));

  for (uint64_t asset_id : asset_ids)
  {
    set_equipment_item(owner, asset_id, assets_to_return, equiped_types);
  }

  const std::string memo = "return equipment";

  action(
      permission_level{get_self(), "active"_n},
      atomicassets::ATOMICASSETS_ACCOUNT,
      "transfer"_n,
      std::make_tuple(
          get_self(),
          owner,
          assets_to_return,
          memo))
      .send();

  recalculate_stats(owner);
}
```

### Descripción de la función:

1. **Preparar para los cambios**:
   Crear un vector para almacenar los IDs de los assets del equipo que serán devueltos y un mapa para asegurarse de que cada tipo de equipo sea equipado no más de una vez.

   ```Cpp
   std::vector<uint64_t> assets_to_return;

   std::map<std::string, uint32_t> equiped_types;
   equiped_types.insert(std::pair<std::string, uint32_t>("flag", 0));
   equiped_types.insert(std::pair<std::string, uint32_t>("jewelry", 0));
   equiped_types.insert(std::pair<std::string, uint32_t>("crown", 0));
   equiped_types.insert(std::pair<std::string, uint32_t>("cloak", 0));
   ```

2. **Equipar nuevos ítems**:
   Iterar a través de los IDs de assets proporcionados, equipando cada ítem mientras se respeta la regla de que cada tipo de equipo solo puede ser usado una vez.

   ```Cpp
   for (uint64_t asset_id : asset_ids)
   {
     set_equipment_item(owner, asset_id, assets_to_return, equiped_types);
   }
   ```

3. **Actualizar y devolver**:
   Devolver cualquier ítem antiguo al inventario del jugador y recalcular las características del jugador en base a la nueva configuración de equipo para reflejar los cambios en las habilidades o estadísticas del jugador de manera precisa.

   ```Cpp
   const std::string memo = "return equipment";

   action(
       permission_level{get_self(), "active"_n},
       atomicassets::ATOMICASSETS_ACCOUNT,
       "transfer"_n,
       std::make_tuple(
           get_self(),
           owner,
           assets_to_return,
           memo))
       .send();

   recalculate_stats(owner);
   ```

### Función para Equipar un Ítem Individual

La función `set_equipment_item` maneja el equipamiento de un solo ítem (`asset_id`) en el jugador (`owner`). El vector `assets_to_return` almacena los ítems que deben ser devueltos, y `equiped_types` lleva un registro de la cantidad de ítems usados de cada tipo de equipo.

```Cpp
void game::set_equipment_item(const name &owner, const uint64_t asset_id,
std::vector<uint64_t> &assets_to_return, std::map<std::string, uint32_t> &equiped_types)
{
  avatars_t avatars_table(get_self(), get_self().value);

  auto owner_avatar_itr = avatars_table.find(owner.value);
  check(owner_avatar_itr != std::end(avatars_table), "You can put equipment only when you have an avatar");

  auto assets = atomicassets::get_assets(get_self());
  auto asset_itr = assets.find(asset_id);
  auto equipment_template_idata = get_template_idata(asset_itr->template_id, asset_itr->collection_name);

  check(asset_itr->collection_name == "collname"_n, "Wrong collection");
  check(asset_itr->schema_name == "equip"_n, "Not an equipment item");

  uint32_t position = 0;
  const std::string type = std::get<std::string>(equipment_template_idata["type"]);

  equiped_types[type]++;
  check(equiped_types[type] <= 1, "You can wear only 4 different equipment types at once");

  if (type == "flag")
  {
    position = 1;
  }
  else if (type == "jewelry")
  {
    position = 2;
  }
  else if (type == "crown")
  {
    position = 3;
  }
  else if (type == "cloak")
  {
    position = 4;
  }
  else
  {
    check(false, "Wrong type of equipment");
  }

  const uint64_t old_equip_id = owner_avatar_itr->equipment[position];

  if (old_equip_id != 0)
  {
    assets_to_return.push_back(old_equip_id);
  }

  avatars_table.modify(owner_avatar_itr, get_self(), [&](auto &row)
                       { row.equipment[position] = asset_id; });
}
```

Esta función asegura que cada ítem equipado sea compatible con el avatar del jugador y que las ranuras de equipo sean gestionadas adecuadamente, devolviendo el equipo antiguo al inventario del jugador si es reemplazado.

### Descripción de la Función:

1. **Verificar la Presencia del Jugador**:
   Verificar la presencia del jugador en la tabla de equipo y avatares; terminar si no está presente. Asegurarse de que el asset, de la colección y tipo correctos, apunta correctamente en la tabla de assets. Cargar los datos de plantilla inmutables en `equipment_template_idata`.

   ```Cpp
   avatars_t avatars_table(get_self(), get_self().value);

   auto owner_avatar_itr = avatars_table.find(owner.value);
   check(owner_avatar_itr != std::end(avatars_table), "You can put equipment only when you have an avatar");

   auto assets = atomicassets::get_assets(get_self());
   auto asset_itr = assets.find(asset_id);
   auto equipment_template_idata = get_template_idata(asset_itr->template_id, asset_itr->collection_name);

   check(asset_itr->collection_name == "collname"_n, "Wrong collection");
   check(asset_itr->schema_name == "equip"_n, "Not an equipment item");
   ```

2. **Determinar el Tipo y Posición del Equipo**:
   Identificar el tipo de equipo, incrementando su conteo en el mapa. Si es un duplicado, emitir un error. Determinar la variable `position` basada en el tipo de equipo para la colocación del nuevo ID.

   ```Cpp
   int32_t position = 0;
   const std::string type = std::get<std::string>(equipment_template_idata["type"]);

   equiped_types[type]++;
   check(equiped_types[type] <= 1, "You can wear only 4 different equipment types at once");

   if (type == "flag")
   {
     position = 1;
   }
   else if (type == "jewelry")
   {
     position = 2;
   }
   else if (type == "crown")
   {
     position = 3;
   }
   else if (type == "cloak")
   {
     position = 4;
   }
   else
   {
     check(false, "Wrong type of equipment");
   }
   ```

3. **Actualizar el Equipo y Devolver Ítems Antiguos**:
   Si se encuentra un ítem existente en la posición, agregar su ID al vector de retorno. Actualizar la tabla con el nuevo asset.

   ```Cpp
   const uint64_t old_equip_id = owner_avatar_itr->equipment[position];

   if (old_equip_id != 0)
   {
     assets_to_return.push_back(old_equip_id);
   }

   avatars_table.modify(owner_avatar_itr, get_self(), [&](auto &row)
                        { row.equipment[position] = asset_id; });
   ```

4. **Recalcular Estadísticas**:
   Recalcular las características del jugador en base a la nueva configuración de equipo.

   ```Cpp
   void game::recalculate_stats(const name &owner)
   {
     stats_t stats_table(get_self(), get_self().value);
     auto stats_itr = stats_table.find(owner.value);

     std::map<std::string, uint32_t> stats;

     // inicializar estadísticas
     stats.insert(std::pair<std::string, uint32_t>("economic", 0));
     stats.insert(std::pair<std::string, uint32_t>("productivity", 0));
     stats.insert(std::pair<std::string, uint32_t>("vitality", 0));
     stats.insert(std::pair<std::string, uint32_t>("bravery", 0));
     stats.insert(std::pair<std::string, uint32_t>("diplomacy", 0));

     // leer estadísticas
     avatars_t avatars_table(get_self(), get_self().value);
     auto avatar_itr = avatars_table.require_find(owner.value, "Your avatar was deleted");

     auto assets = atomicassets::get_assets(get_self());

     for (uint64_t asset_id : avatar_itr->equipment)
     {
       if (asset_id == 0)
       {
         continue;
       }

       auto asset_itr = assets.find(asset_id);
       auto equipment_template_idata = get_template_idata(asset_itr->template_id, asset_itr->collection_name);

       for (auto &key_value_pair : stats)
       {
         if (equipment_template_idata.find(key_value_pair.first) != std::end(equipment_template_idata))
         {
           key_value_pair.second += std::get<uint32_t>(equipment_template_idata[key_value_pair.first]);
         }
       }
     }

     if (stats_itr == std::end(stats_table))
     {
       stats_table.emplace(get_self(), [&](auto &new_row)
                           {
         new_row.owner = owner;
         new_row.stats = stats; });
     }
     else
     {
       stats_table.modify(stats_itr, get_self(), [&](auto &row)
                          { row.stats = stats; });
     }
   }
   ```

**La función para calcular las características del jugador implica varios pasos clave:**

1. **Recuperar las estadísticas del jugador y los avatares de sus respectivas tablas, inicializando las características a cero.**

   ```Cpp
   stats_t stats_table(get_self(), get_self().value);
   auto stats_itr = stats_table.find(owner.value);

   std::map<std::string, uint32_t> stats;

   // inicializar estadísticas
   stats.insert(std::pair<std::string, uint32_t>("economic", 0));
   stats.insert(std::pair<std::string, uint32_t>("productivity", 0));
   stats.insert(std::pair<std::string, uint32_t>("vitality", 0));
   stats.insert(std::pair<std::string, uint32_t>("bravery", 0));
   stats.insert(std::pair<std::string, uint32_t>("diplomacy", 0));

   // leer estadísticas
   avatars_t avatars_table(get_self(), get_self().value);
   auto avatar_itr = avatars_table.require_find(owner.value, "Your avatar was deleted");
   ```

2. **Procesar activos activos, omitiendo cualquier ID que sea 0, y leer los datos de la plantilla para cada activo.**

   ```Cpp
   auto assets = atomicassets::get_assets(get_self());

   for (uint64_t asset_id : avatar_itr->equipment)
   {
     if (asset_id == 0)
     {
       continue;
     }

     auto asset_itr = assets.find(asset_id);
     auto equipment_template_idata = get_template_idata(asset_itr->template_id, asset_itr->collection_name);
   ```

3. **Calcular Características**:
   Iterar a través de todas las características a calcular, como se indica en el mapa. Si una característica está presente en un ítem, agregarla al valor total.

   ```Cpp
   for (auto &key_value_pair : stats)
   {
     if (equipment_template_idata.find(key_value_pair.first) != std::end(equipment_template_idata))
     {
       key_value_pair.second += std::get<uint32_t>(equipment_template_idata[key_value_pair.first]);
     }
   }
   ```

   `key_value_pair` son pares del tipo {"economic", 0}, {"bravery", 0}, etc. Si un elemento tiene la característica "economic" con un valor de 3, entonces después de este código, el campo "economic" en el mapa de stats se actualizará a 3.

4. **Sumar Valores y Actualizar la Tabla de Estadísticas**:
   Sumar los valores de cada característica listada en el mapa, añadiéndolos al total si están presentes en el ítem.

   ```Cpp
   if (stats_itr == std::end(stats_table))
   {
     stats_table.emplace(get_self(), [&](auto &new_row)
                         {
       new_row.owner = owner;
       new_row.stats = stats; });
   }
   else
   {
     stats_table.modify(stats_itr, get_self(), [&](auto &row)
                        { row.stats = stats; });
   }
   ```

5. **Modificación de la Función Claim**:
   Actualizar la función claim para reflejar las características del jugador.

   ```Cpp
   std::map<std::string, uint32_t> stats = get_stats(owner);
   ```

   Esto recupera las características actuales del jugador.

   ```Cpp
   const uint8_t upgrade_percentage = 2 + stats["vitality"] / 10.0f;

   const std::pair<std::string, float> item_reward = claim_item(assets_itr, upgrade_percentage, time_now, stats);
   ```

   Ahora `upgrade_percentage` no es una constante, sino que depende de la característica "vitality". La función `claim_item` también acepta `stats` para evitar recalculaciones innecesarias.

6. **Modificación del Cálculo de la Tasa de Minado**:

   ```Cpp
   float miningRate_according2lvl = miningRate + stats.at("productivity") / 10.0f;
   ```

   La tasa de minado ahora también depende de la característica "productivity".

**Cambios en la Función Upgradeitem**:

1. **Actualizar Características y Llamar a Claim Item Actualizado**:

   ```Cpp
   std::map<std::string, uint32_t> stats = get_stats(owner);
   const uint8_t upgrade_percentage = 2 + stats["vitality"] / 10.0f;
   const std::pair<std::string, float> item_reward = claim_item(asset_itr, upgrade_percentage, time_now, stats);
   ```

   Para leer las características del jugador y calcular `upgrade_percentage`, la función llama al `claim_item` actualizado. El `upgrade_percentage` ahora depende de la característica "vitality" del jugador.

   ```Cpp
   upgrade_item(asset_itr, upgrade_percentage, owner, next_level, time_now, stats);
   ```

   La función `upgrade_item` ahora acepta `stats` para evitar recalculaciones innecesarias.

2. **Cálculo de la Tasa de Minado y Precio del Recurso en upgrade_item**:

   ```Cpp
   float miningRate_according2lvl = mining_rate + stats.at("productivity") / 10.0f;
   ```

   Aquí, la tasa de minado (`miningRate_according2lvl`) se actualiza para depender de la característica "productivity" del jugador.

   ```Cpp
   const float &resource_price = upgrade_time * miningRate_according2lvl * (1.0f - stats.at("economic") / 100.0f);
   ```

   El `resource_price` ahora disminuye a medida que crece la característica "economic", haciendo que las mejoras sean más baratas para los jugadores con estadísticas "economic" más altas.

3. **Función get_stats**:

   ```Cpp
   std::map<std::string, uint32_t> game::get_stats(const name &owner)
   {
     std::map<std::string, uint32_t> stats;
     stats_t stats_table(get_self(), get_self().value);
     auto stats_itr = stats_table.find(owner.value);

     if (stats_itr == std::end(stats_table))
     {
       stats.insert(std::pair<std::string, uint32_t>("economic", 0));
       stats.insert(std::pair<std::string, uint32_t>("productivity", 0));
       stats.insert(std::pair<std::string, uint32_t>("vitality", 0));
       stats.insert(std::pair<std::string, uint32_t>("bravery", 0));
       stats.insert(std::pair<std::string, uint32_t>("diplomacy", 0));
     }
     else
     {
       stats = stats_itr->stats;
     }

     return stats;
   }
   ```

   **Explicación**:

   1. **Inicialización**: Se crea un mapa para contener los resultados de la función, y se establece un puntero a la entrada del jugador en la tabla de stats utilizando su nombre.

   2. **Comprobar las Estadísticas del Jugador**: Si el jugador no se encuentra en la tabla, la función devuelve un mapa con todas las características en cero. Si el jugador se encuentra, recupera y devuelve sus stats de la tabla, resumiendo efectivamente sus atributos actuales en el juego.

Este artículo profundiza en la creación y gestión de avatares y su equipo en un juego, describiendo el proceso desde la creación inicial de la categoría de avatares hasta la asignación dinámica de equipo. Cubre la integración de avatares con la mecánica del juego, como el staking y la reclamación de recompensas, y enfatiza la importancia de la personalización para mejorar la experiencia del jugador.

El artículo también aborda los aspectos técnicos de configurar y actualizar las estadísticas del jugador en función de los elementos equipados, asegurando un entorno de juego rico e interactivo.

**PD.** El [siguiente enlace](https://github.com/dapplicaio/GameAvatars) lleva a un repositorio que corresponde a todo lo descrito, por lo que puedes simplemente construir ese código y usarlo como desees.