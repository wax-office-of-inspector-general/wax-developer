---
title: WAX-RPC API

parent: WAX API Reference
lang: en-US
---

The WAX Blockchain RPC API includes public endpoints used to get block information, block history, node information, and node producer information. Exposed through **nodeos** plugins, this API is available on the WAX mainnet and your local development environment. 

<strong>Note:</strong> If you're making local requests, <strong>nodeos</strong> must be running.
{: .label .label-yellow }


| Environment | URL |
| --- | ----------- |
| WAX mainnet | Check node availability at [https://validate.eosnation.io/wax/reports/endpoints.html](https://validate.eosnation.io/wax/reports/endpoints.html) |
| Local Testnet | http://127.0.0.1:8888 |

You can make API requests directly to blockchain endpoints:

```
curl --request POST \
  --url http://127.0.0.1:8888/v1/chain/get_info \
  --header 'content-type: application/x-www-form-urlencoded; charset=UTF-8'
```

You can also call these endpoints using **cleos** commands:

```
cleos -u [api-url] get info
```

## Additional Information and Third-Party Tools

Refer to <a href="https://docs.eosnetwork.com/leap/latest/nodeos/rpc_apis/" target="_blank">RPC API documentation </a> for a list of API calls.

<a href="https://github.com/EOSIO/eosjs" target="_blank">eosjs</a> is a javascript API SDK that's used to easily communicate with the WAX RPC API. To simplify development, you can use this tool to access blockchain endpoints.
