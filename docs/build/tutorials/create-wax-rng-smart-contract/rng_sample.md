---
title: Build Your Contract to call WAX RNG contract
order: 84
---

# Build Your Contract to call WAX RNG contract

In this example, we'll create a smart contract that uses the WAX RNG service to generate a random number no larger than 100. This number gets written to a multi_index table, along with an internal Customer ID, the customer's signing_value, and the checksum256 random_value returned from the WAX RNG oracle.

To provide fairness, provability, and user confidence, it's recommended that you allow the customer to view or even edit the client-side signing_value. If you prefer to generate the signing_value on the back-end or your app doesn't require a front-end signing_value, you could use the user's transaction hash sent from their wallet. This value is a sha256 hash signed by the client that must be reduced to a 64-bit data.

By reducing the 256-bit hash to a 64-bit portion, we may find that it is not a unique code. The number we send as a seed for random number generation must be unique, i.e. it must not have been used before for another random number request. For this we can query the WAX RNG smart contract and check if our candidate seed is unique or has already been used.

To perform this check we will need to access the _signvals.a_ table of the WAX RNG smart contract. To facilitate this we will add the _wax-orng-interface.hpp_ file to our smart contract and link it in our header file:

## Create Your Contract

1. From the command line, navigate to your smart contracts directory. For this example, we'll use **mycontracts**.

2. Use **eosio-init** with the `-project` parameter to create your smart contract template.

   `$ eosio-init -project rngtest`

3. From your smart contracts folder, open **rngtest/include/rngtest.hpp** and paste the following:

```cpp
#include <eosio/eosio.hpp>

#include <eosio/crypto.hpp>
#include <eosio/transaction.hpp>

#include <wax-orng-interface.hpp>

#define ORNG_CONTRACT name("orng.wax")

using namespace eosio;
using namespace std;

CONTRACT rngtest : public contract {
   public:
      using contract::contract;

      // actions available
      ACTION getrnd( name& customer_id );
      ACTION receiverand(uint64_t signing_value, const checksum256& random_value);

      //table structure
      TABLE rngcustomers_table{
         uint64_t signing_value;
         name customer_id;
         checksum256 random_value;
		 uint8_t final_number;

         uint64_t primary_key() const { return signing_value; }
      };
      //define table based on table structure
      typedef multi_index<"rngcustomers"_n, rngcustomers_table> rngcustomers_index;

      // action wrappers
      using getrnd_action = action_wrapper<"getrnd"_n, &rngtest::getrnd>;
      using receiverand_action = action_wrapper<"receiverand"_n, &rngtest::receiverand>;

      // Set table 'rngcustomers'
      rngcustomers_index _customers = rngcustomers_index(get_self(), get_self().value);
};
```

We will work with cryptographic functions and checksum256 data, so we include the `crypto.hpp` library.

We will capture the *transaction_id* of the transaction calling the smart contract, so we include the `transaction.hpp` library.

As mentioned above, to access the table of values used by WAX RNG to generate the random numbers, we include the definition file `wax-orng-interface.hpp`. We include the source code of the file in `rngtest/include/wax-rng-interface.hpp`.

```cpp
#include <eosio/eosio.hpp>

using namespace eosio;

namespace orng {

    static constexpr name ORNG_CONTRACT = name("orng.wax");

    TABLE signvals_a {
        uint64_t signing_value;

        auto primary_key() const { return signing_value; }
    };
    typedef multi_index <name("signvals.a"), signvals_a> signvals_t;

    signvals_t signvals = signvals_t(ORNG_CONTRACT, ORNG_CONTRACT.value);
}
```

We declare `rngcustomers` as a multi-index data structure to temporarily store the data required to call to WAX RNG and to store the random number returned for later use in the task for which we have requested it.

We declare the actions that we are going to use in our example and that we will explain later.

4. We begin to edit the code of the smart contract in the file **src/rngtest.cpp**.

We begin with the inclusion of the header file

```cpp
#include <rngtest.hpp>
```
And we will add the following functions:

4.1 ACTION getrnd

This action captures the *transaction_id* of the transaction that has called the smart contract to generate a unique number that will serve as a seed for the call to WAX RNG.

In addition, it will store in the `rngcustomers` table the auxiliary data to be able to receive the random number from WAX RNG and to be able to recognize it among different requests.

**Parameters**

| Parameter   | Type | Sample      | Description                                       |
| ----------- | ---- | ------------ | ---------------------------------------------------- |
| customer_id | name | arpegiator21 | Name of the user making the request|

```cpp
ACTION rngtest::getrnd( name& customer_id ) {
   require_auth(customer_id);

   // Read transaction_id
   size_t size = transaction_size();
   char buf[size];
   uint32_t read = read_transaction(buf, size);
   check(size == read, "Signing value generation: read_transaction() has failed.");
   checksum256 tx_id = eosio::sha256(buf, read);

   // Get first 64 bits from transaction_id
   uint64_t signing_value;
   memcpy(&signing_value, tx_id.data(), sizeof(signing_value));

   // Check if signing_value is valid...
   auto iSigningValue = orng::signvals.begin();
   uint8_t c = 0;

   while( iSigningValue != orng::signvals.end() && c < 64){
      iSigningValue = orng::signvals.find(signing_value);

      // If signing_value exists, we rotate 1 bit to modify the hash. There are 64 possible variations...
      if(iSigningValue != orng::signvals.end()){
         signing_value <<= 1;
         c++;
      }
   }

   // Ok, I don't think this will happen but... what if it does?
   check(c < 64, "No combination was valid? Inconceivable!");

   // Prepare the table where the random value will be received.
   _customers.emplace(get_self(), [&](auto& rec) {
      rec.signing_value = signing_value;
      rec.customer_id = customer_id;
   });

   // Call to orng.wax smart contract
   action(
      { get_self(), "active"_n },
      "orng.wax"_n,
      "requestrand"_n,
      std::tuple{ signing_value, signing_value, get_self() })
      .send();
}
```

*transaction_id* is a unique number but since we have to select only a 64-bit portion it is possible that the resulting value is not unique. For that reason we perform the check against the `signvals.a` table and, if the result is a number already chosen, we perform a 1-bit rotation to try again.

When we are certain that we have found a unique number, we store the number, along with the user's name, and call WAX RNG by sending it the seed (*signing_value*) and the same value as the call identifier. We could use the user's own name as the identifier (*customer_id.value*) but this would complicate the code in case a user requests several random numbers and his requests are simultaneously stored in the table `rngcustomers` whose primary key is *signing_value*.

4.2. ACTION receiverand

Callback action that will be called from WAX RNG to return us, in case of success, the random number, together with the code that we provide as identifier of the request (*signing_value*).

**Parameters**

| Parameter   | Type | Description                                       |
| ----------- | ---- | ---------------------------------------------------- |
| signing_value | uint64_t    | Code sent as identifier.                                   |
| random_value  | checksum256 | Hash code generated by WAX RNG that we will use to obtain the random number |

```cpp
ACTION rngtest::receiverand(uint64_t signing_value, const checksum256& random_value) {
   require_auth(ORNG_CONTRACT);

   //cast the random_value to a smaller number
   //COMMENT: max_value isn't the max value. Adding +1 to num1 might fix this if you want a number from 1 to 100.
   uint64_t max_value = 100;
   auto byte_array = random_value.extract_as_byte_array();

   //COMMENT: This is a bad practice. SEE: modulo bias
   //  modulo bias shows 8-bit size for random_int is bad practice due to its size relative to max_value.
   //  The first (2**8 % max_value) numbers (0-55) will have a +50% increased chance of being chosen in this example.
   uint8_t random_int = 0; 
   random_int = byte_array[0];

   uint8_t num1 = random_chunk % divisor;

   auto iCustomers = _customers.require_find(signing_value, "Error: Petition not found!");

   // update table with random_value
   _customers.modify(iCustomers, get_self(), [&](auto& rec) {
      rec.random_value = random_value;
      rec.final_number = num1;
   });
}
```
We make sure that only WAX RNG will be able to call this action with *require_auth*.

We extract the first 16 bits of the returned random number and use it to get a number no larger than 100. Although it could be done with only 1 byte, it is preferable to increase the number of numerator bits before performing the reduction operation to avoid the modulo bias effect as much as possible.

**Note:** We still have many bits available in case we need to get more random numbers!
:::

**COMMENT:** Using only the first 8 bits is bad practice! We need more bits for fairness. SEE: Modulo bias.

We locate the record associated with the request identifier and update its contents to store the returned hash code.

We can now use the random value from the client to perform the function for which we requested it.

## Compiling the smart contract

1. From the console we go to the **rngtest/build** folder and execute the following commands:

````shell
cmake ..
make
```

We will find the files **rngtest.wasm** and **rngtest.abi** in the **rngtest/build/rngtest** folder.
