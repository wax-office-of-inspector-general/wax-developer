---
title: HyperionApiClient/Models/ExtendedLink.cs

---

# HyperionApiClient/Models/ExtendedLink.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::ExtendedLink](/Classes/class_hyperion_api_client_1_1_models_1_1_extended_link.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class ExtendedLink : Link
    {
        [JsonProperty("block_num", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double BlockNum { get; set; }

        [JsonProperty("account", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Account { get; set; }

        [JsonProperty("irreversible", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public bool Irreversible { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
