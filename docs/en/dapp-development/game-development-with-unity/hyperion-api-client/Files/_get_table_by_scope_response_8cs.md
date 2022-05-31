---
title: HyperionApiClient/Responses/GetTableByScopeResponse.cs

---

# HyperionApiClient/Responses/GetTableByScopeResponse.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Responses](/Namespaces/namespace_hyperion_api_client_1_1_responses.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Responses::GetTableByScopeResponse](/Classes/class_hyperion_api_client_1_1_responses_1_1_get_table_by_scope_response.md)**  |




## Source code

```csharp
using System;
using System.Collections.Generic;
using System.Text;
using HyperionApiClient.Models;
using Newtonsoft.Json;

namespace HyperionApiClient.Responses
{
    public class GetTableByScopeResponse
    {
        [JsonProperty("rows")]
        public List<TableByScopeRow> Rows { get; set; }

        [JsonProperty("more")]
        public string More { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
