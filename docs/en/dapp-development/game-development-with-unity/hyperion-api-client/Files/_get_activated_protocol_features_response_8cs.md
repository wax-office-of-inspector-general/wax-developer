---
title: HyperionApiClient/Responses/GetActivatedProtocolFeaturesResponse.cs

---

# HyperionApiClient/Responses/GetActivatedProtocolFeaturesResponse.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Responses](/Namespaces/namespace_hyperion_api_client_1_1_responses.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Responses::GetActivatedProtocolFeaturesResponse](/Classes/class_hyperion_api_client_1_1_responses_1_1_get_activated_protocol_features_response.md)**  |




## Source code

```csharp
using System;
using System.Collections.Generic;
using System.Text;
using HyperionApiClient.Models;
using Newtonsoft.Json;

namespace HyperionApiClient.Responses
{
    public class GetActivatedProtocolFeaturesResponse
    {
        [JsonProperty("activated_protocol_features")]
        public List<ActivatedProtocolFeature> ActivatedProtocolFeatures { get; set; }

        [JsonProperty("more")]
        public int More { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
