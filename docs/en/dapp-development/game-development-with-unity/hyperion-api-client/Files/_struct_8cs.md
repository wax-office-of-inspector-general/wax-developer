---
title: HyperionApiClient/Models/Struct.cs

---

# HyperionApiClient/Models/Struct.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Struct](/Classes/class_hyperion_api_client_1_1_models_1_1_struct.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Struct
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("base")]
        public string Base { get; set; }

        [JsonProperty("fields")]
        public List<Field> Fields { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
