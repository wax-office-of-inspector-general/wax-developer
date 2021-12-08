---
title: Docker Deploy
layout: default
nav_order: 72
parent: Deploy Your dApp on WAX
grand_parent: dApp Development
---

In this guide, you'll learn how to customize the **hello-world** build scripts to deploy your smart contracts to the WAX mainnet.

Before you begin:

* Make sure Docker is configured to run without sudo. 
* Download the <a href="https://github.com/worldwide-asset-exchange/wax-blockchain" target="_blank">WAX Blockchain Source Code</a>. Refer to the [WAX Blockchain Setup](/wax-docs/dev-docs/blockchain_setup) for more information.
* Have your WAX Blockchain Account public/private keys available.
* Make sure you have enough WAX staked in your account to allocate resources. 

<strong>Note:</strong> You do not need to build WAX source code to complete these steps. 
{: .label .label-yellow }

## Modify the Scripts

To modify the **hello-world** scripts to deploy your smart contract:

1. From the command line, navigate to the **hello-world** folder in the <a href="https://github.com/worldwide-asset-exchange/wax-blockchain" target="_blank">WAX Blockchain Source Code Repository</a>:

    ```shell
    cd wax-blockchain/samples/hello-world
    ```

3. Copy the contents of **hello-world** to your smart contract's directory. For this example, we'll use **wax_deploy**. 

4. From **wax_deploy**, open **CMakeLists.txt**. This file stores your project name and smart contract file name.

    a. Type your contract name on line 25.
    ```shell
    project(waxcontract)
    ```

    b. Type your contract's filename on line 29.

    ```shell
    add_contract(${PROJECT_NAME} ${PROJECT_NAME} waxcontract.cpp)
    ```

    Save the file. 

5. Next, open **Makefile**. This file contains the scripts to run <span class="codeSample">cleos</span> and the WAX Docker Development image. 

    a. Type your contract name on Line 23.
    ```shell
    CONTRACT_NAME = waxcontract
    ```

    b. Update the WAX allocations for your smart contract on Line 87, if required.
    ```shell
    --stake-net '0.50000000 WAX' --stake-cpu '0.50000000 WAX' --buy-ram-kbytes 32"
    ```

    c. To test your smart contract, you can update line 48 to run your action:

    ```shell
    push action ${CONTRACT_ACCOUNT} greet '[]' -p ${CONTRACT_ACCOUNT}@active"
    ```

    Save the file.


    <strong>Note:</strong> <span class="codeSample">NODEOS_URL</span> is the only optional parameter. Its default value is the mainnet deployment address https://chain.wax.io/.  
    {: .label .label-yellow }

Once these changes have been made, you're ready to use the <span class="codeSample">make</span> scripts to build and deploy your smart contract.

## Deploy Your Smart Contract

To launch your WAX smart contract on the WAX Blockchain:

1. **Build your smart contract.** In the command line, run the following script from the **wax_deploy** folder:

    ```shell
    make build
    ```

    This creates <span class="codeSample">wax.wasm</span> and <span class="codeSample">wax.abi</span> in the **wax_deploy** folder.

2. **Generate keys for your smart contract's account.** From the command line, run:

    ```shell
    make create-key
    ```

    This creates a pair of private/public keys for your smart contract's account (save the console response in a safe place, you'll need to use them later).

4. **Create a WAX Contract Account.** To create a blockchain account for your smart contract, run:

    <table>
    <thead>
    <tr>
    <th style="width:28%">Parameter</th>
    <th>Example</th>
    <th>Description</th>
    </tr>
    </thead>

    <tbody>
    <tr>
    <td>WAX_ACCOUNT</td>
    <td>waxprimary</td>
    <td>Your dApp Developer Account name.</td>
    </tr>

    <tr>
    <td>WAX_PRIVATE_KEY</td>
    <td>5JTZaN1zabi5wyC3LcdeZG3AzF7sLDX4JFqMDe68ThLC3Q5nYez</td>
    <td>Private key for your dApp Developer Account.</td>
    </tr>

    <tr>
    <td>CONTRACT_ACCOUNT</td>
    <td>waxsc1</td>
    <td>Specify a new name for your smart contract account. Account names must be less than 13 characters and only contain letters [a-z] and numbers [1-5].</td>
    </tr>

    <tr>
    <td>CONTRACT_PUBLIC_KEY</td>
    <td>EOS4yxqE5KYv5XaB2gj6sZTUDiGzKm42KfiRPDCeXWZUsAZZVXk1F</td>
    <td>New public key that you created in Step 2.</td>
    </tr>
    </tbody>
    </table>
 
    ```shell
    make create-account WAX_ACCOUNT=waxprimary WAX_PRIVATE_KEY=5JTZaN1zabi5wyC3LcdeZG3AzF7sLDX4JFqMDe68ThLC3Q5nYez CONTRACT_ACCOUNT=waxsc1 CONTRACT_PUBLIC_KEY=EOS4yxqE5KYv5XaB2gj6sZTUDiGzKm42KfiRPDCeXWZUsAZZVXk1F
    ```

5. **Deploy your contract.** From the command line, run: 

    <table>
    <thead>
    <tr>
    <th style="width:28%">Parameter</th>
    <th>Example</th>
    <th>Description</th>
    </tr>
    </thead>

    <tbody>
    <tr>
    <td>CONTRACT_ACCOUNT</td>
    <td>waxsc1</td>
    <td>The name you specified for your smart contract's account.</td>
    </tr>

    <tr>
    <td>CONTRACT_PRIVATE_KEY</td>
    <td>9X5KRXKVx25yjL3FvxxY9YxYxxYY9Yxx99yyXTRH8DjppKpD9tKtVz</td>
    <td>Private key for your smart contract's account (that you created in Step 2).</td>
    </tr>
    </tbody>
    </table>

    ```shell
    make deploy CONTRACT_ACCOUNT=waxsc1 CONTRACT_PRIVATE_KEY=9X5KRXKVx25yjL3FvxxY9YxYxxYY9Yxx99yyXTRH8DjppKpD9tKtVz
    ```

    This deploys your smart contract to the mainnet. You only need to pass your smart contract's account name and private key.

5. **Test your smart contract.** From the command line, run:

    ```shell
    make test CONTRACT_ACCOUNT=waxsc1
    ```

Your dApp is now live on WAX! 

<strong>Note:</strong> Depending on how your dApp's onboarding process is built, your customers may need to create a WAX Account to use your dApp on WAX.
{: .label .label-yellow }

