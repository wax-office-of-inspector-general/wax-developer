---
title: HyperionApiClient/Models/Transaction3.cs

---

# HyperionApiClient/Models/Transaction3.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Transaction3](/Classes/class_hyperion_api_client_1_1_models_1_1_transaction3.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Transaction3
    {
        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("cpu_usage_us")]
        public int CpuUsageUs { get; set; }

        [JsonProperty("net_usage_words")]
        public int NetUsageWords { get; set; }

        [JsonProperty("trx")]
        public Trx Trx { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
