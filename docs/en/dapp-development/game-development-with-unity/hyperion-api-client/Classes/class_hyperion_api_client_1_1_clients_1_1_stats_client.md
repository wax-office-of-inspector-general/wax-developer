---
title: HyperionApiClient::Clients::StatsClient

---

# HyperionApiClient::Clients::StatsClient





Inherits from ClientExtensions

## Public Functions

|                | Name           |
| -------------- | -------------- |
| | **[StatsClient](/Classes/class_hyperion_api_client_1_1_clients_1_1_stats_client.md#function-statsclient)**(HttpClient httpClient) |
| async Task< GetActionUsageResponse > | **[GetActionUsageAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_stats_client.md#function-getactionusageasync)**(string period, string endDate =null, bool? uniqueActors =null, CancellationToken cancellationToken =default) =default<br>get action and transaction stats for a given period  |
| async Task< GetMissedBlocksResponse > | **[GetMissedBlocksAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_stats_client.md#function-getmissedblocksasync)**(string producer =null, string after =null, string before =null, int? minBlocks =null, CancellationToken cancellationToken =default) =default<br>get missed blocks  |
| async Task< GetResourceUsageResponse > | **[GetResourceUsageAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_stats_client.md#function-getresourceusageasync)**(string code, string action, CancellationToken cancellationToken =default) =default<br>get resource usage stats for a specific action  |

## Public Properties

|                | Name           |
| -------------- | -------------- |
| string | **[BaseUrl](/Classes/class_hyperion_api_client_1_1_clients_1_1_stats_client.md#property-baseurl)**  |

## Public Functions Documentation

### function StatsClient

```csharp
StatsClient(
    HttpClient httpClient
)
```


### function GetActionUsageAsync

```csharp
async Task< GetActionUsageResponse > GetActionUsageAsync(
    string period,
    string endDate =null,
    bool? uniqueActors =null,
    CancellationToken cancellationToken =default
) =default
```

get action and transaction stats for a given period 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **period** analysis period
  * **end_date** final date
  * **unique_actors** compute unique actors


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function GetMissedBlocksAsync

```csharp
async Task< GetMissedBlocksResponse > GetMissedBlocksAsync(
    string producer =null,
    string after =null,
    string before =null,
    int? minBlocks =null,
    CancellationToken cancellationToken =default
) =default
```

get missed blocks 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **producer** filter by producer
  * **after** filter after specified date (ISO8601)
  * **before** filter before specified date (ISO8601)
  * **min_blocks** min. blocks threshold


**Exceptions**: 

  * **ApiException** A server side error occurred.


### function GetResourceUsageAsync

```csharp
async Task< GetResourceUsageResponse > GetResourceUsageAsync(
    string code,
    string action,
    CancellationToken cancellationToken =default
) =default
```

get resource usage stats for a specific action 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **code** contract
  * **action** action name


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

## Public Property Documentation

### property BaseUrl

```csharp
string BaseUrl = "https://api.wax.liquidstudios.io/";
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000