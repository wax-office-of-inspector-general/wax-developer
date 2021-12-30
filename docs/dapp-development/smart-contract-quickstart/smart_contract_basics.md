---
title: Smart Contract Basics
layout: default
nav_order: 61
parent: Smart Contract Quickstart
grand_parent: dApp Development
---

A WAX smart contract includes a collection of actions, type definitions, and persistent storage, allowing your dApp to sign transactions on the WAX Blockchain. When you call a smart contract from a front-end app:

- An ACTION is initialized
- A message is pushed to the WAX mainnet 
- The action completes, then continues to the next action (if required)

## How it Works

Smart contracts typically include header files, class inheritance, actions, permissions, persistent data, action dispatchers, and type definitions. 

### Header Files

C++ header files contain global declarations. Because WAX uses a fork of EOSIO, all of your WAX smart contracts will inherit from EOSIO contracts and classes. The <a href="https://github.com/worldwide-asset-exchange/wax-cdt/blob/master/libraries/eosiolib/eosio.hpp" target="_blank">eosio.hpp</a> header file must be included in every contract, and every contract must extend the <a href="https://github.com/worldwide-asset-exchange/wax-cdt/blob/master/libraries/eosiolib/contract.hpp" target="_blank">eosio::contract</a> class. 

```
  #include <eosio/eosio.hpp>
```

This gives your smart contract access to WAX's C/C++ API, allowing you to define actions and structures that enable your smart contract to communicate with the WAX Blockchain. Refer to [WAX-CDT API](/wax-developer/docs/cdt_api) for more information.

### Actions

Actions define the core functionality of your smart contract. When an action runs, events are written to the WAX Blockchain. 

Actions include the following properties:

- **Permission Level:** You can secure each action with various permissions.
- **Code:** This is your smart contract's blockchain account.
- **Action:** Name of the action.
- **Data:** Actions support various data types and structures.

#### Transactions

A transaction is a list of one or more actions executed in the same block.

Actions run in an isolated block of code, typically called from your front-end client. If one of your actions needs to call another action, you can create a smart contract **Transaction**. 
    
<!--```
//use eosio::transaction to call other actions from an existing action
eosio::transaction t{};
```-->

Transactions communicate using two models: inline and deferred.

- **Inline:** An inline transaction is a synchronous-like communication model that executes in the same transaction scope. These actions are guaranteed to run in-order and at the same time the original action is called. If the transaction fails, you can revert changes in the previous actions.  

    For an example of an inline transaction, refer to EOSIO's <a href="https://developers.eos.io/eosio-home/dev-docs/inline-actions" target="_blank">Adding Inline Actions</a>.

- **Deferred:** A deferred action is an action that's scheduled to run in the future, similar to an asynchronous call. These transactions are not guaranteed to run (there is a potential of it being dropped by the node). The original (calling) action is applied to the WAX Blockchain when the action runs, and can not be reverted if the deferred transaction fails. 
    
    For an example of a deferred transaction, refer to EOSIO's <a href="https://developers.eos.io/eosio-home/dev-docs/27-deferred-transactions" target="_blank">Deferred Transactions</a>.

### Permissions

A smart contract and a WAX Blockchain Account communicate using the actions defined in your smart contract. You can secure your actions using WAX Account permissions. By including the `require_auth()` method in your actions, you can verify that an action call was initiated by your smart contract's blockchain account. You can also use the `require_auth()` method to secure WAX customer-specific actions, such as updating a user record. Requiring authentication on user-specific actions can ensure that only your customer can perform this action - not someone else.

Permissions can also enable your smart contracts to handle notifications and make action calls to other smart contracts (using the `eosio.code` permission).

 Refer to EOSIO's <a href="https://developers.eos.io/eosio-nodeos/dev-docs/accounts-and-permissions" target="_blank">Accounts and Permissions</a> for more information.

### Persist Data

Every time you call one of your smart contract's actions from your app, a new instance of your smart contract is created. This new instance knows nothing about any previous contract states. When the action completes, this instance is destroyed. 

To persist data between the actions of one or more of your smart contracts, you'll need to use the **multi_index** table functionality. 
    
<strong>Note:</strong> Persistent data is stored on the WAX node's RAM and impacts the amount of WAX that you'll need to stake for your smart contract.
{: .label .label-yellow }


 Refer to EOSIO's <a href="https://developers.eos.io/eosio-home/dev-docs/data-persistence" target="_blank">Data Persistence</a> for more information.

### WAX Dispatchers

A dispatcher macro is the action handler, listening for incoming requests. You can use this macro to register all of your smart contract's actions.

### Basic Structure

Here's a sample smart contract template with common elements.

```
#include <eosio/eosio.hpp>

using namespace eosio;

CONTRACT mycontract : public eosio::contract {
public:
	using contract::contract;

	ACTION action1(name user) {
		require_auth(user);
	}

private:
	TABLE customer {
		name key;
		std::string first_name;
		std::string last_name;

		uint64_t primary_key() const { return key.value; }
	};

	typedef eosio::multi_index<"customers"_n, customer> customer_index;

};
EOSIO_DISPATCH(mycontract, (action1))

```