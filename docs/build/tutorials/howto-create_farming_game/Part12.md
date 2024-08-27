Part 12: Token and resource swaps
===

In this article, we're building on previous discussions about upgrading items by introducing a method to exchange resources for tokens. We'll add a new table to track resources, where each entry includes a `key_id` (numerical ID for the resource), `resource_name`, and a `ratio` defining how many resources convert to one token. For instance, a ratio of 25 means 100 units of wood would exchange for 4 tokens. We'll also integrate the standard `eosio.token` contract, previously covered, to handle these transactions.

```cpp
 struct [[eosio::table]] resourcecost
  {
    uint64_t     key_id;
    std::string  resource_name;
    float        ratio; // if user swap 100 wood and ration is 25 it means that user will receive 4 tokens

    uint64_t primary_key() const { return blend_id; }
  };
  typedef multi_index< "resourcecost"_n, resourcecost_j > resourcecost_t;

```

Continuing from the previous setup, we now focus on optimizing the token transaction system. We have pre-minted the entire token supply and assigned it to the game contract, allowing for smooth transfers among players. However, an alternative approach involves dynamically minting tokens as needed, such as when a player exchanges resources for tokens, ensuring just the right amount is created and disbursed.

Next, we will implement a function to create entries in the `resourcecost` table. This function, restricted to being called only by the contract, will facilitate setting or updating the exchange rates between resources and tokens. The GAME token, integral to our system, features 4 decimal places and is already distributed to the game contract for active gameplay interactions.

```cpp
void game::setratio(const std::string& resource, const float& ratio)
{
  require_auth(get_self());

  const uint64_t key_id = stringToUint64(resource);
  resourcecost_t resourcecost_table(get_self(), get_self().value);
  auto resourcecost_table_itr = resourcecost_table.find(key_id);

  if(resourcecost_table_itr == std::end(resourcecost_table))
  {
    resourcecost_table.emplace(get_self(), [&](auto &new_row)
    {
      new_row.key_id = key_id;
      new_row.resource_name = resource;
      new_row.ratio = ratio;
    });
  }
  else
  {
    resourcecost_table.modify(resourcecost_table_itr, get_self(), [&](auto &new_row)
    {
      new_row.resource_name = resource;
      new_row.ratio = ratio;
    });
  }
}

```

Since the initialization code for adding entries to the `resourcecost` table mirrors processes outlined in previous articles, we won't delve into those specifics again here. Now that we've established the resource-to-token relationship, the next step involves writing the swap function. This function will handle the conversion of resources into GAME tokens, facilitating player transactions within the game environment.

```cpp
void game::swap(const name& owner, const std::string& resource, const float& amount2swap)
{
    require_auth(owner);

    resourcecost_t resourcecost_table(get_self(), get_self().value);
    auto resourcecost_table_itr = resourcecost_table.require_find(stringToUint64(resource), "Could not find resource cost config");

    const float token_amount = amount2swap / resourcecost_table_itr->ratio;
    const asset tokens2receive = asset(token_amount * 10000, symbol("GAME", 4)); // change to token you have deployed

    reduce_owner_resources_balance(owner, std::map<std::string, float>({{resource, amount2swap}}));
    tokens_transfer(owner, tokens2receive);
}

```

where

**owner** -- player who wants to make a swap

**resource** -- the name of the resource

**amount2swap** -- amount of resource that the player wants to exchange for tokens.

To execute a resource-to-token swap in the game:

1.  **Record Retrieval**: The function first retrieves the relevant record from the resource table based on the specified resource name. If the resource isn't found, an error is thrown.
2.  **Token Calculation**: It then calculates the number of tokens the player should receive based on the amount of resource they want to swap and the predefined ratio in the table: *const* *float* token_amount = amount2swap / resourcecost_table_itr->ratio;
3.  **Token Asset Creation**: An asset variable, representing the tokens, is created:\
    This step formats the token amount to consider the token's decimal places, ensuring the proper amount is processed for the swap:  *const* **asset** tokens2receive = **asset**(token_amount * 10000, **symbol**("GAME", 4));

The multiplication by (10^4) is necessary because the GAME token is defined with 4 decimal places. To accurately reflect the decimal in transactions, the `token_amount` calculated must be scaled up by 10,000. Additionally, the token symbol configuration requires two parameters: the token's name ("GAME") and its number of decimal places (4). This setup ensures that the token amount and its representation are correctly handled in the system for precise and valid transactions.

Note. While making your own game, make sure to replace GAME with your token name.

```cpp
 reduce_owner_resources_balance(owner, std::map<std::string, float>({{resource, amount2swap}}));
    tokens_transfer(owner, tokens2receive);
```

We are already familiar with this functionality from the previous part and we will also add a token transfer function.

```cpp
void game::tokens_transfer(const name& to, const asset& quantity)
{

  action
  (
    permission_level{get_self(),"active"_n},
    "tokencontr"_n, // change to your deployed token contract
    "transfer"_n,
    std::make_tuple
    (
      get_self(),
      to,
      quantity,
      std::string("")
    )
  ).send();
}

```

To complete the resource-to-token exchange process, the function initiates a token transfer using the contract's token transfer functionality. You will need to replace the referenced token contract name with the name of your specific token contract to ensure the transfer aligns with your game's tokenomics and smart contract settings. This step finalizes the swap by moving the calculated token amount from the game contract to the player's account.

"tokencontr"_n

This article detailed the process of exchanging in-game resources for tokens within a smart contract framework. It covered setting up a table to define resource-to-token conversion rates, calculating the number of tokens based on resources submitted by players, and handling token transactions effectively by ensuring all data aligns with the defined token characteristics. The focus was on the seamless integration of these functionalities into the game's ecosystem, facilitating a dynamic exchange mechanism that enhances player interaction and game economics.

**PS.** The [Following link](https://github.com/dapplicaio/TokenSwaps) leads us to a repository that corresponds everything described, so you can simply build that code and use in a way you want.

###