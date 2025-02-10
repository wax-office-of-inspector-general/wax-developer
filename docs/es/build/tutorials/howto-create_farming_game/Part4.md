---
title: Parte 4. Qué son los recursos y tokens en nuestro proceso de creación de juegos.
order: 20
---

En este artículo, nos sumergimos en dos elementos fundamentales: recursos y tokens.

### Recursos

Primero, los recursos. Piensa en ellos como los componentes básicos de la economía de tu juego. Son los materiales e ítems que los jugadores extraen, producen o adquieren durante el juego. Cada recurso tiene su propia identidad: rareza, habilidades de fabricación y formas de interactuar dentro del juego.

Los recursos no son solo objetos coleccionables; son intercambiables, utilizables y esenciales para el desarrollo de personajes y la fabricación de ítems. En nuestro juego, son la clave para intercambiar tokens y mejorar objetos. Además, están organizados en una tabla de balance de recursos específica para cada usuario.

![](/public/assets/images/tutorials/howto-create_farming_game/part4/resourcesandtokens-1024x140.png)

- **key_id**: Claves para buscar en la tabla, creadas convirtiendo el nombre del recurso en un número.
- **amount**: Cantidad del recurso adquirido.
- **resource_name**: Nombre del recurso.

A continuación, veamos un ejemplo práctico: código para agregar un recurso específico a la tabla de un jugador. Este fragmento de código muestra cómo actualizar el balance de recursos de un jugador en el juego.

```C
resources_t resources_table(get_self(), owner.value);
```

Ahora, abordemos la inicialización de la tabla de recursos para un jugador. Piense en ello como configurar una cuenta bancaria de recursos personal. Usamos `get_self()` para especificar nuestro contrato como la ubicación de la tabla, asegurando que los recursos estén vinculados al propietario correcto.

```C
const float       amount = 25.3;
const std::string resource_name = "wood";
const uint64_t    key_id = stringToUint64(resource_name);
```

Vamos a crear nuestras variables para inicializar el recurso:

- **amount**: Cantidad de recurso extraído.
- **resource_name**: Nombre del recurso.
- **key_id**: Generado a partir de una cadena, es decir, convierte la cadena en un número para escribir en la tabla.

```C
auto resources_table_itr = resources_table.find(key_id);
if (resources_table_itr == std::end(resources_table))
{
  resources_table.emplace(get_self(), [&](auto &new_row) {
    new_row.key_id        = key_id;
    new_row.resource_name = resource_name;
    new_row.amount        = amount;
  });
}
else
{
  resources_table.modify(resources_table_itr, get_self(), [&](auto &new_row) {
    new_row.amount += amount;
  });
}
```

A continuación, necesitamos verificar si dicha clave ya existe en la tabla. Si existe, simplemente modificamos la tabla.

```C
resources_table.modify(resources_table_itr, get_self(), [&](auto &new_row) {
  new_row.amount += amount;
});
```

En este segmento, profundizamos en el manejo del iterador de la tabla de recursos (`resources_table_itr`). Este iterador es crucial para actualizar las cantidades de recursos en nuestro contrato, representado por `get_self()`. Usamos una función lambda para editar el campo `amount`, sumando el nuevo valor al existente.

Además, si no existe un registro para un recurso específico, es importante agregar una nueva entrada para realizar un seguimiento preciso de los recursos de cada jugador.

```C
resources_table.emplace(get_self(), [&](auto &new_row) {
  new_row.key_id        = key_id;
  new_row.resource_name = resource_name;
  new_row.amount        = amount;
});
```

En esta parte, nos centramos en los parámetros para la gestión de recursos. El primer parámetro determina quién paga la transacción, lo cual es crucial para mantener la economía del juego. El segundo parámetro es una función lambda utilizada para agregar nuevos registros a la tabla de recursos.

Es importante tener en cuenta que los recursos en este diseño del juego no son transferibles entre usuarios. En cambio, son convertibles en tokens o utilizables dentro del juego, proporcionando un enfoque único para la gestión de recursos y la interacción del jugador.

### Ahora, hablemos de los tokens

Los tokens, en el mundo blockchain, son activos digitales que representan valor o bienes. Son versátiles y se utilizan para activos digitales, contratos inteligentes y más. En el ámbito de los juegos, son la moneda virtual para comprar, vender o poseer ítems únicos dentro del juego. Los tokens empoderan a los jugadores con una economía descentralizada y propiedad, mejorando la experiencia de play-to-earn.

En nuestro juego, usamos un contrato separado para los tokens basado en el estándar `eosio.token` común en WAX. Esta configuración garantiza una integración fluida de los tokens en el entorno del juego.

Puedes seguir este enlace para consultar la implementación estándar del token [aqui](https://github.com/EOSIO/eosio.contracts/tree/master/contracts/eosio.token).

En el próximo artículo, cubriremos el proceso de staking de NFTs como preparación para la agricultura de recursos o tokens.

