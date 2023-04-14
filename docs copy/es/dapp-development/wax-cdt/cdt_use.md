---
title: Contratos de muestra WAX-CDT
layout: default
nav_order: 52
parent: WAX Contract Development Toolkit
grand_parent: dApp Development
lang-ref: WAX-CDT Sample Contracts
lang: es-ES
---

WAX-CDT contiene un directorio, **wax-cdt/examples**, que incluye los siguientes ejemplos de contratos inteligentes:

- Hello World
- Ejemplo multi_index 
- Ejemplo de Inline Transaction (transacción inline)

Cada proyecto incluye dos archivos **CMakeLists.txt**: uno en el directorio raíz y el otro en el directorio **src**. Puedes utilizarlos para generar automáticamente archivos WASM y ABI en los proyectos de ejemplo.

En este tutorial, aprenderás a utilizar los scripts **make** para crear el ejemplo de Hello World.

<strong>Nota:</strong> Estos ejemplos están creados con **eosio-init**, que forma parte del paquete de herramientas de [opciones de WAX-CDT](/es/tools/cdt_options). Para customizar estos scripts para tus propios contratos, visita la entrada [Crear un contrato inteligente](/es/dapp-development/wax-cdt/cdt_use.html#compile-hello-world).
{: .label .label-yellow }

## Compila el Hello World

Para compilar el ejemplo Hello World:

1. En la línea de comandos, accede a **wax-cdt/examples/hello**.

    ```shell
    cd wax-cdt/examples/hello
    ```

2. Crea un directorio **build**.

    ```shell
    mkdir build
    ```

    <strong>Nota:</strong> Por defecto, <strong>eosio-init</strong> crea un directorio build vacío. Al estar vacío, el directorio no se carga en Git. Si usas <strong>eosio-init</strong> para [crear un contrato inteligente](/es/dapp-development/wax-cdt/cdt_use.html#compile-hello-world), puedes saltarte este paso. 
    {: .label .label-yellow }

3. Accede al directorio **build**.

    ```shell
    cd build
    ```

4. Inicializa cmake desde el directorio **wax-cdt/examples/hello** para escribir los archivos de construcción necesarios en el directorio **build**.

    ```shell
    cmake ..
    ```

    La consola mostrará las siguientes tareas build:

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

4. Crea el código.

    ```shell
    make
    ```

    The console prints the following confirmation:

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

<!--## Modify the Scripts and Build Your Project

If you didn't use eosio-init to create a smart contracts template (recommended), you can still use the CMake scripts to build your smart contract by making just a few modifications.

In the example below, we'll use the following directory structure:

- A **mycontracts** root directory
- A **mycontracts/wax** folder that contains the following:

    - wax.cpp
    - wax.contracts.md (optional Ricardian contract)
    - wax.clauses.md (optional Ricardian clause)

To customize the build scripts:

1. Copy **wax-cdt/examples/hello/CMakeLists.txt** into **mycontracts** (your parent smart contract directory). 

2. From **mycontracts**, open **CmakeLists.txt** and modify the `ExternalProject_Add` method. 

**mycontracts/CMakeLists.txt:**

```
include(ExternalProject)
# if no cdt root is given use default path
if(EOSIO_CDT_ROOT STREQUAL "" OR NOT EOSIO_CDT_ROOT)
   find_package(eosio.cdt)
endif()

ExternalProject_Add(
   wax_project
   SOURCE_DIR ${CMAKE_SOURCE_DIR}/wax
   BINARY_DIR ${CMAKE_BINARY_DIR}/wax
   CMAKE_ARGS -DCMAKE_TOOLCHAIN_FILE=${EOSIO_CDT_ROOT}/lib/cmake/eosio.cdt/EosioWasmToolchain.cmake
   UPDATE_COMMAND ""
   PATCH_COMMAND ""
   TEST_COMMAND ""
   INSTALL_COMMAND ""
   BUILD_ALWAYS 1
)
```

Save the file.

3. Copy **wax-cdt/examples/hello/src/CMakeLists.txt** into **mycontracts/wax**. 

**mycontracts/wax/CMakeLists.txt:**

```
project(wax)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract( wax wax wax.cpp )
target_include_directories( wax PUBLIC ${CMAKE_SOURCE_DIR} )
target_ricardian_directory( wax ${CMAKE_SOURCE_DIR} )
```

Save the file.

4. From the command line, navigate to **wax-cdt/mycontracts**.

```
cd wax-cdt/mycontracts
```

5. Create a **build** directory.

```
mkdir build
```

6. Navigate to the **build** directory.

```
cd build
```

7. Run `cmake` to write the necessary build files to the **build** directory.

```
cmake ..
```

8. Build the scripts. You might receive several warnings during this process.

```
make
```

You should now be able to locate the **wax.wasm** and **wax.abi** files in the **build/wax** directory. -->





