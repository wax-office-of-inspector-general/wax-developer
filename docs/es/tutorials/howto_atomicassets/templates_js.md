---
title: Administrar plantillas AtomicAssets desde javaScript
nav_order: 36
layout: default
parent: How-To AtomicAssets
grand_parent: Tutoriales
has_children: false
lang-ref: Managing AtomicAssets templates from javaScript
lang: es
---

Sin tenemos que acuñar múltiples copias de un mismo asset como, por ejemplo, una espada que se obtiene de recompensa en una misión, nos vendrá bien hacerlo con una plantilla. Gracias a la plantilla estaremos ahorrando memoria RAM, agilizaremos el trabajo y mantendremos una coherencia en la colección completa.

AtomicAssets dispone de dos acciones para gestionar las plantillas:
- createtempl: Crear unaplantilla.
- locktemplate: Bloquear la plantilla para evitar que se acuñen más copias de las existentes.

## Crear una plantilla

Al crear una plantilla haremos uso de los tipos de datos declarados en el esquema al que pertenecerá la plantilla y asignaremos valores a esos atributos. De esta forma, cada vez que acuñemos un nuevo NFT desde la plantilla no necesitaremos repetir esa información; está contenida en la plantilla.

![AtomicAsssets createschema](/assets/img/tutorials/howto_atomicassets/createtempl_atomicassets.png)

- authorized_crator: Cuenta autorizada por la colección para realizar la acción
- collection_name: Nombre de la colección
- schema_name: Nombre del esquema (debe existir)
- transferable: (True/False) Indica si el NFT podrá ser transferido
- burnable: (True/False) Indica si el NFT podrá destruírse (Burn)
- max_supply: Número máximo de impresiones permitidas. Si es 0 se supone infinito.
- immutable_data: Array de información inmutable que se incluirá en todas las copias creadas con esta plantilla.

Los datos inmutables deben definirse en un mapa del tipo [ATTRIBUTE_MAP](https://github.com/pinknetworkx/atomicassets-contract/wiki/Custom-Types#attribute_map) compuesto por pares de claves y valores.

Un NFT AtomicAssets también puede contener datos modificables (mutable data). Esto lo veremos más adelante ya que no se deben especificar durante la creación de la plantilla.
{: .label .label-yellow }

Veamos cómo podemos crear una plantilla para acuñar copias de un personaje llamado "Player A" en nuestro juego:

```js
// Collection creator
const auth = 'arpegiator21';

// Collection name (eosio name format)
const colName = 'arpecol11111';

// Schema name
const schemaName = 'player';

// Burnable and transferable
const burnable = true,
      transferable = true;

// Infinite supply
const maxSuply = 0;

// Collection description
const immutableData = [
    {
        key: "name",
        value: ["string", "Player A"],
    },
    {
        key: "img",
        value: ["string", "QmaNCMQ3mD1ZxVPhac6vEUY2pidxwMQC2u6sNwuurweeJ5"],
    },
    {
        key: "class",
        value: ["string", "Warrior"],
    }
];

// Create schema
(async()=> {
    const result = await createTempl(auth, colName, schemaName, transferable, burnable, maxSuply, immutableData);
    console.log(result);
})();
``` 
**Nota**: los datos tipo "ipfs" e "image" son tratados como "string"
{: .label .label-yellow }

Y la llamada a la acción
```js
/* 
 * Create a template
*/
const createTempl = async (
  auth,
  colName,
  schemaName,
  transferable,
  burnable,
  maxSupply,
  immutableData
) => {
  try {
    const result = await apiRpc.transact(
      {
        actions: [
          {
            account: "atomicassets",
            name: "createtempl",
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
              transferable: transferable,
              burnable: burnable,
              max_supply: maxSupply,
              immutable_data: immutableData
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
Una vez ejecutada la acción, y si no hay problemas, obtendremos como retorno la información de la transacción. Podemos recoger la ID de la transacción para analizar la respuesta por parte del smart contract de AtomicAssets

![AtomicAsssets createschema](/assets/img/tutorials/howto_atomicassets/transaction_id.png)

Si analizamos la transacción en un explorador podremos comprobar que el smart contract contestó con otra acción: "lognewtempl". En esta acción se incluye un dato que nos será de vital importancia: el ID de la plantilla recién creada

![AtomicAsssets createschema](/assets/img/tutorials/howto_atomicassets/template_id_traces.png)

También podemos acudir a la web del market de Atomic (AtomicHub) y comprobar las plantillas creadas por la colección:

![AtomicAsssets createschema](/assets/img/tutorials/howto_atomicassets/template_view.png)

## Bloquear una plantilla

Tanto si una plantilla ha sido configurada con un límite de impresiones o hasta el infinito puede que deseemos bloquear una plantilla para evitar nuevas impresiones. Por ejemplo, podemos acuñar NFTs durante un evento de 3 días desde una plantilla infinita y, finalizado el plazo, bloquear la plantilla. El max supply sería el total de NFTs acuñados hasta el momento.

**Nota**: No es posible bloquear una plantilla si no tiene creado, al menos, 1 NFT.
{: .label .label-yellow }

Para eso AtomicAssets disponde de la acción "*locktemplate*"

![AtomicAsssets createschema](/assets/img/tutorials/howto_atomicassets/locktemplate_atomicassets.png)

- athorized_editor: Nombre de cuenta autorizada por la colección. Debe ser quien firma la transacción.
- collection_name: Nombre de la colección.
- template_id: ID de la plantilla a bloquear.

Se trata de una llamada a la acción con parámetros sencillos por lo que pasaremos directamente a ver cómo sería esa llamada de ejemplo:

```js
/* 
 * Extend a schema with new data types
 */
const lockTemplate = async ( 
  auth,
  colName,
  templateID
) => {
  try {
    const result = await apiRpc.transact(
      {
        actions: [
          {
            account: "atomicassets",
            name: "locktemplate",
            authorization: [
              {
                actor: auth,
                permission: "active",
              },
            ],
            data: {
              authorized_editor: auth,
              collection_name: colName,
              template_id: templateID
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

**Nota**: Esta acción es irreversible.
{: .label .label-yellow }
