---
title: Test Your WAX RNG Contract
layout: default
nav_order: 86
parent: Create a WAX RNG Smart Contract
grand_parent: Tutorials
lang-ref: Test Your WAX RNG Contract
lang: en
---

To test your RNG smart contract, you'll need to use two random, unique numbers. One for your internal customer id and one for the **signing_value** provided by the user on the client-side.

In this example, we'll use the following parameters:

<table>
<thead> 
<tr>
<th style="width:15%">Parameter</th>
<th style="width:30%">Example</th>
<th>Description</th>
</tr>
</thead>

<tbody>
<tr>
<td>customer_id</td>
<td>1267</td>
<td>Required `uint64_t`. Your internal database id for the customer.</td>
</tr>

<tr>
<td>signing_value</td>
<td>445896213</td>
<td>Required `uint64_t`. A pseudo-random number generated client-side.</td>
</tr>

</tbody>
</table>

## Get a Random Number

From the command line, use the `cleos push action` command to call the **getrandom** action.

```shell
cleos -u [chain-api-url] push action waxrng getrandom '["waxrng", 1267, 445896213]' -p waxrng@active
```

The console prints the following:

```shell
executed transaction: bcf8ec6e2c3c03187c754c76ba455018f65960545020201b6e18ac9b8043935d  120 bytes  12299 us
#  waxrng <= waxrng::getrandom    {"nm":"waxrng","customer_id":1267,"signing_value":445896213}
#      orng.wax <= orng.wax::requestrand        {"assoc_id":1267,"signing_value":445896213,"caller":"waxrng"}
warning: transaction executed locally, but may not be confirmed by the network yet         ]
```

If the customer's **signing_value** has been used by the WAX RNG Service, you'll receive the following message:

```shell
Error 3050003: eosio_assert_message assertion failure
Error Details:
assertion failure with message: Signing value already used
pending console output:
```

## Verify Your Random Number

The callback function saves your random number to the **rngcustomers** table. To display the table values, use the `cleos get table` command.

```shell
cleos -u [chain-api-url] get table waxrng waxrng rngcustomers
```

The console prints the following JSON results, including the **random_value** returned from the WAX RNG service and the **finalnumber** derived from the **random_value**:

```json
{
  "rows": [{
      "nm": "waxrngstagng",
      "customer_id": 1267,
      "random_value": "706eb301c6f7673e235c5f386a965057b682175607c4928850c0073a3cdbc4de",
      "finalnumber": 82
    }
  ],
  "more": false
}     
```