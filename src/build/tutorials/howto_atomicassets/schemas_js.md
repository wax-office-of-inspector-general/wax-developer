---
title: Managing AA schemas
order: 36
---
As mentioned above, schemas allow us to declare the common characteristics of the NFTs in our collection and to create groups. If we are creating NFTs for a game that has several characters, each character will be unique, but will share attributes with the rest of the characters. All the characters will have a name, a score, a life point level, etc. 

Likewise, our game will have weapons and all of them will share attributes such as name, damage point value, durability points, etc.

By making use of the schemes we will be able to create groups that will facilitate the classification and subsequent manipulation of each of the NFTs in our collection.

AtomicAssets incorporates the following actions to manage the schemes:
- createschema: Create the schema and declare the data types that compose it.
- extendschema: Add more datatypes to an existing schema

## Create a schema

![AtomicAsssets createschema](/img/tutorials/howto_atomicassets/createschema_atomicassets.png)

- authorized_creator: Name of an account authorised to manipulate the collection. The action must be signed by this account.
- collection_name: Name of the collection we are managing.
- schema_name: Name we assign to the schema.
- schema_format: Array of types [FORMAT](https://github.com/pinknetworkx/atomicassets-contract/wiki/Custom-Types#format) that declare the structure of the schema.

We will create a schema for the player cards with the following attributes:
- Name: string
- Class: string
- Points: uint32
- Life: uint16
- Life points: uint16

```js
// Collection author
const auth = 'arpegiator21';

// Collection name (eosio name format)
const colName = 'arpecol11111';

// Schema name
const schemaName = 'player';

// Collection description
const schemaFormat = [
    {
        "name": "name",
        "type": "string",
    },
    {
        "name": "img",
        "type": "ipfs",
    },
    {
        "name": "class",
        "type": "string",
    },
    {
        "name": "points",
        "type": "uint32",
    },
    {
        "name": "life",
        "type": "uint16",
    },
    {
        "name": "lifepoints",
        "type": "uint16",
    },
];

// Create schema
(async()=> {
    const result = await createSchema(auth, colName, schemaName, schemaFormat);
    console.log(result);
})();
```
And call to action:
```js
/* 
 * Create a schema into an AtomicAssets collection
 */
const createSchema = async ( 
  auth,
  colName,
  schemaName,
  schemaFormat
) => {
  try {
    const result = await apiRpc.transact(
      {
        actions: [
          {
            account: "atomicassets",
            name: "createschema",
            authorization: [
              {
                actor: auth,
                permission: "active",
              },
            ],
            data: {
              authorized_creator: auth,
              collection_name: colName,
              schema_name: schemaName,
              schema_format: schemaFormat
            },
          },
        ],
      }, TAPOS
    );
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}
```
## Extend a scheme

After creating the schema we realise that a character in the game will be exposed to dangers and should be protected by armour. We cannot modify attributes that already exist in a schema, but we can add new attributes with the action "*extendschema*".

![AtomicAsssets createschema](/img/tutorials/howto_atomicassets/extendschema_atomicassets.png)

This is the new data we will add to the schema:
- Armour: uint16
- Armour points: uint16

```js
// Collection editor
const auth = 'arpegiator21';

// Collection name (eosio name format)
const colName = 'arpecol11111';

// Schema name
const schemaName = 'player';

// Collection description
const schemaFormatExtend = [
    {
        "name": "shield",
        "type": "uint16",
    },
    {
        "name": "shieldpoints",
        "type": "uint16",
    }
];

// Create schema
(async()=> {
    const result = await extendSchema(auth, colName, schemaName, schemaFormatExtend);
    console.log(result);
})();
```
And call to action:
```js
/* 
 * Extend a schema with new data types
 */
const extendSchema = async ( 
  auth,
  colName,
  schemaName,
  schemaFormatExtend
) => {
  try {
    const result = await apiRpc.transact(
      {
        actions: [
          {
            account: "atomicassets",
            name: "extendschema",
            authorization: [
              {
                actor: auth,
                permission: "active",
              },
            ],
            data: {
              authorized_editor: auth,
              collection_name: colName,
              schema_name: schemaName,
              schema_format_extension: schemaFormatExtend
            },
          },
        ],
      }, TAPOS
    );
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}
```

