---
title: Optimising RAM and Disk Utilisation
---

Running WAX software can be very demanding on compute resources especially on the extremely busy WAX Mainnet. Other than the requirement for a snappy CPU, WAX Software runs the entire network in resident memory and maps this memory to a thin provisioned memory mapped file called the state database which means that some lofty RAM and Disk IO requirements also need to be met.

This guide will work through an example of managing RAM and Disk requirements in an effectively and economical way.

_This article has been updated to incorporate the_ [_Antelope_](https://antelope.io/) _Leap 5.0 software build process._

# Optimising RAM and Disk Utilisation

There are two challenges this article will address, managing usage of RAM and managing the amount of Disk IO. RAM is costly and often limited on a specific hardware platform and Solid State Disks have a limited lifetime based on the amount of writes that occur (SSD Endurance).

At time of writing (March 2024) the WAX Mainnet’s node memory utilisation is **95GB**.

Currently there are three effective mechanisms to manage RAM and Disk IO. 

The first is using WAX Software's ```heap``` mode, which preloads the state database into swappable memory on node start. 

The second and what this article's example will walk through is utilising the Linux Kernel's **tmpfs** mechanism and a large amount of disk **swap**. 

The third is a newly available mechanism available with Leap 5.0 called ```mapped_private``` mode. This mode is covered at the end of this article.

_tmpfs is a Linux file system that keeps all of it's files in virtual memory, the contents of this folder are temporary meaning if this folder is unmounted or the server rebooted all contents will be lost._

It has been discovered through testing by the community that much of the resident memory data isn't accessed very frequently and can be swapped to disk. This understanding means we can be far more efficient on our RAM utilisation and Disk IO demands. This is the basis for how the tmpfs and mapped_private strategies work.

# Summary of the tmpfs memory strategy

This strategy is currently working for EOSphere in our production environment, even on nodes that have enough RAM. Offsetting the constant writes to disk appear to be saving our SSD’s. At time of writing a production node is able to run effectively configured like this with only 64GB of RAM.

In summary this example will do the following:

1.  Mount a tmpfs folder
2.  Create a large swap file
3.  Configure nodeos to use the tmpfs folder for state
4.  Start nodeos from a snapshot

## tmpfs

This example will have a 128GB State Database which will be placed in the tmpfs folder which will be 129GB to ensure it‘s big enough’.

Configure  `fstab`  as below:

```
> sudo nano /etc/fstabtmpfs   /home/eosphere/waxdata/state  tmpfs rw,nodev,nosuid,size=129G,x-systemd.after=zfs-mount.service 0

> sudo mount -a

**check that is was mounted**
> df -h
```

## swap

Linux swap can be configured in it’s own partition or as a file, from our experience using SSD’s (non spindle disks) there hasn’t been any issue using a file and gives us the ability to easily adjust the swap size.

Swap will be configured as 128GB as below:

```
***Turn off existing swap, which would probably be a partition***
> sudo swapoff -a

> sudo fallocate -l 128G /swap.img

> sudo chmod 600 /swap.img

> sudo mkswap /swap.img

> sudo swapon /swap.img

***Configure fstab and comment out the old swap statement***
> sudo nano /etc/fstab
/swap.img   none    swap    sw    0   0
```

## nodeos and snapshot start

Ensure that the state database is at least 128GB for now, this will need to monitored as network available memory is constantly expanding.

Configure as below:

```
***Configure State Database Size***  
> cd ~/waxdata  

> nano config.ini
chain-state-db-size-mb = 131072
```

Start  `nodeos`  from a  [snapshot](https://medium.com/eosphere/wax-technical-how-to-2-db45a339e735)  available  [here](https://snapshots.eosphere.io/), as the mounted tmpfs is where  `nodeos`  expects the state folder will be located state will be built in virtual memory.

Start as below:

```
> cd ~/wax-blockchain/build/programs/nodeos

> ./nodeos --data-dir ~/waxdata --config-dir ~/waxdata --snapshot ~/waxdata/snapshots/snapshot.bin
```

Start up will take longer than usual as a new state file is created from the snapshot as well as even longer if the nodes physical RAM is exhausted and swap is used. In the case of 64GB of RAM this took about 45mins.

Subsequent restarts of nodeos won’t require a snapshot to start unless your node is rebooted or the tmpfs unmounted.

# Summary of the mapped_private memory strategy
The challenge with using tmpfs being temporary is all data is lost on reboot and nodeos will then require a restart via snapshot.

WAX v5.0 brings a new database map mode called mapped_private as an alternate to the default mapped mode. Instead of the constant writing to disk with mapped mode, mapped_private mode better utilises memory and reduces disk IO. It does this by mapping the chainbase database into memory using a private mapping, which means that any chainbase data accessed during execution remains in memory and is not eligible to be written back to the shared_memory.bin disk file.

If that sounds familiar, it is. mapped_private can be used as a replacement for the tmpfs strategy. This means no need to mount a tmpfs partition and as the in memory chainbase data is written to disk on exit, there is no need to restart using a snapshot on reboot.

Currently EOSphere have started utilising mapped_private mode in production replacing the tmpfs strategy in a number of nodes and the results and been positive. I expect more of our nodes will be converted over the coming months.

## mapped_private configuration
Configuration of mapped_private involves simply adding the below to the ```config.ini```

```
> nano config.ini
database-map-mode = mapped_private
```

In order to start nodeos ```mapped_private``` requires sufficient memory to cover the private mapping of the configured ```chain-state-db-size-mb =``` , physical RAM can be substituted with SWAP as with the tmpfs configuration example above allowing over subscription.

At the time of writing (March 2024) 64GB of Physical RAM and 128GB SWAP is sufficient to run a WAX Mainnet node.

## mapped_private operation
On the first nodeos ```mapped_private``` start up, the entire chainbase is uploaded to memory (RAM and SWAP) assuming you are starting with a snapshot and may take some time.

On nodeos exit the in memory chainbase is written to disk, this may take some time depending on how large it is.

Subsequent nodeos starts are faster not requiring a snapshot and as only data needed for execution is added to memory, displaying far less utilisation.

Of course as already mentioned the WAX Mainnet memory requirements are constantly expanding, regular monitoring of usage and performance will need to guide your hardware requirements and configuration.

---

These **WAX Developer Technical Guides** are created using source material from the [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home)

Be sure to ask any questions in the  [EOSphere Telegram](https://t.me/eosphere_io)
