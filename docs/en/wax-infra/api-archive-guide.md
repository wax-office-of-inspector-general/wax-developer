---
title: API Full/Partial Archive nodes
nav_order: 142
layout: default
parent: WAX Infra Guides
lang-ref: API Full/Partial Archive nodes
lang: en
---

WAX is a distributed network of computers running software (known as nodes) that can verify blocks and transaction data. You need WAX software, on your computer to "run" a node. "Node" refers to running WAX software. WAX software verifies all transactions in each block, keeping the network secure and the data accurate. 

If you want to run your own node, you should understand that there are different types of node that consume and store data differently. In fact, WAX Software can be run in 3 different types of modes - peer, api, archive nodes. These setups also determine how quickly the node can get the most up-to-date information.

Archive nodes can be partial or full based on how they are started. These nodes contain the blocks, state history of the blockchain. Partial archive nodes are mainly started from snapshots so they don't contain full history of the blockchain but only have the history from a specific block.

Archive nodes are also referred as State-History or Ship nodes.

### Pre-requisites/Requirements:

- **Full State-History node Hardware(recommended specs):** 4Ghz+ CPU speed, 128GB RAM, 8TB SSD or NvME [For a partial state-history, you can have lower specs as its started from a snapshot]
- **Dependencies:** v2.0.13wax01(WAX Software recommended version)
- **OS:** Ubuntu18.04 (recommended)

#### Bare-Metal Infra providers:

- [Hetzner](https://www.hetzner.com/dedicated-rootserver "Hetzner")
- [Leaseweb](https://www.leaseweb.us/dedicated-servers "Leaseweb")

### Setup and Installation:

After securing the servers and setting up the boot configuration and appropriate RAID modes, you can login to the server and follow the next commands below: 

[Recommendation - Only setup root partition in Raid1 or Raid5 modes for now. We shall partition the disks later on after the boot and allocate them to a ZFS pool]

##### 1. Update the default pacakages and install new ones
```
apt-get update && apt-get install -y vim htop aptitude git lxc-utils zfsutils-linux netfilter-persistent sysstat ntp gpg screen zstd
```
##### 2. For better CPU performance:
```
apt-get install -y cpufrequtils
echo 'GOVERNOR="performance"' | tee /etc/default/cpufrequtils
systemctl disable ondemand
systemctl restart cpufrequtils
```
##### 3. Create disk partitions 
First step is to determine the disks and their names using the commands below:
```
fdisk -l
```
Now after identifying the disk names, let's partition them using the example command below, we need to create two partitions One for Swap and One for ZFS storage pool.

```
cfdisk /dev/nvme0n1
```
Do the above for all the disks on your server.

##### 4. Increase the Swap size as its usually small on the servers from Hetzner and Leaseweb.
```
mkswap /dev/nvme0n1p5
mkswap /dev/nvme1n1p5
```
Now let's add the Swap pools to the System's FileSystem table by editing the file below:
```
cat >>/etc/fstab <<'EOT'
/dev/nvme0n1p5     none            swap            defaults,pri=-2 0 0
/dev/nvme1n1p5     none            swap            defaults,pri=-2 0 0
/dev/nvme2n1p5     none            swap            defaults,pri=-2 0 0
EOT
```
After editing, let's enable the newly added Swap pool using the command below:
```
swapon -a
```

##### 5. Create ZFS storage pool based on your requirements with zraid or mirror etc modes. A good resource to do calculations on disk sizes: http://www.raidz-calculator.com/

```
zpool create -o ashift=12 zfast raidz /dev/nvme0n1p6 /dev/nvme1n1p6 /dev/nvme2n1p6 [--> adopt the partition names accordingly]
#Disable ZFS access time Updates
> zfs set atime=off zfast
#Set ARC to only cache metadata
> sudo zfs set primarycache=all datavolume
#Enable LZ4 compression
zfs set compression=lz4 zfast
zfs create -o mountpoint=/home zfast/home [-->Creates mountpoint]
```

##### 6. Setup NTP to ensure the clocks are in sync

It is important to have this as a peer-to-peer blockchain network to have synchronised time across all nodes. Chrony is an excellent NTP client and is quite suitable for the needs of WAX Mainnet.

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
#Set your local timezone if necessary
> sudo timedatectl set-timezone Europe/Stockholm
```

##### 7. Setup Stack Limits and Openfiles on your server

The default Stack Limits and Number of Open Files in Ubuntu 18.04 should be increased to support the WAX software memory requirements and the number of API requests on a Production Mainnet Node.

Configure and verify the raised limits as below:
```
> sudo nano /etc/systemd/system.conf
#Append the following configuration
DefaultLimitNOFILE=64000 
DefaultLimitSTACK=65536000
#Restart server and verify
> ulimit -a
```

------------

Now that we have setup the server and disk storage in a good way, let's go ahead with the next steps to build and setup the State-History nodes.

##### 8. Build and Configure the Software:

WAX software is an open-source modified version of EOSIO software to suit the needs of the WAX Network.Currently the WAX accepted software build and version is v2.0.13wax01 created by [cc32d9](https://cc32d9.medium.com/) who is a member of the [EOS Amsterdam Guild](https://eosamsterdam.net/)

The latest waxbuild tag is always available on the [WAX Github](https://github.com/worldwide-asset-exchange/wax-blockchain/tags).

**Manual Build**
```
cd ~
git clone https://github.com/worldwide-asset-exchange/wax-blockchain.git
cd wax-blockchain
git checkout v2.0.13wax01
git submodule update --init --recursive
cd scripts > ./eosio_build.sh -P./eosio_install.sh 
#If you want to install. Binaries are in ~/wax2.0/build/programs
```
As the -P option is used on the build script this may take some time to compile as it will build with pinned clang and libcxx

**Pre-Build Packages**
WAX Sweden team offers Pre-Build packages that can be easily installed. You can find them here: https://eosswedenorg.github.io/apt/wax
Please visit the above link and follow the provided instructions.

**Configuration**

Now that WAX Software is installed, let's go ahead and configure the state-history setup:

There are different components in the software like nodeos, cleos, keosd etc. **nodeos** is the core service which runs the protocol and is used across all the nodes. The configuration of nodeos is done using config.ini file. The settings of this file determine what kind of node you are running.

Follow the below steps to config the nodeos:

```
mkdir /home/data
mkdir /home/conf

cd /home/data
nano config.ini
```
Below is an example **mainnnet** config.ini file which is customized to setup state-history node, you can just copy and paste:

```
wasm-runtime = eos-vm-jit
eos-vm-oc-compile-threads = 4
eos-vm-oc-enable = true
read-mode = head
contracts-console = true

chain-state-db-size-mb = 131072
chain-state-db-guard-size-mb = 1024
chain-threads = 4
http-threads = 8

# Safely shut down node when less free space
chain-state-db-guard-size-mb = 128
reversible-blocks-db-guard-size-mb = 2

disable-subjective-p2p-billing = false
http-server-address = 0.0.0.0:8888
access-control-allow-origin = *
access-control-allow-headers = Origin, X-Requested-With, Content-Type, Accept
http-max-response-time-ms = 100
verbose-http-errors = true
http-validate-host = false

#Peering endpoint config
p2p-listen-endpoint = 0.0.0.0:9876
p2p-server-address = 0.0.0.0:9876

# State History Settings (need add to start params --disable-replay-opts )
plugin = eosio::state_history_plugin
state-history-dir = state-history
trace-history = true
chain-state-history = true
state-history-endpoint = 0.0.0.0:8080

allowed-connection = any

max-clients = 150
connection-cleanup-period = 30
sync-fetch-span = 2000
enable-account-queries = true

# Core Blockchain plugins
plugin = eosio::chain_plugin
plugin = eosio::chain_api_plugin
plugin = eosio::http_plugin

#Peers list - Refer this link for mainnet latest peers: https://validate.eosnation.io/wax/reports/config.html

# alohaeosprod: US, Oregon
p2p-peer-address = peer.wax.alohaeos.com:9876

# blacklusionx: DE, Germany
p2p-peer-address = peer1.wax.blacklusion.io:4646

# blacklusionx: DE, Germany
p2p-peer-address = peer1-emea.wax.blacklusion.io:4646

# bp.wecan: US, NewYork
p2p-peer-address = seed3-wax-mainnet.wecan.dev:14998

# dapplica: DE, Germany-Finland
p2p-peer-address = wax.dapplica.io:9876

# eosarabianet: DE, Munich
p2p-peer-address = p2p-wax.eosarabia.net:9876

# eosdacserver: GB, United Kingdom
p2p-peer-address = wax-p2p.eosdac.io:29876

# eosdublinwow: FI, Finland
p2p-peer-address = wax.p2p.eosdublin.io:9876

# eoseouldotio: JP, Seoul
p2p-peer-address = p2p.wax.eoseoul.io:29876

# eosphereiobp: AU, Sydney
p2p-peer-address = peer2-wax.eosphere.io:9876

# guild.nefty: FI, Finland
p2p-peer-address = p2p-node2.neftyblocks.com:9876

# ledgerwiseio: FI, LB
p2p-peer-address = waxp2p.ledgerwise.io:21877

# waxhiveguild: FI, Finnland
p2p-peer-address = peer1.hivebp.io:9876
```
If you are starting the node from the 1st block, then you also need to have **genesis.json** file as well:

```
cd /home/conf
nano genesis.json
```
Add the following config to the genesis.json file. This is for the **WAX Mainnet**:
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
For **WAX Testnet**, add the following config to the genesis.json file:
```
{
  "initial_timestamp": "2019-12-06T06:06:06.000",
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
##### 9. Running the Node:

Once you are through the previous steps, the next step is to get started with the steps to run the node and sync with the WAX Mainnet/Testnet:

You can start the **nodeos** using the command and parameters below:

For starting the node from genesis:
```
nodeos --disable-replay-opts --data-dir /home/data/ --config-dir /home/data/ --genesis-json=/home/conf/genesis.json
```
For starting the node from a snapshot:
```
nodeos --disable-replay-opts --data-dir /home/data/ --config-dir /home/data/ --snapshot /home/data/snapshots/**<replace with snapshot file name>**
```
###### Running and managing nodeos using scripts:

The below start and stop scripts will help you to daemonize and manage the nodeos service.
```
cd /home/conf
vim start.sh
```
**start.sh**
```
#!/bin/bash
DATADIR="/home/data"

#change the directory path according to your configuration
NODEOSBINDIR="/usr/opt/wax/2013wax01-mv/bin/" 


$DATADIR/stop.sh
echo -e "Starting Nodeos \n";

ulimit -c unlimited
ulimit -n 65535
ulimit -s 64000

$NODEOSBINDIR/nodeos/nodeos --data-dir $DATADIR --config-dir $DATADIR "$@" > $DATADIR/stdout.txt 2> $DATADIR/stderr.txt &  echo $! > $DATADIR/nodeos.pid
```
**stop.sh**
```
#!/bin/bash
DIR="/home/data"
 if [ -f $DIR"/nodeos.pid" ]; then
        pid=`cat $DIR"/nodeos.pid"`
        echo $pid
        kill $pid


        echo -ne "Stoping Nodeos"

        while true; do
            [ ! -d "/proc/$pid/fd" ] && break
            echo -ne "."
            sleep 1
        done
        rm -r $DIR"/nodeos.pid"

        DATE=$(date -d "now" +'%Y_%m_%d-%H_%M')
        if [ ! -d $DIR/logs ]; then
            mkdir $DIR/logs
        fi
        tar -pcvzf $DIR/logs/stderr-$DATE.txt.tar.gz stderr.txt stdout.txt


        echo -ne "\rNodeos Stopped.    \n"
    fi
```

All you have to do now is start the script and monitor the logs in stderr.txt in /home/data folder.

```
tail -f stderr.tx
```
Your State-History node will now start syncing with the configured peers and catch-up with the chain headblock. It may take up to 2-3 weeks for a complete block sync from genesis for WAX Mainnet. It may also help if you choose a few closely located peers to limit peer overload and ensure low latency.

Example screenshot when the node is syncing successfully:

![image](https://user-images.githubusercontent.com/15923938/163224549-92f633fc-6ab5-4a15-adee-fe165ece874b.png)

As your node syncs from the start of the chain it will build the log and index files in the /blocks and /state-history directories in your /home/data folder.

**You can now query the node rest endpoint at http port 8888 and for websockets it is port 8080**
