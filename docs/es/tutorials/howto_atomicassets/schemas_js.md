---
title: Administrando esquemas de AtomicAssets desde JavaScript
nav_order: 36
layout: default
parent: How-To AtomicAssets
grand_parent: Tutoriales
has_children: false
lang-ref: Managing AtomicAssets schemas from javaScript
lang: es-ES
---

Como hemos comentado, los esquemas nos permiten declarar las características comunes de los NFTs de nuestra colección y poder crear grupos. Si estamos creando NFTs para un juego que tiene varios personajes, cada uno de ellos será único, pero compartirá atributos con el resto de personajes. Todos los personajes tendrán un nombre, una puntuación, un nivel de puntos de vida, etc. 

Igualmente, nuestro juego tendrá armas y todas compartirán unos atributos como el nombre, el valor de puntos de daño, los puntos de durabilidad, etc.

Haciendo uso de los esquemas podremos crear grupos que nos facilite la clasificación y posterior manipulación de cada uno de los NFTs de nuestra colección.

AtomicAssets incorpora las siguientes acciones para gestionar los esquemas:
-	createschema: Crear el esquema y declarar los tipos de datos que lo componen
-	extendschema: Añadir más tipos de datos a un esquema ya existente

## Crear un esquema

![AtomicAsssets createschema](/assets/img/tutorials/howto_atomicassets/createschema_atomicassets.png)

- authorized_creator: Nombre de una cuenta autorizada para manipular la colección. La acción deberá estar firmada por esta cuenta.
- collection_name: Nombre de la colección que estamos administrando.
- schema_name: Nombre que asignamos al esquema.
- schema_format: Array de tipos [FORMAT](https://github.com/pinknetworkx/atomicassets-contract/wiki/Custom-Types#format) que declaran la estructura del esquema.

Crearemos un esquepa para las cartas de jugador con los siguientes atributos:
- Nombre: string
- Clase: string
- Puntos: uint32
- Vida: uint16
- Puntos de vida: uint16

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
Y llamada a la acción:
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

## Extender un esquema

Después de crear el esquema nos damos cuenta de que un personaje en el juego estará expuesto a peligros por lo que debería de ir protegido por una armadura. No podemos modificar los atributos que ya existen en un esquema, pero podemos añadir atributos nuevos con la acción "*extendschema*"

![AtomicAsssets createschema](/assets/img/tutorials/howto_atomicassets/extendschema_atomicassets.png)

Estos son los nuevos datos que añadiremos al esquema:
- Armadura: uint16
- Puntos de armadura: uint16

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
Y llamada a la acción:
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

