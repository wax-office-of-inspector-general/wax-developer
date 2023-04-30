---
title: HyperionApiClient/Models/ActiveSchedule.cs

---

# HyperionApiClient/Models/ActiveSchedule.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::ActiveSchedule](/Classes/class_hyperion_api_client_1_1_models_1_1_active_schedule.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class ActiveSchedule
    {
        [JsonProperty("version")]
        public int Version { get; set; }

        [JsonProperty("producers")]
        public List<Producer2> Producers { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
