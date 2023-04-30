---
title: HyperionApiClient/Models/RequestedApproval.cs

---

# HyperionApiClient/Models/RequestedApproval.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::RequestedApproval](/Classes/class_hyperion_api_client_1_1_models_1_1_requested_approval.md)**  |




## Source code

```csharp
using System;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class RequestedApproval
    {
        [JsonProperty("actor")]
        public string Actor { get; set; }

        [JsonProperty("permission")]
        public string Permission { get; set; }

        [JsonProperty("time")]
        public DateTime Time { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
