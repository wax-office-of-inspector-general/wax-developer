---
title: WAX Testnet Quickstart
layout: default
nav_order: 66
parent: dApp Development
---

In this guide, you'll learn how to create Testnet accounts and deploy your smart contracts to the WAX Testnet.

<strong>Tip:</strong> Every smart contract requires a blockchain account. It's recommended that you name your accounts based on your smart contract's functionality (e.g., mywaxnftgame). Account names must be 12 characters and only contain letters [a-z] and numbers [1-5].
{: .label .label-yellow }

## Create and Fund Testnet Accounts

1. <a href="https://waxsweden.org/testnet/" target="_blank">Create a Testnet Account</a>. Save your private and public keys in a safe place. 

2. From the Testnet homepage, get free WAX Tokens to fund your new account. 

3. To deploy your smart contracts, you'll need to create a wallet using your public and private keys. You can use the wallet features on <a href="https://local.bloks.io/wallet/transfer?nodeUrl=testnet.waxsweden.org&coreSymbol=WAX&corePrecision=8&systemDomain=eosio&hyperionUrl=https%3A%2F%2Ftestnet.waxsweden.org" target="_blank">Bloks.io</a>, or use our [Docker images](/wax-docs/dev-docs/docker_qstart) to manage your wallet. 

    To create a wallet from a Docker container, use the <span class="codeSample">cleos wallet</span> command:

    ```shell
    cleos rm -f ~/eosio-wallet/{account.name}.wallet &&
    cleos wallet create -n {account.name} --to-console &&
    cleos wallet import -n {account.name} --private-key {active.privatekey} &&
    cleos wallet import -n {account.name} --private-key {owner.privatekey}
    ```

    Store your wallet password in a safe place - you'll need it to run blockchain commands.

4. Once you have a wallet configured with your Testnet account, you can stake NET, CPU, and RAM from Bloks.io or your Docker container.

    Buy RAM:

    ```shell
    cleos -u https://testnet.waxsweden.org system buyram {account.name} {account.name} "3.00000000 WAX"
    ```

    Stake NET and CPU (to yourself, from the same account):

    ```shell
    cleos -u https://testnet.waxsweden.org system delegatebw {account.name} {account.name} "4.00000000 WAX" "5.00000000 WAX"
    ```

## Deploy Smart Contracts to the WAX Testnet

<strong>Tip:</strong> To complete these steps, make sure that your wallet is opened and unlocked. Refer to Troubleshooting below for more information.
{: .label .label-yellow }

1. From an interactive Docker bash session, navigate to your smart contracts directory and build your smart contract.

    ```shell
    eosio-cpp -abigen waxnft.cpp -o waxnft.wasm 
    ```

2. If you're calling external contract actions from your smart contract (e.g., WAX RNG or Simple Assets), make sure to elevate your account permissions:

    ```shell
    cleos -u https://testnet.waxsweden.org set account permission {account.name} active --add-code
    ```

3. **Deploy.** From the command line, set your contract with the <span class="codeSample">cleos set contract</span> command: 

    ```shell
    cleos -u https://testnet.waxsweden.org set contract {account.name} $(pwd) waxnft.wasm waxnft.abi   
    ```

Your smart contract is now live on the WAX Testnet! 

## Troubleshooting

If you receive wallet and/or authorization errors, you may need to open and unlock your wallet:

```shell
cleos wallet open -n {account.name} &&
cleos wallet unlock -n {account.name} --password {wallet.pwd}
```