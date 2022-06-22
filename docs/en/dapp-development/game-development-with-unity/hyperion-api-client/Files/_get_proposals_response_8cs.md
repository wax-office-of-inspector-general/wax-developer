---
title: HyperionApiClient/Responses/GetProposalsResponse.cs

---

# HyperionApiClient/Responses/GetProposalsResponse.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Responses](/Namespaces/namespace_hyperion_api_client_1_1_responses.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Responses::GetProposalsResponse](/Classes/class_hyperion_api_client_1_1_responses_1_1_get_proposals_response.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using System.Text;
using HyperionApiClient.Models;
using Newtonsoft.Json;

namespace HyperionApiClient.Responses
{
    public class GetProposalsResponse
    {
        [JsonProperty("query_time")]
        public object QueryTime { get; set; }

        [JsonProperty("cached")]
        public bool Cached { get; set; }

        [JsonProperty("total")]
        public Total Total { get; set; }

        [JsonProperty("proposals")]
        public List<Proposal> Proposals { get; set; }

        [JsonProperty("query_time_ms")]
        public double QueryTimeMs { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
