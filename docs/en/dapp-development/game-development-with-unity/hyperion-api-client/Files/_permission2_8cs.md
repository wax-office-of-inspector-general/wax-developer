---
title: HyperionApiClient/Models/Permission2.cs

---

# HyperionApiClient/Models/Permission2.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Permission2](/Classes/class_hyperion_api_client_1_1_models_1_1_permission2.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Permission2
    {
        [JsonProperty("perm_name")]
        public string PermName { get; set; }

        [JsonProperty("parent")]
        public string Parent { get; set; }

        [JsonProperty("required_auth")]
        public RequiredAuth RequiredAuth { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
