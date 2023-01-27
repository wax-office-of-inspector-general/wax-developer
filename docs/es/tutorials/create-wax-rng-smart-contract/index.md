---
title: Utilizar WAX RNG desde smart contract
layout: default
nav_order: 82
parent: Tutoriales
has_children: true
lang-ref: Create a WAX RNG Smart Contract
lang: es
---

En este tutorial aprenderás a crear un smart contract que realice llamadas a WAX RNG para obtener un hash aleatorio.

**Nota:** El servicio WAX RNG no está disponible en un entorno local de desarrollo por lo que será necesario publicar el smart contract en testnet o en mainnet para realizar las pruebas.

## Antes de empezar

- Necesitarás completar el tema [inicio rápido con Docker](/es/dapp-development/docker-setup) (recomendado) o el tema [Configuración de WAX Blockchain](/es/dapp-development/wax-blockchain-setup/) para construir el entorno desde el código fuente.
- Para compilar y desplegar el smart contract en testnet o en mainnet necesitarás tener instalado [WAX Contract Development Toolkit (WAX-CDT)](/es/dapp-development/wax-cdt/).
- Para desplegar el smart contract en WAX mainnet o en WAX testnet necesitarás crear una cuenta autocustodiada.

**Nuevos desarrolladores:** Si estás empezando a desarrollar dApp es recomendable que conozcas el [Kit de herramientas de desarrollo de contratos WAX](/es/dapp-development/wax-cdt).
{: .label .label-yellow }

**Código Fuente:** 
https://github.com/3dkrender/WAX-RNG-Test
