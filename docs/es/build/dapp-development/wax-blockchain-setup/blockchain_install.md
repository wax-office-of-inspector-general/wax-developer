---
title: Instalar la Blockchain WAX
order: 31
---

# Instalar la Blockchain WAX

El Repositorio de Código Fuente de la Blockchain WAX en GitHub se descarga en el directorio **wax-blockchain**. El proceso de descarga y construcción puede tardar varios minutos o varias horas, dependiendo de tu conexión a Internet, sistema operativo y especificaciones de hardware.

Para descargar el Repositorio de Código Fuente de la Blockchain WAX:

1. Desde la línea de comandos, clona el repositorio de Git.

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

## Construir la Blockchain WAX

Si estás utilizando nuestras imágenes de Docker, **no** necesitas completar estos pasos.

Para construir la Blockchain WAX desde el código fuente, puedes utilizar los siguientes pasos. Si tienes una versión anterior instalada, necesitarás desinstalarla primero. Consulta [Desinstalar WAX](/es/build/dapp-development/wax-blockchain-setup/blockchain_uninstall) para obtener más información.

1. Ejecuta el script de construcción y establece el directorio de instalación.

    ```shell
    ./wax_build.sh -i ~/wax-blockchain
    ```

:::tip
Esto instala [Herramientas de Blockchain](/es/build/tools/blockchain_tools) en el directorio <strong>wax-blockchain/bin</strong>.
:::

2. Instala WAX en el directorio que estableciste en el paso 4.

    ```shell
    ./wax_install.sh
    ```

3. Opcional. Añade el directorio de herramientas de blockchain a tu ruta.

    ```shell
    echo "export PATH=~/wax-blockchain/bin:$PATH" >> ~/.bashrc && source ~/.bashrc
    ```
