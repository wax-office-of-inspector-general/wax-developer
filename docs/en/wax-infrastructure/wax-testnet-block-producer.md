---
title: Set Up a WAX Testnet Block Producer Node
nav_order: 144
layout: default
parent: WAX Infrastructure Guides
lang-ref: Set Up a WAX Testnet Block Producer Node
lang: en
---

Providing API and Seed services are key to being part of the WAX service provider Ecosystem, however to be rewarded for your efforts and to participate in the governance of the chain you will need to become a  **WAX Testnet Block Producer.**

This guide will show you how to configure a WAX Testnet Block Production Node and register your account as a WAX Testnet Block Producer.

_This article has been updated to incorporate the_ [_Antelope_](https://antelope.io/) _Leap software build process._

# How to Set Up a WAX Testnet Block Producer Node

In this example we will be using the same WAX software build process for the Block Producer Node and Cleos Interface Node as used in the **Set Up a WAX Testnet Node guide**.

The Block Producer Node also needs to be configured and sync’d up to the WAX Testnet precisely the same as the first WAX guide, additional configuration will be applied later in this example.

## Environment

There is consensus amongst Block Producers that best practice for any Antelope production deployment is that each node serve a specific function. In particular the Block Producer Node should not be publicly accessible or used as a Public API or Peer.

**In this example we will have three different nodes serving specific functions:**

**Public API and Peer Node**  
This is the Node created in the First WAX How To Article and will be used to provide public API and Peer services.  
It will need to be Sync’d to the current WAX Testnet Headblock

**Block Producer Node**   
This is the Node used to securely sign blocks on the WAX Testnet and the main additional production Node in this example.  
It will need to be Sync’d to the current WAX Testnet Headblock.  

In addition to configuring the latest available [peer list](https://validate.eosnation.io/waxtest/reports/config.html) of trusted Guilds published by EOSNation, it is a good idea to allow it to peer to your own Public Peer Node or Blocks Only Node.

**Cleos Interface Node**  
This Node is completely private and used to interact with the Public Testnet Network via command line. Ubuntu Terminal / MacOS Terminal / Windows Ubuntu Shell are great lightweight OS’s for running this private interface.

Two WAX software included applications are used:  `cleos`  which is the command line interface for the WAX software and  `keosd`  which is essentially a wallet / key manager service daemon for storing private keys and signing digital messages. You can find the WAX Software binary’s here:  `~/wax-leap/build/programs/`

As you will be importing your private keys into  `keosd`  it is important that this Node is secured and treated as private.

`cleos`  uses your keys imported into  `keosd`  as authority to execute privileged actions on the network through an API running in  `nodeos`

![](https://miro.medium.com/max/700/0*kTx5FtBH8o4Vxshw.png)

The above diagram shows the relationship between WAX Software applications.

_It must be noted that there have been a few reported instances of API queries/actions not working as intended when trying to use older version_ `_cleos_` _and_ `_keosd_` _with an updated Leap 3.x node. Advice is to ensure you use the 3.x version of_ `_cleos_` _and_ `_keosd_` _with Leap 3.x nodes._

## Getting a Testnet Account

A WAX Testnet Block Producer requires an account to be created that can be used to register intent to become a producer that token holders are able to vote for.

There is a cost in WAX Testnet Tokens associated with registering an account, however you need an account to hold tokens. This would be problematic.. but there is a very handy  [WAX Testnet Account Creator and Faucet](https://waxsweden.org/create-testnet-account/)  provided by  [WAX Sweden](https://waxsweden.org/)  that can be used to easily create your first account and fill it with WAX Testnet Tokens.

Run the following curl requests on your on Cleos Node to create and fund your account , obviously supplementing with your desired account name:

```
> curl https://faucet.waxsweden.org/create_account?eospherewoot

{"msg": "succeeded", "keys": {"active_key": {"public": "EOS8PSfvq342YTVtogNVskjCttpx1rQX9JT59wQuLt2Nkz16ZmsL4", "private": "5JZsTE4LzwbHKLX25n3D4gSYVtB5AxyDgGGrUPaMWpAmbWveu72"}, "owner_key": {"public": "EOS7gjEzaYfd9FeSU8BzREgrLQz4QwizFfsKDJtgswCwwyhgX6dqa", "private": "5J7zm5kfBkhhuSnzxxxxxxxxxxxxxxxxxxxxxxnmi73eh8ANLzpB"}}, "account": "eospherewoot"}

> curl https://faucet.waxsweden.org/get_token?eospherewoot

{"msg": "succeeded"}
```

You are presented with two key pairs,  _active_key_  and  _owner_key_  .. keep both of these pairs safely stored in this example we will be using the  _active_key_.

## Import your account key to keosd

Now that we have an account lets’s import it to a  `keosd`  wallet so we can use it with  `cleos`

On your Cleos Node Create a WAX Testnet Wallet and import your account key:

```
> cleos wallet create -n waxtestnet --to-console

Creating wallet: waxtestnet

Save password to use in the future to unlock this wallet.  
Without password imported keys will not be retrievable.  
"PW5JoPmniazjAH3RTx4gcR5njKvPP6or8k7VzXu8ffGwwsFxqSGYN"
```

`keosd`  is automatically started (you may have to make sure it’s in the local path) .. the wallet is then created. This password is for your local wallet called waxtestnet, keep is safe. By default the wallets are stored here:  `~/eosio-wallet`

Import your active account key:

```
#Unlock your wallet with the password from before  
> cleos wallet unlock -n waxtestnet  
password: Unlocked: waxtestnet

#Import your active_key : private  
> cleos wallet import -n waxtestnet  
private key: imported private key for: EOS8PSfvq342YTVtogNVskjCttpx1rQX9JT59wQuLt2Nkz16ZmsL4
```

## Configure the Block Producer Node

As already mentioned previously the Block Producer Node needs some specific configuration that enables block signing.

Firstly we need a key-pair specifically for signing use, which can be accomplished using the Cleos Node:

```
> cleos create key --to-console  
Private key: 5JVfLEuHuoVkEX6CyScPHNLgxtRdUcdLp3hqzrXC54xVjtESFXX  
Public key: EOS6HWBC39JAXaRo5aG5yAcAjgQYhQ44T5GtcxJVbZFZox6FFa15k
```

Next configure the  `config.ini`  on your Block Producer Node with the following block production additions specific to your deployment:

```
#This is your BP account name  
producer-name = eospherewoot

#This is your block signing key-pair  
signature-provider = EOS6HWBC39JAXaRo5aG5yAcAjgQYhQ44T5GtcxJVbZFZox6FFa15k=KEY:5JVfLEuHuoVkEX6CyScPHNLgxtRdUcdLp3hqzrXC54xVjtESFXX

#Optimises hand off by producing a bit earlier  
last-block-time-offset-us = -200000

#Lowers CPU time available on last block for better hand off  
last-block-cpu-effort-percent = 20

#Enables block production on this node  
plugin = eosio::producer_plugin
```

Now restart  `nodeos`  on your Block Producer Node and ensure it catches back up to the headblock.

You can check on both your  `nodeos`  Nodes by querying them from your Cleos Node to ensure they are in a good state.. and on the correct chain:

```
> cleos -u https://wax-testnet.eosphere.io get info

{  
  "server_version": "b5344cde",  
  "chain_id": "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12",  
  "head_block_num": 111813838,  
  "last_irreversible_block_num": 111813507,  
  "last_irreversible_block_id": "06aa23838410642de5d297e95a410d68ab9076028fa444c464c48172031f364d",  
  "head_block_id": "06aa24cea654e6250d87e41872f6754000c60226e9a490803186497e0ad70609",  
  "head_block_time": "2021-09-16T05:17:33.000",  
  "head_block_producer": "blacklusionx",  
  "virtual_block_cpu_limit": 200000000,  
  "virtual_block_net_limit": 1048576000,  
  "block_cpu_limit": 199900,  
  "block_net_limit": 1048576,  
  "server_version_string": "v2.0.12wax01",  
  "fork_db_head_block_num": 111813838,  
  "fork_db_head_block_id": "06aa24cea654e6250d87e41872f6754000c60226e9a490803186497e0ad70609",  
  "server_full_version_string": "v2.0.12wax01-b5344cde06837726fef9e384fcedc207dcf6b160"  
}
```

## Registering your Block Producer Account

Now that you are sure all is correctly configured and your Nodes are in sync with the network, you can register your intent to sign blocks and allow token holders to vote for you.

Before you execute the  `regproducer`  action, now is probably a good time to advertise your intent to the rest of the WAX Testnet Community.

There is a  [WAX Testnet Telegram Group](https://t.me/waxtestnet)  where you can interact with other Block Producers, Service Providers and DApp builders.

There has been some testing recently in regards to optimum path hand-over between Block Production Nodes across the globe, if you advise in the Telegram of where your Node is located in the world one of the Testnet BP’s will assign you a location number that helps the network.

Also you will need to be voted into the #21 to be able to produce blocks, the Telegram Group is the place to ask for these votes as well.

![](https://miro.medium.com/max/700/1*laC7JQ7-9kSxeqP9yi9Ffg.png)

Execute the  `regproducer`  action as below with your specifc details:

```
#The last number is your assigned location  
> cleos -u [https://wax-testnet.eosphere.io](https://wax-testnet.eosphere.io/) system regproducer eospherewoot EOS6HWBC39JAXaRo5aG5yAcAjgQYhQ44T5GtcxJVbZFZox6FFa15k [https://www.eosphere.io](https://www.eosphere.io/) 21
```

As the action is executed on the block-chain level you can actually point your request to any sync’d testnet API i.e you don’t have to execute this action on your own Nodes.

If/When you have been voted into the top #21 your  `nodeos`  output will look something like this for 12 blocks in a round:

```
info  2021-09-16T05:36:01.541 nodeos    producer_plugin.cpp:377       on_incoming_block    ] Received block e23bca90f0e6bc3d... #111816053 @ 2021-09-16T05:36:01.500 signed by eospherewoot [trxs: 0, lib: 111815725, conf: 0, latency: 41 ms]  
info  2021-09-16T05:36:02.042 nodeos    producer_plugin.cpp:377       on_incoming_block    ] Received block c6d4ac08300ed117... #111816054 @ 2021-09-16T05:36:02.000 signed by eospherewoot [trxs: 0, lib: 111815725, conf: 0, latency: 42 ms]
```

---

These **WAX Developer Technical Guides** are created using source material from the [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home)

Be sure to ask any questions in the  [EOSphere Telegram](https://t.me/eosphere_io)
