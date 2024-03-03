---
title: WAX-RPC API
order: 20
---

# WAX-RPC API

La API RPC de la Blockchain de WAX incluye endpoints públicos utilizados para obtener información de bloques, historial de bloques, información de nodos e información de productores de nodos. Expuesta a través de plugins de **nodeos**, esta API está disponible en la mainnet de WAX y en tu entorno de desarrollo local.

:::tip
Si estás haciendo solicitudes locales, <strong>nodeos</strong> debe estar ejecutándose.
:::

| Entorno | URL |
| --- | ----------- |
| Mainnet de WAX | Verifica la disponibilidad de nodos en [https://validate.eosnation.io/wax/reports/endpoints.html](https://validate.eosnation.io/wax/reports/endpoints.html) |
| Testnet Local | http://127.0.0.1:8888 |

Puedes hacer solicitudes API directamente a los endpoints de la blockchain:

```
curl --request POST \
  --url http://127.0.0.1:8888/v1/chain/get_info \
  --header 'content-type: application/x-www-form-urlencoded; charset=UTF-8'
```

También puedes llamar a estos endpoints usando comandos de **cleos**:

```
cleos -u [url-api] get info
```

## Información Adicional y Herramientas de Terceros

Consulta la <a href="https://docs.eosnetwork.com/leap/latest/nodeos/rpc_apis/" target="_blank">documentación de la API RPC</a> para obtener una lista de llamadas a la API.

<a href="https://github.com/eosnetworkfoundation/mandel-eosjs" target="_blank">eosjs</a> es un SDK de API en javascript que se utiliza para comunicarse fácilmente con la API RPC de WAX. Para simplificar el desarrollo, puedes utilizar esta herramienta para acceder a los endpoints de la blockchain.
