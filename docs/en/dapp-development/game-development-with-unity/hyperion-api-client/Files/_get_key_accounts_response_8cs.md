---
title: HyperionApiClient/Responses/GetKeyAccountsResponse.cs

---

# HyperionApiClient/Responses/GetKeyAccountsResponse.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Responses](/Namespaces/namespace_hyperion_api_client_1_1_responses.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Responses::GetKeyAccountsResponse](/Classes/class_hyperion_api_client_1_1_responses_1_1_get_key_accounts_response.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Responses
{
    public class GetKeyAccountsResponse
    {
        [JsonProperty("account_names", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public ICollection<string> AccountNames { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
