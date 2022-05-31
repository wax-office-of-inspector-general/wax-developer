---
title: HyperionApiClient/Models/Features.cs

---

# HyperionApiClient/Models/Features.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Features](/Classes/class_hyperion_api_client_1_1_models_1_1_features.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Features
    {
        [JsonProperty("streaming")]
        public Streaming Streaming { get; set; }

        [JsonProperty("tables")]
        public Tables Tables { get; set; }

        [JsonProperty("index_deltas")]
        public bool IndexDeltas { get; set; }

        [JsonProperty("index_transfer_memo")]
        public bool IndexTransferMemo { get; set; }

        [JsonProperty("index_all_deltas")]
        public bool IndexAllDeltas { get; set; }

        [JsonProperty("deferred_trx")]
        public bool DeferredTrx { get; set; }

        [JsonProperty("failed_trx")]
        public bool FailedTrx { get; set; }

        [JsonProperty("resource_limits")]
        public bool ResourceLimits { get; set; }

        [JsonProperty("resource_usage")]
        public bool ResourceUsage { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
