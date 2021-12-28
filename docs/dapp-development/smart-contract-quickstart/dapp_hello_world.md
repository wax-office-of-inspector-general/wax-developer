---
title: Create a Smart Contract
layout: default
nav_order: 62
parent: Smart Contract Quickstart
grand_parent: dApp Development
---
# Create a Smart Contract

In this section, you'll learn how to write and compile a WAX smart contract using **eosio-init**.

## How it Works

**eosio-init** is a WAX-CDT tool that creates the following smart contract template/directory structure:

- **include** folder: This includes a sample **.hpp** file.
- **ricardian** folder: This includes a sample Ricardian contract markdown file.
- **src** folder: This includes a sample **.cpp** smart contract file.

The template files are named after the project name you specify when you use **eosio-init** from the command line. 

## Use eosio-init

To create your first WAX smart contract using **eosio-init**:

1. Create a smart contracts directory. For this tutorial, we'll use a folder named **mycontracts**.

    ```shell
    mkdir mycontracts
    ```shell
    Navigate to this new directory:
    ```shell
    cd mycontracts
    ```

2. From the command line, use **eosio-init** with the <span class="codeSample">-project</span> parameter. 

    ```
    eosio-init -project wax
    ```

    **eosio-init** uses the <span class="codeSample">-project</span> name to create the following directory structure:

    - mycontracts/wax/include 
    - mycontracts/wax/ricardian 
    - mycontracts/wax/src 

3. Optional. Add a [Ricardian Clause](/wax-developer/docs/ricardian_clause). A  [Ricardian Contract](/wax-developer/docs/ricardian_contract) is already included by default.

You should now have a smart contract template, including a sample smart contract (mycontracts/wax/src/wax.cpp). This contract includes the following action:

```
#include <wax.hpp>
ACTION wax::hi( name nm ) {
   /* fill in action body */
   print_f("Name : %\n",nm);
}
```

The header file (mycontracts/wax/include/wax.hpp) inherits from **<eosio/eosio.hpp>**.

```
// Inherit your contract from eosio::contract. 
// This exposes the following data types (available to your smart contract):
// eosio::name receiver - the contract that receives an action (this contract)
// eosio::name code - the contract's blockchain account
// eosio::datastream - the data that's passed to the contract. In this example, it's  your name.
#include <eosio/eosio.hpp>
using namespace eosio;

CONTRACT wax : public contract {
   public:
      using contract::contract;

      // The ACTION keyword implements the behavior of your contract. 
      // ACTION is a shortcut for [[eosio::action]]  
      ACTION hi( name nm );

      //action_wrapper: first parameter = action to call
      //second parameter = pointer to the action function
      using hi_action = action_wrapper<"hi"_n, &wax::hi>;
};
```

<strong>Tip:</strong> The action_wrapper struct creates a template/pointer based off of a specific action. You can use action_wrappers to make action calls from one contract to another. 
{: .label .label-yellow }

<!--
<span>Tip: </span>Make sure that your class name and file names match.

```
// Required. eosio.hpp includes the classes required to write a smart contract and sign transactions on the WAX blockchain. 
#include <eosiolib/eosio.hpp>

// Inherit your contract from eosio::contract. 
// eosio::name receiver is the contract that receives an action (this contract)
// eosio::name code is the contract's blockchain account
// eosio::datastream is the data that's passed to the contract. In this example, there is no data. 
CONTRACT wax: public eosio::contract {
public:
    wax(eosio::name receiver, eosio::name code, eosio::datastream<const char*> ds)
        : contract(receiver, code, ds) {
    }

    // The ACTION keyword implements the behavior of your contract. 
    // ACTION is a shortcut for [[eosio::action]]
    ACTION greet() {
        // eosio::print returns a string to the console. 
        eosio::print("Hello World!\n");
    }
};

// A dispatcher function that listens to all incoming actions and performs the designated functions in your smart contract.
// If this contract included a 'goodbye' action, you could change this function to:
// EOSIO_DISPATCH(wax, (greet)(goodbye))
EOSIO_DISPATCH(wax, (greet))
```-->


## Compile Your Contract

To deploy your smart contract, you'll need to create a <span class="codeSample">.wasm</span> and <span class="codeSample">.abi</span> file. You can do this using the WAX Contract Development Toolkit (WAX-CDT).

1. Install [WAX-CDT](/wax-developer/docs/cdt) (if you haven't done so already).

2. From the command line, navigate to the **mycontracts/wax** build folder.

    ```shell
    cd wax/build
    ```

3. Initialize cmake to write the necessary build files to the **build** directory.

    ```shell
    cmake ..
    ```

    The console prints the following build tasks:

    ```shell
    -- The C compiler identification is GNU 7.4.0
    -- The CXX compiler identification is GNU 7.4.0
    -- Check for working C compiler: /usr/bin/cc
    -- Check for working C compiler: /usr/bin/cc -- works
    -- Detecting C compiler ABI info
    -- Detecting C compiler ABI info - done
    ...
    -- Build files have been written to: waxblockchain/wax-blockchain/wax-cdt/examples/hello/build
    ```

4. Build the scripts.

    ```shell
    make
    ```

    The console prints the following confirmation:

    ```shell
    Scanning dependencies of target wax
    [ 50%] Building CXX object CMakeFiles/wax.dir/wax.obj
    Warning, empty ricardian clause file
    [100%] Linking CXX executable wax.wasm
    [100%] Built target wax
    [ 77%] No install step for 'wax_project'
    [ 88%] No test step for 'wax_project'
    [100%] Completed 'wax_project'
    [100%] Built target wax_project
    ```

You can locate the **wax.wasm** and **wax.abi** files in the **build/wax** directory. 

