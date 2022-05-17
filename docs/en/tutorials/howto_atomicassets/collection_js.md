---
title: Managing AtomicAssets collections from javaScript
nav_order: 34
layout: default
parent: How-To AtomicAssets
grand_parent: Tutorials
has_children: false
lang-ref: Managing AtomicAssets collections from javaScript
lang: en
---

Collections are the main pillar of NFT management. If we want to use the AtomicAssets standard to create our NFTs in WAX blockchain, the first thing we have to do is to create a collection that serves as a container catalogue for all the NFTs (and that are part of the context of that collection).

It doesn’t matter if our intention is to create a series of NFTs for blockchain video games or to sell art; it is very important that all the NFTs that are related to the project are part of a collection that facilitates their management by us and by users and third-party applications.

All the collection creation and management operations can be done from the official AtomicHub interface but, in this series of articles, we are going to explain how we can manage all the necessary operations to create and maintain our collection of NFTs from JavaScrip.

![AtomicAsssets Actions](/assets/img/tutorials/howto_atomicassets/atomicassets_actions.png)

These are the actions we are going to cover in this article:

- createcol: Create collection
- addcolauth: Add authorised account to the collection
- remcolauth: Remove an authorised account
- addnotifyacc: Add account that will receive notifications
- remnotifyacc: Remove an account from the list of notifications
- setcoldata: Modify collection information
- setmarketfee: Modify collection fee

First we are going to create the working environment so that we can connect to the blockchain. We must connect to a WAX full API node to be able to send our calls to the AtomicAssets smart contract actions.

```js
const { Api, JsonRpc } = require("eosjs");
const { JsSignatureProvider } = require("eosjs/dist/eosjs-jssig");
const fetch = require("node-fetch");

const signatureProvider = new JsSignatureProvider([PVT_K1_eGgwexxxxxxxxxxxxxxxxxxxxxxxxxxxx]);

const rpc = new JsonRpc("http://testnet-wax.3dkrender.com", {
  fetch,
});

const apiRpc = new Api({
  rpc,
  signatureProvider,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder(),
});

const TAPOS = {
  blocksBehind: 3,
  expireSeconds: 30,
};
```

**IMPORTANT**: This is an example for educational purposes. Never leave the private key exposed on the server. We recommend the client/server pattern in order to hide sensitive data on the backend.
{: .label .label-yellow }

We will use some test account names. Create your accounts on testnet to do your internship.

## Collection data definition

```js
/*
 Collection definition
*/

// Collection author
const auth = 'arpegiator21';

// Collection name (eosio name format)
const colName = 'arpecol11111';

// Activate notifications?
const notify = true;

// Authorized accounts
const authorizedAccs = [
    'blenderizerx',
    'nftpacker3dk',
    'atomicdropsx',
    'arpegiator22'
];

// Accounts to receive notifications
const notifyAccs = [
    'arpegiator25',
    'nftpacker3dk'
];

// Market fee (5% for example)
const marketFee = 0.05;

// Collection description (not all fields)
const data = [{
        "key": "name",
        "value": ["string", "My great collection"]
    },
    {
        "key": "description",
        "value": ["string", "A new testing collection"]
    },
    {
        "key": "url",
        "value": ["string", "https://mysite.url"]
    },
    {
        "key": "img",
        "value": ["string", "QmRxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"]
    }
];
// Create collection
(async()=> {
    const result = await createCol(auth, colName, notify, authorizedAccs, notifyAccs, marketFee, data);
    console.log(result);
})()
```

And call to action "*createcol*":

```js
/**
 *  Create AtomicAssets collection
 */
const createCol = async (
  auth, // Author account
  name, // Collection name
  notify, // Allow notify?
  authorizedAccs, // Array authorized accounts
  notifyAccs, // Array accounts to notify
  marketFee, // Market fee
  data // Collection description.
) => {
  try {
    const result = await apiRpc.transact(
      {
        actions: [
          {
            account: "atomicassets",
            name: "createcol",
            authorization: [
              {
                actor: auth,
                permission: "active",
              },
            ],
            data: {
              author: auth,
              collection_name: name,
              allow_notify: notify,
              authorized_accounts: authorizedAccs,
              notify_accounts: notifyAccs,
              market_fee: marketFee,
              data: data,
            },
          },
        ],
      },
      TAPOS
    );
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
};
```
## Modify AtomicAssets Collection Data

To modify a NFT collection in AtomicAssets we will use a data structure very similar to the one used to create the collection. The action must be signed by an authorised account in the collection.

```js
// Collection author
const auth = 'arpegiator21';

// Collection name (eosio name format)
const colName = 'arpecol11111';

// New data
const data = [
  {
    key: "name",
    value: ["string", "My Great Collection"],
  },
  {
    key: "description",
    value: ["string", "A new testing collection *edited*"],
  },
  {
    key: "url",
    value: ["string", "https://mysite.url"],
  },
  {
    key: "img",
    value: ["string", "QmRVxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
  },
  {
      key: "company",
      value: ["string", "My Company Name Ltd."],
  }
];
// Call to action
(async () => {
  const result = await modifyColData(auth, colName, data);
  console.log(result);
})();
```
And call to action "*setcoldata*":
```js
/**
 * Modify data collection
 */
const modifyColData = async (
  auth, // Authorized user
  colName, // Collection name
  data // New data collection
) => {
  try {
    const result = await apiRpc.transact(
      {
        actions: [
          {
            account: "atomicassets",
            name: "setcoldata",
            authorization: [
              {
                actor: auth,
                permission: "active",
              },
            ],
            data: {
              collection_name: colName,
              data: data,
            },
          },
        ],
      },
      TAPOS
    );
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
};
```

## Add or Remove Authorized Accounts to AtomicAssets Collection

We can add or remove authorised accounts in our collection at any time by using the "addcolauth" or "remcolauth" actions.

The input parameters will be the name of the collection and the account name to add or remove.

The action must be signed by an authorised account in the collection.

```js
// Collection author
const auth = 'arpegiator21';

// Collection name (eosio name format)
const colName = 'arpecol11111';

// New authorized account to add
const newAuth = 'arpegiator25';

// Set Action: True -> add / False -> remove
const setAction = true;

// Call to action
(async()=>{
    const result = await addAuths(auth, colName, newAuth, setAction);
    console.log(result);
})();
```
Call to action "*addcolauth*" or "*remcolauth*" (We use a switch to simplify the example)
```js
/**
 * Add or remove authorized accounts
 */
const addAuths = async (
  auth, // Authorized user
  nameCol, // Colection name
  setAccount, // New account authorized
  setAction // Add or remove auth?
) => {
  try {
    let data = {
      collection_name: nameCol
    };
    if (setAction) {
      data = {
        ...data,
        account_to_add: setAccount,
      };
    } else {
      data = {
        ...data,
        account_to_remove: setAccount,
      };
    }    
    const result = await apiRpc.transact(
      {
        actions: [
          {
            account: "atomicassets",
            name: (setAction) ? "addcolauth" : "remcolauth",
            authorization: [
              {
                actor: auth,
                permission: "active",
              },
            ],
            data: data,
          },
        ],
      },
      TAPOS
    );
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
};
```

## Add or Remove Notify Accounts to AtomicAssets Collection

We can add or remove accounts to the notification list through actions very similar to the previous ones; "*addnotifyacc*" and "*remnotifyacc*".

```js
/**
 * Add or remove accounts to notify list
 */
const notifyAcc = async (
  auth, // Authorization account
  colName, // Collection name
  setAccount, // Name to add or remove
  setAction // Add or remove from list?
) => {
  try {
    let data = {
      collection_name: colName,
    };
    if (setAction) {
      data = {
        ...data,
        account_to_add: setAccount,
      };
    } else {
      data = {
        ...data,
        account_to_remove: setAccount,
      };
    }
    const result = await apiRpc.transact(
      {
        actions: [
          {
            account: "atomicassets",
            name: setAction ? "addnotifyacc" : "remnotifyacc",
            authorization: [
              {
                actor: auth,
                permission: "active",
              },
            ],
            data: data,
          },
        ],
      },
      TAPOS
    );
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};
```

## Modifying the market fee for a collection of AtomicAssets NFTs

To conclude this section, we will see how we can modify the royalty rate of our collection. This fee will be collected by the NFT markets on the purchase/sale operations of any NFT in our collection.

```js
// Collection author
const auth = 'arpegiator21';

// Collection name (eosio name format)
const colName = 'arpecol11111';

// New collection fee
const marketFee = 0.08;

(async()=>{
    const result = await setMarketFee(auth, colName, marketFee);
    console.log(result);
})();
```
And call to action
```js
/**
 * Set / change collection market fee
 */
const setMarketFee = async (
  auth,
  colName,
  marketFee
  ) => {
    try {
      const result = await apiRpc.transact(
        {
          actions: [
            {
              account: "atomicassets",
              name: "setmarketfee",
              authorization: [
                {
                  actor: auth,
                  permission: "active",
                },
              ],
              data: {
                collection_name: colName,
                market_fee: marketFee
              },
            },
          ],
        },
        TAPOS
      );
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
};
```