---
title: Deploy Your NFT Smart Contract 
layout: default
nav_order: 90
parent: Create Non-Fungible Tokens
grand_parent: Tutorials
---

Next, we'll use WAX-CDT tools to deploy your NFT smart contract to the WAX mainnet. Refer to [WAX-CDT Deploy](/wax-developer/docs/deploy_source) for more information.

1. From Docker, open and unlock your wallet. 

    ```shell
    cleos wallet open -n mywallet && cleos wallet unlock -n mywallet --password {wallet.pwd}
    ```

2. Using **cleos** or an EOSIO compatible wallet, create a new public/private key pair for your smart contract.

    ```shell
    cleos wallet create_key -n mywallet
    ```

3. From the command line, use <span class="codeSample">cleos system newaccount</span>. The example below uses **waxdappacct1** as the primary WAX Account holder and creates a new smart contract account named **waxnftowner1**. To run this command, you'll need to have the proper authority. This means that the wallet containing your primary account must be opened and unlocked. 

    ```shell
    cleos -u https://chain.wax.io system newaccount waxdappacct1 waxnftowner1 EOS7jEb46pDiWvA39faCoFn3jUdn6LfL51irdXbvfpuSko86iNU5x --stake-net '5.00000000 WAX' --stake-cpu '5.00000000 WAX' --buy-ram-kbytes 32
    ```

4. To run the inline **create** action in the **simpleassets** smart contract, you'll need to give your new **waxnftowner1@active** permission the additional **eosio.code** permission. This permission enhances security and allows your smart contract to send inline actions. From the command line, run the <span class="codeSample">cleos set account permission</span> command, and include the literal <span class="codeSample">--add-code</span> parameter.

    ```shell
    cleos -u https://chain.wax.io set account permission waxnftowner1 active --add-code
    ```

    To verify the new permission, use the <span class="codeSample">cleos get account</span> command:

    ```shell
     cleos -u https://chain.wax.io get account waxnftowner1
    ```

    The **active** permission now displays the new **waxnftowner1@eosio.code** permission.

    ```shell
    created: 2019-12-02T16:13:29.500
    permissions:
     owner     1:    1 EOS7jEb46pDiWvA39faCoFn3jUdn6LfL51irdXbvfpuSko86iNU5x
     active    1:    1 EOS7jEb46pDiWvA39faCoFn3jUdn6LfL51irdXbvfpuSko86iNU5x, 1 waxnftowner1@eosio.code
    ```

5. Finally, set your contract with the <span class="codeSample">cleos set contract</span> command (make sure that you're in the **waxnft** folder): 

    ```shell
    cleos -u https://chain.wax.io set contract waxnftowner1 $(pwd) waxrng.wasm waxrng.abi
    ```








