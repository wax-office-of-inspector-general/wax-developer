---
title: La API RPC de WAX
nav_order: 20
layout: default
has_children: false
parent: WAX API Reference
lang-ref: WAX-RPC API
lang: es
---

La API RPC de WAX Blockchain incluye puntos de acceso públicos utilizados para obtener información de bloques y su historial e información sobre los nodos y sobre los productores de nodos. Esta API, expuesta a través de los plugins **nodeos**, está disponible en la red principal de WAX y en su entorno de desarrollo local. 

<strong>Nota:</strong> Si estás realizando solicitudes locales, debes tener los <strong>nodeos</strong> activos.
{: .label .label-yellow }


| Entorno | URL |
| --- | ----------- |
| Mainnet de WAX | Consulte disponibilidad de nodos en [https://validate.eosnation.io/wax/reports/endpoints.html](https://validate.eosnation.io/wax/reports/endpoints.html) |
| Testnet local | http://127.0.0.1:8888 |

Puedes realizar solicitudes de API directamente a los puntos de acceso de la blockchain:

```
curl --request POST \
  --url http://127.0.0.1:8888/v1/chain/get_info \
  --header 'content-type: application/x-www-form-urlencoded; charset=UTF-8'
```

También puedes hacer solicitudes a estos puntos de acceso a través de los comandos **cleos**:

```
cleos -u https://apiwax.3dkrender.com get info
```

## Información adicional y herramientas de terceros

Puedes consultar este enlace de EOSIO (<a href="https://developers.eos.io/manuals/eos/v2.0/nodeos/plugins/chain_api_plugin/api-reference/index" target="_blank">RPC API</a>) para acceder a una lista completa de puntos de acceso.

<a href="https://github.com/EOSIO/eosjs" target="_blank">eosjs</a> es un SDK de la API de javascript que se utiliza para comunicarse fácilmente con la API RPC de WAX. Para simplificar el desarrollo, puedes utilizar esta herramienta para llegar a los puntos de acceso de la blockchain.
