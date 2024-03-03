---
title: Configuración de la Blockchain WAX
order: 30
---

# Configuración de la Blockchain WAX

Para configurar y usar la Blockchain WAX, se recomienda que utilices nuestras <a href="https://hub.docker.com/u/waxteam" target="_blank">imágenes de Docker de waxteam</a>. Nuestras imágenes de Docker proporcionan una manera rápida y completamente soportada de ejecutar un nodo en segundos. Consulta [Docker Quickstart](/es/build/dapp-development/docker-setup/) para obtener más información.

Nuestras imágenes de Docker para producción y desarrollo incluyen todo lo que está disponible en el <a href="https://github.com/worldwide-asset-exchange/wax-blockchain" target="_blank">Repositorio de Código Fuente de la Blockchain WAX</a>, lo que te permite ejecutar nodos WAX y construir y desplegar contratos inteligentes.

Si deseas acceder a nuestros contratos y scripts de muestra desde tu unidad local o tienes la necesidad de instalar la Blockchain WAX en lugar de usar Docker, puedes usar esta guía para descargar y, opcionalmente, construir el código fuente de la Blockchain WAX.

:::warning
Importante: En este momento, no hay paquetes precompilados disponibles. El soporte <strong>no</strong> está disponible cuando construyes la blockchain WAX desde el código fuente.
:::

## Qué está incluido

La Blockchain WAX es un fork de <a href="https://docs.eosnetwork.com/" target="_blank">EOS (Antelope)</a>. Este <a href="https://github.com/worldwide-asset-exchange/wax-blockchain" target="_blank">Repositorio de Código Fuente de la Blockchain WAX</a> incluye e instala:

- Código fuente de la Blockchain WAX
- Dependencias
- [Herramientas de Blockchain](/es/build/tools/blockchain_tools), incluyendo keosd, nodeos y cleos
- Contratos de muestra

Puedes usar estos componentes para administrar carteras locales, crear cuentas locales, interactuar con la Blockchain WAX y más.

:::warning
<strong>Desarrolladores de EOS:</strong> Construir el Repositorio de Código Fuente WAX sobrescribirá una instalación previa de EOS.
:::

### Implementación Rápida con Docker

El Repositorio de Código Fuente WAX incluye un ejemplo de Hola Mundo para construir y desplegar rápidamente contratos inteligentes WAX en la Blockchain WAX. Consulta [Docker Quick Deploy](/es/build/dapp-development/deploy-dapp-on-wax/deploy_docker) para más información.

### Dependencias

<p>Para una lista completa de dependencias, consulta <a href="https://github.com/worldwide-asset-exchange/wax-blockchain/tree/develop/scripts" target="_blank">wax-blockchain/scripts</a> y localiza el archivo `wax_build_` para tu sistema operativo.</p>

## Requisitos del Sistema

Si no estás usando nuestras imágenes de Docker, necesitarás:

- Consultar [Sistemas Operativos Soportados](/es/build/tools/os) para asegurarte de que cumples con los requisitos del sistema operativo.

- Tener al menos 7 GB de RAM libre.

- Tener al menos 20 GB de espacio libre en el disco duro.