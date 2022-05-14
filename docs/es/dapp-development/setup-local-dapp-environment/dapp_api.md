---
title: Acceder a tu API local
layout: default
nav_order: 42
parent: Set Up a Local dApp Environment
grand_parent: dApp Development
lang-ref: Access Your Local API
lang: es
---

La mainnet de WAX expone un conjunto de endpoints de la API de **nodeos** (API RPC), que permiten interactuar con la Blockchain de WAX. En producción, se accede a esta API desde `https://chain.wax.io`.

Ahora que tienes un nodo local ejecutándose en tu servidor de desarrollo local, se puede acceder a estos endpoints desde tu dirección IP local: `http://127.0.0.1:8888`. Este endpoint de la API se inicializa cuando se pasa el parámetro `plugin eosio::chain_api_plugin` a **nodeos**.

Para probar tu API RPC local, desde la línea de comandos, haz una petición **curl** al endpoint `get_info`:

```
curl --request POST \
  --url http://127.0.0.1:8888/v1/chain/get_info \
  --header 'content-type: application/x-www-form-urlencoded; charset=UTF-8'
```

Deberías recibir la siguiente respuesta en JSON:

```
{
   "server_version":"448287d5",
   "chain_id":"cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
   "head_block_num":1937,
   "last_irreversible_block_num":1936,
   "last_irreversible_block_id":"000007905e94a4406ef34a227cf815154ac6886bf54deaa2d35db606cb4b667d",
   "head_block_id":"00000791a899e1751e60a13b77817f7243496cdd68010cd84505023200fd9e8a",
   "head_block_time":"2019-07-16T21:43:19.500",
   "head_block_producer":"eosio",
   "virtual_block_cpu_limit":1384557,
   "virtual_block_net_limit":7271761,
   "block_cpu_limit":199900,
   "block_net_limit":1048576,
   "server_version_string":"v1.7.3"
}
```

<strong>Consejo:</strong> Fíjate en el parámetro "head_block_producer": "eosio". En el entorno local, <strong>eosio</strong> es la cuenta del sistema. Si haces una petición a la API de la mainnet de WAX, esta devolverá un productor de bloques real (por ejemplo, "head_block_producer": "strongblock1").
{: .label .label-yellow }

**Nodeos** debe estar ejecutándose para poder llamar a este endpoint. Si no es así, recibirás el siguiente mensaje:

```
curl: (7) Failed to connect to 127.0.0.1 port 8888: Connection refused
```

## Información adicional

Para más información, dirígete a la guía [API RPC de WAX](/es/api-reference/rpc_api).
