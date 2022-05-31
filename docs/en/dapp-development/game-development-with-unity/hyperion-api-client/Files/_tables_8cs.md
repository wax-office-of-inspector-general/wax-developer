---
title: HyperionApiClient/Models/Tables.cs

---

# HyperionApiClient/Models/Tables.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Tables](/Classes/class_hyperion_api_client_1_1_models_1_1_tables.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Tables
    {
        [JsonProperty("proposals")]
        public bool Proposals { get; set; }

        [JsonProperty("accounts")]
        public bool Accounts { get; set; }

        [JsonProperty("voters")]
        public bool Voters { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
