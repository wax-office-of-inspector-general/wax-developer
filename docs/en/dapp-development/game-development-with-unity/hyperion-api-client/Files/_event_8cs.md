---
title: HyperionApiClient/Models/Event.cs

---

# HyperionApiClient/Models/Event.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Event](/Classes/class_hyperion_api_client_1_1_models_1_1_event.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Event 
    {
        [JsonProperty("@timestamp", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Timestamp { get; set; }
    
        [JsonProperty("last_block", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double LastBlock { get; set; }
    
        [JsonProperty("schedule_version", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double ScheduleVersion { get; set; }
    
        [JsonProperty("size", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double Size { get; set; }
    
        [JsonProperty("producer", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Producer { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
