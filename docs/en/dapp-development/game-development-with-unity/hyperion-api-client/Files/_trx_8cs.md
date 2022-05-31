---
title: HyperionApiClient/Models/Trx.cs

---

# HyperionApiClient/Models/Trx.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Trx](/Classes/class_hyperion_api_client_1_1_models_1_1_trx.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Trx
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("signatures")]
        public List<string> Signatures { get; set; }

        [JsonProperty("compression")]
        public string Compression { get; set; }

        [JsonProperty("packed_context_free_data")]
        public string PackedContextFreeData { get; set; }

        [JsonProperty("context_free_data")]
        public List<object> ContextFreeData { get; set; }

        [JsonProperty("packed_trx")]
        public string PackedTrx { get; set; }

        [JsonProperty("transaction")]
        public Transaction2 Transaction { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
