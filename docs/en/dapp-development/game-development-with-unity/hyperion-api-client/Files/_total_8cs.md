---
title: HyperionApiClient/Models/Total.cs

---

# HyperionApiClient/Models/Total.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Total](/Classes/class_hyperion_api_client_1_1_models_1_1_total.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Total 
    {
        [JsonProperty("value", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double Value { get; set; }
    
        [JsonProperty("relation", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Relation { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
