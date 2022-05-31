---
title: HyperionApiClient/Models/Header.cs

---

# HyperionApiClient/Models/Header.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Header](/Classes/class_hyperion_api_client_1_1_models_1_1_header.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Header
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

        [JsonProperty("header_extensions")]
        public List<object> HeaderExtensions { get; set; }

        [JsonProperty("producer_signature")]
        public string ProducerSignature { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
