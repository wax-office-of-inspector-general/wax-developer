---
title: HyperionApiClientUnitTests/Clients/SystemClientTests.cs

---

# HyperionApiClientUnitTests/Clients/SystemClientTests.cs






## Source code

```csharp
using Microsoft.VisualStudio.TestTools.UnitTesting;
using EosRio.HyperionApi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using HyperionApiClient.Clients;

namespace EosRio.HyperionApi.Tests
{
    [TestClass()]
    public class SystemClientTests
    {
        [TestMethod()]
        public async Task SystemClientTest()
        {
            var systemClient = new SystemClient(new HttpClient())
            {
                BaseUrl = "invalidUrl"
            };

            try
            {
                var acc = await systemClient.GetVotersAsync();
                Assert.Fail();
            }
            catch (Exception)
            {
                Assert.IsTrue(true);
            }
        }

        [TestMethod()]
        public async Task GetProposalsAsyncTest()
        {
            var systemClient = new SystemClient(new HttpClient());

            var proposalsResponse = await systemClient.GetProposalsAsync();

            Assert.IsNotNull(proposalsResponse.Total);
            Assert.IsNotNull(proposalsResponse.Proposals);
        }

        [TestMethod()]
        public async Task GetVotersAsyncTest()
        {
            var systemClient = new SystemClient(new HttpClient());

            var votersResponse = await systemClient.GetVotersAsync();

            Assert.IsNotNull(votersResponse.Voters);
        }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
