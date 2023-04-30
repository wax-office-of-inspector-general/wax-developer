---
title: HyperionApiClient/Responses/GetBlockResponse2.cs

---

# HyperionApiClient/Responses/GetBlockResponse2.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Responses](/Namespaces/namespace_hyperion_api_client_1_1_responses.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Responses::GetBlockResponse2](/Classes/class_hyperion_api_client_1_1_responses_1_1_get_block_response2.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using HyperionApiClient.Models;
using Newtonsoft.Json;

namespace HyperionApiClient.Responses
{
    public class GetBlockResponse2
    {
        [JsonProperty("timestamp")]
        public string Timestamp { get; set; }

        [JsonProperty("producer")]
        public string Producer { get; set; }

        [JsonProperty("confirmed")]
        public int Confirmed { get; set; }

        [JsonProperty("previous")]
        public string Previous { get; set; }

        [JsonProperty("transaction_mroot")]
        public string TransactionMroot { get; set; }

        [JsonProperty("action_mroot")]
        public string ActionMroot { get; set; }

        [JsonProperty("schedule_version")]
        public int ScheduleVersion { get; set; }

        [JsonProperty("new_producers")]
        public object NewProducers { get; set; }

        [JsonProperty("producer_signature")]
        public string ProducerSignature { get; set; }

        [JsonProperty("transactions")]
        public List<Transaction3> Transactions { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("block_num")]
        public uint BlockNum { get; set; }

        [JsonProperty("ref_block_prefix")]
        public int RefBlockPrefix { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
