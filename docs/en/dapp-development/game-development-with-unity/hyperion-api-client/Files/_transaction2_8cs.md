---
title: HyperionApiClient/Models/Transaction2.cs

---

# HyperionApiClient/Models/Transaction2.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Transaction2](/Classes/class_hyperion_api_client_1_1_models_1_1_transaction2.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Transaction2
    {
        [JsonProperty("expiration")]
        public string Expiration { get; set; }

        [JsonProperty("ref_block_num")]
        public int RefBlockNum { get; set; }

        [JsonProperty("ref_block_prefix")]
        public long RefBlockPrefix { get; set; }

        [JsonProperty("max_net_usage_words")]
        public int MaxNetUsageWords { get; set; }

        [JsonProperty("max_cpu_usage_ms")]
        public int MaxCpuUsageMs { get; set; }

        [JsonProperty("delay_sec")]
        public int DelaySec { get; set; }

        [JsonProperty("context_free_actions")]
        public List<object> ContextFreeActions { get; set; }

        [JsonProperty("actions")]
        public List<Action5> Actions { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
