---
title: Deploy Your WAX RNG Contract
layout: default
nav_order: 85
parent: Create a WAX RNG Smart Contract
grand_parent: Tutorials
---

In this example, we'll use WAX-CDT tools to deploy your Lucky Number Generator smart contract. Refer to [WAX-CDT Deploy](/wax-docs/dev-docs/deploy_source) for more information.

1. From Docker, open and unlock your wallet. 

    ```shell
    cleos wallet open -n mywallet && cleos wallet unlock -n mywallet --password {wallet.pwd}
    ```

2. Using **cleos** or an EOSIO compatible wallet, create a new public/private key pair for your smart contract.

    ```shell
    cleos wallet create_key -n mywallet
    ```

3. From the command line, use <span class="codeSample">cleos system newaccount</span>. The example below uses **waxdappacct1** as the primary WAX Account holder and creates a new smart contract account named **waxrng**. To run this command, you'll need to have the proper authority. This means that the wallet containing your primary account must be opened and unlocked. 

    ```shell
    cleos -u https://chain.wax.io system newaccount waxdappacct1 waxrng EOS7jEb46pDiWvA39faCoFn3jUdn6LfL51irdXbvfpuSko86iNU5x --stake-net '0.50000000 WAX' --stake-cpu '0.50000000 WAX' --buy-ram-kbytes 32
    ```

4. To run the inline **requestrand** action on the **orng.wax** smart contract, you'll need to give your new **waxrng@active** permission the additional **eosio.code** permission. This permission enhances security and allows your smart contract to send inline actions. From the command line, run the <span class="codeSample">cleos set account permission</span> command, and include the literal <span class="codeSample">--add-code</span> parameter.

    ```shell
    cleos -u https://chain.wax.io set account permission waxrng active --add-code
    ```

    To verify the new permission, use the <span class="codeSample">cleos get account</span> command:

    ```shell
     cleos -u https://chain.wax.io get account waxrng
    ```

    The **active** permission now displays the new **waxrng@eosio.code** permission.

    ```shell
    created: 2019-08-22T16:13:29.500
    permissions:
     owner     1:    1 EOS7jEb46pDiWvA39faCoFn3jUdn6LfL51irdXbvfpuSko86iNU5x
     active    1:    1 EOS7jEb46pDiWvA39faCoFn3jUdn6LfL51irdXbvfpuSko86iNU5x, 1 waxrng@eosio.code
    ```

5. Finally, set your contract with the <span class="codeSample">cleos set contract</span> command: 

    ```shell
    cleos -u https://chain.wax.io set contract waxrng mycontracts/waxrng/build/waxrng waxrng.wasm waxrng.abi
    ```

