---
title: Set Up a WAX Testnet Node
nav_order: 142
layout: default
parent: WAX Infrastructure Guides
lang-ref: Set Up a WAX Testnet Node
lang: en
---

The WAX Testnet has relatively low system requirements compared to the Mainnet, however it is fully functional with freely available WAX Tokens so it is an ideal place to get familiar with the WAX software and network itself.

### Testnet Requirements


**Hardware**

- 4 Core CPU / 4Ghz+ recommended if you would like to produce blocks
- 128GB Disk / Preferably SSD or NVMe
- 4GB RAM

**Operating System**

- Amazon Linux 2
- CentOS 7
- CentOS 7.x
- CentOS 8
- Ubuntu 16.04
- Ubuntu 18.04 (Recommended)
- Ubuntu 20.04 (Recommended)
- MacOS 10.14 (Mojave)
- MacOS 10.15 (Catalina)

**Internet**

- Modern Broadband / Fibre Connection (1Mb/s and above)
- Static Public IP Address (Either terminating on this node or forwarded with NAT)

### Build the Software
The WAX software is derived from opensource EOSIO software, however it has been modified to suit the needs of the WAX - Protocol Network.

Currently the WAX Block Producer accepted software build and version is ```v2.0.12wax02``` created by cc32d9 who is member of the [EOS Amsterdam Guild](https://eosamsterdam.net/)

The latest wax build tag is always available on the [WAX Github](https://github.com/worldwide-asset-exchange/wax-blockchain/tags)

#### Building Process

This example uses Ubuntu Linux to build the WAX software from source following the process below:

```sh
cd ~
git clone https://github.com/worldwide-asset-exchange/wax-blockchain.git
cd wax-blockchain
git checkout v2.0.12wax02
git submodule update --init --recursive
cd scripts 
./eosio_build.sh -P

./eosio_install.sh 
#If you want to install. Binaries are in ~/wax2.0/build/programs 
```

As the ```-P``` option is used on the build script this may take some time to compile as it will build with pinned clang and libcxx


#### Configuration

Now that a clean build of the WAX software has been compiled lets get into configuring for operation.

To configure and start the node ```nodeos``` will be used, ```nodeos``` is the core service daemon that runs on every WAX Protocol Network node.

```nodeos``` can be configured to process smart contracts, validate transactions, produce blocks containing valid transactions, and confirm blocks to record them on the blockchain. You can read more about it [here](https://developers.eos.io/manuals/eos/latest/nodeos/index).

The primary operational functions of ```nodeos``` are; running it as a Block Producer, Network API Endpoint, P2P Seed Node or State-History Node. Typically on a busy network such as the WAX Mainnet you would separate these functions across physically discrete servers.

In this WAX Testnet example you will make your node connect to other network peers, offer a P2P Seed Node service and make the node available as a Network API Endpoint. This node won’t be providing historical data query support.

```nodeos``` requires **two files** to connect to peers and run on the WAX Testnet:


***config.ini***

Create a default ```config.ini``` by running ```nodeos``` without config as per the command below:

```sh
mkdir ~/waxdata
nodeos --data-dir ~/waxdata --config-dir ~/waxdata
```

You will then be able to edit the newly created ```config.ini``` and see all the available parameters:

```sh
cd ~/waxdata
nano config.ini
```

Now edit the ```config.ini``` and add the following configuration settings:

```ini
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

# alohaeosprod: US, Oregon
p2p-peer-address = peer.waxtest.alohaeos.com:9876

# blacklusionx: DE, Germany
p2p-peer-address = peer1.testnet.wax.blacklusion.io:5757

# blokcrafters: US, Reston, Virginia
p2p-peer-address = waxtest-seed1.blokcrafters.io:19876

# blokcrafters: US, Reston, Virginia
p2p-peer-address = waxtest-seed2.blokcrafters.io:19876

# bountyblokbp: FR, France
p2p-peer-address = p2p.wax-test.bountyblok.io:9874

# eosarabianet: FI, Helsinki
p2p-peer-address = p2p-testnet-wax.eosarabia.net:9876

# eosphereiobp: AU, Sydney
p2p-peer-address = peer1-wax-testnet.eosphere.io:9876

# greeneosiobp: DE, Germany
p2p-peer-address = p2p.waxtest.greeneosio.com:9878

# ivote4waxusa: US, Greenville,SC,USA
p2p-peer-address = wax.eosusa.news:19879

# nation.wax: CA, Canada
p2p-peer-address = waxtest.eosn.io:9876

# pink.gg: DE, Germany
p2p-peer-address = peer1.testnet.wax.pink.gg:16714

# waxhiveguild: DE, Germany
p2p-peer-address = peer-test.hivebp.io:9876

# wizardsguild: US, wax-seed
p2p-peer-address = wax-bp.wizardsguild.one:7776
#EOSNation Provided PeerList - https://validate.eosnation.io/waxtest/reports/config.html#
agent-name = "<yourname> WAX Testnet"
max-clients = 100
sync-fetch-span = 500
plugin = eosio::http_plugin
plugin = eosio::history_api_plugin
plugin = eosio::history_plugin
plugin = eosio::chain_plugin
plugin = eosio::chain_api_plugin
```


**genesis.json**

These are the initial state parameters required by every new starting node on the WAX Testnet. Create the file as below:

```sh
cd ~/waxdata
nano genesis.json
```

Add the following parameters to the genesis.json file for the WAX Public Testnet:

```json
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


**Running Nodeos**
Now that the ```config.ini``` has been configured and the initial WAX Testnet chain parameters ```genesis.json``` have been created, you can now join the network and sync up the node.

Use screen to keep your session live even when you disconnect, usage below:

```sh
Create a new screen session
----------------------------
screen -US wax 

Disconnect screen session
-------------------------
ctrl-a+d 
Reconnect screen session
------------------------
screen -r wax
```

Run ```nodeos``` with pointers to the config, data directory and genesis file:

```sh
nodeos --data-dir ~/waxdata --config-dir ~/waxdata --genesis-json=~/waxdata/genesis.json
```

Your WAX Testnet node will now start syncing with the configured peers until it catches up and is current with the WAX Testnet chain.

In the Next Edition of WAX Technical How To .. will look at the role of state database snapshots and how they can expedite syncing a node.

Be sure to ask any questions in the [EOSphere Telegram](https://t.me/eosphere_io)