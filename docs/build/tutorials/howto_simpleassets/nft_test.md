---
title: Test Your NFT Smart Contract 
order: 91
---

# Test Your NFT Smart Contract 

Now that you've deployed your WAX NFT smart contract, it's time to run a test action and create your first NFT.

## Create a WAX NFT

From the command line, use the `cleos push action` command to call the **createnft** action.

```shell
cleos -u [chain-api-url] push action waxnftowner1 createnft [] -p waxnftowner1@active
```

The console prints the transaction details:

```shell
executed transaction: 093e5a806fb4e89cc1d4db8ff59609fca6b0fb7074cd9374b45bcd4d823035a0  136 bytes  727 us
#  waxnftowner1 <= waxnftowner1::createnft      ""
#  simpleassets <= simpleassets::create         {"author":"waxnftowner1","category":"sticker","owner":"waxnftowner1","idata":"{\"name\": \"WAX Devel...
#  waxnftowner1 <= simpleassets::create         {"author":"waxnftowner1","category":"sticker","owner":"waxnftowner1","idata":"{\"name\": \"WAX Devel...
#  simpleassets <= simpleassets::createlog      {"author":"waxnftowner1","category":"sticker","owner":"waxnftowner1","idata":"{\"name\": \"WAX Devel...
warning: transaction executed locally, but may not be confirmed by the network yet         ]
```

## Verify Your WAX NFT

You can locate WAX NFTs in the **sassets** table, scoped by the NFT's owner. To display your NFT records, use the `cleos get table` command.

```json
cleos -u [chain-api-url] get table simpleassets waxnftowner1 sassets  
```

The console prints your NFTs, including the unique asset **id**:

```json
{
  "rows": [{
      "id": "100000000000035",
      "owner": "waxnftowner1",
      "author": "waxnftowner1",
      "category": "sticker",
      "idata": "{\"name\": \"WAX Developer Hive\", \"desc\": \"WAX Developer Hive Sticker\" }",
      "mdata": "{\"color\": \"black\", \"img\": \"https://developer.wax.io/img/wax_sticker.png\" }",
      "container": [],
      "containerf": []
    }
  ],
  "more": false
}     
```

## More Information

Refer to Simple Asset's <a href="https://github.com/CryptoLions/SimpleAssets" target="_blank">GitHub Repository</a> for additional contract actions, data structures, and samples. 



