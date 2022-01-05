---
title: WAX-CDT API
layout: default
nav_order: 25
parent: WAX API Reference
---

All of your smart contracts inherit from the C++ API files available in the [WAX Contract Development Toolkit (WAX-CDT)](/docs/cdt) library. These files are used to define your smart contract's actions, structures, and data types. 

This smart contract API can be grouped into three key modules:

* **contracts:** This is the primary C++ contracts API used for communicating with the WAX Blockchain. This library defines actions, dispatchers, permissions, and more. 
* **core:** This library handles datastreams, the **name** datatype, serialization objects, and more. 
* **types:** This library defines the base contract, data layouts, data structures, and more. 

All of these libraries are located in the **wax-cdt/libraries/eosiolib** folder. Most of this functionality is available once you include **<eosio/eosio.hpp>** in your smart contract. It's recommended that you review these files to help you understand how a smart contract is constructed.

## WAX API Overloads and Customizations 

### Method Name: verify_rsa_sha256_sig

**Source Code:** <a href="https://github.com/worldwide-asset-exchange/wax-cdt/blob/master/libraries/eosiolib/core/eosio/crypto.hpp#L283" target="_blank">WAX GitHub Repository</a>

**Description:** Verify a signature using the RSA 256 algorithm. Implemented in native code, this method is about 15x's faster than standard WASM verification. Refer to <a href="https://www.emc.com/collateral/white-papers/h11300-pkcs-1v2-2-rsa-cryptography-standard-wp.pdf" target="_blank">RSA Cryptography Standard</a> for more information.

**Input Parameters:**

| Parameter | Description
| --- | -------------------------- |
| message | Message buffer to verify. |
| message_len | Message buffer length. |
| signature | Signature as hex string. |
| exponent | Public key exponent as hex string. |
| modulus  | Modulus as hex string (a leading zero is not allowed). |

**Example Usage:** This method is used to in our WAX RNG service to verify that the RSA signature (random value) returned from the WAX RNG oracle is valid.

```
 eosio_assert(verify_rsa_sha256_sig(&signing_value, sizeof(signing_value), 
    random_value, pub_key->exponent, pub_key->modulus),
    "Could not verify signature.");
```


**Return Value:** Boolean. True if the verification succeeds, False if not.

## Data Types

Your smart contracts can use the following data types:

* bool
* string
* int8
* int16
* int32
* int64
* int128
* uint8
* uint16
* uint32
* uint64
* uint128
* varint32
* varuint32
* float32
* float64
* float128
* time_point
* time_point_sec
* block_timestamp_type
* bytes
* checksum160
* checksum256
* checksum512
* name
* public_key
* private_key
* signature
* symbol
* symbol_code
* asset

Refer to EOSIO's <a href="https://eosio.github.io/eosio.cdt/1.6.0/group__types.html" target="_blank">Types</a> for more information.

## Type Definitions

WAX-CDT also includes a custom library of type definitions:

* typedef uint64_t account_name;
* typedef uint64_t action_name;
* typedef uint64_t permission_name;
* typedef uint64_t scope_name;
* typedef uint64_t table_name;
* typedef uint32_t time;
* typedef uint16_t weight_type;
* typedef struct checksum256 transaction_id_type;
* typedef struct checksum256 block_id_type;

## Additional Information

For a complete list of features available from the smart contract C++ API, refer to EOSIO's <a href="https://eosio.github.io/eosio.cdt" target="_blank">C/C++ API</a>.