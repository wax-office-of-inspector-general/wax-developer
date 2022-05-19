---
title: Crear un Smart Contract
layout: default
nav_order: 62
parent: Smart Contract Quickstart
grand_parent: dApp Development
lang-ref: Create a Smart Contract
lang: es
---
# Crear un Smart Contract

En esta sección, aprenderás a escribir y compilar un contrato inteligente de WAX usando **eosio-init**.

## Cómo funciona

**eosio-init** es una herramienta de WAX-CDT que crea la siguiente plantilla/directorio de contrato inteligente:

- Carpeta **include**: Incluye una muestra de archivo **.hpp**.
- Carpeta **ricardian**: Incluye un archivo de muestra de contratos ricardianos.
- Carpeta **src**: Incluye un archivo de muestra **.cpp** de un contrato inteligente.

Los archivos plantilla se denominan con el nombre del proyecto que se especifica cuando se utiliza **eosio-init** en la línea de comandos. 

## Usar eosio-init

Para crear tu primer contrato inteligente WAX usando **eosio-init**:

1. Crea un directorio de contratos inteligentes. Para este tutorial, usaremos una carpeta llamada **mycontracts**.

    ```shell
    mkdir mycontracts
    ```shell
    Accede a este nuevo directorio:
    ```shell
    cd mycontracts
    ```

2. Desde la línea de comandos, utiliza **eosio-init** con el parámetro `project`.

    ```
    eosio-init -project wax
    ```

    **eosio-init** utiliza el nombre del `proyecto` para crear la siguiente estructura de directorios:

    - mycontracts/wax/include 
    - mycontracts/wax/ricardian 
    - mycontracts/wax/src 

3. Opcional. Añade una [Cláusula ricardiana](/en/tools/ricardian_clause). Por defecto, ya se incluye un  [contrato ricardiano](/en/tools/ricardian_contract).

Ahora deberías tener una plantilla de contrato inteligente, incluyendo un contrato inteligente de ejemplo (mycontracts/wax/src/wax.cpp). Este contrato incluye la siguiente acción:

```
#include <wax.hpp>
ACTION wax::hi( name nm ) {
   /* fill in action body */
   print_f("Name : %\n",nm);
}
```

El archivo de cabecera (mycontracts/wax/include/wax.hpp) hereda de **<eosio/eosio.hpp>**.

```
// Inherit your contract from eosio::contract. 
// This exposes the following data types (available to your smart contract):
// eosio::name receiver - the contract that receives an action (this contract)
// eosio::name code - the contract's blockchain account
// eosio::datastream - the data that's passed to the contract. In this example, it's  your name.
#include <eosio/eosio.hpp>
using namespace eosio;

CONTRACT wax : public contract {
   public:
      using contract::contract;

      // The ACTION keyword implements the behavior of your contract. 
      // ACTION is a shortcut for [[eosio::action]]  
      ACTION hi( name nm );

      //action_wrapper: first parameter = action to call
      //second parameter = pointer to the action function
      using hi_action = action_wrapper<"hi"_n, &wax::hi>;
};
```

<strong>Consejo:</strong> La estructura action_wrapper crea una plantilla/puntero basada en una acción específica. Puedes usar action_wrappers para hacer llamadas de acción de un contrato a otro. 
{: .label .label-yellow }

<!--
<span>Tip: </span>Make sure that your class name and file names match.

```
// Required. eosio.hpp includes the classes required to write a smart contract and sign transactions on the WAX blockchain. 
#include <eosiolib/eosio.hpp>

// Inherit your contract from eosio::contract. 
// eosio::name receiver is the contract that receives an action (this contract)
// eosio::name code is the contract's blockchain account
// eosio::datastream is the data that's passed to the contract. In this example, there is no data. 
CONTRACT wax: public eosio::contract {
public:
    wax(eosio::name receiver, eosio::name code, eosio::datastream<const char*> ds)
        : contract(receiver, code, ds) {
    }

    // The ACTION keyword implements the behavior of your contract. 
    // ACTION is a shortcut for [[eosio::action]]
    ACTION greet() {
        // eosio::print returns a string to the console. 
        eosio::print("Hello World!\n");
    }
};

// A dispatcher function that listens to all incoming actions and performs the designated functions in your smart contract.
// If this contract included a 'goodbye' action, you could change this function to:
// EOSIO_DISPATCH(wax, (greet)(goodbye))
EOSIO_DISPATCH(wax, (greet))
```-->


## Redacta tu contrato

Para desplegar tu contrato inteligente, necesitarás crear un archivo `.wasm` y `.abi`. Puedes hacerlo utilizando el Kit de herramientas de desarrollo de WAX (WAX Contract Development Toolkit o WAX-CDT).

1. Instala el [WAX-CDT](/es/dapp-development/wax-cdt/) (si no lo habías hecho antes).

2. Desde la línea de comandos, ve a la carpeta de construcción **mycontracts/wax**.

    ```shell
    cd wax/build
    ```

3. Inicializa cmake para que escriba los archivos de construcción necesarios en el directorio **build**.

    ```shell
    cmake ..
    ```

    La consola mostrará las siguientes tareas de construcción:

    ```shell
    -- The C compiler identification is GNU 7.4.0
    -- The CXX compiler identification is GNU 7.4.0
    -- Check for working C compiler: /usr/bin/cc
    -- Check for working C compiler: /usr/bin/cc -- works
    -- Detecting C compiler ABI info
    -- Detecting C compiler ABI info - done
    ...
    -- Build files have been written to: waxblockchain/wax-blockchain/wax-cdt/examples/hello/build
    ```

4. Crea los scripts.

    ```shell
    make
    ```

    La consola mostrará la siguiente confirmación:

    ```shell
    Scanning dependencies of target wax
    [ 50%] Building CXX object CMakeFiles/wax.dir/wax.obj
    Warning, empty ricardian clause file
    [100%] Linking CXX executable wax.wasm
    [100%] Built target wax
    [ 77%] No install step for 'wax_project'
    [ 88%] No test step for 'wax_project'
    [100%] Completed 'wax_project'
    [100%] Built target wax_project
    ```

Puedes localizar los archivos **wax.wasm** y **wax.abi** en el directorio **build/wax**. 

