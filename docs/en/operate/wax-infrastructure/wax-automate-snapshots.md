Whether it’s restarting an ungracefully shutdown node, spinning up a lite node or using the  [tmpfs memory strategy](https://developer.wax.io/operate/wax-infrastructure/wax-ram-disk-utilisation)  for better performance,  **nodeos snapshots**  are needed to return the chain state database to a valid point in time so the node may rejoin and sync with the network.

_The chain state database_ `shared_memory.bin` _is needed by_ `nodeos` _to run, it is a memory mapped file that contains the state associated with each block, including smart contract data, account details and deferred transactions._

If you are familiar with the WAX Guild ecosystem, you will know that there are numerous providers of reliable snapshots. However best practice would be for a top tier Guild to create their own snapshots and potentially share them with the rest of the community.

This guide will share the scripting method that the EOSphere Guild uses to create and manage snapshots. At time of writing Leap v5.0.3 is available with  [expanded snapshot functionality](https://github.com/eosnetworkfoundation/product/blob/main/api-http/proposals/snapshot-api.md)  built into the  `eosio::producer_api_plugin`  that may accomplish the same as the EOSphere method, this will be covered in a future guide.

# Automate WAX Snapshots

Before creating a snapshot it needs to be mentioned that the node will essentially pause during the process, depending on the the size of the chains state database (currently 90GB on WAX Mainnet) this may take some time.

With this in mind it is recommended that a dedicated not in production server is use for creating snapshots.

# Installation, Configuration and Running

In this example the goal is to:

-   Configure nodeos
-   Configure snapshot script
-   Configure delete script
-   Configure a CronJob

## Configure nodeos

A synchronised WAX node with the  `eosio::producer_api_plugin`  enabled is used as the snapshot server. Configure as below:

```
> nano config.ini  
  
plugin = eosio::producer_api_plugin
```

Snapshots will be saved to the  `/snapshots`  folder - ensure there is sufficient disk space available.

Please see  [How to Setup a Solid WAX Mainnet Node](https://developer.wax.io/operate/wax-infrastructure/wax-mainnet-node)  for a guide on WAX node build, config and operation.

## **Configure snapshot script**

This script will accomplish the following on the snapshot node:

-   Take Snapshot
-   Label snapshot with current block number
-   Archive snapshot
-   Transfer snapshot to repository

Add dependency applications:

```
> sudo apt update  
  
#jq is a lightweight and flexible command-line JSON processor  
> sudo apt install jq  
  
#Zstandard lossless data compression  
> sudo apt install zstd
```

Create the snapshot script as below adjusting to your environment:

```
> nano snapshot.sh  

#!/bin/bash  
  
logs='/home/eosphere/scripts/logs'  
now=$(date +"%Y-%d-%m_%H-%M")  
logfile="$logs/$now.txt"  
  
echo $logfile  
echo "Create snapshot" >> $logfile  
  
result=$(curl -X POST http://127.0.0.1:8888/v1/producer/create_snapshot) >> $logfile  
  
head_block=$(echo "$result" | jq -r '.head_block_id')  
snap_name=$(echo "$result" | jq -r '.snapshot_name')  
  
echo $head_block >> $logfile  
echo $snap_name >> $logfile  
  
block_num=$(/home/eosphere/wax-leap/build/programs/cleos/cleos -u https://wax.eosphere.io get block "$head_block" | jq '.block_num')  
  
echo $block_num >> $logfile  
  
outfile="/home/eosphere/scripts/snapshot-wax-$block_num-$now.bin.zst"  
  
echo "Create compressed image" >> $logfile  
  
/usr/bin/zstd -z -T1 "$snap_name" -o "$outfile" >> $logfile  
  
echo "Copy to repository" >> $logfile  
  
/usr/bin/rsync -e "ssh -i /home/eosphere/.ssh/mrsnapshot.pem" -a --progress "$outfile" "mrsnapshot@10.0.0.101:/home/mrsnapshot/snapshots/wax/" >> $logfile  
  
echo "Complete" >> $logfile  

> chmod +x snapshot.sh
```

In the above example script:

-   logs are stored here  `/home/eosphere/scripts/logs`
-   the cleos binary is located here  `/home/eosphere/wax-leap/build/programs/cleos/cleos`
-   the compressed and labelled snapshot is stored here  `/home/eosphere/scripts`
-   the created compressed and labelled snapshot is copied to a repository  `10.0.0.101`  using an ssh certificate  `mrsnapshot.pem`  and a username  `mrsnapshot`

The script is executed as below:

```
> ./snapshot.sh
```

## Configure delete script

To ensure the snapshot node doesn’t run out of disk space old snapshot’s are deleted with the below script:

```
> nano delete.sh  
  
#! /bin/bash   
/usr/bin/find /home/eosphere/datavolume1/waxdata1/snapshots -name "*.bin" -type f -mtime +1 -exec rm -f {} \;  
/usr/bin/find /home/eosphere/scripts -name "*.zst" -type f -mtime +2 -exec rm -f {} \;  
  
> chmod +x delete.sh
```

In the above script:

-   raw nodeos .bin snapshots are deleted after a day (-mtime +1)
-   compressed and labelled snapshots are deleted after 2 days (-mtime +2)

The script is executed as below:

```
> ./delete.sh
```

## Configure a CronJob

Running a CronJob is a great way to regularly schedule the snapshot and delete scripts. To run once a day configure as below:

```
> crontab -e  
  
0 12 * * * /home/eosphere/scripts/snapshot.sh  
0 16 * * * /home/eosphere/scripts/delete.sh
```

In the above CronJob:

-   snapshot.sh is run once a day at 12h00
-   delete.sh is run once a day at 16h00

The collection of compressed and labelled snapshots can then be shared with the community from the repository using a basic html webpage such as  [EOSphere Snapshot and Backups](https://snapshots.eosphere.io/)

---

These **WAX Developer Technical Guides** are created using source material from the [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home)

Be sure to ask any questions in the  [EOSphere Telegram](https://t.me/eosphere_io)
