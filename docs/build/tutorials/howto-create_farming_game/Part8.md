---
title: Part 8. Upgrades of game items in WAX games
order: 40
---

In previous articles, we explored how to farm resources using our NFT. Now, we'll delve into upgrading items for more efficient resource mining. Upgrading items involves enhancing their capabilities, making them more effective at mining resources. This process is key to progressing and achieving higher efficiency in the game. We'll start by adding the necessary code to implement item upgrades, focusing on improving the performance of our NFTs for resource collection.

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

    //claiming mined resources before upgrade
    const std::pair<std::string, float> item_reward = claim_item(asset_itr, 2, time_now); // 2 is the percentage of increase in mine rate for each level
    if(item_reward != std::pair<std::string,float>())
    {
        if(item_reward.second > 0)
        {
            increase_owner_resources_balance(owner, std::map<std::string, float>({item_reward}));
        }
    }
    // upgrading
    upgrade_item(asset_itr, 2, owner, next_level, time_now); // 2 is the percentage of increase in mine rate for each level
}
```

1. **Authentication confirmation**:
   
   `require_auth(owner);`  
   
   Checking that the transaction is authorized by the owner (`owner`).

2. **Getting the current time**:

   `const int32_t& time_now = current_time_point().sec_since_epoch();`  
   
   Gets the current time in seconds from the epoch.

3. **Obtaining assets and checking the availability of an asset for an upgrade**:

   ```C
   auto assets     = atomicassets::get_assets(get_self());
   auto asset_itr  = assets.require_find(item_to_upgrade, ("Could not find staked item[" + std::to_string(item_to_upgrade) +"]").c_str());
   ```

   Obtaining assets and verifying the existence of an asset with an identifier `item_to_upgrade`.

4. **Obtaining the staking table and checking the availability of the upgrade stake**:

   ```C
   staked_t staked_table(get_self(), owner.value);
   auto staked_table_itr = staked_table.require_find(staked_at_farmingitem, "Could not find staked farming item");
   ```

   Get the staking table for the owner and check for the existence of a stake that matches the upgrade.

5. **Checking the presence of an asset in the stake**:

   ```C
   check(std::find(std::begin(staked_table_itr->staked_items), std::end(staked_table_itr->staked_items), item_to_upgrade) != std::end(staked_table_itr->staked_items),
       "Item [" + std::to_string(item_to_upgrade) + "] is not staked at farming item");
   ```

   Checking that the asset to be upgraded is actually in the stake.

6. **Collecting mined resources before upgrading**:

   ```C
   const std::pair<std::string, float> item_reward = claim_item(asset_itr, 2, time_now);
   if(item_reward != std::pair<std::string,float>())
   {
       if(item_reward.second > 0)
       {
           increase_owner_resources_balance(owner, std::map<std::string, float>({item_reward}));
       }
   }
   ```

   Call the `claim_item` function to collect mined resources before upgrading. If a reward is received, it is added to the owner's balance.

7. **Item upgrade**:

   ```C
   upgrade_item(asset_itr, 2, owner, next_level, time_now);
   ```

   Call the `upgrade_item` function to upgrade the asset. In this case, the upgrade is carried out with an increase in mining speed by 2% for each level.

Alongside detailing the item upgrade process, we'll also outline the auxiliary functions involved. These functions are crucial for implementing upgrades effectively, facilitating the enhancement of items' resource mining capabilities.

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
  check(current_lvl < new_level, "New level must be higher than current level");
  check(new_level <= std::get<uint8_t>(template_idata["maxLevel"]), "New level cannot be higher than max level");
  check(std::get<uint32_t>(mdata["lastClaim"]) < time_now, "Item is upgrading");

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
### Detailed Explanation of Upgrade Functions

1. **Obtaining Metadata and Template Data**:

   ```C
   auto mdata  = get_mdata(assets_itr);
   auto template_idata = get_template_idata(assets_itr->template_id, assets_itr->collection_name);
   ```
   Obtaining metadata and template data for asset processing.

2. **Obtaining the Required Values**:

   ```C
   const float& mining_rate   = std::get<float>(template_idata["miningRate"]);
   const uint8_t& current_lvl = std::get<uint8_t>(mdata["level"]);
   const std::string& resource_name = std::get<std::string>(template_idata["farmResource"]);
   ```
   Obtaining the mining rate, current level, and resource name for a given asset.

3. **Checking Conditions**:

   ```C
   check(current_lvl < new_level, "New level must be higher than the current level");
   check(new_level <= std::get<uint8_t>(template_idata["maxLevel"]), "New level cannot be higher than the max level");
   check(std::get<uint32_t>(mdata["lastClaim"]) < time_now, "Item is upgrading");
   ```
   Checking a number of conditions that must be met before upgrading an asset.

4. **Calculation of New Mining Speed Values**:

   ```C
   float miningRate_according2lvl = mining_rate;
   for(uint8_t i = 1; i < new_level; ++i)
     miningRate_according2lvl = miningRate_according2lvl + (miningRate_according2lvl * upgrade_percentage / 100);
   ```
   Calculation of the new mining speed, taking into account the percentage of improvement for each level.

5. **Calculation of the Cost of the Upgrade**:

   ```C
   const int32_t& upgrade_time  = get_upgrading_time(new_level) - get_upgrading_time(current_lvl);
   const float& resource_price = upgrade_time * miningRate_according2lvl;
   ```
   Calculation of upgrade time and upgrade cost based on the difference between the upgrade times of the new and current levels.

6. **Updating Data and Reducing the Balance of the Owner**:

   ```C
   std::get<uint8_t>(mdata["level"]) = new_level;
   std::get<uint32_t>(mdata["lastClaim"]) = time_now + upgrade_time;
   reduce_owner_resources_balance(owner, std::map<std::string, float>({{resource_name, resource_price}}));
   update_mdata(assets_itr, mdata, get_self());
   ```
   Update asset data, set new level and time of last upgrade. Reduction of the owner's balance by the cost of the upgrade. Updating the asset data table.

In addition to item upgrades, the code below includes a mechanism to deduct resources from the player's balance as payment for the upgrade.

```C
void game::reduce_owner_resources_balance(const name& owner, const std::map<std::string, float>& resources)
{
  resources_t resources_table(get_self(), owner.value);

  for(const auto& map_itr : resources)
  {
    const uint64_t& key_id = stringToUint64(map_itr.first);
    auto resources_table_itr = resources_table.require_find(key_id,
      ("Could not find balance of " + map_itr.first).c_str());
    check(resources_table_itr->amount >= map_itr.second, ("Overdrawn balance: " + map_itr.first).c_str());

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
### Detailed Explanation of Farming Item Upgrade

1. **Declaration and Initialization of the Resource Table**:

   ```C
   resources_t resources_table(get_self(), owner.value);
   ```
   Creating a table object `resources_table` to store the balance of resources for a specific owner (`owner`).

2. **Resource Loop**:

   ```C
   for(const auto& map_itr : resources)
   {
     // ...
   }
   ```
   The upgrade process involves a loop that goes through each resource listed in a map (`resources`). In this map, each resource's name is the key, and the amount to be deducted from the player's balance is the value. This step is crucial for accurately adjusting the player's resource balance according to the costs of the upgrades they wish to apply to their items.

3. **Obtaining the Key and Searching in the Resource Table**:

   ```C
   const uint64_t& key_id = stringToUint64(map_itr.first);
   auto resources_table_itr = resources_table.require_find(key_id, ("Could not find balance of " + map_itr.first).c_str());
   ```
   Obtaining a unique identifier (`key_id`) from a string and using it to find the corresponding entry in the `resources_table` table.

4. **Balance Sufficiency Check**:

   ```C
   check(resources_table_itr->amount >= map_itr.second, ("Overdrawn balance: " + map_itr.first).c_str());
   ```
   Checking whether there are enough funds on the balance to carry out the withdrawal.

5. **Updating the Resource Table**:

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
   - If the amount of the resource on the balance is equal to the amount to be subtracted (`map_itr.second`), then the corresponding record is deleted from the table.
   - Otherwise, the amount of the resource is updated, reducing it by the appropriate amount. The `modify` function updates an entry in the table.

### Upgrading the Farming Item

The following code outlines how to upgrade a farming item:

```C
void game::upgfarmitem(const name& owner, const uint64_t& farmingitem_to_upgrade, const bool& staked)
{
    require_auth(owner);

    if(staked)
    {
        auto assets     = atomicassets::get_assets(get_self());
        auto asset_itr  = assets.require_find(farmingitem_to_upgrade, ("Could not find staked item[" + std::to_string(farmingitem_to_upgrade) +"]").c_str());

        staked_t staked_table(get_self(), owner.value);
        staked_table.require_find(farmingitem_to_upgrade, "Could not find staked farming item");

        upgrade_farmingitem(asset_itr, get_self());
    }
    else
    {
        auto assets     = atomicassets::get_assets(owner);
        auto asset_itr  = assets.require_find(farmingitem_to_upgrade, ("You do not own farmingitem[" + std::to_string(farmingitem_to_upgrade) +"]").c_str());
        upgrade_farmingitem(asset_itr, owner);
    }
}
```

### Main Steps of the Upgrade Function

1. **Authentication Confirmation**:

   ```C
   require_auth(owner);
   ```
   Checking that the transaction is authorized by the owner (`owner`).

2. **Checking Whether the Item is Staked**:

   ```C
   if(staked)
   {
       auto assets = atomicassets::get_assets(get_self());
       auto asset_itr = assets.require_find(farmingitem_to_upgrade, ("Could not find staked item[" + std::to_string(farmingitem_to_upgrade) +"]").c_str());

       staked_t staked_table(get_self(), owner.value);
       staked_table.require_find(farmingitem_to_upgrade, "Could not find staked farming item");
   }
   else
   {
       auto assets = atomicassets::get_assets(owner);
       auto asset_itr = assets.require_find(farmingitem_to_upgrade, ("You do not own farmingitem[" + std::to_string(farmingitem_to_upgrade) +"]").c_str());
   }
   ```
   Depending on whether the farming item is staked, different steps are performed to verify the ownership or staking status of the item.

3. **Upgrading the Farming Item**:

   ```C
   upgrade_farmingitem(asset_itr, get_self());
   ```
   Call the `upgrade_farmingitem` function to upgrade the farming item. The function takes an iterator to the NFT and the name of the owner.

### Upgrading Farming Item Logic

```C
void pixelfarm::upgrade_farmingitem(atomicassets::assets_t::const_iterator& assets_itr, const name& owner)
{
    auto mdata          = get_mdata(assets_itr);
    auto template_idata = get_template_idata(assets_itr->template_id, assets_itr->collection_name);

    check(std::get<uint8_t>(mdata["slots"])++ < std::get<uint8_t>(template_idata["maxSlots"]), "Farmingitem has max slots");

    update_mdata(assets_itr, mdata, owner);
}
```

1. **Getting Metadata and Template Data**:

   ```C
   auto mdata = get_mdata(assets_itr);
   auto template_idata = get_template_idata(assets_itr->template_id, assets_itr->collection_name);
   ```
   Obtaining metadata and template data for asset processing.

2. **Checking the Number of Slots**:

   ```C
   check(std::get<uint8_t>(mdata["slots"])++ < std::get<uint8_t>(template_idata["maxSlots"]), "Farmingitem has max slots");
   ```
   Checking whether the number of farm item slots after the increment does not exceed the maximum number of slots defined in the NFT template. Note that a postfix increment is used here (`++` before `std::get<uint8_t>(mdata["slots"])`), so the slots value will be incremented before the comparison.

3. **Farming Item Data Update**:

   ```C
   update_mdata(assets_itr, mdata, owner);
   ```
   Updating the farm item metadata in the table using the `update_mdata` function. This feature is used to save new data after an upgrade.

### Next Steps

In the next article, we will cover a similar function, which is creating new items, also known as blends.

PS. [The Following link](https://github.com/dapplicaio/GamItemUpgrades) leads us to a repository that corresponds to everything described, so you can simply build that code and use it as you wish.