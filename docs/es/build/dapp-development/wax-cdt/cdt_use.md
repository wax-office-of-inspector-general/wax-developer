---
title: Contratos de Muestra WAX-CDT
order: 52
---

# Contratos de Muestra WAX-CDT

WAX-CDT ofrece un directorio **wax-cdt/examples** que incluye los siguientes contratos inteligentes de muestra:

-   Hola Mundo
-   Ejemplo de multi_index
-   Ejemplo de Transacción en Línea

Cada proyecto incluye dos archivos **CMakeLists.txt**: uno en el directorio raíz del proyecto y el otro en el directorio **src** del proyecto. Puedes usar estos archivos para generar automáticamente archivos WASM y ABI para los proyectos de muestra.

En este tutorial, aprenderás a usar los scripts de **make** para construir el ejemplo de Hola Mundo.

:::warning
<strong>Nota:</strong> Estas muestras se crearon con **eosio-init** (parte de la suite de herramientas [Opciones de WAX-CDT](/es/build/tools/cdt_options)). Consulta [Crear un Contrato Inteligente](/es/build/dapp-development/wax-cdt/cdt_use.html#compile-hello-world) para personalizar estos scripts para tus contratos inteligentes.
:::

## Compilar Hola Mundo

Para compilar el ejemplo de Hola Mundo:

1. Desde la línea de comandos, navega a **wax-cdt/examples/hello**.

    ```shell
    cd wax-cdt/examples/hello
    ```

2. Crea un directorio **build**.

    ```shell
    mkdir build
    ```

:::warning
<strong>Nota:</strong> Por defecto, <strong>eosio-init</strong> crea un directorio de construcción. Como este directorio está vacío, no se sube a Git. Si usas <strong>eosio-init</strong> para [Crear un Contrato Inteligente](/es/build/dapp-development/wax-cdt/cdt_use.html#compile-hello-world), podrás saltarte este paso.
:::

3. Navega al directorio **build**.

    ```shell
    cd build
    ```

4. Inicializa cmake desde el directorio **wax-cdt/examples/hello** para escribir los archivos de construcción necesarios en el directorio **build**.

    ```shell
    cmake ..
    ```

    La consola imprime las siguientes tareas de construcción:

    ```shell
    -- The C compiler identification is GNU 7.4.0
    -- The CXX compiler identification is GNU 7.4.0
    -- Check for working C compiler: /usr/bin/cc
    -- Check for working C compiler: /usr/bin/cc -- works
    -- Detecting C compiler ABI info
    -- Detecting C compiler ABI info - done
    -- Detecting C compile features
    -- Detecting C compile features - done
    -- Check for working CXX compiler: /usr/bin/c++
    -- Check for working CXX compiler: /usr/bin/c++ -- works
    -- Detecting CXX compiler ABI info
    -- Detecting CXX compiler ABI info - done
    -- Detecting CXX compile features
    -- Detecting CXX compile features - done
    -- Setting up Eosio Wasm Toolchain 1.6.1 at /usr/local/eosio.cdt
    CMake Warning (dev) in CMakeLists.txt:
      No cmake_minimum_required command is present.  A line of code such as

        cmake_minimum_required(VERSION 3.10)

      should be added at the top of the file.  The version specified may be lower
      if you wish to support older CMake versions for this project.  For more
      information run "cmake --help-policy CMP0000".
    This warning is for project developers.  Use -Wno-dev to suppress it.

    -- Configuring done
    -- Generating done
    -- Build files have been written to: waxblockchain/wax-blockchain/wax-cdt/examples/hello/build
    ```

5. Construye los scripts.

    ```shell
    make
    ```

    La consola imprime la siguiente confirmación:

    ```shell
    [  5%] Performing build step for 'hello_project'
    [100%] Built target hello
    [ 11%] No install step for 'hello_project'
    [ 16%] No test step for 'hello_project'
    [ 22%] Completed 'hello_project'
    [ 50%] Built target hello_project
    [ 55%] Performing configure step for 'hello_tests_project'
    ```

Ahora deberías poder localizar los archivos **hello.wasm** y **hello.abi** en el directorio **build/hello**.
