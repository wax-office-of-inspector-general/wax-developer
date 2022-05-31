---
title: HyperionApiClient/Models/ActivatedProtocolFeatures.cs

---

# HyperionApiClient/Models/ActivatedProtocolFeatures.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::ActivatedProtocolFeatures](/Classes/class_hyperion_api_client_1_1_models_1_1_activated_protocol_features.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class ActivatedProtocolFeatures
    {
        [JsonProperty("protocol_features")]
        public List<string> ProtocolFeatures { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
