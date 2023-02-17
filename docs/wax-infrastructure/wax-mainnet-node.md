---
title: How to Set Up a Solid WAX Mainnet Node
nav_order: 145
layout: default
parent: WAX Infrastructure Guides
lang-ref: How to Set Up a Solid WAX Mainnet Node
lang: en-US
---

Freely available tokens and relatively low system requirements make the WAX Testnet an ideal place to learn, however it’s now time to graduate to the WAX Mainnet.

This guide will give you the insight to build solid WAX Mainnet nodes that will handle the network and infrastructure demands that are required to be met by successful Guilds.

_This article has been updated to incorporate the_ [_Antelope_](https://antelope.io/) _Leap software build process._

# How to Set Up a Solid WAX Mainnet Node

The WAX Mainnet as far as Antelope chains go has a very heavy infrastructure requirement. Of course the WAX Mainnet is constantly growing and there are numerous ways to fulfill these requirements.

This article will walk through an example that is currently valid (September 2022) and in use by the EOSphere Guild who are serving multiple peers and millions of API requests per day.

# Mainnet Requirements

**Hardware**

-   4 Core CPU /  _4Ghz+ recommended if you would like to produce blocks_
-   (1) 256GB+ Disk /  _Enterprise Grade SSD or NVMe (_**_High Endurance Req._**_)_
-   (2) 4TB+ Disk /  _SAS or SATA are OK however SSD or NVMe preferred_
-   128GB+ RAM

**Operating System**

-   Ubuntu 18.04
-   Ubuntu 20.04  **_(Recommended)_**
-   Ubuntu 22.04

**Internet**

-   Modern Broadband / Fibre Connection (100Mb/s synchronous and above)
-   Static Public IP Address (Either terminating on this node or forwarded with NAT)

# Prepare the Operating System Environment

Before the WAX software is built and configured, the operating system environment Ubuntu 20.04 in this case needs to be configured for performance and the load that is will take on.

## Zettabyte File System (ZFS)

This node build uses  **2 Discrete Disks**  in order to balance disk IO and provide a more affordable storage option for the  `blocks.log`  file, which is currently 2.1TB and growing.

**Disk 1** is the high speed enterprise grade SSD or NVMe will be the OS disk used for the WAX software, all config and the state files. The state files are extremely IO intensive, a consumer based SSD’s life span will be short lived due to the high number of writes hence the need to use a high endurance enterprise SSD or NVMe.

_Note:_  _It needs to be mentioned that there are mechanisms to run these state files in memory if you have enough available, this topic will be covered in a future article._

In this example Disk 1 will run the default OS  **Ext4 File System** that will already be implemented during the Ubuntu 20.04 installation.

**Disk 2**  is the large capacity SATA or SAS disk that will host the  `blocks.log`  file. The IO demands on the blocks directory are far lower than the state files and slower larger capacity spindle based disks are still suitable.

In this example Disk 2 will run the  **ZFS File System** which will give us two main benefits. ZFS will enable us to use LZ4 compression (which currently is a gain of 1.3x) and it will improve disk IO with  **Adaptive Replacement Cache**  (ARC)

Implement ZFS on Disk 2 with the below configuration:

```
#Install ZFS  
> sudo apt-get install zfsutils-linux

#Locate the Disk 2 device name  
> lsblk

#Create ZFS Pool called "datavolume" on device "sdb"  
> sudo zpool create datavolume /dev/sdb

#Enable LZ4 compression  
> sudo zfs set compression=lz4 datavolume

#Disable ZFS access time Updates  
> sudo zfs set atime=off datavolume

#Set ARC to only cache metadata  
> sudo zfs set primarycache=all datavolume

#Set the mountpoint location to your preferred location  
> sudo zfs set mountpoint=/home/eosphere/datavolume datavolume

#Verify ZFS Settings  
> zfs get all
```

## Network Time Protocol (NTP)

It is crucial for a globally meshed blockchain to have synchronised time across all nodes.

[Chrony](https://chrony.tuxfamily.org/)  is an excellent NTP client and is quite suitable for the needs of WAX Mainnet.

Install, configure and verify as below:

```
#Install Chrony  
> sudo apt install chrony

#If necessary manually add local peers, these are AU servers  
> sudo nano /etc/chrony/chrony.conf  
  
server 0.pool.ntp.org  
server 1.pool.ntp.org  
server 2.pool.ntp.org  
server 3.pool.ntp.org

#Restart Chrony  
> sudo /etc/init.d/chrony restart

#Verify  
> chronyc sources -v  
> chronyc tracking

#Set your local timezone if neccesary  
> sudo timedatectl set-timezone Australia/Perth
```

## Stack Limits and Openfiles

WAX software memory addressing and the number of API requests a Production Mainnet Node will receive require that the Ubuntu 20.04 default Stack Limit and Number of Open Files be increased.

Configure and verify the raised limits as below:

```
> sudo nano /etc/systemd/system.conf

#Append the following configuration  
DefaultLimitNOFILE=64000   
DefaultLimitSTACK=65536000

#Restart server and verify  
> ulimit -a
```

# Build the Software

The WAX software is derived from opensource Antelope software, however it has been modified to suit the needs of the WAX Protocol Network.

Currently the WAX Block Producer accepted software build and version is  `v3.1.0wax01`  created by  [cc32d9](https://cc32d9.medium.com/)  who is member of the  [EOS Amsterdam Guild](https://eosamsterdam.net/)

The latest  `wax`build tag is currently available on the  [cc32d9 Github](https://github.com/cc32d9/wax-leap/tags)

**Building Process**

This example uses  [Ubuntu Linux](https://ubuntu.com/)  to build the WAX software from source following the process below:

```
> cd ~

> sudo apt install -y file

> git clone https://github.com/cc32d9/wax-leap.git

> cd wax-leap

> git checkout v3.1.0.wax01 

> git submodule update --init --recursive

> sudo bash scripts/install_deps.sh

> mkdir build

# If necessary supplement $(nproc) below with the number of jobs your server can sustain, I suggest 4GB RAM required / job

> nice bash scripts/pinned_build.sh ~/wax-leap/build/leap-deps ~/wax-leap/build $(nproc)

# Binaries are located in ~/wax-leap/build/programs
```

# Configuration

Now that a clean build of the WAX software has been compiled lets get into configuring for WAX Mainnet operation.

To configure and start the node  `nodeos`  will be used,  `nodeos`is the core service daemon that runs on every WAX Protocol Network node.

`nodeos`  can be configured to process smart contracts, validate transactions, produce blocks containing valid transactions, and confirm blocks to record them on the blockchain.

The primary operational functions of  `nodeos`  are; running it as a Block Producer, Network API Endpoint, P2P Seed Node or State-History Node. Typically on a busy network such as the WAX Mainnet you would separate these functions across physically discrete servers.

In this WAX Mainnet example you will make your node connect to other network peers, offer a P2P Seed Node service and make the node available as a Network API Endpoint.  _This node won’t be providing historical data query support._

`nodeos`  requires  **two files**  to connect to peers and run on the WAX Mainnet:

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
Now edit the  `config.ini`and add the following configuration settings:

```
# the location of the blocks directory on Disk 2  
blocks-dir = /home/eosphere/datavolume/blocks

wasm-runtime = eos-vm-jit
chain-state-db-size-mb = 131072  
chain-state-db-guard-size-mb = 1024  
enable-account-queries = true  
http-server-address = 0.0.0.0:8888  
access-control-allow-origin = *  
access-control-allow-headers = Origin, X-Requested-With, Content-Type, Accept  
http-max-response-time-ms = 100  
verbose-http-errors = true  
http-validate-host = false  
p2p-listen-endpoint = 0.0.0.0:9876

# 3dkrenderwax: FI, wax-peer  
p2p-peer-address = peer.3dkrender.com:9880  
  
# 3dkrenderwax: FI, query  
p2p-peer-address = query.3dkrender.com:9880  
  
# amsterdamwax: NL, Amsterdam  
p2p-peer-address = wax.eu.eosamsterdam.net:9101  
  
# blacklusionx: DE, Germany  
p2p-peer-address = peer1.wax.blacklusion.io:4646  
  
# blokcrafters: US, Reston, Virginia  
p2p-peer-address = wax-seed1.blokcrafters.io:9876  
  
# blokcrafters: US, Reston, Virginia  
p2p-peer-address = wax-seed2.blokcrafters.io:9876  
  
# bountyblokbp: US, UnitedStates  
p2p-peer-address = p2p.wax.bountyblok.io:29876  
  
# cryptolions1: DE, Germany-Finland  
p2p-peer-address = wax.cryptolions.io:9876  
  
# csxcommunity: DE, Nuremberg,Bavaria  
p2p-peer-address = wax.csx.io:9876  
  
# dapplica: DE, Germany-Finland  
p2p-peer-address = wax.dapplica.io:9876  
  
# eosarabianet: DE, Munich  
p2p-peer-address = p2p-wax.eosarabia.net:9876  
  
# eosauthority: DE, Falkenstein  
p2p-peer-address = node-wax.eosauthority.com:10301  
  
# eosauthority: FI, Helsinki  
p2p-peer-address = node-wax-p2p.eosauthority.com:10301  
  
# eosdublinwow: FI, Finland  
p2p-peer-address = wax.p2p.eosdublin.io:9876  
  
# eoseouldotio: JP, Seoul  
p2p-peer-address = p2p.wax.eoseoul.io:29876  
  
# eosiodetroit: IN, wax-seed1-do-blr1  
p2p-peer-address = p2p.wax.eosdetroit.io:1337  
  
# eosphereiobp: AU, Sydney  
p2p-peer-address = peer1-wax.eosphere.io:9876  
  
# eosphereiobp: CA, Beauharnois  
p2p-peer-address = peer2-wax.eosphere.io:9876  
  
# greeneosiobp: DE, Germany  
p2p-peer-address = p2p1.wax.greeneosio.com:9876  
  
# ledgerwiseio: FI, LB  
p2p-peer-address = waxp2p.ledgerwise.io:21877  
  
# nation.wax: CA, Canada  
p2p-peer-address = wax.eosn.io:9876  
  
# niftylifewax: FI, Helsinki, Finland  
p2p-peer-address = p2p.niftylife.io:9876  
  
# niftylifewax: DE, Berlin, Germany  
p2p-peer-address = p2p2.niftylife.io:9876  
  
# oneinacilian: GB, United Kingdom  
p2p-peer-address = p2p.oiac.io:9896  
  
# teamgreymass: DE, FRA  
p2p-peer-address = wax.greymass.com:35777  
  
# wax.eastern: DE, Frankfurt  
p2p-peer-address = p2p.waxeastern.cn:9876  
  
# waxhiveguild: FI, Finnland  
p2p-peer-address = peer1.hivebp.io:9876  
  
# waxhiveguild: DE, Germany  
p2p-peer-address = peer2.hivebp.io:9876  
  
# waxswedenorg: SE, Sweden  
p2p-peer-address = p2p.waxsweden.org:35777  
  
# wizardsguild: US, wax-seed  
p2p-peer-address = wax-bp.wizardsguild.one:8876

# Always check for the latest PeerList - https://validate.eosnation.io/wax/reports/config.html

agent-name = "<yourname> WAX Mainnet"  
max-clients = 100  
sync-fetch-span = 500  

plugin = eosio::http_plugin  
plugin = eosio::chain_plugin  
plugin = eosio::chain_api_plugin
```

**genesis.json**

These are the initial state parameters required by every new starting node on the WAX Mainnet. Create the file as below:

```
> cd ~/waxdata

> nano genesis.json
```
Add the following parameters to the  `genesis.json`  file for the WAX Public Mainnet:

```
{  
  "initial_timestamp": "2019-06-05T12:00:00.000",  
  "initial_key": "EOS8i2pkwtv2JmdYWNJdcy5BcJ7wCE5q6mpE1hwT25HdgHMzeRday",  
  "initial_configuration": {  
    "max_block_net_usage": 1048576,  
    "target_block_net_usage_pct": 1000,  
    "max_transaction_net_usage": 524288,  
    "base_per_transaction_net_usage": 12,  
    "net_usage_leeway": 500,  
    "context_free_discount_net_usage_num": 20,  
    "context_free_discount_net_usage_den": 100,  
    "max_block_cpu_usage": 500000,  
    "target_block_cpu_usage_pct": 2000,  
    "max_transaction_cpu_usage": 150000,  
    "min_transaction_cpu_usage": 100,  
    "max_transaction_lifetime": 3600,  
    "deferred_trx_expiration_window": 600,  
    "max_transaction_delay": 3888000,  
    "max_inline_action_size": 4096,  
    "max_inline_action_depth": 4,  
    "max_authority_depth": 6  
  }  
}
```
# Running Nodeos

Now that the  `config.ini`  has been configured and the initial WAX Mainnet chain parameters  `genesis.json`  have been created, you can now join the network and sync up the node.

Use screen to keep your session live even when you disconnect, usage below:

```
#Create a new screen session  
  
> screen -US wax 

#Disconnect screen session  
  
> ctrl-a+d 

#Reconnect screen session  
  
> screen -r wax
```

Run  `nodeos`  with pointers to the config, data directory and genesis file:

```
> cd ~/wax-leap/build/programs/nodeos

> nodeos --data-dir ~/waxdata --config-dir ~/waxdata --genesis-json ~/waxdata/genesis.json
```

Your WAX Mainnet node will now start syncing with the configured peers until it catches up and is current with the WAX Mainnet chain.

It is possible to speed up the sync process by starting with a snapshot and valid  `blocks.log`  the process is explained in the **WAX Snapshots Guide**.

---

These **WAX Developer Technical Guides** are created using source material from the [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home)

Be sure to ask any questions in the  [EOSphere Telegram](https://t.me/eosphere_io)
