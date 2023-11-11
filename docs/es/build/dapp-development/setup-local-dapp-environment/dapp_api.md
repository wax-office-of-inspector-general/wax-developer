---
title: Acceso a Tu API Local
order: 42
---

# Acceso a Tu API Local

La red principal de WAX expone un conjunto de puntos finales de API de **nodeos** (API RPC), lo que te permite interactuar con la Blockchain de WAX. Comúnmente conocidos como [chain-api-url](/es/operate/wax-infrastructure/#public-and-free-api-service-providers)

Ahora que tienes un nodo local ejecutándose en tu servidor de desarrollo local, estos puntos finales pueden ser accesibles desde tu dirección IP local: `http://127.0.0.1:8888`. Este punto final de API se inicializa cuando pasas el parámetro `plugin eosio::chain_api_plugin` a **nodeos**.

Para probar tu API RPC local, desde la línea de comandos, haz una solicitud **curl** al punto final `get_info`:

```
curl --request POST \
  --url http://127.0.0.1:8888/v1/chain/get_info \
  --header 'content-type: application/x-www-form-urlencoded; charset=UTF-8'
```

Deberías recibir la siguiente Respuesta JSON:

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

:::tip
Observa el parámetro "head_block_producer":"eosio". Localmente, <strong>eosio</strong> es la cuenta del sistema. Si haces una solicitud a la API de la red principal de WAX, devolvería un productor de bloques real (por ejemplo, "head_block_producer": "strongblock1").
:::

**nodeos** debe estar en funcionamiento para llamar a este punto final. Si no, recibirás el siguiente mensaje:

```
curl: (7) Failed to connect to 127.0.0.1 port 8888: Connection refused
```

## Información Adicional

Consulta [WAX RPC API](/es/learn/api-reference/rpc_api) para obtener más información.