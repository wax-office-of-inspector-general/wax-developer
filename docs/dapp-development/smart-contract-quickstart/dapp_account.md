---
title: Create Accounts
layout: default
nav_order: 63
parent: Smart Contract Quickstart
grand_parent: dApp Development
lang-ref: Create Accounts
lang: en
---

A WAX Account is stored on the blockchain and used to identify your smart contracts and dApp users. Blockchain accounts are required to send or receive valid transactions to the blockchain, in both your local and production environments. 

## How it Works

There are several different account types that you'll need to deploy your smart contracts:

- **Primary Account:** This is your primary WAX Blockchain Account, used to stake WAX for CPU and RAM. Locally, this account is simulated using the **eosio** system user. In your local development environment, you can use this system user to create various accounts. In production, all WAX Accounts are free.
- **Smart Contract Accounts:** Each of your smart contracts will need a separate account. 
- **Customer Accounts:** These are the accounts used to interact with your smart contract's actions. In your local development environment, you can create an unlimited number of customer accounts.

In this guide, you'll use **cleos** to create a new WAX Blockchain Account that you can use to deploy your smart contract.

<strong>Tip</strong> For a complete list of cleos create account subcommands and options, refer to <a href="https://docs.eosnetwork.com/leap/latest/cleos/command-reference/create/account" target="_blank">Cleos Reference Guide: create account</a>.
{: .label .label-yellow }

## Before You Begin

- **nodeos** must be running 
    ```shell
    nodeos -e -p eosio \
        --plugin eosio::producer_plugin \
        --plugin eosio::chain_api_plugin \
        --plugin eosio::http_plugin \
        --access-control-allow-origin='*' \
        --contracts-console \
        --http-validate-host=false \
        --verbose-http-errors >> nodeos.log 2>&1 &
    ```
- Your wallet must be Opened and Unlocked
    ```shell
    cleos wallet open
    ```

    ```shell
    cleos wallet unlock --password PW5KRXKVx25yjL3FvxxY9YxYxxYY9Yxx99yyXTRH8DjppKpD9tKtVz
    ```

<!--"/usr/opt/eosio/1.7.3/bin/keosd" launched
Failed to connect to nodeos at http://127.0.0.1:8888/; is nodeos running?

Error 3120006: No available wallet
Ensure that you have created a wallet and have it open
Error Details:
You don't have any wallet!-->

## Create Public/Private Keys

Every WAX Account must have at least one public key. There are two types of public keys, based on account permissions:

- **Owner Key:** Required. This is the primary public key, with full permissions and complete control. In a production account, you should never give this out for most transactions. This key has a private/public key record in your local wallet.
- **Active Key:** Optional. This is a secondary key, which can be changed by the Owner key. It requires an additional private/public key pair listed in your local wallet. In production, use this key to vote, send, and receive transactions.

To create an account for your smart contract, you'll need to create a public and private key pair from your local development wallet. You can do this using your wallet's `create_key` command:

<strong>Note:</strong> Your wallet must be opened and unlocked to create your keys.
{: .label .label-yellow }

```shell
cleos wallet create_key
```

The console prints your public key:

```shell
warn  2019-07-16T23:16:23.435 thread-0  wallet.cpp:223                save_wallet_file     ] saving wallet to file /home/username/eosio-wallet/./default.wallet
Created new private key with a public key of: "EOS4yxqE5KYv5XaB2gj6sZTUDiGzKm42KfiRPDCeXWZUsAZZVXk1F"
```

Store this key someplace that's easily accessible (you'll need this public key in the next step).

## Create a Smart Contract Account

To create a smart contract WAX Account, use the `create account` command:

| Parameter | Example | Description
| --- | ----------- | -------------------------- |
| creator | eosio | The name of the primary account creating the new account. In production, this is your WAX Account. |
| name | waxsc1 | The name of the new account. Account names must be less than 13 characters and only contain letters [a-z] and numbers [1-5]. |
| OwnerKey | EOS4yxqE5KYv5XaB2gj6sZTUDiGzKm42KfiRPDCeXWZUsAZZVXk1F | Public key, created from your local development wallet. |

### Example

```shell
cleos create account eosio waxsc1 EOS4yxqE5KYv5XaB2gj6sZTUDiGzKm42KfiRPDCeXWZUsAZZVXk1F 
```

**cleos** broadcasts the `create account` command to your local blockchain and your wallet signs this transaction with a HASH.

```shell
executed transaction: 4ebdc2eabcd545c7f26679e95d729893ebd0df919850791daa79a10e4865f702  200 bytes  15013 us
#         eosio <= eosio::newaccount            {"creator":"eosio","name":"waxsc1","owner":{"threshold":1,"keys":[{"key":"EOS4yxqE5KYv5XaB2gj6sZTUDi...
warning: transaction executed locally, but may not be confirmed by the network yet         ]
```

You should now have a WAX Blockchain Account to associate with your smart contract.

## Verify Your New Account

To view your new account's information, use the `get account` command:

```shell
cleos get account waxcustomer
```

The console prints your new account's details. Notice that the owner and active keys are the same because we didn't include an active public key when we created the account.

```shell
created: 2019-07-22T20:22:16.000
permissions:
     owner     1:    1 EOS4yxqE5KYv5XaB2gj6sZTUDiGzKm42KfiRPDCeXWZUsAZZVXk1F
        active     1:    1 EOS4yxqE5KYv5XaB2gj6sZTUDiGzKm42KfiRPDCeXWZUsAZZVXk1F
memory:
     quota:       unlimited  used:      2.66 KiB

net bandwidth:
     used:               unlimited
     available:          unlimited
     limit:              unlimited

cpu bandwidth:
     used:               unlimited
     available:          unlimited
     limit:              unlimited
```



