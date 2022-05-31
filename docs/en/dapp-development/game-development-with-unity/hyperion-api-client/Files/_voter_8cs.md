---
title: HyperionApiClient/Models/Voter.cs

---

# HyperionApiClient/Models/Voter.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Voter](/Classes/class_hyperion_api_client_1_1_models_1_1_voter.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Voter 
    {
        [JsonProperty("account", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Account { get; set; }
    
        [JsonProperty("weight", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double Weight { get; set; }
    
        [JsonProperty("last_vote", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double LastVote { get; set; }
    
        [JsonProperty("data", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public object Data { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
