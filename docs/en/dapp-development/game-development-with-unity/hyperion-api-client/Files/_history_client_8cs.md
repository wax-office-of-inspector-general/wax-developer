---
title: HyperionApiClient/Clients/HistoryClient.cs

---

# HyperionApiClient/Clients/HistoryClient.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Clients](/Namespaces/namespace_hyperion_api_client_1_1_clients.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Clients::HistoryClient](/Classes/class_hyperion_api_client_1_1_clients_1_1_history_client.md)**  |




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
    public class HistoryClient : ClientExtensions
    {
        private readonly HttpClient _httpClient;

        public HistoryClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public string BaseUrl { get; set; } = "https://api.wax.liquidstudios.io/";

        public async Task<GetApiSnapshotResponse> GetAbiSnapshotAsync(string contract, int? block = null, bool? fetch = null, CancellationToken cancellationToken = default)
        {
            if (contract == null)
                throw new ArgumentNullException("contract");
    
            var urlBuilder = new StringBuilder(BaseUrl != null ? BaseUrl.TrimEnd('/') : "").Append("/v2/history/get_abi_snapshot?" + Uri.EscapeDataString("contract") + "=").Append(Uri.EscapeDataString(ConvertToString(contract, CultureInfo.InvariantCulture))).Append("&");
            if (block != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("block") + "=").Append(Uri.EscapeDataString(ConvertToString(block, CultureInfo.InvariantCulture))).Append("&");
            }
            if (fetch != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("fetch") + "=").Append(Uri.EscapeDataString(ConvertToString(fetch, CultureInfo.InvariantCulture))).Append("&");
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
                    var objectResponse = await ReadObjectResponseAsync<GetApiSnapshotResponse>(response, headers, cancellationToken).ConfigureAwait(false);
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
    
        public async Task<GetActionsResponse> GetActionsAsync(int? limit = null, int? skip = null, string account = null, string track = null, string filter = null, Sort? sort = null, string after = null, string before = null, bool? simple = null, bool? hotOnly = null, bool? noBinary = null, bool? checkLib = null, CancellationToken cancellationToken = default)
        {
            var urlBuilder = new StringBuilder(BaseUrl != null ? BaseUrl.TrimEnd('/') : "").Append("/v2/history/get_actions?");
            if (limit != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("limit") + "=").Append(Uri.EscapeDataString(ConvertToString(limit, CultureInfo.InvariantCulture))).Append("&");
            }
            if (skip != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("skip") + "=").Append(Uri.EscapeDataString(ConvertToString(skip, CultureInfo.InvariantCulture))).Append("&");
            }
            if (account != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("account") + "=").Append(Uri.EscapeDataString(ConvertToString(account, CultureInfo.InvariantCulture))).Append("&");
            }
            if (track != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("track") + "=").Append(Uri.EscapeDataString(ConvertToString(track, CultureInfo.InvariantCulture))).Append("&");
            }
            if (filter != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("filter") + "=").Append(Uri.EscapeDataString(ConvertToString(filter, CultureInfo.InvariantCulture))).Append("&");
            }
            if (sort != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("sort") + "=").Append(Uri.EscapeDataString(ConvertToString(sort, CultureInfo.InvariantCulture))).Append("&");
            }
            if (after != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("after") + "=").Append(Uri.EscapeDataString(ConvertToString(after, CultureInfo.InvariantCulture))).Append("&");
            }
            if (before != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("before") + "=").Append(Uri.EscapeDataString(ConvertToString(before, CultureInfo.InvariantCulture))).Append("&");
            }
            if (simple != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("simple") + "=").Append(Uri.EscapeDataString(ConvertToString(simple, CultureInfo.InvariantCulture))).Append("&");
            }
            if (hotOnly != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("hot_only") + "=").Append(Uri.EscapeDataString(ConvertToString(hotOnly, CultureInfo.InvariantCulture))).Append("&");
            }
            if (noBinary != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("noBinary") + "=").Append(Uri.EscapeDataString(ConvertToString(noBinary, CultureInfo.InvariantCulture))).Append("&");
            }
            if (checkLib != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("checkLib") + "=").Append(Uri.EscapeDataString(ConvertToString(checkLib, CultureInfo.InvariantCulture))).Append("&");
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
                    var objectResponse = await ReadObjectResponseAsync<GetActionsResponse>(response, headers, cancellationToken).ConfigureAwait(false);
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
    
        public async Task<GetDeltasResponse> GetDeltasAsync(int? limit = null, int? skip = null, string code = null, string scope = null, string table = null, string payer = null, string after = null, string before = null, CancellationToken cancellationToken = default)
        {
            var urlBuilder = new StringBuilder(BaseUrl != null ? BaseUrl.TrimEnd('/') : "").Append("/v2/history/get_deltas?");
            if (limit != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("limit") + "=").Append(Uri.EscapeDataString(ConvertToString(limit, CultureInfo.InvariantCulture))).Append("&");
            }
            if (skip != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("skip") + "=").Append(Uri.EscapeDataString(ConvertToString(skip, CultureInfo.InvariantCulture))).Append("&");
            }
            if (code != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("code") + "=").Append(Uri.EscapeDataString(ConvertToString(code, CultureInfo.InvariantCulture))).Append("&");
            }
            if (scope != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("scope") + "=").Append(Uri.EscapeDataString(ConvertToString(scope, CultureInfo.InvariantCulture))).Append("&");
            }
            if (table != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("table") + "=").Append(Uri.EscapeDataString(ConvertToString(table, CultureInfo.InvariantCulture))).Append("&");
            }
            if (payer != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("payer") + "=").Append(Uri.EscapeDataString(ConvertToString(payer, CultureInfo.InvariantCulture))).Append("&");
            }
            if (after != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("after") + "=").Append(Uri.EscapeDataString(ConvertToString(after, CultureInfo.InvariantCulture))).Append("&");
            }
            if (before != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("before") + "=").Append(Uri.EscapeDataString(ConvertToString(before, CultureInfo.InvariantCulture))).Append("&");
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
                    var objectResponse = await ReadObjectResponseAsync<GetDeltasResponse>(response, headers, cancellationToken).ConfigureAwait(false);
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
    
        public async Task<GetScheduleResponse> GetScheduleAsync(string producer = null, string key = null, string after = null, string before = null, int? version = null, CancellationToken cancellationToken = default)
        {
            var urlBuilder = new StringBuilder(BaseUrl != null ? BaseUrl.TrimEnd('/') : "").Append("/v2/history/get_schedule?");
            if (producer != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("producer") + "=").Append(Uri.EscapeDataString(ConvertToString(producer, CultureInfo.InvariantCulture))).Append("&");
            }
            if (key != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("key") + "=").Append(Uri.EscapeDataString(ConvertToString(key, CultureInfo.InvariantCulture))).Append("&");
            }
            if (after != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("after") + "=").Append(Uri.EscapeDataString(ConvertToString(after, CultureInfo.InvariantCulture))).Append("&");
            }
            if (before != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("before") + "=").Append(Uri.EscapeDataString(ConvertToString(before, CultureInfo.InvariantCulture))).Append("&");
            }
            if (version != null)
            {
                urlBuilder.Append(Uri.EscapeDataString("version") + "=").Append(Uri.EscapeDataString(ConvertToString(version, CultureInfo.InvariantCulture))).Append("&");
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
                    var objectResponse = await ReadObjectResponseAsync<GetScheduleResponse>(response, headers, cancellationToken).ConfigureAwait(false);
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
    
        public async Task<GetTransactionResponse> GetTransactionAsync(string id, CancellationToken cancellationToken = default)
        {
            if (id == null)
                throw new ArgumentNullException("id");
    
            var urlBuilder = new StringBuilder(BaseUrl != null ? BaseUrl.TrimEnd('/') : "").Append("/v2/history/get_transaction?" + Uri.EscapeDataString("id") + "=").Append(Uri.EscapeDataString(ConvertToString(id, CultureInfo.InvariantCulture))).Append("&");
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
                    var objectResponse = await ReadObjectResponseAsync<GetTransactionResponse>(response, headers, cancellationToken).ConfigureAwait(false);
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

        public async Task<GetBlockResponse> GetBlockAsync(uint? blockNum = null, string blockId = null, CancellationToken cancellationToken = default)
        {

            StringContent content = null;
            if (blockNum != null)
                content = new StringContent($"{{\"block_num\":\"{blockNum}\"}}");
            else if (!string.IsNullOrEmpty(blockId))
                content = new StringContent($"{{\"block_id\":\"{blockId}\"}}");
            else
                throw new ArgumentNullException("blockNum or blockId");

            var urlBuilder = new StringBuilder(BaseUrl != null ? BaseUrl.TrimEnd('/') : "").Append("/v1/trace_api/get_block");
 
            using (var request = new HttpRequestMessage())
            {
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
                    var objectResponse = await ReadObjectResponseAsync<GetBlockResponse>(response, headers, cancellationToken).ConfigureAwait(false);
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
