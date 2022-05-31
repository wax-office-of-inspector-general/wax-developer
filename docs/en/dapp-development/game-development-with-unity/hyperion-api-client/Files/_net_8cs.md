---
title: HyperionApiClient/Models/Net.cs

---

# HyperionApiClient/Models/Net.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Net](/Classes/class_hyperion_api_client_1_1_models_1_1_net.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Net
    {
        [JsonProperty("stats")]
        public Stats Stats { get; set; }

        [JsonProperty("percentiles")]
        public Percentiles Percentiles { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
