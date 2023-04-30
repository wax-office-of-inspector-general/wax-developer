---
title: HyperionApiClient/Models/NetLimit.cs

---

# HyperionApiClient/Models/NetLimit.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::NetLimit](/Classes/class_hyperion_api_client_1_1_models_1_1_net_limit.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class NetLimit
    {
        [JsonProperty("used")]
        public int Used { get; set; }

        [JsonProperty("available")]
        public int Available { get; set; }

        [JsonProperty("max")]
        public int Max { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
