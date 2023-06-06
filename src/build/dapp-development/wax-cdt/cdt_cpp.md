---
title: WAX-CDT Build Tools
order: 53
lang: en
---

WAX-CDT includes various **eosio** commands, built around the <a href="https://clang.llvm.org/" target="_blank">Clang</a> front-end and tooling infrastructure. This collection includes various tools to build optimized, high-performance WASM files. Refer to [WAX-CDT Options](/docs/tools/cdt_options) for more information.

It's recommended that you use **eosio-init** to [Create a Smart Contract](/docs/dapp-development/wax-cdt/cdt_use.html#compile-hello-world). This tool provides scripts to easily organize and build your project. 

If these scripts do not meet your needs, you can also use the **eosi-cpp** command to compile your smart contracts.

## Use eosio-cpp

To generate a WASM and ABI file for your smart contract:

1. From the command line, navigate to your smart contracts folder.

2. Run the **eosio-cpp** build command with the **-abigen** parameter.

:::tip
<strong>Tip:</strong> <strong>eosio-cpp</strong> also includes Ricardian terms in your ABI file. Refer to [Ricardian Contracts](/docs/tools/ricardian_contract) and [Ricardian Clauses](/docs/tools/ricardian_clause) for more information.
:::

```
eosio-cpp -abigen wax.cpp -o wax.wasm
```

This will generate two files in your contract's directory:

* The compiled binary WASM (wax.wasm)
* The generated ABI file (wax.abi)

<!--## Use eosio-abigen to Generate an ABI

If you only want to generate an ABI file, you can easily do so with the **eosio-abigen** command. 

To use **eosio-abigen**, include the following parameters:

- Your contract's C++ file name
- --contract (Your contract's name)
- --output (Desired ABI file name)

### Example

```
eosio-abigen hello.cpp --contract=hello --output=hello.abi
```-->




