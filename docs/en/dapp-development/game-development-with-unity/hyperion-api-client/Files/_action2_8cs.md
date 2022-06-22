---
title: HyperionApiClient/Models/Action2.cs

---

# HyperionApiClient/Models/Action2.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Action2](/Classes/class_hyperion_api_client_1_1_models_1_1_action2.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Action2 
    {
        [JsonProperty("account_action_seq", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double AccountActionSeq { get; set; }
    
        [JsonProperty("global_action_seq", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double GlobalActionSeq { get; set; }
    
        [JsonProperty("block_num", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double BlockNum { get; set; }
    
        [JsonProperty("block_time", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string BlockTime { get; set; }
    
        [JsonProperty("action_trace", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public ActionTrace ActionTrace { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
