---
title: HyperionApiClient/Models/Proposal.cs

---

# HyperionApiClient/Models/Proposal.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Proposal](/Classes/class_hyperion_api_client_1_1_models_1_1_proposal.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Proposal
    {
        [JsonProperty("provided_approvals")]
        public List<ProvidedApproval> ProvidedApprovals { get; set; }

        [JsonProperty("block_num")]
        public int BlockNum { get; set; }

        [JsonProperty("proposer")]
        public string Proposer { get; set; }

        [JsonProperty("requested_approvals")]
        public List<RequestedApproval> RequestedApprovals { get; set; }

        [JsonProperty("proposal_name")]
        public string ProposalName { get; set; }

        [JsonProperty("executed")]
        public bool Executed { get; set; }

        [JsonProperty("primary_key")]
        public string PrimaryKey { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
