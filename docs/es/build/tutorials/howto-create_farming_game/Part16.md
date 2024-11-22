---
title: Parte 16. Clasificaciones en juegos
order: 80
---

En este artículo, analizaremos la creación de tablas de clasificación y consideraremos la implementación de una clasificación para los recursos de los usuarios y su tasa de minería general.

1.  **Nuevas tablas**

```cpp
 struct [[eosio::table]] lboard_j
  {
    name account;
    uint64_t points;

    uint64_t primary_key() const { return account.value; };
  };
  typedef multi_index<"lboards"_n, lboard_j> lboards_t;

```

points -- el valor de los puntos en la tabla de clasificación

account -- el nombre de la cuenta para la cual registramos los puntos

**2\. Actualización de puntos en la tabla de clasificación**

Para modificar los valores de los puntos en la tabla de clasificación, introduciremos tres funciones: aumentar, disminuir y establecer un cierto número de puntos. Consideremos la última, las otras se realizan de la misma manera.

```cpp
void incr_lb_points(const name &lbname, const name &account, uint64_t points);
void decr_lb_points(const name &lbname, const name &account, uint64_t points);
void set_lb_points(const name &lbname, const name &account, uint64_t points);
```

```cpp
void game::set_lb_points(const name &lbname, const name &account, uint64_t points)
{
    lboards_t lboard(get_self(), lbname.value);

    auto account_itr = lboard.find(account.value);

    if (account_itr == std::end(lboard))
    {
        lboard.emplace(get_self(), [&](auto &new_row)
                       {
            new_row.account = account;
            new_row.points = points; });
    }
    else
    {
        lboard.modify(account_itr, get_self(), [&](auto &row)
                      { row.points = points; });
    }
}
```

Descripción de la función:

1) Obtenemos el puntero a la tabla de clasificación por el nombre de la tabla. Luego encontramos el registro con el jugador

```cpp
lboards_t lboard(get_self(), lbname.value);
auto account_itr = lboard.find(account.value);
```

2) Si el jugador no está en la tabla, lo añadimos. Si ya está, actualizamos el valor de los puntos

```cpp
if (account_itr == std::end(lboard))
{
    lboard.emplace(get_self(), [&](auto &new_row)
                       {
    new_row.account = account;
    new_row.points = points; });
}
else
{
    lboard.modify(account_itr, get_self(), [&](auto &row)
                    { row.points = points; });
}
```

**3\. Uso de las tablas de clasificación para los registros de recursos**

En las funciones **increase_owner_resource_balance** y **decrease_owner_resource_balance**, añada las siguientes líneas dentro del bucle que recorre el mapa con los recursos

```cpp
eosio::name resource_name(static_cast<std::string_view>(resources_table_itr->resource_name));
set_lb_points(resource_name, owner, resources_table_itr->amount);
```

La primera de ellas crea **eosio::name** a partir de una cadena que denota el nombre del recurso. Es decir, es una tabla de clasificación de madera o piedra, etc. Luego establecemos el valor ya calculado del recurso en la tabla.

**4\. Uso de las tablas de clasificación para la tasa de minería**

Al final de las funciones **stake_items** y **upgradeitem**, agregue una línea con la función **update_mining_power_lb**, que recalcula la nueva tasa total de minería y la ingresa en la tabla de clasificación.

```cpp
void game::update_mining_power_lb(const name &account)
{
    staked_t staked_table(get_self(), account.value);
    float mining_power = 0.0f;

    const std::map<std::string, uint32_t> stats = get_stats(account);
    auto assets = atomicassets::get_assets(get_self());

    for (const auto &staked : staked_table)
    {
        auto farmingitem_itr = assets.find(staked.asset_id);
        auto farmingitem_mdata = get_mdata(farmingitem_itr);

        float miningBoost = 1;
        if (farmingitem_mdata.find("miningBoost") != std::end(farmingitem_mdata))
            miningBoost = std::get<float>(farmingitem_mdata["miningBoost"]);

        for (const uint64_t asset_id : staked.staked_items)
        {
            mining_power += get_mining_power(asset_id, stats);
        }
    }

    set_lb_points("miningpwr"_n, account, mining_power);
}
```

Descripción de la función:

1.  Tome el puntero a la tabla donde se encuentran todos los ítems apostados. Obtenemos un mapa con las características del jugador. Tome el puntero a la tabla de activos.

```cpp
staked_t staked_table(get_self(), account.value);
float mining_power = 0.0f;

const std::map<std::string, uint32_t> stats = get_stats(account);
auto assets = atomicassets::get_assets(get_self());
```

2. Recorra todos los ítems apostados. Para cada uno, tomamos un puntero a su activo y encontramos el valor de **miningBoost**. Luego, para cada activo dentro del ítem apostado, calculamos la tasa de minería y la sumamos al total

```cpp
for (const auto &staked : staked_table)
{
    auto farmingitem_itr = assets.find(staked.asset_id);
    auto farmingitem_mdata = get_mdata(farmingitem_itr);

    float miningBoost = 1;
    if (farmingitem_mdata.find("miningBoost") != std::end(farmingitem_mdata))
        miningBoost = std::get<float>(farmingitem_mdata["miningBoost"]);

    for (const uint64_t asset_id : staked.staked_items)
    {
        mining_power += get_mining_power(asset_id, stats);
    }
}
```

3. Actualice la tasa de minería para este jugador en la tabla de clasificación

```cpp
set_lb_points("miningpwr"_n, account, mining_power);
```

Considere la función utilizada para calcular la tasa de minería de un ítem

```cpp
float game::get_mining_power(const uint64_t asset_id, const std::map<std::string, uint32_t> &stats)
{
    auto assets = atomicassets::get_assets(get_self());
    auto assets_itr = assets.require_find(asset_id, "asset not found");

    auto item_mdata = get_mdata(assets_itr);
    auto item_template_idata = get_template_idata(assets_itr->template_id, assets_itr->collection_name);

    const float &miningRate = std::get<float>(item_template_idata["miningRate"]);

    uint8_t current_lvl = 1;

    if (item_mdata.find("level") != std::end(item_mdata))
    {
        current_lvl = std::get<uint8_t>(item_mdata["level"]);
    }

    const uint8_t upgrade_percentage = 2 + stats.at("vitality") / 10.0f;

    float miningRate_according2lvl = miningRate + stats.at("productivity") / 10.0f;
    for (uint8_t i = 1; i < current_lvl; ++i)
        miningRate_according2lvl = miningRate_according2lvl + (miningRate_according2lvl * upgrade_percentage / 100);

    return miningRate_according2lvl;
}
```

Repite completamente la lógica de cálculo del activo de la tasa de minería, que se describió en artículos anteriores y se utilizó en **claim** y **upgradeitem**.

En este artículo, describimos cómo podemos crear varias tablas de clasificación en el juego, que es una de las funciones principales.

**PS.** El [siguiente enlace](https://github.com/dapplicaio/GameLeaderboards) lleva a un repositorio que corresponde a todo lo descrito.