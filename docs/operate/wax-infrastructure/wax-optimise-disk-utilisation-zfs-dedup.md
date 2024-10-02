Running WAX Mainnet production nodes can be very resource intensive. Considering that many operators endeavour to provide Full nodes with a complete history of blocks, storage requirements can be a challenge as they are constantly expanding.

This guide will walk through how to optimise disk utilisation utilising ZFS Deduplication across multiple WAX nodes.

# Optimise Disk Utilisation with ZFS Deduplication

For the most part WAX software is weighted to only use a single thread and won’t necessarily use all resources available. If your operational hardware has sufficient CPU, RAM and Storage it may be quite economical to run multiple WAX nodes on a single physical server. This can be accomplished using Virtual Machines, Containers or pure Baremetal with different service TCP ports.

With multiple nodes running on the same server the first challenge is typically the amount of disk space required as all data is required to be duplicated. The blocks data is currently 4TB and state-history data is currently 11TB (October 2024), doubling this on a single server would require a substantial amount of disk.

Thankfully this can be mitigated using ZFS Deduplication.

## Zettabyte File System (ZFS)

ZFS ([Zettabyte File System](https://docs.oracle.com/cd/E19253-01/819-5461/index.html)) is a highly scalable and advanced file system that was originally developed by Sun Microsystems (now owned by Oracle Corporation) for the Solaris operating system. It is designed to address the limitations of traditional file systems and provide features like data integrity, data protection, and high storage capacity.

Due to its advanced features and robustness, ZFS has gained popularity in various environments, including data centres, file servers, and storage appliances. It has also been ported to other operating systems such as Linux and FreeBSD, providing a versatile and reliable storage solution.

## ZFS Deduplication

The deduplication feature offered by ZFS allows for the elimination of redundant data within ZFS pools/filesystems. In our case we have a considerable amount of duplicate data stored in the blocks and state-history folders, only a single copy of these files will be retained. The remaining instances will function as references to that original data copy. This approach significantly conserves disk space within your configured physical server’s ZFS pool.

From a technical perspective, when you copy, move, or create new data within your ZFS pool/filesystem, ZFS divides it into smaller chunks and compares these chunks with existing ones stored. By identifying matches between the chunks, even if only parts of the data correspond, the deduplication feature effectively reduces the disk space consumption.

In our use case the disk space consumption of the blocks and state-history folders with be halved when running two nodes on a single server.

## Configuration

This example will cover two WAX node instances on single baremetal server and similar to the  [Set Up a Solid WAX Mainnet Node Guide](https://developer.wax.io/operate/wax-infrastructure/wax-mainnet-node.html)  uses  **2 Discrete Disk Systems** on this server  in order to balance disk IO.

**Disk 1** is the high speed enterprise grade SSD or NVMe and will be the OS disk used for the WAX software, all config and the state files. Each node instance is required to have it’s own state files, typically it’s easier to place all files for each node instance in a separate directory and run with different service TCP ports.

**Disk 2**  is a SAS disk array of 4 x 4TB drives (please adjust disk size to an appropriate capacity for the current chain conditions) that will host a separate  `\blocks`  directory for each node instance.

Disk 2 will run the  **ZFS File System** which will give us three main benefits. ZFS will enable us to use  **LZ4 compression** for space savings, disk IO will be improved with  **Adaptive Replacement Cache**  (ARC) and disk utilisation will be optimised with  **Deduplication**.

Implement ZFS on Disk 2 with the below configuration:

```
#Install ZFS  
$ sudo apt-get install zfsutils-linux  
  
#Locate the Disk 2 device names  
$ lsblk  
  
#Create ZFS Pool called "datavolume" on located devices  
$ sudo zpool create -f -o ashift=12 datavolume /dev/sde /dev/sdf /dev/sdg /dev/sdh  
  
#Enable LZ4 compression  
$ sudo zfs set compression=lz4 datavolume  
  
#Disable ZFS access time Updates  
$ sudo zfs set atime=off datavolume  
  
#Set ZFS Extended Attributes to System Attibute for Performance  
$ sudo zfs set xattr=sa datavolume  
  
#Set ARC to only cache metadata  
$ sudo zfs set primarycache=all datavolume  
  
#Enable ZFS Deduplication  
$ sudo zfs set dedup=on datavolume  
  
#Set the mountpoint location to your preferred location  
$ sudo zfs set mountpoint=/home/eosphere/datavolume datavolume  
```

## Verification

Now that a 16TB pool has been created, copy or sync your  `/blocks`  over onto the  `/datavolume`  mountpoint being sure to use two separate folders for each node instance such as  `/datavolume/node1blocks`  and  `datavolume/node2blocks`  obviously referenced correctly in the nodeos  `config.ini`. ZFS Dedup will recognise the data duplication across the two directories in the datavolume pool.

**Check LZ4 Compression:**

```
$ zfs get ratio  
  
NAME                             PROPERTY       VALUE  SOURCE  
datavolume                       compressratio  1.25x  -
```

ZFS LZ4 compression works as expected with a healthy 1.25x on a nodeos  `blocks.log`.

**Check Deduplication Performance:**

```
$ zpool list  
  
NAME        SIZE   ALLOC  FREE   CKPOINT   EXPANDSZ    FRAG    CAP  DEDUP    HEALTH  ALTROOT  
datavolume  14.5T  2.57T  11.9T        -         -     5%      17%  2.00x    ONLINE  -
```

Deduplication works as advertised essentially deduplicating both node instances of 2.57TB LZ4 compressed blocks data ->  **DEDUP 2.00x**

**Check Deduplication Memory Utilisation:**

```
$ zpool status -D datavolume  
  
  pool: datavolume  
 state: ONLINE  
  scan: scrub repaired 0B in 00:02:40 with 0 errors on Sun May 14 00:26:43 2023  
config:  
  
 NAME               STATE     READ WRITE CKSUM  
          datavolume       ONLINE       0     0     0  
          sde              ONLINE       0     0     0  
          sdf              ONLINE       0     0     0  
          sdg              ONLINE       0     0     0  
          sdh              ONLINE       0     0     0  
errors: No known data errors  
  
 dedup: DDT entries 25353378, size 1.06K on disk, 350B in core  
  
bucket              allocated                       referenced            
______   ______________________________   ______________________________  
refcnt   blocks   LSIZE   PSIZE   DSIZE   blocks   LSIZE   PSIZE   DSIZE  
------   ------   -----   -----   -----   ------   -----   -----   -----  
     1    2.47K    317M   24.7M   24.7M    2.47K    317M   24.7M   24.7M  
     2    24.2M   3.02T   2.45T   2.45T    48.3M   6.04T   4.91T   4.91T  
     4    6.75K    864M    544M    544M    27.0K   3.38G   2.13G   2.13G  
     8        1    128K      4K      4K       10   1.25M     40K     40K  
    16        5    640K     20K     20K      136     17M    544K    544K  
    32       24      3M    924K    924K    1.01K    129M   38.8M   38.8M  
    2K        2    256K      8K      8K    5.82K    745M   23.3M   23.3M  
 Total    24.2M   3.02T   2.45T   2.45T    48.4M   6.05T   4.91T   4.91T
```

Memory utilisation can be ascertained through the equation below:

DDT entries x Core / 1024²

25353378*350 / (1024²) =  **8462MB RAM Used**

**Check the disk IO of the ZFS pool:**

```
$ zpool iostat  
              capacity     operations     bandwidth   
pool        alloc   free   read  write   read  write  
----------  -----  -----  -----  -----  -----  -----  
datavolume  2.57T  11.9T      9     27  1.39M  2.39M  
----------  -----  -----  -----  -----  -----  -----
```

The output above is both nodes running and in-sync with the network.

While researching and testing for this guide there appears to be quite a bit of misinformation in regards ZFS Deduplication out there, Dedup is often disregarded due to being CPU, RAM and Disk IO intensive.

In our experience it works very well to alleviate unnecessary disk usage of the  `/blocks`  directory especially in Virtual Machine environments on larger servers. The overhead appears to be quite manageable with the largest being RAM which is around 1GB / Disk TB, CPU and Disk IO were unaffected.

It is also possible to use  [ZFS cloning](https://docs.oracle.com/cd/E19253-01/819-5461/gbcxz/index.html)  to essentially clone data without duplicating it on the disk. ZFS cloning is however a manual process unless scripted and requires a re-clone to be run every so often to reclaim duplicate data.

---

These **WAX Developer Technical Guides** are created using source material from the [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home)

Be sure to ask any questions in the  [EOSphere Telegram](https://t.me/eosphere_io)
