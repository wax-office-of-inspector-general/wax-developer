---
title: HyperionApiClient/Models/Streaming.cs

---

# HyperionApiClient/Models/Streaming.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Streaming](/Classes/class_hyperion_api_client_1_1_models_1_1_streaming.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Streaming
    {
        [JsonProperty("enable")]
        public bool Enable { get; set; }

        [JsonProperty("traces")]
        public bool Traces { get; set; }

        [JsonProperty("deltas")]
        public bool Deltas { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
