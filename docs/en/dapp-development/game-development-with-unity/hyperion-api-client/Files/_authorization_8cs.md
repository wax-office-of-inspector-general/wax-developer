---
title: HyperionApiClient/Models/Authorization.cs

---

# HyperionApiClient/Models/Authorization.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Authorization](/Classes/class_hyperion_api_client_1_1_models_1_1_authorization.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Authorization 
    {
        [JsonProperty("account", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Account { get; set; }
    
        [JsonProperty("permission", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Permission { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
