---
title: HyperionApiClient/Responses/GetScheduleResponse.cs

---

# HyperionApiClient/Responses/GetScheduleResponse.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Responses](/Namespaces/namespace_hyperion_api_client_1_1_responses.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Responses::GetScheduleResponse](/Classes/class_hyperion_api_client_1_1_responses_1_1_get_schedule_response.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using HyperionApiClient.Models;
using Newtonsoft.Json;

namespace HyperionApiClient.Responses
{
    public class GetScheduleResponse 
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
    
        [JsonProperty("timestamp", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Timestamp { get; set; }
    
        [JsonProperty("block_num", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double BlockNum { get; set; }
    
        [JsonProperty("version", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double Version { get; set; }
    
        [JsonProperty("producers", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public ICollection<Producer> Producers { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
