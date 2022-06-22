---
title: HyperionApiClientUnitTests/Clients/AccountsClientTests.cs

---

# HyperionApiClientUnitTests/Clients/AccountsClientTests.cs






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
    public class AccountsClientTests
    {
        [TestMethod()]
        public async Task AccountsClientTest()
        {
            var accountsClient = new AccountsClient(new HttpClient())
            {
                BaseUrl = "invalidUrl"
            };

            try
            {
                var acc = await accountsClient.GetAccountAsync("wam");
                Assert.Fail();
            }
            catch (Exception)
            {
                Assert.IsTrue(true);
            }
        }

        [TestMethod()]
        public async Task GetCreatedAccountsAsyncTest()
        {
            var accountsClient = new AccountsClient(new HttpClient());

            var count = 20;
            var accounts = await accountsClient.GetCreatedAccountsAsync("wam", count);

            Assert.AreEqual(accounts.Accounts.Count, count);
        }

        [TestMethod()]
        public async Task GetCreatorAsyncTest()
        {
            var accountsClient = new AccountsClient(new HttpClient());

            var createdAccount = "kingcoolcorv";
            var account = await accountsClient.GetCreatorAsync(createdAccount);

            Assert.AreEqual(account.Account, createdAccount);
            Assert.AreEqual(account.Creator, "karmasignups");
            Assert.AreEqual(account.Timestamp, "2019-12-07T16:38:26.000");
            Assert.AreEqual(account.BlockNum, 28628501);
            Assert.AreEqual(account.TrxId, "63ddc9ea7b8c761b2a981e892d9db1aa7cbe1b32057c6a8fc7bf8672207185ef");
        }

        [TestMethod()]
        public async Task GetAccountAsyncTest()
        {
            var accountsClient = new AccountsClient(new HttpClient());

            var accountName = "eosio";
            var account = await accountsClient.GetAccountAsync(accountName);

            Assert.AreEqual(account.Account.AccountName, accountName);
            Assert.AreEqual(account.Account.Created, "2019-06-05T12:00:00.000");
            Assert.AreEqual(account.Account.NetLimit.Used, -1);
            Assert.AreEqual(account.Account.NetLimit.Available, -1);
            Assert.AreEqual(account.Account.NetLimit.Max, -1);
            Assert.AreEqual(account.Account.CpuLimit.Used, -1);
            Assert.AreEqual(account.Account.CpuLimit.Available, -1);
            Assert.AreEqual(account.Account.CpuLimit.Max, -1);
            Assert.AreEqual(account.Account.NetWeight, -1);
            Assert.AreEqual(account.Account.CpuWeight, -1);
            Assert.AreEqual(account.Account.Permissions.Count(p => p.PermName == "owner" || p.PermName == "burn" || p.PermName == "active"), 3);
            Assert.IsNotNull(account.Account.VoterInfo);
            Assert.IsNotNull(account.Links);
            Assert.IsNotNull(account.Tokens);
            Assert.IsNotNull(account.Tokens.FirstOrDefault(t => t.Symbol == "WAX"));
            Assert.IsNotNull(account.Actions);
        }

        [TestMethod()]
        public async Task GetKeyAccountsAsyncTest()
        {
            var accountsClient = new AccountsClient(new HttpClient());

            var key = "PUB_K1_84iF6DCDghFYbjzFxxM71DnMbZVYQhxwxEWXbgz21nLFCWShVj";
            var keyAccounts = await accountsClient.GetKeyAccountsAsync(key);

            Assert.IsNotNull(keyAccounts.AccountNames.FirstOrDefault(a => a == "kaefer"));
            Assert.IsNotNull(keyAccounts.AccountNames.FirstOrDefault(a => a == "kaefer.oig"));
            Assert.IsNotNull(keyAccounts.AccountNames.FirstOrDefault(a => a == "ig.kaefer"));
        }

        [TestMethod()]
        public async Task GetLinksAsyncTest()
        {
            var accountsClient = new AccountsClient(new HttpClient());

            var account = "wam";
            var code = "eosio";
            var permission = "newaccount";

            var links = await accountsClient.GetLinksAsync(account, code, null, permission);

            Assert.AreEqual(links.Links.Count, 4);
            Assert.AreEqual(links.Total.Value, 4);
            Assert.AreEqual(links.Total.Relation, "eq");
            Assert.AreEqual(links.Links.Count(l => l.Account == "wam"), 4);
            Assert.AreEqual(links.Links.Count(l => l.Action == "sellram"), 1);
            Assert.AreEqual(links.Links.Count(l => l.Permission == "newaccount"), 4);
        }

        [TestMethod()]
        public async Task GetTokensAsyncTest()
        {
            var accountsClient = new AccountsClient(new HttpClient());

            var account = "kingcoolcorv";
            var tokens = await accountsClient.GetTokensAsync(account);

            Assert.AreEqual(tokens.Account, account);
            Assert.AreEqual(tokens.Tokens.Count, 1);
            Assert.AreEqual(tokens.Tokens.Count(t => t.Symbol == "WAX"), 1);
        }

        [TestMethod()]
        public async Task GetControlledAccountsAsyncTest()
        {
            var accountsClient = new AccountsClient(new HttpClient());

            var controllingAccount = "kaefer";
            var controlledAccounts = await accountsClient.GetControlledAccountsAsync(controllingAccount);

            Assert.AreEqual(controlledAccounts.ControlledAccounts.Count, 4);
            Assert.AreEqual(controlledAccounts.ControlledAccounts.Count(a => a == "kaefer"), 0);
            Assert.AreEqual(controlledAccounts.ControlledAccounts.Count(a => a == "pay.kaefer"), 1);
            Assert.AreEqual(controlledAccounts.ControlledAccounts.Count(a => a == "ig.kaefer"), 1);
        }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
