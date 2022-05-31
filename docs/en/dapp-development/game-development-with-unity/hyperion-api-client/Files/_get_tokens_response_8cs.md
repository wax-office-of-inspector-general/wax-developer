---
title: HyperionApiClient/Responses/GetTokensResponse.cs

---

# HyperionApiClient/Responses/GetTokensResponse.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Responses](/Namespaces/namespace_hyperion_api_client_1_1_responses.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Responses::GetTokensResponse](/Classes/class_hyperion_api_client_1_1_responses_1_1_get_tokens_response.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using HyperionApiClient.Models;
using Newtonsoft.Json;

namespace HyperionApiClient.Responses
{
    public class GetTokensResponse
    {
        [JsonProperty("account")]
        public string Account { get; set; }

        [JsonProperty("tokens")]
        public List<Token> Tokens { get; set; }

        [JsonProperty("query_time_ms")]
        public double QueryTimeMs { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
