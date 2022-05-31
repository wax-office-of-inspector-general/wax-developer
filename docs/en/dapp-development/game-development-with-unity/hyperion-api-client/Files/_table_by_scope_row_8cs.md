---
title: HyperionApiClient/Models/TableByScopeRow.cs

---

# HyperionApiClient/Models/TableByScopeRow.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::TableByScopeRow](/Classes/class_hyperion_api_client_1_1_models_1_1_table_by_scope_row.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class TableByScopeRow
    {
        [JsonProperty("code")]
        public string Code { get; set; }

        [JsonProperty("scope")]
        public string Scope { get; set; }

        [JsonProperty("table")]
        public string Table { get; set; }

        [JsonProperty("payer")]
        public string Payer { get; set; }

        [JsonProperty("count")]
        public int Count { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
