---
title: Deploy Your dApp on WAX
layout: default
nav_order: 70
parent: dApp Development
has_children: true
---

To deploy your dApp on WAX, you'll need to use [WAX-CDT](/docs/cdt) and [Blockchain Tools](/docs/blockchain_tools) to:

* Compile your smart contracts
* Create WAX Blockchain Accounts for each of your contracts
* Deploy your smart contracts to the WAX Blockchain

WAX provides two ways to accomplish these deployment steps. You can use our custom **make** scripts (recommended for EOS developers) or use WAX-CDT tools from your local Docker container or installation. Below is a list of benefits and requirements for each option.

## Custom Deploy Scripts

The <a href="https://github.com/worldwide-asset-exchange/wax-blockchain" target="_blank">WAX Source Code Repository</a> includes a **hello-world** sample contract, along with **make** scripts that provide an easy, automated way to build and deploy your smart contracts. These scripts use the <a href="https://hub.docker.com/r/waxteam/dev" target="_blank">WAX Docker Development image</a> to:

* Create a WASM and ABI file
* Create a WAX Blockchain Account for your smart contract
* Deploy your smart contract to WAX
* Test your smart contract on the WAX Blockchain

### Advantages

* Allows you to deploy a smart contract from a Docker container, without installing any WAX source code (you'll still need to download the **hello-world** source code and scripts from the <a href="https://github.com/worldwide-asset-exchange/wax-blockchain" target="_blank">WAX Source Code Repository</a>).
* You can run the customizable **make** scripts from your smart contract's directory, without passing paths to your WASM and ABI files.

### What You'll Need:

* Docker must be installed and configured to run without sudo. Linux users, refer to <a href="https://docs.docker.com/install/linux/linux-postinstall/" target="_blank">Post-installation steps for Linux</a> for more information.

   <strong>Windows Subsystem for Linux Users:</strong> Docker configuration and installation requirements will vary depending on your WSL version. Recommended only for advanced Docker/Windows users. If you're running WSL 2, refer to <a href="https://docs.docker.com/docker-for-windows/wsl-tech-preview/" target="_blank">Docker Desktop WSL 2 Tech Preview</a> for more information.
    {: .label .label-yellow }

* make (VERSION 3.9 +)
* A self-managed WAX Blockchain Account and its private key (to deploy the contract).


## Docker Depoy (WAX-CDT)

If you prefer, you can deploy your smart contracts from the command line using WAX-CDT tools. 

### Advantages

* Allows more control over the build process and deployment parameters. Refer to [WAX-CDT Options](/docs/cdt_options) for more information.
* If you used **eosio-init** to [Create a Smart Contract](/docs/dapp_hello_world) and deploy to your local blockchain, this might be a good option for you.
* Compatible for Windows users. 

### What You'll Need

To use this option, you'll need to:

* Complete our [Docker Quickstart](/docs/docker_qstart) (recommended) or use the [WAX Blockchain Setup](/docs/blockchain_setup) to build from source.
* Use the [WAX Contract Development Toolkit (WAX-CDT)](/docs/cdt) to compile your smart contracts.

## Before You Begin

No matter which deployment option you choose, you'll need to:

* Create a self-managed WAX Blockchain Account. 
* Make sure you have enough WAX staked in your account to allocate resources. 

