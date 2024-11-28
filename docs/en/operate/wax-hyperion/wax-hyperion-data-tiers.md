Providing Full History for the WAX Mainnet is a heavy infrastructure undertaking. CPU, Memory and in particular Storage resources are needed in abundance. Any methods to optimise or even ease this challenge are always welcome.

In monitoring usage of a production WAX Hyperion Full History deployment, it can be observed that most queries and activity occur on the latest blocks. This means that expensive enterprise resources may have been allocated and utilised for older block data that might very seldom be accessed.

Elasticsearch has a functionality called Index Lifecycle Management (ILM) where policies may be applied to your indices that can meet your resiliency, performance and data retention requirements. In particular  **Data Tiers** provide a cluster wide mechanism to move specific indices to different nodes that are configured with a particular role. This means that one or more of the Elasticsearch nodes used for your WAX Hyperion Full History may be built with cheaper Storage, less RAM and slower CPU .. and then configured for a lesser tier that is allocated for older not frequently accessed indices.

This next sub-article in the series will cover the configuration of a warm data tier in an Elasticsearch cluster used by Hyperion. This data tier will then be allocated older indices as a method to save on expensive enterprise hardware resources.

EOS RIO have an excellent  [Hyperion Documentation Repository](https://hyperion.docs.eosrio.io/)  including details on how to run their Hyperion Full History product, however this article will expand on their current documentation.

Once again this Technical How To series will cover some of EOS RIO’s same content and will add operational nuances from a practical stand point and our experience.

[Learn more about EOS RIO Hyperion](https://eosrio.io/hyperion/)

![image](https://github.com/user-attachments/assets/2e4b17c5-8d89-49f1-bf97-76e39748ab91)

# Using Data Tiers with WAX Hyperion Full History

**_Please note:_** _Originally I tried to create a node with 6 spinning disks in a ZFS vdev stripe array and then allocated older blocks and deltas to this node. The issue I found was that due to the random read requirements of Elasticsearch any queries of this data were unreasonably slow, 10’s of seconds vs milliseconds when using SSD’s. I also found that any wildcard query of Hyperion Data would go out cluster wide including to the spinning disk node which then slowed the response for even recent data._

**_The EOS RIO team are working on code than will intelligently allocate queries to the appropriate tiered nodes in the Elasticsearch cluster. I will update this guide when this is released._**

This guide will go through the Data Tiering configuration when adding a new node to an existing Elasticsearch cluster and then moving older indices over to this new node.

This new node will be configured to join a Warm Data tier. This node will utilise cheaper consumer based SSD’s as there won’t be many writes effecting endurance, slower older gen CPU as there won’t be as many queries and less RAM as not as much cache will be used.

Please see our previous guide  [Clustering Elasticsearch for WAX Hyperion Full History](https://developer.wax.io/operate/wax-hyperion/wax-clustering-elasticsearch-for-hyperion.html)  for details on Elasticsearch clustering.

# Elasticsearch Data Tier Node Configuration

By default Hyperion indexes all data into Elasticsearch using the  `data_content`  tier, the existing cluster nodes are only configured with this tier  `node.roles: [ data ]`. The new node will be configured to use the  `data_warm`  tier as below.

```
> sudo nano /etc/elasticsearch/elasticsearch.yml  
  
node.roles: [ data_warm ]  
  
> sudo systemctl start elasticsearch.service
```

As all the existing Hyperion indices are configured to index to  `data_content`  when this new node starts up it will not be allocated data.

# Assign Indices to the Data Warm Tier

I have found viewing and assigning indices to specific data tiers simplest by using the Kibana GUI, however all actions may be done via the CLI. Both methods are detailed below:

## View Indices

The indices we are most interested in are the  `wax-action`  and  `wax-delta`  indices, each of these indices represents the data from 10 Million blocks on the WAX network.  `wax-action-v1–000001`  being block 1–10,000,000 and  `wax-action-v1–000002`  being block 10,000.001–20,000,000 and so on.

```
> GET /_cat/indices/wax*
```

![image](https://github.com/user-attachments/assets/e5391d4a-0129-4348-a4a4-d96a04189cc1)

The specific settings below show the existing data tier, as expected  `data_content`  by default.

```
> GET /wax-action-v1-000023/_settings
```

![image](https://github.com/user-attachments/assets/684b0011-bc93-40fa-a772-80f7f637622f)

## Set Index Tier

Set the desired older index to  `data_warm`.

```
> PUT /wax-action-v1-000023/_settings  
{  
  "index.routing.allocation.include._tier_preference": "data_warm"  
}
```

![image](https://github.com/user-attachments/assets/a57ceafd-8036-4853-935d-10f00622fb01)

## Observe Index Allocation

The cluster will then move the shards of the desired index to the  `data_warm`  tiered node or nodes. Observe index allocation via the cli or via disk usage in the GUI.

```
> GET _cat/shards/wax-action-v1-000023?v&s=index&h=index,node  
  
wax-action-v1-000023 wax-es-node-2 -> 10.125.0.90 _CmnnuMbQRqSEwX7rsSeaA wax-es-node-4  
wax-action-v1-000023 wax-es-node-2 -> 10.125.0.90 _CmnnuMbQRqSEwX7rsSeaA wax-es-node-4  
wax-action-v1-000023 wax-es-node-1 -> 10.125.0.89 fQeNr0UkSXuAnofq-rceoA wax-es-node-3  
wax-action-v1-000023 wax-es-node-1 -> 10.125.0.89 fQeNr0UkSXuAnofq-rceoA wax-es-node-3
```

![image](https://github.com/user-attachments/assets/a50ee046-b3a7-4956-882f-776b4d4e409b)

The move process may take some time and appears to use very little resources, which is obviously great for an in production cluster.

---

These **WAX Developer Technical Guides** are created using source material from the [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home)

Be sure to ask any questions in the  [EOSphere Telegram](https://t.me/eosphere_io)
