---
title: HyperionApiClient/Models/RicardianClaus.cs

---

# HyperionApiClient/Models/RicardianClaus.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::RicardianClaus](/Classes/class_hyperion_api_client_1_1_models_1_1_ricardian_claus.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class RicardianClaus
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("body")]
        public string Body { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
