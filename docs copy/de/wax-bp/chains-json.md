---
title: chains.json erstellen
nav_order: 141
layout: default
parent: WAX Block Producer
lang-ref: Creating a chains.json
lang: es-DE
---

## Warum eine chains.json?

Da für jede Chain eine [bp.json](/de/wax-bp/bp-json) benötigt wird (einschließlich einer separaten producerjson für Mainnet und Testnet), besteht die Notwendigkeit, alle producerjsons aufzulisten, die mit einem Blockproducer verbunden sind. Die chains.json listet einfach die bp.json auf und verknüpft sie mit einer chain-id.

## Erstellen einer chains.json

Beginnen Sie einfach mit [dieser](https://github.com/Blacklusion/chains.json) Vorlage. Sie enthält bereits alle Chains, die Sie wahrscheinlich benötigen werden, und noch mehr. Wenn Sie dieses Repo nicht verwenden möchten, können wir alternativ die Netzwerkinformationen aus [Validationcore](https://wax.validationcore.io/services/network-info) oder [EOS Nation Validator](https://validate.eosnation.io/wax/info/) vorschlagen.
Im nächsten Schritt löschen Sie alle Chains, die Sie nicht benötigen, aus der Vorlage. Vergessen Sie nicht, die Namen der producerjson der Chains, die Sie nicht gelöscht haben, anzupassen. Diese müssen mit der entsprechenden .json und URL für diese Chain übereinstimmen. Die im Repo angegebenen Namen sind nicht bindend, aber so würden wir die Producerjsons benennen.

Beispiel chains.json für WAX Mainnet & Testnet:
```json
{
  "chains": {
    "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4": "/wax.json",
    "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12": "/wax-testnet.json"
  }
}
```

## Access Control Allow Origin Header

Beachten Sie, dass Sie den Access-Control-Allow-Origin-Header richtig einrichten müssen. Weitere Informationen über diesen Header finden Sie unter [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers).

Wenn Sie Nginx verwenden, können Sie dies ganz einfach erreichen, indem Sie die folgende Zeile zu Ihrer conf hinzufügen, die die Route für die chains.json verwaltet.

```nginx
add_header Access-Control-Allow-Origin *;
```

```nginx
# Example config
location ~ \.json {
        add_header Access-Control-Allow-Origin *;
        root /var/website/resources;
    }
```
