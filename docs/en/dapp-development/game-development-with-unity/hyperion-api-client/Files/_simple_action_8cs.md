---
title: HyperionApiClient/Models/SimpleAction.cs

---

# HyperionApiClient/Models/SimpleAction.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::SimpleAction](/Classes/class_hyperion_api_client_1_1_models_1_1_simple_action.md)**  |




## Source code

```csharp
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class SimpleAction 
    {
        [JsonProperty("block", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double Block { get; set; }
    
        [JsonProperty("timestamp", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Timestamp { get; set; }
    
        [JsonProperty("irreversible", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public bool Irreversible { get; set; }
    
        [JsonProperty("contract", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Contract { get; set; }
    
        [JsonProperty("action", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Action { get; set; }
    
        [JsonProperty("actors", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Actors { get; set; }
    
        [JsonProperty("notified", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Notified { get; set; }
    
        [JsonProperty("transaction_id", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string TransactionId { get; set; }
    
        [JsonProperty("data", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public object Data { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
