---
title: Create/Issue a Fungible Token
order: 10
---

# How to deploy Fungible token on WAX blockchain

Deploying a fungible token on the WAX blockchain can be an exciting project for developers. This guide provides comprehensive instructions on setting up, deploying, and managing a fungible token using the WAX blockchain.

👉 [Example Repository](https://github.com/worldwide-asset-exchange/fungible-token-tutorial)

## Prerequisites

Before beginning, ensure you have the following tools installed:

- [cdt](https://github.com/AntelopeIO/cdt): Contract development toolkit for developing the contract
- [leap](https://github.com/AntelopeIO/leap): Include the cleos command line tool to interact with the blockchain.

## Build token contract

For easier to setup and deploy, original token contract has been copied from [wax-contract](https://github.com/worldwide-asset-exchange/wax-system-contracts/tree/develop/contracts/eosio.token/) to this repo. Prebuilt contract store on [build](https://github.com/worldwide-asset-exchange/fungible-token-tutorial/tree/master/build) folder.

In case you want to build contract:

```bash
$ cdt-cpp -abigen -R eosio.token/ricardian eosio.token/src/eosio.token.cpp -o ./build/eosio.token.wasm -I eosio.token/include --no-missing-ricardian-clause
```

This command compiles the source code into a WebAssembly (WASM) file, ready for deployment on the blockchain.

## Deploy contract

### 1. Create contract account

A contract account is necessary to deploy and manage your token. Ensure this account has at least 160 KB of RAM to store the contract and setup tables. Use the following command to create a new account:

```bash
$ cleos system newaccount eosio tokenexample EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV --stake-net "10.00000000 WAX" --stake-cpu "10.00000000 WAX" --buy-ram-kbytes 160 --transfer
```

### 2. Deploy token contract

To deploy the token contract onto the blockchain, use the command:

```bash
$ cleos set contract tokenexample . build/eosio.token.wasm build/eosio.token.abi -p tokenexample
```

### 3. Check deploy contract

Verify the deployment by checking the code hash of the contract:

```bash
$ cleos get code tokenexample
code hash: 64ac1483b2ff62a4d36173882dca2a278c50e11136b70370123da6775e63659b
```

## Configure token

### 1. Create new token

Call action `create` of token contract:
- require contract permission
- parameters:
  - issuer: issuer account, account has permission to issue and retire token
  - maximum_supply: maximum supply of token, make sure that you have correct number since it can not be changed

```bash
$ cleos push action tokenexample create '["tokenissuer", "1000000000.0000 EXP"]' -p tokenexample
```

### 2. Issue token

Issue the token by calling the issue `action`, which also requires issuer permission:
- require issuer permission
- parameters:
  - to: token receiver
  - quantity: quantity to issue
  - memo

```bash
$ cleos push action tokenexample issue '["tokenissuer", "1000000.0000 EXP", "first issue"]' -p tokenissuer
```

Get `stat` table to check issued amount:

```bash
$ cleos get table tokenexample EXP stat
{
  "rows": [{
      "supply": "1000000.0000 EXP",
      "max_supply": "1000000000.0000 EXP",
      "issuer": "tokenexample"
    }
  ],
  "more": false,
  "next_key": ""
}
```

Check token balance:

```bash
$ cleos get table tokenexample tokenissuer accounts
{
  "rows": [{
      "balance": "1000000.0000 EXP"
    }
  ],
  "more": false,
  "next_key": ""
}
```

### 3. Burn token

Call `retire` action of token contract:
- require issuer permission
- issuer balance must greater than burn amount
- parameters:
  - quantity: burning quantity
  - memo

```bash
$ cleos push action tokenexample retire '["1.0000 EXP", "first burn"]' -p tokenissuer
```

Check token stat after burn:

```bash
$ cleos get table tokenexample EXP stat
{
  "rows": [{
      "supply": "999999.0000 EXP",
      "max_supply": "1000000000.0000 EXP",
      "issuer": "tokenexample"
    }
  ],
  "more": false,
  "next_key": ""
}
```

## Conclusion
Deploying and managing a fungible token on the WAX blockchain involves several detailed steps from setting up the development environment to managing the lifecycle of the token. By following this guide, developers can effectively deploy and manage their own digital assets on the WAX blockchain, leveraging the robust features and secure infrastructure it offers.
