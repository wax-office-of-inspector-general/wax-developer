---
title: HyperionApiClient/Models/ExtendedAct.cs

---

# HyperionApiClient/Models/ExtendedAct.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::ExtendedAct](/Classes/class_hyperion_api_client_1_1_models_1_1_extended_act.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class ExtendedAct : Act
    {
        [JsonProperty("authorization", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public ICollection<object> Authorization { get; set; }
    
        [JsonProperty("data", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public object Data { get; set; }
    
        [JsonProperty("hex_data", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string HexData { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
