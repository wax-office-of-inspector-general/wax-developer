---
title: Parte 9. Mezclas de NFTs para juegos en WAX
order: 45
---

En este artículo, siguiendo el anterior sobre la mejora de los elementos de agricultura, nos adentraremos en la creación de mezclas. Mezclar implica combinar elementos específicos para crear nuevos o mejorados dentro del juego. Esta característica agrega profundidad y estrategia al juego, ofreciendo a los jugadores la oportunidad de elaborar elementos únicos con un valor o utilidad potencialmente más altos.

Vamos a delinear las adiciones de código necesarias para implementar esta funcionalidad, enriqueciendo los elementos interactivos del juego y el compromiso del jugador.

```C
 //scope:contract
 struct [[eosio::table]] blends_j
 {
   uint64_t              blend_id;
   std::vector<int32_t>  blend_components;
   int32_t               resulting_item;

   uint64_t primary_key() const { return blend_id; }
 };
 typedef multi_index< "blends"_n, blends_j > blends_t;
```

Introducir una nueva tabla para guardar recetas de mezclas enriquece el juego al permitir la creación de elementos únicos mediante combinaciones. Los administradores pueden definir recetas, que los jugadores luego usan para mezclar elementos, especificando:

- **blend_id**: Un identificador único para cada receta.

- **blend_components**: La lista de plantillas de NFT requeridas para la mezcla.

- **resulting_item**: El ID de la nueva plantilla de NFT creada a partir de la mezcla.

Esta característica añade una capa estratégica, alentando a los jugadores a recolectar NFTs específicos para crear elementos más valiosos o poderosos.

Agregar una función para que el administrador del contrato cree nuevas mezclas es un paso estratégico de desarrollo.

```C
void game::addblend(
  const std::vector<int32_t>  blend_components,
  const int32_t resulting_item
)
{
  require_auth(get_self());

  blends_t blends_table(get_self(), get_self().value);

  const uint64_t new_blend_id = blends_table.available_primary_key();

  blends_table.emplace(get_self(), [&](auto new_row)
  {
    new_row.blend_id = new_blend_id;
    new_row.blend_components = blend_components;
    new_row.resulting_item = resulting_item;
  });
}
```

```C
 require_auth(get_self());
```

Implementar esta función asegura que solo el administrador del contrato tenga la autoridad para crear nuevas mezclas.

```C
const uint64_t new_blend_id = blends_table.available_primary_key();
```

La función `available_primary_key` está diseñada para proporcionar una clave incremental única para nuevas entradas en una tabla. Si las claves existentes en la tabla son 1, 5 y 8, la función devolverá 9, asegurando que cada nueva entrada reciba un identificador distinto.

```C
 blends_table.emplace(get_self(), [&](auto new_row)
  {
    new_row.blend_id = new_blend_id;
    new_row.blend_components = blend_components;
    new_row.resulting_item = resulting_item;
  });
```

Crear un nuevo registro en la tabla implica especificar los campos necesarios como se describió anteriormente.

Para integrar la mezcla en el juego, expandiremos la función `receive_asset_transfer`, que se utilizó previamente para apostar elementos. Esta mejora implica agregar condiciones a la declaración if para reconocer y procesar las transacciones de mezcla.

```C
 else if(memo.find("blend:") != std::string::npos)
 {
   const uint64_t blend_id = std::stoll(memo.substr(6));
   blend(from, asset_ids, blend_id);
 }
```

Para mezclar, los jugadores necesitan transferir sus NFTs al contrato, de manera similar al staking, pero deben incluir un memo específico que indique la acción de mezcla y el blend_id, como "blend:blend_id" (por ejemplo, "blend:18"). Este método asegura que el contrato reconozca la intención del jugador de mezclar elementos utilizando la receta especificada.

```C
 const uint64_t blend_id = std::stoll(memo.substr(6));
```

Extraer el ID de mezcla del memo es un paso crucial en el proceso de mezcla, permitiendo que el contrato identifique qué receta de mezcla el jugador pretende usar.

```C
blend(from, asset_ids, blend_id);
```
Después de extraer el ID de mezcla del memo, el siguiente paso implica llamar a una función auxiliar.

```C
void game::blend(const name& owner, const std::vector<uint64_t> asset_ids, const uint64_t& blend_id)
{
    auto assets = atomicassets::get_assets(get_self());
    auto templates = atomicassets::get_templates(get_self());
    blends_t blends_table(get_self(), get_self().value);
    auto blends_table_itr = blends_table.require_find(blend_id, "Could not find blend id");
    check(blends_table_itr->blend_components.size() == asset_ids.size(), "Blend components count mismatch");

    std::vector<int32_t> temp = blends_table_itr->blend_components;
    for(const uint64_t& asset_id : asset_ids)
    {
        auto assets_itr = assets.find(asset_id);
        check(assets_itr->collection_name == name("collname"), // reemplaza "collname" con el nombre de tu colección para verificar NFTs falsos
         ("Collection of asset [" + std::to_string(asset_id) + "] mismatch").c_str());
        auto found =  std::find(std::begin(temp), std::end(temp), assets_itr->template_id);
        if(found != std::end(temp))
            temp.erase(found);

        action
        (
            permission_level{get_self(),"active"_n},
            atomicassets::ATOMICASSETS_ACCOUNT,
            "burnasset"_n,
            std::make_tuple
            (
                get_self(),
                asset_id
            )
        ).send();
    }
    check(temp.size() == 0, "Invalid blend components");

    auto templates_itr = templates.find(blends_table_itr->resulting_item);

    action
    (
        permission_level{get_self(),"active"_n},
        atomicassets::ATOMICASSETS_ACCOUNT,
        "mintasset"_n,
        std::make_tuple
        (
            get_self(),
            get_self(),
            templates_itr->schema_name,
            blends_table_itr->resulting_item,
            owner,
            (atomicassets::ATTRIBUTE_MAP) {}, // datos inmutables
            (atomicassets::ATTRIBUTE_MAP) {}, // datos mutables
            (std::vector <asset>) {} // token de respaldo
        )
    ).send();
}
```

### Explicación Detallada de la Función de Mezcla

1. **Extracción de Información de Activos y Plantillas**:

   ```C
   auto assets = atomicassets::get_assets(get_self());
   auto templates = atomicassets::get_templates(get_self());
   ```
   El proceso implica extraer información detallada sobre los NFTs actualmente en poder del contrato. Este paso es esencial para identificar más adelante los NFTs enviados por el usuario, permitiendo la extracción de todos los datos relevantes de la plantilla necesarios para el proceso de mezcla.

2. **Verificación de la Existencia de la Mezcla y del Conteo de Componentes**:

   ```C
   blends_t blends_table(get_self(), get_self().value);
   auto blends_table_itr = blends_table.require_find(blend_id, "Could not find blend id");
   check(blends_table_itr->blend_components.size() == asset_ids.size(), "Blend components count mismatch");
   ```
   Primero, el proceso implica verificar la tabla de mezclas para comprobar si la mezcla especificada por el jugador existe; de no ser así, se lanza un error. Luego, es esencial confirmar que el jugador ha enviado la cantidad correcta de NFTs requeridos para la mezcla, asegurando el cumplimiento de las especificaciones de la receta de mezcla.

3. **Verificación de los Componentes de la Mezcla**:

   ```C
   std::vector<int32_t> temp = blends_table_itr->blend_components;
   for(const uint64_t& asset_id : asset_ids)
   {
       // ...
   }
   ```
   Se crea una variable temporal para asegurar que el jugador ha enviado los componentes correctos para la mezcla. Este paso es seguido por una iteración sobre todos los NFTs proporcionados por el jugador, verificando cada uno contra los requisitos de la mezcla.

4. **Verificación de la Colección de NFTs y Quema de Activos**:

   ```C
   auto assets_itr = assets.find(asset_id);
   check(assets_itr->collection_name == name("collname"), // reemplaza "collname" con el nombre de tu colección para verificar NFTs falsos
        ("Collection of asset [" + std::to_string(asset_id) + "] mismatch").c_str());
   ```
   Durante el proceso de verificación de la mezcla, se extrae la información de cada NFT enviado para asegurar que pertenece a la colección del juego. Esto implica verificar si el nombre de la colección del NFT coincide con el nombre especificado de la colección del juego, lo cual requiere reemplazar "collname" con el nombre real de tu colección en el código.

5. **Eliminación de Plantillas Coincidentes y Quema de los NFTs**:

   ```C
   auto found = std::find(std::begin(temp), std::end(temp), assets_itr->template_id);
   if(found != std::end(temp))
       temp.erase(found);

   action
   (
       permission_level{get_self(),"active"_n},
       atomicassets::ATOMICASSETS_ACCOUNT,
       "burnasset"_n,
       std::make_tuple
       (
           get_self(),
           asset_id
       )
   ).send();
   ```
   El proceso de mezcla implica una verificación meticulosa contra la receta de mezcla, usando una variable temporal que contiene los ID de plantillas de la mezcla. Para cada NFT enviado, el sistema verifica su plantilla contra la variable temporal. Si se encuentra una coincidencia, esa plantilla se elimina de la variable para evitar duplicados e identificar cualquier plantilla incorrecta enviada por el jugador. Tras esta verificación, se llama a la función de quema.

6. **Verificación Final de la Mezcla**:

   ```C
   check(temp.size() == 0, "Invalid blend components");
   ```
   El siguiente paso en el proceso de mezcla es asegurar que el vector temporal, que contiene los componentes de la receta de mezcla, esté vacío. Esto verifica que el jugador haya enviado correctamente todos los componentes requeridos para la mezcla. Si el vector está vacío, se confirma que todos los componentes fueron enviados y procesados correctamente, permitiendo que la mezcla se complete con éxito.

7. **Creación del NFT Resultante**:

   ```C
   auto templates_itr = templates.find(blends_table_itr->resulting_item);

   action
   (
       permission_level{get_self(),"active"_n},
       atomicassets::ATOMICASSETS_ACCOUNT,
       "mintasset"_n,
       std::make_tuple
       (
           get_self(),
           get_self(),
           templates_itr->schema_name,
           blends_table_itr->resulting_item,
           owner,
           (atomicassets::ATTRIBUTE_MAP) {}, // datos inmutables
           (atomicassets::ATTRIBUTE_MAP) {}, // datos mutables
           (std::vector<asset>) {} // token de respaldo
       )
   ).send();
   ```
   Una vez que se completa toda la verificación, el sistema crea un nuevo NFT con la plantilla especificada, representando el resultado de la mezcla.

### Conclusión

Este artículo te ha guiado a través del proceso de crear mezclas en un juego, desde configurar recetas de mezcla hasta verificar las entregas de los jugadores y crear nuevos NFTs. Cubre la verificación de los componentes de los NFTs contra los requisitos de la mezcla, asegurando que todos los componentes sean enviados correctamente y concluyendo con la creación de un nuevo elemento que resulta de la mezcla. Este mecanismo de mezcla enriquece la jugabilidad al permitir a los jugadores combinar NFTs en nuevos activos más valiosos, fomentando un compromiso más profundo con el ecosistema del juego.

**PD.** El [enlace siguiente](https://github.com/dapplicaio/GamingItemBlend) lleva a un repositorio que corresponde a todo lo descrito, por lo que puedes simplemente construir ese código y usarlo como desees.


