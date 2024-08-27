Part 10: Implementing avatars in WAX games
==========================================

This article will explore how to create avatars and their equipment, focusing on the customization and personalization aspects that enhance player experience. By detailing the process of designing avatars and selecting their gear, we aim to provide insights into building more engaging and interactive game elements, allowing players to deeply immerse themselves in the game world with characters that reflect their style and preferences. 
### 1. Creating categories

Creating an avatar category involves defining a character with specific characteristics, which can later be enhanced by equipping items. This foundational step allows for the customization of avatars, providing players with the ability to tailor characters to their play style and preferences, thus enriching the gaming experience by adding depth to character development and interaction within the game world.

![](/public/assets/images/tutorials/howto-create_farming_game/part10/image1.png)

| Attribute Name | Attribute Type | Description                                      |
|----------------|----------------|--------------------------------------------------|
| name           | string         | Avatar’s name                                    |
| description    | string         | Description of avatar’s lore and properties      |
| img            | image          | Image of the avatar                              |
| economic       | uint32         | Reduces the price of upgrade                     |
| productivity   | uint32         | Increases mining rate                            |
| vitality       | uint32         | Increases upgrade percentage                     |
| bravery        | uint32         | Will affect quests                               |
| diplomacy      | uint32         | Will affect interactions with other players      |

Table. 1 – attributes of “avatar”



Creating a category for equipment items mirrors the process of avatar creation, with each piece of equipment also possessing distinct characteristics.

![](/public/assets/images/tutorials/howto-create_farming_game/part10/image2.png)

| Attribute Name | Attribute Type | Description                                           |
|----------------|----------------|-------------------------------------------------------|
| name           | string         | Item’s name                                           |
| description    | string         | Description of item’s lore and properties             |
| img            | image          | Image of the item                                     |
| type           | string         | Represents the type of item (jewelry, flag, crown etc.)|
| economic       | uint32         | Reduces the price of upgrade                          |
| productivity   | uint32         | Increases mining rate                                 |
| vitality       | uint32         | Increases upgrade percentage                          |
| bravery        | uint32         | Will affect quests                                    |
| diplomacy      | uint32         | Will affect interactions with other players           |

Table. 2 – attributes of “equip”
### 2. Creating templates

Here is an example of creating an avatar and an item of equipment.

![](/public/assets/images/tutorials/howto-create_farming_game/part10/image3.png)

![](/public/assets/images/tutorials/howto-create_farming_game/part10/image4.png)

The minting of avatars and equipment follows the processes outlined in previous articles, involving the creation and registration of these elements on the blockchain.
### 3. Adding new tables to the contract code

Adding a table that links each player with their active avatar and equipped items is a strategic development step. This table not only tracks which avatars and items are currently in use but also facilitates interactions within the game, such as battles or resource collection, based on the equipped items’ attributes. 

```C
struct [[eosio::table]] avatars_j
  {
    name owner;
    std::vector<uint64_t> equipment;


    uint64_t primary_key() const { return owner.value; }
  };
  typedef multi_index< "avatarsc"_n, avatars_j> avatars_t;
```

owner – the account that puts on the avatar and equipment

equipment – a vector of uint64_t – identifiers that indicate the active avatar and equipment

Creating a table for player stats involves aggregating the attributes of the avatar and any equipped items to reflect the player’s current capabilities within the game.

```C
struct [[eosio::table]] stats_j
  {
    name owner;
    std::map<std::string, uint32_t> stats;


    uint64_t primary_key() const {return owner.value;}
  };
  typedef multi_index<"stats"_n, stats_j> stats_t;
```

owner – an account whose characteristics are specified in the table

stats – a map containing characteristics in the format `{“economic” : 10, “bravery” : 7, etc}`

### 4. The logic for setting avatars and equipment.

The logic for setting avatars and equipment. in the game involves players selecting their character and outfitting them with various items to enhance their stats. 

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

Incorporating two memo options into the `receive_asset_transfer()` function allows players to either set their avatar by transferring a single avatar NFT with the memo "set avatar" or equip up to four different items by specifying "**set equipment**". The function then assigns the transferred avatar asset with the specified `asset_id` to the user's owner record, effectively updating the player's character or equipment setup in the game.

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

1.  The function's purpose is to validate the asset transferred by the player, ensuring it belongs to the correct collection and category for avatars or equipment. 

```Cpp
 auto assets = atomicassets::get_assets(get_self());
  auto asset_itr = assets.find(asset_id);

  check(asset_itr->collection_name == "collname"_n, "Wrong collection");
  check(asset_itr->schema_name == "avatar"_n, "Not an avatar asset");
```

2\. To update a player's avatar in the game, the function retrieves the player's information from the avatars table using their username.

```Cpp
avatars_t avatars_table(get_self(), get_self().value);
  auto owner_avatar_itr = avatars_table.find(owner.value);
```

3\. If the user does not already exist in the avatars table, the function adds them by setting up a vector with five elements initialized to zeros. The avatar's ID is then placed in the first position of this vector, effectively registering the new avatar under the player's username. 

```Cpp
if (owner_avatar_itr == std::end(avatars_table))
  {
    avatars_table.emplace(get_self(), [&](auto &new_row)
                          {
         new_row.owner = owner;
         new_row.equipment.resize(5);
         new_row.equipment[0] = asset_id; });
  }
```

4\. If the player already exists in the avatars table, the function updates their avatar with the new one provided in the argument. The old avatar is then returned to the player via an atomicassets::transfer, ensuring the player retains ownership of their previous avatar.

```Cpp
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

5\. Now we need to recalculate new characteristics

```Cpp
  recalculate_stats(owner);
```

The function for equipping items involves listing the asset IDs of equipment to be worn by the player's avatar. This process checks each item for compatibility with the avatar and updates the player's equipment list in the game's database.

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

Function description:

1\. **Prepare for Changes:** Create a vector to hold asset IDs of equipment to be returned and a map to ensure each equipment type is equipped no more than once.

```Cpp
 std::vector<uint64_t> assets_to_return;

  std::map<std::string, uint32_t> equiped_types;
  equiped_types.insert(std::pair<std::string, uint32_t>("flag", 0));
  equiped_types.insert(std::pair<std::string, uint32_t>("jewelry", 0));
  equiped_types.insert(std::pair<std::string, uint32_t>("crown", 0));
  equiped_types.insert(std::pair<std::string, uint32_t>("cloak", 0));
```

**2\. Equip New Items:** Iterate through the provided asset IDs, equipping each item while adhering to the rule that each equipment type can only be worn once.

```Cpp
 for (uint64_t asset_id : asset_ids)
  {
    set_equipment_item(owner, asset_id, assets_to_return, equiped_types);
  }
```

**3\. Update and Return:** Return any old assets back to the player's inventory and recalculate the player's characteristics based on the new equipment setup to reflect the changes in the player's abilities or stats accurately.

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

Let's consider the functions of putting on a single item **asset_id** on the player owner. **assets_to_return** stores the assets to be returned, **equiped_types** stores the number of worn items of each type of equipment.

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
  check(equiped_types[type] <= 1, "You can wear only 4 different euipment types at once");

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

Function description:

1\. Verify the player's presence in the equipment and avatar table; terminate if absent. Ensure the asset, from the correct collection and type, points correctly in the asset table. Load immutable template data into `equipment_template_idata`.

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

2\. Identify the equipment type, incrementing its count in the map. If it's a duplicate, issue an error. Determine the `position` variable based on the equipment type for the new ID's placement.

```Cpp
int32_t position = 0;
  const std::string type = std::get<std::string>(equipment_template_idata["type"]);

  equiped_types[type]++;
  check(equiped_types[type] <= 1, "You can wear only 4 different euipment types at once");

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

3\. If an existing item is found at the position, add its ID to the return vector. Update the table with the new asset.

```Cpp
 const uint64_t old_equip_id = owner_avatar_itr->equipment[position];

  if (old_equip_id != 0)
  {
    assets_to_return.push_back(old_equip_id);
  }

  avatars_table.modify(owner_avatar_itr, get_self(), [&](auto &row)
                       { row.equipment[position] = asset_id; });
```

4\. Recalculate player characteristics based on the new equipment setup.

```Cpp
void game::recalculate_stats(const name &owner)
{
  stats_t stats_table(get_self(), get_self().value);
  auto stats_itr = stats_table.find(owner.value);

  std::map<std::string, uint32_t> stats;

  // init stats
  stats.insert(std::pair<std::string, uint32_t>("economic", 0));
  stats.insert(std::pair<std::string, uint32_t>("productivity", 0));
  stats.insert(std::pair<std::string, uint32_t>("vitality", 0));
  stats.insert(std::pair<std::string, uint32_t>("bravery", 0));
  stats.insert(std::pair<std::string, uint32_t>("diplomacy", 0));

  // read stats
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

**The function for calculating player characteristics involves several key steps:**

1\. Retrieve the player's stats and avatars from their respective tables, initializing characteristics to zero.

```Cpp
 stats_t stats_table(get_self(), get_self().value);
  auto stats_itr = stats_table.find(owner.value);

  std::map<std::string, uint32_t> stats;

  // init stats
  stats.insert(std::pair<std::string, uint32_t>("economic", 0));
  stats.insert(std::pair<std::string, uint32_t>("productivity", 0));
  stats.insert(std::pair<std::string, uint32_t>("vitality", 0));
  stats.insert(std::pair<std::string, uint32_t>("bravery", 0));
  stats.insert(std::pair<std::string, uint32_t>("diplomacy", 0));

  // read stats
  avatars_t avatars_table(get_self(), get_self().value);
  auto avatar_itr = avatars_table.require_find(owner.value, "Your avatar was deleted");
```

2.  Process active assets, skipping any with an ID of 0, and read template data for each asset.

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

3\. We go through all the characteristics that we want to calculate, and they are listed in the map. If a given characteristic is present in a given item, we add it to the total value

```Cpp
for (auto &key_value_pair : stats)
    {
      if (equipment_template_idata.find(key_value_pair.first) != std::end(equipment_template_idata))
      {
        key_value_pair.second += std::get<uint32_t>(equipment_template_idata[key_value_pair.first]);
      }
    }
```

key_value_pair are pairs of the type {"economic", 0}, {"bravery", 0}, etc. If this element has the "economic" characteristic with a value of 3, then after this code, the "economic" field in the stats map will be 0 + 3 = 3.

4\. Sum up the values for each characteristic listed in the map, adding to the total if present in the item.

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

5\. Update the player's characteristics in the table if they exist; otherwise, add the player with the new stats.

Let's describe the lines that have been added or changed in the functions.

**Claim:**

```Cpp
std::map<std::string, uint32_t> stats = get_stats(owner);
```

This is where we get the actual characteristics of the player.

```Cpp
const uint8_t upgrade_percentage = 2 + stats["vitality"] / 10.0f;

        const std::pair<std::string, float> item_reward = claim_item(assets_itr, upgrade_percentage, time_now, stats);
```

Now upgrade_percentage is not a constant, but depends on the "vitality" characteristic. The claim_item function now accepts stats to avoid doing unnecessary calculations inside.

**Claim_item:**

```Cpp
float miningRate_according2lvl = miningRate + stats.at("productivity") / 10.0f;
```

and miningRate now also depends on the "productivity" characteristic

**Upgradeitem:**

```Cpp
std::map<std::string, uint32_t> stats = get_stats(owner);
  const uint8_t upgrade_percentage = 2 + stats["vitality"] / 10.0f;
  const std::pair<std::string, float> item_reward = claim_item(asset_itr, upgrade_percentage, time_now, stats);
```

In order to read characteristics, calculate upgrade_percentage, call the updated claim_item

```Cpp
upgrade_item(asset_itr, upgrade_percentage, owner, next_level, time_now, stats);
```

and upgrade_item now accepts stats to avoid unnecessary calculations.

**upgrade_item:**

```Cpp
float miningRate_according2lvl = mining_rate + stats.at("productivity") / 10.0f;
```

Here we get updated miningRate

```Cpp
const float &resource_price = upgrade_time * miningRate_according2lvl * (1.0f - stats.at("economic") / 100.0f);
```

and resource_price now decreases with the growth of the "economic" characteristic.

Consider the get_stats function, which returns a map with player characteristics.

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

To calculate player characteristics:

1\. A map is created to hold the function's results. A pointer is then set to the player's entry in the stats table using their name.

```Cpp
  std::map<std::string, uint32_t> stats;
  stats_t stats_table(get_self(), get_self().value);
  auto stats_itr = stats_table.find(owner.value);
```

2\. If the player isn't found in the table, the function returns a map with all characteristics set to zero. If the player is found, it retrieves and returns their stats from the table, effectively summarizing their current game attributes.

```Cpp
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
```

This article delves into creating and managing avatars and their equipment in a game, outlining the process from initial avatar category creation to the dynamic assignment of equipment. It covers the integration of avatars with in-game mechanics, such as staking and claiming rewards, and emphasizes the importance of customization in enhancing player experience. 

The article also discusses the technical aspects of setting up and updating player stats based on equipped items, ensuring a rich and interactive gaming environment.

**PS.** The [Following link](https://github.com/dapplicaio/GameAvatars) leads us to a repository that corresponds everything described, so you can simply build that code and use in a way you want.