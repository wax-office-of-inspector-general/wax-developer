---
title: HyperionApiClient/Models/BlockrootMerkle.cs

---

# HyperionApiClient/Models/BlockrootMerkle.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::BlockrootMerkle](/Classes/class_hyperion_api_client_1_1_models_1_1_blockroot_merkle.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class BlockrootMerkle
    {
        [JsonProperty("_active_nodes")]
        public List<string> ActiveNodes { get; set; }

        [JsonProperty("_node_count")]
        public int NodeCount { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
