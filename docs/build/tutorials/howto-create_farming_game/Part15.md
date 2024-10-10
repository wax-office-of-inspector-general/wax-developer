---
title: Part 15. GUI for swaps, staking and governance
order: 75
---

In addition to the previous articles integrating it into a ReactJS interface, and reading data from a WAX smart contract table, we will also dive deeper into swaps. We will look at the use of WAX tokens or NFTs in games and how user/player governance works.

**Token swaps**
---------------

The swap is designed to exchange the amount of a resource at the rate specified in the table called "**resourcecost**". After the action is completed, the contract sends WAX tokens (they are not staked, the player can stake them later).

In simple terms, you sell your resource and receive WAX tokens for it. To do this, you need to call the contract action "**swap**".

```js
export const swap = async ({ activeUser, resource, amount2swap }) => {
  return await signTransaction({
      activeUser,
      account: 'dappgamemine',
      action: 'swap',
      data: {
          owner: activeUser.accountName,
          resource: resource,
          amount2swap: amount2swap
      }
  });
};
```

Here we use an action game called "swap".

-   **owner** -- this is our nickname of the user who connected his wallet, we take it from activeUser.accountName;
-   **resource** -- name of resource;
-   **amount2swap** (number) -- amount for swap.

Now let's look at the "**resourcecost**" table.

```js
export const resourceСost = async () => {
const { rows } = await fetchRows({
        contract: 'dappgamemine',
        scope: 'dappgamemine',
        table: "resourcecost"
});
   return rows;
}

```

The table is structured as follows: each row is identified by an 'id', which is a unique identifier. Next to it is the 'resource name', which is the type or name of the resource. In addition, the 'ratio' column indicates the ratio of the resource to the WAX token. This 'ratio' essentially quantifies the relationship between the resource and its associated WAX token, providing a measure of their interchangeability or equivalence.

This is how it looks on the UI:

![](/public/assets/images/tutorials/howto-create_farming_game/part15/image1.png)

The user selects the resource in the random mill and enters the quantity. After that, the amount of WAX will automatically change in the lower field.

Here is a link to the action in the smart contract for swap:

<https://testnet.waxblock.io/account/dappgamemine?action=swap#contract-actions>

and table **resourcecost:**

<https://testnet.waxblock.io/account/dappgamemine?code=dappgamemine&scope=dappgamemine&table=resourcecost&lower_bound=&upper_bound=&limit=10&reverse=false#contract-tables>

**Token Staking in games**
--------------------------

Got it! Let's delve into the process of staking WAX tokens and using them for voting. We'll explore how to call the necessary action to stake our WAX tokens and gain the right to vote.

```js
export const tokenStake = async ({ activeUser, quantity }) => {
  return await signTransaction({
      activeUser,
      account: 'eosio.token',
      action: 'transfer',
      data: {
        from: activeUser.accountName,
        to: 'dappgamemine',
        quantity: quantity,
        memo: 'staking'
      }
  });
};

```

Here we use an action called "transfer" for stake WAX tokens.

-   **from** -- this is our nickname of the user who connected his wallet, we take it from activeUser.accountName;
-   **to** -- name of game contract;
-   **quantity** (string, like '10.00000000 WAX') -- amount for stake.
-   **memo --** if we want to stake our WAX in our game, we use MEMO 'staking';

And here's how we can get the data from the balance table mentioned above.

```js
export const fetchBalance = async () => {
  const { rows } = await fetchRows({
      contract: 'dappgamemine',
      scope: 'dappgamemine',
      table: "balance"
  });

  return rows;
}

```

On the UI it looks like this: the user enters the amount of WAX he wants to bet, and after clicking on the "stake" button, the action described above is called.

![](/public/assets/images/tutorials/howto-create_farming_game/part15/image2.png)

Here is a link to the action in the smart contract for stake WAX tokens:

<https://testnet.waxblock.io/account/eosio.token?action=transfer#contract-actions>

and balance table:

<https://testnet.waxblock.io/account/dappgamemine?code=dappgamemine&scope=dappgamemine&table=balance&lower_bound=&upper_bound=&limit=10&reverse=false#contract-tables>

Game **governance by users/players**
------------------------------------

Let's outline the structure of the voting system:

-   Voting can originate from developers (system voting) or from players with sufficient staked tokens (community voting).
-   Voting can be related to contract variables (automatic) and can be a proposal that the team commits to fulfil (general).
-   A voting is considered valid if a sufficient part of the game community has participated in it (lower bound).

Here are the conditions for closing a vote:

-   The number of tokens locked in the vote reaches a predetermined limit (closing limit).
-   The specified time frame for the vote elapses (deadline).

When creating a poll, you choose the type of its completion. Either 1 or 2, or hybrid (1 or 2).

The voting power of a player directly depends on the number of WAX tokens staked.

Now let's see how to integrate this into React JS. In order to create a poll, we have a function with the name **createVoting()**.

```js
export const createVoting = async ({ activeUser, resName, ratio }) => {
  return await signTransaction({
      activeUser,
      account: 'dappgamemine',
      action: 'createvoting',
      data: {
        player: activeUser.accountName,
        resource_name: resName,
        new_ratio: ratio,
      }
  });
};

```

Here we use an action called "**createvoting**" to create a vote to change the ratio.

-   **player** -- this is our nickname of the user who connected his wallet, we take it from activeUser.accountName;
-   **resource_name (string)** -- name of resource;
-   **new_ratio** (float32) -- new ratio.

In the UI image, we see a vote to change the ratio.

![](/public/assets/images/tutorials/howto-create_farming_game/part15/image3.png)

It also lists the purpose of the poll, the deadline, the author, the number of participants, and the total number of tokens contributed.

Now let's see how to vote. First, we need to secure WAX tokens. We have described how to do this above.

```js
export const vote = async ({ activeUser, id }) => {
  return await signTransaction({
      activeUser,
      account: 'dappgamemine',
      action: 'vote',
      data: {
        player: activeUser.accountName,
        voting_id: id,
      }
  });
};

```

Here we use an action called "vote" to cast your vote.

-   **player** -- this is our nickname of the user who connected his wallet, we take it from activeUser.accountName;
-   **voting_id** -- voting ID from the сhangeration table;

Once created, your vote is added to the table '**changeration**' . To extract it for our UI, we use the **changeRation()** function.

```js
export const changeRation = async () => {
      const { rows } = await fetchRows({
        contract: 'dappgamemine',
        scope: 'dappgamemine',
        table: "changeration"
      });
      return rows;
    }

```

Here is a link to the action in the smart contract for create voting:

<https://testnet.waxblock.io/account/dappgamemine?action=createvoting#contract-actions>

action for vote:

<https://testnet.waxblock.io/account/dappgamemine?action=vote#contract-actions>

a table with all created rate change votes:

<https://testnet.waxblock.io/account/dappgamemine?code=dappgamemine&scope=dappgamemine&table=changeration&lower_bound=&upper_bound=&limit=10&reverse=false#contract-tables>

**PS.** The [Following link](https://github.com/dapplicaio/GUIStakingGovernanceSwaps) leads us to a repository that corresponds everything described.

###