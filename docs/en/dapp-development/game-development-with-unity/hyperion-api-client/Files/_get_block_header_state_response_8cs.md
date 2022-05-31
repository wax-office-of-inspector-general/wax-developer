---
title: HyperionApiClient/Responses/GetBlockHeaderStateResponse.cs

---

# HyperionApiClient/Responses/GetBlockHeaderStateResponse.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Responses](/Namespaces/namespace_hyperion_api_client_1_1_responses.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Responses::GetBlockHeaderStateResponse](/Classes/class_hyperion_api_client_1_1_responses_1_1_get_block_header_state_response.md)**  |




## Source code

```csharp
using System;
using System.Collections.Generic;
using System.Text;
using HyperionApiClient.Models;
using Newtonsoft.Json;

namespace HyperionApiClient.Responses
{
    public class GetBlockHeaderStateResponse
    {
        [JsonProperty("block_num")]
        public int BlockNum { get; set; }

        [JsonProperty("dpos_proposed_irreversible_blocknum")]
        public int DposProposedIrreversibleBlocknum { get; set; }

        [JsonProperty("dpos_irreversible_blocknum")]
        public int DposIrreversibleBlocknum { get; set; }

        [JsonProperty("active_schedule")]
        public ActiveSchedule ActiveSchedule { get; set; }

        [JsonProperty("blockroot_merkle")]
        public BlockrootMerkle BlockrootMerkle { get; set; }

        [JsonProperty("producer_to_last_produced")]
        public List<List<object>> ProducerToLastProduced { get; set; }

        [JsonProperty("producer_to_last_implied_irb")]
        public List<List<object>> ProducerToLastImpliedIrb { get; set; }

        [JsonProperty("valid_block_signing_authority")]
        public List<object> ValidBlockSigningAuthority { get; set; }

        [JsonProperty("confirm_count")]
        public List<int> ConfirmCount { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("header")]
        public Header Header { get; set; }

        [JsonProperty("pending_schedule")]
        public PendingSchedule PendingSchedule { get; set; }

        [JsonProperty("activated_protocol_features")]
        public ActivatedProtocolFeatures ActivatedProtocolFeatures { get; set; }

        [JsonProperty("additional_signatures")]
        public List<object> AdditionalSignatures { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
