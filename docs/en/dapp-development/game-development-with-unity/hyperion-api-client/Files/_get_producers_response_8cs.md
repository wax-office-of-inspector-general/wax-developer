---
title: HyperionApiClient/Responses/GetProducersResponse.cs

---

# HyperionApiClient/Responses/GetProducersResponse.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Responses](/Namespaces/namespace_hyperion_api_client_1_1_responses.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Responses::GetProducersResponse](/Classes/class_hyperion_api_client_1_1_responses_1_1_get_producers_response.md)**  |




## Source code

```csharp
using System;
using System.Collections.Generic;
using System.Text;
using HyperionApiClient.Models;
using Newtonsoft.Json;

namespace HyperionApiClient.Responses
{
    public class GetProducersResponse
    {
        [JsonProperty("rows")]
        public List<ProducerRow> Rows { get; set; }

        [JsonProperty("total_producer_vote_weight")]
        public string TotalProducerVoteWeight { get; set; }

        [JsonProperty("more")]
        public string More { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
