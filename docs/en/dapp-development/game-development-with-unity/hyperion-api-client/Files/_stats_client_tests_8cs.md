---
title: HyperionApiClientUnitTests/Clients/StatsClientTests.cs

---

# HyperionApiClientUnitTests/Clients/StatsClientTests.cs






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
    public class StatsClientTests
    {
        [TestMethod()]
        public async Task StatsClientTest()
        {
            var statsClient = new StatsClient(new HttpClient())
            {
                BaseUrl = "invalidUrl"
            };

            try
            {
                var resourceUsageResponse = await statsClient.GetResourceUsageAsync("eosio.token","transfer");
                Assert.Fail();
            }
            catch (Exception)
            {
                Assert.IsTrue(true);
            }
        }

        [TestMethod()]
        public async Task GetActionUsageAsyncTest()
        {
            var statsClient = new StatsClient(new HttpClient());

            var actionUsageResponse = await statsClient.GetActionUsageAsync("1h");

            Assert.IsNotNull(actionUsageResponse.From);
            Assert.IsNotNull(actionUsageResponse.Period);
            Assert.IsNotNull(actionUsageResponse.To);
        }

        [TestMethod()]
        public async Task GetMissedBlocksAsyncTest()
        {
            var statsClient = new StatsClient(new HttpClient());

            var missedBlocksResponse = await statsClient.GetMissedBlocksAsync("liquidstudios");

            Assert.IsNotNull(missedBlocksResponse.Stats);
            Assert.IsNotNull(missedBlocksResponse.Lib);
        }

        [TestMethod()]
        public async Task GetResourceUsageAsyncTest()
        {
            var statsClient = new StatsClient(new HttpClient());

            var resourceUsageResponse = await statsClient.GetResourceUsageAsync("eosio.token", "transfer");

            Assert.IsNotNull(resourceUsageResponse.Cpu);
            Assert.IsNotNull(resourceUsageResponse.Net);

            Assert.IsNotNull(resourceUsageResponse.Cpu.Stats);
            Assert.IsNotNull(resourceUsageResponse.Net.Stats);
        }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
