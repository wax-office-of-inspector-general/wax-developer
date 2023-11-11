---
title: Crear un Contrato Inteligente
order: 62
---

# Crear un Contrato Inteligente

En esta sección, aprenderás cómo escribir y compilar un contrato inteligente WAX utilizando **eosio-init**.

## Cómo Funciona

**eosio-init** es una herramienta de WAX-CDT que crea la siguiente estructura de directorios/plantilla para contratos inteligentes:

- Carpeta **include**: Incluye un archivo **.hpp** de ejemplo.
- Carpeta **ricardian**: Incluye un archivo de contrato Ricardian en formato markdown.
- Carpeta **src**: Incluye un archivo de contrato inteligente **.cpp** de ejemplo.

Los archivos de plantilla se nombran según el nombre del proyecto que especifiques cuando usas **eosio-init** desde la línea de comandos.

## Usar eosio-init

Para crear tu primer contrato inteligente WAX usando **eosio-init**:

1. Crea un directorio para contratos inteligentes. Para este tutorial, usaremos una carpeta llamada **mycontracts**.

    ```shell
    mkdir mycontracts
    ```shell
    Navega a este nuevo directorio:
    ```shell
    cd mycontracts
    ```

2. Desde la línea de comandos, usa **eosio-init** con el parámetro `-project`.

    ```
    eosio-init -project wax
    ```

    **eosio-init** usa el nombre `-project` para crear la siguiente estructura de directorios:

    - mycontracts/wax/include 
    - mycontracts/wax/ricardian 
    - mycontracts/wax/src 

3. Opcional. Añade una [Cláusula Ricardian](/es/build/tools/ricardian_clause). Un [Contrato Ricardian](/es/build/tools/ricardian_contract) ya está incluido por defecto.

Ahora deberías tener una plantilla de contrato inteligente, incluyendo un contrato inteligente de ejemplo (mycontracts/wax/src/wax.cpp). Este contrato incluye la siguiente acción:

```
#include <wax.hpp>
ACTION wax::hi( name nm ) {
   /* rellena el cuerpo de la acción */
   print_f("Nombre: %\n", nm);
}
```

El archivo de encabezado (mycontracts/wax/include/wax.hpp) hereda de **<eosio/eosio.hpp>**.

```
// Hereda tu contrato de eosio::contract. 
// Esto expone los siguientes tipos de datos (disponibles para tu contrato inteligente):
// eosio::name receiver - el contrato que recibe una acción (este contrato)
// eosio::name code - la cuenta de blockchain del contrato
// eosio::datastream - los datos que se pasan al contrato. En este ejemplo, es tu nombre.
#include <eosio/eosio.hpp>
using namespace eosio;

CONTRACT wax : public contract {
   public:
      using contract::contract;

      // La palabra clave ACTION implementa el comportamiento de tu contrato. 
      // ACTION es un atajo para [[eosio::action]]  
      ACTION hi( name nm );

      //action_wrapper: primer parámetro = acción a llamar
      //segundo parámetro = puntero a la función de acción
      using hi_action = action_wrapper<"hi"_n, &wax::hi>;
};
```
:::tip
La estructura action_wrapper crea una plantilla/puntero basada en una acción específica. Puedes usar action_wrappers para hacer llamadas de acción de un contrato a otro. 
:::

## Compilar Tu Contrato

Para desplegar tu contrato inteligente, necesitarás crear un archivo `.wasm` y `.abi`. Puedes hacer esto utilizando el WAX Contract Development Toolkit (WAX-CDT).

1. Instala [WAX-CDT](/es/build/dapp-development/wax-cdt/) (si aún no lo has hecho).

2. Desde la línea de comandos, navega a la carpeta **mycontracts/wax** build.

    ```shell
    cd wax/build
    ```

3. Inicializa cmake para escribir los archivos de construcción necesarios en el directorio **build**.

    ```shell
    cmake ..
    ```

    La consola imprime las siguientes tareas de construcción:

    ```shell
    -- The C compiler identification is GNU 7.4.0
    -- The CXX compiler identification is GNU 7.4.0
    -- Check for working C compiler: /usr/bin/cc
    -- Check for working C compiler: /usr/bin/cc -- works
    -- Detecting

 C compiler ABI info
    -- Detecting C compiler ABI info - done
    ...
    -- Los archivos de construcción han sido escritos en: waxblockchain/wax-blockchain/wax-cdt/examples/hello/build
    ```

4. Construye los scripts.

    ```shell
    make
    ```

    La consola imprime la siguiente confirmación:

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