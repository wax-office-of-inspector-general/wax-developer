---
title: Ricardian Contracts
order: 111
---

# Ricardian Contracts

A Ricardian contract is a machine and human-readable digital agreement between two parties (e.g., your app and your customer). Similar to a standard legal document, it includes your smart contracts actions, intentions, terms, and conditions. 

Ricardian contracts are defined per action. Every time your smart contract's action executes on the WAX Blockchain, this agreement is cryptographically signed and verified with a HASH (per action). 

To associate a Ricardian contract with each of your actions, you'll need to create a markdown file. 

* This file must have the same name as your smart contract. For example, if your smart contract is named **wax.cpp**, your Ricardian markdown file must be named: wax.contracts.md.
* Each **```<h1>```** tag must have the "contract" class: ```<h1 class="contract"></h1>```.
* To associate an action with your markdown file, the **```<h1>```** tag contents must match the action name: ```<h1 class="contract">hi</h1>```.

It's also important where you store your Ricardian markdown file (in relation to your smart contract C++ file). This depends on how you're compiling your contract.

## Use WAX-CDT

If you use **eosio-init** to create a smart contract template, a folder is automatically created for you under your project directory (e.g., wax/ricardian). By default, this folder contains a sample Ricardian contract: wax.contracts.md.

The CMake scripts will automatically include the files listed in the **ricardian** directory.

Refer to [Create a Smart Contract](/build/dapp-development/wax-cdt/cdt_use)for more information.

## Use eosio-cpp

If you use [eosio-cpp](/build/dapp-development/wax-cdt/)to compile your contract, your Ricardian markdown file must be in the same directory as wax.cpp and must be the same name: wax.contracts.md.

```shell
eosio-cpp -abigen wax.cpp -o wax.wasm
```

## Example Ricardian Contract

Below is a smart contract, with an action named: **hi**.

```cpp
ACTION wax::hi( name nm ) {
   /* fill in action body */
   print_f("Name : %\n",nm);
}
```

To associate a Ricardian contract with this action:

1. Create a file named **your-contract.contracts.md** (e.g., wax.contracts.md).
2. Paste the markdown below into your contracts file.

:::tip
For each of your actions, use the ```<h1>``` tag with the "contract" class, and set its inner contents to the action name.
:::

```html
<h1 class="contract"> hi </h1> 
```

Stub for hi action's ricardian contract
