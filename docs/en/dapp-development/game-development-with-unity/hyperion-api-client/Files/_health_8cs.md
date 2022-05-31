---
title: HyperionApiClient/Models/Health.cs

---

# HyperionApiClient/Models/Health.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Health](/Classes/class_hyperion_api_client_1_1_models_1_1_health.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Health
    {
        [JsonProperty("service")]
        public string Service { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("time")]
        public object Time { get; set; }

        [JsonProperty("service_data")]
        public ServiceData ServiceData { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
