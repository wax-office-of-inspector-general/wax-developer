---
title: HyperionApiClient/Models/VoterInfo.cs

---

# HyperionApiClient/Models/VoterInfo.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::VoterInfo](/Classes/class_hyperion_api_client_1_1_models_1_1_voter_info.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class VoterInfo
    {
        [JsonProperty("owner")]
        public string Owner { get; set; }

        [JsonProperty("proxy")]
        public string Proxy { get; set; }

        [JsonProperty("producers")]
        public List<object> Producers { get; set; }

        [JsonProperty("staked")]
        public string Staked { get; set; }

        [JsonProperty("unpaid_voteshare")]
        public string UnpaidVoteshare { get; set; }

        [JsonProperty("unpaid_voteshare_last_updated")]
        public string UnpaidVoteshareLastUpdated { get; set; }

        [JsonProperty("unpaid_voteshare_change_rate")]
        public string UnpaidVoteshareChangeRate { get; set; }

        [JsonProperty("last_claim_time")]
        public string LastClaimTime { get; set; }

        [JsonProperty("last_vote_weight")]
        public string LastVoteWeight { get; set; }

        [JsonProperty("proxied_vote_weight")]
        public string ProxiedVoteWeight { get; set; }

        [JsonProperty("is_proxy")]
        public int IsProxy { get; set; }

        [JsonProperty("flags1")]
        public int Flags1 { get; set; }

        [JsonProperty("reserved2")]
        public int Reserved2 { get; set; }

        [JsonProperty("reserved3")]
        public string Reserved3 { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
