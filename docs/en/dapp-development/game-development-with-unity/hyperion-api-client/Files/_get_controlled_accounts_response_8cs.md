---
title: HyperionApiClient/Responses/GetControlledAccountsResponse.cs

---

# HyperionApiClient/Responses/GetControlledAccountsResponse.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Responses](/Namespaces/namespace_hyperion_api_client_1_1_responses.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Responses::GetControlledAccountsResponse](/Classes/class_hyperion_api_client_1_1_responses_1_1_get_controlled_accounts_response.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Responses
{
    public class GetControlledAccountsResponse 
    {
        [JsonProperty("controlled_accounts", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public ICollection<string> ControlledAccounts { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
