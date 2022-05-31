---
title: HyperionApiClient/Models/ActionTrace.cs

---

# HyperionApiClient/Models/ActionTrace.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::ActionTrace](/Classes/class_hyperion_api_client_1_1_models_1_1_action_trace.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class ActionTrace 
    {
        [JsonProperty("action_ordinal", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double ActionOrdinal { get; set; }
    
        [JsonProperty("creator_action_ordinal", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double CreatorActionOrdinal { get; set; }
    
        [JsonProperty("receipt", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public Receipt Receipt { get; set; }
    
        [JsonProperty("receiver", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Receiver { get; set; }
    
        [JsonProperty("act", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public ExtendedAct Act { get; set; }
    
        [JsonProperty("trx_id", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string TrxId { get; set; }
    
        [JsonProperty("block_num", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double BlockNum { get; set; }
    
        [JsonProperty("block_time", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string BlockTime { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
