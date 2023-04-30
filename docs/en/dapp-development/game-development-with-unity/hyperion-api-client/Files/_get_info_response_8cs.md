---
title: HyperionApiClient/Responses/GetInfoResponse.cs

---

# HyperionApiClient/Responses/GetInfoResponse.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Responses](/Namespaces/namespace_hyperion_api_client_1_1_responses.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Responses::GetInfoResponse](/Classes/class_hyperion_api_client_1_1_responses_1_1_get_info_response.md)**  |




## Source code

```csharp
using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace HyperionApiClient.Responses
{
    public class GetInfoResponse
    {
        [JsonProperty("server_version")]
        public string ServerVersion { get; set; }

        [JsonProperty("chain_id")]
        public string ChainId { get; set; }

        [JsonProperty("head_block_num")]
        public int HeadBlockNum { get; set; }

        [JsonProperty("last_irreversible_block_num")]
        public int LastIrreversibleBlockNum { get; set; }

        [JsonProperty("last_irreversible_block_id")]
        public string LastIrreversibleBlockId { get; set; }

        [JsonProperty("head_block_id")]
        public string HeadBlockId { get; set; }

        [JsonProperty("head_block_time")]
        public string HeadBlockTime { get; set; }

        [JsonProperty("head_block_producer")]
        public string HeadBlockProducer { get; set; }

        [JsonProperty("virtual_block_cpu_limit")]
        public int VirtualBlockCpuLimit { get; set; }

        [JsonProperty("virtual_block_net_limit")]
        public int VirtualBlockNetLimit { get; set; }

        [JsonProperty("block_cpu_limit")]
        public int BlockCpuLimit { get; set; }

        [JsonProperty("block_net_limit")]
        public int BlockNetLimit { get; set; }

        [JsonProperty("server_version_string")]
        public string ServerVersionString { get; set; }

        [JsonProperty("fork_db_head_block_num")]
        public int ForkDbHeadBlockNum { get; set; }

        [JsonProperty("fork_db_head_block_id")]
        public string ForkDbHeadBlockId { get; set; }

        [JsonProperty("server_full_version_string")]
        public string ServerFullVersionString { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
