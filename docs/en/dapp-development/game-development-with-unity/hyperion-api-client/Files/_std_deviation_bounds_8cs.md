---
title: HyperionApiClient/Models/StdDeviationBounds.cs

---

# HyperionApiClient/Models/StdDeviationBounds.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::StdDeviationBounds](/Classes/class_hyperion_api_client_1_1_models_1_1_std_deviation_bounds.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class StdDeviationBounds
    {
        [JsonProperty("upper")]
        public double Upper { get; set; }

        [JsonProperty("lower")]
        public double Lower { get; set; }

        [JsonProperty("upper_population")]
        public double UpperPopulation { get; set; }

        [JsonProperty("lower_population")]
        public double LowerPopulation { get; set; }

        [JsonProperty("upper_sampling")]
        public double UpperSampling { get; set; }

        [JsonProperty("lower_sampling")]
        public double LowerSampling { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
