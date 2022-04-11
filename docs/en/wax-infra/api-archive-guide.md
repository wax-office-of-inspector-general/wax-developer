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

###### Configuration

