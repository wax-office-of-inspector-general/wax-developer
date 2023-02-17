---
title: Configuración de WAX Blockchain
nav_order: 30
layout: default
parent: Desarrollo de dApps
has_children: true
lang-ref: WAX Blockchain Setup
lang: es-ES
---

Para configurar y utilizar la blockchain de WAX se recomienda utilizar nuestro <a href="https://hub.docker.com/u/waxteam" target="_blank">waxteam - Docker Images</a>. Nuestras imágenes Docker proporcionan una forma rápida y totalmente compatible de ejecutar un nodo en segundos. Consulte [Docker Quickstart](/es/dapp-development/docker-setup/) para más información.

Nuestras imágenes Docker de producción y desarrollo incluyen todo lo que está disponible en el <a href="https://github.com/worldwide-asset-exchange/wax-blockchain" target="_blank">Repositorio de Código Fuente de WAX Blockchain</a>, permitiéndole ejecutar nodos WAX y construir y desplegar contratos inteligentes.

Si quieres acceder a nuestros contratos y scripts de muestra desde tu disco local o tienes la necesidad de instalar WAX Blockchain en lugar de usar Docker, puedes usar esta guía para descargar y opcionalmente construir el código fuente de WAX Blockchain.

<strong>Importante:</strong> Hasta la fecha, los paquetes precompilados no están disponibles. Por lo que <strong>no hay soporte disponible</strong> si construyes WAX Blockchain desde el código fuente.
{: .label .label-yellow }

## Qué incluye

WAX Blockchain es un fork de <a href="https://docs.eosnetwork.com/" target="_blank">EOS (Antelope)</a>. Este <a href="https://github.com/worldwide-asset-exchange/wax-blockchain" target="_blank">repositorio de código fuente de WAX Blockchain</a> incluye e instala:

- Código fuente de WAX Blockchain
- Dependencias
- [Blockchain Tools](/es/tools/blockchain_tools), incluyendo keosd, nodeos, and cleos
- Ejemplos de smart contracts

Puedes utilizar estos componentes para gestionar wallets locales, crear cuentas locales, interactuar con la WAX Blockchain, y más.

<strong>Desarrolladores EOS:</strong> La construcción del Repositorio de Código Fuente de WAX sobrescribirá cualquier instalación anterior de EOS. 
{: .label .label-yellow }

### Despliegue Rápido con Docker

El Repositorio de Código Fuente de WAX incluye un ejemplo de Hello World para construir y desplegar rápidamente los contratos inteligentes de WAX en la Blockchain de WAX. Consulta [Docker Quick Deploy](/es/dapp-development/deploy-dapp-on-wax/deploy_docker) para más información.
   
### Dependencias
    
<p>Para una completa lista de dependencias consulte <a href="https://github.com/worldwide-asset-exchange/wax-blockchain/tree/develop/scripts" target="_blank">wax-blockchain/scripts</a> y localiza el archivo `wax_build_` para tu sistema operativo.</p>

## Requisitos de Sistema

Si no está utilizando nuestras imágenes Docker, necesitará hacerlo:

* Consulta [Supported Operating Systems](/es/tools/os) para confirmar todos los requerimientos del sistema. 

    <strong>Usuarios de Ubuntu 18.04:</strong> Consulta [Problemas Conocidos](/es/troubleshooting/) antes de configurar WAX Blockchain.
    {: .label .label-yellow }

* Dispón, como mínimo, de 7 GB de RAM libre.

* Dispón, como mínimo, de 20 GB de espacio libre en el disco duro.




