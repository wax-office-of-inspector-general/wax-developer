---
title: HyperionApiClient/Models/Action5.cs

---

# HyperionApiClient/Models/Action5.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Action5](/Classes/class_hyperion_api_client_1_1_models_1_1_action5.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Action5
    {
        [JsonProperty("account")]
        public string Account { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("authorization")]
        public List<Authorization2> Authorization { get; set; }

        [JsonProperty("data")]
        public object Data { get; set; }

        [JsonProperty("hex_data")]
        public string HexData { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
