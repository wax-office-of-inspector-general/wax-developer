---
title: WaxJS Overview
layout: default
parent: WAX Cloud Wallet
has_children: true
has_toc: true
lang-ref: WaxJS Overview
lang: en
---

**WaxJS** is a Javascript library that connects to WAX Cloud Wallet to sign in users and execute smart contract transactions, without requiring an external wallet (e.g., Scatter). Similar to the standard OAuth 2.0 flow, users simply allow your dApp to access their WAX Blockchain Account name. Once your dApp's been authorized, users can approve your smart contract transactions from their WAX Cloud Wallet Account.

To get started, you simply need to include our [WaxJS](https://github.com/worldwide-asset-exchange/waxjs) library and make a few simple calls from your client. If you'd like to jump right to the code and run our live WaxJS example, refer to [WaxJS Demo](/en/wax-cloud-wallet/waxjs/waxjs_demo).
## How it Works

**WaxJS** uses the WAX Cloud Wallet and the [EOSIO/eosjs](https://github.com/EOSIO/eosjs)  Javascript API to provide an easy-to-use interface between your users and the WAX Blockchain.

To use **WaxJS**, you simply need to:

1. Add the **WaxJS** library to your client
2. Use `wax.login` to sign users in with WAX Cloud Wallet (Auto-login features available)

![WaxJS Login](/assets/img/wax-cloud-wallet/waxjs/waxjs_login.png){:class="img-responsive"}

3. Use `wax.api` to send your transactions to the WAX Blockchain

![WaxJS Sign](/assets/img/wax-cloud-wallet/waxjs/waxjs_sign.png){:class="img-responsive"}

In the next sections, you'll learn how to install and use **WaxJS**.
