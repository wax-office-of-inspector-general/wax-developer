---
title: HyperionApiClient/Models/Schedule.cs

---

# HyperionApiClient/Models/Schedule.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Schedule](/Classes/class_hyperion_api_client_1_1_models_1_1_schedule.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Schedule
    {
        [JsonProperty("version")]
        public int Version { get; set; }

        [JsonProperty("producers")]
        public List<object> Producers { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
