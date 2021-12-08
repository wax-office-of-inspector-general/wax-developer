---
title: WAX-CDT Deploy
layout: default
nav_order: 73
parent: Deploy Your dApp on WAX
grand_parent: dApp Development
---

In this guide, you'll use the <span class="codeSample">cleos set contract</span> command to deploy your smart contract to the WAX mainnet.

Before you begin, you'll need to compile your smart contract and have your WASM and ABI files ready. Refer to [Smart Contract Quickstart](/wax-docs/dev-docs/dapp_build) or [WAX-CDT Build Tools](/wax-docs/dev-docs/cdt_cpp) for more information.

You'll also need to:

* Create a self-managed WAX Blockchain Account. 
* Make sure you have enough WAX staked in your account to allocate resources. 

To deploy your smart contract to the WAX mainnet:

1. Open and unlock your wallet. 

    ```shell
    cleos wallet open -n mywallet && cleos wallet unlock -n mywallet --password {wallet.pwd}
    ```

2. Generate a public/private key pair that's used to create your smart contract's blockchain account. From the command line, use the <span class="codeSample">cleos create key</span> command:

    ```shell
    cleos wallet create_key -n mywallet
    ```

    <strong>Note:</strong> You can also use an EOSIO compatible wallet (e.g., Scatter).
    {: .label .label-yellow }

3. From the command line, use <span class="codeSample">cleos system newaccount</span> to create your smart contract's account. To run this command, you'll need to have the proper authority. This means that the wallet containing your primary account must be opened and unlocked. 

    <table>
    <thead>
    <tr>
    <th style="width:25%">Parameter</th>
    <th>Example</th>
    <th>Description</th>
    </tr>
    </thead>

    <tbody>
    <tr>
    <td>-u</td>
    <td>-u <a href="https://chain.wax.io">https://chain.wax.io</a></td>
    <td>This is the WAX Blockchain URL.</td>
    </tr>

    <tr>
    <td>system</td>
    <td>system</td>
    <td>Sends the system contract action to the WAX Blockchain.</td>
    </tr>

    <tr>
    <td>newaccount</td>
    <td>newaccount</td>
    <td>Command to create a new account.</td>
    </tr>

    <tr>
    <td>primaryAccount</td>
    <td>waxdappacct1</td>
    <td>Your self-managed WAX Blockchain Account with staked WAX tokens.</td>
    </tr>

    <tr>
    <td>contractAccount</td>
    <td>HelloWorld10</td>
    <td>Name of your smart contract's account. Exactly 12 characters from (a-z1-5).</td>
    </tr>

    <tr>
    <td>newPublicKey</td>
    <td>EOS7jEb46pDiWvA39faCoFn3jUdn6LfL51irdXbvfpuSko86iNU5x</td>
    <td>This is the public key you created in Step 1.</td>
    </tr>

    <tr>
    <td>stake-net</td>
    <td>--stake-net '0.50000000 WAX'</td>
    <td>Amount of WAX to stake for NET.</td>
    </tr>

    <tr>
    <td>stake-cpu</td>
    <td>--stake-cpu '0.50000000 WAX'</td>
    <td>Amount of WAX to allocate for CPU.</td>
    </tr>

    <tr>
    <td>buy-ram-kbytes</td>
    <td>--buy-ram-kbytes 32</td>
    <td>Amount of RAM to allocate.</td>
    </tr>
    </tbody>
    </table>

    ### Example
    ```shell
    cleos -u https://chain.wax.io system newaccount waxdappacct1 HelloWorld10 EOS7jEb46pDiWvA39faCoFn3jUdn6LfL51irdXbvfpuSko86iNU5x --stake-net '0.50000000 WAX' --stake-cpu '0.50000000 WAX' --buy-ram-kbytes 32
    ```

    <strong>Note:</strong> You'll need to repeat Steps 1 and 2 for each of your contracts. 
    {: .label .label-yellow }

4. **Deploy.** From the command line, set your contract with the <span class="codeSample">cleos set contract</span> command: 

    | Parameter | Example | Description
    | --- | ----------- | -------------------------- |
    | -u | -u https://chain.wax.io | This is the WAX Blockchain URL. |
    | contractAccount| HelloWorld10 | Your smart contract's account (created in Step 2). |
    | fullPath | d/wax-blockchain/wax-cdt/mycontracts/wax/build | The full path to your WASM and ABI files. |
    | wasmName | wax | Name of your WASM file. |
    | abiName | wax | Name of your ABI file. |

    ```shell
    cleos -u https://chain.wax.io set contract HelloWorld10 d/wax-blockchain/wax-cdt/mycontracts/wax/build wax.wasm wax.abi
    ```

Your dApp is now live on WAX! 

<strong>Note:</strong> Depending on how your dApp's onboarding process is built, your customers may need to create a WAX Account to use your dApp on WAX.
{: .label .label-yellow }