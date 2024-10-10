---
title: Part 9. Blends of NFTs for WAX games
order: 45
---

In this article, following our previous one  on upgrading farming items, we're diving into creating blends. Blending involves combining specific items to create new or enhanced ones within the game. This feature adds depth and strategy to the game, offering players the opportunity to craft unique items with potentially higher value or utility. 

We'll outline the necessary code additions to implement this functionality, enriching the game's interactive elements and player engagement.

```C
 //scope:contract
 struct [[eosio::table]] blends_j
 {
   uint64_t              blend_id;
   std::vector<int32_t>  blend_components;
   int32_t               resulting_item;

   uint64_t primary_key() const { return blend_id; }
 };
 typedef multi_index< "blends"_n, blends_j > blends_t;
```

Introducing a new table for saving blend recipes enriches the game by allowing the creation of unique items through blending. Admins can define recipes, which players then use to blend items, specifying:

**-- **blend_id**:** A unique identifier for each recipe.

**-- **blend_components**:** The list of NFT templates required for the blend.

**-- **resulting_item**:** The ID of the new NFT template created from the blend.

This feature adds a strategic layer, encouraging players to collect specific NFTs to create more valuable or powerful items.

Adding a function for the contract admin to create new blends is a strategic development step.

```C
void game::addblend(
  const std::vector<int32_t>  blend_components,
  const int32_t resulting_item
)
{
  require_auth(get_self());

  blends_t blends_table(get_self(), get_self().value);

  const uint64_t new_blend_id = blends_table.available_primary_key();

  blends_table.emplace(get_self(), [&](auto new_row)
  {
    new_row.blend_id = new_blend_id;
    new_row.blend_components = blend_components;
    new_row.resulting_item = resulting_item;
  });
}
```

```C
 require_auth(get_self());
```

Implementing this function ensures that only the contract administrator has the authority to create new blends.

```C
const uint64_t new_blend_id = blends_table.available_primary_key();
```

The `available_primary_key` function is designed to provide a unique, incremental key for new entries in a table. If existing keys in the table are 1, 5, and 8, the function will return 9, ensuring that each new entry receives a distinct identifier. 

```C
 blends_table.emplace(get_self(), [&](auto new_row)
  {
    new_row.blend_id = new_blend_id;
    new_row.blend_components = blend_components;
    new_row.resulting_item = resulting_item;
  });
```

Creating a new record in the table involves specifying the necessary fields as previously described. 

To integrate blending into the game, we'll expand the `receive_asset_transfer` function, previously utilized for staking items. This enhancement involves adding conditions to the if statement to recognize and process blend transactions. 

```C
 else if(memo.find("blend:") != std::string::npos)
 {
   const uint64_t blend_id = std::stoll(memo.substr(6));
   blend(from, asset_ids, blend_id);
 }
```

For blending, players need to transfer their NFTs to the contract, similar to staking, but must include a specific memo indicating the blend action and the blend_id, like "blend:blend_id" (for example, "blend:18"). This method ensures the contract recognizes the player's intent to blend items using the specified recipe.

```C
 const uint64_t blend_id = std::stoll(memo.substr(6));
```

Extracting the blend ID from the memo is a crucial step in the blending process, allowing the contract to identify which blend recipe the player intends to use.

```C
blend(from, asset_ids, blend_id);
```

After extracting the blend ID from the memo, the next step involves calling an auxiliary function. 

```C
void game::blend(const name& owner, const std::vector<uint64_t> asset_ids, const uint64_t& blend_id)
{
    auto assets = atomicassets::get_assets(get_self());
    auto templates = atomicassets::get_templates(get_self());
    blends_t blends_table(get_self(), get_self().value);
    auto blends_table_itr = blends_table.require_find(blend_id, "Could not find blend id");
    check(blends_table_itr->blend_components.size() == asset_ids.size(), "Blend components count mismatch");

    std::vector<int32_t> temp = blends_table_itr->blend_components;
    for(const uint64_t& asset_id : asset_ids)
    {
        auto assets_itr = assets.find(asset_id);
        check(assets_itr->collection_name == name("collname"), // replace collection with your collection name to check for fake nfts
         ("Collection of asset [" + std::to_string(asset_id) + "] mismatch").c_str());
        auto found =  std::find(std::begin(temp), std::end(temp), assets_itr->template_id);
        if(found != std::end(temp))
            temp.erase(found);

        action
        (
            permission_level{get_self(),"active"_n},
            atomicassets::ATOMICASSETS_ACCOUNT,
            "burnasset"_n,
            std::make_tuple
            (
                get_self(),
                asset_id
            )
        ).send();
    }
    check(temp.size() == 0, "Invalid blend components");

    auto templates_itr = templates.find(blends_table_itr->resulting_item);

    action
    (
        permission_level{get_self(),"active"_n},
        atomicassets::ATOMICASSETS_ACCOUNT,
        "mintasset"_n,
        std::make_tuple
        (
            get_self(),
            get_self(),
            templates_itr->schema_name,
            blends_table_itr->resulting_item,
            owner,
            (atomicassets::ATTRIBUTE_MAP) {}, //immutable_data
            (atomicassets::ATTRIBUTE_MAP) {}, //mutable data
            (std::vector <asset>) {} // token back
        )
    ).send();
}
```

Here's description of what code above does:

1.  The process involves extracting detailed information about NFTs currently held on the contract. This step is essential to later identify the NFTs sent by the user, allowing for the extraction of all relevant template data necessary for the blending process. 

```C
auto assets = atomicassets::get_assets(get_self());
    auto templates = atomicassets::get_templates(get_self());

```

2\. First, the process involves checking the blends table to verify if the player's specified blend exists; if not, an error is thrown. Then, it's essential to confirm that the player has submitted the correct quantity of NFTs required for the blend, ensuring compliance with the blend recipe's specifications. 

```C
blends_t blends_table(get_self(), get_self().value);
    auto blends_table_itr = blends_table.require_find(blend_id, "Could not find blend id");
    check(blends_table_itr->blend_components.size() == asset_ids.size(), "Blend components count mismatch");
```

3\. A temporary variable is created to ensure the player has submitted the correct components for the blend. This step is followed by iterating over all the NFTs the player has provided, checking each against the blend's requirements.

```C
std::vector<int32_t> temp = blends_table_itr->blend_components;
    for(const uint64_t& asset_id : asset_ids)
    {
		..........
    }
```

4\. A code that is inside the loop:

```C
    auto assets_itr = assets.find(asset_id);
        check(assets_itr->collection_name == name("collname"), // replace collection with your collection name to check for fake nfts
         ("Collection of asset [" + std::to_string(asset_id) + "] mismatch").c_str());
```

During the blend verification process, information about each submitted NFT is extracted to ensure it belongs to the game's collection. This involves checking if the NFT's collection name matches the game's specified collection name, which requires replacing "collnamed" with the actual name of your collection in the code. 

5\. The blending process involves a meticulous check against the blend recipe, using a temporary variable that contains the ID templates of the blend. For each submitted NFT, the system verifies its template against the temporary variable. If a match is found, that template is removed from the variable to prevent duplicates and identify any incorrect templates submitted by the player. 

Following this verification, the burning function is called.

```C
auto found =  std::find(std::begin(temp), std::end(temp), assets_itr->template_id);
        if(found != std::end(temp))
            temp.erase(found);

        action
        (
            permission_level{get_self(),"active"_n},
            atomicassets::ATOMICASSETS_ACCOUNT,
            "burnasset"_n,
            std::make_tuple
            (
                get_self(),
                asset_id
            )
        ).send();
```

6\. Code after the loop:

```C
check(temp.size() == 0, "Invalid blend components");
```

Next step in the blending process is to ensure that the temporary vector, which contains the components of the blend recipe, is empty. This checks that the player has correctly reset all the required components for the blend. 

If the vector is empty, it confirms that all components were correctly submitted and processed, allowing the blend to be completed successfully.

Then there is a search for the resulting template in the table of atoms and creation (mint) of NFT with the required template.

```C
auto templates_itr = templates.find(blends_table_itr->resulting_item);

action
(
    permission_level{get_self(),"active"_n},
    atomicassets::ATOMICASSETS_ACCOUNT,
    "mintasset"_n,
    std::make_tuple
    (
        get_self(),
        get_self(),
        templates_itr->schema_name,
        blends_table_itr->resulting_item,
        owner,
        (atomicassets::ATTRIBUTE_MAP) {}, //immutable_data
        (atomicassets::ATTRIBUTE_MAP) {}, //mutable data
        (std::vector<asset>) {} // token back
    )
).send();
```

This article has guided you through the process of creating blends in a game, from setting up blend recipes to verifying player submissions and minting new NFTs. It covers checking NFT components against blend requirements, ensuring all components are correctly submitted, and concluding with the minting of a new item that results from the blend. This blending mechanism enriches the gameplay by allowing players to combine NFTs into new, more valuable assets, fostering a deeper engagement with the game's ecosystem.

**PS.** The [Following link](https://github.com/dapplicaio/GamingItemBlend) leads us to a repository that corresponds everything described, so you can simply build that code and use in a way you want.