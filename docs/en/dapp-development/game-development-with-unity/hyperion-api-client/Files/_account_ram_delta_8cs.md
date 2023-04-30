---
title: HyperionApiClient/Models/AccountRamDelta.cs

---

# HyperionApiClient/Models/AccountRamDelta.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::AccountRamDelta](/Classes/class_hyperion_api_client_1_1_models_1_1_account_ram_delta.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class AccountRamDelta 
    {
        [JsonProperty("account", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Account { get; set; }
    
        [JsonProperty("delta", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double Delta { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
