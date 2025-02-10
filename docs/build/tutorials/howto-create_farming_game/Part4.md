---
title: Part 4. What are resources and tokens in our game creation process.
order: 20
---

In this article, we're diving into two game-changers: resources and tokens.

### Resources

First up, resources. Think of them as the nuts and bolts of your game's economy. They're the materials and items players mine, produce, or acquire during gameplay. Each resource has its own identity: rarity, crafting abilities, and ways to interact within the game.

Resources aren't just collectibles; they're tradeable, usable, and crucial for character development and item crafting. In our game, they're the key to swapping for tokens and enhancing items. They are also neatly stored in a user-specific resource balance table.

![](/public/assets/images/tutorials/howto-create_farming_game/part4/resourcesandtokens-1024x140.png)

- **key_id**: Keys for searching in the table, created by converting the resource name into a number.
- **amount**: Amount of the acquired resource.
- **resource_name**: Name of the resource.

Next, let's look at a practical example: code to add a specific resource to a player's table. This code snippet shows how to update a player's resource balance in the game.

```C
resources_t resources_table(get_self(), owner.value);
```

Now, let's tackle initializing the resource table for a player. Think of it as setting up a personal resource bank account. We use `get_self()` to specify our contract as the table's location, ensuring the resources are linked to the correct owner.

```C
const float       amount = 25.3;
const std::string resource_name = "wood";
const uint64_t    key_id = stringToUint64(resource_name);
```

Let's create our variables to initialize the resource:

- **amount**: Quantity of mined resource.
- **resource_name**: Name of the resource.
- **key_id**: Generated from a string, i.e., converts the string into a number for writing to the table.

```C
auto resources_table_itr = resources_table.find(key_id);
if (resources_table_itr == std::end(resources_table))
{
  resources_table.emplace(get_self(), [&](auto &new_row) {
    new_row.key_id        = key_id;
    new_row.resource_name = resource_name;
    new_row.amount        = amount;
  });
}
else
{
  resources_table.modify(resources_table_itr, get_self(), [&](auto &new_row) {
    new_row.amount += amount;
  });
}
```

Next, we need to check whether such a key already exists in the table. If it exists, we simply modify the table.

```C
resources_table.modify(resources_table_itr, get_self(), [&](auto &new_row) {
  new_row.amount += amount;
});
```

In this segment, we delve into handling the resource table iterator (`resources_table_itr`). This iterator is crucial for updating resource amounts in our contract, denoted by `get_self()`. We use a lambda function for editing the `amount` field, adding the new value to the existing one.

Additionally, if there's no existing record for a specific resource, it's important to add a new entry to accurately track resources for each player.

```C
resources_table.emplace(get_self(), [&](auto &new_row) {
  new_row.key_id        = key_id;
  new_row.resource_name = resource_name;
  new_row.amount        = amount;
});
```

In this part, we focus on the parameters for resource management. The first parameter determines who pays for the transaction, which is crucial for maintaining the game's economy. The second parameter is a lambda function used for adding new records to the resource table.

It's important to note that resources in this game design are non-transferable between users. Instead, they are convertible into tokens or usable within the game, providing a unique approach to resource management and player interaction.

### Now, let's talk about tokens

Tokens, in the blockchain world, are digital assets representing value or goods. They are versatile, used for digital assets, smart contracts, and more. In gaming, they're the virtual currency for buying, selling, or owning unique in-game items. Tokens empower players with a decentralized economy and ownership, enhancing the play-to-earn experience.

In our game, we use a separate contract for tokens based on the common `eosio.token` standard on WAX. This setup ensures a smooth integration of tokens into the game environment.

You can follow this link to check the standard token implementation [here](https://github.com/EOSIO/eosio.contracts/tree/master/contracts/eosio.token).

In the next article, we will cover the NFT staking process as preparation for resource or token farming.

