---
title: Prueba Tu Contrato Inteligente NFT
order: 91
---

# Prueba Tu Contrato Inteligente NFT

Ahora que has desplegado tu contrato inteligente NFT de WAX, es hora de ejecutar una acción de prueba y crear tu primer NFT.

## Crear un NFT de WAX

Desde la línea de comandos, usa el comando `cleos push action` para llamar a la acción **createnft**.

```shell
cleos -u [chain-api-url] push action waxnftowner1 createnft [] -p waxnftowner1@active
```

La consola imprime los detalles de la transacción:

```shell
executed transaction: 093e5a806fb4e89cc1d4db8ff59609fca6b0fb7074cd9374b45bcd4d823035a0  136 bytes  727 us
#  waxnftowner1 <= waxnftowner1::createnft      ""
#  simpleassets <= simpleassets::create         {"author":"waxnftowner1","category":"sticker","owner":"waxnftowner1","idata":"{\"name\": \"WAX Devel...
#  waxnftowner1 <= simpleassets::create         {"author":"waxnftowner1","category":"sticker","owner":"waxnftowner1","idata":"{\"name\": \"WAX Devel...
#  simpleassets <= simpleassets::createlog      {"author":"waxnftowner1","category":"sticker","owner":"waxnftowner1","idata":"{\"name\": \"WAX Devel...
warning: transaction executed locally, but may not be confirmed by the network yet         ]
```

## Verifica Tu NFT de WAX

Puedes localizar los NFTs de WAX en la tabla **sassets**, bajo el ámbito del propietario del NFT. Para mostrar tus registros de NFT, usa el comando `cleos get table`.

```json
cleos -u [chain-api-url] get table simpleassets waxnftowner1 sassets  
```

La consola imprime tus NFTs, incluyendo el **id** único del activo:

```json
{
  "rows": [{
      "id": "100000000000035",
      "owner": "waxnftowner1",
      "author": "waxnftowner1",
      "category": "sticker",
      "idata": "{\"name\": \"Colmena de Desarrolladores de WAX\", \"desc\": \"Pegatina de la Colmena de Desarrolladores de WAX\" }",
      "mdata": "{\"color\": \"negro\", \"img\": \"https://developer.wax.io/images/wax_sticker.png\" }",
      "container": [],
      "containerf": []
    }
  ],
  "more": false
}     
```

## Más Información

Consulta el <a href="https://github.com/CryptoLions/SimpleAssets" target="_blank">Repositorio de GitHub</a> de Simple Assets para acciones de contrato adicionales, estructuras de datos y ejemplos.
