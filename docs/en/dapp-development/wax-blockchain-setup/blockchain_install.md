---
title: Install the WAX Blockchain
nav_order: 31
layout: default
parent: WAX Blockchain Setup
grand_parent: dApp Development
lang-ref: Install the WAX Blockchain
lang: en
---

The GitHub WAX Blockchain Source Code Repository downloads to the **wax-blockchain** directory. The download and build process can take several minutes to several hours, depending on your Internet connection, operating system, and hardware specifications.

To download the WAX Blockchain Source Code Repository:

1. From the command line, clone the Git repository.

    ```shell
    git clone https://github.com/worldwide-asset-exchange/wax-blockchain.git
    ```

2. Change the directory to **wax-blockchain**.

    ```shell
    cd wax-blockchain
    ```

3. Update Git submodules.

    ```shell
    git submodule update --init --recursive
    ```

## Build the WAX Blockchain

If you're using our Docker images, you do **not** need to complete these steps.

To build the WAX Blockchain from source, you can use the following steps. If you have a previous version installed, you'll need to uninstall it first. Refer to [Uninstall WAX](/en/tutorials/blockchain_uninstall) for more information.

<strong>Important:</strong> Refer to [Known Issues](/en/troubleshooting/) if you encounter an issue with the build or use our [Docker Images](/en/dapp-development/docker-setup/) instead (recommended). Building from source is not supported. 
{: .label .label-yellow }

1. Run the build script and set the installation directory. 

    ```shell
    ./wax_build.sh -i ~/wax-blockchain
    ```

    <strong>Tip:</strong> This installs [Blockchain Tools](/en/tools/blockchain_tools) to the <strong>wax-blockchain/bin</strong> directory.
    {: .label .label-yellow }

2. Install WAX to the directory you set in Step 4.

    ```shell
    ./wax_install.sh
    ```

3. Optional. Add the blockchain tools directory to your path.

    ```shell
    echo "export PATH=~/wax-blockchain/bin:$PATH" >> ~/.bashrc && source ~/.bashrc
    ```







