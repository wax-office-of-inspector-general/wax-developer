---
title: Modificar datos mutables para NFTs de AA
nav_order: 44
layout: default
parent: How-To AtomicAssets
grand_parent: Tutoriales
has_children: false
lang-ref: Modifying mutable data for AA
lang: en
---
## Index

- [Mutable data vs. immutable data](#p1)
- [ATTRIBUTE_MAP](#p2)
- [Escribiendo datos mutables en un NFT desde JavaScript](#p3)
- [Modificar datos mutables en JavaScript](#p4)
- [Escribiendo datos mutables en un NFT dede un contrato inteligente](#p5)
- [Modificar datos mutables desde un contrato inteligente](#p6)


## Mutable data vs. immutable data <a name="p1"></a>

¿Qué hace que un NFT tenga valor digital? Es su capacidad para almacenar datos inmutables a lo largo de toda su existencia y su permanencia en un sistema descentralizado, como es una blockchain. Gracias a la permanencia de sus datos inmutables, es posible utilizar las NFT como registros de propiedad o autoría únicos y no falsificables, lo que es muy apreciado por los creadores digitales que luchan contra la piratería -contra el uso ilegítimo de su obra, para ser más concretos-.

Sin embargo, los NFT se han convertido en una característica popular de la industria del juego, ya que permiten a los jugadores convertirse en los verdaderos propietarios de los activos que adquieren en el juego, y almacenarlos o comerciar con ellos incluso fuera del juego. Hablamos, por ejemplo, de los coleccionistas de cartas, que siguen haciendo uso de cartas de juegos desaparecidos incluso hace décadas. Esto no se podía conseguir en los anteriores juegos de cartas digitales que pretendían sustituir a los juegos de cartas físicos tradicionales, ya que cuando el juego desaparecía, sus cartas desaparecían con él. Hoy en día, gracias a los NFT, es posible conservar dichas cartas como si formaran parte de un juego de cartas tradicional. Hay ciertas personas que creen que esto no es comparable al sistema tradicional, pero debemos ser conscientes de que las generaciones más jóvenes son digitales: la gran mayoría de los contenidos de entretenimiento que consumen son digitales. Por lo tanto, valoran el contenido digital tanto como nuestros mayores valoran el material.

Pero no basta con almacenar datos inmutables para que una NFT sea plenamente útil en un juego. De hecho, esto es contraproducente, ya que el activo -que puede representar una carta, una pieza de armadura o un arma- probablemente deba mejorarse al cabo de un tiempo, como parte de las mecánicas del juego, para distinguirse de otros activos y, por tanto, volverse más valioso. Esto no sería posible sin datos mutables.

Técnicamente hablando, no hay diferencia entre datos mutables e inmutables en un NFT: ambos son datos de información registrados en el lugar que ocupa el NFT en un contrato inteligente. La diferencia radica en la lógica de programación del contrato inteligente, que permite modificar los datos mutables, mientras que prohíbe modificar los datos inmutables.

AtomicAssets es el contrato inteligente más popular de WAX Blockchain -así como de otras Blockchains Antelope- y está muy bien diseñado para ser utilizado en videojuegos, por lo que tiene tanto datos mutables como inmutables. Ahora aprenderemos a modificar estos datos.

Aquí podemos ver un ejemplo de un NFT -de un juego de cartas- con datos inmutables a la izquierda y datos mutables a la derecha. En este caso podemos ver que el nivel de la carta (Lvl) puede subir, al igual que su "fuerza", "escudo", "botín" y otros atributos.

![AtomicAsssets mintasset](/assets/img/tutorials/howto_atomicassets/mutabledata_aa.png)

Veamos, entonces, cómo midificarlo

## ATTRIBUTE_MAP <a name="p2"></a>

Antes de entrar a modificar un campo mutable en JavaScript es importante conocer el objeto ATTRIBUTE_MAP. Una de las ventajas del estándar AtomicAssets es el uso de la serialización para ahorrar RAM en las tablas que almacenan los datos de los NFTs. Para ello se utiliza un mapa de datos que empareja el tipo de dato con su contenido, permitiendo así su serialización.

El formato de este mapa se construye siguiendo el siguiente patrón:
```json
[{"key": MYKEY, value: MYVALUE}, ...]
```
En la plantilla del NFT se define qué datos son mutables y cuáles inmutables, y se especifica el nombre del campo y el tipo de datos que contendrá. Así, podemos tener el campo de tipo cadena "name", o el campo de tipo int(16bits) "speed".

Así que si quisiéramos crear un mapa de datos para especificar esta información:
```json
{ 
    name: “Delorean”, 
    speed: 300 
}
```
Debemos crear un array de objetos manteniendo sus especificaciones de plantilla:
```json
[{
	“key”: “name”,
	“value”: [“string”, “Delorean”]
}, {
	“key”: “speed”,
	“value”: [“uint16”, 300]
}]
```
Veamos ahora cómo hacerlo en JavaScript.

## Escribiendo datos mutables en un NFT desde JavaScript <a name="p3"></a>

Para este proceso debemos llamar a la acción "setassetdata" del contrato inteligente "atomicassets". Esta acción requiere cuatro parámetros:

![AtomicAsssets mintasset](/assets/img/tutorials/howto_atomicassets/setassets_aa.png)

- **authorized_editor**: Nombre de la cuenta autorizada para gestionar la colección a la que pertenece el NFT.
- **asset_owner**: Actual propietario del NFT. El editor autorizado puede modificar los datos mutables de un NFT sin importar si el NFT está en su wallet o en la de otro usuario.
- **asset_id**: Identificador del NFT.
- **new_mutable_data**: Estructura similar a la vista en ATTRIBUTE_MAP que contiene los datos que queremos modificar.

Siguiendo el ejemplo anterior podríamos definir una función que reciba la información necesaria como parámetros y que llame al contrato inteligente de "atomicassets":

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

## Modificar datos mutables en JavaScript  <a name="p4"></a>

Hemos visto cómo introducir datos mutables en un NFT, pero a veces necesitaremos actualizar su contenido, como, por ejemplo, para actualizar el número de puntos a su puntuación real.

Obviamente, primero tendremos que leer el contenido del campo, pero debemos tener en cuenta que los datos están serializados, como hemos comentado antes. Si utilizamos la librería eosjs, tendremos que deserializar la información primero. Afortunadamente, el equipo de Pink Network, creadores del estándar AtomicAssets, también crearon una librería JavaScript para que podamos acceder a todas las colecciones, esquemas, plantillas y, por supuesto, NFTs, de una forma mucho más sencilla.

https://www.npmjs.com/package/atomicassets

Al igual que la librería eosjs requiere estar conectada a una API Full Story de WAX Blockchain, la librería AtomicAssets necesita estar conectada a una API Atomic específica. Hay varios productores de WAX Blockchain que ofrecen este servicio, afortunadamente, y de forma gratuita.

<strong>Nota:</strong> Si está desarrollando una aplicación para uso público es conveniente disponder de APIs propios y no depender de la disponibilidad de los APIs públicos.
{: .label .label-yellow }

En este ejemplo vemos cómo conectarse a una Atomic API para leer un NFT, basándonos en su ID, y cómo obtener uno de los contenidos de sus datos.

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

Debe cambiar **ATOMIC_API** por una URL válida de un API de Atomic. Puede consultar una lista de APIs públicos en https://tools.ledgerwise.io

Una vez leída, sólo queda actualizar la información con los valores deseados y guardarla en el NFT, como vimos en el paso anterior.

## Escribiendo datos mutables en un NFT dede un contrato inteligente <a name="p5"></a>

Operar con NFTs de AtomicAssets desde nuestro contrato inteligente requiere que incluyamos algunos elementos del contrato inteligente "atomicassets" en nuestro código, para que podamos reutilizar ciertas definiciones y declaraciones de funciones y datos. En concreto necesitaremos estos ficheros:

```
atomicassets.hpp
atomicdata.hpp
base58.hpp
```

Podemos obtenerlo del repositorio de Pink Network en GitHub:
(https://github.com/pinknetworkx/atomicassets-contract/tree/master/include)

En primer lugar declaramos el objeto ATTRIBUTE_MAP:

```c
atomicassets::ATTRIBUTE_MAP mdata = {};
```

Y comenzamos a añadir datos:

```c
mdata[“name”] = string(“Delorean”);
mdata[“speed”] = uint16_t(300);
```

O si los datos los recibimos como parámetros de la acción:

```c
mdata[“name”] = name;
mdata[“speed”] = speed;
```

Y solo queda llamar a la acción "setassetdata" del contrato inteligente "atomicassets" para guardar los cambios en el NFT.

```c
action(
    permission_level{name(“authorized”), name("active")},
    name(“atomicassets”),
    name("setassetdata"),
    make_tuple(name(“authorized”), name(“owner”), asset_id, mdata))
    .send();
```

## Modificar datos mutables desde un contrato inteligente <a name="p6"></a>

Aunque es similar al ejemplo de JavaScript de modificación de datos mutables, en este caso necesitaremos deserializar los datos. Tenemos la suerte de que Pink Network nos facilitará de nuevo el trabajo -esta es la razón por la que importamos los archivos "atomicdata" y "base58" durante el paso anterior.

En primer lugar, tenemos que localizar el NFT accediendo a la tabla de activos del propietario actual. Por eso es importante saber quién tiene el NFT en su cartera, ya que será el ámbito (scope) de la tabla de datos de los activos de AtomicAssets.

La información que necesitamos para serializar y deserializar los datos -nombres de elementos y tipos de datos- se almacena en el esquema de la colección, por lo que necesitamos acceder también a la información del esquema al que pertenece el NFT.

```c
// Obtener propietario del NFT
atomicassets::assets_t listAssets = atomicassets::get_assets(owner);

// Buscar el NFT por su ID
auto idxCard = listAssets.find(asset_id);

// Acceder a la tabla de esquemas de la colección
atomicassets::schemas_t collection_schemas = atomicassets::get_schemas(idxCard->collection_name);

// Leer el esquema del NFT para conocer su estructura
auto idxSchema = collection_schemas.find(idxCard->schema_name.value);

// Deserializar datos
mdata = atomicdata::deserialize(
       idxCard->mutable_serialized_data,
       idxSchema->format);

// Acceder a los datos que deseamos modificar
uint32_t mdata_player_points = get<uint32_t>(mdata["player_points"]);

// Actualizar datos
mdata_player_points += player_points;
```

Una vez tomados los datos podemos modificarlos y almacenarlos como vimos en el ejemplo anterior. Sólo tenemos que tener en cuenta que la función "deserialize" nos devolverá un elemento del tipo ATTRIBUTE_MAP, lo que nos permite utilizarlo directamente en la operación de escritura.