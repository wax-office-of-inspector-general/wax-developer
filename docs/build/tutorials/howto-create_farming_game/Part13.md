---
title: Part 13. Token Staking and Voting in games
order: 65
---

To delve into token staking and its role in governance, we begin by setting up a new table to manage the staking process. This table will track the staked tokens and their corresponding voting rights, crucial for enabling players to participate in key decision-making processes, such as changing resource-to-token ratios in swaps. This functionality not only deepens player engagement but also decentralizes game governance, empowering players to have a say in the game's economic strategies.

```cpp
struct [[eosio::table]] balance_j
    {
    name  owner;
    asset quantity;

    uint64_t primary_key() const { return owner.value; }
    };
typedef multi_index< "balance"_n, balance_j > balance_t;
```

For the implementation of token staking, we'll establish a new table with fields for 'owner' and 'number of staked tokens'. This table will track the tokens each player has staked in the game. Additionally, to facilitate staking, a function will be added to listen for token transfers. This function will automatically update the staking table whenever tokens are transferred to the contract, ensuring that players' staked tokens are accurately recorded and managed.

```cpp
[[eosio::on_notify("tokencont::transfer")]] // tokencont change for your token contract
void receive_token_transfer
(
    const name& from,
    const name& to,
    const asset& quantity,
    const std::string& memo
);
```

When setting up the token staking functionality, make sure to customize the code by replacing `tokencont` with the actual name of your token contract. This is essential for ensuring that the staking function correctly interacts with the specific token contract deployed for your game, allowing for accurate tracking and management of staked tokens.

```cpp
void game::receive_token_transfer
(
  const name& from,
  const name& to,
  const asset& quantity,
  const std::string& memo
)
{
  if(to != get_self())
    return;

  if(memo == "stake")
  {
    increase_tokens_balance(from, quantity);
  }
  else
    check(0, "Invalid memo");
}
```

and

```cpp
void game::increase_tokens_balance(const name& owner, const asset& quantity)
{
  balance_t balance_table(get_self(), get_self().value);
  auto balance_table_itr = balance_table.find(owner.value);

  if(balance_table_itr == std::end(balance_table))
  {
    balance_table.emplace(get_self(), [&](auto &new_row)
    {
      new_row.owner = owner;
      new_row.quantity = quantity;
    });
  }
  else
  {
    balance_table.modify(balance_table_itr, get_self(), [&](auto &new_row)
    {
      new_row.quantity += quantity;
    });
  }
}
```

The function for managing token staking operates by accessing the balance table to locate a specific player's entry. If the player already has a recorded balance, the function increments the number of staked tokens accordingly. If no existing balance is found, it creates a new record for the player, documenting the amount of tokens they have staked.

## Voting

Now that token staking is in place, we'll focus on implementing a voting system to change the rate in resource swaps. To facilitate this, we'll introduce a new table specifically designed to manage voting records. This table will track each vote related to rate adjustments, allowing staked token holders to influence the resource-to-token conversion rates based on their preferences and stake in the game. This mechanism integrates democratic decision-making into the game's economic model.

```cpp
 struct [[eosio::table]] changeration_j
  {
    uint64_t                 voting_id;
    std::string              resource_name;
    float                    new_ratio;
    std::map<name, asset>    voted; // first is player name, second is voting power (in tokens)

    uint64_t primary_key() const { return voting_id; }
  };
  typedef multi_index< "changeration"_n, changeration_j > changeration_t;
```

To support voting on changes in resource swap rates, we will establish a new table structured as follows:

-   **voting_id**: A unique identifier for each voting event.
-   **resource_name**: The name of the resource subject to the rate change.
-   **new_ratio**: The proposed new exchange ratio of the resource to the token.
-   **voted**: A list detailing which players have voted, along with the number of votes each player has cast, reflecting their staked token amounts.

This setup allows token holders to participate directly in decisions affecting the game's economic dynamics.

```cpp
void game::createvoting(
  const name& player,
  const std::string& resource_name,
  const float& new_ratio
)
{
  require_auth(player);

  const uint64_t key_id = stringToUint64(resource_name);
  resourcecost_t resourcecost_table(get_self(), get_self().value);
  auto resourcecost_table_itr = resourcecost_table.require_find(key_id, "Could not find selected resource name");

  changeration_t changeration_table(get_self(), get_self().value);
  const uint64_t new_voting_id = changeration_table.available_primary_key();

  changeration_table.emplace(player, [&](auto &new_row)
  {
    new_row.voting_id = new_voting_id;
    new_row.resource_name = resource_name;
    new_row.new_ratio = new_ratio;
  });
}
```

To begin with, we check whether such a resource exists in the config table:

```cpp
  const uint64_t key_id = stringToUint64(resource_name);
  resourcecost_t resourcecost_table(get_self(), get_self().value);
  auto resourcecost_table_itr = resourcecost_table.require_find(key_id, "Could not find selected resource name");

```

after that, we extract a new id for voting

```cpp
 changeration_t changeration_table(get_self(), get_self().value);
  const uint64_t new_voting_id = changeration_table.available_primary_key();

```

and make a new record, note that the player now pays for the frames to avoid abuse

```cpp
 changeration_table.emplace(player, [&](auto &new_row)
  {
    new_row.voting_id = new_voting_id;
    new_row.resource_name = resource_name;
    new_row.new_ratio = new_ratio;
  });

```

Now let's create a function for voting. Let's imagine that conditionally we need 100 votes (100 tokens for the vote to be completed and the changes to be approved).

```cpp
void game::vote(
  const name& player,
  const uint64_t& voting_id
)
{
  require_auth(player);

  balance_t      balance_table(get_self(), get_self().value);
  resourcecost_t resourcecost_table(get_self(), get_self().value);
  changeration_t changeration_table(get_self(), get_self().value);

  auto balance_table_itr = balance_table.require_find(player.value, "You don't have staked tokens to vote");
  auto changeration_table_itr = changeration_table.require_find(voting_id, "Could not find selected voting id");
  auto resourcecost_table_itr = resourcecost_table.require_find(stringToUint64(changeration_table_itr->resource_name));

  const asset goal_votes = asset(100 * 10000, symbol("GAME", 4)); // 100.0000 GAME tokens to apply changes
  asset total_votes = asset(0, symbol("GAME", 4));

  for (const auto& map_itr : changeration_table_itr->voted)
    total_votes += map_itr.second;

  if(total_votes + balance_table_itr->quantity >= goal_votes)
  {
    resourcecost_table.modify(resourcecost_table_itr, get_self(), [&](auto &new_row)
    {
      new_row.ratio = changeration_table_itr->new_ratio;
    });

    changeration_table.erase(changeration_table_itr);
  }
  else
  {
    changeration_table.modify(changeration_table_itr, get_self(), [&](auto &new_row)
    {
      new_row.voted[player] = balance_table_itr->quantity;
    });
  }
}
```

Let's describe the code above in parts:

1.  player authorization

```cpp
 require_auth(player);
```

2. For effective management and processing of player votes regarding resource-to-token ratio changes, the system incorporates critical data structures. These include the Token Balance Table to check players' staked tokens for voting power, the Resource Price Config to reference current and proposed ratio changes, and the Voting Table to accurately manage and tally votes using its iterators. These components are essential for ensuring transparency and integrity in the game's democratic decision-making process.

```cpp
balance_t      balance_table(get_self(), get_self().value);
resourcecost_t resourcecost_table(get_self(), get_self().value);
changeration_t changeration_table(get_self(), get_self().value);

auto balance_table_itr = balance_table.require_find(player.value, "You don't have staked tokens to vote");
auto changeration_table_itr = changeration_table.require_find(voting_id, "Could not find selected voting id");
auto resourcecost_table_itr = resourcecost_table.require_find(stringToUint64(changeration_table_itr->resource_name));
```

3. For the voting process, a specific variable is initialized to track progress towards the approval threshold predefined in the vote setup. If this threshold is met, the vote is considered successful, and changes can be applied to the resource ratio settings.

```cpp
const asset goal_votes = asset(100 * 10000, symbol("GAME", 4)); // 100.0000 GAME tokens to apply changes
  asset total_votes = asset(0, symbol("GAME", 4));
```

4. So total votes count needs to be done

```cpp
for (const auto& map_itr : changeration_table_itr->voted)
    total_votes += map_itr.second;
```

5. If the total votes reach the threshold set for the proposal, indicating approval by the players, then the resource price configuration they voted on is updated accordingly. Following this update, the specific vote is concluded and removed from the voting table, finalizing the decision and reflecting the players' collective choice in the game's settings.

```cpp
if(total_votes + balance_table_itr->quantity >= goal_votes)
{
    resourcecost_table.modify(resourcecost_table_itr, get_self(), [&](auto &new_row)
    {
      new_row.ratio = changeration_table_itr->new_ratio;
    });

    changeration_table.erase(changeration_table_itr);
}
```

6. otherwise, simply add the votes currently cast by the player

```cpp
else
{
    changeration_table.modify(changeration_table_itr, get_self(), [&](auto &new_row)
    {
        new_row.voted[player] = balance_table_itr->quantity;
    });
}
```

This article focused on implementing a token staking and voting system within a game environment. It detailed setting up a voting structure for players to influence changes in resource-to-token exchange rates through a democratic process. Key components included creating tables for tracking votes and configuring tokens staked by players to determine their voting power. The article also described how votes are tallied and the conditions under which proposed changes are implemented, emphasizing the integration of these functionalities into the game's smart contract framework.

**PS.** The [Following link](https://github.com/dapplicaio/TokenStakingAndVoting) leads us to a repository that corresponds everything described.