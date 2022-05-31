---
title: HyperionApiClient/Responses/GetMissedBlocksResponse.cs

---

# HyperionApiClient/Responses/GetMissedBlocksResponse.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Responses](/Namespaces/namespace_hyperion_api_client_1_1_responses.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Responses::GetMissedBlocksResponse](/Classes/class_hyperion_api_client_1_1_responses_1_1_get_missed_blocks_response.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using HyperionApiClient.Models;
using Newtonsoft.Json;

namespace HyperionApiClient.Responses
{
    public class GetMissedBlocksResponse 
    {
        [JsonProperty("query_time_ms", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double QueryTimeMs { get; set; }
    
        [JsonProperty("cached", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public bool Cached { get; set; }
    
        [JsonProperty("hot_only", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public bool HotOnly { get; set; }
    
        [JsonProperty("lib", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double Lib { get; set; }
    
        [JsonProperty("total", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public Total Total { get; set; }
    
        [JsonProperty("stats", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public Stats Stats { get; set; }
    
        [JsonProperty("events", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public ICollection<Event> Events { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
