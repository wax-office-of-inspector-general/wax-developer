---
title: Configuración de Docker
nav_order: 21
layout: default
parent: Desarrollo de dApps
has_children: true
lang-ref: Docker Setup
lang: es
---

<a href="https://www.docker.com/" target="_blank">Docker</a> es una plataforma *contenedora* similar a una máquina virtual. Docker permite ejecutar software, aplicaciones e incluso sistemas operativos como Ubuntu desde un entorno aislado. Si quieres profundizar más, puedes explorar la <a href="https://www.docker.com/why-docker" target="_blank">Guía General</a> de Docker.

Nuestras imágenes Docker de desarrollo y producción proporcionan una forma rápida y sencilla de ejecutar la Blockchain de WAX en cuestión de minutos. También puedes utilizar nuestras imágenes Docker para construir y desplegar contratos inteligentes.

El uso de nuestro entorno Docker ofrece las siguientes ventajas:

* Añade comodidad y rapidez a tus tareas de desarrollo.
* Elimina la necesidad de gestionar el código fuente.
* Elimina la necesidad de cumplir con los requisitos de nuestros [Sistemas Operativos Compatibles](/es/tools/os).
* No sobrescribe una instalación de Leap ya existente.
* Facilita la actualización y la prueba de nuevas funciones.
* Facilita la alternancia entre los entornos de producción y desarrollo.

<!--<strong>Nota:</strong> While it isn't required to build the source code from our <a href="https://github.com/worldwide-asset-exchange" target="_blank">WAX Git Repository</a>, we still recommend that you . 
{: .label .label-yellow }-->

## Qué incluye

A continuación se muestra una lista de nuestras imágenes Docker principales. Para obtener una lista completa, accede a los <a href="https://hub.docker.com/u/waxteam" target="_blank">Repositorios waxteam - Docker</a>.

<table>
<thead>
<tr>
<th style="width:25%">Imagen de Docker</th>
<th>Descripción</th>
</tr>
</thead>

<tbody>
<tr>
<td><a href="https://hub.docker.com/r/waxteam/dev" target="_blank">waxteam/dev</a></td>
<td>Esta imagen de <strong>desarrollo</strong> incluye todo lo que necesitas para poner en marcha la Blockchain de WAX. Puedes usar esta imagen para ejecutar un nodo WAX, crear un entorno de desarrollo local y crear y compilar contratos inteligentes usando el [Kit de herramientas de desarrollo de contratos WAX (WAX Contract Development Toolkit o WAX-CDT)](/es/dapp-development/wax-cdt/).</td>
</tr>

<tr>
<td><a href="https://hub.docker.com/r/waxteam/cdt" target="_blank">waxteam/cdt</a></td>
<td>Utiliza esta imagen para crear y compilar contratos inteligentes a través del [Kit de herramientas de desarrollo de contratos WAX (WAX Contract Development Toolkit o WAX-CDT)](/es/dapp-development/wax-cdt/). Esta imagen <strong>no permite</strong> ejecutar un nodo WAX ni utilizar [Herramientas de la Blockchain](/es/tools/blockchain_tools).</td>
</tr>

<td><a href="https://hub.docker.com/r/waxteam/production" target="_blank">waxteam/production</a></td>
<td>Te recomendamos usar nuestras <a href="https://hub.docker.com/r/waxteam/production" target="_blank">imágenes de producción</a> para ejecutar un nodo de producción. Para más información, dirígete a: <a href="https://github.com/worldwide-asset-exchange/wax-blockchain/tree/develop/samples/mainnet" target="_blank">Ejecutar un nodo de WAX</a>.</td>
</tr>

</tbody>
</table>




