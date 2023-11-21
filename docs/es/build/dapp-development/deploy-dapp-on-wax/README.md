---
title: Despliega Tu dApp en WAX
order: 70
---

# Despliega Tu dApp en WAX

Para desplegar tu dApp en WAX, necesitarás usar [WAX-CDT](/es/build/dapp-development/wax-cdt/) y [Herramientas de Blockchain](/es/build/tools/blockchain_tools/) para:

- Compilar tus contratos inteligentes
- Crear cuentas en la Blockchain de WAX para cada uno de tus contratos
- Desplegar tus contratos inteligentes en la Blockchain de WAX

WAX proporciona dos maneras de lograr estos pasos de despliegue. Puedes usar nuestros scripts **make** personalizados (recomendado para desarrolladores de EOS) o usar las herramientas de WAX-CDT desde tu contenedor Docker local o instalación. A continuación, se presenta una lista de beneficios y requisitos para cada opción.

## Scripts Personalizados de Despliegue

El <a href="https://github.com/worldwide-asset-exchange/wax-blockchain" target="_blank">Repositorio de Código Fuente de WAX</a> incluye un contrato de muestra **hello-world**, junto con scripts **make** que proporcionan una manera fácil y automatizada de construir y desplegar tus contratos inteligentes. Estos scripts utilizan la <a href="https://hub.docker.com/r/waxteam/dev" target="_blank">imagen de Desarrollo Docker de WAX</a> para:

- Crear un archivo WASM y ABI
- Crear una cuenta en la Blockchain de WAX para tu contrato inteligente
- Desplegar tu contrato inteligente en WAX
- Probar tu contrato inteligente en la Blockchain de WAX

### Ventajas

- Te permite desplegar un contrato inteligente desde un contenedor Docker, sin necesidad de instalar ningún código fuente de WAX (aún necesitarás descargar el código fuente y los scripts de **hello-world** del <a href="https://github.com/worldwide-asset-exchange/wax-blockchain" target="_blank">Repositorio de Código Fuente de WAX</a>).
- Puedes ejecutar los scripts **make** personalizables desde el directorio de tu contrato inteligente, sin necesidad de pasar rutas a tus archivos WASM y ABI.

### Lo que Necesitarás:

- Docker debe estar instalado y configurado para ejecutarse sin sudo. Usuarios de Linux, consulten <a href="https://docs.docker.com/install/linux/linux-postinstall/" target="_blank">Pasos post-instalación para Linux</a> para más información.

  :::tip
  <strong>Usuarios del Subsistema de Windows para Linux:</strong> Los requisitos de configuración e instalación de Docker variarán dependiendo de tu versión de WSL. Recomendado solo para usuarios avanzados de Docker/Windows. Si estás ejecutando WSL 2, consulta <a href="https://docs.docker.com/docker-for-windows/wsl-tech-preview/" target="_blank">Docker Desktop WSL 2 Tech Preview</a> para más información.
  :::

- make (VERSIÓN 3.9 +)
- Una cuenta de Blockchain de WAX autogestionada y su clave privada (para desplegar el contrato).

## Despliegue Docker (WAX-CDT)

Si prefieres, puedes desplegar tus contratos inteligentes desde la línea de comandos utilizando las herramientas de WAX-CDT.

### Ventajas

- Permite un mayor control sobre el proceso de construcción y los parámetros de despliegue. Consulta [Opciones de WAX-CDT](/es/build/tools/cdt_options/) para más información.
- Si usaste **eosio-init** para [Crear un Contrato Inteligente](/es/build/dapp-development/wax-cdt/cdt_use.html#compile-hello-world/) y desplegarlo en tu blockchain local, esta podría ser una buena opción para ti.
- Compatible para usuarios de Windows.

### Lo que Necesitarás

Para usar esta opción, necesitarás:

- Completar nuestra [Guía de Inicio Rápido Docker](/es/build/dapp-development/docker-setup/) (recomendado) o usar la [Configuración de la Blockchain de WAX](/es/build/dapp-development/wax-blockchain-setup/) para construir desde el código fuente.
- Usar el [Kit de Herramientas de Desarrollo de Contratos de WAX (WAX-CDT)](/es/build/dapp-development/wax-cdt/) para compilar tus contratos inteligentes.

## Antes de Empezar

Independientemente de la opción de despliegue que elijas, necesitarás:

- Crear una Cuenta de Blockchain de WAX autogestionada.
- Asegurarte de tener suficiente WAX apostado en tu cuenta para asignar recursos.

<ChildTableOfContents :max="2" title="Más contenidos de esta sección" />