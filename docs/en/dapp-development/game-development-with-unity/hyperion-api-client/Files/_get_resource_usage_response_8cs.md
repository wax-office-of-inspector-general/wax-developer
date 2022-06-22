---
title: HyperionApiClient/Responses/GetResourceUsageResponse.cs

---

# HyperionApiClient/Responses/GetResourceUsageResponse.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Responses](/Namespaces/namespace_hyperion_api_client_1_1_responses.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Responses::GetResourceUsageResponse](/Classes/class_hyperion_api_client_1_1_responses_1_1_get_resource_usage_response.md)**  |




## Source code

```csharp
using System;
using System.Collections.Generic;
using System.Text;
using HyperionApiClient.Models;
using Newtonsoft.Json;

namespace HyperionApiClient.Responses
{
    public class GetResourceUsageResponse
    {
        [JsonProperty("cpu")]
        public Cpu Cpu { get; set; }

        [JsonProperty("net")]
        public Net Net { get; set; }

        [JsonProperty("query_time_ms")]
        public double QueryTimeMs { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
