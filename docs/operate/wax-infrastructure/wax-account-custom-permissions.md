---
title: WAX Account Custom Permissions
---

Your WAX account is used for all interactions with the blockchain, all actions require an associated authority which is typically your accounts active permission.

There are occasions when you may require a specific action to be executed from an external node our another party using your account, where you wouldn't want to share your active private key.

In this guide a practical example will be walked though on claiming rewards.

_This article has been updated to incorporate the_ [_Antelope_](https://antelope.io/) _Leap software build process._

## WAX Account Custom Permissions

If you are after more detail Antelope accounts and permissions are covered extensively in the legacy but still valid  [EOS Developers Documentation](https://docs.eosnetwork.com/docs/latest/core-concepts/accounts).

By default a WAX account has two permissions  **owner**  and  **active**

_The_ `_owner_` _permission sits at the root of the permission hierarchy for every account. It is therefore the highest relative permission an account can have within its permission structure. Although the_ `_owner_` _permission can do anything a lower level permission can, it is typically used for recovery purposes when a lower permission has been compromised. As such, keys associated with the_ `_owner_` _permission are typically kept in cold storage, not used for signing regular operations._

_The implicit default permission linked to all actions is_ `_active_`_, which sits one level below the_ `_owner_` _permission within the hierarchy structure. As a result, the_ `_active_` _permission can do anything the_ `_owner_` _permission can, except changing the keys associated with the owner. The_ `_active_` _permission is typically used for voting, transferring funds, and other account operations._

In this article a custom permission example will be walked through, this custom permission will fall under the  `active`  permission and will provide authorisation for 3 reward claiming actions  `claimgbmprod`  ,  `claimgbmvote`  and  `claimgenesis`.

## Configuration Summary

1.  Create a new key-pair
2.  Create a custom permission
3.  Assign an action to the custom permission
4.  Execute the permissioned action

`cleos`  and  `keosd`  will be used for this configuration as discussed in our previous article,  [Set Up a WAX Testnet Block Producer Node](https://medium.com/eosphere/wax-technical-how-to-3-78d358c46146).


**Create and import a new key-pair**

```
***Create a new key-pair***
> cleos create key --to-console  
Private key: 5KdtC99C9VoZoXscoQLe77zmnVAwj3PGSb1aJVQPZBEzcseaP5n  
Public key: EOS4tma83A8ocKsKsio2hpecJv16AZL4YxnoHpU2TK25r4E6UGE28

***Create a new wallet to use this key-pair***
> cleos wallet create -n waxclaim --to-console  
Creating wallet: waxclaim

Save password to use in the future to unlock this wallet.  
Without password imported keys will not be retrievable.  
"PW5JGHurUqfb2qf93Hynit3qFpkddiz6wpEWaWuqKTuGq5by4Fk7V"

***Unlock your wallet with the password from before***
> cleos wallet unlock -n waxclaim  
password: Unlocked: waxclaim

***Import your active_key : private***
> cleos wallet import -n waxclaim  
private key: imported private key for: EOS8PSfvq342YTVtogNVskjCttpx1rQX9JT59wQuLt2Nkz16ZmsL4
```

**Create a custom permission**

The below command will create a custom permission called  **waxclaimer**, the public key is used from the above generated key-pair and it will fall under the  `eosphereiobp`  accounts  `active`  permission in this example.

Of course for your purposes you would use your own Guild account and ensure that your active permission is unlocked using  `cleos`.

```
> cleos -u https://wax.eosphere.io set account permission eosphereiobp waxclaimer '{"threshold":1,"keys":[{"key":"EOS4tma83A8ocKsKsio2hpecJv16AZL4YxnoHpU2TK25r4E6UGE28","weight":1}]}' "active" -p eosphereiobp@active
```

**Assign actions to the custom permission**

In the below example three actions will be assigned under the  **waxclaimer**  permission,  `claimgbmprod`  (Block Production Rewards),  `claimgbmvote`  (Voter Rewards) and  `claimgenesis`  (Genesis Rewards).

As before, for your purposes you would use your own Guild account and ensure that your active permission is unlocked using  `cleos`.

```
> cleos -u https://wax.eosphere.io set action permission eosphereiobp eosio claimgbmprod waxclaimer

> cleos -u https://wax.eosphere.io set action permission eosphereiobp eosio claimgbmvote waxclaimer

> cleos -u https://wax.eosphere.io set action permission eosphereiobp eosio claimgenesis waxclaimer
```

**Execute the permissioned actions**

Using the  **waxclaimer** permission  and associated unlocked  **waxclaim wallet**  in this example  _(make sure you unlock waxclaim before use)_, these actions can now be executed without having to unlock and use the active permission.

The custom permission is used by specifying  `-p eosphereiobp@waxclaimer`  in the action.

```
> cleos -u https://wax.eosphere.io push action eosio claimgbmprod '{"owner":"eosphereiobp"}' -p eosphereiobp@waxclaimer

> cleos -u https://wax.eosphere.io push action eosio claimgbmvote '{"owner":"eosphereiobp"}' -p eosphereiobp@waxclaimer

> cleos -u https://wax.eosphere.io push action eosio claimgenesis '{"claimer":"eosphereiobp"}' -p eosphereiobp@waxclaimer
```

---

These **WAX Developer Technical Guides** are created using source material from the [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home)

Be sure to ask any questions in the  [EOSphere Telegram](https://t.me/eosphere_io)
