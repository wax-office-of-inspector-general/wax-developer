---
title: Atomic Assets/Market API-US
---

# Atomic Assets/Market API-US

WAX Blockchain is hevaily focused on NFTs and AtomicAssets standard has became the defacto standard on WAX for NFTs. This guide helps project teams to setup their own AtomicAssets API Infrastructure to access NFTs and Marketplaces specific data. This API data can be useful for various purposes like:

- Building Games
- Building Marketplaces
- Accessing NFTs in games
- Users NFTs Portfolio
- Users NFTs Historical activities
- For Accounting and Tax purposes

### Pre-requisites/Requirements:

- **Atomic Filler node Hardware(minimum specs):** Multi-threaded CPU with at-least 4gHZ CPU speed or above, 64GB RAM, 2TB NvME SSD
- **Atomic API Hardware(minimum specs):** Multi-threaded CPU with at-least 4gHZ CPU speed or above, 128GB RAM, 2TB NvME SSD
- **Full State-History node Hardware(recommended specs):** i9 CPU, 128GB RAM, 7TB NVME SSD [For a partial state-history, you can have lower specs or have it on the same server as Atomic Filler. This can also be started from a snapshot]
- **Requirements:** 
  - PostgreSQL >= 13.0
  - NodeJS >= 16.0
  - Redis >= 5.0
  - Nodeos >= 1.8.0 (only tested with 2.0 and 2.1) The state history plugin needs to be enabled and the options: `trace-history = true`, `chain-state-history = true`
  - Hasura GraphQL Engine >= 1.3 (if you want to allow GraphQL queries) [https://computingforgeeks.com/install-hasura-graphql-engine-on-ubuntu-18-04-centos-7/]
  - PGAdmin 4 (Interface to manage the postgres database)

You can use 1 node for both Atomic filler and API in a 128GB RAM server but it's recommended to have a High Availability setup using Postgres replication between the servers for better performance and request handling. 

#### Bare-Metal Infra providers:

- [Hetzner](https://www.hetzner.com/dedicated-rootserver "Hetzner")
- [Leaseweb](https://www.leaseweb.us/dedicated-servers "Leaseweb")

#### Cloud Infra providers:

- https://www.digitalocean.com/pricing/managed-databases

### Setup and Installation:

After securing the servers or cloud instances and setting up the boot configuration and appropriate RAID modes, you can login to the server and follow the next commands below:

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
EOT
```
After editing, let's enable the newly added Swap pool using the command below:
```
swapon -a
```

##### 5. Create ZFS storage pool based on your requirements with zraid or mirror etc modes. A good resource to do calculations on disk sizes: http://www.raidz-calculator.com/

```
zpool create -o ashift=12 zfast raidz /dev/nvme0n1p6 /dev/nvme1n1p6 [--> adopt the partition names accordingly]
zfs set atime=off zfast
zfs set compression=lz4 zfast 
zfs create -o mountpoint=/home zfast/home [-->Creates mountpoint]
```

------------

Now that we have setup the server and disk storage in a good way, let's go ahead with the next steps to setup the Hyperion related dependencies.

https://hyperion.docs.eosrio.io/manual_installation/

##### 6. Node JS installation:
```
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
node  -v
```
##### 7. PostgreSQL 14 Setup & Installation:

The following steps are for a single node setup but it is recommended to have a multi-node postgres cluster with repliacation for better performance & resiliency. 

For Postgres replication cluster setup, refer:

- [Streaming Replication](https://girders.org/postgresql/2021/11/05/setup-postgresql14-replication/)

**PostgreSQL 14 Installation using Apt package:**

Guide: https://techviewleo.com/how-to-install-postgresql-database-on-ubuntu/

```
sudo apt update && sudo apt -y upgrade
sudo apt -y install gnupg2 wget vim
sudo apt-cache search postgresql | grep postgresql
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt -y update
sudo apt -y install postgresql-14 postgresql-client-14
```
On successful installation, the PostgreSQL service starts automatically and can be verified as below.
```
$ systemctl status postgresql
● postgresql.service - PostgreSQL RDBMS
   Loaded: loaded (/lib/systemd/system/postgresql.service; enabled; vendor preset: enabled)
   Active: active (exited) since Mon 2021-10-25 16:15:55 CEST; 5s ago
  Process: 32506 ExecStart=/bin/true (code=exited, status=0/SUCCESS)
 Main PID: 32506 (code=exited, status=0/SUCCESS)

Okt 25 16:15:55 thor-KVM systemd[1]: Starting PostgreSQL RDBMS...
Okt 25 16:15:55 thor-KVM systemd[1]: Started PostgreSQL RDBMS.
```
You can also verify the installed PostgreSQL version using the command below:
```
sudo -u postgres psql -c "SELECT version();"
```
After verifying installation, Let's update the password for user postgres:
```
sudo su - postgres
psql -c "alter user postgres with password '<ENTER YOUR PASSWORD HERE>'
```

Now, let's create new directories on the ZFS storage pool so that PG data can be stored there instead of default directories:
```
cd /home
mkdir pg-data
chown -R postgres:postgres pg-data/
```
After creating the directories and fixing the folder permissions, let's edit the PG config by editing the file below:
```
vim /etc/postgresql/14/main/postgresql.conf
```
###### Replace the following sections in the PG config file

```
data_directory = '/var/lib/postgresql/14/main'
```

##### 8. Redis installation
```
sudo add-apt-repository ppa:redislabs/redis
sudo apt-get -y update
sudo apt-get -y install redis
redis-server -v
```
###### Update Redis Supervision Method
Change the `supervised` configuration from `supervised no` to `supervised systemd` on `/etc/redis/redis.conf`

###### Restart Redis
```
sudo systemctl restart redis-server
sudo systemctl enable --now redis-server
sudo systemctl status redis-server
sudo systemctl status redis-server
sudo systemctl unmask  redis-server.service
sudo systemctl restart redis-server
sudo systemctl status redis-server
```
##### 9. PGAdmin4 installation

Guides:
  - https://computingforgeeks.com/how-to-install-pgadmin-4-on-ubuntu/
  - https://stackoverflow.com/questions/58239607/pgadmin-package-pgadmin4-has-no-installation-candidate

Installation commands:
```
curl https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo apt-key add

sudo sh -c 'echo "deb https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list && apt update'

sudo apt -y install pgadmin4

For setting up the web server: sudo /usr/pgadmin4/bin/setup-web.sh
```

##### 10. Yarn and Pm2 installation

Yarn Installation:
```
sudo apt remove -y cmdtest
sudo apt remove -y yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update -y
sudo apt-get install yarn -y
```
Pm2 instllation:
```
yarn global add pm2
pm2 startup
```

------------
##### 11. Setup & Install Atomic Filler & API:

Now we have finished the dependencies setup, let's go ahead and start the actual Atomic API software installation.

We have two options now:
1. To install and sync everything from scratch. 
2. Use existing PG snapshots to sync the data and then start the Atomic Filler & API instances.

Note: If you are using PG snapshots from a snapshot service provider, download and extract the snapshots

###### Setup:

Clone the latest codebase and install the Atomic Filler & API:

```
git clone https://github.com/pinknetworkx/eosio-contract-api.git
cd eosio-contract-api
yarn install
```
Now it's installed, we have to setup the connections and the chain configuration.

Follow the guide [here](https://github.com/pinknetworkx/eosio-contract-api/blob/master/README.md  "here") to setup configuration files. or find the examples below:

The config folder contains 3 different configuration files

#### connections.config.json
This file contains Postgres / Redis / Nodeos connection data for the used chain.

Notes
* Redis: Can be used for multiple chains without further action
* PostgreSQL: Each chain needs it own postgres database (can use the same postgres instance), but multiple readers of the same
chain can use the same database if they are non conflicting
* Nodeos: nodeos should habe a full state history for the range you are trying to index

```json
{
  "postgres": {
    "host": "127.0.0.1",
    "port": 5432,
    "user": "username",
    "password": "changeme",
    "database": "api-wax-mainnet-atomic-1"
  },
  "redis": {
    "host": "127.0.0.1",
    "port": 6379
  },
  "chain": {
    "name": "wax-mainnet",
    "chain_id": "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4",
    "http": "http://127.0.0.1:8888",
    "ship": "ws://127.0.0.1:8080"
  }
}
```

#### readers.config.json
This file is used to configure the filler

For atomicassets / atomicmarket you should specify the following start blocks
* `wax-mainnet`: `64000000`
* `wax-testnet`: `35795000` (Here you need to use it otherwise it will break)

```json5
[
  // Multiple Readers can be defined and each one will run in a separated thread
  {
    "name": "atomic-1", // Name of the reader. Should be unique per chain and should not change after it was started

    "start_block": 0, // start at a specific block. If ready was already started, this can only be higher than the last indexed block
    "stop_block": 0, // stop at a specific block
    "irreversible_only": false, // If you need data for a lot of contracts and do not need live data, this option is faster

    "ship_prefetch_blocks": 50, // How much unconfirmed blocks ship will send
    "ship_min_block_confirmation": 30, // After how much blocks the reader will confirm the blocks
    "ship_ds_queue_size": 20, // how much blocks the reader should preserialize the action / table data
      
    "ds_ship_threads": 4, // How much threads should be used to deserialize traces and table deltas

    "db_group_blocks": 10, // In catchup mode, the reader will group this amount of bl

    "contracts": [
      // AtomicAssets handler which provides data for the AtomicAssets NFT standard
      {
        "handler": "atomicassets",
        "args": {
          "atomicassets_account": "atomicassets", // Account where the contract is deployed
          "store_logs": true, // store logs
          "store_transfers": true // store the transfer history
        }
      }
    ]
  }
]
```

#### server.config.json

```json5
{
  "provider_name": "pink.network", // Provider which is show in the endpoint documentation
  "provider_url": "https://pink.network",

  "server_addr": "0.0.0.0", // Server address to bind to
  "server_name": "wax.api.atomicassets.io", // Server name which is shown in the documentation
  "server_port": 9000, // Server Port

  "cache_life": 2, // GET endpoints are cached for this amount of time (in seconds)
  "trust_proxy": true, // Enable if you use a reverse proxy to have correct rate limiting by ip

  "rate_limit": {
    "interval": 60, // Interval to reset the counter (in seconds)
    "requests": 240 // How much requests can be made in the defined interval
  },
    
  "ip_whitelist": [], // These IPs are not rate limited or receive cached requests
  "slow_query_threshold": 7500, // If specific queries take longer than this threshold a warning is created

  "max_query_time_ms": 10000, // max execution time for a database query
  "max_db_connections": 50, // max number of concurrent db connections / db queries
        
  "namespaces": [
    // atomicassets namespace which provides an API for basic functionalities
    {
      "name": "atomicassets", 
      "path": "/atomicassets", // Each API endpoint will start with this path
      "args": {
        "atomicassets_account": "atomicassets" // Account where the contract is deployed
      }
    }
  ]
}

```

###### Running Hyperion:
This project consists of two separated processes which need to be started and stopped independently:
* The API which will provide the socket and REST endpoints (or whatever is used)
* The filler which will read the data from the blockchain and fills the database

The filler needs to be started before the API when running it for the first time:

Prerequisites:
- PostgreSQL
  - Create a database and user which is allowed to read and write on that db
    
- WAX Archive node 
  - State History Plugin enabled with options `trace-history = true`, `chain-state-history = true`
  - Fully synced for the block range you want to process
  - Open socket and http api

- Copy and modify example configs with the correct connection params

There are two suggested ways to run the project: Docker if you want to containerize the application or PM2 if you want to run it on system level

### Docker

1. `git clone && cd eosio-contract-api`
2. There is an example docker compose file provided
3. `docker-compose up -d`

Start
* `docker-compose start eosio-contract-api-filler`
* `docker-compose start eosio-contract-api-server`

Stop
* `docker-compose stop eosio-contract-api-filler`
* `docker-compose stop eosio-contract-api-server`

### PM2

1. `git clone && cd eosio-contract-api`
2. `yarn install`
3. `yarn global add pm2`

Start
* `pm2 start ecosystems.config.json --only eosio-contract-api-filler`
* `pm2 start ecosystems.config.json --only eosio-contract-api-server`

Stop
* `pm2 stop eosio-contract-api-filler`
* `pm2 stop eosio-contract-api-server`

**Note:** If you have any further questions, please write them here: https://t.me/waxinfra

------------

## Good to Know: Currently Supported Contracts

### Readers (used to fill the database)

Readers are used to fill the database for a specific contract.

#### atomicassets

```json5
{
  "handler": "atomicassets",
  "args": {
    "atomicassets_account": "atomicassets", // account where the atomicassets contract is deployed
    "store_transfers": true, // store the transfer history  
    "store_logs": true // store data structure logs
  }
}
```

#### atomicmarket
This reader requires a atomicassets and a delphioracle reader with the same contract as specified here

```json5
{
  "handler": "atomicmarket",
  "args": {
    "atomicassets_account": "atomicassets", // account where the atomicassets contract is deployed
    "atomicmarket_account": "atomicmarket", // account where the atomicmarket contract is deployed
    "store_logs": true // Store logs of sales / auctions
  }
}
```

#### delphioracle

```json5
{
  "handler": "delphioracle",
  "args": {
    "delphioracle_account": "delphioracle" // account where the delphioracle contract is deployed
  }
}
```

### Namespace (API endpoints)

A namespace provides an API for a specific contract or use case and is based on data a reader provides

#### atomicassets

```json5
{
  "handler": "atomicassets",
  "args": {
    "atomicassets_account": "atomicassets", // account where the atomicassets contract is deployed
    "connected_reader": "atomic-1" // reader to which the API connects for live data
  }
}
```

#### atomicmarket

```json5
{
  "handler": "atomicmarket",
  "args": {
    "atomicmarket_account": "atomicmarket", // account where the atomicmarket contract is deployed
    "connected_reader": "atomic-1" // reader to which the API connects for live data
  }
}
```
