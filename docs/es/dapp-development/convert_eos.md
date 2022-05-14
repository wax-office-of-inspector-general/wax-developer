---
title: Desplegar una dApp de EOS en WAX
layout: default
nav_order: 10
parent: Desarrollo de dApps
lang-ref: Deploy an EOS dApp on WAX
lang: es
---

WAX es totalmente compatible con los contratos inteligentes de EOS y ofrece cuentas de blockchain gratuitas y tarifas más baratas. Esta guía ofrece una visión general de cómo desplegar tus dApps de EOS en la mainnet de WAX.

<!--## What's Compatible

* All EOSIO System Contracts
* All EOSIO CDT libraries
* <a href="https://github.com/EOSIO/eosjs" target="_blank">eosjs</a> API SDK-->

## Cuentras de la Blockchain

1. Para desplegar tus contratos inteligentes en la red principal de WAX, necesitarás crear una cuenta autogestionada de WAX Blockchain.

2. Asegúrate de tener suficiente WAX en tu cuenta para asignar recursos.

3. Si tu dApp interactúa con cuentas de blockchain, tus clientes también tendrán que crear una cuenta de WAX Blockchain gratuita y verificada. Puedes enviarlas al siguiente enlace:

    <a href="https://all-access.wax.io" target="_blank">http://<span></span>all-access.wax.io</a>

    Una cuenta WAX Cloud Wallet crea automáticamente una cuenta WAX Blockchain para tus clientes y te permite integrar WaxJS en tus dApps. Si quieres obtener más información al respecto, echa un vistazo a este [Inicio rápido de WAX Cloud Wallet](/es/waa_waxjs_qstart).

## Entornos de desarrollo

Para probar tus contratos intelignetes en WAX, puedes:

* Completar nuestro [inicio rápido de Docker](/es/dapp-development/docker-setup) (recomendado) o usar la [configuración de la Blockchain de WAX](/es/dapp-development/wax-blockchain-setup) para tener acceso al código fuente.
* Crear tus contratos usando el [set de herramientas del desarrollador de contratos de WAX (WAX Contract Development Toolkit o WAX-CDT)](/es/dapp-development/wax-cdt).
* [Configurar un entorno de dApp local](/es/dapp-development/setup-local-dapp-environment).
* Hacer un despliegue en la [Testnet de WAX](/es/dapp-development/testnet-quickstart).

<strong>Aviso importante:</strong> Configurar el código fuente de WAX en tu entorno de desarrollo local sobrescribirá la instalación actual de EOS. Si quieres mantener tu entorno EOS, te recomendamos que utilices Docker, una máquina virtual o un entorno de desarrollo independiente.
{: .label .label-yellow }

## Despliega tus contratos inteligentes

Debes compilar tus contratos inteligentes utilizando el [set de herramientas del desarrollador de contratos de WAX (WAX Contract Development Toolkit o WAX-CDT)](/es/dapp-development/wax-cdt).

Si no deseas instalar el código fuente, puedes utilizar nuestro [inicio rápido de Docker](/es/dapp-development/docker-setup) o scripts personalizados. Para más información, entra en el apartado [Despliega tu dApp en WAX](/es/dapp-development/deploy-dapp-on-wax).
