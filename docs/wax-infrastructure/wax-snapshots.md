---
title: Using WAX Snapshots
nav_order: 143
layout: default
parent: WAX Infrastructure Guides
lang-ref: Using WAX Snapshots
lang: en-US
---

You will have noticed that syncing up to a blockchain that has been running for millions of blocks can take quite some time. Luckily Syncing up can be expedited by using an existing valid snapshot of the chain state database.

In this Article you will learn how to make use of snapshots as well as how to create them yourself.

## How to use WAX Snapshots
A valid snapshot can be used to sync a WAX ```nodeos``` process up to a desired block on launch by using a snapshot file to recreate a valid chain state database.

This alleviates the need to build the state database one block at a time from block #1, which takes time to catch up to the chain head block which can be in the millions or more.

### Explanation

The chain state database ```shared_memory.bin``` is needed by ```nodeos``` to run, it is a memory mapped file that contains the state associated with each block, including smart contract data, account details and deferred transactions.

There is however a caveat. Depending on the function you require of your node, for instance running it as a P2P seed node or fully functional API node you will also require the associated complete ```blocks.log``` from block #1 to be able to provide the “full” chain.

It should also be mentioned that the now depreciated V1 History functionality is not preserved in a snapshot and will required a full replay.

It is possible to run ```nodeos``` without any ```blocks.log``` with a current snapshot file but this node wouldn’t be considered “full” and would typically only be used to query current chain info and push actions.

Ideally snapshots should be used with an associated ```blocks.log``` containing a higher head block number. So lower block in snapshot. higher block in ```blocks.log``` when you start ```nodeos```.

Common Scenario
The most common use for a snapshot is recovering from an incorrectly stopped node.. power failure, out of memory, process killed etc.

```nodeos``` needs to be gracefully exited otherwise the state database may be corrupted showing this nasty error:

“Database dirty flag set (likely due to unclean shutdown): replay required”

### Locating a snapshot

First of all you need to obtain a valid snapshot file from a trusted source. There are quite a few WAX snapshot services being provided by the WAX Guilds including [EOSphere](https://snapshots.eosphere.io/), however not all provide testnet snapshots.. so you may need to look around a bit.


The [EOS Nation bp.json Validator](https://validate.eosnation.io/wax/reports/resources.html#chain) has a very handy snapshot service list collated from what the Guilds have advertised.
{: .label .label-yellow }

![image](https://user-images.githubusercontent.com/12730423/187578145-07ba4f0d-8532-4a46-9e47-83347d5793a9.png)

### Usage

Using the example ```nodeos``` build in the [previous](/en/wax-infrastructure/wax-testnet-node) WAX Technical How To, all relevant files are located in ```~/waxdata```.

Download and unarchive the desired snapshot file:

```sh
sudo apt install zstd
cd ~/waxdata/snapshots
wget http://snapshots.eosphere.io/snapshots/wax/snapshot.bin.zst
unzstd snapshot.bin.zst
```

Delete the existing (if any) state database and blocks reversible:

```sh
rm -r ~/waxdata/state
rm -r ~/waxdata/blocks/reversible
```

Launch ```nodeos``` from the downloaded snapshot (noting that the genesis.json is not specified):

```
nodeos --data-dir ~/waxdata --config-dir ~/waxdata --snapshot ~/waxdata/snapshots/snapshot.bin
```

```nodeos``` will now start from a snapshot and attempt to sync to the active chain from the head block captured in the used snapshot file. The ```blocks.log``` will also be continued from the snapshot block number, that is why it is important to ensure a lower block in the snapshot. higher block in ```blocks.log``` to avoid gaps.

### Generating snapshots

The most security conscious way of using snapshots is to create and use your own. Perhaps even provide a snapshot file hosting service for the rest of the WAX ecosystem to make use of.

```nodoes``` requires a producer api plugin configured to enable snapshot generation. Add the following to the end of your ```config.ini```:

```ini
plugin = eosio::producer_api_plugin
```

Warning: Exposing the producer_api_plugin publicly is a security risk and can be exploited, the node used for creating a snapshot should not be publicly queriable.
{: .label .label-yellow }

Generate a snapshot locally using the following syntax, the snapshot file will by default be saved to the snapshots folder:

```sh
curl -X POST http://127.0.0.1:8888/v1/producer/create_snapshot
```
