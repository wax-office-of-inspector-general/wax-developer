---
title: Running WAX Hyperion Full History
nav_order: 159
layout: default
parent: WAX Infrastructure Guides
lang-ref: Running WAX Hyperion Full History
lang: en
---

Following on from our Configure WAX Hyperion Software Components Guide this next guide in the series will walk through actually running a WAX Hyperion Full History Service on WAX.

EOS RIO have an excellent  [Hyperion Documentation Repository](https://hyperion.docs.eosrio.io/) including details on how to run their Hyperion Full History product, however in this article the manual process for running Hyperion using Elasticsearch 8.x and associated software components will be covered.

Once again this Technical How To series will cover some of EOS RIO’s same content and will add operational nuances from a practical stand point and our experience.

[Learn more about EOS RIO Hyperion](https://eosrio.io/hyperion/)

![](https://miro.medium.com/v2/resize:fit:598/0*K8f_xpc-l5NSUL7H.png)

# Running WAX Hyperion Full History

There are three  **Indexing**  phases and an  **API** enable phase when preparing your WAX Hyperion Full History service for production.

**ABI Scan Phase:**

In this  **abi_scan_mode**  phase Hyperion indexes all contract Application Binary Interfaces (ABI)’s. This happens across the entire blockchain so that the indexer is aware of what ABI to use for deserialisation at any one time in the life of the onchain contract.

**Indexing Phase:**

This phase actually indexes data into Elasticsearch, however to ensure complete data is systematically ingested  **live reader is disabled**  and blocks are configured to be  **ingested in batches**.

**Indexing Catchup Phase:**

This phase transitions  the Indexer to an operational state,  **live reader is enabled,** block ingestion is  **configured to infinity** and **caching is enabled**.

**API Enable Phase**

This phase enables Hyperion  **API queries**.

In the previous Configure WAX Hyperion Software Components Guide, the example configuration left the guide ready to start the ABI Scan Phase, which is where this guide picks up.

I recommend running the Hyperion PM2 commands using  `screen`  in two windows for PM2 logs and Commands, this gives good visibility of the phases.

```
#Create a new screen session
> screen -US Hyperion

#Display pm2 logging
> pm2 logs

#Create a new screen
crtl-a+c

#Check pm2 status
> pm2 status

#Go forward a screen
ctrl-a+n

#Go back a wscreen
ctrl-a+p

#Disconnect screen session
ctrl-a+d

#Reconnect screen session
> screen -r Hyperion
```

## Running the ABI Scan Phase

Below is the initial configuration used for  `wax.config.json`:

```

> cd ~/hyperion-history-api/chains

> cp example.config.json wax.config.json

> nano wax.config.json

{
  "api": {
    "enabled": true,
    "pm2_scaling": 1,
    "node_max_old_space_size": 1024,
    "chain_name": "WAX Testnet",
    "server_addr": "<IP ADDRESS FOR SERVER API>",
    "server_port": 7000,
    "server_name": "<YOUR PUBLIC SERVER URL>",
    "provider_name": "<YOUR GUILD NAME>",
    "provider_url": "<YOUR ORG URL>",
    "chain_api": "",
    "push_api": "",
    "chain_logo_url": "<CHAIN LOGO.jpg URL>",
    "enable_caching": false, #DISABLED FOR BULK INDEXING#
    "cache_life": 1,
    "limits": {
      "get_actions": 1000,
      "get_voters": 100,
      "get_links": 1000,
      "get_deltas": 1000,
      "get_trx_actions": 200
    },
    "access_log": false,
    "chain_api_error_log": false,
    "custom_core_token": "",
    "enable_export_action": false,
    "disable_rate_limit": false,
    "rate_limit_rpm": 1000,
    "rate_limit_allow": [],
    "disable_tx_cache": true, #DISABLED FOR BULK INDEXING#
    "tx_cache_expiration_sec": 3600,
    "v1_chain_cache": [
      {
        "path": "get_block",
        "ttl": 3000
      },
      {
        "path": "get_info",
        "ttl": 500
      }
    ]
  },
  "indexer": {
    "enabled": true,
    "node_max_old_space_size": 4096,
    "start_on": 0,
    "stop_on": 0,
    "rewrite": false,
    "purge_queues": false,
    "live_reader": false, #DISABLED FOR PHASE 1 INDEXING#
    "live_only_mode": false,
    "abi_scan_mode": true, #SET TO ABI_SCAN_MODE#
    "fetch_block": true,
    "fetch_traces": true,
    "disable_reading": false,
    "disable_indexing": false,
    "process_deltas": true,
    "disable_delta_rm": true
  },
  "settings": {
    "preview": false,
    "chain": "wax", #SET CHAINS ID#
    "eosio_alias": "eosio",
    "parser": "1.8", #SET TO 1.8 AS 2.1 IS BEING RETIRED#
    "auto_stop": 0,
    "index_version": "v1",
    "debug": false,
    "bp_logs": false,
    "bp_monitoring": false,
    "ipc_debug_rate": 60000,
    "allow_custom_abi": false,
    "rate_monitoring": true,
    "max_ws_payload_mb": 256,
    "ds_profiling": false,
    "auto_mode_switch": false,
    "hot_warm_policy": false,
    "custom_policy": "",
    "bypass_index_map": true, #SET TO TRUE FOR ES 8.x#
    "index_partition_size": 10000000,
    "es_replicas": 0
  },
  "blacklists": {
    "actions": [],
    "deltas": []
  },
  "whitelists": {
    "actions": [],
    "deltas": [],
    "max_depth": 10,
    "root_only": false
  },
  "scaling": {
    "readers": 2, #INCREASE READERS#
    "ds_queues": 1,
    "ds_threads": 1,
    "ds_pool_size": 1,
    "indexing_queues": 1,
    "ad_idx_queues": 1,
    "dyn_idx_queues": 1,
    "max_autoscale": 4,
    "batch_size": 5000,
    "resume_trigger": 5000,
    "auto_scale_trigger": 20000,
    "block_queue_limit": 10000,
    "max_queue_limit": 100000,
    "routing_mode": "round_robin",
    "polling_interval": 10000
  },
  "features": {
    "streaming": {
      "enable": false,
      "traces": false,
      "deltas": false
    },
    "tables": {
      "proposals": true,
      "accounts": true,
      "voters": true
    },
    "index_deltas": true,
    "index_transfer_memo": true, #SET TO TRUE#
    "index_all_deltas": true,
    "deferred_trx": false,
    "failed_trx": false,
    "resource_limits": false,
    "resource_usage": false
  },
  "prefetch": {
    "read": 50,
    "block": 100,
    "index": 500
  },
  "plugins": {}
}
```
  
It is highly recommended that the SHIP node is connected on LAN.

Initiate the ABI Scan as below:

```
> cd ~/hyperion-history-api

> pm2 start --only wax-indexer --update-env
```

Check that the ABI Scan has started and all software components are reachable and working as intended by observing the pm2 logs screen. Remediate any connectivity or configuration issues.

Below is the legend for the Indexer logs output:

```
W (Workers) - Number of workers  
R (Read) - Blocks read from the SHIP node and pushed to the queue  
C (Consumed) - Blocks consumed from the blocks queue  
A (Actions) - Actions being read from processed blocks  
D (Deserialized) - Actions being deserialised  
I (Indexed): Documents being indexed in Elasticsearch
```

This phase may take many hours depending on your hardware and network connectivity, when finished the indexer will stop and  `ABI SCAN COMPLETE`  will be displayed. You may now confidently move onto the Indexing Phase.

## Running the Indexing Phase

In this phase the  `wax.config.json`  needs to be amended to disable abi_scan_mode and block batches to be ingested configured. My recommendation is to start with batches of 5000000 to ensure all is being ingested smoothly.

Make sure the following is configured or amended in the  `wax.config.json`:

```
"enable_caching": false, #DISABLED FOR BULK INDEXING#
"disable_tx_cache": true, #DISABLED FOR BULK INDEXING#
    
"start_on": 0,
"stop_on": 5000000, #FIRST BLOCK INDEX BATCH#
"live_reader": false, #DISABLED FOR BULK INDEXING#
"abi_scan_mode": false, #SET FOR INDEXING PHASE#
"scaling": { #CONSERVATIVE SETTINGS#
    "readers": 2,
    "ds_queues": 1,
    "ds_threads": 2,
    "ds_pool_size": 2,
    "indexing_queues": 1,
    "ad_idx_queues": 1,
    "dyn_idx_queues": 1,
    "max_autoscale": 4,
```

Start the Indexer as below:

```
> cd ~/hyperion-history-api

> pm2 start --only wax-indexer --update-env
```

Observe the pm2 logs to ensure documents are being indexed. Queues can be monitored in the RabbitMQ Web User Interface.

```
http://<SERVER IP ADDRESS>:15672
```

![](https://miro.medium.com/v2/resize:fit:700/1*xmEJMSw1V6xR4ul2JJxBpg.png)

When the first 5000000 blocks are successfully indexed the indexer will stop and a message will be displayed in the pm2 logs advising  `BLOCK RANGE COMPLETED`.

The indexer block range can now be adjusted in the  `wax.config.json`  for the next batch and then the indexer can be started as before. Depending on how your deployment has managed you may want to increase or decrease this range.

```
"start_on": 5000001,#CONTINUE FROM FIRST BATCH#  
"stop_on": 1100000, #SECOND BLOCK INDEX BATCH#
```

Continue this process until you are almost at the current chain headblock.

Bulk indexing can be very heavy on hardware resources and can take days. You will notice that quite conservative settings have been used for the index scaling in this example. My advice is that less can often be more, start with these example settings and adjust incrementally if required by observing pm2 logs and the RabbitMQ Web UI.

## Running the Indexing Catchup Phase

When indexing has been completed to as close to the current chain headblock as possible, you can transition to a normal mode of index operation. This phase will enable the live reader, normal block ingestion and caching.

Make sure the following is configured or amended in the  `wax.config.json`  :

```
"enable_caching": true,
"disable_tx_cache": false,
    
"start_on": 0,
"stop_on": 0,
"live_reader": true,
```

Start the Indexer as below:

```
> cd ~/hyperion-history-api

> pm2 start --only wax-indexer --update-env
```

If your Hyperion indexer was near the headblock this phase shouldn’t take long, observe the pm2 logs to check when you have successfully caught up and then move on to starting the API.

If for any reason you need to stop the indexer use the  `pm2 trigger`  option to ensure the current queues are completed before stopping:

```
> pm2 trigger wax-indexer stop
```

## **The API Enable Phase**

This final phase is running the Hyperion API which has already been configured in this example’s previous configuration files:

```
"api": {
    "enabled": true,
    "pm2_scaling": 1,
    "node_max_old_space_size": 1024,
    "chain_name": "WAX Testnet",
    "server_addr": "<IP ADDRESS FOR SERVER API>",
    "server_port": 7000,
    "server_name": "<YOUR PUBLIC SERVER URL>",
    "provider_name": "<YOUR GUILD NAME>",
    "provider_url": "<YOUR ORG URL>",
    "chain_api": "",
    "push_api": "",
    "chain_logo_url": "<CHAIN LOGO.jpg URL>",
    "enable_caching": true,
    "cache_life": 1,
    "limits": {
      "get_actions": 1000,
      "get_voters": 100,
      "get_links": 1000,
      "get_deltas": 1000,
      "get_trx_actions": 200
```

Start the Hyperion API as below, allowing queries on port :7000

```
> pm2 start --only wax-api --update-env
```

Observe the pm2 logs to check for successful API startup, the API can then be queried for it’s health info leaving you with a sense of satisfaction that all components are operating as expected

In particular make sure  `last_indexed_block`  is equal to  `total_indexed_blocks`  showing that we have indexed all blocks to the current headblock.

```
> curl http://<SERVER IP ADDRESS>:7000/v2/health

{“version”:”3.3.5",”version_hash”:”62ee9b2ac739aabe3bdf718f9c834f07a83cd169",”host”:”wax-testnet.eosphere.io”,”health”:[{“service”:”RabbitMq”,”status”:”OK”,”time”:1660017560224},{“service”:”NodeosRPC”,”status”:”OK”,”service_data”:{“head_block_num”:168272890,”head_block_time”:”2022–08–09T03:59:20.000",”time_offset”:226,”last_irreversible_block”:168272561,”chain_id”:”f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12"},”time”:1660017560226},{“service”:”Elasticsearch”,”status”:”OK”,”service_data”:{“last_indexed_block”:168272890,”total_indexed_blocks”:168272890,”active_shards”:”100.0%”},”time”:1660017560230}],”features”:{“streaming”:{“enable”:false,”traces”:false,”deltas”:false},”tables”:{“proposals”:true,”accounts”:true,”voters”:true},”index_deltas”:true,”index_transfer_memo”:true,”index_all_deltas”:true,”deferred_trx”:false,”failed_trx”:false,”resource_limits”:false,”resource_usage”:false},”query_time_ms”:9.828}
```
Congratulations you have now successfully built, configured and are running a WAX Hyperion Full History Service, ready to be made publicly available from behind a SSL offloading Load Balancer such as HAProxy.

---

These **WAX Developer Technical Guides** are created using source material from the [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home)

Be sure to ask any questions in the  [EOSphere Telegram](https://t.me/eosphere_io)
