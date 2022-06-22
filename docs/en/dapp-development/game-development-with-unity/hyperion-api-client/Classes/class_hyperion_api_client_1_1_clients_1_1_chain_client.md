---
title: HyperionApiClient::Clients::ChainClient

---

# HyperionApiClient::Clients::ChainClient





Inherits from ClientExtensions

## Public Functions

|                | Name           |
| -------------- | -------------- |
| | **[ChainClient](/Classes/class_hyperion_api_client_1_1_clients_1_1_chain_client.md#function-chainclient)**(HttpClient httpClient) |
| async Task | **[AbiBinToJsonAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_chain_client.md#function-abibintojsonasync)**(string code, string action, string binargs, CancellationToken cancellationToken =default) =default<br>Returns an object containing rows from the specified table.  |
| async Task | **[AbiJsonToBinAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_chain_client.md#function-abijsontobinasync)**(string binargs, CancellationToken cancellationToken =default) =default<br>Convert JSON object to binary  |
| async Task< GetAbiResponse > | **[GetAbiAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_chain_client.md#function-getabiasync)**(string accountName, CancellationToken cancellationToken =default) =default<br>Retrieves the ABI for a contract based on its account name  |
| async Task< GetAccountResponse2 > | **[GetAccountAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_chain_client.md#function-getaccountasync)**(string accountName, CancellationToken cancellationToken =default) =default<br>Returns an object containing various details about a specific account on the blockchain.  |
| async Task< GetActivatedProtocolFeaturesResponse > | **[GetActivatedProtocolFeaturesAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_chain_client.md#function-getactivatedprotocolfeaturesasync)**(int? lowerBound =null, int? upperBound =null, int? limit =null, bool? searchByBlockNum =null, bool? reverse =null, CancellationToken cancellationToken =default) =default<br>Retreives the activated protocol features for producer node  |
| async Task< GetBlockResponse2 > | **[GetBlockAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_chain_client.md#function-getblockasync)**(string blockNumOrId, CancellationToken cancellationToken =default) =default<br>Returns an object containing various details about a specific block on the blockchain.  |
| async Task< GetBlockHeaderStateResponse > | **[GetBlockHeaderStateAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_chain_client.md#function-getblockheaderstateasync)**(string blockNumOrId, CancellationToken cancellationToken =default) =default<br>Retrieves the block header state  |
| async Task< GetCodeResponse > | **[GetCodeAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_chain_client.md#function-getcodeasync)**(string accountName, bool codeAsWasm, CancellationToken cancellationToken =default) =default<br>Retrieves contract code  |
| async Task< List< string > > | **[GetCurrencyBalanceAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_chain_client.md#function-getcurrencybalanceasync)**(string code, string account, string symbol, CancellationToken cancellationToken =default) =default<br>Retrieves the current balance  |
| async Task< string > | **[GetCurrencyStatsAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_chain_client.md#function-getcurrencystatsasync)**(string code, string symbol, CancellationToken cancellationToken =default) =default<br>Retrieves currency stats  |
| async Task< GetInfoResponse > | **[GetInfoAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_chain_client.md#function-getinfoasync)**(CancellationToken cancellationToken =default) =default<br>Returns an object containing various details about the blockchain.  |
| async Task< GetProducersResponse > | **[GetProducersAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_chain_client.md#function-getproducersasync)**(string limit =null, string lowerBound =null, bool? json =null, CancellationToken cancellationToken =default) =default<br>Retrieves producers list  |
| async Task | **[GetRawAbiAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_chain_client.md#function-getrawabiasync)**(string accountName, CancellationToken cancellationToken =default) =default<br>Retrieves raw ABI for a contract based on account name  |
| async Task | **[GetRawCodeAndAbiAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_chain_client.md#function-getrawcodeandabiasync)**(string accountName, CancellationToken cancellationToken =default) =default<br>Retrieves raw code and ABI for a contract based on account name  |
| async Task | **[GetScheduledTransactionAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_chain_client.md#function-getscheduledtransactionasync)**(string lowerBound =null, int? limit =null, bool? json =null, CancellationToken cancellationToken =default) =default<br>Retrieves the scheduled transaction  |
| async Task< GetTableByScopeResponse > | **[GetTableByScopeAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_chain_client.md#function-gettablebyscopeasync)**(string code, string table =null, string lowerBound =null, string upperBound =null, int? limit =null, bool? reverse =null, CancellationToken cancellationToken =default) =default<br>Retrieves table scope  |
| async Task | **[GetTableRowsAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_chain_client.md#function-gettablerowsasync)**(string code =null, string table =null, string scope =null, string indexPosition =null, string keyType =null, string encodeType =null, string upperBound =null, string lowerBound =null, CancellationToken cancellationToken =default) =default<br>Returns an object containing rows from the specified table.  |
| async Task | **[PushTransactionAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_chain_client.md#function-pushtransactionasync)**(object body =null, CancellationToken cancellationToken =default) =default<br>This method expects a transaction in JSON format and will attempt to apply it to the blockchain.  |
| async Task | **[PushTransactionsAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_chain_client.md#function-pushtransactionsasync)**(IEnumerable< object > body =null, CancellationToken cancellationToken =default) =default<br>This method expects a transaction in JSON format and will attempt to apply it to the blockchain.  |
| async Task | **[SendTransactionAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_chain_client.md#function-sendtransactionasync)**(object body =null, CancellationToken cancellationToken =default) =default<br>This method expects a transaction in JSON format and will attempt to apply it to the blockchain.  |

## Public Properties

|                | Name           |
| -------------- | -------------- |
| string | **[BaseUrl](/Classes/class_hyperion_api_client_1_1_clients_1_1_chain_client.md#property-baseurl)**  |

## Public Functions Documentation

### function ChainClient

```csharp
ChainClient(
    HttpClient httpClient
)
```


### function AbiBinToJsonAsync

```csharp
async Task AbiBinToJsonAsync(
    string code,
    string action,
    string binargs,
    CancellationToken cancellationToken =default
) =default
```

Returns an object containing rows from the specified table. 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function AbiJsonToBinAsync

```csharp
async Task AbiJsonToBinAsync(
    string binargs,
    CancellationToken cancellationToken =default
) =default
```

Convert JSON object to binary 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function GetAbiAsync

```csharp
async Task< GetAbiResponse > GetAbiAsync(
    string accountName,
    CancellationToken cancellationToken =default
) =default
```

Retrieves the ABI for a contract based on its account name 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function GetAccountAsync

```csharp
async Task< GetAccountResponse2 > GetAccountAsync(
    string accountName,
    CancellationToken cancellationToken =default
) =default
```

Returns an object containing various details about a specific account on the blockchain. 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function GetActivatedProtocolFeaturesAsync

```csharp
async Task< GetActivatedProtocolFeaturesResponse > GetActivatedProtocolFeaturesAsync(
    int? lowerBound =null,
    int? upperBound =null,
    int? limit =null,
    bool? searchByBlockNum =null,
    bool? reverse =null,
    CancellationToken cancellationToken =default
) =default
```

Retreives the activated protocol features for producer node 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **lower_bound** Lower bound
  * **upper_bound** Upper bound
  * **limit** The limit, default is 10
  * **search_by_block_num** Flag to indicate it is has to search by block number
  * **reverse** Flag to indicate it has to search in reverse


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function GetBlockAsync

```csharp
async Task< GetBlockResponse2 > GetBlockAsync(
    string blockNumOrId,
    CancellationToken cancellationToken =default
) =default
```

Returns an object containing various details about a specific block on the blockchain. 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **block_num_or_id** Provide a `block number` or a `block id`


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function GetBlockHeaderStateAsync

```csharp
async Task< GetBlockHeaderStateResponse > GetBlockHeaderStateAsync(
    string blockNumOrId,
    CancellationToken cancellationToken =default
) =default
```

Retrieves the block header state 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **blockNumOrId** Provide a block_number or a block_id


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function GetCodeAsync

```csharp
async Task< GetCodeResponse > GetCodeAsync(
    string accountName,
    bool codeAsWasm,
    CancellationToken cancellationToken =default
) =default
```

Retrieves contract code 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **code_as_wasm** This must be 1 (true)


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function GetCurrencyBalanceAsync

```csharp
async Task< List< string > > GetCurrencyBalanceAsync(
    string code,
    string account,
    string symbol,
    CancellationToken cancellationToken =default
) =default
```

Retrieves the current balance 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **symbol** A symbol composed of capital letters between 1-7.


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function GetCurrencyStatsAsync

```csharp
async Task< string > GetCurrencyStatsAsync(
    string code,
    string symbol,
    CancellationToken cancellationToken =default
) =default
```

Retrieves currency stats 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **code** contract name
  * **symbol** token symbol


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function GetInfoAsync

```csharp
async Task< GetInfoResponse > GetInfoAsync(
    CancellationToken cancellationToken =default
) =default
```

Returns an object containing various details about the blockchain. 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function GetProducersAsync

```csharp
async Task< GetProducersResponse > GetProducersAsync(
    string limit =null,
    string lowerBound =null,
    bool? json =null,
    CancellationToken cancellationToken =default
) =default
```

Retrieves producers list 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **limit** total number of producers to retrieve
  * **lower_bound** In conjunction with limit can be used to paginate through the results. For example, limit=10 and lower_bound=10 would be page 2
  * **json** return result in JSON format


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function GetRawAbiAsync

```csharp
async Task GetRawAbiAsync(
    string accountName,
    CancellationToken cancellationToken =default
) =default
```

Retrieves raw ABI for a contract based on account name 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function GetRawCodeAndAbiAsync

```csharp
async Task GetRawCodeAndAbiAsync(
    string accountName,
    CancellationToken cancellationToken =default
) =default
```

Retrieves raw code and ABI for a contract based on account name 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function GetScheduledTransactionAsync

```csharp
async Task GetScheduledTransactionAsync(
    string lowerBound =null,
    int? limit =null,
    bool? json =null,
    CancellationToken cancellationToken =default
) =default
```

Retrieves the scheduled transaction 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **lower_bound** Date/time string in the format YYYY-MM-DDTHH:MM:SS.sss
  * **limit** The maximum number of transactions to return
  * **json** true/false whether the packed transaction is converted to json


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function GetTableByScopeAsync

```csharp
async Task< GetTableByScopeResponse > GetTableByScopeAsync(
    string code,
    string table =null,
    string lowerBound =null,
    string upperBound =null,
    int? limit =null,
    bool? reverse =null,
    CancellationToken cancellationToken =default
) =default
```

Retrieves table scope 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **code** `name` of the contract to return table data for
  * **table** Filter results by table
  * **lower_bound** Filters results to return the first element that is not less than provided value in set
  * **upper_bound** Filters results to return the first element that is greater than provided value in set
  * **limit** Limit number of results returned.
  * **reverse** Reverse the order of returned results


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function GetTableRowsAsync

```csharp
async Task GetTableRowsAsync(
    string code =null,
    string table =null,
    string scope =null,
    string indexPosition =null,
    string keyType =null,
    string encodeType =null,
    string upperBound =null,
    string lowerBound =null,
    CancellationToken cancellationToken =default
) =default
```

Returns an object containing rows from the specified table. 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **code** The name of the smart contract that controls the provided table
  * **table** The name of the table to query
  * **scope** The account to which this data belongs
  * **index_position** Position of the index used, accepted parameters `primary`, `secondary`, `tertiary`, `fourth`, `fifth`, `sixth`, `seventh`, `eighth`, `ninth` , `tenth`
  * **key_type** Type of key specified by index_position (for example - `uint64_t` or `name`)


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function PushTransactionAsync

```csharp
async Task PushTransactionAsync(
    object body =null,
    CancellationToken cancellationToken =default
) =default
```

This method expects a transaction in JSON format and will attempt to apply it to the blockchain. 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function PushTransactionsAsync

```csharp
async Task PushTransactionsAsync(
    IEnumerable< object > body =null,
    CancellationToken cancellationToken =default
) =default
```

This method expects a transaction in JSON format and will attempt to apply it to the blockchain. 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function SendTransactionAsync

```csharp
async Task SendTransactionAsync(
    object body =null,
    CancellationToken cancellationToken =default
) =default
```

This method expects a transaction in JSON format and will attempt to apply it to the blockchain. 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.


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