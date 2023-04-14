---
title: WAX-RPC API
nav_order: 20
layout: default
has_children: false
parent: WAX API Referenz
lang-ref: WAX-RPC API
lang: es-DE
---

Die WAX Blockchain RPC API umfasst öffentliche Endpunkte, die zum Abrufen von Blockinformationen, Blockhistorie, Knoteninformationen und Knotenproduzenteninformationen verwendet werden. Diese API wird über **nodeos**-Plugins bereitgestellt und ist im WAX-Mainnet und in Ihrer lokalen Entwicklungsumgebung verfügbar. 

<strong>Note:</strong> Wenn Sie lokale Anfragen stellen muss <strong>nodeos</strong> laufen.
{: .label .label-yellow }


| Environment | URL |
| --- | ----------- |
| WAX mainnet | Endpunktverfügbarkeit [https://validate.eosnation.io/wax/reports/endpoints.html](https://validate.eosnation.io/wax/reports/endpoints.html) |
| Local Testnet | http://127.0.0.1:8888 |

Sie können API-Anfragen direkt an Blockchain-Endpunkte stellen:

```
curl --request POST \
  --url http://127.0.0.1:8888/v1/chain/get_info \
  --header 'content-type: application/x-www-form-urlencoded; charset=UTF-8'
```

Sie können diese Endpunkte auch mit **cleos**-Befehlen aufrufen:

```
cleos -u [api-url] get info
```

## Zusätzliche Informationen und Tools von Drittanbietern

Siehe EOSIO's <a href="https://developers.eos.io/manuals/eos/v2.0/nodeos/plugins/chain_api_plugin/api-reference/index" target="_blank">RPC API</a> für eine Liste von Endpunkten.

<a href="https://github.com/EOSIO/eosjs" target="_blank">eosjs</a> ist ein Javascript-API-SDK, das für die einfache Kommunikation mit der WAX-RPC-API verwendet wird. Um die Entwicklung zu vereinfachen, können Sie dieses Tool für den Zugriff auf Blockchain-Endpunkte verwenden.
