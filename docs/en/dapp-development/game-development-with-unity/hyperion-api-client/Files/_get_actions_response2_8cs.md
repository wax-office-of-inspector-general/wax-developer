---
title: HyperionApiClient/Responses/GetActionsResponse2.cs

---

# HyperionApiClient/Responses/GetActionsResponse2.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Responses](/Namespaces/namespace_hyperion_api_client_1_1_responses.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Responses::GetActionsResponse2](/Classes/class_hyperion_api_client_1_1_responses_1_1_get_actions_response2.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using HyperionApiClient.Models;
using Newtonsoft.Json;

namespace HyperionApiClient.Responses
{
    public class GetActionsResponse2 
    {
        [JsonProperty("query_time", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double QueryTime { get; set; }
    
        [JsonProperty("last_irreversible_block", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double LastIrreversibleBlock { get; set; }
    
        [JsonProperty("actions", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public ICollection<Action2> Actions { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
