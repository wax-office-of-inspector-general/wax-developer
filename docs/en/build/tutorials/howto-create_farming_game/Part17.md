---
title: Part 17. Quest systems in game
order: 85
---

In this article, we will add a quest system that will allow us to engage more with the players in our games.

1.  **Let's add the necessary tables**

```cpp
struct quest
{
    std::string type;
    float required_amount;
    float current_amount;
};

struct [[eosio::table]] quests_j
{
    name player;
    std::vector<quest> quests;

    uint64_t primary_key() const {return player.value;};
};
typedef multi_index<"quests"_n, quests_j> quests_t;

```

The quest structure denotes a triple (quest type, required number of actions/resources/tokens, current number of actions/resources/tokens), where the quest type indicates what the player needs to do. Examples of types are below.

The quests table consists of the following strings (player, quests[])

**2\. Adding and deleting quests**

```cpp
void game::addquest(
    const name &player,
    const std::string &type,
    float required_amount)
{
    quests_t quests_table(get_self(), get_self().value);
    auto player_iter = quests_table.find(player.value);

    quest temp_quest = {type, required_amount, 0.0f};

    if (player_iter == quests_table.end())
    {
        quests_table.emplace(get_self(), [&](auto& new_row)
        {
            new_row.player = player;
            new_row.quests = {temp_quest};
        });
    }
    else
    {
        quests_table.modify(player_iter, get_self(), [&](auto& row)
        {
            row.quests.push_back(temp_quest);
        });
    }
}
```

Here we take the pointer to the table. If there is a player, we add a new quest to the already created vector. If there is no player, we create a row for him or her and add the quest to the vector.

```cpp
void game::cmpltquest(
    const name &player,
    uint32_t quest_index)
{
    quests_t quests_table(get_self(), get_self().value);
    auto player_iter = quests_table.require_find(player.value, "No such quest");

    check(player_iter->quests.size() > quest_index, "Index outside of scope");

    quest temp = player_iter->quests[quest_index];
    check(temp.current_amount >= temp.required_amount, "Quest conditions are not met");

    quests_table.modify(player_iter, get_self(), [&](auto& row){
        row.quests.erase(row.quests.begin() + quest_index);
    });
}
```

Take the iterator to the table. Check if there is a field for this player. Then we check if there is a quest for this index in the vector. Check if the quest requirements are met. If so, delete this quest from the array.

**3\. Connecting the quest system with other game systems**

Let's introduce several types of quests for example

**"Staking" -- to stake X tools**

```cpp
update_quests(owner, "staking", items_to_stake.size());
```

Added a line in the stake_items function that updates information about the number of staked instruments

**"Swap" -- exchange X tokens**

```cpp
update_quests(owner, "swap", tokens2receive.amount);
```

Added a line to the swap function that updates information about the number of tokens exchanged for resources

**"Upgrade" -- upgrade an item to level X**

```cpp
update_quests(owner, "upgrade", new_level, true);
```

Added a line to the upgrade_item function, updating information about the level to which the player has raised a certain tool

**"Tokens" -- stake X tokens**

```cpp
update_quests(owner, "tokens", quantity.amount);
```

Added a line to the increase_tokens_balance function, updating information about the number of staked tokens on the player's balance

**"Stone/Wood/etc." -- to farm X resource**s

```cpp
for (const auto& resource_amount_pair : mined_resources)
{
    update_quests(owner, resource_amount_pair.first, resource_amount_pair.second);
}
```

We added a line to the claim function. We go through the names of the resources and enter information about how many of them the player has obtained.

```cpp
void game::update_quests(const name &player, const std::string &type, float update_amount, bool set)
{
   quests_t quests_table(get_self(), get_self().value);
   auto player_iter = quests_table.require_find(player.value, "No such quest");

   quests_table.modify(player_iter, get_self(), [&](auto& row){
       for (auto& quest : row.quests)
       {
           if (quest.type == type)
           {
               if (!set)
               {
                   quest.current_amount += update_amount;
               }
               else
               {
                   quest.current_amount = std::max(quest.current_amount, update_amount);
               }
           }
       }
   });
}

```

This function goes through the player's quests. If the type of quest matches the one we want to update, we update the **current_amount** of this quest. For example, a player has obtained 10 trees and has two quests for farming trees with current values of 20, 100. After calling the function, they will become 30 and 110.

PS. This article shows simple and robust quest system, that can be updated as we go, as we may not know what types of quests we will need in future.

**PS. PS.** The [Following link](https://github.com/dapplicaio/GamingQuests) leads us to a repository that corresponds everything described.