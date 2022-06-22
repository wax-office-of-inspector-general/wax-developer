---
title: HyperionApiClient/Responses/GetKeyAccountsWithPermissionsResponse.cs

---

# HyperionApiClient/Responses/GetKeyAccountsWithPermissionsResponse.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Responses](/Namespaces/namespace_hyperion_api_client_1_1_responses.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Responses::GetKeyAccountsWithPermissionsResponse](/Classes/class_hyperion_api_client_1_1_responses_1_1_get_key_accounts_with_permissions_response.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using HyperionApiClient.Models;
using Newtonsoft.Json;

namespace HyperionApiClient.Responses
{
    public class GetKeyAccountsWithPermissionsResponse : GetKeyAccountsResponse
    {
        [JsonProperty("permissions", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public ICollection<Permission> Permissions { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
