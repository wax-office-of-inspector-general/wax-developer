---
title: Acuñando NFTs AtomicAssets
order: 40
---

# Acuñando NFTs AtomicAssets

Después de haber creado la estructura de la colección llega el momento de comenzar a operar con los NFTs. Para ello, el smart contract de Atomicassets nos ofrece estas acciones:

- mintasset: Acuñar un nuevo NFT.
- transfer: Enviar uno o varios NFTs de una cuenta a otra.
- burnasset: Destruir (quemar) el NFT.
- setassetdata: Establecer o modificar los datos mutables de un NFT.
- backasset: Asociar tokens al NFT que serán liberados cuando el mismo sea destruido.

## Acuñar NFTs

Acuñar NFTs consisten en crear instancias a partir de una plantilla de referencia, la cual contiene la información que se replicará en cada nueva instancia, como ya vimos en documentos anteriores.

Los parámetros de la acción serían los siguientes:

![AtomicAsssets mintasset](/assets/images/tutorials/howto_atomicassets/atomiassets_mintasset.png)

- authorized_minter: Cuenta autorizada por la colección.
- collection_name: Nombre de la colección a la que pertenecerá el NFT.
- schema_name: Nombre del esquema en el cual se declaran los tipos de datos que definirán los NFTs.
- template_id: Identificador de la plantilla que contiene todos los datos inmutables de cada copia de NFT que se acuñe con esta plantilla.
- new_asset_owner: Nombre de cuenta que recibirá en propiedad el NFT recién creado. La cuenta autorizada puede crear un NFT directamente en una cuenta de destino diferente a la suya sin necesidad de hacer transferencias.
- immutable_data: Datos inmutables adicionales. Estos datos no están en la plantilla, pero sus tipos deben de estar definidos en el esquema.
- mutable_data: Datos mutables de inicio. Los datos mutables no están definidos en la plantilla, pero sus tipos deben de estar definidos en el esquema. Los datos mutables pueden añadirse o modificarse en el NFT en cualquier momento por lo que no es obligatorio crearlos en este momento.
- tokens_to_back: Listado de tokens que estarán asociados al NFT desde el momento de su creación y que serán liberados cuando el NFT sea destruido.

Immutable_data y mutable_data se definen como objetos del tipo [ATTRIBUTE_MAP](https://github.com/pinknetworkx/atomicassets-contract/wiki/Custom-Types#attribute_map), ya visto en anteriores documentos.

Podemos consultar la tabla “config” del smart contract atomicassets para comprobar qué tokens están actualmente autorizados para asociar con los NFTs ya que no todos están permitidos.

![AtomicAsssets config](/assets/images/tutorials/howto_atomicassets/atomicassets_supportedtokens.png)

::: tip 📝 Nota
Si necesita asociar otro tipo de tokens a un NFT, o incluso otros NFTs, puede utilizar utilidades de terceros, como Blenderizer V.2
:::

A continuación vamos a crear un NFT “Player” desde la plantilla que hemos creado en el documento anterior. En la declaración del esquema incluimos varios campos que no fueron utilizados por la plantilla; points, life y shield, y es que estos datos irán variando en el tiempo, por lo que serán datos mutables.

Veamos la preparación de los datos para crear el NFT:

```js
const authorized_minter = "arpegiator21";
const collection_name = "arpecol11111";
const schema_name = "player";
const template_id = 447413;
const new_asset_owner = "arpegiator21";
const immutable_data = [];
const mutable_data = [
  {
    key: "points",
    value: ["uint32", 0],
  },
  {
    key: "life",
    value: ["uint16", 100],
  },
  {
    key: "shield",
    value: ["uint16", 20],
  },
];
const tokens_to_back = [];

(async () => {
  const result = await mintAsset(
    authorized_minter,
    collection_name,
    schema_name,
    template_id,
    new_asset_owner,
    immutable_data,
    mutable_data,
    tokens_to_back
  );
  console.log(result);
})();
```

Y la llamada a la acción:

```js
/**
 * Mint new asset
 */
const mintAsset = async (
  authorized_minter,
  collection_name,
  schema_name,
  template_id,
  new_asset_owner,
  immutable_data,
  mutable_data,
  tokens_to_back
) => {
  try {
    const result = await apiRpc.transact(
      {
        actions: [
          {
            account: "atomicassets",
            name: "mintasset",
            authorization: [
              {
                actor: authorized_minter,
                permission: "active",
              },
            ],
            data: {
              authorized_minter: authorized_minter,
              collection_name: collection_name,
              schema_name: schema_name,
              template_id: template_id,
              new_asset_owner: new_asset_owner,
              immutable_data: immutable_data,
              mutable_data: mutable_data,
              tokens_to_back: tokens_to_back,
            },
          },
        ],
      },
      TAPOS
    );
    return result;
  } catch (error) {
    console.log(error);
  }
};
```

De nuevo, si rastreamos la ID de la transacción realizada, podremos obtener el ID del nuevo NFT

![AtomicAsssets transfer traces](/assets/images/tutorials/howto_atomicassets/atomicassets_tracesmintasset.png)

Y si acudimos a un explorador de NFTs, como el market de AtomicHub, podremos ver nuestro NFT.

![AtomicAsssets new NFT](/assets/images/tutorials/howto_atomicassets/atomicasset_mintasset.png)

## ¿Cómo es el NFT que hemos creado?


Podemos acceder a la tabla de colecciones del smart contract atomicassets para comprobarlo (indicar nombre de colección en el filtro de búsqueda):

![AtomicAsssets mintasset](/assets/images/tutorials/howto_atomicassets/aa_coltable.png)

También podemos acceder a la tabla de esquemas para ver el esquema que hemos creado (esta vez utilizaremos el nombre de la colección para establecer el scope de la búsqueda):

![AtomicAsssets mintasset](/assets/images/tutorials/howto_atomicassets/aa_schematable.png)

Podemos ver la estructura de la plantilla consultando la tabla "templates"

![AtomicAsssets mintasset](/assets/images/tutorials/howto_atomicassets/aa_templatetable.png)

Consultando la tabla "asset" y filtrando por nombre de propietario y ID del NFT obtenemos los datos del propio NFT.

![AtomicAsssets mintasset](/assets/images/tutorials/howto_atomicassets/aa_assettable.png)

Si nos fijamos, parte de la información está serializada para ahorrar RAM, lo que hace complicado verificar la información de las tablas. Pink Network ha desarrollado un [servicio API](https://github.com/pinknetworkx/eosio-contract-api) para facilitar las consultas a la base de datos de los NFTs. Algunos gremios de WAX ofrecen réplicas redundantes de ese servicio para facilitar su acceso y disponibilidad. Si hacemos uso de uno de esos API, por ejemplo, el que mantiene 3DK Render en testnet, el gremio que comparte este tutorial, para acceder a la información del NFT podremos obtener algo como esto (según el NFT creado en nuestro ejercicio):

URL de solicitud (para el NFT con el ID 1099532298240):
```
https://testatomic.3dkrender.com/atomicassets/v1/assets/1099532298240
```
Resultado de la consulta:
```json
{
  "success": true,
  "data": {
    "contract": "atomicassets",
    "asset_id": "1099532298240",
    "owner": "arpegiator21",
    "is_transferable": true,
    "is_burnable": true,
    "collection": {
      "collection_name": "arpecol11111",
      "name": "My Great Collection",
      "img": "QmRVwNbe8wZyjeV37igQsuEfMktJvRv2hkSHqyaaLmfFSi",
      "author": "arpegiator21",
      "allow_notify": true,
      "authorized_accounts": [
        "blenderizerx",
        "nftpacker3dk",
        "atomicdropsx",
        "arpegiator22",
        "arpegiator25",
        "arpegiator21"
      ],
      "notify_accounts": ["nftpacker3dk", "arpegiator25"],
      "market_fee": 0.08,
      "created_at_block": "146914266",
      "created_at_time": "1649330195000"
    },
    "schema": {
      "schema_name": "player",
      "format": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "class",
          "type": "string"
        },
        {
          "name": "points",
          "type": "uint32"
        },
        {
          "name": "life",
          "type": "uint16"
        },
        {
          "name": "lifepoints",
          "type": "uint16"
        },
        {
          "name": "shield",
          "type": "uint16"
        },
        {
          "name": "shieldpoints",
          "type": "uint16"
        },
        {
          "name": "img",
          "type": "ipfs"
        }
      ],
      "created_at_block": "153820765",
      "created_at_time": "1652784024500"
    },
    "template": {
      "template_id": "447413",
      "max_supply": "0",
      "is_transferable": true,
      "is_burnable": true,
      "issued_supply": "1",
      "immutable_data": {
        "img": "QmaNCMQ3mD1ZxVPhac6vEUY2pidxwMQC2u6sNwuurweeJ5",
        "name": "Player A",
        "class": "Warrior"
      },
      "created_at_time": "1653761028000",
      "created_at_block": "155774695"
    },
    "mutable_data": {
      "life": 100,
      "points": 0,
      "shield": 20
    },
    "immutable_data": {},
    "template_mint": "1",
    "backed_tokens": [],
    "burned_by_account": null,
    "burned_at_block": null,
    "burned_at_time": null,
    "updated_at_block": "155774752",
    "updated_at_time": "1653761056500",
    "transferred_at_block": "155774752",
    "transferred_at_time": "1653761056500",
    "minted_at_block": "155774752",
    "minted_at_time": "1653761056500",
    "data": {
      "life": 100,
      "points": 0,
      "shield": 20,
      "img": "QmaNCMQ3mD1ZxVPhac6vEUY2pidxwMQC2u6sNwuurweeJ5",
      "name": "Player A",
      "class": "Warrior"
    },
    "name": "Player A"
  },
  "query_time": 1654083999042
}
```
Como hemos visto ya, la información referente a la colección está definida en un registro de la tabla de colecciones, la información que se repetirá en las copias del mismo tipo de NFT estará en definida en la plantilla y el tipo de datos que podrá albergar estará en el esquema. Al no tener que repetir toda esa información en cada copia del NFT se consigue ahorrar RAM.
