---
title: HyperionApiClient/Models/GetAbiResponse.cs

---

# HyperionApiClient/Models/GetAbiResponse.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::GetAbiResponse](/Classes/class_hyperion_api_client_1_1_models_1_1_get_abi_response.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class GetAbiResponse
    {
        [JsonProperty("account_name")]
        public string AccountName { get; set; }

        [JsonProperty("abi")]
        public Abi Abi { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
