---
title: WAX Blockchain Setup
nav_order: 30
layout: default
parent: dApp Development
has_children: true
lang-ref: WAX Blockchain Setup
lang: en-US
---

To set up and use the WAX Blockchain, it's recommended that you use our  <a href="https://hub.docker.com/u/waxteam" target="_blank">waxteam - Docker Images</a>.  Our docker images provide a fast, fully supported way to run a node in seconds. Refer to [Docker Quickstart](/en/dapp-development/docker-setup/) for more information.

Our production and development Docker images include everything that's available from the <a href="https://github.com/worldwide-asset-exchange/wax-blockchain" target="_blank">WAX Blockchain Source Code Repository</a>, allowing you to run WAX nodes and build and deploy smart contracts.

If you'd like to access our sample contracts and scripts from your local drive or have a need to install the WAX Blockchain instead of using Docker, you can use this guide to download and optionally build the WAX Blockchain source code.

<strong>Important:</strong> At this time, pre-compiled packages are not available. Support is <strong>not</strong> available when you build the WAX blockchain from source.
{: .label .label-yellow }

## What's Included

The WAX Blockchain is a fork of <a href="https://docs.eosnetwork.com/" target="_blank">EOS (Antelope)</a>. This <a href="https://github.com/worldwide-asset-exchange/wax-blockchain" target="_blank">WAX Blockchain Source Code Repository</a> includes and installs:

- WAX Blockchain source code
- Dependencies
- [Blockchain Tools](/en/tools/blockchain_tools), including keosd, nodeos, and cleos
- Sample contracts

You can use these components to manage local wallets, create local accounts, interact with the WAX Blockchain, and more. 

<strong>EOS Developers:</strong> Building the WAX Source Code Repository will overwrite a previous EOS installation. 
{: .label .label-yellow }

### Docker Quick Deploy

The WAX Source Code Repository includes a Hello World sample to quickly build and deploy WAX smart contracts to the WAX Blockchain. Refer to [Docker Quick Deploy](/en/dapp-development/deploy-dapp-on-wax/deploy_docker) for more information.
    
### Dependencies
    
<p>For a complete list of dependencies, refer to <a href="https://github.com/worldwide-asset-exchange/wax-blockchain/tree/develop/scripts" target="_blank">wax-blockchain/scripts</a> and locate the `wax_build_` file for your operating system.</p>

## System Requirements

If you're not using our Docker images, you'll need to:

* Refer to [Supported Operating Systems](/en/tools/os) to make sure you meet the operating system requirements. 

    <strong>Ubuntu 18.04 Users:</strong> Refer to [Known Issues](/en/troubleshooting/) before you begin the WAX Blockchain Setup.
    {: .label .label-yellow }

* Have at least 7 GB of free RAM.

* Have at least 20 GB of free hard drive space.




