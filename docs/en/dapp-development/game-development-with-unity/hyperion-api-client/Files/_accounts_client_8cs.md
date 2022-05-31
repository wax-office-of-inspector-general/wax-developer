---
title: HyperionApiClient/Clients/AccountsClient.cs

---

# HyperionApiClient/Clients/AccountsClient.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Clients](/Namespaces/namespace_hyperion_api_client_1_1_clients.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Clients::AccountsClient](/Classes/class_hyperion_api_client_1_1_clients_1_1_accounts_client.md)**  |




## Source code

```csharp
using System;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using HyperionApiClient.Models;
using HyperionApiClient.Responses;

namespace HyperionApiClient.Clients
{
    public class AccountsClient : ClientExtensions
    {
        private readonly HttpClient _httpClient;

        public AccountsClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public string BaseUrl { get; set; } = "https://api.wax.liquidstudios.io/";

        public async Task<GetCreatedAccountsResponse> GetCreatedAccountsAsync(string account, int? limit = null, int? skip = null, CancellationToken cancellationToken = default)
        {
            if (account == null)
                throw new ArgumentNullException("account");
    
            var urlBuilder = new StringBuilder(BaseUrl != null ? BaseUrl.TrimEnd('/') : "").Append("/v2/history/get_created_accounts?" + Uri.EscapeDataString("account") + "=").Append(Uri.EscapeDataString(ConvertToString(account, CultureInfo.InvariantCulture))).Append("&");
            if (limit != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("limit") + "=").Append(Uri.EscapeDataString(ConvertToString(limit, CultureInfo.InvariantCulture))).Append("&");
            }
            if (skip != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("skip") + "=").Append(Uri.EscapeDataString(ConvertToString(skip, CultureInfo.InvariantCulture))).Append("&");
            }
            urlBuilder.Length--;
 
            using (var request = new HttpRequestMessage())
            {
                request.Method = new HttpMethod("GET");
                request.Headers.Accept.Add(MediaTypeWithQualityHeaderValue.Parse("application/json"));

                var url = urlBuilder.ToString();
                request.RequestUri = new Uri(url, UriKind.RelativeOrAbsolute);

                var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken).ConfigureAwait(false);

                var headers = response.Headers.ToDictionary(h => h.Key, h => h.Value);
                if (response.Content?.Headers != null)
                {
                    foreach (var item in response.Content.Headers)
                        headers[item.Key] = item.Value;
                }

                var status = (int)response.StatusCode;
                if (status == 200)
                {
                    var objectResponse = await ReadObjectResponseAsync<GetCreatedAccountsResponse>(response, headers, cancellationToken).ConfigureAwait(false);
                    if (objectResponse.Object == null)
                    {
                        throw new ApiException("Response was null which was not expected.", status, objectResponse.Text, headers, null);
                    }
                    return objectResponse.Object;
                }

                var responseData = response.Content == null ? null : await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                throw new ApiException("The HTTP status code of the response was not expected (" + status + ").", status, responseData, headers, null);
            }
        }
    
        public async Task<GetCreatorResponse> GetCreatorAsync(string account, CancellationToken cancellationToken = default)
        {
            if (account == null)
                throw new ArgumentNullException("account");
    
            var urlBuilder = new StringBuilder(BaseUrl != null ? BaseUrl.TrimEnd('/') : "").Append("/v2/history/get_creator?" + Uri.EscapeDataString("account") + "=").Append(Uri.EscapeDataString(ConvertToString(account, CultureInfo.InvariantCulture))).Append("&");
            urlBuilder.Length--;
 
            using (var request = new HttpRequestMessage())
            {
                request.Method = new HttpMethod("GET");
                request.Headers.Accept.Add(MediaTypeWithQualityHeaderValue.Parse("application/json"));

                var url = urlBuilder.ToString();
                request.RequestUri = new Uri(url, UriKind.RelativeOrAbsolute);

                var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken).ConfigureAwait(false);

                var headers = response.Headers.ToDictionary(h => h.Key, h => h.Value);
                if (response.Content?.Headers != null)
                {
                    foreach (var item in response.Content.Headers)
                        headers[item.Key] = item.Value;
                }

                var status = (int)response.StatusCode;
                if (status == 200)
                {
                    var objectResponse = await ReadObjectResponseAsync<GetCreatorResponse>(response, headers, cancellationToken).ConfigureAwait(false);
                    if (objectResponse.Object == null)
                    {
                        throw new ApiException("Response was null which was not expected.", status, objectResponse.Text, headers, null);
                    }
                    return objectResponse.Object;
                }

                var responseData = response.Content == null ? null : await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                throw new ApiException("The HTTP status code of the response was not expected (" + status + ").", status, responseData, headers, null);
            }
        }
    
        public async Task<GetAccountResponse> GetAccountAsync(string account, int? limit = null, int? skip = null, CancellationToken cancellationToken = default)
        {
            if (account == null)
                throw new ArgumentNullException("account");
    
            var urlBuilder = new StringBuilder(BaseUrl != null ? BaseUrl.TrimEnd('/') : "").Append("/v2/state/get_account?" + Uri.EscapeDataString("account") + "=").Append(Uri.EscapeDataString(ConvertToString(account, CultureInfo.InvariantCulture))).Append("&");
            if (limit != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("limit") + "=").Append(Uri.EscapeDataString(ConvertToString(limit, CultureInfo.InvariantCulture))).Append("&");
            }
            if (skip != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("skip") + "=").Append(Uri.EscapeDataString(ConvertToString(skip, CultureInfo.InvariantCulture))).Append("&");
            }
            urlBuilder.Length--;
 
            using (var request = new HttpRequestMessage())
            {
                request.Method = new HttpMethod("GET");
                request.Headers.Accept.Add(MediaTypeWithQualityHeaderValue.Parse("application/json"));

                var url = urlBuilder.ToString();
                request.RequestUri = new Uri(url, UriKind.RelativeOrAbsolute);

                var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken).ConfigureAwait(false);

                var headers = response.Headers.ToDictionary(h => h.Key, h => h.Value);
                if (response.Content?.Headers != null)
                {
                    foreach (var item in response.Content.Headers)
                        headers[item.Key] = item.Value;
                }

                var status = (int)response.StatusCode;
                if (status == 200)
                {
                    var objectResponse = await ReadObjectResponseAsync<GetAccountResponse>(response, headers, cancellationToken).ConfigureAwait(false);
                    if (objectResponse.Object == null)
                    {
                        throw new ApiException("Response was null which was not expected.", status, objectResponse.Text, headers, null);
                    }
                    return objectResponse.Object;
                }

                var responseData = response.Content == null ? null : await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                throw new ApiException("The HTTP status code of the response was not expected (" + status + ").", status, responseData, headers, null);
            }
        }
    
        public async Task<GetKeyAccountsWithPermissionsResponse> GetKeyAccountsAsync(string publicKey, int? limit = null, int? skip = null, bool? details = null, CancellationToken cancellationToken = default)
        {
            if (publicKey == null)
                throw new ArgumentNullException("publicKey");
    
            var urlBuilder = new StringBuilder(BaseUrl != null ? BaseUrl.TrimEnd('/') : "").Append("/v2/state/get_key_accounts?" + Uri.EscapeDataString("public_key") + "=").Append(Uri.EscapeDataString(ConvertToString(publicKey, CultureInfo.InvariantCulture))).Append("&");
            if (limit != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("limit") + "=").Append(Uri.EscapeDataString(ConvertToString(limit, CultureInfo.InvariantCulture))).Append("&");
            }
            if (skip != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("skip") + "=").Append(Uri.EscapeDataString(ConvertToString(skip, CultureInfo.InvariantCulture))).Append("&");
            }
            if (details != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("details") + "=").Append(Uri.EscapeDataString(ConvertToString(details, CultureInfo.InvariantCulture))).Append("&");
            }
            urlBuilder.Length--;
 
            using (var request = new HttpRequestMessage())
            {
                request.Method = new HttpMethod("GET");
                request.Headers.Accept.Add(MediaTypeWithQualityHeaderValue.Parse("application/json"));

                var url = urlBuilder.ToString();
                request.RequestUri = new Uri(url, UriKind.RelativeOrAbsolute);

                var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken).ConfigureAwait(false);

                var headers = response.Headers.ToDictionary(h => h.Key, h => h.Value);
                if (response.Content?.Headers != null)
                {
                    foreach (var item in response.Content.Headers)
                        headers[item.Key] = item.Value;
                }

                var status = (int)response.StatusCode;
                if (status == 200)
                {
                    var objectResponse = await ReadObjectResponseAsync<GetKeyAccountsWithPermissionsResponse>(response, headers, cancellationToken).ConfigureAwait(false);
                    if (objectResponse.Object == null)
                    {
                        throw new ApiException("Response was null which was not expected.", status, objectResponse.Text, headers, null);
                    }
                    return objectResponse.Object;
                }

                var responseData = response.Content == null ? null : await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                throw new ApiException("The HTTP status code of the response was not expected (" + status + ").", status, responseData, headers, null);
            }
        }
        
        public async Task<GetLinksResponse> GetLinksAsync(string account = null, string code = null, string action = null, string permission = null, CancellationToken cancellationToken = default)
        {
            var urlBuilder = new StringBuilder(BaseUrl != null ? BaseUrl.TrimEnd('/') : "").Append("/v2/state/get_links?");
            if (account != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("account") + "=").Append(Uri.EscapeDataString(ConvertToString(account, CultureInfo.InvariantCulture))).Append("&");
            }
            if (code != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("code") + "=").Append(Uri.EscapeDataString(ConvertToString(code, CultureInfo.InvariantCulture))).Append("&");
            }
            if (action != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("action") + "=").Append(Uri.EscapeDataString(ConvertToString(action, CultureInfo.InvariantCulture))).Append("&");
            }
            if (permission != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("permission") + "=").Append(Uri.EscapeDataString(ConvertToString(permission, CultureInfo.InvariantCulture))).Append("&");
            }
            urlBuilder.Length--;
 
            using (var request = new HttpRequestMessage())
            {
                request.Method = new HttpMethod("GET");
                request.Headers.Accept.Add(MediaTypeWithQualityHeaderValue.Parse("application/json"));

                var url = urlBuilder.ToString();
                request.RequestUri = new Uri(url, UriKind.RelativeOrAbsolute);

                var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken).ConfigureAwait(false);

                var headers = response.Headers.ToDictionary(h => h.Key, h => h.Value);
                if (response.Content?.Headers != null)
                {
                    foreach (var item in response.Content.Headers)
                        headers[item.Key] = item.Value;
                }

                var status = (int)response.StatusCode;
                if (status == 200)
                {
                    var objectResponse = await ReadObjectResponseAsync<GetLinksResponse>(response, headers, cancellationToken).ConfigureAwait(false);
                    if (objectResponse.Object == null)
                    {
                        throw new ApiException("Response was null which was not expected.", status, objectResponse.Text, headers, null);
                    }
                    return objectResponse.Object;
                }

                var responseData = response.Content == null ? null : await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                throw new ApiException("The HTTP status code of the response was not expected (" + status + ").", status, responseData, headers, null);
            }
        }
    
        public async Task<GetTokensResponse> GetTokensAsync(string account, int? limit = null, int? skip = null, CancellationToken cancellationToken = default)
        {
            // TODO return value?!

            if (account == null)
                throw new ArgumentNullException("account");
    
            var urlBuilder = new StringBuilder(BaseUrl != null ? BaseUrl.TrimEnd('/') : "").Append("/v2/state/get_tokens?" + Uri.EscapeDataString("account") + "=").Append(Uri.EscapeDataString(ConvertToString(account, CultureInfo.InvariantCulture))).Append("&");
            if (limit != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("limit") + "=").Append(Uri.EscapeDataString(ConvertToString(limit, CultureInfo.InvariantCulture))).Append("&");
            }
            if (skip != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("skip") + "=").Append(Uri.EscapeDataString(ConvertToString(skip, CultureInfo.InvariantCulture))).Append("&");
            }
            urlBuilder.Length--;
 
            using (var request = new HttpRequestMessage())
            {
                request.Method = new HttpMethod("GET");

                var url = urlBuilder.ToString();
                request.RequestUri = new Uri(url, UriKind.RelativeOrAbsolute);

                var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken).ConfigureAwait(false);

                var headers = response.Headers.ToDictionary(h => h.Key, h => h.Value);
                if (response.Content?.Headers != null)
                {
                    foreach (var item in response.Content.Headers)
                        headers[item.Key] = item.Value;
                }

                var status = (int)response.StatusCode;
                if (status == 200)
                {
                    var objectResponse = await ReadObjectResponseAsync<GetTokensResponse>(response, headers, cancellationToken).ConfigureAwait(false);
                    if (objectResponse.Object == null)
                    {
                        throw new ApiException("Response was null which was not expected.", status, objectResponse.Text, headers, null);
                    }
                    return objectResponse.Object;
                }

                var responseData = response.Content == null ? null : await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                throw new ApiException("The HTTP status code of the response was not expected (" + status + ").", status, responseData, headers, null);
            }
        }
    
        public async Task<GetControlledAccountsResponse> GetControlledAccountsAsync(string controllingAccount, CancellationToken cancellationToken = default)
        {
            if (controllingAccount == null)
                throw new ArgumentNullException("controllingAccount");
    
            var urlBuilder = new StringBuilder(BaseUrl != null ? BaseUrl.TrimEnd('/') : "").Append("/v1/history/get_controlled_accounts");
 
            using (var request = new HttpRequestMessage())
            {
                var content = new StringContent($"{{\"controlling_account\":\"{controllingAccount}\"}}");
                content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");
                request.Content = content;
                request.Method = new HttpMethod("POST");
                request.Headers.Accept.Add(MediaTypeWithQualityHeaderValue.Parse("application/json"));

                var url = urlBuilder.ToString();
                request.RequestUri = new Uri(url, UriKind.RelativeOrAbsolute);

                var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken).ConfigureAwait(false);

                var headers = response.Headers.ToDictionary(h => h.Key, h => h.Value);
                if (response.Content?.Headers != null)
                {
                    foreach (var item in response.Content.Headers)
                        headers[item.Key] = item.Value;
                }

                var status = (int)response.StatusCode;
                if (status == 200)
                {
                    var objectResponse = await ReadObjectResponseAsync<GetControlledAccountsResponse>(response, headers, cancellationToken).ConfigureAwait(false);
                    if (objectResponse.Object == null)
                    {
                        throw new ApiException("Response was null which was not expected.", status, objectResponse.Text, headers, null);
                    }
                    return objectResponse.Object;
                }

                var responseData = response.Content == null ? null : await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                throw new ApiException("The HTTP status code of the response was not expected (" + status + ").", status, responseData, headers, null);
            }
        }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
