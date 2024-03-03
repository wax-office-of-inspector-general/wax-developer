---
title: Modificación de datos mutables para AA
order: 44
---

# Modificación de datos mutables para AA

## Datos mutables vs. datos inmutables <a name="p1"></a>

¿Qué hace que un NFT sea un valor digital? Es su capacidad para almacenar datos inalterables durante toda su existencia y su permanencia en un sistema descentralizado, como lo es una blockchain. Gracias a la permanencia de sus datos inmutables, es posible usar NFTs como registros únicos y no falsificables de propiedad o autoría, lo cual es muy apreciado por los creadores digitales que luchan contra la piratería -contra el uso ilegítimo de su trabajo, para ser más específicos.

Sin embargo, los NFTs se han convertido en una característica popular de la industria del juego, ya que permiten a los jugadores ser los verdaderos dueños de los activos que adquieren en el juego, y almacenarlos o comerciarlos incluso fuera del juego. Hablamos, por ejemplo, de coleccionistas de cartas, que aún hacen uso de cartas de juegos olvidados hace décadas. Esto no se podría lograr en juegos de cartas digitales anteriores que buscaban reemplazar los juegos de cartas físicos tradicionales, ya que cuando el juego desaparecía, sus cartas desaparecían con él. Hoy en día, gracias a los NFTs, es posible conservar tales cartas como si fueran parte de un juego de cartas tradicional. Hay quienes creen que esto no es comparable al sistema tradicional, pero debemos ser conscientes de que las generaciones más jóvenes son digitales: la gran mayoría del contenido de entretenimiento que consumen es digital. Por lo tanto, valoran el contenido digital tanto como nuestros mayores valoran lo material.

Pero hay más que almacenar datos inmutables para que un NFT sea completamente útil en un juego. De hecho, esto es contraproducente, ya que el activo -que puede ser una carta, una pieza de armadura o un arma- probablemente deba ser mejorado después de un período de tiempo, para distinguirse de otros activos, y por lo tanto volverse más valioso. Esto no sería posible sin datos mutables.

Técnicamente hablando, no hay diferencia entre datos mutables e inmutables en un NFT: ambos son datos de información registrados en el lugar que el NFT ocupa en un contrato inteligente. La diferencia radica en la lógica de programación del contrato inteligente, que permite que los datos mutables se modifiquen, mientras que prohíbe modificar datos inmutables.

Es cierto que el contrato inteligente puede ser modificado para evitar esto, pero esto lo haría dudoso y lo volvería inútil.

AtomicAssets es el contrato inteligente más popular de la Blockchain de WAX -así como de otras Blockchains de Antelope- y está extremadamente bien diseñado para ser usado en videojuegos, teniendo tanto datos mutables como inmutables. Ahora aprenderemos cómo modificar estos datos.

Aquí podemos ver un ejemplo de un NFT -de un juego de cartas- con datos inmutables a la izquierda y datos mutables a la derecha. En este caso podemos ver que el nivel de la carta (Lvl) puede subir, como sus atributos de “fuerza”, “escudo”, “botín” y otros pueden.

![AtomicAssets mintasset](/assets/images/tutorials/howto_atomicassets/mutabledata_aa.png)

Veamos ahora cómo modificarlos.

## ATTRIBUTE_MAP <a name="p2"></a>

Antes de entrar en la modificación de un campo mutable en JavaScript, es importante conocer el objeto ATTRIBUTE_MAP. Una de las ventajas del estándar AtomicAssets es el uso de serialización para ahorrar RAM en las tablas que almacenan los datos de los NFTs. Para esto usamos un mapa de datos que empareja el tipo de datos con su contenido, permitiendo así que sea serializado.

El formato de este mapa se construye siguiendo este patrón:
```json
[{"key": MYKEY, value: MY

VALUE}, ...]
```
En la plantilla de un NFT se define cuál es el dato mutable y cuál el dato inmutable, y se especifica el nombre del campo y el tipo de dato que contendrá. Por lo tanto, podemos tener el campo de tipo string "name", o el campo de tipo int(16bits) "speed".

Entonces, si deseáramos crear un mapa de datos para especificar esta información:
```json
{ 
    name: “Delorean”, 
    speed: 300 
}
```
Deberíamos crear un arreglo de objetos manteniendo sus especificaciones de la plantilla:
```json
[{
	“key”: “name”,
	“value”: [“string”, “Delorean”]
}, {
	“key”: “speed”,
	“value”: [“uint16”, 300]
}]
```
Veamos ahora cómo hacer esto en JavaScript.

## Escribir datos mutables en un NFT en JavaScript <a name="p3"></a>

Para este ejemplo necesitamos llamar a la acción "setassetdata" del contrato inteligente de AtomicAssets. Esta acción requiere de cuatro parámetros:

![AtomicAssets mintasset](/assets/images/tutorials/howto_atomicassets/setassets_aa.png)

- **authorized_editor**: el nombre de la cuenta que debe estar autorizada para acceder a la colección a la que pertenece el NFT.
- **asset_owner**: el nombre de la cuenta perteneciente al actual propietario del activo -no es necesario ser el propietario del activo para modificar sus datos mutables; solo necesitas estar autorizado para hacerlo, o ser su creador.
- **asset_id**: el número de ID del NFT que queremos modificar.
- **new_mutable_data**: una estructura similar al ATTRIBUTE_MAP que contiene los datos que queremos modificar, como vimos antes.

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
## Modificar datos mutables en JavaScript <a name="p4"></a>

Hemos visto cómo introducir datos mutables en un NFT, pero a veces necesitaremos actualizar su contenido, como por ejemplo, agregar una cantidad de puntos a su puntuación actual.

Obviamente, primero necesitaremos leer el contenido del campo, pero debemos tener en cuenta que los datos están serializados, como mencionamos anteriormente. Si usamos la biblioteca eosjs, tendremos que deserializar la información primero. Afortunadamente, el equipo de Pink Network, creadores del estándar AtomicAssets, también creó una biblioteca de JavaScript para que podamos acceder a todas las colecciones, esquemas, plantillas y, por supuesto, NFTs, de una manera mucho más fácil.

https://www.npmjs.com/package/atomicassets

Como la biblioteca eosjs requiere estar conectada a una API de Full Story de la Blockchain de WAX, la biblioteca AtomicAssets necesita estar conectada a una API Atómica específica. Varios productores de bloques de WAX ofrecen este servicio, afortunadamente, y es gratuito para los usuarios de la Blockchain de WAX.

<strong>Nota:</strong> Si estás desarrollando una aplicación para uso público es conveniente tener tus propias APIs y no depender de la disponibilidad de APIs públicas.
:::

En este ejemplo vemos cómo conectarnos a una API Atómica para leer un NFT, basado en su ID, y cómo obtener el contenido de uno de sus datos.
```js
const { ExplorerApi } = require("atomicassets");
const api = new ExplorerApi(
    ATOMIC_API, 
    "atomicassets", 
    { fetch });

const asset = await api.getAsset(asset_id);
let player_points = asset.mutable_data.player

_points;
player_points += 100;
```
Debes cambiar **ATOMIC_API** por una URL válida de API Atómica. Puedes obtener una lista de ellas en https://tools.ledgerwise.io

Una vez que hemos leído, solo queda actualizar la información con los valores deseados y guardarla en el NFT, como vimos en el paso anterior.

## Escribir los datos mutables de un NFT de AtomicAssets en un contrato inteligente <a name="p5"></a>

Operar con NFTs de AtomicAssets desde nuestro contrato inteligente requiere que incluyamos algunos elementos del contrato inteligente "atomicassets" en nuestro código, para que podamos reutilizar ciertas definiciones y declaraciones de funciones y datos. Específicamente necesitaremos estos archivos:
```
atomicassets.hpp
atomicdata.hpp
base58.hpp
```
Que podemos obtener del GitHub de Pink Network:
(https://github.com/pinknetworkx/atomicassets-contract/tree/master/include)

Nuestro primer paso es declarar un elemento del tipo ATTRIBUTE_MAP:
```c
atomicassets::ATTRIBUTE_MAP mdata = {};
```
Ahora podemos comenzar a agregar datos:
```c
mdata[“name”] = string(“Delorean”);
mdata[“speed”] = uint16_t(300);
```
O, si recibimos los datos como parámetros en una función -ver el ejemplo de JavaScript:
```c
mdata[“name”] = name;
mdata[“speed”] = speed;
```
Y todo lo que queda por hacer es llamar a la acción del contrato inteligente de "atomicassets" para realizar la operación:
```c
action(
    permission_level{name(“authorized”), name("active")},
    name(“atomicassets”),
    name("setassetdata"),
    make_tuple(name(“authorized”), name(“owner”), asset_id, mdata))
    .send();
```
## Modificar datos mutables desde el contrato inteligente <a name="p6"></a>

Aunque similar al ejemplo de modificación de datos mutables en JavaScript, en este caso necesitaremos deserializar los datos. Afortunadamente, Pink Network facilitará nuestro trabajo nuevamente -esta es la razón por la que importamos los archivos "atomicdata" y "base58" durante el paso anterior.

Primero que todo necesitamos localizar el NFT accediendo a la tabla de activos propiedad del dueño actual. Por eso es importante saber quién tiene el NFT en su billetera, ya que será el ámbito de la tabla de datos de los activos de AtomicAssets.

La información que necesitamos para serializar y deserializar los datos -nombres de los ítems y tipos de datos- se almacena en el esquema de la colección, por lo que necesitamos acceder también a la información del esquema al que pertenece el NFT.
```c
// Leer los activos del propietario
atomicassets::assets_t listAssets = atomicassets::get_assets(owner);

// Buscar el NFT basado en su número de ID
auto idxCard = listAssets.find(asset_id);

// Acceder a la tabla de esquemas de la colección del activo
atomicassets::schemas_t collection_schemas = atomicassets::get_schemas(idxCard->collection_name);

// Obtener los esquemas del activo para aprender los tipos de datos
auto idxSchema = collection_schemas.find(idxCard->schema_name.value);

// Deserializar los datos
mdata = atomicdata::deserialize(
       idxCard->mutable_serialized_data,
       idxSchema->format);

// Acceder a los datos que deseamos modificar
uint32_t mdata_player_points = get<uint32_t>(mdata["player_points"]);

// Actualizar
mdata_player_points += player_points;
```
Una vez que se ha tomado los datos podemos modificar y almacenar como vimos en el ejemplo anterior. Solo necesitamos tener en cuenta que la función "deserialize" nos dará un elemento del tipo ATTRIBUTE_MAP, lo que nos permite usarlo directamente en la operación de escritura.
