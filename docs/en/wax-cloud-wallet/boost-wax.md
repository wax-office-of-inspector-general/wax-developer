---
title: boost.wax
layout: default
parent: WAX Cloud Wallet
lang-ref: boost.wax
lang: en
---

This contract registers other contracts that wish to have WAX apply extended management over CPU and Net for their WAX Cloud Wallet users.

Deployed to: [boost.wax](https://wax.bloks.io/account/boost.wax)


## WAX Cloud Wallet Resource Model

The resource allocation model for WAX Cloud Wallet accounts was designed to be based on account activity. Instead of allocating resources to each WAX Cloud Wallet account at the time of creation, the new resource model allocates necessary resources to each account at the time of executing and signing of a transaction. These resources are then reclaimed. This new model allows for pooling resources from accounts that are less active at the moment and use those resources to boost activity of active accounts. This new boost system is designed as a tiered resource pool system with two resource tiers being checked first for available bandwidth before a user would be required to provide resources to complete a transaction from their own WAXP resource stake.

### dApp Boost Resource Pool Tier

WAX Cloud Wallet will allocate up to 5 seconds of CPU and 5M words of NET bandwidth per dApp in a given 24h period; This equals to about 10000 boosted actions per dApp in that time period assuming 0.5 ms average action resource cost. The parameters of the dApp boost resource pool may be adjusted over time as more utilization data becomes available.
   
Additionally, each dApp can contribute their own WAXP to extend its dApp boost resource pool. dApp smart contract must have a permission called paybw, and it must be linked to the boost.wax#noop action. Furthermore, it must have a 1 of 1 authority using the account@permission boost.wax@paybw. As an example see the [test.wax@paybw permission](https://wax.bloks.io/account/test.wax#keys).
   
When initial dApp boost resource pool tier is exceeded, the WAX Cloud Wallet will sign for dApps users using this permission if it has sufficient CPU and NET allocated to its contract's account. Each dApp needs to also configure its dApp boost resource pool allocation per user via boost.wax smart contract via [this action](https://wax.bloks.io/account/boost.wax?loadContract=true&tab=Actions&account=boost.wax&scope=boost.wax&limit=100&action=reg).

If dApp pool has available resources then WAX Cloud Wallet will boost users' transactions from that dApp pool and decrement the pool metering accordingly.
   
WAX Cloud Wallet team reserves the right to disable dApp Boost Resource Pool for a given dApp.

### User Boost Resource Pool Tier

WAX Cloud Wallet will allocate up to 5 ms of CPU and 5k words of NET bandwidth per each user in a given 24h period. This equals to about 10 boosted actions per user in that time period assuming 0.5 ms average action resource cost. The parameters of the User Boost Resource Pool may be adjusted over time as more utilization data becomes available.

Both dApp Boost Resource Pool Tier and User Boost Resource Pool Tier must have resources in order for an action to be boosted by the new WAX Cloud Wallet resource mechanism. If either dApp Boost Resource Pool or User Boost Resource Pool has been exhausted then WAX Cloud Wallet will switch to using resources from the dApp’s own staked resources, and if the user has exceeded the dApp’s configured 24 hour bandwidth limit, WCW will switch to using the user’s staked resources.

![alt text](https://github.com/worldwide-asset-exchange/boost.wax/blob/master/BoostDecisionTree.png?raw=true){:class="img-responsive"}

This boost system allows for controlled resource metering, ensuring that each user has a necessary resource baseline enabling them to participate in NFT based activities like pack drops, pack opening, crafting, NFT buying and selling, and trading regardless of the current resource cost on the network.

### RAM Boost

WCW creates new accounts with the bare minimum RAM to successfully create each account. So that users can still execute transactions requiring RAM, WCW boosts RAM for any transaction that is successfully boosted for bandwidth under the paid by WAX tier. Currently WAX will fund up to 4096 bytes total account RAM including that required for account creation for any of these transactions. In the future, RAM boosts will available for the dApp paid tiers which will be paid by the relevant dApps if a transaction does not qualify for boosting under the WAX paid/user boost tier.

## API

* [reg(name contract, uint64_t cpu_us_per_user, uint64_t net_words_per_user, bool use_allow_list, vector<name> allowed_contracts)](https://wax.bloks.io/account/boost.wax?loadContract=true&tab=Actions&account=boost.wax&scope=boost.wax&limit=100&action=reg)
   Register your contract for bandwidth management.  
   * `contract`: the contract account to register. Must also be the account calling this action.  
   * `cpu_us_per_user`: amount of cpu in microseconds to provide your users over a 24 hour period.  
   * `net_words_per_user`: amount of net in microseconds to provide your users over a 24 hour period.  
   * `use_allow_list`: turn allow list enforcement on or off.
   * `allowed_contracts`: vector of contract name that are permitted to be in transactions accompanying your contract. Must have use_allow_list == true for these to be enforced. The idea is to prevent abuse by dapps that might sneak one of your contract actions into their transactions in order to take advantage of your bandwidth quota. By listing the cotnracts you accept in your contract's transactions, you will only pay with your own cpu+net if all transaction contracts are contained in this list.  
   
Note: your contract must have a permission called **paybw**, and it must be linked to the **boost.wax**#**noop** action. Furthermore, it must have a 1 of 1 authority usuing the account@permission `boost.wax@paybw`. As an example see the [test.wax@paybw permission](https://wax.bloks.io/account/test.wax#keys). When the free tier is exceeded, the WAX backend will sign for your users using this permission if you have sufficient CPU and Net allocated to your contract's account.
   
* **[dereg(name contract)](https://wax.bloks.io/account/boost.wax?loadContract=true&tab=Tables&account=boost.wax&scope=boost.wax&limit=100&action=dereg)**: 
   Deregister your contract from bandwidth management.  
   
* **[noop()](https://wax.bloks.io/account/boost.wax?loadContract=true&tab=Tables&account=boost.wax&scope=boost.wax&limit=100&action=noop)**: 
   No-op action inserted into WAX Cloud Wallet transactions that satisfy bandwidth management crtieria.  

* **boost(name from, name to, asset cpu, asset net)**: *Deprecated*
* **updateboost(name from, name to, asset cpu_to, asset net_to)**: *Deprecated*
* **unboost(name from, name to)**: *Deprecated*
* **boosterdel (name booster)**: *Deprecated*
