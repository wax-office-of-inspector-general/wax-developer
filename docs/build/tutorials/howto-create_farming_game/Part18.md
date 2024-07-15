Part 18: GUI for quests and leaderboards
===

In our previous article, we looked at swaps, token stakes, and governance mechanisms.

Building on that foundation, in this article we will also explore leaderboard functionality and delve into quests in the context of the game ecosystem.

**Leaderboard**s
----------------

A leaderboard is essential for tracking and displaying the performance and progress of participants in a gaming environment. It serves as a visual representation of rankings, motivating players to strive for higher positions and encouraging healthy competition.

The Leaderboard is typically ranked based on the points accumulated by each participant, showing their relative success. Within this framework, it includes areas such as wood, stone, food, and gems collected or earned per hour.

For example, a player used the claim action and received 100 stones. Then in the table lboards("Stone") in the corresponding field points = points + 100.

On the UI, the leaderboard looks like this:

![](/public/assets/images/tutorials/howto-create_farming_game/part18/image1.png)

All our data is stored in a table of smart contracts, where each scope has a separate table, this data can be retrieved using the leaderboardTable() function.

That is, the possible scopes are : **stone, wood, food, gems, tokens, miningpwr**

```js
export const leaderboadrTable = async () => {
  const { rows } = await fetchRows({
      contract: "dappgamemine",
      scope: "stone",
      table: "lboards"
  });

  return rows;
}

```

Here is a link to the leaderboard in the smart contract:

<https://testnet.waxblock.io/account/dappgamemine?code=dappgamemine&scope=stone&table=lboards&lower_bound=&upper_bound=&limit=10&reverse=false#contract-tables>

**Quests system**
-----------------

Each quest is a specific action that the player must perform and the amount of time it takes to complete it. For example, "Farm 10 stones" or "Craft 3 tools".  The quest status is updated with the corresponding action. When the quest conditions are met, the player can complete the quest (remove it from the quest list) and collect the reward (if any).

Quests allow you to direct the player's gameplay by gradually revealing game mechanics to him or her. For example, at the beginning of the game, quests will be of the type "build a farm", "build a tool", "get 100 units of food", etc.

On the UI, the leaderboard looks like this:

![](/public/assets/images/tutorials/howto-create_farming_game/part18/image2.png)

When the quest is completed, we can call the "Claim" action to collect the reward. To do this, we use the **collectQuest**() function:

```js
export const collectQuest = async ({ activeUser, index }) => {
  return await signTransaction({
      activeUser,
      account: 'dappgamemine',
      action: 'compltquest',
      data: {
        player: activeUser.accountName,
        quest_index: index,
      }
  });
};
```

Here we use an action called "compltquest" for claim reward^

-   **player**-- this is our nickname of the user who connected his wallet, we take it from activeUser.accountName;
-   **quest_index** -- quest ID from "**quests**" table;

To retrieve all the quests created by the contract, you must call the **fetchQuests**() function:

```js
export const fetchQuests = async () => {
  const { rows } = await fetchRows({
       contract: 'dappgamemine',
       scope: 'dappgamemine',
       table: "quests"
     });
        return rows;
}
```

Here is a link for claim completed quest:

<https://testnet.waxblock.io/account/dappgamemine?action=cmpltquest#contract-actions>

and quests table:

<https://testnet.waxblock.io/account/dappgamemine?code=dappgamemine&scope=dappgamemine&table=quests&lower_bound=&upper_bound=&limit=10&reverse=false#contract-tables>

In this article we made an overview of final elements of our GUI for WAX game development series. Thus we covered leaderboards and quests as core feature of most of the modern web3 games.

**PS. PS.** The [Following link](https://github.com/dapplicaio/GUIQuestsLeaderboards) leads us to a repository that corresponds everything described.