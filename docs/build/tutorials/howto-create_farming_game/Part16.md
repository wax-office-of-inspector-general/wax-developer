Part 16: Leaderboards in games
===

In this article, we will analyze the creation of leaderboards and consider the implementation of a leaderboard for user resources and their overall mining rate.

1.  **New tables**

```cpp
 struct [[eosio::table]] lboard_j
  {
    name account;
    uint64_t points;

    uint64_t primary_key() const { return account.value; };
  };
  typedef multi_index<"lboards"_n, lboard_j> lboards_t;

```

points -- the value of points in the leaderboard

account -- the name of the account for which we record points

**2\. Updating points in leaderboard**

To modify the values of the points in the leaderboard, we will introduce three functions: increase, decrease, and set a certain number of points. Let's consider the last one, the others are done in the same way.

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

Function description:

1) Take the pointer to the leaderboard table by the name of the leaderboard. Then we found the record with the player

```cpp
lboards_t lboard(get_self(), lbname.value);
auto account_itr = lboard.find(account.value);
```

2) If the player is not in the table, add him or her to the table. If there is, update the points value

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

**3\. Using leaderboards for resource records**

In the **increase_owner_resource_balance** and **decrease_owner_resource_balance** functions, add the following lines inside the loop that runs through the map with resources

```cpp
eosio::name resource_name(static_cast<std::string_view>(resources_table_itr->resource_name));
set_lb_points(resource_name, owner, resources_table_itr->amount);

```

The first of them creates **eosio::name** from a string denoting the name of the resource. That is, it is a leaderboard of wood or stone, etc. Then we set the already calculated value of the resource in the table.

**4\. Using leaderboards for mining rate**

At the very end of the stake_items and **upgradeitem** functions, add a line with the **upgrade_mining_power_lb** function, which recalculates the new total mining rate and enters it into the leaderboard.

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

Function description:

1.  Take the pointer to the table where all the stacked items are located. We get a map with the player's characteristics. Take the pointer to the table of assets.

```cpp
staked_t staked_table(get_self(), account.value);
float mining_power = 0.0f;

const std::map<std::string, uint32_t> stats = get_stats(account);
auto assets = atomicassets::get_assets(get_self());
```

2\. Go through all the staked items. For each one, we take a pointer to its asset and find the value of miningBoost. Then, for each asset inside the staked one, we calculate the mining rate and add it to the total amount

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

3\. Update the mining rate for this player in the leaderboard

```cpp
set_lb_points("miningpwr"_n, account, mining_power);
```

Consider the function used to calculate the mining rate of an item

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

It completely repeats the logic of calculating the mining rate asset, which was described in previous articles and was used in claim and **upgradeitem**.

In this article, we described on how we can create various leaderboards in the game, which is one of core function

**PS.** The [Following link](https://github.com/dapplicaio/GameLeaderboards) leads us to a repository that corresponds everything described.