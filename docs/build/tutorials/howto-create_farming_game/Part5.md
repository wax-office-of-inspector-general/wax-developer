---
title: Part 5. NFT Staking
order: 25
---

Today, we're diving into staking NFTs in our game's smart contract. This strategy helps manage market prices by locking NFTs in the contract. Imagine setting an unstaking period of 3 to 30 days for added control.

Staking NFTs simplifies ownership tracking, crucial for rewarding owners periodically, even per blockchain block. This method avoids the need for centralized systems to track ownership, a common challenge with alternatives that rely on transaction history or external APIs.

Staking NFTs in our game is a straightforward process:

1. The player picks an NFT to stake.
2. They send this NFT to our contract.
3. Our contract acknowledges and processes the transfer.
4. Finally, the contract logs the player's staked NFT in a table, ready for future interactions.

This process ensures a seamless and efficient staking experience, integral to the game's dynamics.

### Staking Source Code and Example

Main file: `game.hpp`

```cpp
#include <eosio/eosio.hpp>
#include <eosio/singleton.hpp>
#include <eosio/asset.hpp>
#include "atomicassets.hpp"

using namespace eosio;
```

At the top of the file, we connect all the necessary libraries and namespaces.

```cpp
class [[eosio::contract]] game : public contract
{
  public:
    using contract::contract;
  private:
};
```

This is what an empty class called `game` looks like. In it, we will implement all the functions needed for staking.

The first step is to add a function for listening to the transfer. Make it public:

```cpp
// listening atomicassets transfer
[[eosio::on_notify("atomicassets::transfer")]]
void receive_asset_transfer
(
  const name& from,
  const name& to,
  std::vector<uint64_t>& asset_ids,
  const std::string& memo
);
```

Regarding `eosio::on_notify`, you can check more about it [here](https://developers.eos.io/welcome/v2.0/smart-contract-guides/payable-actions/#the-on_notify-attribute).

In this function, we configure it to listen to the Atomic Assets contract and its transfer function. Here's a brief rundown:

- `from`: This represents the player sending the NFT.
- `to`: This should be set to our contract.
- `asset_ids`: These are the gaming NFTs involved in the transaction.
- `memo`: A message included with the transfer. Future memos will be specified to guide our contract on how to process the data.

This setup is crucial for correctly handling NFT transfers in our game environment.

```cpp
// scope: owner
struct [[eosio::table]] staked_j
{
  uint64_t              asset_id; // item
  std::vector<uint64_t> staked_items; // farming items

  uint64_t primary_key() const { return asset_id; }
};
typedef multi_index<"staked"_n, staked_j> staked_t;
```

In this part, we've set up a table to keep track of staked NFTs:

- **Scope**: Defined by the player's nickname.
- **asset_id**: Identifies the specific NFT (item).
- **staked_items**: An array containing the staked NFTs (farming items).
- **primary_key**: A necessary function in all tables, determining the search key for records.

Additionally, we've crafted helper functions to enhance the code's readability within the contract:

```cpp
void stake_farmingitem(const name& owner, const uint64_t& asset_id);
void stake_items(const name& owner, const uint64_t& farmingitem, const std::vector<uint64_t>& items_to_stake);

// get mutable data from NFT
atomicassets::ATTRIBUTE_MAP get_mdata(atomicassets::assets_t::const_iterator& assets_itr);
// get immutable data from template of NFT
atomicassets::ATTRIBUTE_MAP get_template_idata(const int32_t& template_id, const name& collection_name);
// update mutable data of NFT
void update_mdata(atomicassets::assets_t::const_iterator& assets_itr, const atomicassets::ATTRIBUTE_MAP& new_mdata, const name& owner);
    }
  ]
}
```

Now, we're diving deeper into the `game.cpp` file to detail the implementation of the function that monitors atomic transfers. This is where the magic happens in handling NFT transactions within our game's framework.

```cpp
void game::receive_asset_transfer
(
  const name& from,
  const name& to,
  std::vector<uint64_t>& asset_ids,
  const std::string& memo
)
{
  if (to != get_self())
    return;

  if (memo == "stake farming item")
  {
    check(asset_ids.size() == 1, "You must transfer only one farming item to stake");
    stake_farmingitem(from, asset_ids[0]);
  }
  else if (memo.find("stake items:") != std::string::npos)
  {
    const uint64_t farmingitem_id = std::stoll(memo.substr(12));
    stake_items(from, farmingitem_id, asset_ids);
  }
  else
    check(0, "Invalid memo");
}
```

First, we verify if the NFT was sent to our contract using `get_self()`. Depending on the memo, we distinguish between staking a farming item and other items.

- **Farming Item**: We confirm that only one NFT is sent, adhering to our game rule of staking one item at a time. Then, we invoke `stake_farmingitem`.
- **Other Items**: For staking other items, the memo must include the ID of the farming item where the NFTs are to be staked, formatted as "stake items:id", with the actual ID of the farming item.

```cpp
std::stoll(memo.substr(12));
```

Here, we parse the ID from the string (`memo`) and then call the internal function for item staking.

```cpp
else
  check(0, "Invalid memo");
```

If the transfer to the contract doesn't match the specified memos for staking, the contract will flag an error. This ensures only valid transactions are processed. Next, we'll explore additional functions used in this process, further detailing how the contract operates.

### Function: `stake_farmingitem`

```cpp
void game::stake_farmingitem(const name& owner, const uint64_t& asset_id)
{
    auto assets = atomicassets::get_assets(get_self());
    auto asset_itr = assets.find(asset_id);

    auto farmingitem_mdata = get_mdata(asset_itr);
    if (farmingitem_mdata.find("slots") == std::end(farmingitem_mdata))
    {
        auto farmingitem_template_idata = get_template_idata(asset_itr->template_id, asset_itr->collection_name);
        check(farmingitem_template_idata.find("maxSlots") != std::end(farmingitem_template_idata),
              "Farming item slots were not initialized. Contact the dev team");
        check(farmingitem_template_idata.find("stakeableResources") != std::end(farmingitem_template_idata),
              "stakeableResources items at the current farming item were not initialized. Contact the dev team");

        farmingitem_mdata["slots"] = (uint8_t)1;
        farmingitem_mdata["level"] = (uint8_t)1;

        update_mdata(asset_itr, farmingitem_mdata, get_self());
    }

    staked_t staked_table(get_self(), owner.value);
    staked_table.emplace(get_self(), [&](auto &new_row)
    {
        new_row.asset_id = asset_id;
    });
}
```

Following is an explanation of this function:

```cpp
auto assets = atomicassets::get_assets(get_self());
auto asset_itr = assets.find(asset_id);
```

This part covers how we retrieve a record of our contract's balance from the `atomicassets` table and locate the specific NFT the user wishes to stake. We'll be using functions from the `atomicassets` namespace. These are detailed in the header files included with the article, providing a straightforward tutorial on working with the atomic assets standard.

```cpp
auto farmingitem_mdata = get_mdata(asset_itr);
```

Here, we extract the metadata of the NFT for further work with the data located in the NFT.

```cpp
atomicassets::ATTRIBUTE_MAP game::get_mdata(atomicassets::assets_t::const_iterator& assets_itr)
{
  auto schemas = atomicassets::get_schemas(assets_itr->collection_name);
  auto schema_itr = schemas.find(assets_itr->schema_name.value);

  atomicassets::ATTRIBUTE_MAP deserialized_mdata = atomicdata::deserialize
  (
    assets_itr->mutable_serialized_data,
    schema_itr->format
  );

  return deserialized_mdata;
}
```

This is our data extraction function, where the schema (category) is retrieved:

```cpp
auto schemas = atomicassets::get_schemas(assets_itr->collection_name);
auto schema_itr = schemas.find(assets_itr->schema_name.value);
```

The process involves passing data to the atomic data deserialization function in `atomicdata`. We'll include these files with the code for easy reference. Regarding staking, when we receive the metadata of the NFT, we follow specific steps to ensure accurate processing and recording within the contract.

```cpp
if(farmingitem_mdata.find("slots") == std::end(farmingitem_mdata))
{
    auto farmingitem_template_idata = get_template_idata(asset_itr->template_id, asset_itr->collection_name);
    check(farmingitem_template_idata.find("maxSlots") != std::end(farmingitem_template_idata),
          "Farming item slots were not initialized. Contact the dev team");
    check(farmingitem_template_idata.find("stakeableResources") != std::end(farmingitem_template_idata),
          "stakeableResources items at the current farming item were not initialized. Contact the dev team");

    farmingitem_mdata["slots"] = (uint8_t)1;
    farmingitem_mdata["level"] = (uint8_t)1;

    update_mdata(asset_itr, farmingitem_mdata, get_self());
}
```

When staking an NFT for the first time, we check for a 'slots' field. If it's absent, we follow the game's requirements to initialize fields, setting up slots and the farming item's level. This initialization is crucial only for the first-time staking of an NFT.

```cpp
staked_t staked_table(get_self(), owner.value);
staked_table.emplace(get_self(), [&](auto &new_row)
{
    new_row.asset_id = asset_id;
});
```

Next, we record the staked NFT in our table, using the `owner.value` as the scope. This ensures that the entry is user-specific. The `emplace` function then takes over, where the first parameter is the account authorized to pay for the RAM, and the second parameter is a lambda function for adding a new record to the table.

This sets the stage for detailing the item staking function.

```cpp
void game::stake_items(const name& owner, const uint64_t& farmingitem, const std::vector<uint64_t>& items_to_stake)
{
    auto assets = atomicassets::get_assets(get_self());

    staked_t staked_table(get_self(), owner.value);
    auto staked_table_itr = staked_table.require_find(farmingitem, "Could not find farming staked item");
    auto asset_itr = assets.find(farmingitem);

    auto farmingitem_mdata = get_mdata(asset_itr);
    auto farmingitem_template_idata = get_template_idata(asset_itr->template_id, asset_itr->collection_name);

    check(std::get<uint8_t>(farmingitem_mdata["slots"]) >= staked_table_itr->staked_items.size() + items_to_stake.size(),
          "You don't have empty slots on the current farming item to stake this amount of items");

    atomicdata::string_VEC stakeableResources = std::get<atomicdata::string_VEC>(farmingitem_template_idata["stakeableResources"]);
    for (const uint64_t& item_to_stake : items_to_stake)
    {
        asset_itr = assets.find(item_to_stake);
        auto item_mdata = get_mdata(asset_itr);

        item_mdata["lastClaim"] = current_time_point().sec_since_epoch();
        auto template_idata = get_template_idata(asset_itr->template_id, asset_itr->collection_name);
        if (item_mdata.find("level") == std::end(item_mdata))
        {
            check(template_idata.find("farmResource") != std::end(template_idata),
                  "farmResource at item [" + std::to_string(item_to_stake) + "] was not initialized. Contact the dev team");
            check(template_idata.find("miningRate") != std::end(template_idata),
                  "miningRate at item [" + std::to_string(item_to_stake) + "] was not initialized. Contact the dev team");
            check(template_idata.find("maxLevel") != std::end(template_idata),
                  "maxLevel at item [" + std::to_string(item_to_stake) + "] was not initialized. Contact the dev team");

            item_mdata["level"] = (uint8_t)1;
        }

        check(std::find(std::begin(stakeableResources), std::end(stakeableResources), std::get<std::string>(template_idata["farmResource"])) != std::end(stakeableResources),
              "Item [" + std::to_string(item_to_stake) + "] cannot be staked at the current farming item");
        update_mdata(asset_itr, item_mdata, get_self());
    }

    staked_table.modify(staked_table_itr, get_self(), [&](auto &new_row)
    {
        new_row.staked_items.insert(std::end(new_row.staked_items), std::begin(items_to_stake), std::end(items_to_stake));
    });
}
```

In this function, we detail the staking of multiple items, including checks for available slots and ensuring that each item meets the necessary criteria before being staked.

### Step-by-Step Breakdown

```cpp
auto assets = atomicassets::get_assets(get_self());
```

Here, we are retrieving the NFTs from the contract. This line fetches the collection of assets owned by the contract.

```cpp
staked_t staked_table(get_self(), owner.value);
auto staked_table_itr = staked_table.require_find(farmingitem, "Could not find farming staked item");
```

This step involves extracting the player's table and searching for the specific farming item ID mentioned in the memo. If the specified ID isn't found, the system triggers an error message.

```cpp
auto asset_itr = assets.find(farmingitem);
```

Next, we locate the NFT in the atomic table to extract its data.

```cpp
auto farmingitem_mdata = get_mdata(asset_itr);
auto farmingitem_template_idata = get_template_idata(asset_itr->template_id, asset_itr->collection_name);
```

In this step, we extract the NFT metadata and immutable template data. The function `get_template_idata` is used for this purpose, functioning similarly to `get_mdata`. This extraction is vital for accurately understanding and utilizing the NFT's characteristics within the game.

```cpp
atomicassets::ATTRIBUTE_MAP game::get_template_idata(const int32_t& template_id, const name& collection_name)
{
  auto templates = atomicassets::get_templates(collection_name);
  auto template_itr = templates.find(template_id);

  auto schemas = atomicassets::get_schemas(collection_name);
  auto schema_itr = schemas.find(template_itr->schema_name.value);

  return atomicdata::deserialize
  (
    template_itr->immutable_serialized_data,
    schema_itr->format
  );
}
```

In this part, we're extracting information about the NFT template. From this template data, we then pull out the specific details we need.

```cpp
check(std::get<uint8_t>(farmingitem_mdata["slots"]) >= staked_table_itr->staked_items.size() + items_to_stake.size(),
      "You don't have empty slots on the current farming item to stake this amount of items");
```

The next step involves verifying if there's sufficient space in the farming item to store new items. This check is essential to ensure that the item's capacity aligns with the game's rules and mechanics.

```cpp
atomicdata::string_VEC stakeableResources = std::get<atomicdata::string_VEC>(farmingitem_template_idata["stakeableResources"]);
```

In this phase, we utilize a vector or array of types. This is where we'll record all the resources that the player's chosen items are set to farm.

---

```cpp
for (const uint64_t& item_to_stake : items_to_stake)
{
    asset_itr = assets.find(item_to_stake);
    auto item_mdata = get_mdata(asset_itr);

    item_mdata["lastClaim"] = current_time_point().sec_since_epoch();
    auto template_idata = get_template_idata(asset_itr->template_id, asset_itr->collection_name);
    if (item_mdata.find("level") == std::end(item_mdata))
    {
        check(template_idata.find("farmResource") != std::end(template_idata),
              "farmResource at item [" + std::to_string(item_to_stake) + "] was not initialized. Contact the dev team");
        check(template_idata.find("miningRate") != std::end(template_idata),
              "miningRate at item [" + std::to_string(item_to_stake) + "] was not initialized. Contact the dev team");
        check(template_idata.find("maxLevel") != std::end(template_idata),
              "maxLevel at item [" + std::to_string(item_to_stake) + "] was not initialized. Contact the dev team");

        item_mdata["level"] = (uint8_t)1;
    }

    check(std::find(std::begin(stakeableResources), std::end(stakeableResources), std::get<std::string>(template_idata["farmResource"])) != std::end(stakeableResources),
          "Item [" + std::to_string(item_to_stake) + "] cannot be staked at the current farming item");
    update_mdata(asset_itr, item_mdata, get_self());
}
```

Next, we iterate through the items the player wants to stake, extracting NFT data for each, similar to earlier steps.

```cpp
item_mdata["lastClaim"] = current_time_point().sec_since_epoch();
```

We then record the 'last timestamped' field for each item, which is crucial for future resource farming calculations. This timestamp defaults to the moment the item is processed.

### Verifying and Updating Staked Items

```cpp
if(item_mdata.find("level") == std::end(item_mdata))
{
    check(template_idata.find("farmResource") != std::end(template_idata),
          "farmResource at item [" + std::to_string(item_to_stake) + "] was not initialized. Contact the dev team");
    check(template_idata.find("miningRate") != std::end(template_idata),
          "miningRate at item [" + std::to_string(item_to_stake) + "] was not initialized. Contact the dev team");
    check(template_idata.find("maxLevel") != std::end(template_idata),
          "maxLevel at item [" + std::to_string(item_to_stake) + "] was not initialized. Contact the dev team");

    item_mdata["level"] = (uint8_t)1;
}
```

At this point, we verify if the item is being staked for the first time. If it's the first staking instance and the 'level' field is missing, it indicates that we need to add this field to the NFT. Additionally, we check other mandatory fields in the template to ensure they're properly initialized.

```cpp
check(std::find(std::begin(stakeableResources), std::end(stakeableResources), std::get<std::string>(template_idata["farmResource"])) != std::end(stakeableResources),
      "Item [" + std::to_string(item_to_stake) + "] cannot be staked at the current farming item");
```

In this step, we assess if the farming item can accommodate the staking of an item that mines a specific resource. This involves checking the array of resources that the farming item can mine and ensuring that the items the player wants to stake align with the capabilities of the corresponding farming item.

```cpp
update_mdata(asset_itr, item_mdata, get_self());
```

Once we confirm that everything is in order, we proceed to update the NFT metadata as described in the previous steps. This ensures that the NFT is correctly modified to reflect its new status and capabilities within the game's ecosystem.

### Updating Staking Table

```cpp
void game::update_mdata(atomicassets::assets_t::const_iterator& assets_itr, const atomicassets::ATTRIBUTE_MAP& new_mdata, const name& owner)
{
  action
  (
    permission_level{get_self(),"active"_n},
    atomicassets::ATOMICASSETS_ACCOUNT,
    "setassetdata"_n,
    std::make_tuple
    (
      get_self(),
      owner,
      assets_itr->asset_id,
      new_mdata
    )
  ).send();
}
```

Next, we call the atomic function, inputting all the relevant data. After updating the NFT metadata, we also make corresponding changes to the staking table.

```cpp
staked_table.modify(staked_table_itr, get_self(), [&](auto &new_row)
{
    new_row.staked_items.insert(std::end(new_row.staked_items), std::begin(items_to_stake), std::end(items_to_stake));
});
```

Here, we use `modify`, since such an entry already exists in the table and we just need to update it. The first parameter is an iterator that points to the entry to be changed, the second is who pays for the RAM, and the third is a lambda function for editing the entry in the table.

### Additional Notes

PS. The [following link](https://github.com/dapplicaio/StakingNFTS) leads to a repository that corresponds to everything described here, so you can simply build that code and use it as needed. Future articles will also include previous code examples, allowing our framework to evolve over time while incorporating all past articles.

