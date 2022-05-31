---
title: HyperionApiClient::Clients::AccountsClient

---

# HyperionApiClient::Clients::AccountsClient





Inherits from ClientExtensions

## Public Functions

|                | Name           |
| -------------- | -------------- |
| | **[AccountsClient](/Classes/class_hyperion_api_client_1_1_clients_1_1_accounts_client.md#function-accountsclient)**(HttpClient httpClient) |
| async Task< GetCreatedAccountsResponse > | **[GetCreatedAccountsAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_accounts_client.md#function-getcreatedaccountsasync)**(string account, int? limit =null, int? skip =null, CancellationToken cancellationToken =default) =default<br>get created accounts  |
| async Task< GetCreatorResponse > | **[GetCreatorAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_accounts_client.md#function-getcreatorasync)**(string account, CancellationToken cancellationToken =default) =default<br>get account creator  |
| async Task< GetAccountResponse > | **[GetAccountAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_accounts_client.md#function-getaccountasync)**(string account, int? limit =null, int? skip =null, CancellationToken cancellationToken =default) =default<br>get account summary  |
| async Task< GetKeyAccountsWithPermissionsResponse > | **[GetKeyAccountsAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_accounts_client.md#function-getkeyaccountsasync)**(string publicKey, int? limit =null, int? skip =null, bool? details =null, CancellationToken cancellationToken =default) =default<br>get accounts by public key  |
| async Task< GetLinksResponse > | **[GetLinksAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_accounts_client.md#function-getlinksasync)**(string account =null, string code =null, string action =null, string permission =null, CancellationToken cancellationToken =default) =default<br>get permission links  |
| async Task< GetTokensResponse > | **[GetTokensAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_accounts_client.md#function-gettokensasync)**(string account, int? limit =null, int? skip =null, CancellationToken cancellationToken =default) =default<br>get all tokens  |
| async Task< GetControlledAccountsResponse > | **[GetControlledAccountsAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_accounts_client.md#function-getcontrolledaccountsasync)**(string controllingAccount, CancellationToken cancellationToken =default) =default<br>get controlled accounts by controlling accounts  |

## Public Properties

|                | Name           |
| -------------- | -------------- |
| string | **[BaseUrl](/Classes/class_hyperion_api_client_1_1_clients_1_1_accounts_client.md#property-baseurl)**  |

## Public Functions Documentation

### function AccountsClient

```csharp
AccountsClient(
    HttpClient httpClient
)
```


### function GetCreatedAccountsAsync

```csharp
async Task< GetCreatedAccountsResponse > GetCreatedAccountsAsync(
    string account,
    int? limit =null,
    int? skip =null,
    CancellationToken cancellationToken =default
) =default
```

get created accounts 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **account** creator account
  * **limit** limit of [n] results per page
  * **skip** skip [n] results


**Exceptions**: 

  * **ApiException** A server side error occurred.


### function GetCreatorAsync

```csharp
async Task< GetCreatorResponse > GetCreatorAsync(
    string account,
    CancellationToken cancellationToken =default
) =default
```

get account creator 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **account** created account


**Exceptions**: 

  * **ApiException** A server side error occurred.


### function GetAccountAsync

```csharp
async Task< GetAccountResponse > GetAccountAsync(
    string account,
    int? limit =null,
    int? skip =null,
    CancellationToken cancellationToken =default
) =default
```

get account summary 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **account** account name
  * **limit** limit of [n] results per page
  * **skip** skip [n] results


**Exceptions**: 

  * **ApiException** A server side error occurred.


### function GetKeyAccountsAsync

```csharp
async Task< GetKeyAccountsWithPermissionsResponse > GetKeyAccountsAsync(
    string publicKey,
    int? limit =null,
    int? skip =null,
    bool? details =null,
    CancellationToken cancellationToken =default
) =default
```

get accounts by public key 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **public_key** public key
  * **limit** limit of [n] results per page
  * **skip** skip [n] results
  * **details** include permission details


**Exceptions**: 

  * **ApiException** A server side error occurred.


### function GetLinksAsync

```csharp
async Task< GetLinksResponse > GetLinksAsync(
    string account =null,
    string code =null,
    string action =null,
    string permission =null,
    CancellationToken cancellationToken =default
) =default
```

get permission links 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **account** account name
  * **code** contract name
  * **action** method name
  * **permission** permission name


**Exceptions**: 

  * **ApiException** A server side error occurred.


### function GetTokensAsync

```csharp
async Task< GetTokensResponse > GetTokensAsync(
    string account,
    int? limit =null,
    int? skip =null,
    CancellationToken cancellationToken =default
) =default
```

get all tokens 

**Parameters**: 

  * **cancellationToken** A cancellation token that can be used by other objects or threads to receive notice of cancellation.
  * **account** account name
  * **limit** limit of [n] results per page
  * **skip** skip [n] results


**Exceptions**: 

  * **ApiException** A server side error occurred.


**Return**: Default Response

### function GetControlledAccountsAsync

```csharp
async Task< GetControlledAccountsResponse > GetControlledAccountsAsync(
    string controllingAccount,
    CancellationToken cancellationToken =default
) =default
```

get controlled accounts by controlling accounts 

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