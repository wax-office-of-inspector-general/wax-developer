---
title: Deploy Your WAX RNG Contract
layout: default
nav_order: 85
parent: Create a WAX RNG Smart Contract
grand_parent: Tutorials
lang-ref: Deploy Your WAX RNG Contract
lang: en
---

In this example, we'll use WAX-CDT tools to deploy your Lucky Number Generator smart contract. Refer to [WAX-CDT Deploy](/en/dapp-development/deploy-dapp-on-wax/deploy_source) for more information.

1. First we will need to create a self-custodied account on testnet or mainnet to deploy the smart contract. For our example we will assume that the account is called *mywaxrngtest*.

**Note:** You can use the [WAXSweden](https://waxsweden.org/testnet/) team tools to create the testnet account and supply it with funds that you will need to purchase the RAM required for the smart contract deployment.
{: .label .label-yellow }

2. From Docker, we open and unlock the wallet we created in the tutorials about [how to create the development environment](/en/dapp-development/setup-local-dapp-environment/dapp_wallet).

```shell
cleos wallet open -n mywallet && cleos wallet unlock -n mywallet --password {wallet.pwd}
```
and import the mywaxrngtest active private key 

```shell
cleos wallet import --private-key {mywaxrngtest_active_private_key}
```

3. To run the inline **requestrand** action on the **orng.wax** smart contract, you'll need to give your new **mywaxrngtest@active** permission the additional **eosio.code** permission. This permission enhances security and allows your smart contract to send inline actions. From the command line, run the `cleos set account permission` command, and include the literal `--add-code` parameter.

```shell
cleos -u [chain-api-url] set account permission mywaxrngtest active --add-code
```

To verify the new permission, use the `cleos get account` command:

```shell
cleos -u [chain-api-url] get account mywaxrngtest
```

4. Buy some RAM to depoy the smart contract:

```shell
cleos -u [chain-api-url] push action eosio buyram '["mywaxrngtest", "mywaxrngtest", "200.00000000 WAX"]' -p mywaxrngtest@active  
```

5. Finally, set your contract with the `cleos set contract` command:

```shell
cleos -u [chain-api-url] set contract mywaxrngtest mycontracts/rngtest/build/rngtest -p mywaxrngtest@active
```
