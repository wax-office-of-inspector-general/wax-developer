---
title: HyperionApiClient/Models/Receipt.cs

---

# HyperionApiClient/Models/Receipt.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Receipt](/Classes/class_hyperion_api_client_1_1_models_1_1_receipt.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Receipt 
    {
        [JsonProperty("receiver", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public string Receiver { get; set; }
    
        [JsonProperty("global_sequence", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double GlobalSequence { get; set; }
    
        [JsonProperty("recv_sequence", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public double RecvSequence { get; set; }
    
        [JsonProperty("auth_sequence", Required = Required.DisallowNull, NullValueHandling = NullValueHandling.Ignore)]
        public ICollection<AuthSequence> AuthSequence { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
