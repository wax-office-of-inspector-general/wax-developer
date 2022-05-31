---
title: HyperionApiClient/Models/Account2.cs

---

# HyperionApiClient/Models/Account2.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Models::Account2](/Classes/class_hyperion_api_client_1_1_models_1_1_account2.md)**  |




## Source code

```csharp
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HyperionApiClient.Models
{
    public class Account2
    {
        [JsonProperty("account_name")]
        public string AccountName { get; set; }

        [JsonProperty("head_block_num")]
        public int HeadBlockNum { get; set; }

        [JsonProperty("head_block_time")]
        public string HeadBlockTime { get; set; }

        [JsonProperty("privileged")]
        public bool Privileged { get; set; }

        [JsonProperty("last_code_update")]
        public string LastCodeUpdate { get; set; }

        [JsonProperty("created")]
        public string Created { get; set; }

        [JsonProperty("core_liquid_balance")]
        public string CoreLiquidBalance { get; set; }

        [JsonProperty("ram_quota")]
        public int RamQuota { get; set; }

        [JsonProperty("net_weight")]
        public int NetWeight { get; set; }

        [JsonProperty("cpu_weight")]
        public int CpuWeight { get; set; }

        [JsonProperty("net_limit")]
        public NetLimit NetLimit { get; set; }

        [JsonProperty("cpu_limit")]
        public CpuLimit CpuLimit { get; set; }

        [JsonProperty("ram_usage")]
        public int RamUsage { get; set; }

        [JsonProperty("permissions")]
        public List<Permission2> Permissions { get; set; }

        [JsonProperty("total_resources")]
        public TotalResources TotalResources { get; set; }

        [JsonProperty("self_delegated_bandwidth")]
        public object SelfDelegatedBandwidth { get; set; }

        [JsonProperty("refund_request")]
        public object RefundRequest { get; set; }

        [JsonProperty("voter_info")]
        public VoterInfo VoterInfo { get; set; }

        [JsonProperty("rex_info")]
        public object RexInfo { get; set; }

        [JsonProperty("subjective_cpu_bill_limit")]
        public SubjectiveCpuBillLimit SubjectiveCpuBillLimit { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
