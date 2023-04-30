---
title: HyperionApiClient/Models/Account.cs

---

# HyperionApiClient/Models/Account.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Account](/Classes/class_hyperion_api_client_1_1_models_1_1_account.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Account 
    {
        [JsonProperty("name", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Name { get; set; }
    
        [JsonProperty("timestamp", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Timestamp { get; set; }
    
        [JsonProperty("trx_id", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string TrxId { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
