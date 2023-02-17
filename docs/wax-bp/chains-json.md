---
title: Creating a chains.json
nav_order: 141
layout: default
parent: WAX Block Producer
lang-ref: Creating a chains.json
lang: en
---

## Why a chains.json?

Since a [bp.json](/en/wax-bp/bp-json) is needed for every chain (this includes a separate producerjson for Mainnet and Testnet), there is the need for listing all the producerjson associated with a block producer and chain. The chains.json simply lists and links the bp.json to a chain-id.

## Creating the chains.json

Just start off by using [this](https://github.com/Blacklusion/chains.json) template. It contains already all chains that you will probably need and more. If you don’t want to use this repo, we can alternatively suggest using the Network Info from the [Validationcore](https://wax.validationcore.io/services/network-info) or [EOS Nation Validator](https://validate.eosnation.io/wax/info/).
In the next step, delete all chains, that you don’t need from the template. Don’t forget to adjust the names of the chain’s producerjson that you have not deleted. These have to match the according .json and URL for that chain. The names provided in the repo are not binding, however, this is how we (would) name the producerjsons.

Examnple chains.json for WAX Mainnet & Testnet:
```json
{
  "chains": {
    "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4": "/wax.json",
    "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12": "/wax-testnet.json"
  }
}
```

## Access Control Allow Origin Header

Note that you will have to set up the Access-Control-Allow-Origin Header properly. You can find more information about this header [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers).

If you are using Nginx, you can easily achieve this by adding the following line to your conf that handles the route for the chains.json.

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

## Helpful Links
- Template chains.json with ChainIds: [https://github.com/Blacklusion/chains.json](https://github.com/Blacklusion/chains.json)
- Tools to validate your chains.json: [Validationcore](https://wax.validationcore.io/validations) [EOS Nation Validator](https://validate.eosnation.io/wax/producers/)
- [bp.json tutorial](/en/wax-bp/bp-json)
