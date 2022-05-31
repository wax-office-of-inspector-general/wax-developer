---
title: HyperionApiClient/Models/Stats.cs

---

# HyperionApiClient/Models/Stats.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Stats](/Classes/class_hyperion_api_client_1_1_models_1_1_stats.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Stats 
    {
        [JsonProperty("by_producer", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public object ByProducer { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
