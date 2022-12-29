---
title: Modifying mutable data for AA
nav_order: 44
layout: default
parent: How-To AtomicAssets
grand_parent: Tutorials
has_children: false
lang-ref: Modifying mutable data for AA
lang: en
---
## Index

- [Mutable data vs. immutable data](#p1)
- [ATTRIBUTE_MAP](#p2)
- [Writing mutable data in JavaScript](#p3)
- [Modifying mutable data in JavaScript](#p4)
- [Writing mutable data in Smart Contract](#p5)
- [Modifying mutable data in Smart Contract](#p6)

## Mutable data vs. immutable data <a name="p1"></a>

What makes an NFT a digital valuable? It is their ability to store unchangeable data over all its existence and its permanence in a decentralized system, as a blockchain is. Thanks to the permanence of its immutable data, it is possible to use NFTs as unique, non-forgeable property or authorship records, which is highly appreciated by digital creators who fight against piracy -against the illegitimate usage of their work, to be more specific.

However, NFTs have become a popular characteristic of the gaming industry, since they allow the players to become the true owners of the assets they acquire in the game, and to store or trade them even outside the game. We are talking about card collectors, for instance, who still make use of cards from games forgotten decades ago. This could not be achieved in previous digital card games that aimed to replace traditional, physical, card games, since when the game disappeared, its cards disappeared with it. Nowadays, thanks to NFTs, it is possible to keep such cards as if they were part of a traditional card game. There are certain people who believe this is not comparable to the traditional system, but we must be aware that the youngest generations are digital: the vast majority of entertaining content they consume is digital. Therefore, they value digital content as much as our elders value the material.

But there is more than storing immutable data for an NFT to be fully useful in a game. This is, in fact, counterproductive, since the asset -which can be a card, a piece of armor or a weapon- should probably be upgraded after a period of time, in order to distinguish itself from other assets, and therefore becoming more valuable. This would not be possible without mutable data.

Technically speaking, there is no difference between mutable and immutable data in an NFT: both are information data recorded in the place the NFT occupies in a smart contract. The difference lies in the smart contract's programming logic, which allows mutable data to be modified, while it forbids modifying immutable data.

It is true that the smart contract can be modified to avoid this, but this would make it dubious and render it useless.

AtomicAssets is the most popular smart contract from WAX Blockchain -as well as other Antelope Blockchains- and is extremely well designed to be used in video games, thus having both mutable and immutable data. We will now learn how to modify this data.

Here we can see an example of an NFT -from a card game- with immutable data to the left and mutable data to the right. In this case we can see that the card level (Lvl) can rise, as its “strong”, “shield”, “loot” and other attributes can.

![AtomicAsssets mintasset](/assets/img/tutorials/howto_atomicassets/mutabledata_aa.png)

Let us see how to modify them, now.

## ATTRIBUTE_MAP <a name="p2"></a>

Before getting into modifying a mutable field In JavaScript it is important to know the ATTRIBUTE_MAP object. One of the advantages of the AtomicAssets standard is the use of serialization in order to save RAM in the tables which store NFTs' data. For this we use a data map that pairs the type of data with its content, therefore allowing it to be serialized.

This map's format is built following this pattern:
```json
[{"key": MYKEY, value: MYVALUE}, ...]
```
In an NFT's template it is defined which is mutable data and which is immutable data, and it specifies the name of the field and the type of data it will contain. Therefore, we can have the string type field "name", or the int(16bits) type field "speed".

So if we wished to create a data map to specify this information:
```json
{ 
    name: “Delorean”, 
    speed: 300 
}
```
We should create an array of objects while keeping its specifications from the template:
```json
[{
	“key”: “name”,
	“value”: [“string”, “Delorean”]
}, {
	“key”: “speed”,
	“value”: [“uint16”, 300]
}]
```
Let us see how to do this in JavaScript now.

## Writing mutable data in an NFT in JavaScript <a name="p3"></a>

For this example we need to call the "setassetdata" action from the AtomicAssets' smart contract. This action requires of four parameters:

![AtomicAsssets mintasset](/assets/img/tutorials/howto_atomicassets/setassets_aa.png)

- **authorized_editor**: the name of the account which must be authorized to access the collection the NFT belongs to.
- **asset_owner**: the name of the account belonging to the current owner of the asset -it is not necessary to be the owner of the asset in order to modify its mutable data; you just need to be authorized to do so, or be its creator.
- **asset_id**: the ID number of the NFT we want to modify.
- **new_mutable_data**: a structure similar to the ATTRIBUTE_MAP which contains the data we want to modify, as we saw before.

By following the previous example we could define a function which receives the needed information as parameters and which calls the smart contract from "atomicassets":
```js
Const updateNft = (authorized, owner, asset_id, name, speed) => {
    apiRpc.transact({
        actions: [{
            account: 'atomicassets',
            name: 'setassetdata',
            authorization: [{
                actor: authorized,
                permission: 'active'
            }],
            data: {
                authorized_editor: authorized,
                asset_owner: owner,
                asset_id: asset_id,
                new_mutable_data: [{
                    'key': 'name',
                    'value': ["string", name]
                },
                {
                    'key': 'speed',
                    'value': ['uint16', speed]
                }]
            }
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    }).then(result => {
        log(result);
    }).catch(err => {
        console.log(err, JSON.stringify(err, null, 2));
    });
}
```
## Modifying mutable data in JavaScript <a name="p4"></a>

We have seen how to introduce mutable data in an NFT, but sometimes we will need to update its content, such as, for instance, to add a number of points to its actual score.

Obviously, we will first need to read the field's content, but we should keep in mind that the data is serialized, as we mentioned earlier. If we use the eosjs library, we will have to deserialize the information first. Fortunately, the Pink Network team, creators of the AtomicAssets standard, also created a JavaScript library in order for us to access all collections, schemes, templates and, of course, NFTs, in a much easier way.

https://www.npmjs.com/package/atomicassets

As the eosjs library requires to be connected to a Full Story API from the WAX Blockchain, the AtomicAssets library needs to be connected to a specific Atomic API. There are several WAX Block producers who offer this service, fortunately, and it is free for WAX Blockchain users.

<strong>Note:</strong> If you are developing an application for public use it is convenient to have your own APIs and not depend on the availability of public APIs.
{: .label .label-yellow }

In this example we see how to connect to an Atomic API in order to read an NFT, based on its ID, and how to obtain one of its data's contents.
```js
const { ExplorerApi } = require("atomicassets");
const api = new ExplorerApi(
    ATOMIC_API, 
    "atomicassets", 
    { fetch });

const asset = await api.getAsset(asset_id);
let player_points = asset.mutable_data.player_points;
player_points += 100;
```
You must change **ATOMIC_API** for a valid Atomic API URL. You can get a list of them in https://tools.ledgerwise.io

Once we have read it, all there is left to do is to update the information with the desired values and save it in the NFT, as we saw in the previous step.

## Writing the mutable data of an NFT from AtomicAssets in a smart contract <a name="p5"></a>

Operating with AtomicAssets' NFTs from our smart contract requires us to include some items from the smart contract "atomicassets" in our code, for us to be able to reuse certain definitions and declarations of functions and data . Specifically we will need these files:
```
atomicassets.hpp
atomicdata.hpp
base58.hpp
```
Which we can obtain from Pink Network's GitHub:
(https://github.com/pinknetworkx/atomicassets-contract/tree/master/include)

Our first step is to declare an item of the ATTRIBUTE_MAP type:
```c
atomicassets::ATTRIBUTE_MAP mdata = {};
```
Now we can start adding data:
```c
mdata[“name”] = string(“Delorean”);
mdata[“speed”] = uint16_t(300);
```
Or, if we receive the data as parameters in a function -see the JavaScript example:
```c
mdata[“name”] = name;
mdata[“speed”] = speed;
```
And all that is left to do is to call the "atomicassets" smart contract's action to carry out the operation:
```c
action(
    permission_level{name(“authorized”), name("active")},
    name(“atomicassets”),
    name("setassetdata"),
    make_tuple(name(“authorized”), name(“owner”), asset_id, mdata))
    .send();
```
## Modifying mutable data from the smart contract <a name="p6"></a>

While similar to the JavaScript example of mutable data modification, in this case we will need to deserialize the data. We are fortunate that Pink Network will facilitate our job again -this is the reason why we imported the "atomicdata" and "base58" files during the previous step.

First of all we need to locate the NFT by accessing the assets table owned by the current owner. This is why it is important to know who has the NFT in their wallet, since it will be the scope of the data table of the assets from AtomicAssets.

The information we need to serialize and deserialize the data -item names and data types- is stored in the collection's schema, so we need to access the information of the schema the NFT belongs to as well.
```c
// Read owner’s assets
atomicassets::assets_t listAssets = atomicassets::get_assets(owner);

// Search for the NFT based on its ID number
auto idxCard = listAssets.find(asset_id);

// Access the schemas table of the asset’s collection
atomicassets::schemas_t collection_schemas = atomicassets::get_schemas(idxCard->collection_name);

// Obtain the asset’s schemas to learn the data types
auto idxSchema = collection_schemas.find(idxCard->schema_name.value);

// Deserialize the data
mdata = atomicdata::deserialize(
       idxCard->mutable_serialized_data,
       idxSchema->format);

// Access the data we wish to modify
uint32_t mdata_player_points = get<uint32_t>(mdata["player_points"]);

// Update
mdata_player_points += player_points;
```
Once the data has been taken we can modify and store it as we saw in the previous example. We just need to keep in mind that the function "deserialize" will give us an item of the type ATTRIBUTE_MAP, which allows us to use it directly in the writing operation.


