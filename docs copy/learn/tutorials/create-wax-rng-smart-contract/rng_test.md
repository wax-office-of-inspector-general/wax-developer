---
title: Test Your WAX RNG Contract
layout: default
nav_order: 86
parent: Create a WAX RNG Smart Contract
grand_parent: Tutorials
lang-ref: Test Your WAX RNG Contract
lang: en-US
---

To test the smart contract we will make a call to action *getrnd* with the following parameters:

| Parameter   | Type | Sample      | Description                                      |
| ----------- | ---- | ------------ | ---------------------------------------------------- |
| customer_id | name | arpegiator21 | Account name of the requesting user |

**Note:** To illustrate the case I use the account *arpegiator21* but you should use your own account whose key has already been imported to the wallet and with which you can sign transactions.

## Call to action

From the command line, use the `cleos push action` command to call the **getrnd** action.

```shell
cleos -u [chain-api-url] push action mywaxrngtest getrnd '["arpegiator21"]' -p arpegiator21@action
```

The console prints the following:

```shell
executed transaction: 06847ad5e939849a28f03685a6f959d59fac9ab265b7eeb4453157ab2b0c45a8  104 bytes  310 us
#  mywaxrngtest <= mywaxrngtest::getrnd         {"customer_id":"arpegiator21"}
#      orng.wax <= orng.wax::requestrand        {"assoc_id":"2949917703587584469","signing_value":"2949917703587584469","caller":"mywaxrngtest"}
warning: transaction executed locally, but may not be confirmed by the network yet         ]
```

In the response we can see how the *getrnd* action has made an *inline* call to the *requestrand* action of the smart contract *orng.wax* with the following parameters:

| Parameter   | Type |  Description                                      |
| ----------- | ---- |  ---------------------------------------------------- |
| assoc_id | uint64_t | 2949917703587584469 |64-bit code that the smart contract has generated from *transaction_id* and that we use to identify the request. |
| signing_value | uint64_t | 2949917703587584469 | Same as the previous one. This time it will serve as a seed to generate the random number. |
|caller | name | Name of the smart contract containing the callback function that will receive the response. |

Although we have taken many precautions to generate a unique seed (*signing_value*), if it still failed, we would get an error message like this:

```shell
Error 3050003: eosio_assert_message assertion failure
Error Details:
assertion failure with message: Signing value already used
pending console output:
```

## Verify The Random Number

The callback function saves your random number to the **rngcustomers** table. To display the table values, use the `cleos get table` command.

```shell
cleos -u [chain-api-url] get table mywaxrngtest mywaxrngtest rngcustomers
```

The console prints the following JSON results, including the **random_value** returned from the WAX RNG service and the **finalnumber** derived from the **random_value**:

```json
{
  "rows": [{
      "signing_value": "2949917703587584469",
      "customer_id": "arpegiator21",
      "random_value": "b3f4a264cdb0367db071c851b6bbb20b51a391cdb50b314d81f3705c0702c8d4",
      "final_number": 85
    }
  ],
  "more": false,
  "next_key": ""
}
```