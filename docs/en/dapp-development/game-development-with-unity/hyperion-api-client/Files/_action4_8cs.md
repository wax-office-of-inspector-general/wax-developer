---
title: HyperionApiClient/Models/Action4.cs

---

# HyperionApiClient/Models/Action4.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Action4](/Classes/class_hyperion_api_client_1_1_models_1_1_action4.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Action4 
    {
        [JsonProperty("receiver", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Receiver { get; set; }
    
        [JsonProperty("account", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Account { get; set; }
    
        [JsonProperty("action", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Action { get; set; }
    
        [JsonProperty("authorization", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public ICollection<Authorization> Authorization { get; set; }
    
        [JsonProperty("data", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public object Data { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
