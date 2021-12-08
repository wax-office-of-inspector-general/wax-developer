---
title: Ricardian Contracts
layout: default
nav_order: 111
parent: Tools & Topics
---

A Ricardian contract is a machine and human-readable digital agreement between two parties (e.g., your app and your customer). Similar to a standard legal document, it includes your smart contracts actions, intentions, terms, and conditions. 

Ricardian contracts are defined per action. Every time your smart contract's action executes on the WAX Blockchain, this agreement is cryptographically signed and verified with a HASH (per action). 

To associate a Ricardian contract with each of your actions, you'll need to create a markdown file. 

* This file must have the same name as your smart contract. For example, if your smart contract is named **wax.cpp**, your Ricardian markdown file must be named: wax.contracts.md.
* Each **&lt;h1&gt;** tag must have the "contract" class: &lt;h1 class=&quot;contract&quot;&gt;&lt;/h1&gt;.
* To associate an action with your markdown file, the **&lt;h1&gt;** tag contents must match the action name: &lt;h1 class=&quot;contract&quot;&gt;hi&lt;/h1&gt;.

It's also important where you store your Ricardian markdown file (in relation to your smart contract C++ file). This depends on how you're compiling your contract.

## Use WAX-CDT

If you use **eosio-init** to create a smart contract template, a folder is automatically created for you under your project directory (e.g., wax/ricardian). By default, this folder contains a sample Ricardian contract: wax.contracts.md.

The CMake scripts will automatically include the files listed in the **ricardian** directory.

Refer to [Create a Smart Contract](/wax-docs/dev-docs/dapp_hello_world) for more information.

## Use eosio-cpp

If you use [eosio-cpp](/wax-docs/dev-docs/cdt_cpp) to compile your contract, your Ricardian markdown file must be in the same directory as wax.cpp and must be the same name: wax.contracts.md.

```shell
eosio-cpp -abigen wax.cpp -o wax.wasm
```

## Example Ricardian Contract

Below is a smart contract, with an action named: **hi**.

```
ACTION wax::hi( name nm ) {
   /* fill in action body */
   print_f("Name : %\n",nm);
}
```

To associate a Ricardian contract with this action:

1. Create a file named **your-contract.contracts.md** (e.g., wax.contracts.md).
2. Paste the markdown below into your contracts file.

<span>Tip: </span>For each of your actions, use the &lt;h1&gt; tag with the "contract" class, and set its inner contents to the action name.

<hr style="height:1px; border:none; color:#000; background-color:#000; width:100%; text-align:left; margin: 0 auto 0 0;">

&lt;h1 class=&quot;contract&quot;&gt; hi &lt;/h1&gt; 

Stub for hi action's ricardian contract