---
title: Simple Assets Basics
layout: default
nav_order: 88
parent: Create Non-Fungible Tokens
grand_parent: Tutorials
lang-ref: Simple Assets Basics
lang: en
---

The Simple Asset's video below includes everything you need to know about NFT data structures and actions. Refer to the <a href="https://github.com/CryptoLions/SimpleAssets" target="_blank">Simple Assets GitHub Repository</a> for detailed information and change log updates.
<br /><br />

[Simple Assets Tutorial](https://www.youtube.com/watch?v=yNxNIVSRxG8)

## Data Structures

You can customize the way your NFTs display in a WAX marketplace by using the `asset` data structure. An asset data structure includes the asset's author (the smart contract that creates the asset), category (e.g. weapon, sticker, name of your game or collection), and key/value pairs of immutable and mutable data.

Immutable data includes asset attributes that can't be updated, and mutable data includes attributes that may change over an item's lifetime. For example, imagine that you've designed a race car game that offers the winner of Level 5 a new high-performance engine.

There may be attributes assigned to this engine that will never change, like the engine's name, manufacturer, and description. On the other hand, as the player continues to race, other attributes may change like the engine's wear, horsepower upgrades, and total mileage.

### Asset Data Structure

```
name author = get_self();
name category = "racing"_n;
name owner = "waxnftowner1"_n;
std::string idata = R"json({"name": "High-Performance Engine", "desc": "YYZ Series, Small Block, Forged Pistons" })json";
std::string mdata = R"json({"mileage": 0, "horsepower": 500, "img": "https://yourenginelink.com" })json";
```
<br />
Refer to Simple Asset's <a href="https://github.com/CryptoLions/SimpleAssets#data-structures" target="_blank">Data Structures</a> for more information.

## Actions

Actions vary depending on which blockchain account owner is calling the action.

As the owner of your game or marketplace (author), you can:

* Create assets and update mutable attributes from your smart contract.
* Optionally, you can include the `requireClaim` flag. In the Simple Assets smart contract, the account initializing an asset transfer (or asset `create` action) pays for the required RAM. If the `requireClaim` flag is set to true (1), this flag posts an asset for the designated user to take. This designated WAX user pays for the RAM instead.
* Burn an asset, along with a memo.

<!--The Simple Assets smart contract also allows authors to optionally save information about you and your assets. This can include instructions on how to interact with your assets in WAX marketplaces and asset explorers and other information that you'd like to communicate to external dApps, websites, and asset owners.-->

Asset owners can:

* Transfer their assets to another WAX Account user.
* Claim assets that you've posted with the `requireClaim` flag.
* Cancel an offer to transfer their asset to another WAX Account.
* Lend and borrow assets using the delegate and undelegate actions.

<br />
Refer to Simple Asset's <a href="https://github.com/CryptoLions/SimpleAssets#contract-actions" target="_blank">Contract actions</a> for more information.

## Tables

There are four key tables included with the Simple Assets smart contract:

1. **sassets:** This table stores asset information (e.g., category, immutable data, mutable data).
2. **offers:** This table stores asset transfer information associated with the offer, claim, and cancel offer actions.
3. **authors:** Here you can optionally save information about yourself and your assets. You can include instructions on how to interact with your assets in WAX marketplaces and asset explorers, or any other information that you'd like to communicate to external dApps, websites, and asset owners.
4. **delegates:** This table stores information associated with lending and borrowing assets.

## Contract Details

To download the **simpleassets.abi** file to your current directory, use the `cleos get code` command from your Docker interactive bash session.

```shell
cleos -u [chain-api-url] get code simpleassets -a simpleassets.abi
    ```
