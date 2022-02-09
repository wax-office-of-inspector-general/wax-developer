---
title: Build & Compile Your WAX RNG Contract
layout: default
nav_order: 84
parent: Create a WAX RNG Smart Contract
grand_parent: Tutorials
lang-ref: Build & Compile Your WAX RNG Contract
lang: en
---

In this example, we'll create a smart contract that uses the WAX RNG service to generate a random number no larger than 100. This number gets written to a multi_index table, along with an internal Customer ID, the customer's signing_value, and the checksum256 random_value returned from the WAX RNG oracle.

## Create Your Contract

1. From the command line, navigate to your smart contracts directory. For this example, we'll use **mycontracts**.

2. Use **eosio-init** with the `-project` parameter to create your smart contract template. 

    ```shelleosio-init -project waxrng```
    
3. From your smart contracts folder, open **waxrng/include/waxrng.hpp** and paste the following:

    ```
    #include <eosio/eosio.hpp>
    #include <string>
    #include <tuple>

    CONTRACT waxrng : public eosio::contract {
       public:
          using eosio::contract::contract;
	      //this example uses a multi_index table to store user information.
	      //in the line below, make sure to define a default constructor for this table 
	      waxrng(eosio::name receiver, eosio::name code, eosio::datastream<const char*> ds)
		      : contract(receiver, code, ds), rngcustomers(receiver, receiver.value) {}

	      //actions available for our RNG smart contract
	      ACTION getrandom(eosio::name nm, uint64_t customer_id, uint64_t signing_value);
	      ACTION receiverand(uint64_t customer_id, const eosio::checksum256& random_value);

	      //table structure
	      TABLE rngcustomers_table{
		    eosio::name nm;
		    uint64_t customer_id;
		    eosio::checksum256 random_value;
		    uint64_t finalnumber;
		    uint64_t primary_key() const { return customer_id; }
	      };

	      //define table based on table structure
	      typedef eosio::multi_index<"rngcustomers"_n, rngcustomers_table> rngcustomers_index;

	      //action wrappers
          using getrandom_action = eosio::action_wrapper<"getrandom"_n, &waxrng::getrandom>;
	      using receiverand_action = eosio::action_wrapper<"receiverand"_n, & waxrng::receiverand>;

	      //set our table to 'rngcustomers' variable
	      rngcustomers_index rngcustomers;
    };
    ```                

4. Next, open **src/waxrng.cpp** and paste the following:

    ```
    #include <waxrng.hpp>

    using namespace eosio;

    //call the WAX RNG requestrand action
    ACTION waxrng::getrandom(name nm, uint64_t customer_id, uint64_t signing_value) {

	    //check if this customer_id exists in the table
	    auto itrCustomer = rngcustomers.find(customer_id);
	    //if not, insert a new record
	    if (itrCustomer == rngcustomers.end()) {
		    rngcustomers.emplace(_self, [&](auto& rec) {
			    rec.customer_id = customer_id;
			    rec.nm = nm;
		    });
	    }
	
	    //call orng.wax
	    action(
		    { get_self(), "active"_n },
		    "orng.wax"_n,
		    "requestrand"_n,
		    std::tuple{ customer_id, signing_value, get_self() })
		    .send();
    }

    // Called automatically by 'orng.wax' smart contract when the RNG Oracle
    // has generated the random value. wax.orng, before calling this action,
    // verifies that the generated random value was signed with the
    // provided "signing_value"
    ACTION waxrng::receiverand(uint64_t customer_id, const checksum256& random_value) {

	    //cast the random_value to a smaller number
	    uint64_t max_value = 100;
	    auto byte_array = random_value.extract_as_byte_array();

	    uint64_t random_int = 0;
	    for (int i = 0; i < 8; i++) {
		    random_int <<= 8;
		    random_int |= (uint64_t)byte_array[i];
	    }

	    uint64_t num1 = random_int % max_value;

	    //find the customer record by customer_id
	    auto itrCustomer = rngcustomers.find(customer_id);
	    //make sure the record exists
	    check(itrCustomer != rngcustomers.end(), "customer table not set");
	    //update the random numbers by customer_id
	    rngcustomers.modify(itrCustomer, _self, [&](auto& rec) {
		    rec.random_value = random_value;
		    rec.finalnumber = num1;
	    });

    }

    EOSIO_DISPATCH(waxrng,
    (getrandom)
    (receiverand)
    )
    ```

## Compile Your Contract

1. From the command line, navigate to **waxrng/build** and run **cmake**.

    ```shell
    cmake ..
    ```

2. Build the scripts.

    ```shell
    make
    ```

You can locate the **wax.wasm** and **wax.abi** files in the **build/waxrng** folder.
        
