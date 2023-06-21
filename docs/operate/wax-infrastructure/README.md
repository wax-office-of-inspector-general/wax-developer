---
title: WAX Infrastructure/APIs
lang: en-US
---

# Guides for Node and API operators

Infrastructure is the backbone of any application and the same goes with WAX Blockchain and the Web3, DeFi, NFT applications built on top of it.

Compared to other blockchains like Ethereum & Bitcoin, running WAX nodes is quite different and needs a good understanding of the underlying Antelope blockchain software operations.

There are different types of nodes in WAX Blockchain ecosystem that can used for different purposes. These nodes include:

- Peer nodes
- API query nodes
- Validator/Block Producer nodes
- [Ship nodes (a.k.a Archive nodes)](/en/wax-infrastructure/api-archive-guide)
- [Full/Partial History nodes (Deserialized & Consumable data archive nodes)](/en/wax-infrastructure/hyperion-guide)
- NFT standards and Marketplace specific nodes ([AtomicAssets, AtomicMarket](/en/wax-infrastructure/atomic-api-guide) & Simpleassets)

For more detailed explaination on the different types of nodes and their use-cases, please refer: https://docs.eosnetwork.com/leap/latest/nodeos/usage/node-setups/

The guides presented here will share some best practices, help you get a deeper understanding on how you can setup and maintain the WAX blockchain infrastructure in a scalable & resilient way.

If you don't want to setup and manage your infrastructure, there are a couple of service providers you can choose from below:

## Public and Free API Service Providers

There are public APIs provided by different validator teams but often times they are heavily rate-limited etc. You can find the list of public APIs here:

[EOSNATION API List](https://validate.eosnation.io/wax/reports/endpoints.html)

## Paid API Service Providers

Paid service providers offer much more reliability, flexibility and better rate-limits with SLAs for your dapps and removes the hassle to setup & maintain the infrastructure, you can find different service providers and their offerings below:

| Provider Name | Website                                 | Offerings                  | Offerings Type                               | Contact Information                                                  |
| ------------- | --------------------------------------- | -------------------------- | -------------------------------------------- | -------------------------------------------------------------------- |
| WAX Galaxy    | https://waxgalaxy.io/tools/api-services | FAH, PAH, SH, AA           | Dedicated Servers, API Metered Subscriptions | contact@waxgalaxy.io, Telegram ID: @sukeshtedla                      |
| Zaisan        |                                         | FAH, AA, SH, LA            | Dedicated and Shared Servers                 | Telegram ID: @dumplings_5                                            |
| EOS USA       | https://www.eosusa.io/hosting/          | FAH, SH, AA                | Dedicated Servers                            | https://www.eosusa.io/hosting/, Telegram ID: @EOSUSA_Michael         |
| EOS Nation    | https://dfuse.eosnation.io/pricing      | FAH                        | API Metered Subscriptions                    | [info@eosnation.io](mailto:info@eosnation.io), Telegram ID: @mdarwin |
| WAX Sweden    | https://waxsweden.org/commercial-api/   | SH, Contract Notifications | Dedicated Servers                            | https://t.me/eossweden                                               |

- FAH: Full Archive History
- PAH: Partial Archive History
- SH: State History nodes
- AA: AtomicAssets/Market API nodes
- LA: Light API nodes

If you want to communicate with infra service providers, visit this telegram channel:

- https://t.me/waxapi
