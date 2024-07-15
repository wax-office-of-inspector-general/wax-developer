Part 6. Types of Farming and farming process
============================================

In this article, we'll break down the resource farming process. Building on the staking code from our previous article, we'll introduce additional tables and functions specific to resource farming.

The first step is adding a table to our code for resource storage. This table is key to managing and tracking the resources players collect and use within the game.

```C
//scope: owner
 struct [[eosio::table]] resources_j
 {
   uint64_t    key_id;
   float       amount;
   std::string resource_name;

   uint64_t primary_key() const { return key_id; }
 };
 typedef multi_index< "resources"_n, resources_j > resources_t;
```

In the resource farming table, we have the following fields:

-   key_id: This is the unique identifier for each resource, represented as a number to facilitate table searches.
-   amount: The quantity of the specific resource.
-   resource_name: The name of the resource, such as "stone", "wood", etc.

Additionally, we'll use a helper function to convert the resource name into a numerical `key_id`. This function simplifies the process of managing and referencing resources in our table.

```C

const uint64_t pixelfarm::stringToUint64(const std::string& str)
{
 uint64_t hash = 0;

 if (str.size() == 0) return hash;

 for (int i = 0; i < str.size(); ++i)
 {
   int char_s = str[i];
   hash = ((hash << 4) - hash) + char_s;
   hash = hash & hash;
 }

 return hash;
}
```

Function, which takes the string `str` as an input parameter and returns a 64-bit unsigned integer of type `uint64_t`. The function uses a simple hashing algorithm to convert a string into a unique integer value.

Initialize a 64-bit unsigned `hash` variable to 0.

Check the length of the input string `str`. If it's empty (length 0), return the `hash` value.

Iterate through each character in `str`.

Calculate and store the ASCII code of each character in `char_s`.

Perform the hashing operation:

Shift `hash` value 4 bits left: `hash << 4`.

Subtract `hash` from the shifted value: `(hash << 4) - hash`.

Add the ASCII code of the character: `+ char_s`.

Apply `hash = hash & hash` to limit the `hash` value to 64 bits and prevent overflow.

Return the final `hash` value after the loop ends.

Next, we will incorporate the stamp function into our code for further processing.

```C
void claim(const name& owner, const uint64_t& farmingitem);
```

and support functions for claiming


Explanation of above, step by step.

1\. ```auto item_mdata = get_mdata(assets_itr);``` Getting metadata (metadata) for NFT using the `assets_itr` iterator.

2\. const uint32_t& lastClaim = std::get<uint32_t>(item_mdata["lastClaim"]); Getting the value of "lastClaim" from the NFT metadata. This represents the time of the last output of the resource.

3\. std::pair<std::string, float> mined_resource; Creation of an object of type `std::pair`, which will be used to store the mined resource and its quantity.

4. if(time_now > lastClaim) { ... }: Checking whether time has passed since the last claim of the resource. If so, additional steps are taken.

5\. auto item_template_idata = get_template_idata(assets_itr->template_id, assets_itr->collection_name); Obtaining template data (template) for NFT using its identifier and collection name.

6\. Obtaining the necessary data from the template:

    -- const float& miningRate = std::get<float<float/>>(item_template_idata["miningRate"]); Getting the resource mining rate.

    -- const std::string& farmResource = std::get<std::string>(item_template_idata["farmResource"]); Get the name of the resource to mine.

7\. const uint8_t& current_lvl = std::get<uint8_t>(item_mdata["level"]); Obtaining the current level (level) of NFT from metadata.

8\. Calculation of the rate of resource extraction according to the level:

    float miningRate_according2lvl = miningRate;

    for(uint8_t i = 1; i < current_lvl; ++i)

        miningRate_according2lvl = miningRate_according2lvl + (miningRate_according2lvl * upgrade_percentage / 100);

9\. Calculation of the amount of extracted resource:

    const float& reward = (time_now -- lastClaim) * miningRate_according2lvl;

10\. item_mdata["lastClaim"] = time_now; Update the value of "lastClaim" in the NFT metadata to the current time.

11\. update_mdata(assets_itr, item_mdata, get_self()); Update NFT metadata with new value "lastClaim".

12\. Filling the mined_resource object with data on the mined resource and its quantity.

13\. return mined_resource; Return of the mined_resource object as a result of the function.

and an additional function to increase the balance of resources:

```C
void game::increase_owner_resources_balance(const name& owner, const std::map<std::string, float>& resources)
{
  resources_t resources_table(get_self(), owner.value);
  for(const auto& map_itr : resources)
  {
    const uint64_t& key_id = stringToUint64(map_itr.first);

    auto resources_table_itr = resources_table.find(key_id);
    if(resources_table_itr == std::end(resources_table))
    {
      resources_table.emplace(get_self(), [&](auto &new_row)
      {
        new_row.key_id          = key_id;
        new_row.resource_name   = map_itr.first;
        new_row.amount          = map_itr.second;
      });
    }
    else
    {
      resources_table.modify(resources_table_itr, get_self(), [&](auto &new_row)
      {
        new_row.amount += map_itr.second;
      });
    }
  }
}
```

1\. resources_t resources_table(get_self(), owner.value); Declaration and initialization of the `resources_t` table object, which is used to store the resources of the game owner (`owner`). A table object is created for the contract using the owner ID.

2\. for(const auto& map_itr : resources) { ... }: A loop that goes through all key-value pairs in the input dictionary `resources`.

3\. const uint64_t& key_id = stringToUint64(map_itr.first); Get a unique identifier (`key_id`) for a resource based on the resource name from the input dictionary. The `stringToUint64` function you provided earlier is used.

4\. auto resources_table_itr = resources_table.find(key_id); Search for an entry in the table by the received `key_id`.

5\. if(resources_table_itr == std::end(resources_table)) { ... } Checking whether an entry for the specified `key_id` exists in the table.

6\. If the record is not found (`if' branch):

    -- resources_table.emplace(get_self(), [&](auto &new_row) { ... }); Adding a new record to the table using the `emplace` function. The record contains a unique `key_id`, the name of the resource and its quantity.

7\. If the record exists (`else' branch):

    -- resources_table.modify(resources_table_itr, get_self(), [&](auto &new_row) { ... }); 

Modification of an existing entry in the table, increasing its number by the value from the input dictionary.

Now let's talk about the function of the claim itself:

```C
void pixelfarm::claim(const name& owner, const uint64_t& farmingitem)
{
    require_auth(owner);

    staked_t staked_table(get_self(), owner.value);
    auto staked_table_itr = staked_table.require_find(farmingitem, "Could not find staked farming item");
    auto assets = atomicassets::get_assets(get_self());
    auto assets_itr = assets.find(farmingitem);

    //to get mining boost
    auto farmingitem_mdata = get_mdata(assets_itr);
    float miningBoost = 1;
    if(farmingitem_mdata.find("miningBoost") != std::end(farmingitem_mdata))
        miningBoost = std::get<float>(farmingitem_mdata["miningBoost"]);

    // first - resource name, second - resource amount
    std::map<std::string, float> mined_resources;
    const uint32_t& time_now = current_time_point().sec_since_epoch();
    for(const uint64_t& item_to_collect : staked_table_itr->staked_items)
    {
        auto assets_itr           = assets.find(item_to_collect);
        const std::pair<std::string, float> item_reward = claim_item(assets_itr, 2, time_now); // 2 is the percentage of increase in mainrate for each level

        if(item_reward != std::pair<std::string,float>())
            if(item_reward.second > 0)
                mined_resources[item_reward.first] += item_reward.second;
    }
    check(mined_resources.size() > 0, "Nothing to claim");

    increase_owner_resources_balance(owner, mined_resources);
}
```

1\. require_auth(owner); Checking whether the user who called the function has sufficient authorization rights for the owner (`owner`).

2\. staked_t staked_table(get_self(), owner.value); Declaration and initialization of the `staked_t` table to track nested elements of the game owner (`owner`).

3\. auto staked_table_itr = staked_table.require_find(farmingitem, "Could not find staked farming item"); Search for an entry in the table of nested items using the unique identifier `farmingitem`. If the record is not found, an error is generated.

4\. auto assets = atomicassets::get_assets(get_self()); Get all assets using `atomicassets::get_assets` function.

5\. `auto assets_itr = assets.find(farmingitem);`: Search for an asset with the unique identifier `farmingitem` in the asset collection.

6\. `auto farmingitem_mdata = get_mdata(assets_itr);`: Get metadata for the specified asset.

7\. `float miningBoost = 1;`: Initialize the `miningBoost` variable with the value 1.

8\. `if(farmingitem_mdata.find("miningBoost") != std::end(farmingitem_mdata)) miningBoost = std::get<float>(farmingitem_mdata["miningBoost"]);`: Checking the presence of the "miningBoost" key in asset metadata and update `miningBoost` if present.

9\. std::map<std::string, float> mined_resources; Creating a dictionary to store mined resources, where the key is the name of the resource, and the value is its quantity.

10\. const uint32_t& time_now = current_time_point().sec_since_epoch(); Get the current time in seconds since the epoch.

11\. Cycle for each bid item:

     -- const std::pair<std::string, float> item_reward = claim_item(assets_itr, 2, time_now); Call the `claim_item` function to get a reward for mining from the specified asset.

     -- if(item_reward != std::pair<std::string,float>()) if(item_reward.second > 0) mined_resources[item_reward.first] += item_reward.second; Adding a mined resource to the dictionary ` mined_resources` if the reward has been received and is positive.

12\. check(mined_resources.size() > 0, "Nothing to claim"); Checking if there is anything to claim using the `check` function.

13\. increase_owner_resources_balance(owner, mined_resources); Call the `increase_owner_resources_balance` function to increase the resource balance of the game owner.

PS. Here you can find [link](https://github.com/dapplicaio/FarmingResources) to repository with staking and farming code.