---
title: HyperionApiClient::Clients::StatusClient

---

# HyperionApiClient::Clients::StatusClient





Inherits from ClientExtensions

## Public Functions

|                | Name           |
| -------------- | -------------- |
| | **[StatusClient](/Classes/class_hyperion_api_client_1_1_clients_1_1_status_client.md#function-statusclient)**(HttpClient httpClient) |
| async Task< GetHealthResponse > | **[HealthAsync](/Classes/class_hyperion_api_client_1_1_clients_1_1_status_client.md#function-healthasync)**(CancellationToken cancellationToken =default) =default<br>API Service Health Report  |

## Public Properties

|                | Name           |
| -------------- | -------------- |
| string | **[BaseUrl](/Classes/class_hyperion_api_client_1_1_clients_1_1_status_client.md#property-baseurl)**  |

## Public Functions Documentation

### function StatusClient

```csharp
StatusClient(
    HttpClient httpClient
)
```


### function HealthAsync

```csharp
async Task< GetHealthResponse > HealthAsync(
    CancellationToken cancellationToken =default
) =default
```

API Service Health Report 

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