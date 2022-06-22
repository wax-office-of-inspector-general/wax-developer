---
title: Access Your Local API
layout: default
nav_order: 42
parent: Set Up a Local dApp Environment
grand_parent: dApp Development
lang-ref: Access Your Local API
lang: en
---

The WAX mainnet exposes a set of **nodeos** API endpoints (RPC API), allowing you to interact with the WAX Blockchain. Commonly known as [chain-api-url](/en/wax-infra/#public-and-free-api-service-providers)

Now that you have a local node running on your local development server, these endpoints can be accessed from your local IP address: `http://127.0.0.1:8888`. This API endpoint is initialized when you pass the `plugin eosio::chain_api_plugin` parameter to **nodeos**.

To test your local RPC API, from the command line, make a **curl** request to the `get_info` endpoint:

```
curl --request POST \
  --url http://127.0.0.1:8888/v1/chain/get_info \
  --header 'content-type: application/x-www-form-urlencoded; charset=UTF-8'
```

You should receive the following JSON Response:

```
{
   "server_version":"448287d5",
   "chain_id":"cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
   "head_block_num":1937,
   "last_irreversible_block_num":1936,
   "last_irreversible_block_id":"000007905e94a4406ef34a227cf815154ac6886bf54deaa2d35db606cb4b667d",
   "head_block_id":"00000791a899e1751e60a13b77817f7243496cdd68010cd84505023200fd9e8a",
   "head_block_time":"2019-07-16T21:43:19.500",
   "head_block_producer":"eosio",
   "virtual_block_cpu_limit":1384557,
   "virtual_block_net_limit":7271761,
   "block_cpu_limit":199900,
   "block_net_limit":1048576,
   "server_version_string":"v1.7.3"
}
```

<strong>Tip:</strong> Notice the "head_block_producer":"eosio" parameter. Locally, <strong>eosio</strong> is the system account. If you make a request to the WAX mainnet API, it would return an actual block producer (e.g., "head_block_producer": "strongblock1").
{: .label .label-yellow }

**nodeos** must be running to call this endpoint. If not, you'll receive the following message:

```
curl: (7) Failed to connect to 127.0.0.1 port 8888: Connection refused
```

## Additional Information

Refer to [WAX RPC API](/en/api-reference/rpc_api) for more information.
