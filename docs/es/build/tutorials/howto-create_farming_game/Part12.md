---
title: Parte 12. Intercambio de Tokens y Recursos
order: 60
---

En este artículo, ampliamos las discusiones anteriores sobre la mejora de elementos introduciendo un método para intercambiar recursos por tokens. Añadiremos una nueva tabla para realizar un seguimiento de los recursos, donde cada entrada incluye un `key_id` (ID numérico del recurso), `resource_name` (nombre del recurso), y un `ratio` que define cuántos recursos se convierten en un token. Por ejemplo, un ratio de 25 significa que 100 unidades de madera se intercambiarían por 4 tokens. También integraremos el contrato estándar `eosio.token`, cubierto previamente, para manejar estas transacciones.

```cpp
 struct [[eosio::table]] resourcecost
  {
    uint64_t     key_id;
    std::string  resource_name;
    float        ratio; // si el usuario intercambia 100 unidades de madera y el ratio es 25, significa que recibirá 4 tokens

    uint64_t primary_key() const { return key_id; }
  };
  typedef multi_index< "resourcecost"_n, resourcecost > resourcecost_t;

```

Continuando desde la configuración anterior, ahora nos enfocamos en optimizar el sistema de transacciones con tokens. Hemos preminteado toda la oferta de tokens y la hemos asignado al contrato del juego, permitiendo transferencias fluidas entre los jugadores. Sin embargo, una alternativa es acuñar tokens de manera dinámica según sea necesario, como cuando un jugador intercambia recursos por tokens, asegurando que se cree y distribuya la cantidad justa.

A continuación, implementaremos una función para crear entradas en la tabla `resourcecost`. Esta función, restringida a ser llamada solo por el contrato, facilitará la configuración o actualización de las tasas de intercambio entre recursos y tokens. El token GAME, integral para nuestro sistema, tiene 4 decimales y ya está distribuido al contrato del juego para interacciones activas.

```cpp
void game::setratio(const std::string& resource, const float& ratio)
{
  require_auth(get_self());

  const uint64_t key_id = stringToUint64(resource);
  resourcecost_t resourcecost_table(get_self(), get_self().value);
  auto resourcecost_table_itr = resourcecost_table.find(key_id);

  if(resourcecost_table_itr == std::end(resourcecost_table))
  {
    resourcecost_table.emplace(get_self(), [&](auto &new_row)
    {
      new_row.key_id = key_id;
      new_row.resource_name = resource;
      new_row.ratio = ratio;
    });
  }
  else
  {
    resourcecost_table.modify(resourcecost_table_itr, get_self(), [&](auto &new_row)
    {
      new_row.resource_name = resource;
      new_row.ratio = ratio;
    });
  }
}

```

Dado que el código de inicialización para agregar entradas a la tabla `resourcecost` refleja procesos descritos en artículos anteriores, no profundizaremos nuevamente en esos detalles aquí. Ahora que hemos establecido la relación recurso-token, el siguiente paso implica escribir la función de intercambio. Esta función manejará la conversión de recursos en tokens GAME, facilitando las transacciones de los jugadores dentro del entorno del juego.

```cpp
void game::swap(const name& owner, const std::string& resource, const float& amount2swap)
{
    require_auth(owner);

    resourcecost_t resourcecost_table(get_self(), get_self().value);
    auto resourcecost_table_itr = resourcecost_table.require_find(stringToUint64(resource), "No se pudo encontrar la configuración del costo del recurso");

    const float token_amount = amount2swap / resourcecost_table_itr->ratio;
    const asset tokens2receive = asset(token_amount * 10000, symbol("GAME", 4)); // cambiar al token que hayas implementado

    reduce_owner_resources_balance(owner, std::map<std::string, float>({{resource, amount2swap}}));
    tokens_transfer(owner, tokens2receive);
}

```

donde

**owner** -- jugador que desea realizar un intercambio

**resource** -- el nombre del recurso

**amount2swap** -- cantidad de recurso que el jugador quiere intercambiar por tokens.

Para ejecutar un intercambio de recursos por tokens en el juego:

1.  **Recuperación de Registro**: La función primero recupera el registro correspondiente de la tabla de recursos según el nombre del recurso especificado. Si el recurso no se encuentra, se lanza un error.
2.  **Cálculo de Tokens**: Luego, calcula el número de tokens que el jugador debería recibir en función de la cantidad de recurso que quiere intercambiar y el ratio predefinido en la tabla: *const float token_amount = amount2swap / resourcecost_table_itr->ratio;*
3.  **Creación del Activo Token**: Se crea una variable de tipo asset, que representa los tokens:
    Este paso formatea la cantidad de tokens para considerar los lugares decimales del token, asegurando que la cantidad correcta se procese para el intercambio:  *const asset tokens2receive = asset(token_amount * 10000, symbol("GAME", 4));*

La multiplicación por (10^4) es necesaria porque el token GAME se define con 4 lugares decimales. Para reflejar con precisión los decimales en las transacciones, la `token_amount` calculada debe ser escalada por 10,000. Además, la configuración del símbolo del token requiere dos parámetros: el nombre del token ("GAME") y su número de decimales (4). Esta configuración garantiza que la cantidad del token y su representación se manejen correctamente en el sistema para transacciones precisas y válidas.

Nota: Al hacer tu propio juego, asegúrate de reemplazar GAME con el nombre de tu token.

```cpp
 reduce_owner_resources_balance(owner, std::map<std::string, float>({{resource, amount2swap}}));
    tokens_transfer(owner, tokens2receive);
```

Ya estamos familiarizados con esta funcionalidad de la parte anterior y también añadiremos una función de transferencia de tokens.

```cpp
void game::tokens_transfer(const name& to, const asset& quantity)
{

  action
  (
    permission_level{get_self(),"active"_n},
    "tokencontr"_n, // cambiar al contrato del token implementado
    "transfer"_n,
    std::make_tuple
    (
      get_self(),
      to,
      quantity,
      std::string("")
    )
  ).send();
}

```

Para completar el proceso de intercambio de recursos por tokens, la función inicia una transferencia de tokens utilizando la funcionalidad de transferencia del token del contrato. Necesitarás reemplazar el nombre del contrato de token referenciado con el nombre de tu contrato de token específico para garantizar que la transferencia se alinee con la economía de tokens de tu juego y la configuración del contrato inteligente. Este paso finaliza el intercambio moviendo la cantidad calculada de tokens desde el contrato del juego a la cuenta del jugador.

Este artículo detalló el proceso de intercambio de recursos dentro del juego por tokens en un marco de contrato inteligente. Cubrió la configuración de una tabla para definir las tasas de conversión de recursos a tokens, el cálculo del número de tokens basado en los recursos enviados por los jugadores, y el manejo efectivo de transacciones de tokens asegurando que todos los datos se alineen con las características definidas del token. El enfoque estuvo en la integración sin problemas de estas funcionalidades en el ecosistema del juego, facilitando un mecanismo de intercambio dinámico que mejora la interacción de los jugadores y la economía del juego.

**PD.** El [siguiente enlace](https://github.com/dapplicaio/TokenSwaps) nos lleva a un repositorio que corresponde a todo lo descrito, para que puedas simplemente construir ese código y usarlo como quieras.