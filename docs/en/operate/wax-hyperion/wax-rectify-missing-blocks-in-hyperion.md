---
title: Rectify Missing Blocks in WAX Hyperion Full History
---

Initially indexing the complete WAX Mainnet from genesis will take time and it can be quite heavy on hardware resources causing pauses or stops in indexing, furthermore if you have taken our suggestion on batching block ranges to index you may encounter a scenario where you have gaps in your full history indexed blocks set.  
This next sub-article in the series will go through the process of identifying gaps in your full history blocks set and how to *manually* correct them.

EOS RIO have an excellent  [Hyperion Documentation Repository](https://hyperion.docs.eosrio.io/)  including details on how to run their Hyperion Full History product, however this article expands on their documentation specifically in relation to operating Hyperion using Elasticsearch 8.x

Once again this Technical How To series will cover some of EOS RIO’s same content and will add operational nuances from a practical stand point and our experience.

[Learn more about EOS RIO Hyperion](https://eosrio.io/hyperion/)

![](https://miro.medium.com/v2/resize:fit:449/0*pY_GWzqlqGfAO7Kf.png)

_This article has been updated to reflect the current Hyperion deployment in December 2024._

## Rectify Missing Blocks in WAX Hyperion Full History

Firstly it needs to be identified whether your deployment does indeed have any missing blocks, this information is clearly displayed in the Hyperion API  `health`  query.

The specific blocks or ranges that are missing can then be granularly identified by using Kibana’s built-in Visualize Library.

The Hyperion  `wax.config.json`  can then be configurated to specifically fill in these missing blocks or ranges.

Finally you can make sure in a  `health`  query that your WAX Full History Block Set is complete.

_There is a_ [_H_](https://github.com/eosrio/hyperion-history-api/tree/v3.3.5/scripts/fix_missing_blocks)[_yperion Repair Tool_](https://hyperion.docs.eosrio.io/providers/repair/)  _automated script that accomplishes this task, however this article will cover the manual process. This tool will be covered in a future article._

### Identify ###

Firstly perform a  `health`  query of your Hyperion API, either through a web browser or curl request.

```
> curl http://<HYPERION IP ADDRESS>:7000/v2/health  
  
{"version":"3.3.9-8","version_hash":"b94f99d552a8fe85a3ab2c1cb5b84ccd6ded6af4","host":"wax.eosphere.io","health":[{"service":"RabbitMq","status":"OK","time":1695776754095},{"service":"NodeosRPC","status":"OK","service_data":{"head_block_num":268611130,"head_block_time":"2023-09-27T01:05:53.500","time_offset":552,"last_irreversible_block":268610794,"chain_id":"1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4"},"time":1695776754052},{"service":"Elasticsearch","status":"OK","service_data":{"active_shards":"100.0%","head_offset":0,"first_indexed_block":2,**"last_indexed_block":247081398**,**"total_indexed_blocks":162203179**,**"missing_blocks":84878217**,"missing_pct":"34.35%"},"time":1695776754053}],"features":{"streaming":{"enable":true,"traces":true,"deltas":true},"tables":{"proposals":true,"accounts":true,"voters":true},"index_deltas":true,"index_transfer_memo":true,"index_all_deltas":true,"deferred_trx":false,"failed_trx":false,"resource_limits":false,"resource_usage":false},"cached":true,"query_time_ms":0.208,"last_indexed_block":247081398,"last_indexed_block_time":"2023-09-27T01:05:59.500"}

```
You will notice that the  `“last_indexed_block”:247081398`  and  `“total_indexed_blocks”:162203179`  have different values as stated by  `“missing_blocks”:84878217`indicating that there are missing blocks in this example’s Full History Index.

There will always be a 2 block delta on the total vs last block indicators, but missing blocks will display the actual number of blocks missing.

### Locate ###

Now that it is identified there are missing blocks, Kibana can be used to visually locate the missing blocks or ranges.

Log into Kibana using a browser:

```
http://<KIBANA IP ADDRESS>:5601
```

Select [Stack Management] -> [Data Views]:

![](https://miro.medium.com/v2/resize:fit:435/1*1jFNSMn-G_Fq-3GUXxmkzQ.jpeg)

Select [Create data view] and under [Name] input  `wax-block*`  to match the blocks index pattern -> finally select [Create data view]:

![](https://miro.medium.com/v2/resize:fit:525/1*Db-nzkD1ga-fcKTeT57d0w.jpeg)

Select [Visualize Library]:

![](https://miro.medium.com/v2/resize:fit:272/1*utzx7wMztfrYxA3mTK-weg.jpeg)

Select [Create visualization] -> [Lens]

![](https://miro.medium.com/v2/resize:fit:427/1*aUjWmss93W6SoDkfEQLZuw.jpeg)

Ensure  `wax-block*`  data view is selected:

![](https://miro.medium.com/v2/resize:fit:305/1*XY2hIt0pTT04FA_bsUf1WQ.jpeg)

On the [Horizontal axis] in [Field] -> [Available fields] select [# block_num] -> [Close]

![](https://miro.medium.com/v2/resize:fit:299/1*e0KlGRqJVHCuviBHNQshNA.jpeg)

On the Vertical axis in [Functions] -> select [Count] -> Close

![](https://miro.medium.com/v2/resize:fit:294/1*cIQvJ2MwqONh_-Yz_RrxUA.jpeg)

Adjust the date range to ensure you visualise the entire block range from genesis.

In the below example we can observe multiple gaps in our Full History blocks set, the first being from  **block 107,925,000 to block 130,000,000**:

![](https://miro.medium.com/v2/resize:fit:525/1*D-HF_UIWqC4BVosJlh6d4A.jpeg)

Example Missing Blocks

### Rectify ###

The following example will cover filling in the missing blocks for the first located range.

Firstly stop the WAX Hyperion Indexer gracefully clearing the queues:

```
> pm2 trigger wax-indexer stop  
1 processes have received command stop  
[wax-indexer:0:wax]={"ack":true}
```

Edit the  `wax.config.json`  indexer settings to cover the missing blocks range as well allow the rewrite of any existing blocks:

```
> nano ~/hyperion-history-api/chains/wax.config.json  
  
  "indexer": {  
    "enabled": true,  
    "node_max_old_space_size": 4096,  
    "start_on": 107925000, #ADJUST#
    "stop_on": 130000000, #ADJUST#
    "rewrite": true, #ENABLE REWRITE# 
    "purge_queues": false,  
    "live_reader": false, #DISABLED FOR INDEXING CATCHUP#  
    "live_only_mode": false,  
    "abi_scan_mode": false,  
    "fetch_block": true,  
    "fetch_traces": true,  
    "disable_reading": false,  
    "disable_indexing": false,  
    "process_deltas": true,  
    "disable_delta_rm": true  
  },
```

Then restart the indexer and monitor progress in  `pm2 logs`:

```
> pm2 start --only wax-indexer --update-env
```

Repeat the process for any more identified and located missing blocks or ranges.

Once you are comfortable that the gaps have been rectified, reconfigure the  `wax.config.json`  indexer settings for normal operation:

```
> nano ~/hyperion-history-api/chains/wax.config.json  
  
  "indexer": {  
    "enabled": true,  
    "node_max_old_space_size": 4096,  
    "start_on": 0, #RESET#
    "stop_on": 0, #RESET#
    "rewrite": false, #DISABLE REWRITE#
    "purge_queues": false,  
    "live_reader": true, #ENABLED FOR NORMAL INDEXING#
    "live_only_mode": false,  
    "abi_scan_mode": false,  
    "fetch_block": true,  
    "fetch_traces": true,  
    "disable_reading": false,  
    "disable_indexing": false,  
    "process_deltas": true,  
    "disable_delta_rm": true  
  },
```

Restart the indexer, monitor progress in  `pm2 logs`  and recheck the WAX Hyperion API with a  `health`  query:

```
> pm2 start --only wax-indexer --update-env  
  
> curl http://<HYPERION IP ADDRESS>:7000/v2/health
```

Ensure that  `“last_indexed_block”:`  and  `“total_indexed_blocks”:`  have the same value.

![](https://miro.medium.com/v2/resize:fit:525/1*lu2Nio99aqpdgInYCh9-fg.jpeg)

Fully Indexed WAX Hyperion Full History

Congratulations your WAX Hyperion Full History is now healthy and you have a handy Kibana visualisation to easily check the status of your Full History offering.

---

These **WAX Developer Technical Guides** are created using source material from the [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home)

Be sure to ask any questions in the  [EOSphere Telegram](https://t.me/eosphere_io)
