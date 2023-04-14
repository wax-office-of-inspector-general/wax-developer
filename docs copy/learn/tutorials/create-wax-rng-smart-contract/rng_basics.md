---
title: WAX RNG Basics
layout: default
nav_order: 82
parent: Create a WAX RNG Smart Contract
grand_parent: Tutorials
lang-ref: WAX RNG Basics
lang: en-US
---

## How it Works

* **WAX RNG Smart Contract.** The WAX RNG smart contract runs on the WAX mainnet, owned by the **orng.wax** account.  
* **WAX RNG Oracle Service.** Secured by the **oracle.wax** account, this service monitors the WAX Blockchain externally, listening for new calls to the WAX RNG smart contract. When you request a new random number, the RNG oracle creates RSA signatures that generate provably fair random numbers. 

Here's the typical WAX RNG flow:

1. Your user or your client-side app supplies a 64-bit random number (*signing_value*). For example, you could display a button that calls a javascript function that generates a pseudo-random number. When the user is satisfied with their seed value, they can click another button (e.g., Start Playing).
2. You also need to supply a unique tracking number (*assoc_id*). This can be an internal job id or database id. This number will serve as a unique key to identify the request and help retrieve the random number obtained.
3. Your smart contract calls the WAX RNG service to request a random number, sending your *assoc_id* and the user's *signing_value*.
4. The WAX RNG oracle accepts your request, then uses an internal public and private key pair to create an RSA signature based on the number supplied by your customer (*signing_value*). This signature is hashed and becomes your random number. 
5. The WAX RNG service verifies the RSA signature returned from the WAX RNG oracle, then sends the random number to a call-back action in your smart contract, along with your tracking number (*assoc_id*). 
6. You display the random number to the client or implement some sort of randomization logic, animation, or in-game function.
