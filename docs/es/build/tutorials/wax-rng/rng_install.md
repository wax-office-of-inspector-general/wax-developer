---
title: Instalar y Construir WAX RNG
order: 81
---

# Instalar y Construir WAX RNG

Para instalar <a href="https://github.com/worldwide-asset-exchange/wax-orng" target="_blank">WAX RNG</a> desde GitHub:

1. Desde la línea de comandos, clona el repositorio de Git.

    ```shell
    git clone https://github.com/worldwide-asset-exchange/wax-orng.git
    ```

## Construir el Contrato Inteligente WAX RNG y las Pruebas Unitarias

El repositorio de GitHub de <a href="https://github.com/worldwide-asset-exchange/wax-orng" target="_blank">WAX RNG</a> incluye el código fuente de WAX RNG y varias pruebas unitarias.

* **src:** Código del contrato inteligente RNG.
* **tests:** Código fuente de las pruebas unitarias.

Para construir estos contratos inteligentes con nuestra imagen de Docker y scripts **make**:

1. Desde la línea de comandos, cambia el directorio a **wax-orng**.

    ```shell
    cd wax-orng
    ```

2. Inicia el docker de desarrollo.

    ```shell
    make dev-docker-start
    ```

3. A continuación, tienes dos opciones.

    1. Construir los contratos inteligentes y las pruebas unitarias.

        ```shell
        make build
        ```

        Ejecutar pruebas

        ```shell
        make test
        ```

    2. Opcional, construir y probar.

        ```shell
        make all
        ```

4. Limpiar todo y salir.

    ```shell
    make clean
    ```

    ```shell
    exit
    ```
