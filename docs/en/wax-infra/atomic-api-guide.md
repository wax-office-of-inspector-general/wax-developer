---
title: Atomic Assets/Market API
nav_order: 143
layout: default
parent: WAX Infra Guides
lang-ref: Atomic Assets/Market API
lang: en
---

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

You can use 1 node for both Atomic filler and API in a 128GB RAM server but it's recommended to have a High Availability setup using Postgres replication between the servers for better performance and request handling. This guide will focus on the recommended setup.

#### Bare-Metal Infra providers:

- [Hetzner](https://www.hetzner.com/dedicated-rootserver "Hetzner")
- [Leaseweb](https://www.leaseweb.us/dedicated-servers "Leaseweb")

#### Cloud Infra providers:

- https://www.digitalocean.com/pricing/managed-databases

### Setup and Installation:

After securing the servers or cloud instances fot configuration and appropriate RAID modes, you can login to the server and follow the next commands below: 

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
zfs set atime=off zfast
zfs set compression=lz4 zfast [-->not really needed as ES already compresses the data]
zfs create -o mountpoint=/home zfast/home [-->Creates mountpoint]
```

------------

Now that we have setup the server and disk storage in a good way, let's go ahead with the next steps to setup the Hyperion related dependencies.

https://hyperion.docs.eosrio.io/manual_installation/

##### 6. Elasticsearch v7.17.X Setup & Installation:

The following steps are for a single node ES cluster but it is recommended to have a multi-node ES cluster for scalability & resiliency. Setup a minimum of 3 node ES cluster  so ES shards can be distributed and replicas are created. In addition use the Cross-Cluster replication in different data centres for geo resiliency.

For multi node ES cluster setup, refer:

https://www.elastic.co/guide/en/elasticsearch/reference/7.17/scalability.html
https://www.elastic.co/guide/en/elasticsearch/reference/current/add-elasticsearch-nodes.html

**ES Installation using Apt package:**

```
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
sudo apt-get install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-7.x.list
sudo apt-get update && sudo apt-get install elasticsearch
```
Now, let's create new directories on the ZFS storage pool so that ES data & logs can be stored there instead of default directories:
```
cd /home
mkdir es-data
mkdir es-logs
chown -R elasticsearch:elasticsearch es-data/
chown -R elasticsearch:elasticsearch es-logs/
```
After creating the directories and fixing the folder permissions, let's edit the ES config by editing the file below:
```
vim /etc/elasticsearch/elasticsearch.yml
```

###### Replace the following sections in the ES config file

```
# ---------------------------------- Cluster -----------------------------------
cluster.name: hyp-cluster
bootstrap.memory_lock: true
# ----------------------------------- Paths ------------------------------------
path.data: /home/es-data
# Path to log files:
path.logs: /home/es-logs
```
###### Heap Size Configuration

For a optimized heap size, check how much RAM can be allocated by the JVM on your system. Run the following command:
```
java -Xms16g -Xmx16g -XX:+UseCompressedOops -XX:+PrintFlagsFinal Oops | grep Oops
```
Check if UseCompressedOops is true on the results and change -Xms and -Xmx to the desired value.

**Note:** Elasticsearch includes a bundled version of OpenJDK from the JDK maintainers. You can find it on /usr/share/elasticsearch/jdk

After that, change the heap size by editting the following lines on

`vim /etc/elasticsearch/jvm.options`:

```
-Xms25g
-Xmx25g
```
**Note:** Xms and Xmx must have the same value.
**Warning:** Avoid allocating more than 31GB when setting your heap size, even if you have enough RAM.

###### Allow Memory Lock

Override systemd configuration by running `sudo systemctl edit elasticsearch` and add the following lines:
```
[Service]
LimitMEMLOCK=infinity
```
Run the following command to reload units:
```
sudo systemctl daemon-reload
```
###### Start Elasticsearch
Start Elasticsearch and check the logs:
```
sudo systemctl start elasticsearch.service
sudo less /home/es-logs/hyp-cluster.log
```
Enable it to run at startup:
```
sudo systemctl enable elasticsearch.service
```
And finally, test the REST API:
```
curl -X GET "localhost:9200/?pretty" [Test if everything looks good]
```

###### Set Up Minimal Security
The Elasticsearch security features are disabled by default. To avoid security problems, we recommend enabling the security pack.

To do that, add the following line to the end of the file: `vim /etc/elasticsearch/elasticsearch.yml`

```
xpack.security.enabled: true
```
Restart Elasticsearch and set the passwords for the cluster:
```
sudo systemctl restart elasticsearch.service
sudo /usr/share/elasticsearch/bin/elasticsearch-setup-passwords auto
```
Save the passwords somewhere safe, they'll be necessary for future purpose.

Now you can test the REST API using username and password:
```
curl -X GET "http://localhost:9200/?pretty" -u elastic:<password>
```

##### 7. Kibana Installation using Apt package:

```
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
sudo apt-get install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-7.x.list
sudo apt-get update && sudo apt-get install kibana
```
###### Configuration:

Now let's edit the `vim /etc/kibana/kibana.yml`

Update the host address to 0.0.0.0 if needed for accessing it using the IP on the public network. By default it's set to localhost.

If you have enabled the security pack on Elasticsearch, you need to set up the password on Kibana:
```
elasticsearch.username: "kibana_system"
elasticsearch.password: "password"
```
###### Start Kibana
Start Kibana and check the logs:
```
sudo systemctl start kibana.service
sudo less /var/log/kibana/kibana.log
```
Enable it to run at startup:
```
sudo systemctl enable kibana.service
```

##### 8. Node JS installation:
```
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
node  -v
```
##### 9.Redis installation
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
##### 10. Pm2 installation
```
npm install pm2@latest -g
pm2 startup
```

##### 11. RabbitMq Installation

Copy the shell script from here and run it on the server: https://www.rabbitmq.com/install-debian.html#installation-methods
```
cd builds
vim rabbit_install.sh
```
After copying the script, you can now execute it:
```
bash rabbit_install.sh
```
Let's create directories in our ZFS Storage pool for RabbitMq:
```
cd /home
mkdir rabbitmq
chown -R rabbitmq:rabbitmq rabbitmq/
```

Add a env file in `/etc/rabbitmq` so that we can charge the default directories:
```
cd /etc/rabbitmq
vim rabbitmq-env.conf
```
Add the following lines to the config file:
```
RABBITMQ_MNESIA_BASE=/home/rabbitmq
RABBITMQ_LOG_BASE=/home/rabbitmq/log
```
Restart the rabbit server after updating the config:
```
service rabbitmq-server restart
```
```
sudo rabbitmq-plugins enable rabbitmq_management
sudo rabbitmqctl add_vhost hyperion
sudo rabbitmqctl add_user hyper << password >>
sudo rabbitmqctl set_user_tags hyper administrator
sudo rabbitmqctl set_permissions -p hyperion hyper ".*" ".*" ".*"
sudo rabbitmqctl add_vhost /hyperion
sudo rabbitmqctl set_permissions -p /hyperion hyper ".*" ".*" ".*"
```

------------
##### 12. Setup & Install Hyperion

Now we have finished the dependencies setup, let's go ahead and start the actual Hyperion software installation.

We have two options now:
1. To install and sync everything from scratch
2. Use ES snapshots to sync the data and then start the Hyperion instance.

Note: If you are using ES snapshots from a snapshot service provider, go to Kibana dev mode and enter the following commands:

```
PUT _snapshot/eosphere-repo
{
   "type": "url",
   "settings": {
       "url": "https://store1.eosphere.io/wax/hyperion/snapshot/"
   }
}


POST _snapshot/eosphere-repo/wax_snapshot_2022.02.01/_restore
{
  "indices": "*,-.*"
}
```
###### Setup:

Clone the latest codebase and install the hyperion:

```
git clone https://github.com/eosrio/hyperion-history-api.git
cd hyperion-history-api
npm install
```
Now it's installed, we have to setup the connections and the chain configuration.

1. Follow the guide [here](https://hyperion.docs.eosrio.io/connections/  "here") to setup connections.json file. or find the example below:
```
{
  "amqp": {
    "host": "127.0.0.1:5672",
    "api": "127.0.0.1:15672",
    "protocol": "http",
    "user": "hyper",
    "pass": "<Enter your RMQ password>",
    "vhost": "hyperion",
    "frameMax": "0x10000"
  },
  "elasticsearch": {
    "protocol": "http",
    "host": "127.0.0.1:9200",
    "ingest_nodes": [
      "127.0.0.1:9200"
    ],
    "user": "elastic",
    "pass": "<Enter the elastic user password from step 6>"
  },
  "redis": {
    "host": "127.0.0.1",
    "port": "6379"
  },
  "chains": {
    "wax": {
      "name": "Wax",
      "ship": "ws://<Enter your Ship node endpoint here>:8080",
      "http": "http://<Enter your API node endpoint here>:8888",
      "chain_id": "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4",
      "WS_ROUTER_HOST": "127.0.0.1",
      "WS_ROUTER_PORT": 7001
    }
  }
}
```
2. Follow the guide [here]https://hyperion.docs.eosrio.io/chain/  "here") to setup wax.config.json file

###### Running Hyperion:

There are two parts to Hyperion, one is Indexer and the other is the API.

When you start with Indexer the first step is to run it with the ABI scan mode. And once the ABI scan is done you can start it back without it. The Hyperion Indexer is configured to perform an abi scan ("abi_scan_mode": true) as default. 

You can use the following commands to run and stop the indexer.
```
./start.sh wax-indexer
./stop.sh wax-indexer
```
Once the indexer is synced, you can start it with the live mode and then start the API.

To start the API, you can use the following commands:
```
./start.sh wax-api
./stop.sh wax-api
```
**Note:** If you have any further questions about how to use Hyperion, please write them here: https://t.me/EOSHyperion

------------

For setting up the partial history guide: https://medium.com/waxgalaxy/lightweight-wax-hyperion-api-node-setup-guide-f080a7d4a5b5
