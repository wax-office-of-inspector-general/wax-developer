---
title: Set Up a WAX Testnet Node
order: 142
---

Running Antelope infrastructure to support the WAX Protocol Network can be quite daunting when first starting out. This series of guides aims to demystify the infrastructure and operational requirements required to run Rock Solid services for the WAX Protocol Network.

This guide will show you how to get started with building a WAX node on the Public WAX Testnet.

_This guide has been updated to incorporate the_ [_Antelope_](https://antelope.io/) _Leap software build process._

# How to Set Up a WAX Testnet Node

The WAX Testnet has relatively low system requirements compared to the Mainnet, however it is fully functional with freely available WAX Tokens so it is an ideal place to get familiar with the WAX software and network itself.

## Testnet Requirements

**Hardware**

-   4 Core CPU /  _4Ghz__+_ _recommended if you would like to produce blocks_
-   128GB Disk /  _Preferably SSD or NVMe_
-   4GB RAM

**Operating System**

-   Ubuntu 18.04
-   Ubuntu 20.04  **_(Recommended)_**
-   Ubuntu 22.04

**Internet**

-   Modern Broadband / Fibre Connection (1Mb/s and above)
-   Static Public IP Address (Either terminating on this node or forwarded with NAT)

## Build the Software

The WAX software is derived from opensource Antelope software, however it has been modified to suit the needs of the WAX Protocol Network.

Currently the WAX Block Producer accepted software build and version is  `v3.1.0wax01`  created by  [cc32d9](https://cc32d9.medium.com/)  who is member of the  [EOS Amsterdam Guild](https://eosamsterdam.net/)

The latest  `wax`build tag is currently available on the  [cc32d9 Github](https://github.com/cc32d9/wax-leap/tags)

**Building Process**

This example uses  [Ubuntu Linux](https://ubuntu.com/)  to build the WAX software from source following the process below:

```
> cd ~

> sudo apt install -y file

> git clone [https://github.com/cc32d9/wax-leap.git](https://github.com/cc32d9/wax-leap.git)

> cd wax-leap

> git checkout v3.1.0.wax01

> git submodule update --init --recursive

> sudo bash scripts/install_deps.sh

> mkdir build

# If necessary supplement $(nproc) below with the number of jobs your server can sustain, I suggest 4GB RAM required / job

> nice bash scripts/pinned_build.sh ~/wax-leap/build/leap-deps ~/wax-leap/build $(nproc)

# Binaries are located in ~/wax-leap/build/programs
```

## Configuration

Now that a clean build of the WAX software has been compiled lets get into configuring for operation.

To configure and start the node  `nodeos`  will be used,  `nodeos`is the core service daemon that runs on every WAX Protocol Network node.

`nodeos`  can be configured to process smart contracts, validate transactions, produce blocks containing valid transactions, and confirm blocks to record them on the blockchain. You can read more about it  [here](https://developers.eos.io/manuals/eos/latest/nodeos/index).

The primary operational functions of  `nodeos`  are; running it as a Block Producer, Network API Endpoint, P2P Seed Node or State-History Node. Typically on a busy network such as the WAX Mainnet you would separate these functions across physically discrete servers.

In this WAX Testnet example you will make your node connect to other network peers, offer a P2P Seed Node service and make the node available as a Network API Endpoint.  _This node won’t be providing historical data query support._

`nodeos`  requires  **two files**  to connect to peers and run on the WAX Testnet:

**config.ini**

Create a default  `config.ini`  by running  `nodeos`  without config as per the command below:

```
> mkdir ~/waxdata

> cd ~/wax-leap/build/programs/nodeos

> ./nodeos --data-dir ~/waxdata --config-dir ~/waxdata
```

You will then be able to edit the newly created  `config.ini`  and see all the available parameters:

```
> cd ~/waxdata

> nano config.ini
```

Now edit the `config.ini`and add the following configuration settings:

```
wasm-runtime = eos-vm-jit

chain-state-db-size-mb = 16384  
chain-state-db-guard-size-mb = 1024

enable-account-queries = true

http-server-address = 0.0.0.0:8888  
access-control-allow-origin = *  
access-control-allow-headers = Origin, X-Requested-With, Content-Type, Accept  
http-max-response-time-ms = 100  
verbose-http-errors = true  
http-validate-host = false

p2p-listen-endpoint = 0.0.0.0:9876  
  
# 3dkrenderwax: FI, Finland  
p2p-peer-address = testnet-p2p.3dkrender.com:9876  
  
# amsterdamwax: DE, Falkenstein  
p2p-peer-address = waxtest.eu.eosamsterdam.net:9912  
  
# blokcrafters: US, Portland, Oregon  
p2p-peer-address = waxtest-peer-us.blokcrafters.io:19876  
  
# blokcrafters: FI, Helsinki, Uusimaa  
p2p-peer-address = waxtest-peer-eu.blokcrafters.io:19876  
  
# bountyblokbp: FR, France  
p2p-peer-address = p2p.wax-test.bountyblok.io:9874  
  
# bp.box: KY, Cayman Islands  
p2p-peer-address = waxtest.defibox.xyz:19876  
  
# eosdacserver: DE, Germany  
p2p-peer-address = waxtest-p2p.eosdac.io:49876  
  
# eosiodetroit: US, wax-testnet-bp  
p2p-peer-address = p2p.testnet.wax.detroitledger.tech:1337  
  
# eosphereiobp: AU, Sydney  
p2p-peer-address = peer1-wax-testnet.eosphere.io:9876  
  
# greeneosiobp: DE, Germany  
p2p-peer-address = p2p.waxtest.waxgalaxy.io:9878  
  
# guild.nefty: DE, Germany  
p2p-peer-address = p2p-testnet.neftyblocks.com:19876  
  
# ivote4waxusa: US, Greenville,SC,USA  
p2p-peer-address = test.wax.p2p.eosusa.io:19875  
  
# liquidgaming: DE, Germany  
p2p-peer-address = 138.201.23.118:9877  
  
# nation.wax: CA, Canada  
p2p-peer-address = waxtest.seed.eosnation.io:9876  
  
# oneinacilian: GB, United Kingdom  
p2p-peer-address = p2ptest.oiac.io:10877  
  
# pink.gg: DE, Germany  
p2p-peer-address = peer1.testnet.wax.pink.gg:16714  
  
# waxhiveguild: DE, Germany  
p2p-peer-address = peer-test.hivebp.io:9876  
  
# waxmadrid111: DE, SEED  
p2p-peer-address = wax-seed-testnet.eosiomadrid.io:9876  
  
# waxswedenorg: SE, Sweden  
p2p-peer-address = p2p.testnet.waxsweden.org:59676  
  
# wecan: DE, Berlin  
p2p-peer-address = seed1-wax-testnet.wecan.dev:9876  
  
# wecan: GB, London  
p2p-peer-address = seed2-wax-testnet.wecan.dev:9876

# EOSNation Provided PeerList - https://validate.eosnation.io/waxtest/reports/config.html

agent-name = "<yourname> WAX Testnet"

max-clients = 100

sync-fetch-span = 500

plugin = eosio::http_plugin  
plugin = eosio::chain_plugin  
plugin = eosio::chain_api_plugin
```
**genesis.json**

These are the initial state parameters required by every new starting node on the WAX Testnet. Create the file as below:

```
> cd ~/waxdata

> nano genesis.json
```

Add the following parameters to the  `genesis.json`  file for the WAX Public Testnet:
```
{  
 "initial_timestamp": "2019–12–06T06:06:06.000",  
 "initial_key": "EOS7PmWAXLBaqCzSgbq8cyr2HFztQpwBpXk3djBJA8fyoyUnYM37q",  
 "initial_configuration": {  
 "max_block_net_usage": 1048576,  
 "target_block_net_usage_pct": 1000,  
 "max_transaction_net_usage": 524288,  
 "base_per_transaction_net_usage": 12,  
 "net_usage_leeway": 500,  
 "context_free_discount_net_usage_num": 20,  
 "context_free_discount_net_usage_den": 100,  
 "max_block_cpu_usage": 200000,  
 "target_block_cpu_usage_pct": 2500,  
 "max_transaction_cpu_usage": 150000,  
 "min_transaction_cpu_usage": 100,  
 "max_transaction_lifetime": 3600,  
 "deferred_trx_expiration_window": 600,  
 "max_transaction_delay": 3888000,  
 "max_inline_action_size": 4096,  
 "max_inline_action_depth": 6,  
 "max_authority_depth": 6  
 }  
}
```

## Running Nodeos

Now that the  `config.ini`  has been configured and the initial WAX Testnet chain parameters  `genesis.json`  have been created, you can now join the network and sync up the node.

Use screen to keep your session live even when you disconnect, usage below:

```
Create a new screen session  
----------------------------  
> screen -US wax   
  
Disconnect screen session  
-------------------------  
> ctrl-a+d 

Reconnect screen session  
------------------------  
> screen -r wax
```

Run  `nodeos`  with pointers to the config, data directory and genesis file:

```
> cd ~/wax-leap/build/programs/nodeos

> ./nodeos --data-dir ~/waxdata --config-dir ~/waxdata --genesis-json ~/waxdata/genesis.json
```

Your WAX Testnet node will now start syncing with the configured peers until it catches up and is current with the WAX Testnet chain.

---

These **WAX Developer Technical Guides** are created using source material from the [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home)

Be sure to ask any questions in the  [EOSphere Telegram](https://t.me/eosphere_io)
