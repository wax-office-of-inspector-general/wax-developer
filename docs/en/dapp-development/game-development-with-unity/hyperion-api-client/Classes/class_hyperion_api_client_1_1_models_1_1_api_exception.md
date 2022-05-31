---
title: HyperionApiClient::Models::ApiException

---

# HyperionApiClient::Models::ApiException



 [More...](#detailed-description)

Inherits from Exception, ApiException

## Public Functions

|                | Name           |
| -------------- | -------------- |
| | **[ApiException](/Classes/class_hyperion_api_client_1_1_models_1_1_api_exception.md#function-apiexception)**(string message, int statusCode, string response, IReadOnlyDictionary< string, IEnumerable< string > > headers, Exception innerException) |
| override string | **[ToString](/Classes/class_hyperion_api_client_1_1_models_1_1_api_exception.md#function-tostring)**() |
| | **[ApiException](/Classes/class_hyperion_api_client_1_1_models_1_1_api_exception.md#function-apiexception)**(string message, int statusCode, string response, IReadOnlyDictionary< string, IEnumerable< string > > headers, TResult result, Exception innerException) |

## Public Properties

|                | Name           |
| -------------- | -------------- |
| int | **[StatusCode](/Classes/class_hyperion_api_client_1_1_models_1_1_api_exception.md#property-statuscode)**  |
| string | **[Response](/Classes/class_hyperion_api_client_1_1_models_1_1_api_exception.md#property-response)**  |
| IReadOnlyDictionary< string, IEnumerable< string > > | **[Headers](/Classes/class_hyperion_api_client_1_1_models_1_1_api_exception.md#property-headers)**  |
| TResult | **[Result](/Classes/class_hyperion_api_client_1_1_models_1_1_api_exception.md#property-result)**  |

## Detailed Description

```csharp
template <TResult >
class HyperionApiClient::Models::ApiException;
```

## Public Functions Documentation

### function ApiException

```csharp
ApiException(
    string message,
    int statusCode,
    string response,
    IReadOnlyDictionary< string, IEnumerable< string > > headers,
    Exception innerException
)
```


### function ToString

```csharp
override string ToString()
```


### function ApiException

```csharp
ApiException(
    string message,
    int statusCode,
    string response,
    IReadOnlyDictionary< string, IEnumerable< string > > headers,
    TResult result,
    Exception innerException
)
```


## Public Property Documentation

### property StatusCode

```csharp
int StatusCode;
```


### property Response

```csharp
string Response;
```


### property Headers

```csharp
IReadOnlyDictionary< string, IEnumerable< string > > Headers;
```


### property Result

```csharp
TResult Result;
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000