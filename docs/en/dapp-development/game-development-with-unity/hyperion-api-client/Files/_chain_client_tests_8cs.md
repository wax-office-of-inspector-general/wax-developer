---
title: HyperionApiClientUnitTests/Clients/ChainClientTests.cs

---

# HyperionApiClientUnitTests/Clients/ChainClientTests.cs






## Source code

```csharp
using Microsoft.VisualStudio.TestTools.UnitTesting;
using EosRio.HyperionApi;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using HyperionApiClient.Clients;
using Newtonsoft.Json;

namespace EosRio.HyperionApi.Tests
{
    [TestClass()]
    public class ChainClientTests
    {
        [TestMethod()]
        public async Task ChainClientTest()
        {
            var chainClient = new ChainClient(new HttpClient())
            {
                BaseUrl = "invalidUrl"
            };

            try
            {
                var acc = await chainClient.GetAccountAsync("wam");
                Assert.Fail();
            }
            catch (Exception)
            {
                Assert.IsTrue(true);
            }
        }

        [TestMethod()]
        public async Task GetAbiAsyncTest()
        {
            var chainClient = new ChainClient(new HttpClient());

            var account = "eosio";
            var abi = await chainClient.GetAbiAsync(account);

            Assert.AreEqual(abi.AccountName, account);
            Assert.AreEqual(abi.Abi.Actions.Count,64);
            Assert.AreEqual(abi.Abi.AbiExtensions.Count,0);
            Assert.AreEqual(abi.Abi.ErrorMessages.Count,0);
            Assert.AreEqual(abi.Abi.RicardianClauses.Count,2);
            Assert.AreEqual(abi.Abi.Structs.Count,96);
            Assert.AreEqual(abi.Abi.Tables.Count,22);
            Assert.AreEqual(abi.Abi.Types.Count,0);
            Assert.AreEqual(abi.Abi.Variants.Count,0);
            Assert.AreEqual(abi.Abi.Version, "eosio::abi/1.1");
        }

        [TestMethod()]
        public async Task GetAccountAsyncTest()
        {
            var chainClient = new ChainClient(new HttpClient());

            var accountName = "eosio";
            var account = await chainClient.GetAccountAsync(accountName);

            Assert.AreEqual(account.AccountName, accountName);
            Assert.AreEqual(account.Created, "2019-06-05T12:00:00.000");
            Assert.AreEqual(account.NetLimit.Used, -1);
            Assert.AreEqual(account.NetLimit.Available, -1);
            Assert.AreEqual(account.NetLimit.Max, -1);
            Assert.AreEqual(account.CpuLimit.Used, -1);
            Assert.AreEqual(account.CpuLimit.Available, -1);
            Assert.AreEqual(account.CpuLimit.Max, -1);
            Assert.AreEqual(account.NetWeight, -1);
            Assert.AreEqual(account.CpuWeight, -1);
            Assert.AreEqual(account.Permissions.Count(p => p.PermName == "owner" || p.PermName == "burn" || p.PermName == "active"), 3);
            Assert.IsNotNull(account.VoterInfo);

        }

        [TestMethod()]
        public async Task GetActivatedProtocolFeaturesAsyncTest()
        {
            var chainClient = new ChainClient(new HttpClient());

            var activatedProtocolFeatures = await chainClient.GetActivatedProtocolFeaturesAsync();

            Assert.AreEqual(activatedProtocolFeatures.ActivatedProtocolFeatures.Count, 10);
            Assert.AreEqual(activatedProtocolFeatures.More, 10);

            var preactivateFeature =
                activatedProtocolFeatures.ActivatedProtocolFeatures.FirstOrDefault(a => a.FeatureDigest == "0ec7e080177b2c02b278d5088611686b49d739925a92d9bfcacd7fc6b74053bd");

            Assert.AreEqual(preactivateFeature.DescriptionDigest, "64fe7df32e9b86be2b296b3f81dfd527f84e82b98e363bc97e40bc7a83733310");
            Assert.AreEqual(preactivateFeature.ActivationOrdinal, 0);
            Assert.AreEqual(preactivateFeature.ActivationBlockNum, 8430476);
            Assert.AreEqual(preactivateFeature.Dependencies.Count, 0);
            Assert.AreEqual(preactivateFeature.ProtocolFeatureType, "builtin");
            Assert.AreEqual(preactivateFeature.Specification[0].Name, "builtin_feature_codename");
            Assert.AreEqual(preactivateFeature.Specification[0].Value, "PREACTIVATE_FEATURE");
        }

        [TestMethod()]
        public async Task GetBlockAsyncTest()
        {
            var chainClient = new ChainClient(new HttpClient());

            string blockNum = "100000000";
            var block = await chainClient.GetBlockAsync(blockNum);

            Assert.AreEqual(block.BlockNum, Convert.ToUInt32(blockNum));
            Assert.AreEqual(block.ActionMroot, "54f10a997a068694e36a36c5ffff90ae034361bb2dec14900ffb627d79b2744d");
            Assert.AreEqual(block.Confirmed, 0);
            Assert.AreEqual(block.Previous, "05f5e0ff83a94d5f5378ded31d94ea38cf79421f093116f6869d37195f088b12");
            Assert.AreEqual(block.ProducerSignature, "SIG_K1_JzrMXyASaBrbp9BMvqnZmwedwPXiV3oMgn3Lm78H5kXC9RMKVhnF82eHSNRbEvaNjp7kiMbPTnS3utLumVwGTgE4DWiasY");
            Assert.AreEqual(block.Timestamp, "2021-01-23T20:39:33.500");
            Assert.AreEqual(block.TransactionMroot, "c34d7e3800d96af4677f303432570d6b0581e7e88a1293549c7351823efe5a21");

            var transaction = block.Transactions.FirstOrDefault(t =>
                t.Trx.Id == "4ad135560dc1a960ff44c4e7378d023344d596bd4c3a289a472a0d3ee26cce3a");
            Assert.IsNotNull(transaction);
            Assert.AreEqual(transaction.Trx.PackedTrx, "d7890c60eee0f2f3935b000000000130a9cbe6aaa416900000000000a0a6930100009086036f2cff00000000a8ed32321100009086036f2cff080e0ad19a8d7cb9da00");
            Assert.IsTrue(transaction.Trx.Signatures.Contains("SIG_K1_KWvga8wyxR1mtVhtBfuAksndSq7diJJW1uAtLgSnPLvwSUooWC3mRCzHieoUFMDsWRotJod6FZuhFhas4G2XUcL5xKABhY"));
            Assert.AreEqual(transaction.Trx.PackedContextFreeData, "");
            Assert.AreEqual(transaction.Trx.PackedContextFreeData, "");
            Assert.AreEqual(transaction.Trx.Transaction.Expiration, "2021-01-23T20:40:55");
            Assert.AreEqual(transaction.Trx.Transaction.RefBlockNum, 57582);
            Assert.AreEqual(transaction.Trx.Transaction.RefBlockPrefix, 1536422898);
            Assert.AreEqual(transaction.Trx.Transaction.MaxNetUsageWords, 0);
            Assert.AreEqual(transaction.Trx.Transaction.MaxCpuUsageMs, 0);
            Assert.AreEqual(transaction.Trx.Transaction.ContextFreeActions.Count, 0);
            Assert.AreEqual(transaction.Trx.Transaction.Actions.Count, 1);
            Assert.AreEqual(transaction.Trx.Transaction.Actions[0].Account, "m.federation");
            Assert.AreEqual(transaction.Trx.Transaction.Actions[0].Name, "mine");
            Assert.AreEqual(transaction.Trx.Transaction.Actions[0].HexData, "00009086036f2cff080e0ad19a8d7cb9da");
        }

        [TestMethod()]
        public async Task GetBlockHeaderStateAsyncTest()
        {
            var chainClient = new ChainClient(new HttpClient());

            var info = await chainClient.GetInfoAsync();
            var blockHeaderState = await chainClient.GetBlockHeaderStateAsync(info.HeadBlockId);

            Assert.IsNotNull(blockHeaderState);
            Assert.IsNotNull(blockHeaderState.ActiveSchedule);
            Assert.IsNotNull(blockHeaderState.BlockNum);
            Assert.IsNotNull(blockHeaderState.BlockrootMerkle);
            Assert.IsNotNull(blockHeaderState.DposIrreversibleBlocknum);
            Assert.IsNotNull(blockHeaderState.DposProposedIrreversibleBlocknum);
            Assert.IsNotNull(blockHeaderState.Id);
            Assert.IsNotNull(blockHeaderState.ConfirmCount);
            Assert.IsNotNull(blockHeaderState.Header);
            Assert.IsNotNull(blockHeaderState.PendingSchedule);
            Assert.IsNotNull(blockHeaderState.ActivatedProtocolFeatures);
        }

        [TestMethod()]
        public async Task GetCodeAsyncTest()
        {
            var chainClient = new ChainClient(new HttpClient());
            var accountName = "kingcoolcorv";
            var code = await chainClient.GetCodeAsync(accountName,true);

            Assert.AreEqual(code.AccountName, accountName);
            Assert.AreEqual(code.CodeHash, "0000000000000000000000000000000000000000000000000000000000000000");
            Assert.AreEqual(code.Wasm, "");
            Assert.AreEqual(code.Wast, ""); 

            accountName = "eosio";
            code = await chainClient.GetCodeAsync(accountName, true);
            Assert.AreEqual(code.AccountName, accountName);
            Assert.AreEqual(code.CodeHash, "a7a10c302934b581a5a2f5193be8bdfc5c22fbd46fbdc49aeb14f0865e76a5d3");
            Assert.AreNotEqual(code.Wasm, "");
            Assert.AreEqual(code.Wast, "");
        }

        [TestMethod()]
        public async Task GetCurrencyBalanceAsyncTest()
        {
            var chainClient = new ChainClient(new HttpClient());
            var code = "eosio.token";
            var symbol = "WAX";
            var account = "kingcoolcorv";

            var balance = await chainClient.GetCurrencyBalanceAsync(code, account, symbol);

            Assert.IsTrue(balance.First().Contains("WAX"));
        }


        [TestMethod()]
        public async Task GetCurrencyStatsAsyncTest()
        {
            var chainClient = new ChainClient(new HttpClient());
            var code = "eosio.token";
            var symbol = "WAX";
            var currencyStats = await chainClient.GetCurrencyStatsAsync(code, symbol);
            Assert.IsNotNull(currencyStats);
        }

        [TestMethod()]
        public async Task GetInfoAsyncTest()
        {
            var chainClient = new ChainClient(new HttpClient());
            var info = await chainClient.GetInfoAsync();

            Assert.IsNotNull(info.HeadBlockId);
            Assert.IsNotNull(info.BlockCpuLimit);
            Assert.IsNotNull(info.BlockNetLimit);
            Assert.IsNotNull(info.ChainId);
            Assert.IsNotNull(info.ForkDbHeadBlockId);
            Assert.IsNotNull(info.ForkDbHeadBlockNum);
            Assert.IsNotNull(info.HeadBlockId);
            Assert.IsNotNull(info.HeadBlockNum);
            Assert.IsNotNull(info.HeadBlockProducer);
            Assert.IsNotNull(info.HeadBlockTime);
            Assert.IsNotNull(info.ServerFullVersionString);
            Assert.IsNotNull(info.ServerVersion);
            Assert.IsNotNull(info.ServerVersionString);
        }

        [TestMethod()]
        public async Task GetProducersAsyncTest()
        {
            var chainClient = new ChainClient(new HttpClient());
            var producers = await chainClient.GetProducersAsync(null,null,true);

            Assert.IsTrue(producers.Rows.Count > 21);
            Assert.IsTrue(producers.Rows.Any(r => r.Owner.Contains("liquid")));
        }

        [TestMethod()]
        public async Task GetTableByScopeAsyncTest()
        {
            var chainClient = new ChainClient(new HttpClient());
            string code = "eosio.token";
            string table = "accounts";
            string lowerBound = null;
            string upperBound = null;
            int? limit = 120;
            bool? reverse = false;

            var tableScopeResponse = await chainClient.GetTableByScopeAsync(code,table,lowerBound,upperBound,limit,reverse);

            Assert.IsTrue(tableScopeResponse.Rows.Count == limit);
            Assert.IsTrue(tableScopeResponse.Rows.All(r => r.Code == code));
            Assert.IsTrue(tableScopeResponse.Rows.Select(r => r.Scope).Distinct().Count() == limit);
            Assert.IsTrue(tableScopeResponse.Rows.All(r => r.Table == table));
        }
    }
}
```


-------------------------------

Updated on 2022-05-31 at 20:04:45 +0000
