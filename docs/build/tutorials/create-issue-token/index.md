---
title: Create and Mint a Fungible Token
order: 10
---

# Create and Mint a Fungible Token Asset

In this tutorial, you will learn how to create and mint a fungible token asset on the WAX mainnet.

## Before You Start

* You will need to complete our [Quick Start with Docker](/build/dapp-development/docker-setup) (recommended) and use the [WAX Blockchain Development Guide](/build/dapp-development) to build from source.

* To compile and deploy your smart contract, you will need to use the [WAX Contract Development Toolkit (WAX-CDT)](/build/dapp-development/wax-cdt).

* To deploy your smart contract on the WAX mainnet or the WAX testnet, you will need to create a self-managed WAX Blockchain Account.

## Clone the Smart Contract from GitHub

1. Clone the fungible asset smart contract from the WAX GitHub repository:

    ```shell
    git clone https://github.com/worldwide-asset-exchange/wax-system-contracts.git
    ```

2. Navigate to the smart contract directory:

    ```shell
    cd wax-system-contracts/contracts/eosio.token
    ```

:::warning IMPORTANT
For the actions that we will perform below, it is necessary to unlock the wallet
```shell
cleos wallet unlock
```
:::

:::tip NOTE
Replace these variables with your own values:
- `<TOKEN_ACCOUNT_NAME>`: Name of the fungible asset token account (Will be the owner of the fungible asset token).
- `<OWNER_PUBLIC_KEY>`: Public key of the fungible asset token account.
- `<ACTIVE_PUBLIC_KEY>`: Active public key of the fungible asset token account.
- `<ACTIVE_PRIVATE_KEY>`: Active private key of the fungible asset token account.
- `<MAX_ISSUE>`: Maximum amount of fungible asset tokens to mint.
- `<SYMBOL>`: Symbol of the fungible asset token.
- `<AMOUNT>`: Amount of fungible asset tokens to mint (issue) or to send (transfer). The total of minted tokens cannot exceed the `<MAX_ISSUE>` value.
:::


3. Create an account for the fungible asset token:

    ```shell
    cleos create account eosio <TOKEN_ACCOUNT_NAME> <OWNER_PUBLIC_KEY> <ACTIVE_PUBLIC_KEY>
    ```

4. Add the fungible asset token account to the wallet:

    ```shell
    cleos wallet import --private-key <ACTIVE_PRIVATE_KEY>
    ```

5. Compile the smart contract:

    ```shell
    mkdir build
    cd build
    cmake ..
    make
    ```
6. Deploy the smart contract on the WAX mainnet:

    ```shell
    cleos set contract eosio.token ../ --abi eosio.token.abi -p <TOKEN_ACCOUNT_NAME>@active
    ```
7. Mint the fungible asset token:

    ```shell
    cleos push action <TOKEN_ACCOUNT_NAME> create '["<TOKEN_ACCOUNT_NAME>", "<MAX_ISSUE> <SYMBOL>"]' -p <TOKEN_ACCOUNT_NAME>@active
    ```

8. Verify that the fungible asset token has been minted correctly:

    ```shell
    cleos get currency stats <TOKEN_ACCOUNT_NAME> <SYMBOL>
    ```
9. Mint additional fungible asset tokens:

    ```shell
    cleos push action <TOKEN_ACCOUNT_NAME> issue '["<TOKEN_ACCOUNT_NAME>", "<AMOUNT> <SYMBOL>", "memo"]' -p <TOKEN_ACCOUNT_NAME>@active
    ```
10. Verify that the additional fungible asset tokens have been minted correctly:

    ```shell
    cleos get currency stats <TOKEN_ACCOUNT_NAME> <SYMBOL>
    ```

11. Transfer fungible asset tokens to another account:

    ```shell
    cleos push action <TOKEN_ACCOUNT_NAME> transfer '["<TOKEN_ACCOUNT_NAME>", "<RECIPIENT_ACCOUNT_NAME>", "<AMOUNT> <SYMBOL>", "memo"]' -p <TOKEN_ACCOUNT_NAME>@active
    ```
  
12. Verify that the fungible asset tokens have been transferred correctly:

    ```shell  
    cleos get currency balance <TOKEN_ACCOUNT_NAME> <RECIPIENT_ACCOUNT_NAME> <SYMBOL>
    ```

Congratulations! You have created and minted a fungible token asset on the WAX mainnet.