---
title: Despliegue con WAX-CDT
order: 73
---

# Despliegue con WAX-CDT

En esta guía, usarás el comando `cleos set contract` para desplegar tu contrato inteligente en la mainnet de WAX.

Antes de comenzar, deberás compilar tu contrato inteligente y tener listos tus archivos WASM y ABI. Consulta [Inicio Rápido de Contrato Inteligente](/es/build/dapp-development/smart-contract-quickstart/) o [Herramientas de Construcción WAX-CDT](/es/build/dapp-development/wax-cdt/cdt_cpp) para más información.

También necesitarás:

* Crear una Cuenta de Blockchain de WAX autogestionada.
* Asegurarte de tener suficiente WAX apostado en tu cuenta para asignar recursos.

Para desplegar tu contrato inteligente en la mainnet de WAX:

1. Abre y desbloquea tu billetera.

    ```shell
    cleos wallet open -n mywallet && cleos wallet unlock -n mywallet --password {wallet.pwd}
    ```

2. Genera un par de claves pública/privada que se utilizará para crear la cuenta de blockchain de tu contrato inteligente. Desde la línea de comandos, utiliza el comando `cleos create key`:

    ```shell
    cleos wallet create_key -n mywallet
    ```

:::tip
También puedes usar una billetera compatible con EOSIO (por ejemplo, Scatter).
:::

3. Desde la línea de comandos, usa `cleos system newaccount` para crear la cuenta de tu contrato inteligente. Para ejecutar este comando, necesitarás tener la autoridad adecuada. Esto significa que la billetera que contiene tu cuenta principal debe estar abierta y desbloqueada.

    | Parámetro         | Ejemplo                                                        | Descripción                                        |
    |-------------------|----------------------------------------------------------------|----------------------------------------------------|
    | -u                | -u [chain-api-url](/operate/wax-infrastructure/#public-and-free-api-service-providers) | Esta es la URL de la Blockchain de WAX.            |
    | system            | system                                                         | Envía la acción del contrato del sistema a la Blockchain de WAX. |
    | newaccount        | newaccount                                                     | Comando para crear una nueva cuenta.               |
    | primaryAccount    | waxdappacct1                                                   | Tu Cuenta de Blockchain de WAX autogestionada con WAX apostado. |
    | contractAccount   | HelloWorld10                                                   | Nombre de la cuenta de tu contrato inteligente. Exactamente 12 caracteres de (a-z1-5). |
    | newPublicKey      | EOS7jEb46pDiWvA39faCoFn3jUdn6LfL51irdXbvfpuSko86iNU5x            | Esta es la clave pública que creaste en el Paso 1. |
    | stake-net         | --stake-net '0.50000000 WAX'                                   | Cantidad de WAX para apostar por NET.              |
    | stake-cpu         | --stake-cpu '0.50000000 WAX'                                   | Cantidad de WAX para asignar a CPU.                |
    | buy-ram-kbytes    | --buy-ram-kbytes 32                                            | Cantidad de RAM para asignar.                      |

    ### Ejemplo
    ```shell
    cleos -u chain-api-url system newaccount waxdappacct1 HelloWorld10 EOS7jEb46pDiWvA39faCoFn3jUdn6LfL51irdXbvfpuSko86iNU5x --stake-net '0.50000000 WAX' --stake-cpu '0.50000000 WAX' --buy-ram-kbytes 32
    ```

:::tip
Necesitarás repetir los Pasos 1 y 2 para cada uno de tus contratos.
:::

4. **Despliegue.** Desde la línea de comandos, establece tu contrato con el comando `cleos set contract`:

    | Parámetro         | Ejemplo                                                        | Descripción                                        |
    | ----------------- | -------------------------------------------------------------- | -------------------------------------------------- |
    | -u                | -u [chain-api-url](/es/operate/wax-infrastructure/#public-and-free-api-service-providers/) | Esta es la URL de la Blockchain de WAX.            |
    | contractAccount   | HelloWorld10                                                   | La cuenta de tu contrato inteligente (creada en el Paso 2). |
    | fullPath          | d/wax-blockchain/wax-cdt/my

contracts/wax/build                  | La ruta completa a tus archivos WASM y ABI.       |
    | wasmName          | wax                                                            | Nombre de tu archivo WASM.                        |
    | abiName           | wax                                                            | Nombre de tu archivo ABI.                         |

    ```shell
    cleos -u chain-api-url set contract HelloWorld10 d/wax-blockchain/wax-cdt/mycontracts/wax/build wax.wasm wax.abi
    ```

¡Tu dApp ya está en vivo en WAX!

:::tip
Dependiendo de cómo esté construido el proceso de incorporación de tu dApp, tus clientes pueden necesitar crear una Cuenta WAX para usar tu dApp en WAX.
:::