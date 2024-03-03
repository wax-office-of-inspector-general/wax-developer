---
title: Despliega una dApp de EOS en WAX
order: 10
---

# Despliega una dApp de EOS en WAX

WAX es completamente compatible con los contratos inteligentes de EOS y ofrece cuentas de blockchain gratuitas y tarifas más económicas. Esta guía proporciona una visión general de cómo desplegar tus dApps de EOS en la mainnet de WAX.

## Cuentas de Blockchain

1. Para desplegar tus contratos inteligentes en la mainnet de WAX, necesitarás crear una Cuenta de Blockchain de WAX autogestionada.

2. Asegúrate de tener suficiente WAX apostado en tu cuenta para asignar recursos.

3. Si tu dApp interactúa con cuentas de blockchain, tus clientes también necesitarán crear una Cuenta de Blockchain de WAX gratuita y verificada. Puedes enviarlos al siguiente enlace:

    <a href="https://all-access.wax.io" target="_blank">http://<span></span>all-access.wax.io</a>

    Una Cuenta de Cloud Wallet crea automáticamente una cuenta de Blockchain de WAX para tus clientes y te permite integrar WaxJS en tus dApps. Consulta [Inicio Rápido de Cloud Wallet](/es/build/cloud-wallet/waxjs/waxjs_qstart) para más información.

## Entorno de Desarrollo

Si deseas probar tus contratos inteligentes en WAX, puedes:

* Completar nuestro [Inicio Rápido Docker](/es/build/dapp-development/docker-setup/) (recomendado) o usar la [Configuración de la Blockchain de WAX](/es/build/dapp-development/wax-blockchain-setup/) para construir desde el código fuente.
* Construir tus contratos usando el [Kit de Herramientas de Desarrollo de Contratos de WAX (WAX-CDT)](/es/build/dapp-development/wax-cdt/).
* [Configurar un Entorno dApp Local](/es/build/dapp-development/setup-local-dapp-environment/).
* Desplegar en el [Testnet de WAX](/es/build/dapp-development/testnet-quickstart).

:::tip
<strong>Advertencia:</strong> Configurar el código fuente de WAX en tu entorno de desarrollo local sobrescribirá una instalación actual de EOS. Si deseas mantener tu entorno de EOS, se recomienda que uses Docker, una máquina virtual o un entorno de desarrollo separado.
:::

## Despliega Tus Contratos Inteligentes

Debes compilar tus contratos inteligentes utilizando el [Kit de Herramientas de Desarrollo de Contratos de WAX (WAX-CDT)](/es/build/dapp-development/wax-cdt/).

Si no quieres instalar el código fuente de WAX, puedes usar nuestra [Guía de Inicio Rápido Docker](/es/build/dapp-development/docker-setup/) o scripts personalizados para desplegar tus contratos inteligentes. Consulta [Despliega Tu dApp en WAX](/es/build/dapp-development/deploy-dapp-on-wax/) para más información.