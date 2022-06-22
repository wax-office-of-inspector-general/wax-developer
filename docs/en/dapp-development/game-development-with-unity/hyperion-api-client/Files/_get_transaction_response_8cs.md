---
title: HyperionApiClient/Responses/GetTransactionResponse.cs

---

# HyperionApiClient/Responses/GetTransactionResponse.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Responses](/Namespaces/namespace_hyperion_api_client_1_1_responses.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Responses::GetTransactionResponse](/Classes/class_hyperion_api_client_1_1_responses_1_1_get_transaction_response.md)**  |




## Source code

```csharp
using System;
using System.Collections.Generic;
using System.Text;
using HyperionApiClient.Models;
using Newtonsoft.Json;

namespace HyperionApiClient.Responses
{
    public class GetTransactionResponse
    {
        [JsonProperty("executed")]
        public bool Executed { get; set; }

        [JsonProperty("hot_only")]
        public bool HotOnly { get; set; }

        [JsonProperty("trx_id")]
        public string TrxId { get; set; }

        [JsonProperty("lib")]
        public int Lib { get; set; }

        [JsonProperty("actions")]
        public List<Action6> Actions { get; set; }

        [JsonProperty("query_time_ms")]
        public double QueryTimeMs { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
