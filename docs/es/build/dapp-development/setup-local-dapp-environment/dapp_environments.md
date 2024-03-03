---
title: Entornos de Blockchain
order: 20
---

# Entornos de Blockchain

A continuación, encontrarás las versiones de WAX, URLs e información del entorno de desarrollo.

| Servicio | Descripción |
|---------|-------------|
| [Imágenes Docker](https://hub.docker.com/u/waxteam) | Utiliza las imágenes Docker de WAX para ejecutar un nodo local, usar herramientas de blockchain y compilar tus contratos inteligentes. Consulta [Inicio Rápido de Docker](/es/build/dapp-development/docker-setup/) para más información. |
| [waxjs](https://github.com/worldwide-asset-exchange/waxjs) | API Javascript de WaxJS para integración con la Cloud Wallet. Úsalo para iniciar sesión fácilmente en los usuarios y enviar transacciones a la Blockchain de WAX desde tu dApp. Consulta [Inicio Rápido de Cloud Wallet](/es/build/cloud-wallet/waxjs/waxjs_qstart) para más información. |
| [wax-blockchain](https://github.com/worldwide-asset-exchange/wax-blockchain) | Archivos fuente de la Blockchain de WAX. Consulta [Configuración de la Blockchain de WAX](/es/build/dapp-development/wax-blockchain-setup/) para comenzar. |
| [wax-cdt](https://github.com/worldwide-asset-exchange/wax-cdt) | Kit de Desarrollo de Contratos de WAX. Consulta [Kit de Desarrollo de Contratos de WAX (WAX-CDT)](/es/build/dapp-development/wax-cdt/) para comenzar. |

## WAX Mainnet

| Servicio | URL | Descripción |
|---------|-----|-------------|
| URL de Blockchain | [chain-api-url](/es/operate/wax-infrastructure/#public-and-free-api-service-providers) | Utilizado para realizar llamadas API y desplegar tus contratos inteligentes en la red principal de WAX. |
| P2P de Blockchain | peers.wax.io:9876 | Punto final de conexión para sincronizar un productor o nodo completo (sin protocolo al frente). |
| Explorador de Blockchain | [https://waxblock.io](https://waxblock.io/) | Explorador de bloques waxblock.io. |
| Cuenta WAX | (por ejemplo, Scatter) | Crea una cuenta de Blockchain de WAX. |

## WAX Public Testnet

[WAX sw/eden](https://waxsweden.org/) proporciona un Testnet de WAX que te permite crear cuentas de prueba, probar contratos inteligentes, usar puntos finales de API y más.

| Servicio | URL | Descripción |
|---------|-----|-------------|
| Sitio Testnet | [WAX Testnet](https://waxsweden.org/testnet/) | Utiliza el sitio de WAX sw/eden para crear cuentas de prueba, encontrar scripts de muestra y más. |
| URL de Blockchain | [https://testnet.waxsweden.org](https://testnet.waxsweden.org) | Utilizado para realizar llamadas API y desplegar tus contratos inteligentes en el Testnet de WAX. |
| Puntos finales públicos | [endpoints.json](https://github.com/eosswedenorg/waxtestnet/tree/master/endpoints) | URLs adicionales de puntos finales P2P y API. |
| P2P de Blockchain | testnet.waxsweden.org:59876 | Punto final de conexión para sincronizar un productor o nodo completo (sin protocolo al frente). |
| Explorador de Blockchain | [Bloks.io Testnet](https://local.bloks.io/?nodeUrl=testnet.waxsweden.org&coreSymbol=WAX&corePrecision=8&systemDomain=eosio&hyperionUrl=https%3A%2F%2Ftestnet.waxsweden.org) | Explorador de bloques Testnet. |
| Cuenta de Prueba | [https://waxsweden.org/create-testnet-account/](https://waxsweden.org/create-testnet-account/) | Utiliza la herramienta "Crear cuenta testnet" en la página de inicio de [Testnet](https://waxsweden.org/testnet/) o visita el enlace directo. |

## WAX Local Testnet

Cuando [Configures un Entorno dApp Local](/es/build/dapp-development/), puedes realizar llamadas a tu API local utilizando la siguiente URL.

| Servicio | URL | Descripción |
|---------|-----|-------------|
| URL de Blockchain | [http://127.0.0.1:8888](http://127.0.0.1:8888) | Utilizado para realizar llamadas API en tu entorno de desarrollo local. |

## Entorno C++

Puedes escribir contratos inteligentes de WAX usando el lenguaje de programación C++. No se requiere un lenguaje personalizado, aunque necesitarás familiarizarte con la biblioteca de API de C/C++ de WAX. Esta biblioteca contiene los archivos principales necesarios para comunicarse con la Blockchain de WAX. Cuando estés listo para comenzar, consulta:

- [Kit de Desarrollo de Contratos de WAX (WAX-CDT)](/es/build/dapp-development/wax-cdt/)
- [API de WAX-CDT](/build/api-reference/cdt_api)
- [Inicio Rápido de Contratos Inteligentes](/es/build/dapp-development/smart-contract-quickstart/)

## Herramientas de Desarrollo

Puedes usar cualquier editor o IDE de C++ de terceros para escribir tus contratos inteligentes, como Sublime Text, Atom, CLion, Eclipse o productos de Visual Studio.

[EOS Studio](https://www.eosstudio.io/) es un IDE gráfico construido para el desarrollo de dApp de EOSIO, disponible en Linux, Mac OS y Windows. Esta herramienta cuenta con un editor de código, inspector de contratos y un gestor de redes. Para integrar WAX con EOS Studio, consulta [Cómo usar EOS Studio con WAX](https://github.com/worldwide-asset-exchange/wax-blockchain/tree/develop/samples/eos-studio). Nuestro script proporciona una integración mínima, desarrollada y probada con Ubuntu 18.04.

[eosjs](https://github.com/EOSIO/eosjs) es un SDK de API javascript que puedes usar para comunicarte fácilmente con la API de la Blockchain de WAX. Consulta [API RPC de WAX](/es/build/api-reference/rpc_api) para más información.

[dfuse](https://www.dfuse.io) es un poderoso conjunto de APIs que te permiten consultar la Blockchain de WAX y transmitir datos en tiempo real. Consulta [dfuse para dApps de WAX](/es/build/api-reference/dfuse/) para más información.