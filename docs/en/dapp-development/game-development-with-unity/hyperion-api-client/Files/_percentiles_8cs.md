---
title: HyperionApiClient/Models/Percentiles.cs

---

# HyperionApiClient/Models/Percentiles.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Percentiles](/Classes/class_hyperion_api_client_1_1_models_1_1_percentiles.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Percentiles
    {
        [JsonProperty("1.0")]
        public int _10 { get; set; }

        [JsonProperty("5.0")]
        public int _50 { get; set; }

        [JsonProperty("25.0")]
        public double _250 { get; set; }

        [JsonProperty("50.0")]
        public double _500 { get; set; }

        [JsonProperty("75.0")]
        public double _750 { get; set; }

        [JsonProperty("95.0")]
        public double _950 { get; set; }

        [JsonProperty("99.0")]
        public double _990 { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
