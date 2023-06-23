---
title: Blockchain Environments
order: 20
---

# Blockchain Environments

Below you'll find WAX versions, URLs, and development environment information.

| Service | Description |
|---------|-------------|
| [Docker Images](https://hub.docker.com/u/waxteam) | Use WAX Docker images to run a local node, use blockchain tools, and compile your smart contracts. Refer to [Docker Quickstart](/build/dapp-development/docker-setup/) for more information. |
| [waxjs](https://github.com/worldwide-asset-exchange/waxjs) | WaxJS Javascript API for integration with the MyCloudWallet. Use this to easily sign in users and send transactions to the WAX Blockchain from your dApp. Refer to [MyCloudWallet Quickstart](/learn/my-cloud-wallet/waxjs/waxjs_qstart) for more information. |
| [wax-blockchain](https://github.com/worldwide-asset-exchange/wax-blockchain) | WAX Blockchain source files. Refer to [WAX Blockchain Setup](/build/dapp-development/wax-blockchain-setup/) to get started. |
| [wax-cdt](https://github.com/worldwide-asset-exchange/wax-cdt) | WAX Contract Development Toolkit. Refer to [WAX Contract Development Toolkit (WAX-CDT)](/build/dapp-development/wax-cdt/) to get started. |

## WAX Mainnet

| Service | URL | Description |
|---------|-----|-------------|
| Blockchain URL | [chain-api-url](/operate/wax-infrastructure/#public-and-free-api-service-providers) | Used to make API calls and deploy your smart contracts to the WAX mainnet. |
| Blockchain P2P | peers.wax.io:9876 | Peering endpoint for synchronizing a producer or full node (with no protocol in front of it). |
| Blockchain Explorer | [https://waxblock.io](https://waxblock.io/) | waxblock.io block explorer. |
| WAX Account | (e.g., Scatter) | Create a WAX Blockchain Account. |

## WAX Public Testnet

[WAX sw/eden](https://waxsweden.org/) provides a WAX Testnet allowing you to create test accounts, test smart contracts, use API endpoints, and more.

| Service | URL | Description |
|---------|-----|-------------|
| Testnet Site | [WAX Testnet](https://waxsweden.org/testnet/) | Use WAX sw/eden's site to create test accounts, find sample scripts, and more. |
| Blockchain URL | [https://testnet.waxsweden.org](https://testnet.waxsweden.org) | Used to make API calls and deploy your smart contracts to the WAX Testnet. |
| Public Endpoints | [endpoints.json](https://github.com/eosswedenorg/waxtestnet/tree/master/endpoints) | Additional P2P and API endpoint URLs. |
| Blockchain P2P | testnet.waxsweden.org:59876 | Peering endpoint for synchronizing a producer or full node (with no protocol in front of it). |
| Blockchain Explorer | [Bloks.io Testnet](https://local.bloks.io/?nodeUrl=testnet.waxsweden.org&coreSymbol=WAX&corePrecision=8&systemDomain=eosio&hyperionUrl=https%3A%2F%2Ftestnet.waxsweden.org) | Testnet block explorer. |
| Test Account | [https://waxsweden.org/create-testnet-account/](https://waxsweden.org/create-testnet-account/) | Use the "Create testnet account" tool on the [Testnet](https://waxsw

eden.org/testnet/) homepage or visit the direct link. |

## WAX Local Testnet

When you [Set Up a Local dApp Environment](/build/dapp-development/), you can make calls to your local API using the following URL.

| Service | URL | Description |
|---------|-----|-------------|
| Blockchain URL | [http://127.0.0.1:8888](http://127.0.0.1:8888) | Used to make API calls in your local development environment. |

## C++ Environment

You can write WAX smart contracts using the C++ programming language. No custom language is required, although you'll need to familiarize yourself with the WAX C/C++ API library. This library contains the core files required to communicate with the WAX Blockchain. When you're ready to get started, refer to:

- [WAX Contract Development Toolkit (WAX-CDT)](/build/dapp-development/wax-cdt/)
- [WAX-CDT API](/learn/api-reference/cdt_api/)
- [Smart Contract Quickstart](/build/dapp-development/smart-contract-quickstart/)

## Development Tools

You can use any third party C++ editor or IDE to write your smart contracts, such as Sublime Text, Atom, CLion, Eclipse, or Visual Studio products.

[EOS Studio](https://www.eosstudio.io/) is a graphic IDE built for EOSIO dApp development, available on Linux, Mac OS, and Windows. This tool features a code editor, contract inspector, and a network manager. To integrate WAX with EOS Studio, refer to [How to use EOS Studio with WAX](https://github.com/worldwide-asset-exchange/wax-blockchain/tree/develop/samples/eos-studio). Our script provides a minimal integration, developed and tested with Ubuntu 18.04.

[eosjs](https://github.com/EOSIO/eosjs) is a javascript API SDK you can use to easily communicate with the WAX Blockchain API. Refer to [WAX RPC API](/learn/api-reference/rpc_api/) for more information.

[dfuse](https://www.dfuse.io) is a powerful suite of APIs that allow you to query the WAX Blockchain and stream real-time data. Refer to [dfuse for WAX dApps](/learn/api-reference/dfuse/) for more information.