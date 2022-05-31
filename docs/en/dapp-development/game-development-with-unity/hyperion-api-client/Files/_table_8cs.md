---
title: HyperionApiClient/Models/Table.cs

---

# HyperionApiClient/Models/Table.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Table](/Classes/class_hyperion_api_client_1_1_models_1_1_table.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Table
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("index_type")]
        public string IndexType { get; set; }

        [JsonProperty("key_names")]
        public List<object> KeyNames { get; set; }

        [JsonProperty("key_types")]
        public List<object> KeyTypes { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
