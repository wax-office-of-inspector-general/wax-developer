---
title: Part 14. Governance in games
order: 70
---

In this article, we will develop a voting system that will allow users to provide developers with suggestions or change the value of game changes.

1.  Creating configs table

```cpp
struct [[eosio::table]] mconfig_j
  {
    std::string variable_name;
    std::string variable_type;
    std::string variable_value;

    uint64_t primary_key() const { return stringToUint64(variable_name); }
  };
  typedef multi_index<"config"_n, mconfig_j> mconfigs_t;

```

The table is organized from rows (variable name, variable type, variable value)

```cpp
typedef std::variant<float, uint32_t, int32_t, std::string> CONFIG_TYPE;

void game::setcnfg(
    const std::string &variable_name,
    const CONFIG_TYPE &variable)
{
    require_auth(get_self());
    mconfigs_t configs_table(get_self(), get_self().value);

    auto var_iter = configs_table.find(stringToUint64(variable_name));

    auto variant_data = get_config_variant_data(variable);

    if (var_iter == configs_table.end())
    {
        configs_table.emplace(get_self(), [&](auto &new_row)
                              {
        new_row.variable_name = variable_name;
        new_row.variable_type = variant_data.first;
        new_row.variable_value = variant_data.second; });
    }
    else
    {
        check(var_iter->variable_type == variant_data.first, "Types mismatch");
        configs_table.modify(var_iter, get_self(), [&](auto &row)
                             { row.variable_value = variant_data.second; });
    }
}

```

The **CONFIG_TYPE** type indicates the valid types for configuration variables. The **setcnfg** action accepts the variable name and its value (along with the type, the **eosio** platform itself checks for the correct type). If this variable is present in the config table, we check whether the type of the variable matches the one passed by the user and change the table field. If the variable is not in the table, we add it.

```cpp
std::pair<std::string, std::string> game::get_config_variant_data(const CONFIG_TYPE &var)
{
    if (std::holds_alternative<std::string>(var))
    {
        return {"string", std::get<std::string>(var)};
    }
    else if (std::holds_alternative<float>(var))
    {
        return {"float", std::to_string(std::get<float>(var))};
    }
    else if (std::holds_alternative<uint32_t>(var))
    {
        return {"uint32", std::to_string(std::get<uint32_t>(var))};
    }
    else if (std::holds_alternative<int32_t>(var))
    {
        return {"int32", std::to_string(std::get<int32_t>(var))};
    }
    else
    {
        return {"error", ""};
    }
}

```

This helper function translates **CONFIG_TYPE** data into a pair (variable type, variable value).

2\. Main tables

```cpp
struct [[eosio::table]] votings_info_j
  {
    name voting_name;
    name creator;
    uint64_t min_staked_tokens;
    uint64_t max_staked_tokens;
    uint64_t total_staked;
    uint32_t creation_time;
    uint32_t time_to_vote;
    std::string variable_to_change;

    uint64_t primary_key() const { return voting_name.value; };
  };
  typedef multi_index<"vtsinfo"_n, votings_info_j> vinfo_t;
```

This table records voting information in a separate table. With its help, we can view the total number of staked tokens, see if the voting time has expired, and so on.

```cpp
  struct [[eosio::table]] voting_j
  {
    uint64_t id;
    std::string voting_option;
    std::map<name, uint64_t> voted;
    uint64_t total_voted_option;

    uint64_t primary_key() const { return id; }
  };
  typedef multi_index<"genvtngs"_n, voting_j> votings_t;

```

This table (scope -- the name of the vote) stores the voting options and std::map with pairs (player, number of staked tokens), as well as the total amount of tokens staked for this option.

```cpp
 struct [[eosio::table]] closed_votings_j
  {
    uint64_t voting_id;
    name voting_name;
    std::string winner_option;

    uint64_t primary_key() const { return voting_id; };
  };
  typedef multi_index<"closedvts"_n, closed_votings_j> closed_votings_t;
```

This table stores pairs (voting, voting result).

3\. Creating votings

```cpp
void game::crgenvt(
    const name &player,
    const name &voting_name,
    const std::vector<std::string> &options,
    uint64_t min_staked_tokens,
    uint32_t time_to_vote,
    uint64_t max_staked_tokens)

{
    require_auth(player);
    vinfo_t vinfo(get_self(), get_self().value);
    check(vinfo.find(voting_name.value) == std::end(vinfo), "Voting with this name is active");

    // add to info

    vinfo.emplace(get_self(), [&](auto &new_row)
                  {
        new_row.voting_name = voting_name;
        new_row.creator = player;
        new_row.min_staked_tokens = min_staked_tokens;
        new_row.max_staked_tokens = max_staked_tokens;
        new_row.total_staked = 0;
        new_row.creation_time = current_time_point().sec_since_epoch();
        new_row.time_to_vote = time_to_vote; });

    add_voting_with_options(voting_name, options);
}
```

This function writes voting data to the **vtsinfo** table and adds fields to the **genvtngs** table (option name, map with voters, total amount of tokens staked for the option).

```cpp
void game::cravote(
    const name &player,
    const name &voting_name,
    const std::string &variable_name,
    const std::vector<CONFIG_TYPE> &options_typed,
    int64_t min_staked_tokens,
    int32_t time_to_vote,
    uint64_t max_staked_tokens)
{
    require_auth(player);
    vinfo_t vinfo(get_self(), get_self().value);
    check(vinfo.find(voting_name.value) == std::end(vinfo), "Voting with this name is active");

    // check type correctness

    std::vector<std::string> options;
    mconfigs_t configs_table(get_self(), get_self().value);
    auto config_iter = configs_table.require_find(stringToUint64(variable_name), "No such variable in configs table");
    std::string variable_type = config_iter->variable_type;

    for (const auto &option : options_typed)
    {
        auto variant_data = get_config_variant_data(option);
        check(variant_data.first == variable_type, "Types mismatch in options");
        options.push_back(variant_data.second);
    }

    // add to info

    vinfo.emplace(get_self(), [&](auto &new_row)
                  {
        new_row.voting_name = voting_name;
        new_row.creator = player;
        new_row.min_staked_tokens = min_staked_tokens;
        new_row.max_staked_tokens = max_staked_tokens;
        new_row.total_staked = 0;
        new_row.creation_time = current_time_point().sec_since_epoch();
        new_row.time_to_vote = time_to_vote;
        new_row.variable_to_change = variable_name; });

    add_voting_with_options(voting_name, options);
}
```

This function creates a vote that affects some variable from the config table. First, for each option, we check if its type matches the variable name. If so, we add information about the vote to the **vtsinfo** and **genvtngs** tables.

```cpp
void game::add_voting_with_options(const name &voting_name, const std::vector<std::string> &options)
{
    votings_t votings(get_self(), voting_name.value);

    for (uint64_t index = 0; index < options.size(); index++)
    {
        votings.emplace(get_self(), [&](auto &new_row)
                        {
            new_row.id = index;
            new_row.voting_option = options[index];
            new_row.voted = {};
            new_row.total_voted_option = 0; });
    }
}

```

This is an auxiliary function that adds rows to the **genvtngs** table (id, option name, map with voters, total number of tokens).

**4\.** Voting process

```cpp
void game::gvote(
    const name &player,
    const name &voting_name,
    const std::string &voting_option,
    uint64_t voting_power)
{
    require_auth(player);
    balance_t balance_table(get_self(), get_self().value);
    auto player_balance_iter = balance_table.require_find(player.value, "No tokens staked");
    check(player_balance_iter->quantity.amount >= voting_power, "Not enough tokens to vote with that voting power");

    vinfo_t vinfo(get_self(), get_self().value);
    auto voting_info_iter = vinfo.require_find(voting_name.value, "No such voting");

    // check time

    if (voting_info_iter->time_to_vote != 0)
    {
        check((current_time_point().sec_since_epoch() - voting_info_iter->creation_time) <= voting_info_iter->time_to_vote,
              "Time for voting is over");
    }

    // check max limit

    if (voting_info_iter->max_staked_tokens != 0)
    {
        check(voting_info_iter->total_staked < voting_info_iter->max_staked_tokens, "Max limit for staking is reached");
    }

    votings_t votings(get_self(), voting_name.value);
    auto option_iter = votings.end();
    auto current_iter = votings.end();
    uint64_t id = 0;

    while (true)
    {
        current_iter = votings.find(id);

        if (current_iter == votings.end())
        {
            break;
        }

        if (current_iter->voting_option == voting_option)
        {
            option_iter = current_iter;
        }

        check(current_iter->voted.find(player) == current_iter->voted.end(), "Already voted");

        id++;
    }

    check(option_iter != votings.end(), "No such option");

    votings.modify(option_iter, get_self(), [&](auto &row)
                   {

        row.voted[player] = voting_power;
        row.total_voted_option += voting_power; });

    vinfo.modify(voting_info_iter, get_self(), [&](auto &row)
                 { row.total_staked += voting_power; });

    balance_table.modify(player_balance_iter, get_self(), [&](auto& row)
    {
        row.quantity.amount -= voting_power;
    });

    // check max limit and close if it's achieved
    if (voting_info_iter->max_staked_tokens != 0)
    {
        if (voting_info_iter->total_staked >= voting_info_iter->max_staked_tokens)
        {
            if (voting_info_iter->variable_to_change.empty())
            {
                close_general_voting(voting_name);
            }
            else
            {
                close_automatic_voting(voting_name);
            }
        }
    }
}
```

First, this function checks whether the user has tokens, whether they are sufficient in number, and whether the vote to which they are referring exists. Then we check whether the voting time has expired and whether the upper limit of votes has been reached. If so, it is no longer possible to vote. 

Otherwise, we go through the voting options and check whether the one the player is referring to is among them. We also check if they have voted before. If they have, we interrupt the function. 

If the option is found, we modify the field of the **genvtngs** table -- we add the player to std::map, increase the total number of tokens staked for the option. In the **vtsinfo** table, increase the **total_tokens_staked** field. We also charge the player the specified number of tokens.

At the very end, check whether the maximum number of votes has been reached. If so, close the voting (more details are provided later in the article).

```cpp
void game::cancelvote(const name& player, const name& voting_name)
{
    require_auth(player);

    vinfo_t vinfo(get_self(), get_self().value);
    auto voting_info_iter = vinfo.require_find(voting_name.value, "No such voting");

    balance_t balance_table(get_self(), get_self().value);
    auto player_balance_iter = balance_table.require_find(player.value, "No staked tokens for this player");

    votings_t votings(get_self(), voting_name.value);
    auto option_iter = votings.end();
    auto current_iter = votings.end();

    uint64_t voting_power = 0;
    uint32_t id = 0;

    while (true)
    {
        current_iter = votings.find(id);

        if (current_iter == votings.end())
        {
            break;
        }

        auto player_voting_iter = current_iter->voted.find(player);
        if (player_voting_iter != current_iter->voted.end())
        {
            voting_power = player_voting_iter->second;

            votings.modify(current_iter, get_self(), [&](auto& row)
            {
                row.voted.erase(player_voting_iter);
                row.total_voted_option -=  voting_power;
            });

            break;
        }

        id++;
    }

    if (voting_power != 0)
    {
        vinfo.modify(voting_info_iter, get_self(), [&](auto& row)
        {
            row.total_staked -= voting_power;
        });

        balance_table.modify(player_balance_iter, get_self(), [&](auto& row)
        {
            row.quantity.amount += voting_power;
        });
    }
}
```

This feature allows a player to cancel their vote in a poll. Let's go through the voting options. If we find the one that the player voted for, we remove it from the map, reduce the number of staked tokens in both tables. We return the player's tokens back to him.

5\. Closing voting

```cpp
void game::clsvt(const name &voting_name)
{
    vinfo_t vinfo(get_self(), get_self().value);
    auto voting_info_iter = vinfo.require_find(voting_name.value, "No such voting");

    require_auth(voting_info_iter->creator);

    if (voting_info_iter->variable_to_change.empty())
    {
        close_general_voting(voting_name);
    }
    else
    {
        close_automatic_voting(voting_name);
    }
}
```

We should check if such a vote exists. Then we call separate functions for two different types of voting.

```cpp
void game::close_general_voting(const name &voting_name)
{
    clear_voting_from_vinfo(voting_name);
    std::string winner = get_voting_winner_clear(voting_name);

    // add to closed
    closed_votings_t closed_votings(get_self(), get_self().value);
    uint64_t voting_id = closed_votings.available_primary_key();

    closed_votings.emplace(get_self(), [&](auto &new_row)
                           {
        new_row.voting_id = voting_id;
        new_row.voting_name = voting_name;
        new_row.winner_option = winner; });
}

```

First, delete the voting data from the **vtsinfo** table. Then we get the option with the largest number of staked tokens and delete the fields from the **genvtngs** table. Since the voting is of the general type, we add a row (id, voting name, winning option) to the table with the results of the general voting.

```cpp
void game::close_automatic_voting(const name &voting_name)
{
    std::string variable_name = clear_voting_from_vinfo(voting_name);
    std::string winner = get_voting_winner_clear(voting_name);

    // do transaction
    mconfigs_t config_table(get_self(), get_self().value);
    auto config_iter = config_table.require_find(stringToUint64(variable_name), "Variable in question was deleted");
    config_table.modify(config_iter, get_self(), [&](auto &row)
                        { row.variable_value = winner; });
}
```

Closing automatic voting differs in that we modify the value of the variable in the config table at the end.

```cpp
std::string game::clear_voting_from_vinfo(const name &voting_name)
{
    vinfo_t vinfo(get_self(), get_self().value);
    auto voting_info_iter = vinfo.require_find(voting_name.value, "No such voting");

    std::string variable_name = voting_info_iter->variable_to_change;
    uint64_t min_staked = voting_info_iter->min_staked_tokens;
    uint64_t total_staked = voting_info_iter->total_staked;

    check(total_staked >= min_staked, "Minimal rate is not reached yet");

    if (voting_info_iter->time_to_vote != 0)
    {
        check((current_time_point().sec_since_epoch() - voting_info_iter->creation_time) >= voting_info_iter->time_to_vote,
              "Time for voting is not over yet");
    }

    if (voting_info_iter->max_staked_tokens != 0)
    {
        check(total_staked >= voting_info_iter->max_staked_tokens, "Voting limit is not reached yet");
    }

    vinfo.erase(voting_info_iter);

    return variable_name;
}
```

This function checks whether the conditions for closing the vote are met and deletes the data about it from the **vtsinfo** table.

```cpp
std::string game::get_voting_winner_clear(const name &voting_name)
{
    std::string winner = "";
    uint64_t max_voted = 0;
    uint64_t id = 0;

    votings_t votings(get_self(), voting_name.value);

    balance_t balance_table(get_self(), get_self().value);

    while (true)
    {
        auto option_iter = votings.find(id);

        if (option_iter == votings.end())
        {
            break;
        }

        if (option_iter->total_voted_option > max_voted)
        {
            max_voted = option_iter->total_voted_option;
            winner = option_iter->voting_option;
        }

        for (const auto& player_amount : option_iter->voted)
        {
            auto player_balance_iter = balance_table.require_find(player_amount.first.value, "Player was deleted");
            balance_table.modify(player_balance_iter, get_self(), [&](auto& row)
            {
                row.quantity.amount += player_amount.second;
            });
        }

        votings.erase(option_iter);

        id++;
    }

    return winner;
}
```

This function goes through the voting options, finds the winning option, and deletes the rows of the genvtngs table one by one. It also returns the player's tokens to the balance.

In this article we described a step by step process of creating governance via voting, so users can impact overall project game design or certain parts of game economy.

**PS.** The [Following link](https://github.com/dapplicaio/GamesGovernane) leads us to a repository that corresponds everything described.

###