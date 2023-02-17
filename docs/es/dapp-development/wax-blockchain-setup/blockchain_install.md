---
title: Instala la blockchain de WAX
nav_order: 31
layout: default
parent: WAX Blockchain Setup
grand_parent: dApp Development
lang-ref: Install the WAX Blockchain
lang: es-ES
---

El repositorio de código fuente de la WAX Blockchain de GitHub se descarga en el directorio **wax-blockchain**. El proceso de descarga y construcción puede durar desde varios minutos hasta varias horas, dependiendo de tu conexión a Internet, el sistema operativo y las especificaciones del hardware.

Sigue estos pasos para descargar el repositorio del código fuente:

1. Clona el repositorio de Git desde la línea de comandos.

    ```shell
    git clone https://github.com/worldwide-asset-exchange/wax-blockchain.git
    ```

2. Cambia el directorio a **wax-blockchain**.

    ```shell
    cd wax-blockchain
    ```

3. Actualiza los submódulos de Git.

    ```shell
    git submodule update --init --recursive
    ```

## Construye la blockchain de WAX

Si estás usando nuestras imágenes Docker, **no es necesario** qie realices estos pasos.

Para construir la blockchain a partir del código fuente, puedes seguir las siguientes instrucciones. Si tienes instalada una versión previa, tendrás que desinstalarla antes. Puedes obtener más información sobre la desinstalación en [Desinstalar WAX](/es/tutorials/blockchain_uninstall).

<strong>Importante:</strong> Si tienes cualquier problema con la construcción, visita la guía [Problemas frecuentes](/es/troubleshooting/) o usa nuestras [Imágenes Docker](/es/dapp-development/docker-setup/) (recomendado). No se admite la construcción desde el código fuente. 
{: .label .label-yellow }

1. Ejecuta el build script y establece el directorio de instalación. 

    ```shell
    ./wax_build.sh -i ~/wax-blockchain
    ```

    <strong>Consejo:</strong> Esto hará que se instalen las [Herramientas de la blockchain](/es/tools/blockchain_tools) en el directorio <strong>wax-blockchain/bin</strong>.
    {: .label .label-yellow }

2. Instala WAX en el directorio que creaste en el Paso 4.

    ```shell
    ./wax_install.sh
    ```

3. Opcional: añade a tu ruta el directorio de las herramientas de la blockchain.

    ```shell
    echo "export PATH=~/wax-blockchain/bin:$PATH" >> ~/.bashrc && source ~/.bashrc
    ```







