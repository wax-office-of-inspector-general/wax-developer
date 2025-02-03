---
title: Clustering Elasticsearch for WAX Hyperion Full History
---

Running Hyperion Full History on the WAX Mainnet is very resource intensive with DISK and CPU requirements in particular constantly increasing .

Thankfully Elasticsearch can simply be scaled by clustering across multiple nodes to expand the available DISK and balance CPU utilisation.

This next sub-article in the series will walk through the configuration and enablement of Elasticsearch Clustering in a WAX Hyperion Full History deployment.

EOS RIO have an excellent  [Hyperion Documentation Repository](https://hyperion.docs.eosrio.io/)  including details on how to configure their Hyperion Full History product, however this article expands on their documentation specifically in relation to Elasticsearch 8.x

Once again this Technical How To series may cover some of EOS RIO’s same content and will add operational nuances from a practical stand point and our experience.

[Learn more about EOS RIO Hyperion](https://eosrio.io/hyperion/)

![](https://miro.medium.com/v2/resize:fit:598/0*SMEjl3XTe2BtL1W3.png)

_This article has been updated to reflect the current Hyperion deployment in December 2024._

## Clustering Elasticsearch for WAX Hyperion Full History

As discussed in the Introduction to WAX Hyperion Full History, other than mitigating the OOP JVM Heap Size challenge, the benefits to clustering more than one ElasticSearch node are more CPU cores for processing and more DISK for the ever expanding WAX Full History storage requirements.

Elasticsearch stores indexed data in documents these documents are allocated to shards, these shards are automatically balanced between nodes in a cluster. Other than distributing the DISK utilisation across nodes, each shard is it’s own Lucene index and as such distributes CPU bandwidth utilisation across the cluster as well.

In this guide a cluster of Three Elasticsearch 8.x nodes will be configured, please follow the **Build WAX Hyperion Software Components** guide for instructions on how to build Elasticsearch 8.x and the **Configure WAX Hyperion Software Components** guide for instructions on how to apply the stand alone configuration for Elasticsearch 8.x. This guide will cover the clustering configuration side of Elasticsearch.

In Clustering Elasticsearch for WAX Hyperion Full History there are no changes to any of the previously discussed configurations or software components other than for Elasticsearch.

## Cluster Configuration

Node-1 will be configured as a single eligible master for this example. This node will be used to generate enrolment tokens for the other nodes to join the cluster.

_The master node is responsible for lightweight cluster-wide actions such as creating or deleting an index, tracking which nodes are part of the cluster, and deciding which shards to allocate to which nodes._

Configure Node-1 as below:

**Node-1 (Master) | 10.0.0.1**

```
> sudo nano /etc/elasticsearch/elasticsearch.yml

cluster.name: wax-hyperion-cluster
node.name: wax-es-node-1
node.roles: [ data, ingest, remote_cluster_client, master ]
network.host: 10.0.0.1 
discovery.seed_hosts: ["10.0.0.1:9300", "10.0.0.2:9300", "10.0.0.3:9300"]
cluster.initial_master_nodes: ["10.0.0.1"]
transport.host: 0.0.0.0

> sudo systemctl restart elasticsearch.service
```


Generate a new enrolment token on  **Node-1**  for new nodes to join the cluster:

```
> sudo /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s node

eyJ2ZXIiOiI4LjIuMCIsImFkciI6WyIxMC4wLjAuODY6OTIwMCJdLCJmZ3IiOiI0MjUzMWY5MmYwZjBlOGI0MDRhOWEzZWEwMDFiMzJkOWYwYjIxZjI3YjNlODI1MGVmZmQwNzg0N2RhM2RlNjEwIiwia2V5IjoicFRtNXY0TUJWSXFRRUFCLW1YR0o6TFNsMUk5dHdTX0syLUhwMUdMbjFfUSJ9
```

On both  **Node-2**  and  **Node-3**  with the Elasticsearch Service stopped install the enrolment token:

**Note:**  It is important that the  `elasticsearch.yml`on additional nodes is left unconfigured until after the enrolment.  
Additionally if you have disabled  `xpack.security.http`on the master node you will need to enable it temporarily for enrolment.

```
> sudo /usr/share/elasticsearch/bin/elasticsearch-reconfigure-node --enrollment-token <GENERATED TOKEN FROM NODE-1>

This node will be reconfigured to join an existing cluster, using the enrollment token that you provided.
This operation will overwrite the existing configuration. Specifically: 
  - Security auto configuration will be removed from elasticsearch.yml
  - The [certs] config directory will be removed
  - Security auto configuration related secure settings will be removed from the elasticsearch.keystore
Do you want to continue with the reconfiguration process [y/N]y
```

The Elasticsearch xpack security configuration should automagically be generated and configured in all  `elasticsearch.yml`  files.

Then configure Node-2 and Node-3 as below:

**Node-2 | 10.0.0.2**

```
> sudo nano /etc/elasticsearch/elasticsearch.yml

cluster.name: wax-hyperion-cluster
node.name: wax-es-node-2
node.roles: [ data, ingest, remote_cluster_client ]
network.host: 10.0.0.2
cluster.initial_master_nodes: ["10.0.0.1"]
discovery.seed_hosts: ["10.0.0.1:9300", "10.0.0.2:9300", "10.0.0.3:9300"]
transport.host: 0.0.0.0

> sudo systemctl restart elasticsearch.service
```

**Node-3 | 10.0.0.3**

```
> sudo nano /etc/elasticsearch/elasticsearch.yml

cluster.name: wax-hyperion-cluster
node.name: wax-es-node-3
node.roles: [ data, ingest, remote_cluster_client ]
network.host: 10.0.0.3
cluster.initial_master_nodes: ["10.0.0.1"]
discovery.seed_hosts: ["10.0.0.1:9300", "10.0.0.2:9300", "10.0.0.3:9300"]
transport.host: 0.0.0.0

> sudo systemctl restart elasticsearch.service
```

The Elasticsearch cluster will now be formed , if Node-1 had existing data the shards will automatically be balanced across the cluster without any replicas.

## Operation

It has been our experience that Hyperion works well having the Master Node configured as the Elasticsearch resource in  `connections.json`  .

You can verify the cluster operation from the Kibana GUI under Management -> Stack Monitoring

![](https://miro.medium.com/v2/resize:fit:700/1*MWeuTdnREi7ubwbsPHKvWg.png)

EOSphere WAX Mainnet Cluster Example

Debug the cluster formation if necessary:

```
> sudo tail /var/log/elasticsearch/wax-hyperion-cluster.log -f
```

Queries to verify the cluster operation:

```
> curl --user elastic:<PASSWORD> -XGET 'http://10.0.0.1:9200/_cluster/stats?pretty' | more

> curl --user elastic:<PASSWORD> -XGET 'http://10.0.0.1:9200/_cluster/health?pretty' | more

> curl --user elastic:<PASSWORD> -XGET 'http://10.0.0.1:9200/_cluster/state?pretty' | more
```
Be sure to ask any questions in the  [EOSphere Telegram](https://t.me/eosphere_io)

---

These **WAX Developer Technical Guides** are created using source material from the [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home)

Be sure to ask any questions in the  [EOSphere Telegram](https://t.me/eosphere_io)
