---
title: Blockchain Tools
order: 99
---

# Blockchain Tools

To communicate with the WAX Blockchain, create a local development environment, and locally deploy your smart contracts, you'll need to use three key tools included in the [WAX Blockchain Setup](/build/dapp-development/wax-blockchain-setup/):

## keosd

Used to store private keys. This program automatically starts when you initiate **cleos** commands and can start several instances on your local server.

Refer to EOS's <a href="https://docs.eosnetwork.com/manuals/leap/latest/keosd/" target="_blank">Introduction - keosd</a> for more information.

## nodeos 

This is the core WAX node daemon, used to run a local node on your server. You can initialize **nodeos** with various plug-ins and options.

Nodeos also allows you to communicate with the [WAX RPC API](/build/api-reference/rpc_api).

Refer to EOS's <a href="https://docs.eosnetwork.com/manuals/leap/latest/nodeos/" target="_blank">Overview - nodeos</a> for more information.

## cleos

Used to interact with your local blockchain and manage local wallets and accounts.

Refer to EOS's <a href="https://docs.eosnetwork.com/manuals/leap/latest/cleos/" target="_blank">Overview - cleos</a> for more information.
