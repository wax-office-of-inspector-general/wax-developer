# WAX Developer Documentation

[Visit WAX Developer Documentation](https://developer.wax.io)


## Get Started
You can use the following guides to set up your WAX dApp development environment:

* [Complete our Docker Quickstart](https://developer.wax.io/docs/dapps/docker-quickstart/)
* [Download WAX Blockchain source code and samples using the WAX Blockchain Setup guide](https://developer.wax.io/docs/dapps/wax-blockchain-setup/)
* [Learn about the WAX Contract Development Toolkit WAX-CDT](https://developer.wax.io/docs/dapp-development/wax-cdt/)
* [Set Up a Local dApp Environment](https://developer.wax.io/docs/dapp-development/setup-local-dapp-environment/)

## Build a dApp
Once you’ve set up your development environment, these tutorials can help you launch the next great dApp on WAX:

* [Smart Contract Quickstart](https://developer.wax.io/docs/dapps/smart-contract-quickstart/) 
* [Deploy Your dApp on WAX](https://developer.wax.io/docs/dapp-development/deploy-dapp-on-wax/deploy_source)

## Guides
Learn how to make API requests to your local blockchain and the WAX mainnet, and get an overview of the WAX-CDT C++ API used to build your smart contracts.

* [WAX RPC API](https://developer.wax.io/docs/api-reference/rpc_api)
* [dfuse](https://developer.wax.io/docs/api-reference/dfuse/)

## How to add translated pages
To add a translation to this documentation, you must add a folder for the content within *docs*. Please, use [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) codes.

```
docs/
  en/
    index.md
    ...
  es/
    index.md
    ...
  fr/
    index.md
    ...
```

Add language reference in *docs/_data/languages.yml*

Sample for Spanish translation:
```
es:
  label: Español
  icon: 🇪🇸
```

Add translations for general labels in *docs/_data/translations.yml*

Sample for Spanish translation:
```
back_to_top_text: 
  en: "Back to top"
  es: "Volver arriba"
```

Add an *index_ISO-639-1-CODE.md* file in *docs/* 

Sample for Spanish translation:
```
docs/index_es.md
```

For each translated file add this parameters in heads:

```
lang-ref: {same as original Title parameter in default language (en)}
lang: {ISO-639-1 code}
```

Sample for Spanish translation:
```
title: Bienvenido
layout: home
nav_order: 1
lang-ref: Welcome
lang: es
```
