---
title: WAX RNG Basics
layout: default
nav_order: 82
parent: Create a WAX RNG Smart Contract
grand_parent: Tutorials
---

## How it Works

* **WAX RNG Smart Contract.** The WAX RNG smart contract runs on the WAX mainnet, owned by the **orng.wax** account.  
* **WAX RNG Oracle Service.** Secured by the **oracle.wax** account, this service monitors the WAX Blockchain externally, listening for new calls to the WAX RNG smart contract. When you request a new random number, the RNG oracle creates RSA signatures that generate provably fair random numbers. 

Here's the typical WAX RNG flow:

1. Your user or your client-side app supplies a 64-bit random number (signing_value). For example, you could display a button that calls a javascript function that generates a pseudo-random number. When the user is satisfied with their seed value, they can click another button (e.g., Start Playing).
2. You also need to supply a unique tracking number (assoc_id). This can be an internal job id or database id. 
3. Your smart contract calls the WAX RNG service to request a random number, sending your assoc_id and the user's signing_value.
4. The WAX RNG oracle accepts your request, then uses an internal public and private key pair to create an RSA signature based on the number supplied by your customer (signing_value). This signature is hashed and becomes your random number. 
5. The WAX RNG service verifies the RSA signature returned from the WAX RNG oracle, then sends the random number to a call-back action in your smart contract, along with your tracking number (assoc_id). 
6. You display the random number to the client or implement some sort of randomization logic, animation, or in-game function.

To provide fairness, provability, and user confidence, it's recommended that you allow the customer to view or even edit the client-side signing_value. If you prefer to generate the signing_value on the back-end or your app doesn't require a front-end signing_value, you could use the user's transaction hash sent from their wallet. This value is a sha256 hash signed by the client, making it a unique, collision-resistant choice. For example:

```
ACTION getrand(const name& caller) {
  require_auth(caller);
  
  auto size = transaction_size();
  char buf[size];

  auto read = read_transaction(buf, size);
  check(size == read, "read_transaction() has failed.");

  auto tx_signing_value = sha256(buf, size); 

  //now that you've generated a unique signing_value, call the WAX RNG action.
  action({ get_self(), "active"_n }, "orng.wax"_n,  "requestrand"_n, std::tuple{ order_id, tx_signing_value, get_self() }).send();
}


```

## Parameters

The WAX RNG **requestrand** action accepts the following parameters:

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
<td>assoc_id</td>
<td>1405</td>
<td>Required `uint64_t`. A unique value assigned by you (e.g., job id, database id).</td>
</tr>

<tr>
<td>signing_value</td>
<td>84569725</td>
<td>Required `uint64_t`. A pseudo-random number generated client-side or on the back-end. Must be unique and never used before, even by other users.</td>
</tr>

<tr>
<td>caller</td>
<td>get_self()</td>
<td>Required `name`. The smart contract account calling the <strong>orng.wax</strong> action.</td>
</tr>

</tbody>
</table>

### Example

```cppACTION requestrand(uint64_t assoc_id, uint64_t signing_value, const name& caller)```

## Callback Function

To receive your random number from the WAX RNG service, your smart contract must include the **receiverand** callback function with the following parameters:


<table style="table-layout:fixed">
<thead>
<tr>
<th style="width:15%">Parameter</th>
<th style="width:30%">Example</th>
<th>Description</th>
</tr>
</thead>

<tbody>
<tr>
<td>assoc_id</td>
<td>1405</td>
<td>Required `uint64_t`. A unique value assigned by you (e.g., job id, database id).</td>
</tr>

<tr>
<td>random_value</td>
<td >Refer to Description.</td>
<td style="word-wrap:break-word">Required `checksum256`. The RSA signed random value returned from the WAX RNG service.<br />
    <strong>Example: </strong>0979df3b6cb654bfe059481b586c2277697e7f0bfcef3e0dd198e19b54bce278
</td>
</tr>

</tbody>
</table>

### Example

```cppACTION waxrng::receiverand(uint64_t assoc_id, const eosio::checksum256& random_value)```

## Action Constructor

To call the WAX RNG **requestrand** external action, you'll need to use the action constructor. Action constructors accept the following parameters (customized below for the **requestrand** action):

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
<td>permission</td>
<td>{ get_self(), "active"_n }</td>
<td>Required `structure`. This is your WAX Blockchain Account and permission type. For example, if you're smart contract's blockchain account is named <strong>waxsc1</strong>, { get_self(), "active"_n } returns <strong>waxsc1@active</strong> permissions.</td>
</tr>

<tr>
<td>code</td>
<td>"orng.wax"_n</td>
<td>Required `name`. The WAX RNG smart contract account.</td>
</tr>

<tr>
<td>action</td>
<td>"requestrand"_n</td>
<td>Required `string`. The action name in the WAX RNG smart contract.</td>
</tr>

<tr>
<td>data</td>
<td>std::tuple{ your_id, signing_value, get_self() })</td>
<td>Required `fixed-size collection`. The parameters required for the requestrand action.
</td>
</tr>
</tbody>
</table>
