---
title: HyperionApiClient/Models/PendingSchedule.cs

---

# HyperionApiClient/Models/PendingSchedule.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::PendingSchedule](/Classes/class_hyperion_api_client_1_1_models_1_1_pending_schedule.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class PendingSchedule
    {
        [JsonProperty("schedule_lib_num")]
        public int ScheduleLibNum { get; set; }

        [JsonProperty("schedule_hash")]
        public string ScheduleHash { get; set; }

        [JsonProperty("schedule")]
        public Schedule Schedule { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
