---
title: HyperionApiClient/Responses/GetCodeResponse.cs

---

# HyperionApiClient/Responses/GetCodeResponse.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Responses](/Namespaces/namespace_hyperion_api_client_1_1_responses.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Responses::GetCodeResponse](/Classes/class_hyperion_api_client_1_1_responses_1_1_get_code_response.md)**  |




## Source code

```csharp
using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace HyperionApiClient.Responses
{
    public class GetCodeResponse
    {
        [JsonProperty("account_name")]
        public string AccountName { get; set; }

        [JsonProperty("code_hash")]
        public string CodeHash { get; set; }

        [JsonProperty("wast")]
        public string Wast { get; set; }

        [JsonProperty("wasm")]
        public string Wasm { get; set; }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
