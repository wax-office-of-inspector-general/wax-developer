---
title: HyperionApiClientUnitTests/Clients/StatusClientTests.cs

---

# HyperionApiClientUnitTests/Clients/StatusClientTests.cs






## Source code

```csharp
using Microsoft.VisualStudio.TestTools.UnitTesting;
using EosRio.HyperionApi;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using HyperionApiClient.Clients;

namespace EosRio.HyperionApi.Tests
{
    [TestClass()]
    public class StatusClientTests
    {
        [TestMethod()]
        public async Task StatusClientTest()
        {
            var statusClient = new StatusClient(new HttpClient())
            {
                BaseUrl = "invalidUrl"
            };

            try
            {
                var acc = await statusClient.HealthAsync();
                Assert.Fail();
            }
            catch (Exception)
            {
                Assert.IsTrue(true);
            }
        }

        [TestMethod()]
        public async Task HealthAsyncTest()
        {
            var statusClient = new StatusClient(new HttpClient());

            var healthResponse = await statusClient.HealthAsync();
            Assert.IsNotNull(healthResponse.Features);
            Assert.IsNotNull(healthResponse.Health);
            Assert.IsNotNull(healthResponse.Host);
            Assert.IsNotNull(healthResponse.Version);
            Assert.IsNotNull(healthResponse.VersionHash);
        }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
