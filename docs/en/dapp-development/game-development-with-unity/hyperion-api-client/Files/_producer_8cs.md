---
title: HyperionApiClient/Models/Producer.cs

---

# HyperionApiClient/Models/Producer.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Producer](/Classes/class_hyperion_api_client_1_1_models_1_1_producer.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Producer 
    {
        [JsonProperty("producer_name", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string ProducerName { get; set; }
    
        [JsonProperty("block_signing_key", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string BlockSigningKey { get; set; }
    
        [JsonProperty("legacy_key", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string LegacyKey { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
