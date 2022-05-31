---
title: HyperionApiClient/Models/Action6.cs

---

# HyperionApiClient/Models/Action6.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Action6](/Classes/class_hyperion_api_client_1_1_models_1_1_action6.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Action6
    {
        [JsonProperty("action_ordinal")]
        public int ActionOrdinal { get; set; }

        [JsonProperty("creator_action_ordinal")]
        public int CreatorActionOrdinal { get; set; }

        [JsonProperty("act")]
        public Act Act { get; set; }

        [JsonProperty("context_free")]
        public bool ContextFree { get; set; }

        [JsonProperty("elapsed")]
        public string Elapsed { get; set; }

        [JsonProperty("@timestamp")]
        public string timestamp { get; set; }

        [JsonProperty("block_num")]
        public int BlockNum { get; set; }

        [JsonProperty("producer")]
        public string Producer { get; set; }

        [JsonProperty("trx_id")]
        public string TrxId { get; set; }

        [JsonProperty("global_sequence")]
        public object GlobalSequence { get; set; }

        [JsonProperty("cpu_usage_us")]
        public int CpuUsageUs { get; set; }

        [JsonProperty("net_usage_words")]
        public int NetUsageWords { get; set; }

        [JsonProperty("signatures")]
        public List<string> Signatures { get; set; }

        [JsonProperty("inline_count")]
        public int InlineCount { get; set; }

        [JsonProperty("inline_filtered")]
        public bool InlineFiltered { get; set; }

        [JsonProperty("receipts")]
        public List<Receipt> Receipts { get; set; }

        [JsonProperty("code_sequence")]
        public int CodeSequence { get; set; }

        [JsonProperty("abi_sequence")]
        public int AbiSequence { get; set; }

        [JsonProperty("notified")]
        public List<string> Notified { get; set; }

        [JsonProperty("timestamp")]
        public string Timestamp { get; set; }

        [JsonProperty("account_ram_deltas")]
        public List<AccountRamDelta> AccountRamDeltas { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
