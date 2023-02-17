---
title: Despliega tu dApp en WAX
layout: default
nav_order: 70
parent: Desarrollo de dApps
has_children: true
lang-ref: Deploy Your dApp on WAX
lang: es-ES
---

Para desplegar tu dApp en WAX, tendrás que utilizar [WAX-CDT](/es/dapp-development/wax-cdt/) y las [Herramientas de Blockchain](/es/tools/blockchain_tools) para:

* Compilar tus contratos inteligentes
* Crear cuentas de WAX para cada uno de tus contratos
* Desplegar tus contratos inteligentes en la Blockchain de WAX

WAX proporciona dos maneras de realizar estos pasos de despliegue. Puedes utilizar nuestros scripts **make** personalizados (recomendados para desarrolladores de EOS) o utilizar las herramientas WAX-CDT desde tu contenedor o instalación local de Docker. A continuación hay una lista de beneficios y requisitos para cada opción.

## Scripts de despliegue personalizados

El <a href="https://github.com/worldwide-asset-exchange/wax-blockchain" target="_blank">Repositorio de código fuente de WAX</a> incluye un contrato de ejemplo, **hello-world**, junto con scripts **make** que ofrecen una forma fácil y automatizada de crear y desplegar tus contratos inteligentes. Estos scripts usan una <a href="https://hub.docker.com/r/waxteam/dev" target="_blank">Imagen de desarrollo de WAX Docker</a> para:

* Crear un archivo WASM y ABI
* Crear una cuenta de WAX Blockchain para tu contrato inteligente
* Desplegar tu contrato inteligente en WAX
* Probar tu contrato inteligente en la Blockchain de WAX

### Ventajas

* Nos permite desplegar un contrato inteligente desde un contenedor Docker sin instalar ningún código fuente de WAX (seguirás necesitando descargar el código fuente **hello-world** y los scripts del <a href="https://github.com/worldwide-asset-exchange/wax-blockchain" target="_blank">Repositorio de código fuente de WAX</a>).
* Puedes ejecutar los scripts personalizados **make** del directorio de tu contrato inteligente sin pasar las rutas a sus archivos WASM y ABI.

### Qué necesitas:

* Docker debe estar instalado y configurado para ejecutarse sin sudo. Si utilizas Linux, consulta los  <a href="https://docs.docker.com/install/linux/linux-postinstall/" target="_blank">pasos posteriores a la instalación de Linux</a> para más información.

   <strong>Subsistema Windows para usuarios de Linux:</strong> Los requisitos de configuración e instalación de Docker varían en función de su versión de WSL. Recomendado sólo para usuarios avanzados de Docker/Windows. Si estás ejecutando WSL 2, consulta el <a href="https://docs.docker.com/docker-for-windows/wsl-tech-preview/" target="_blank">avance técnico de Docker Desktop WSL 2</a>.
    {: .label .label-yellow }

* make (VERSION 3.9 +)
* A self-managed WAX Blockchain Account and its private key (to deploy the contract).


## Despliegue de Docker (WAX-CDT)

Si lo prefieres, puedes desplegar tus contratos inteligentes desde la línea de comandos utilizando las herramientas WAX-CDT. 

### Ventajas

* Permite un mayor control sobre el proceso de construcción y los parámetros de despliegue. Consulta las [opciones de WAX-CDT](/es/tools/cdt_options) para obtener más información.
* Si has usado **eosio-init** para [crear un Smart Contract](/es/dapp-development/wax-cdt/cdt_use.html#compile-hello-world) y desplegarlo en tu blockchain local, esta podría ser una buena opción para ti.
* Es compatible con Windows. 

### Qué necesitas

Para utilizar esta opción, necesitarás:

* Completar nuestro [inicio rápido de Docker](/es/dapp-development/docker-setup/) (recomendado) o usar la [Configuración de la Blockchain de WAX](/es/dapp-development/wax-blockchain-setup/) para poder trabajar desde el código fuente.
* Usar el [Kit de herramientas de desarrollo de contratos WAX (WAX Contract Development Toolkit o WAX-CDT)](/es/dapp-development/wax-cdt/) para compilar tus contratos inteligentes.

## Antes de empezar

Independientemente de la opción de despliegue que elijas, tendrás que:

* Crear una cuenta autogestionada de WAX Blockchain. 
* Asegurarte de tener suficiente WAX en tu cuenta para asignar recursos.

