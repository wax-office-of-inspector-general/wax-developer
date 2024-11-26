---
title: Part 4. What are resources and tokens in our game creation process.
order: 20
---

In this article, we're diving into two game-changers: resources and tokens.

First up, resources. Think of them as the nuts and bolts of your game's economy. They're the materials and items players mine, produce, or nab during gameplay. Each resource comes with its own flavor -- rarity, crafting abilities, and ways to interact within the game.

Resources aren't just collectibles; they're tradeable, usable, and crucial for character development and item crafting. In our game, they're the key to swapping for tokens and sprucing up items. And yes, they're neatly stored in a user-specific resource balance table."

![](/public/assets/images/tutorials/howto-create_farming_game/part4/resourcesandtokens-1024x140.png)

key_id -- keys for searching in the table, is created using the envelope of the resource name into a number

amount --  amount of the acquired resource

resource_name -- name of resource

Next, let's look at a practical example: code to add a specific resource to a player's table. This code snippet is a real-world application, showing how to update a player's resource balance in the game.

```C
  resources_t resources_table(get_self(), owner.value);
```

Now, let's tackle initializing the resource table for a player. Think of it as setting up a personal resource bank account. We use `get_self()` to specify our contract as the table's location, ensuring the resources are linked to the right owner.

```C
 const float       amount = 25.3;
 const std::string resource_name = "wood";
 const uint64_t    key_id = stringToUint64(resource_name);
```

Now, let's create our variables to initialize the resource.

amout --  quantity of mined resource

resource_name -- name

key_id --  is generated from a string, that is, converts string into a number for writing to the table

```C
auto resources_table_itr = resources_table.find(key_id);
    if(resources_table_itr == std::end(resources_table))
    {
      resources_table.emplace(get_self(), [&](auto &new_row)
      {
        new_row.key_id          = key_id;
        new_row.resource_name   = resources_table_itr;
        new_row.amount          = amount;
      });
    }
    else
    {
      resources_table.modify(resources_table_itr, get_self(), [&](auto &new_row)
      {
        new_row.amount += amount;
      });
    }
```

Next, we need to check whether such a key already exists in the table, if it exists, then we just need to edit the table.

```C
resources_table.modify(resources_table_itr, get_self(), [&](auto &new_row)
      {
        new_row.amount += amount;
      });
```

In this segment, we delve into handling the resource table iterator (`resources_table_itr`). This iterator is crucial for updating resource amounts in our contract, denoted by `get_self()`. We use a lambda function for editing the `amount` field, adding the new number to the existing one.

Additionally, if there's no existing record for a specific resource, it's important to add a new entry to accurately track resources for each player.

```C
 resources_table.emplace(get_self(), [&](auto &new_row)
      {
        new_row.key_id          = key_id;
        new_row.resource_name   = resources_table_itr;
        new_row.amount          = amount;
      });

```

In this part, we focus on the parameters for resource management. The first parameter determines who pays for the transaction, crucial for maintaining the game's economy. The second parameter is a lambda function used for adding new records to the resource table.

It's important to note that resources in this game design are non-transferable between users. Instead, they're convertible into tokens or usable within the game, providing a unique approach to resource management and player interaction.

Now, let's talk about tokens.
-----------------------------

Tokens, in the blockchain world, are digital assets representing value or assets. They're versatile, used for digital assets, smart contracts, and more. In gaming, they're the virtual currency for buying, selling, or owning unique in-game items. They empower players with decentralized economy and ownership, enhancing the play-to-earn experience.

In our game, we use a separate contract for tokens based on the common eosio.token standard on WAX. This setup ensures a smooth integration of tokens into the game environment.

You can follow link to check standard token implementation <https://github.com/EOSIO/eosio.contracts/tree/master/contracts/eosio.token>

In the next article we will cover NFT staking process as preparation to resource or token farming.