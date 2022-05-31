---
title: HyperionApiClient/Models/Body.cs

---

# HyperionApiClient/Models/Body.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Body](/Classes/class_hyperion_api_client_1_1_models_1_1_body.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Body 
    {
        [JsonProperty("public_key", Required = Required.Always)]
        public string PublicKey { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
