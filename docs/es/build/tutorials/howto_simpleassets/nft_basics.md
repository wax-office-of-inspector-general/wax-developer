---
title: Conceptos Básicos de Simple Assets
order: 88
---

# Conceptos Básicos de Simple Assets

El video de Simple Assets a continuación incluye todo lo que necesitas saber sobre las estructuras de datos y acciones de NFT. Consulta el <a href="https://github.com/CryptoLions/SimpleAssets" target="_blank">Repositorio de GitHub de Simple Assets</a> para obtener información detallada y actualizaciones del registro de cambios.
<br /><br />

[Tutorial de Simple Assets](https://www.youtube.com/watch?v=yNxNIVSRxG8)

## Estructuras de Datos

Puedes personalizar la forma en que tus NFTs se muestran en un mercado de WAX utilizando la estructura de datos `asset`. Una estructura de datos de asset incluye el autor del activo (el contrato inteligente que crea el activo), categoría (por ejemplo, arma, pegatina, nombre de tu juego o colección) y pares clave/valor de datos inmutables y mutables.

Los datos inmutables incluyen atributos del activo que no se pueden actualizar, y los datos mutables incluyen atributos que pueden cambiar durante la vida útil de un ítem. Por ejemplo, imagina que has diseñado un juego de carreras de coches que ofrece al ganador del Nivel 5 un nuevo motor de alto rendimiento.

Puede haber atributos asignados a este motor que nunca cambiarán, como el nombre del motor, fabricante y descripción. Por otro lado, a medida que el jugador continúa corriendo, otros atributos pueden cambiar como el desgaste del motor, actualizaciones de caballos de fuerza y kilometraje total.

### Estructura de Datos de Asset

```
name author = get_self();
name category = "racing"_n;
name owner = "waxnftowner1"_n;
std::string idata = R"json({"name": "Motor de Alto Rendimiento", "desc": "Serie YYZ, Bloque Pequeño, Pistones Forjados" })json";
std::string mdata = R"json({"millaje": 0, "caballos de fuerza": 500, "img": "https://tuenlacemotor.com" })json";
```
<br />
Consulta las <a href="https://github.com/CryptoLions/SimpleAssets#data-structures" target="_blank">Estructuras de Datos</a> de Simple Assets para más información.

## Acciones

Las acciones varían dependiendo de cuál cuenta de blockchain es la que llama a la acción.

Como el propietario de tu juego o mercado (autor), puedes:

* Crear activos y actualizar atributos mutables desde tu contrato inteligente.
* Opcionalmente, puedes incluir la bandera `requireClaim`. En el contrato inteligente de Simple Assets, la cuenta que inicializa una transferencia de activo (o la acción `create`) paga por la RAM requerida. Si la bandera `requireClaim` se establece en verdadero (1), esta bandera publica un activo para que el usuario designado lo tome. Este usuario designado de WAX paga por la RAM en su lugar.
* Quemar un activo, junto con un memo.

Los propietarios de activos pueden:

* Transferir sus activos a otro usuario de la cuenta de WAX.
* Reclamar activos que has publicado con la bandera `requireClaim`.
* Cancelar una oferta para transferir su activo a otra cuenta de WAX.
* Prestar y pedir prestados activos utilizando las acciones de delegar y anular delegación.

<br />
Consulta las <a href="https://github.com/CryptoLions/SimpleAssets#contract-actions" target="_blank">Acciones del Contrato</a> de Simple Assets para más información.

## Tablas

Hay cuatro tablas clave incluidas con el contrato inteligente de Simple Assets:

1. **sassets:** Esta tabla almacena información del activo (por ejemplo, categoría, datos inmutables, datos mutables).
2. **offers:** Esta tabla almacena información de transferencia de activos asociada con las acciones de oferta, reclamación y cancelación de oferta.
3. **authors:** Aquí puedes opcionalmente guardar información sobre ti y tus activos. Puedes incluir instrucciones sobre cómo interactuar con tus activos en los mercados y exploradores de activos de WAX, o cualquier otra información que te gustaría comunicar a dApps externas, sitios web y propietarios de activos.
4. **delegates:** Esta tabla almacena información asociada con pre

star y pedir prestados activos.

## Detalles del Contrato

Para descargar el archivo **simpleassets.abi** a tu directorio actual, usa el comando `cleos get code` desde tu sesión bash interactiva de Docker.

```shell
cleos -u [url-api-cadena] get code simpleassets -a simpleassets.abi
```
