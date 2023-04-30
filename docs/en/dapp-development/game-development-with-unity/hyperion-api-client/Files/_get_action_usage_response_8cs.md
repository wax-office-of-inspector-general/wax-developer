---
title: HyperionApiClient/Responses/GetActionUsageResponse.cs

---

# HyperionApiClient/Responses/GetActionUsageResponse.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Responses](/Namespaces/namespace_hyperion_api_client_1_1_responses.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Responses::GetActionUsageResponse](/Classes/class_hyperion_api_client_1_1_responses_1_1_get_action_usage_response.md)**  |




## Source code

```csharp
using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace HyperionApiClient.Responses
{
    public class GetActionUsageResponse
    {
        [JsonProperty("action_count")]
        public int ActionCount { get; set; }

        [JsonProperty("tx_count")]
        public int TxCount { get; set; }

        [JsonProperty("period")]
        public string Period { get; set; }

        [JsonProperty("from")]
        public string From { get; set; }

        [JsonProperty("to")]
        public string To { get; set; }

        [JsonProperty("query_time_ms")]
        public double QueryTimeMs { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
