---
title: Working with WAX Software Files and Folders
order: 149
---

Many of our guides have worked with configuring and deploying WAX software, however it did occur to me that I might not have explained the file and folder functions. In particular some of the nuances with node types and recovering or successfully syncing to the chain head block.

This guide will go over the functions of the WAX Software files and folders, the types of nodes determined by the data they contain and the nuances of successfully starting or recovering a node type.

_This article has been updated to incorporate the_ [_Antelope_](https://antelope.io/) _Leap 5.0 software build process._

# Working with WAX Software Files and Folders

The WAX Software  `data-dir`  structure by default is made up of 5 directories:

```
/state  
/blocks   
/state-history   
/snapshots  
/protocol_features
```

and 2 files:

```
config.ini  
genesis.json
```

The **/state folder** contains the  `shared_memory.bin`  file, which is the thin provisioned WAX network memory mapped file also called the state database. It is this file that is recovered when starting from a snapshot.

The  **/blocks**  folder contains the  `blocks.log`  file, which is a local copy of all immutable blocks of the WAX chain stored on the node. It also contains a  `blocks.index`  file, which is an index of the `blocks.log` file used to find the location of a specific block number quickly.

The  **/state-history**  contains the  `chain_state_history.log`,  `chain_state_history.index`,  `trace_history.log`and  `trace_history.index`files. These files capture historical data about the blockchain state (WAX Mainnet in this case) and stores this data in the files making them externally readable in a flat file format.

The  **/snapshots**  folder is the default location where nodeos saves snapshot files.

The **/protocol_features**  folder contains network feature .json configuration files used for starting a new network or making a significant feature changes to the existing chain. Typically this wouldn't be used by WAX Guilds on the Mainnet.

The  **config.ini**  file contains the nodeos configuration used when running the nodeos binary.

The  **genesis.json**  file contains the initial state parameters required by every new starting node on the WAX Mainnet.

## Types of Node

Broadly there are 3 node types provided by the WAX Software  **producer/query/seed**:

-   producer: Node with signing key
-   query: Node that provides HTTP(S) APIs to the public
-   seed: Node that provides P2P access to the public

However the levels of functionality are also determined by the data the node contains. For example: It is possible to have a query node that doesn’t have a full  `blocks.index`  for block number lookup, it is also possible to have a seed node that doesn’t have all blocks in the  `blocks.log`  and it is also possible to have a state-history data base that wasn’t built from the first block of the network. All these examples mean that any external query or connection to this partial node will not have the Full Node / Blockchain data presented.

With this in mind depending on your use case you may choose a partial node to fulfil the functionality you require, however for public facing query and seed nodes it is most desirable to ensure you have full functionality.

The construct of a Full Node and Full State-History node are explained below:

**Full Node :**

-   Complete from block 1  `blocks.log`  (Needs to be sync’d from peers from genesis or copied from another node)
-   Complete  `blocks.index`  (Will be built automatically from the existing available  `blocks.log`)
-   Having both the above will enable block lookups and provide a full blocks peer service from block 1.
-   Current  `shared_memory.bin`  (Will be created automatically when syncing from genesis, can be copied from another node or can be recovered with a  [snapshot](https://link.medium.com/YZXqTwk5Gmb))
-   It is important that when recovering from a  [snapshot](https://link.medium.com/YZXqTwk5Gmb)  that a  **snap from a lower block number**  is used than what is available in the  `blocks.log`

**Full State-History Node:**

-   Must contain the same complete  `blocks.log`  ,  `block.index`  and current  `shared_memory.bin`  as with a Full Node.
-   However as with the  `blocks.log`  the  `/state-history`  files need to be  **complete and built from block 1**.
-   `/state-history`  files can be copied from another node or must be built from either a replay or re-sync from block 1.
-   It is important that when recovering from a  [snapshot](https://link.medium.com/YZXqTwk5Gmb)  that a  **snap from a lower block number**  is used, than what is available in the  `blocks.log`  as well as what is available in the  `/state-history`  files.

**Checking Tools**

WAX software has a great tool for managing the ```blocks.log``` called ```leap-util``` (previously known as ```eosio-blocklog```) this binary is created when building and located here ```~/wax-blockchain/build/programs/leap-util```

Do the following to query current  `blocks.log`  blocks and  `blocks.index`  for currency and any issues:

```
> ./leap-util block-log smoke-test --blocks-dir /home/eosphere/datavolume/blocks

Smoke test of blocks.log and blocks.index in directory "/home/eosphere/datavolume/blocks/"
info  2024-03-27T04:25:18.919 leap-util block_log.cpp:1583            smoke_test           ] block log version= 3
info  2024-03-27T04:25:18.920 leap-util block_log.cpp:1584            smoke_test           ] first block= 1
info  2024-03-27T04:25:18.920 leap-util block_log.cpp:1585            smoke_test           ] last block= 300080302
info  2024-03-27T04:25:18.920 leap-util block_log.cpp:1589            smoke_test           ] blocks.log and blocks.index agree on number of blocks
no problems found
```

Also if you have any corruption due to an unclean shutdown of the node, it is possible to cleanly trim the end of the current  `blocks.log`  .

For example you can trim to block 300080000 like below:

```
> ./leap-util block-log trim-blocklog -l 300080000 --blocks-dir /home/eosphere/datavolume/blocks
```

---

These **WAX Developer Technical Guides** are created using source material from the [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home)

Be sure to ask any questions in the  [EOSphere Telegram](https://t.me/eosphere_io)
