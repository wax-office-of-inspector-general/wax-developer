---
title: Set Up a Local dApp Environment
layout: default
nav_order: 40
parent: dApp Development
has_children: true
---

Our [Docker Development Image](/docs/docker_qstart) includes everything you need to set up a local development environment. This reduces your development costs and offers a fully-functional sandbox for both new and experienced dApp developers. The WAX local testnet allows you to easily:

- Run a local development node on your server
- Create free, local accounts to associate with your contract and simulate customers
- Deploy and test your smart contracts locally
- Estimate CPU and RAM usage
- Make local blockchain API calls 

## How it Works

To set up your local development environment, you'll need to use three key [Blockchain Tools](/docs/blockchain_tools): keosd, nodeos, and cleos.

<!--To get started, you'll need to use three key tools included in the [WAX Blockchain Setup](/docs/blockchain_setup):

- **nodeos:** This is the core WAX node daemon, used to run a local node on your server. **nodeos** can be configured with various plug-ins and options.
- **keosd:** Used to store private keys. This program is automatically started when you initiate **cleos** commands and can start several instances on your local server.
- **cleos:** Used to interact with your local blockchain and manage local wallets and accounts. -->

When you start **nodeos** with various development plug-ins, it will launch a local test node on your server and start producing blocks. These blocks are written to a log, allowing you to view signed transactions initiated from your smart contracts. 

Using a built-in development key and system account, you can also: 

- **Create a Development Wallet.** This is required to create accounts.
- **Create a Contract Account.** Each of your smart contracts must be associated with an account.
- **Create Test Users.** You can create as many local accounts as you need and fund them with local tokens.

## Before You Begin

Before you set up your local development environment:

- You'll need to complete our [Docker Quickstart](/docs/docker_qstart) (recommended) or use the [WAX Blockchain Setup](/docs/blockchain_setup) to build from source.
- Have a text document or note program ready. You'll need to use a wallet password and a public key to create accounts. 
