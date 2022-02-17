---
title: Deploy an EOS dApp on WAX
layout: default
nav_order: 10
parent: dApp Development
---

WAX is fully compatible with EOS smart contracts and offers free blockchain accounts and cheaper fees. This guide provides an overview of how to deploy your EOS dApps to the WAX mainnet.

<!--## What's Compatible

* All EOSIO System Contracts
* All EOSIO CDT libraries
* <a href="https://github.com/EOSIO/eosjs" target="_blank">eosjs</a> API SDK-->

## Blockchain Accounts

1. To deploy your smart contracts to the WAX mainnet, you'll need to create a self-managed WAX Blockchain Account.

2. Make sure you have enough WAX staked in your account to allocate resources.

3. If your dApp interacts with blockchain accounts, your customers will also need to create a free, verified WAX Blockchain Account. You can send them to the following link:

    <a href="https://all-access.wax.io" target="_blank">http://<span></span>all-access.wax.io</a>

    A WAX Cloud Wallet Account automatically creates a WAX Blockchain account for your customers and allows you to integrate WaxJS into your dApps. Refer to [WAX Cloud Wallet Quickstart](/es/waa_waxjs_qstart) for more information.

## Development Environment

If you'd like to test your smart contracts on WAX, you can:

* Complete our [Docker Quickstart](/es/dapp-development/docker-setup) (recommended) or use the [WAX Blockchain Setup](/es/dapp-development/wax-blockchain-setup) to build from source.
* Build your contracts using the [WAX Contract Development Toolkit (WAX-CDT)](/es/dapp-development/wax-cdt).
* [Set Up a Local dApp Environment](/es/dapp-development/setup-local-dapp-environment).
* Deploy to the [WAX Testnet](/es/dapp-development/testnet-quickstart).

<strong>Warning:</strong> Setting up WAX source code in your local development environment will overwrite a current EOS installation. If you'd like to keep your EOS environment, it's recommended that you use Docker, a virtual machine, or a separate development environment.
{: .label .label-yellow }

## Deploy Your Smart Contracts

You must compile your smart contracts using the [WAX Contract Development Toolkit (WAX-CDT)](/es/dapp-development/wax-cdt).

If you don't want to install the WAX source code, you can use our [Docker Quickstart](/es/dapp-development/docker-setup) or custom scripts to deploy your smart contracts. Refer to [Deploy Your dApp on WAX](/es/dapp-development/deploy-dapp-on-wax) for more information.
