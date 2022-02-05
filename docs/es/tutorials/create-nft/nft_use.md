---
title: Create a WAX NFT
layout: default
nav_order: 89
parent: Create Non-Fungible Tokens
grand_parent: Tutorials
---

In this example, we'll write a smart contract that creates a WAX NFT Sticker using the **simpleassets** smart contract. 

**WAX NFT Sticker (Example)**

<img src="https://developer.wax.io/img/wax_sticker.png" style="height:200px" />

## Get Set Up

1. Use our [Docker Quickstart](/docs/es/dapp-development/docker-setup/) to start a new interactive bash session. From the command line, navigate to the **wax** directory (or the local directory that you shared with your Docker container).

    ```shell
    cd wax
    ```

2. If you haven't done so already, create a smart contracts directory. For this tutorial, we'll use a folder named **mycontracts**.

    ```shell
    mkdir mycontracts
    ```

    Navigate to this new directory:

    ```shell
    cd mycontracts
    ```

3. From the command line, create a folder named **waxnft** and navigate to this new directory.

    ```shell
    mkdir waxnft && cd waxnft
    ```

## Create and Compile Your NFT Smart Contract

1. In the **waxnft** folder, create a file named **waxnft.cpp** and paste the following code into your NFT smart contract:

    ```
    #include <eosio/eosio.hpp>

    using namespace eosio;

    CONTRACT waxnft : public eosio::contract{
    public:
	    using contract::contract;

	    ACTION createnft() {

            //assign asset attributes
		    name author = get_self();
		    name category = "sticker"_n;
		    name owner = "waxnftowner1"_n;
		    std::string idata = R"json({"name": "WAX Developer Hive", "desc" : "WAX Developer Hive Sticker" })json";
		    std::string mdata = R"json({"color": "black", "img" : "https://developer.wax.io/img/wax_sticker.png" })json";
		    bool requireClaim = false;

            //call the simpleassets create action
		    action(
			    { author, "active"_n },
			    "simpleassets"_n,
			    "create"_n,
			    std::tuple(author, category, owner, idata, mdata, requireClaim)
		    )
		    .send();

	    }
    };

    EOSIO_DISPATCH(waxnft, (createnft))
    ```    
        
    Save your changes. This contract creates a WAX NFT Sticker with the same author and owner account. Because the `requireClaim` flag is set to false, your smart contract account is charged the RAM and the asset is instantly assigned to the owner (you).

     * **idata** includes key/value pairs that can not change.
    * **mdata** includes key/value pairs that you can update.

2. From the command line, use WAX-CDT to build your NFT smart contract:

    ```shell
    eosio-cpp -abigen waxnft.cpp -o waxnft.wasm
    ```

Your NFT smart contract is now ready to be deployed to the WAX mainnet. 







