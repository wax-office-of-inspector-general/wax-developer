---
title: Parte 14. Gobernanza en juegos
order: 70
---

En este artículo, desarrollaremos un sistema de votación que permitirá a los usuarios proporcionar sugerencias a los desarrolladores o cambiar el valor de algunos aspectos del juego.

1. Creando la tabla de configuraciones

```cpp
struct [[eosio::table]] mconfig_j
  {
    std::string variable_name;
    std::string variable_type;
    std::string variable_value;

    uint64_t primary_key() const { return stringToUint64(variable_name); }
  };
  typedef multi_index<"config"_n, mconfig_j> mconfigs_t;

```

La tabla se organiza en filas (nombre de la variable, tipo de variable, valor de la variable).

```cpp
typedef std::variant<float, uint32_t, int32_t, std::string> CONFIG_TYPE;

void game::setcnfg(
    const std::string &variable_name,
    const CONFIG_TYPE &variable)
{
    require_auth(get_self());
    mconfigs_t configs_table(get_self(), get_self().value);

    auto var_iter = configs_table.find(stringToUint64(variable_name));

    auto variant_data = get_config_variant_data(variable);

    if (var_iter == configs_table.end())
    {
        configs_table.emplace(get_self(), [&](auto &new_row)
                              {
        new_row.variable_name = variable_name;
        new_row.variable_type = variant_data.first;
        new_row.variable_value = variant_data.second; });
    }
    else
    {
        check(var_iter->variable_type == variant_data.first, "Types mismatch");
        configs_table.modify(var_iter, get_self(), [&](auto &row)
                             { row.variable_value = variant_data.second; });
    }
}

```

El tipo **CONFIG_TYPE** indica los tipos válidos para las variables de configuración. La acción **setcnfg** acepta el nombre de la variable y su valor (junto con el tipo, la plataforma **eosio** verifica por sí misma el tipo correcto). Si esta variable está presente en la tabla de configuración, verificamos si el tipo de la variable coincide con el pasado por el usuario y cambiamos el campo de la tabla. Si la variable no está en la tabla, la agregamos.

```cpp
std::pair<std::string, std::string> game::get_config_variant_data(const CONFIG_TYPE &var)
{
    if (std::holds_alternative<std::string>(var))
    {
        return {"string", std::get<std::string>(var)};
    }
    else if (std::holds_alternative<float>(var))
    {
        return {"float", std::to_string(std::get<float>(var))};
    }
    else if (std::holds_alternative<uint32_t>(var))
    {
        return {"uint32", std::to_string(std::get<uint32_t>(var))};
    }
    else if (std::holds_alternative<int32_t>(var))
    {
        return {"int32", std::to_string(std::get<int32_t>(var))};
    }
    else
    {
        return {"error", ""};
    }
}

```

Esta función auxiliar traduce los datos de **CONFIG_TYPE** en un par (tipo de variable, valor de la variable).

2. Tablas principales

```cpp
struct [[eosio::table]] votings_info_j
  {
    name voting_name;
    name creator;
    uint64_t min_staked_tokens;
    uint64_t max_staked_tokens;
    uint64_t total_staked;
    uint32_t creation_time;
    uint32_t time_to_vote;
    std::string variable_to_change;

    uint64_t primary_key() const { return voting_name.value; };
  };
  typedef multi_index<"vtsinfo"_n, votings_info_j> vinfo_t;
```

Esta tabla registra la información de las votaciones en una tabla separada. Con su ayuda, podemos ver el número total de tokens apostados, verificar si el tiempo de votación ha expirado, entre otros.

3. Creando votaciones

```cpp
  struct [[eosio::table]] voting_j
  {
    uint64_t id;
    std::string voting_option;
    std::map<name, uint64_t> voted;
    uint64_t total_voted_option;

    uint64_t primary_key() const { return id; }
  };
  typedef multi_index<"genvtngs"_n, voting_j> votings_t;

```

Esta tabla (scope: el nombre de la votación) almacena las opciones de votación y el std::map con pares (jugador, número de tokens apostados), así como la cantidad total de tokens apostados para esta opción.

```cpp
 struct [[eosio::table]] closed_votings_j
  {
    uint64_t voting_id;
    name voting_name;
    std::string winner_option;

    uint64_t primary_key() const { return voting_id; };
  };
  typedef multi_index<"closedvts"_n, closed_votings_j> closed_votings_t;
```

Esta tabla almacena pares (votación, resultado de la votación).

4. Creando votaciones

```cpp
void game::crgenvt(
    const name &player,
    const name &voting_name,
    const std::vector<std::string> &options,
    uint64_t min_staked_tokens,
    uint32_t time_to_vote,
    uint64_t max_staked_tokens)

{
    require_auth(player);
    vinfo_t vinfo(get_self(), get_self().value);
    check(vinfo.find(voting_name.value) == std::end(vinfo), "Voting with this name is active");

    // agregar a la información

    vinfo.emplace(get_self(), [&](auto &new_row)
                  {
        new_row.voting_name = voting_name;
        new_row.creator = player;
        new_row.min_staked_tokens = min_staked_tokens;
        new_row.max_staked_tokens = max_staked_tokens;
        new_row.total_staked = 0;
        new_row.creation_time = current_time_point().sec_since_epoch();
        new_row.time_to_vote = time_to_vote; });

    add_voting_with_options(voting_name, options);
}
```

Esta función escribe los datos de la votación en la tabla **vtsinfo** y añade campos a la tabla **genvtngs** (nombre de la opción, mapa con los votantes, cantidad total de tokens apostados para la opción).

```cpp
void game::cravote(
    const name &player,
    const name &voting_name,
    const std::string &variable_name,
    const std::vector<CONFIG_TYPE> &options_typed,
    int64_t min_staked_tokens,
    int32_t time_to_vote,
    uint64_t max_staked_tokens)
{
    require_auth(player);
    vinfo_t vinfo(get_self(), get_self().value);
    check(vinfo.find(voting_name.value) == std::end(vinfo), "Voting with this name is active");

    // verificar la corrección del tipo

    std::vector<std::string> options;
    mconfigs_t configs_table(get_self(), get_self().value);
    auto config_iter = configs_table.require_find(stringToUint64(variable_name), "No such variable in configs table");
    std::string variable_type = config_iter->variable_type;

    for (const auto &option : options_typed)
    {
        auto variant_data = get_config_variant_data(option);
        check(variant_data.first == variable_type, "Types mismatch in options");
        options.push_back(variant_data.second);
    }

    // agregar a la información

    vinfo.emplace(get_self(), [&](auto &new_row)
                  {
        new_row.voting_name = voting_name;
        new_row.creator = player;
        new_row.min_staked_tokens = min_staked_tokens;
        new_row.max_staked_tokens = max_staked_tokens;
        new_row.total_staked = 0;
        new_row.creation_time = current_time_point().sec_since_epoch();
        new_row.time_to_vote = time_to_vote;
        new_row.variable_to_change = variable_name; });

    add_voting_with_options(voting_name, options);
}
```

Esta función crea una votación que afecta alguna variable de la tabla de configuración. Primero, para cada opción, verificamos si su tipo coincide con el nombre de la variable. Si es así, añadimos la información de la votación a las tablas **vtsinfo** y **genvtngs**.

5. Añadiendo opciones de votación

```cpp
void game::add_voting_with_options(const name &voting_name, const std::vector<std::string> &options)
{
    votings_t votings(get_self(), voting_name.value);

    for (uint64_t index = 0; index < options.size(); index++)
    {
        votings.emplace(get_self(), [&](auto &new_row)
                        {
            new_row.id = index;
            new_row.voting_option = options[index];
            new_row.voted = {};
            new_row.total_voted_option = 0; });
    }
}
```

Esta es una función auxiliar que añade filas a la tabla **genvtngs** (id, nombre de la opción, mapa con votantes, número total de tokens).

**6. Proceso de votación**

```cpp
void game::gvote(
    const name &player,
    const name &voting_name,
    const std::string &voting_option,
    uint64_t voting_power)
{
    require_auth(player);
    balance_t balance_table(get_self(), get_self().value);
    auto player_balance_iter = balance_table.require_find(player.value, "No tokens staked");
    check(player_balance_iter->quantity.amount >= voting_power, "Not enough tokens to vote with that voting power");

    vinfo_t vinfo(get_self(), get_self().value);
    auto voting_info_iter = vinfo.require_find(voting_name.value, "No such voting");

    // verificar el tiempo

    if (voting_info_iter->time_to_vote != 0)
    {
        check((current_time_point().sec_since_epoch() - voting_info_iter->creation_time) <= voting_info_iter->time_to_vote,
              "Time for voting is over");
    }

    // verificar límite máximo

    if (voting_info_iter->max_staked_tokens != 0)
    {
        check(voting_info_iter->total_staked < voting_info_iter->max_staked_tokens, "Max limit for staking is reached");
    }

    votings_t votings(get_self(), voting_name.value);
    auto option_iter = votings.end();
    auto current_iter = votings.end();
    uint64_t id = 0;

    while (true)
    {
        current_iter = votings.find(id);

        if (current_iter == votings.end())
        {
            break;
        }

        if (current_iter->voting_option == voting_option)
        {
            option_iter = current_iter;
        }

        check(current_iter->voted.find(player) == current_iter->voted.end(), "Already voted");

        id++;
    }

    check(option_iter != votings.end(), "No such option");

    votings.modify(option_iter, get_self(), [&](auto &row)
                   {
        row.voted[player] = voting_power;
        row.total_voted_option += voting_power; });

    vinfo.modify(voting_info_iter, get_self(), [&](auto &row)
                 { row.total_staked += voting_power; });

    balance_table.modify(player_balance_iter, get_self(), [&](auto& row)
    {
        row.quantity.amount -= voting_power;
    });

    // verificar límite máximo y cerrar si se ha alcanzado
    if (voting_info_iter->max_staked_tokens != 0)
    {
        if (voting_info_iter->total_staked >= voting_info_iter->max_staked_tokens)
        {
            if (voting_info_iter->variable_to_change.empty())
            {
                close_general_voting(voting_name);
            }
            else
            {
                close_automatic_voting(voting_name);
            }
        }
    }
}
```

Esta función gestiona el proceso de votación. Primero, verifica si el usuario tiene tokens, si son suficientes y si la votación a la que hace referencia existe. Luego, comprueba si el tiempo de votación ha expirado y si se ha alcanzado el límite superior de votos. Si es así, ya no es posible votar.

De lo contrario, revisa las opciones de votación y verifica si la opción a la que el jugador se refiere está entre ellas. También se verifica si ya ha votado antes. Si es así, se interrumpe la función.

Si se encuentra la opción, se modifica el campo de la tabla **genvtngs**: se añade al jugador al mapa std::map y se incrementa la cantidad total de tokens apostados para la opción. En la tabla **vtsinfo**, se incrementa el campo **total_tokens_staked**. También se descuentan del jugador la cantidad especificada de tokens.

Al final, se verifica si se ha alcanzado el número máximo de votos. Si es así, se cierra la votación.

**7. Cancelando un voto**

```cpp
void game::cancelvote(const name& player, const name& voting_name)
{
    require_auth(player);

    vinfo_t vinfo(get_self(), get_self().value);
    auto voting_info_iter = vinfo.require_find(voting_name.value, "No such voting");

    balance_t balance_table(get_self(), get_self().value);
    auto player_balance_iter = balance_table.require_find(player.value, "No staked tokens for this player");

    votings_t votings(get_self(), voting_name.value);
    auto option_iter = votings.end();
    auto current_iter = votings.end();

    uint64_t voting_power = 0;
    uint32_t id = 0;

    while (true)
    {
        current_iter = votings.find(id);

        if (current_iter == votings.end())
        {
            break;
        }

        auto player_voting_iter = current_iter->voted.find(player);
        if (player_voting_iter != current_iter->voted.end())
        {
            voting_power = player_voting_iter->second;

            votings.modify(current_iter, get_self(), [&](auto& row)
            {
                row.voted.erase(player_voting_iter);
                row.total_voted_option -=  voting_power;
            });

            break;
        }

        id++;
    }

    if (voting_power != 0)
    {
        vinfo.modify(voting_info_iter, get_self(), [&](auto& row)
        {
            row.total_staked -= voting_power;
        });

        balance_table.modify(player_balance_iter, get_self(), [&](auto& row)
        {
            row.quantity.amount += voting_power;
        });
    }
}
```

Esta funcionalidad permite a un jugador cancelar su voto en una encuesta. Se recorren las opciones de votación y, si se encuentra la que el jugador votó, se elimina del mapa, se reduce el número de tokens apostados en ambas tablas y se devuelven los tokens al jugador.

**8. Cerrando la votación**

```cpp
void game::clsvt(const name &voting_name)
{
    vinfo_t vinfo(get_self(), get_self().value);
    auto voting_info_iter = vinfo.require_find(voting_name.value, "No such voting");

    require_auth(voting_info_iter->creator);

    if (voting_info_iter->variable_to_change.empty())
    {
        close_general_voting(voting_name);
    }
    else
    {
        close_automatic_voting(voting_name);
    }
}
```

Debemos comprobar si existe dicha votación. Luego, llamamos a funciones separadas para dos tipos diferentes de votación.

```cpp
void game::close_general_voting(const name &voting_name)
{
    clear_voting_from_vinfo(voting_name);
    std::string winner = get_voting_winner_clear(voting_name);

    // agregar a las votaciones cerradas
    closed_votings_t closed_votings(get_self(), get_self().value);
    uint64_t voting_id = closed_votings.available_primary_key();

    closed_votings.emplace(get_self(), [&](auto &new_row)
                           {
        new_row.voting_id = voting_id;
        new_row.voting_name = voting_name;
        new_row.winner_option = winner; });
}
```

Primero, eliminamos los datos de la votación de la tabla **vtsinfo**. Luego obtenemos la opción con el mayor número de tokens apostados y eliminamos los campos de la tabla **genvtngs**. Como la votación es del tipo general, se añade una fila (id, nombre de la votación, opción ganadora) a la tabla con los resultados de la votación general.

**Cerrando votación automática**

```cpp
void game::close_automatic_voting(const name &voting_name)
{
    std::string variable_name = clear_voting_from_vinfo(voting_name);
    std::string winner = get_voting_winner_clear(voting_name);

    // realizar la transacción
    mconfigs_t config_table(get_self(), get_self().value);
    auto config_iter = config_table.require_find(stringToUint64(variable_name), "Variable in question was deleted");
    config_table.modify(config_iter, get_self(), [&](auto &row)
                        { row.variable_value = winner; });
}
```

Cerrar la votación automática difiere en que al final modificamos el valor de la variable en la tabla de configuración.

```cpp
std::string game::clear_voting_from_vinfo(const name &voting_name)
{
    vinfo_t vinfo(get_self(), get_self().value);
    auto voting_info_iter = vinfo.require_find(voting_name.value, "No such voting");

    std::string variable_name = voting_info_iter->variable_to_change;
    uint64_t min_staked = voting_info_iter->min_staked_tokens;
    uint64_t total_staked = voting_info_iter->total_staked;

    check(total_staked >= min_staked, "Minimal rate is not reached yet");

    if (voting_info_iter->time_to_vote != 0)
    {
        check((current_time_point().sec_since_epoch() - voting_info_iter->creation_time) >= voting_info_iter->time_to_vote,
              "Time for voting is not over yet");
    }

    if (voting_info_iter->max_staked_tokens != 0)
    {
        check(total_staked >= voting_info_iter->max_staked_tokens, "Voting limit is not reached yet");
    }

    vinfo.erase(voting_info_iter);

    return variable_name;
}
```

Esta función verifica si se cumplen las condiciones para cerrar la votación y elimina los datos de la misma de la tabla **vtsinfo**.

```cpp
std::string game::get_voting_winner_clear(const name &voting_name)
{
    std::string winner = "";
    uint64_t max_voted = 0;
    uint64_t id = 0;

    votings_t votings(get_self(), voting_name.value);

    balance_t balance_table(get_self(), get_self().value);

    while (true)
    {
        auto option_iter = votings.find(id);

        if (option_iter == votings.end())
        {
            break;
        }

        if (option_iter->total_voted_option > max_voted)
        {
            max_voted = option_iter->total_voted_option;
            winner = option_iter->voting_option;
        }

        for (const auto& player_amount : option_iter->voted)
        {
            auto player_balance_iter = balance_table.require_find(player_amount.first.value, "Player was deleted");
            balance_table.modify(player_balance_iter, get_self(), [&](auto& row)
            {
                row.quantity.amount += player_amount.second;
            });
        }

        votings.erase(option_iter);

        id++;
    }

    return winner;
}
```

Esta función recorre las opciones de votación, encuentra la opción ganadora y elimina las filas de la tabla **genvtngs** una por una. También devuelve los tokens del jugador a su balance.

En este artículo describimos paso a paso el proceso de crear una gobernanza mediante votaciones, para que los usuarios puedan influir en el diseño general del juego o en ciertas partes de la economía del juego.

**PD.** El [enlace siguiente](https://github.com/dapplicaio/GamesGovernane) nos lleva a un repositorio que corresponde a todo lo descrito.
 