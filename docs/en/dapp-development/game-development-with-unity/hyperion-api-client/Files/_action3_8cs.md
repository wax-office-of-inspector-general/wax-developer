---
title: HyperionApiClient/Models/Action3.cs

---

# HyperionApiClient/Models/Action3.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Action3](/Classes/class_hyperion_api_client_1_1_models_1_1_action3.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Action3 
    {
        [JsonProperty("@timestamp", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string timestamp { get; set; }
    
        [JsonProperty("timestamp", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Timestamp { get; set; }
    
        [JsonProperty("block_num", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double BlockNum { get; set; }
    
        [JsonProperty("trx_id", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string TrxId { get; set; }
    
        [JsonProperty("act", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public Act Act { get; set; }
    
        [JsonProperty("notified", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public ICollection<string> Notified { get; set; }
    
        [JsonProperty("cpu_usage_us", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double CpuUsageUs { get; set; }
    
        [JsonProperty("net_usage_words", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double NetUsageWords { get; set; }
    
        [JsonProperty("account_ram_deltas", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public ICollection<AccountRamDelta> AccountRamDeltas { get; set; }
    
        [JsonProperty("global_sequence", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double GlobalSequence { get; set; }
    
        [JsonProperty("receiver", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Receiver { get; set; }
    
        [JsonProperty("producer", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Producer { get; set; }
    
        [JsonProperty("parent", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double Parent { get; set; }
    
        [JsonProperty("action_ordinal", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double ActionOrdinal { get; set; }
    
        [JsonProperty("creator_action_ordinal", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double CreatorActionOrdinal { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
