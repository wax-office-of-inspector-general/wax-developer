---
title: Introduction to WAX Hyperion Full History
---

Part of the utility of a highly performing blockchain is the ability to query historical transactions of the network. Although by their very nature all blockchains have every transaction recorded in the chain, this record is typically not easily searchable or queryable.

WAX Software is no different in this regard and originally had a provision for queryable history called the history_plugin or V1 History. The history plugin was actually deprecated in 2018 which prompted alternatives to be built by the community.

The most popular Full History alternatives being EOS Canada’s  [Dfuse](https://github.com/dfuse-io)  now called  [Streaming Fast](https://www.streamingfast.io/)  and  [Hyperion](https://github.com/eosrio/hyperion-history-api)  from  [EOS RIO](https://eosrio.io/). A new option for a Lite History solution has also just been released by cc32d9 called  [Memento](https://github.com/cc32d9/eosio_memento)  that certainly looks interesting.

EOSphere have extensive production experience with providing Full History services using Hyperion on the WAX Mainnet and Testnet as well as other neworks. This quide will share this experience with you, broken into a series starting with an introduction to the software components and hardware requirements of a production ready WAX Hyperion Full History Solution.

[Learn more about EOS RIO Hyperion](https://eosrio.io/hyperion/)

![](https://miro.medium.com/v2/resize:fit:598/1*ATnQKunF5rVtPEsL-sP0JA.png)

# Introduction to WAX Hyperion Full History

_“Hyperion is a full history solution for indexing, storing and retrieving Antelope blockchain’s historical data.”_

Hyperion was built by EOS RIO to be an enterprise grade, performant and highly scalable Antelope History Solution. Their  [documentation](https://hyperion.docs.eosrio.io/)  is excellent and certainly a worthwhile starting point, this Technical How To series will cover some of their same content and add operational nuances from a practical stand point and our experience.

## Hyperion Software Components

The Hyperion Full History service is a collection of purpose built EOS RIO software and industry standard applications. The eight primary building blocks are the following:

**EOS RIO Hyperion Indexer and API**\
The  **Indexer**  processes data sourced from the WAX software State-History (SHIP) node and enables it to be indexed in Elasticsearch. The Hyperion Indexer also makes use of the Antelope Binary to JSON conversion functionality using ABI’s called  [abieos](https://github.com/EOSIO/abieos). Deserialisation performance is greatly improved by using abieos C++ code through EOS RIO’s own NPM package  [**node-abieos**](https://github.com/eosrio/node-abieos)  that provides a Node.js native binding.

The  **API**  is the front end for client queries, it responds to V2 or legacy V1 requests and finds data for these responses by directly querying the Elasticsearch cluster.

**WAX Software State-History (SHIP) Node**\
The State-History plugin is used by nodeos to capture historical data about the blockchain state (WAX Mainnet and Testnet in this case) and store this data in an externally readable flat file format. This readable file is accessed by the Hyperion Indexer. See  [WAX Technical How To #7](https://medium.com/eosphere/wax-technical-how-to-7-9ccc102efd9d)  for more details on State-History Nodes.

**RabbitMQ**\
[RabbitMQ](https://www.rabbitmq.com/)  is an open source message broker that is used by Hyperion to queue messages and transport data during the multiple stages of indexing to Elasticsearch.

**Redis**\
[Redis](https://redis.io/)  is an in-memory data structure store and is used by Hyperion as a predictive temporary database cache for HTTP API client queries and as a Indexer transaction cache.

**Node.js**\
The Hyperion indexer and API are  [Node.js](https://nodejs.org/en/)  applications and of course then use Node.js as an open-sourced back-end JavaScript runtime environment.

**PM2**\
[PM2](https://pm2.keymetrics.io/)  is a process manager for Node.js and used to launch and run the Hyperion Indexer and API.

**Elasticsearch Cluster**\
[Elasticsearch](https://www.elastic.co/)  is a search engine based on the Lucene library, it is used by Hyperion to store and retrieve all indexed data in highly performant schema-free JSON document format.

**Kibana**\
[Kibana](https://www.elastic.co/kibana/)  is a component of the Elastic Stack, a dashboard that enables visualising data and simplified operation and insight of an Elasticsearch cluster. All Hyperion Indexed data resides in the Elasticsearch database, Kibana gives a direct view of this data and the health of the Elasticsearch cluster.

## Hyperion Topology

The Topology of your Hyperion deployment depends on your history services requirement. Whether it’s Public/Private, WAX Mainnet/Testnet, Full/Partial History or even a private chain.

This article will discuss WAX Mainnet and WAX Testnet with Full History, in relation to what currently works in the EOSphere Public Service Offerings.

**WAX Mainnet**\
EOSphere originally started with a single server running all Hyperion Software Components except for the WAX State-History Node. However a challenge was discovered in relation to Elasticsearch JVM heap size when the WAX network utilisation grew and our API became well used.

JVM Heap size is the amount of memory allocated to the Java Virtual Machine of an Elasticsearch node, the more heap available the more cache memory available for indexing and search operations. If it’s too low Hyperion Indexing will be slow and search queries will be very latent. If the JVM heap size is more than 32GB (usually lower than this) on an Elasticsearch node, the threshold for compressed ordinary object pointers (OOP) will be exceeded and JVM will stop using compression. This will be exceptionally inefficient in regards to memory management and the node will consume vastly more memory.

The result of the above is the necessity to create a cluster of more than one Elasticsearch node, as the limit is per Elasticsearch node instance. Two nodes with JVM heap of 25GB results in 50GB of cluster wide heap available.

Other benefits to clustering more than one ElasticSearch node are of course more CPU cores for processing and more DISK for the ever expanding WAX Full History storage requirements. Elasticsearch stores indexed data in documents these documents are allocated to shards, these shards are automatically balanced between nodes in a cluster. Other than distributing the DISK utilisation across nodes, each shard is it’s own Lucene index and as such distributes CPU bandwidth utilisation across the cluster as well.

I recommend reading  [Elasticsearch: The Definitive Guide](https://www.elastic.co/guide/en/elasticsearch/guide/current/index.html)  as an excellent book to help you understand Elasticsearch concepts.

Taking the above into account our current recommended topology for WAX Mainnet is to logically or physically run the following nodes:

* **Load Balancer**
  * SSL Offload
  * Usage Policies
* **Hyperion Server 1**
  * Hyperion API  
  * Hyperion Indexer  
  * RabbitMQ  
  * Redis  
  * Node.js  
  * PM2  
  * Kibana
* **Hyperion Server 2**
  * Elasticsearch I (25GB JVM Heap)
* **Hyperion Server 3**
  * Elasticsearch II (25GB JVM Heap)
* **Hyperion Server 4**
  * Elasticsearch III (25GB JVM Heap)
* **WAX State-History**
  * Network sync’d nodeos with state_history plugin enabled

**WAX Testnet**/
The WAX Testnet is not a particularly busy environment to date. Running a full history service here is quite simple and an excellent place to start your journey into deploying and running Hyperion.

Our current recommended topology for WAX Testnet is to logically or physically run most of Hyperion on a single node:

* **Load Balancer** 
  * SSL Offload  
  * Usage Policies
* **Hyperion Server 1**  
  * Hyperion API  
  * Hyperion Indexer  
  * RabbitMQ  
  * Redis  
  * Node.js  
  * PM2  
  * Kibana  
  * Elasticsearch (8GB JVM Heap)
* **WAX State-History**  
  * Network sync’d nodeos with state_history plugin enabled

## Hyperion Hardware

Similar to Hyperion Topology, Hardware choice will vary on your history services requirement.

The recommendations below are for WAX Mainnet and WAX Testnet with Full History, in relation to what currently works in the EOSphere Public Service Offerings.

**WAX Mainnet**

* **Load Balancer** 
  * Dealers choice, however  [HAProxy](https://medium.com/eosphere/wax-technical-how-to-5-14671fcc7122)  is a great option  
  * High Speed Internet 100Mb/s+
* **Hyperion Server 1**  
   * Modern CPU, 3Ghz+, 8 Cores+  
   * 64GB RAM  
   * 128GB DISK  _(Enterprise Grade SSD/NVMe)_  
   * 1Gb/s+ LAN
* **Hyperion Server 2–4**  
   * Modern CPU, 3Ghz+, 8 Cores+  
   * 64GB RAM  
   * Enterprise Grade SSD/NVMe  
    _The current (April 2023) Elasticsearch Database is 22TB, at the moment I suggest provisioning 35TB+ across the cluster for Full History service longevity_  
   * 1Gb/s+ LAN
* **WAX State-History**  
   * Modern CPU, 4Ghz+, 4 Cores  
   * 128GB RAM  
   * 256GB DISK 1  _(Enterprise Grade SSD/NVMe)_  
   * 6TB DISK 2  _(SAS or SATA are OK)_

**WAX Testnet**

* **Load Balancer**  
  * Dealers choice, however  [HAProxy](https://medium.com/eosphere/wax-technical-how-to-5-14671fcc7122)  is a great option  
  * Internet 1Mb/s+
* **Hyperion Server 1**  
  * Modern CPU, 3Ghz+, 8 Cores+  
  * 16GB RAM  
  * 1TB DISK  _(Enterprise Grade SSD/NVMe)_  
  * 1Gb/s+ LAN
* **WAX State-History**  
  * Modern CPU, 4Ghz+, 4 Cores  
  * 8GB RAM  
  * 64GB DISK 1  _(Enterprise Grade SSD/NVMe)_  
  * 1TB DISK 2  _(SAS or SATA are OK)_

With that introduction you should now have an informed starting point for your Hyperion services journey.

---

These **WAX Developer Technical Guides** are created using source material from the [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home)

Be sure to ask any questions in the  [EOSphere Telegram](https://t.me/eosphere_io)
