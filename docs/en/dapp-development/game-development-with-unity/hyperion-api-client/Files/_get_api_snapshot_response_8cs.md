---
title: HyperionApiClient/Responses/GetApiSnapshotResponse.cs

---

# HyperionApiClient/Responses/GetApiSnapshotResponse.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Responses](/Namespaces/namespace_hyperion_api_client_1_1_responses.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Responses::GetApiSnapshotResponse](/Classes/class_hyperion_api_client_1_1_responses_1_1_get_api_snapshot_response.md)**  |




## Source code

```csharp
using System;
using System.Text;
using HyperionApiClient.Models;
using Newtonsoft.Json;

namespace HyperionApiClient.Responses
{
    public class GetApiSnapshotResponse
    {
        [JsonProperty("block_num")]
        public int BlockNum { get; set; }

        [JsonProperty("abi")]
        public Abi Abi { get; set; }

        [JsonProperty("query_time_ms")]
        public double QueryTimeMs { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
