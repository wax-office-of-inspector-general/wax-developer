---
title: HyperionApiClient/Responses/GetActivatedProtocolFeaturesBody.cs

---

# HyperionApiClient/Responses/GetActivatedProtocolFeaturesBody.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Responses](/Namespaces/namespace_hyperion_api_client_1_1_responses.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Responses::GetActivatedProtocolFeaturesBody](/Classes/class_hyperion_api_client_1_1_responses_1_1_get_activated_protocol_features_body.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Responses
{
    public class GetActivatedProtocolFeaturesBody
    {
        [JsonProperty("lower_bound")]
        public int LowerBound { get; set; }

        [JsonProperty("upper_bound")]
        public int UpperBound { get; set; }

        [JsonProperty("limit")]
        public int Limit { get; set; }

        [JsonProperty("search_by_block_num")]
        public bool SearchByBlockNum { get; set; }

        [JsonProperty("reverse")]
        public bool Reverse { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
