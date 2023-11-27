---
title: Configuración de Docker
order: 21
---

# Configuración de Docker

[Docker](https://www.docker.com/) es una plataforma de contenedores similar a una máquina virtual. Docker te permite ejecutar software, aplicaciones e incluso sistemas operativos como Ubuntu desde un entorno aislado. Consulta la guía [Overview](https://www.docker.com/why-docker) de Docker para aprender más.

Nuestras imágenes de Docker para desarrollo y producción proporcionan una forma rápida y fácil de ejecutar la Blockchain de WAX en minutos. También puedes usar nuestras imágenes de Docker para construir y desplegar contratos inteligentes.

El uso de nuestro entorno Docker ofrece los siguientes beneficios:

- Añade comodidad y velocidad a tus esfuerzos de desarrollo
- Elimina la necesidad de gestionar el código fuente
- Elimina la necesidad de cumplir con nuestros requisitos de [Sistemas Operativos Compatibles](/es/build/tools/os)
- No sobrescribe una instalación existente de Leap
- Facilita la actualización y prueba de nuevas características
- Facilita el cambio entre entornos de producción y desarrollo

## Qué se Incluye

A continuación, se muestra una lista de nuestras imágenes centrales de Docker. Para obtener una lista completa, consulta [waxteam - Repositorios de Docker](https://hub.docker.com/u/waxteam).

| Imagen de Docker | Descripción |
|------------------|-------------|
| [waxteam/dev](https://hub.docker.com/r/waxteam/dev) | Esta imagen de **desarrollo** incluye todo lo necesario para poner en funcionamiento la Blockchain de WAX. Puedes utilizar esta imagen para ejecutar un nodo de WAX, crear un entorno de desarrollo local y crear y compilar contratos inteligentes utilizando el [Kit de Desarrollo de Contratos de WAX (WAX-CDT)](/es/build/dapp-development/wax-cdt/). |
| [waxteam/cdt](https://hub.docker.com/r/waxteam/cdt) | Utiliza esta imagen para crear y compilar contratos inteligentes utilizando el [Kit de Desarrollo de Contratos de WAX (WAX-CDT)](/es/build/dapp-development/wax-cdt/). Esta imagen **no** permite ejecutar un nodo de WAX ni utilizar [Herramientas de Blockchain](/es/build/tools/blockchain_tools). |
| [waxteam/production](https://hub.docker.com/r/waxteam/production) | Se recomienda utilizar nuestras [imágenes de docker de producción](https://hub.docker.com/r/waxteam/production) para ejecutar un nodo de producción. Consulta [Ejecutando un nodo de WAX](https://github.com/worldwide-asset-exchange/wax-blockchain/tree/develop/samples/mainnet) para más información. |

<ChildTableOfContents :max="2" title="Más contenido de esta sección" />