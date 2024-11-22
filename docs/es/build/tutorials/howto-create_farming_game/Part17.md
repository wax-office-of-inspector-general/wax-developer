---
title: Parte 17. Sistemas de misiones en el juego
order: 85
---

En este artículo, agregaremos un sistema de misiones que nos permitirá interactuar más con los jugadores en nuestros juegos.

1.  **Agreguemos las tablas necesarias**

```cpp
struct quest
{
    std::string type;
    float required_amount;
    float current_amount;
};

struct [[eosio::table]] quests_j
{
    name player;
    std::vector<quest> quests;

    uint64_t primary_key() const {return player.value;};
};
typedef multi_index<"quests"_n, quests_j> quests_t;
```

La estructura **quest** denota un triple (tipo de misión, cantidad requerida de acciones/recursos/tokens, cantidad actual de acciones/recursos/tokens), donde el tipo de misión indica lo que el jugador necesita hacer. Ejemplos de tipos se encuentran más adelante.

La tabla de misiones consta de las siguientes columnas (jugador, misiones[]).

**2\. Agregar y eliminar misiones**

```cpp
void game::addquest(
    const name &player,
    const std::string &type,
    float required_amount)
{
    quests_t quests_table(get_self(), get_self().value);
    auto player_iter = quests_table.find(player.value);

    quest temp_quest = {type, required_amount, 0.0f};

    if (player_iter == quests_table.end())
    {
        quests_table.emplace(get_self(), [&](auto& new_row)
        {
            new_row.player = player;
            new_row.quests = {temp_quest};
        });
    }
    else
    {
        quests_table.modify(player_iter, get_self(), [&](auto& row)
        {
            row.quests.push_back(temp_quest);
        });
    }
}
```

Aquí tomamos el puntero a la tabla. Si hay un jugador, agregamos una nueva misión al vector ya creado. Si no hay un jugador, creamos una fila para él o ella y agregamos la misión al vector.

```cpp
void game::cmpltquest(
    const name &player,
    uint32_t quest_index)
{
    quests_t quests_table(get_self(), get_self().value);
    auto player_iter = quests_table.require_find(player.value, "No such quest");

    check(player_iter->quests.size() > quest_index, "Index outside of scope");

    quest temp = player_iter->quests[quest_index];
    check(temp.current_amount >= temp.required_amount, "Quest conditions are not met");

    quests_table.modify(player_iter, get_self(), [&](auto& row){
        row.quests.erase(row.quests.begin() + quest_index);
    });
}
```

Tomamos el iterador a la tabla. Verificamos si hay un campo para este jugador. Luego verificamos si hay una misión para este índice en el vector. Comprobamos si se cumplen los requisitos de la misión. Si es así, eliminamos esta misión del array.

**3\. Conectar el sistema de misiones con otros sistemas del juego**

Presentemos varios tipos de misiones como ejemplo.

**"Staking" -- apostar X herramientas**

```cpp
update_quests(owner, "staking", items_to_stake.size());
```

Se agregó una línea en la función **stake_items** que actualiza la información sobre la cantidad de herramientas apostadas.

**"Swap" -- intercambiar X tokens**

```cpp
update_quests(owner, "swap", tokens2receive.amount);
```

Se agregó una línea en la función **swap** que actualiza la información sobre la cantidad de tokens intercambiados por recursos.

**"Upgrade" -- mejorar un ítem al nivel X**

```cpp
update_quests(owner, "upgrade", new_level, true);
```

Se agregó una línea en la función **upgrade_item**, actualizando la información sobre el nivel al que el jugador ha mejorado una herramienta.

**"Tokens" -- apostar X tokens**

```cpp
update_quests(owner, "tokens", quantity.amount);
```

Se agregó una línea en la función **increase_tokens_balance**, actualizando la información sobre la cantidad de tokens apostados en el balance del jugador.

**"Stone/Wood/etc." -- recolectar X recurso**

```cpp
for (const auto& resource_amount_pair : mined_resources)
{
    update_quests(owner, resource_amount_pair.first, resource_amount_pair.second);
}
```

Se agregó una línea en la función **claim**. Recorremos los nombres de los recursos e ingresamos la información sobre cuántos de ellos el jugador ha obtenido.

```cpp
void game::update_quests(const name &player, const std::string &type, float update_amount, bool set)
{
   quests_t quests_table(get_self(), get_self().value);
   auto player_iter = quests_table.require_find(player.value, "No such quest");

   quests_table.modify(player_iter, get_self(), [&](auto& row){
       for (auto& quest : row.quests)
       {
           if (quest.type == type)
           {
               if (!set)
               {
                   quest.current_amount += update_amount;
               }
               else
               {
                   quest.current_amount = std::max(quest.current_amount, update_amount);
               }
           }
       }
   });
}
```

Esta función recorre las misiones del jugador. Si el tipo de misión coincide con el que queremos actualizar, actualizamos el **current_amount** de esta misión. Por ejemplo, un jugador ha obtenido 10 árboles y tiene dos misiones para recolectar árboles con valores actuales de 20, 100. Después de llamar a la función, se convertirán en 30 y 110.

PS. Este artículo muestra un sistema de misiones simple y robusto, que se puede actualizar a medida que avanzamos, ya que es posible que no sepamos qué tipos de misiones necesitaremos en el futuro.

**PS. PS.** El [siguiente enlace](https://github.com/dapplicaio/GamingQuests) lleva a un repositorio que corresponde a todo lo descrito.