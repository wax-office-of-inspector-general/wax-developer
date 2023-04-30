---
title: HyperionApiClient/Models/ServiceData.cs

---

# HyperionApiClient/Models/ServiceData.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::ServiceData](/Classes/class_hyperion_api_client_1_1_models_1_1_service_data.md)**  |




## Source code

```csharp
using System;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class ServiceData
    {
        [JsonProperty("head_block_num")]
        public int HeadBlockNum { get; set; }

        [JsonProperty("head_block_time")]
        public DateTime HeadBlockTime { get; set; }

        [JsonProperty("time_offset")]
        public int TimeOffset { get; set; }

        [JsonProperty("last_irreversible_block")]
        public int LastIrreversibleBlock { get; set; }

        [JsonProperty("chain_id")]
        public string ChainId { get; set; }

        [JsonProperty("last_indexed_block")]
        public int? LastIndexedBlock { get; set; }

        [JsonProperty("total_indexed_blocks")]
        public int? TotalIndexedBlocks { get; set; }

        [JsonProperty("active_shards")]
        public string ActiveShards { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
