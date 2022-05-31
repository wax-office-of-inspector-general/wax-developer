---
title: HyperionApiClient/Responses/GetCreatorResponse.cs

---

# HyperionApiClient/Responses/GetCreatorResponse.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Responses](/Namespaces/namespace_hyperion_api_client_1_1_responses.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Responses::GetCreatorResponse](/Classes/class_hyperion_api_client_1_1_responses_1_1_get_creator_response.md)**  |




## Source code

```csharp
using HyperionApiClient.Models;
using Newtonsoft.Json;

namespace HyperionApiClient.Responses
{
    public class GetCreatorResponse 
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
    
        [JsonProperty("account", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Account { get; set; }
    
        [JsonProperty("creator", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Creator { get; set; }
    
        [JsonProperty("timestamp", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Timestamp { get; set; }
    
        [JsonProperty("block_num", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public int BlockNum { get; set; }
    
        [JsonProperty("trx_id", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string TrxId { get; set; }
    
        [JsonProperty("indirect_creator", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string IndirectCreator { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
