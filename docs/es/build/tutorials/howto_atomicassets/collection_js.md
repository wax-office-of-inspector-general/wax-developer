---
title: Administrar colecciones AtomicAssets desde javaScript
order: 34
---

# Administrar colecciones AtomicAssets desde javaScript

Las colecciones son el pilar principal de la gestión de NFTs. Si queremos utilizar el estándar AtomicAssets para crear nuestras NFT en WAX blockchain, lo primero que tenemos que hacer es crear una colección que sirva de catálogo contenedor para todas las NFT (y que formen parte del contexto de esa colección).

No importa si nuestra intención es crear una serie de NFTs para videojuegos en blockchain o para vender arte; es muy importante que todas las NFTs que estén relacionadas con el proyecto formen parte de una colección que facilite su gestión tanto por nosotros como por los usuarios y aplicaciones de terceros.

Todas las operaciones de creación y gestión de colecciones se pueden hacer desde la interfaz oficial de AtomicHub pero, en esta serie de artículos, vamos a explicar cómo podemos gestionar todas las operaciones necesarias para crear y mantener nuestra colección de NFTs desde JavaScrip.

![AtomicAsssets Actions](/assets/images/tutorials/howto_atomicassets/atomicassets_actions.png)

Estas son las acciones que vamos a cubrir en este artículo:

- createcol: Crear una colección.
- addcolauth: Añadir cuentas autorizadas a la colección. Estas cuentas podrán realizar llamadas a las acciones del smart contract atomicassets para manipular esta colección.
- remcolauth: Retirar una cuenta de la lista de cuentas autorizadas.
- addnotifyacc: Añadir una cuenta que recibirá notificaciones cuando se realice alguna acción con esta colección.
- remnotifyacc: Retirar una cuenta de la lista de cuentas notificables.
- setcoldata: Añadir información variada a la colección.
- setmarketfee: Establecer o modificar la tasa de regalías por comercio del NFT en markets.

Primero vamos a crear el entorno de trabajo para poder conectarnos a la blockchain. Debemos conectarnos a un API a través de un nodo de WAX para poder enviar nuestras llamadas a las acciones del contrato inteligente AtomicAssets.

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
::: warning
Este es un ejemplo con fines educativos. Nunca dejes la clave privada expuesta en el servidor. Recomendamos el patrón cliente/servidor para ocultar los datos sensibles en el backend.
:::

Utilizaremos algunos nombres de cuentas de prueba. Crea tus cuentas en testnet para hacer tus prácticas.

## Definición de los datos de la colección

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

Y llamada a la acción "*createcol*":

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

## Modificando los datos de una colección AtomicAssets

Para modificar los datos de una colección NFT en AtomicAssets emplearemos una estructura de datos muy similar a la ya empleada para crear la colección. 

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
Y llamada a la acción "*setcoldata*":
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

## Añadir o retirar cuentas autorizadas a la colección

Podemos añadir o eliminar cuentas autorizadas en nuestra colección en cualquier momento mediante las acciones "addcolauth" o "remcolauth".

Los parámetros de entrada serán el nombre de la colección y el nombre de la cuenta a añadir o eliminar.

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
Y llamada a la acción "*addcolauth*" o "*remcolauth*" (Utilizamos un switch para simplificar el ejemplo)
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

## Añadir o retirar cuentas de notificación

Podemos añadir o retirar cuentas que recibierán notificaciones cada vez que una acción afecte a la colección de un modo muy similar al visto en el paso anterior. Esta vez utilizaremos las acciones "*addnotifyacc*" y "*remnotifyacc*"

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

## Modificar la tasa de regalías

Para concluir esta sección veremos cómo establecer o modificar la tasa por regalías que recibirá la colección cada vez que se comercie con un NFT en un market.

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
Y la llamada a la acción:
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