---
title: HyperionApiClient/Models/Sort.cs

---

# HyperionApiClient/Models/Sort.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Models](/Namespaces/namespace_hyperion_api_client_1_1_models.md)**  |




## Source code

```csharp
using System.Runtime.Serialization;

namespace HyperionApiClient.Models
{
    public enum Sort
    {
        [EnumMember(Value = @"desc")]
        Desc = 0,
    
        [EnumMember(Value = @"asc")]
        Asc = 1,
    
        [EnumMember(Value = @"1")]
        _1 = 2,
    
        [EnumMember(Value = @"-1")]
        Minus1 = 3,
    
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
