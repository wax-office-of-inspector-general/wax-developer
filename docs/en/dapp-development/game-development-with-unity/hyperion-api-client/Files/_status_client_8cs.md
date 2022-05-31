---
title: HyperionApiClient/Clients/StatusClient.cs

---

# HyperionApiClient/Clients/StatusClient.cs



## Namespaces

| Name           |
| -------------- |
| **[HyperionApiClient](/Namespaces/namespace_hyperion_api_client.md)**  |
| **[HyperionApiClient::Clients](/Namespaces/namespace_hyperion_api_client_1_1_clients.md)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| class | **[HyperionApiClient::Clients::StatusClient](/Classes/class_hyperion_api_client_1_1_clients_1_1_status_client.md)**  |




## Source code

```csharp
using System;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using HyperionApiClient.Models;
using HyperionApiClient.Responses;

namespace HyperionApiClient.Clients
{
    public class StatusClient : ClientExtensions
    {
        private readonly HttpClient _httpClient;

        public StatusClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public string BaseUrl { get; set; } = "https://api.wax.liquidstudios.io/";

        public async Task<GetHealthResponse> HealthAsync(CancellationToken cancellationToken = default)
        {
            var urlBuilder = new StringBuilder(BaseUrl != null ? BaseUrl.TrimEnd('/') : "").Append("/v2/health");
 
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
                    var objectResponse = await ReadObjectResponseAsync<GetHealthResponse>(response, headers, cancellationToken).ConfigureAwait(false);
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
