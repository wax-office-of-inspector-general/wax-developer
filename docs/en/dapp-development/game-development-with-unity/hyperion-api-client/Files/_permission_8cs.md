---
title: HyperionApiClient/Models/Permission.cs

---

# HyperionApiClient/Models/Permission.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Permission](/Classes/class_hyperion_api_client_1_1_models_1_1_permission.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Permission 
    {
        [JsonProperty("owner", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Owner { get; set; }
    
        [JsonProperty("block_num", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public int BlockNum { get; set; }
    
        [JsonProperty("parent", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Parent { get; set; }
    
        [JsonProperty("last_updated", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string LastUpdated { get; set; }
    
        [JsonProperty("auth", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public object Auth { get; set; }
    
        [JsonProperty("name", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Name { get; set; }
    
        [JsonProperty("present", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public bool Present { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
