---
title: Deploy to Your Blockchain
layout: default
nav_order: 65
parent: Smart Contract Quickstart
grand_parent: dApp Development
---

<!--To deploy your smart contract to your local development blockchain, you'll need to:

- Compile your smart contract
- Create a blockchain account for your smart contract.-->

In this guide, you'll use **cleos** to deploy and test the wax smart contract you created and compiled in the [Create a Smart Contract](/es/dapp-development/wax-cdt/cdt_use.html#compile-hello-world) tutorial. 

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
- You must create a WAX Account for your smart contract. Refer to [Create Accounts](/es/dapp_account) if you haven't completed this step.

## Deploy Your Smart Contract

To deploy your smart contract's WASM file to your local blockchain, use `cleos set contract` from the command line:

| Parameter | Example | Description
| --- | ----------- | -------------------------- |
| account | waxsc1 | Your smart contract's account. |
| path | /users/wax-blockchain/wax-cdt/mycontracts/wax | Full path to your WASM file. |
| permission | -p waxsc1@active | Active or Owner permission for your smart contract's account. |

```shell
cleos set contract waxsc1 /users/wax-blockchain/wax-cdt/mycontracts/wax -p waxsc1@active
```

The console prints the following confirmation:

```shell
Reading WASM from /users/wax-blockchain/wax-cdt/mycontracts/wax/wax.wasm...
Publishing contract...
executed transaction: 8a79664a3f0457513fabaa5753c41b18588cb2994cd5e3164328eafc9663f7a8  2832 bytes  57440 us
#         eosio <= eosio::setcode               {"account":"waxsc1","vmtype":0,"vmversion":0,"code":"0061736d01000000013a0b60017f0060027f7f0060037f7...
#         eosio <= eosio::setabi                {"account":"waxsc1","abi":"0e656f73696f3a3a6162692f312e3100010567726565740000010000000080acd46505677...
warning: transaction executed locally, but may not be confirmed by the network yet         ]
```

Your smart contract should now be live on your local blockchain.

## Test Your Smart Contract

To test your smart contract, use `cleos push action` from the command line:

| Parameter | Example | Description
| --- | ----------- | -------------------------- |
| account | waxsc1 | Your smart contract's account. |
| action | hi | Name of action. |
| datastream | '["YourName"]' | Enter your name or any other string. |
| permission | -p waxsc1@active | Active or Owner permission for your smart contract's account. |

```shell
cleos push action waxsc1 hi '["YourName"]' -p waxsc1@active
```

The console prints the following:

```shell
executed transaction: 6a0b1489d903f2cacc6480830358f07aaf65b20bf1d7e855dc20097f4d64dc52  104 bytes  1727 us
#        waxsc2 <= waxsc2::hi                   {"nm":"YourName"}
>> Name : YourName
warning: transaction executed locally, but may not be confirmed by the network yet         ]
```

If you receive an error that the transaction took too long, run `cleos push action` again. If you still receive an error, try restarting **nodeos**.

```shell
Error 3080006: Transaction took too long
Error Details:
deadline exceeded
pending console output:
```
