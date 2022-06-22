---
title: HyperionApiClient/Models/ProducerRow.cs

---

# HyperionApiClient/Models/ProducerRow.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::ProducerRow](/Classes/class_hyperion_api_client_1_1_models_1_1_producer_row.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class ProducerRow
    {
        [JsonProperty("owner")]
        public string Owner { get; set; }

        [JsonProperty("total_votes")]
        public string TotalVotes { get; set; }

        [JsonProperty("producer_key")]
        public string ProducerKey { get; set; }

        [JsonProperty("is_active")]
        public int IsActive { get; set; }

        [JsonProperty("url")]
        public string Url { get; set; }

        [JsonProperty("unpaid_blocks")]
        public int UnpaidBlocks { get; set; }

        [JsonProperty("last_claim_time")]
        public string LastClaimTime { get; set; }

        [JsonProperty("location")]
        public int Location { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
