---
title: Estructura de una colección
order: 32
---

# Estructura de una colección

Un NFT puede ser único, como una obra de arte exclusiva, o puede formar parte de una serie, como las cartas de juego, donde lo único que cambia en los activos de una misma edición es el orden en que han sido acuñados. Para este último caso, AtomicAssets ofrece la posibilidad de configurar una "plantilla" para poder emitir más copias de los activos cada vez que necesitemos más unidades, de forma infinita o hasta llegar a una cantidad previamente establecida, como veremos. Por ejemplo, podríamos tener una plantilla para el objeto de juego "Silent Sword of Oblivion", con todos sus atributos ya definidos: la imagen, su nombre, su descripción, etc.

Pero como tendremos otros tipos de assets en el juego, podemos crear diferentes plantillas cuya estructura será idéntica pero no su contenido. Esta estructura se puede definir en lo que AtomicAssets llama "esquemas". Los esquemas definen qué tipo de datos contendrán las plantillas que generemos a partir de ellos.

Tal vez nuestro juego, o colección, tenga activos que queramos diferenciar entre sí, como cartas de personaje, cartas de hechizo, cartas de habilidad, cartas de arma y cartas de armadura, por lo que cada una de esas categorías se definirá en su propio esquema y, todas juntas, formarán lo que AtomicAssets llama "colección", que servirá para definir un nombre y una descripción para todo el conjunto, además de servir como contenedor general para todos los activos creados bajo él.

En resumen, AtomicAssets organiza el conjunto de colección en diferentes niveles de subconjuntos:

Colección -> Esqemas -> Plantillas -> NFTs

![AtomicAssests Collection Schema](/assets/images/tutorials/howto_atomicassets/atomicassets_scheme.jpg)

## Colección

Una colección se define con la siguiente información:
- Nombre de colección.
- Autor o propietario.
- Descripción y datos de identificación.
- Lista de cuentas autorizadas.
- Lista de cuentas que recibirán notificaciones.
- Tasa por regalías por comercio en markets.

La descripción y datos de identificación se introducen según la siguiente estructura:
```
[ 
	{ "name": "name","type": "string" }, 
	{ "name": "img", "type": "ipfs" }, 
	{ "name": "description", "type": "string" }, 
	{ "name": "url", "type": "string" }, 
	{ "name": "images", "type": "string" }, 
	{ "name": "socials", "type": "string" }, 
	{ "name": "creator_info", "type": "string" } 
]
```
Si creamos la colección desde un interface como [https://wax.bloks.io](https://wax.bloks.io/account/atomicassets?loadContract=true&tab=Actions&account=atomicassets&scope=atomicassets&limit=100&action=createcol) tendremos que cumplimentar esta entrada de datos:

![AtomicAssets - createcol action](/assets/images/tutorials/howto_atomicassets/createcol_atomicassets.png)

A continuación se muestra un ejemplo de la información aceptada en el campo "*data*" 

```
data:
	{"key":"name","value":["string","mycollection"]}
	{"key":"img","value":["string","QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"]}
	{"key":"description","value":["string","This is a collection created for testing"]}
	{"key":"url","value":["string","https://mysite.io"]}
	{"key":"socials","value":["string","{
						\"twitter\":\"mytwitter\",
						\"facebook\":\"myfacebook\",
						\"medium\":\"mymedium\",
						\"github\":\"mygithub\",
						\"telegram\":\"mytelegram\",
						\"youtube\":\"myyoutube\",
						\"discord\":\"\mydiscord"}"]}
	{"key":"creator_info","value":["string","{
						\"address\":\"\",
						\"company\":\"\",
						\"name\":\"\",
						\"registration_number\":\"\"}"]}
	{"key":"images","value":["string","{\
						"banner_1920x500\":\"QmQtXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\",
						\"logo_512x512\":\"\"}"]}
```

## Esquema

El esquema cumple con dos funciones fundamentalmete; agrupar los NFTs de la colección según ciertos atributos comunes y declarar los tipos de datos que podremos utilizar a la hora de crear los NFTs.

A la hora de declarar la estructura de datos utilizaremos vectores de [FORMAT](https://github.com/pinknetworkx/atomicassets-contract/wiki/Custom-Types#format); tuplas formadas por un nombre y un tipo de datos.

Una vez creado un esquema de datos es posble añadir más datos al mismo pero ya no pueden borrarse o modificarse los existentes (tampoco es obligatorio emplear en las plantillas todos los datos declarados).

## Plantilla

La plantilla es el molde con el que acuñaremos todos los assets de un mismo tipo. En la plantilla es donde se declara la información que estará disponible en un NFT como el nombre, la URL de la imágen (preferiblemente IPFS), la descripción, etc. Gracias a esto no es necesario repetir la información una y otra vez en cada NFT acuñado. Para conocer el nombre, la descripción o cualquier otro campo de un NFT solo es necesario acceder al contenido de ese atributo declarado en la plantilla.

::: tip 📝 Nota
Los datos inmutables se almacenan en la plantilla pero los datos mutables, propios de cada unidad NFT, se almacenan en el mismo NFT al que pertenecen por lo que, en caso de existir, aumentarán la memoria RAM consumida. 
:::