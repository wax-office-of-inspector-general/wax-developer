---
title: HyperionApiClient/Models/AuthSequence.cs

---

# HyperionApiClient/Models/AuthSequence.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::AuthSequence](/Classes/class_hyperion_api_client_1_1_models_1_1_auth_sequence.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class AuthSequence 
    {
        [JsonProperty("account", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Account { get; set; }
    
        [JsonProperty("sequence", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double Sequence { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
