---
title: HyperionApiClient/Models/Transaction.cs

---

# HyperionApiClient/Models/Transaction.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Transaction](/Classes/class_hyperion_api_client_1_1_models_1_1_transaction.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Transaction 
    {
        [JsonProperty("id", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Id { get; set; }
    
        [JsonProperty("actions", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public ICollection<Action4> Actions { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
