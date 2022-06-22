---
title: HyperionApiClient/Models/Abi.cs

---

# HyperionApiClient/Models/Abi.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Abi](/Classes/class_hyperion_api_client_1_1_models_1_1_abi.md)**  |




## Source code

```csharp
using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Abi
    {
        [JsonProperty("version")]
        public string Version { get; set; }

        [JsonProperty("types")]
        public List<object> Types { get; set; }

        [JsonProperty("structs")]
        public List<Struct> Structs { get; set; }

        [JsonProperty("actions")]
        public List<Action7> Actions { get; set; }

        [JsonProperty("tables")]
        public List<Table> Tables { get; set; }

        [JsonProperty("ricardian_clauses")]
        public List<RicardianClaus> RicardianClauses { get; set; }

        [JsonProperty("error_messages")]
        public List<object> ErrorMessages { get; set; }

        [JsonProperty("abi_extensions")]
        public List<object> AbiExtensions { get; set; }

        [JsonProperty("variants")]
        public List<object> Variants { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
