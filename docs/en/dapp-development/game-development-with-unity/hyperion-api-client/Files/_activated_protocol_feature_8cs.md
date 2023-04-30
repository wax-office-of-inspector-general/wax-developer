---
title: HyperionApiClient/Models/ActivatedProtocolFeature.cs

---

# HyperionApiClient/Models/ActivatedProtocolFeature.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::ActivatedProtocolFeature](/Classes/class_hyperion_api_client_1_1_models_1_1_activated_protocol_feature.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class ActivatedProtocolFeature
    {
        [JsonProperty("feature_digest")]
        public string FeatureDigest { get; set; }

        [JsonProperty("activation_ordinal")]
        public int ActivationOrdinal { get; set; }

        [JsonProperty("activation_block_num")]
        public int ActivationBlockNum { get; set; }

        [JsonProperty("description_digest")]
        public string DescriptionDigest { get; set; }

        [JsonProperty("dependencies")]
        public List<string> Dependencies { get; set; }

        [JsonProperty("protocol_feature_type")]
        public string ProtocolFeatureType { get; set; }

        [JsonProperty("specification")]
        public List<Specification> Specification { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
