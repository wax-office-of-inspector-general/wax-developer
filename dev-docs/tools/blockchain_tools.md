---
title: Blockchain Tools
layout: default
nav_order: 99
parent: Tools & Topics
---

To communicate with the WAX Blockchain, create a local development environment, and locally deploy your smart contracts, you'll need to use three key tools included in the [WAX Blockchain Setup](/wax-docs/dev-docs/blockchain_setup):

## keosd

Used to store private keys. This program automatically starts when you initiate **cleos** commands and can start several instances on your local server.

Refer to EOSIO's <a href="https://developers.eos.io/keosd/dev-docs/" target="_blank">Introduction - keosd</a> for more information.

## nodeos 

This is the core WAX node daemon, used to run a local node on your server. You can initialize **nodeos** with various plug-ins and options.

Nodeos also allows you to communicate with the [WAX RPC API](/wax-docs/dev-docs/blockchain_api).

Refer to EOSIO's <a href="https://developers.eos.io/eosio-nodeos/dev-docs/" target="_blank">Overview - nodeos</a> for more information.

## cleos

Used to interact with your local blockchain and manage local wallets and accounts.

Refer to EOSIO's <a href="https://developers.eos.io/eosio-cleos/docs" target="_blank">Overview - cleos</a> for more information.
