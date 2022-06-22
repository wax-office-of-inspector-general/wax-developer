---
title: HyperionApiClient/Models/RequiredAuth.cs

---

# HyperionApiClient/Models/RequiredAuth.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::RequiredAuth](/Classes/class_hyperion_api_client_1_1_models_1_1_required_auth.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class RequiredAuth
    {
        [JsonProperty("threshold")]
        public int Threshold { get; set; }

        [JsonProperty("keys")]
        public List<string> Keys { get; set; }

        [JsonProperty("accounts")]
        public List<Account> Accounts { get; set; }

        [JsonProperty("waits")]
        public List<string> Waits { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
