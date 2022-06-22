---
title: HyperionApiClient/Responses/GetHealthResponse.cs

---

# HyperionApiClient/Responses/GetHealthResponse.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Responses](/Namespaces/namespace_hyperion_api_client_1_1_responses.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Responses::GetHealthResponse](/Classes/class_hyperion_api_client_1_1_responses_1_1_get_health_response.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using System.Text;
using HyperionApiClient.Models;
using Newtonsoft.Json;

namespace HyperionApiClient.Responses
{
    public class GetHealthResponse
    {
        [JsonProperty("version")]
        public string Version { get; set; }

        [JsonProperty("version_hash")]
        public string VersionHash { get; set; }

        [JsonProperty("host")]
        public string Host { get; set; }

        [JsonProperty("features")]
        public Features Features { get; set; }

        [JsonProperty("health")]
        public List<Health> Health { get; set; }

        [JsonProperty("query_time_ms")]
        public double QueryTimeMs { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
