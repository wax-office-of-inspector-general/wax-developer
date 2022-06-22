---
title: HyperionApiClient/Models/Producer2.cs

---

# HyperionApiClient/Models/Producer2.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Producer2](/Classes/class_hyperion_api_client_1_1_models_1_1_producer2.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Producer2
    {
        [JsonProperty("producer_name")]
        public string ProducerName { get; set; }

        [JsonProperty("authority")]
        public List<object> Authority { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
