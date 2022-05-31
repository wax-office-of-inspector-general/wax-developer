---
title: HyperionApiClient/Models/TotalResources.cs

---

# HyperionApiClient/Models/TotalResources.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::TotalResources](/Classes/class_hyperion_api_client_1_1_models_1_1_total_resources.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class TotalResources
    {
        [JsonProperty("owner")]
        public string Owner { get; set; }

        [JsonProperty("net_weight")]
        public string NetWeight { get; set; }

        [JsonProperty("cpu_weight")]
        public string CpuWeight { get; set; }

        [JsonProperty("ram_bytes")]
        public int RamBytes { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
