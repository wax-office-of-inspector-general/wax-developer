---
title: HyperionApiClient::Clients::HistoryClient

---

# HyperionApiClient::Clients::HistoryClient





Inherits from ClientExtensions

## Public Functions

|                | Name           |
| -------------- | -------------- |
| | **[HistoryClient](/Classes/class_hyperion_api_client_1_1_clients_1_1_history_client.md#function-historyclient)**(HttpClient httpClient) |
| async Task< GetApiSnapshotResponse > | **[GetAbiSnapshotAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_history_client.md#function-getabisnapshotasync)**(string contract, int? block =null, bool? fetch =null, CancellationToken cancellationToken =default) =default<br>fetch abi at specific block  |
| async Task< GetActionsResponse > | **[GetActionsAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_history_client.md#function-getactionsasync)**(int? limit =null, int? skip =null, string account =null, string track =null, string filter =null, [Sort](/Namespaces/namespace_hyperion_api_client_1_1_models.md#enum-sort)? sort =null, string after =null, string before =null, bool? simple =null, bool? hotOnly =null, bool? noBinary =null, bool? checkLib =null, CancellationToken cancellationToken =default) =default<br>get root actions  |
| async Task< GetDeltasResponse > | **[GetDeltasAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_history_client.md#function-getdeltasasync)**(int? limit =null, int? skip =null, string code =null, string scope =null, string table =null, string payer =null, string after =null, string before =null, CancellationToken cancellationToken =default) =default<br>get state deltas  |
| async Task< GetScheduleResponse > | **[GetScheduleAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_history_client.md#function-getscheduleasync)**(string producer =null, string key =null, string after =null, string before =null, int? version =null, CancellationToken cancellationToken =default) =default<br>get producer schedule by version  |
| async Task< GetTransactionResponse > | **[GetTransactionAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_history_client.md#function-gettransactionasync)**(string id, CancellationToken cancellationToken =default) =default<br>get transaction by id  |
| async Task< GetBlockResponse > | **[GetBlockAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_history_client.md#function-getblockasync)**(uint? blockNum =null, string blockId =null, CancellationToken cancellationToken =default) =default<br>get block traces  |

## Public Properties

|                | Name           |
| -------------- | -------------- |
| string | **[BaseUrl](/Classes/class_hyperion_api_client_1_1_clients_1_1_history_client.md#property-baseurl)**  |

## Public Functions Documentation

### function HistoryClient

```csharp
HistoryClient(
    HttpClient httpClient
)
```


### function GetAbiSnapshotAsync

```csharp
async Task< GetApiSnapshotResponse > GetAbiSnapshotAsync(
    string contract,
    int? block =null,
    bool? fetch =null,
    CancellationToken cancellationToken =default
) =default
```

fetch abi at specific block 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **contract** contract account
  * **block** target block
  * **fetch** should fetch the ABI


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function GetActionsAsync

```csharp
async Task< GetActionsResponse > GetActionsAsync(
    int? limit =null,
    int? skip =null,
    string account =null,
    string track =null,
    string filter =null,
    Sort? sort =null,
    string after =null,
    string before =null,
    bool? simple =null,
    bool? hotOnly =null,
    bool? noBinary =null,
    bool? checkLib =null,
    CancellationToken cancellationToken =default
) =default
```

get root actions 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **limit** limit of [n] results per page
  * **skip** skip [n] results
  * **account** notified account
  * **track** total results to track (count) [number or true]
  * **filter** code:name filter
  * **sort** sort direction
  * **after** filter after specified date (ISO8601)
  * **before** filter before specified date (ISO8601)
  * **simple** simplified output mode
  * **hotOnly** search only the latest hot index
  * **noBinary** exclude large binary data
  * **checkLib** perform reversibility check


**Exceptions**: 

  * **ApiException** A server side error occurred.


### function GetDeltasAsync

```csharp
async Task< GetDeltasResponse > GetDeltasAsync(
    int? limit =null,
    int? skip =null,
    string code =null,
    string scope =null,
    string table =null,
    string payer =null,
    string after =null,
    string before =null,
    CancellationToken cancellationToken =default
) =default
```

get state deltas 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **limit** limit of [n] results per page
  * **skip** skip [n] results
  * **code** contract account
  * **scope** table scope
  * **table** table name
  * **payer** payer account
  * **after** filter after specified date (ISO8601)
  * **before** filter before specified date (ISO8601)


**Exceptions**: 

  * **ApiException** A server side error occurred.


### function GetScheduleAsync

```csharp
async Task< GetScheduleResponse > GetScheduleAsync(
    string producer =null,
    string key =null,
    string after =null,
    string before =null,
    int? version =null,
    CancellationToken cancellationToken =default
) =default
```

get producer schedule by version 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **producer** search by producer
  * **key** search by key
  * **after** filter after specified date (ISO8601)
  * **before** filter before specified date (ISO8601)
  * **version** schedule version


**Exceptions**: 

  * **ApiException** A server side error occurred.


### function GetTransactionAsync

```csharp
async Task< GetTransactionResponse > GetTransactionAsync(
    string id,
    CancellationToken cancellationToken =default
) =default
```

get transaction by id 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **id** transaction id


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function GetBlockAsync

```csharp
async Task< GetBlockResponse > GetBlockAsync(
    uint? blockNum =null,
    string blockId =null,
    CancellationToken cancellationToken =default
) =default
```

get block traces 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.


**Exceptions**: 

  * **ApiException** A server side error occurred.


## Public Property Documentation

### property BaseUrl

```csharp
string BaseUrl = "https://api.wax.liquidstudios.io/";
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000