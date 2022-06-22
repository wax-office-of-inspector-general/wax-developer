---
title: Despliegue de WAX-CDT
layout: default
nav_order: 73
parent: Deploy Your dApp on WAX
grand_parent: dApp Development
lang-ref: WAX-CDT Deploy
lang: es
---

En esta guía, utilizarás el comando `cleos set contract` para desplegar tu contrato inteligente en la mainnet de WAX.

Antes de empezar, tendrás que compilar tu contrato inteligente y tener listos tus archivos WASM y ABI. Para obtener más información al respecto, dirígete al [Inicio rápido del contrato inteligente](/es/dapp-development/smart-contract-quickstart) o consulta las [Herramientas de construcción de WAX-CDT](/es/dapp-development/wax-cdt/cdt_cpp).

También necesitarás:

* Crear una cuenta autogestionada en la WAX Blockchain. 
* Asegurarte de que tienes suficiente WAX acumulado en tu cuenta para asignar recursos.

Para desplegar tu contrato inteligente en la mainnet de WAX:

1. Abre y desbloquea tu cartera.

    ```shell
    cleos wallet open -n mywallet && cleos wallet unlock -n mywallet --password {wallet.pwd}
    ```

2. Genera un par de claves públicas/privadas que usarás para crear la cuenta de blockchain de tu contrato inteligente. Desde la línea de comandos, utiliza el comando `cleos create key`:

    ```shell
    cleos wallet create_key -n mywallet
    ```

    <strong>Nota:</strong> También puedes utilizar una cartera compatible con EOSIO (como Scatter, por ejemplo).
    {: .label .label-yellow }

3. Desde la línea de comandos, utiliza `cleos system newaccount` para crear la cuenta de tu contrato inteligente. Para ejecutar este comando, necesitarás tener autoridad sobre la cartera que contiene tu cuenta principal, lo que significa que debe estar abierta y desbloqueada. 

    <table>
    <thead>
    <tr>
    <th style="width:25%">Parámetro</th>
    <th>Ejemplo</th>
    <th>Descripción</th>
    </tr>
    </thead>

    <tbody>
    <tr>
    <td>-u</td>
    <td>-u <a href="/en/wax-infra/#public-and-free-api-service-providers">[chain-api-url]</a></td>
    <td>Esta es la URL de la Blockchain de WAX.</td>
    </tr>

    <tr>
    <td>system</td>
    <td>system</td>
    <td>Envía la acción del contrato del sistema a la Blockchain de WAX.</td>
    </tr>

    <tr>
    <td>newaccount</td>
    <td>newaccount</td>
    <td>Comando para crear una nueva cuenta.</td>
    </tr>

    <tr>
    <td>primaryAccount</td>
    <td>waxdappacct1</td>
    <td>Tu cuenta autogestionada de la Blockchain de WAX con tokens WAX acumulados.</td>
    </tr>

    <tr>
    <td>contractAccount</td>
    <td>HelloWorld10</td>
    <td>Nombre de la cuenta de tu contrato inteligente. Debe contener exactamente 12 caracteres de (a-z, 1-5).</td>
    </tr>

    <tr>
    <td>newPublicKey</td>
    <td>EOS7jEb46pDiWvA39faCoFn3jUdn6LfL51irdXbvfpuSko86iNU5x</td>
    <td>Esta es la clave pública que creaste en el paso 1.</td>
    </tr>

    <tr>
    <td>stake-net</td>
    <td>--stake-net '0.50000000 WAX'</td>
    <td>Cantidad de WAX para apostar por la NET.</td>
    </tr>

    <tr>
    <td>stake-cpu</td>
    <td>--stake-cpu '0.50000000 WAX'</td>
    <td>Cantidad de WAX para distribuir a la CPU.</td>
    </tr>

    <tr>
    <td>buy-ram-kbytes</td>
    <td>--buy-ram-kbytes 32</td>
    <td>Cantidad de RAM para distribuir.</td>
    </tr>
    </tbody>
    </table>

    ### Ejemplo
    ```shell
    cleos -u [chain-api-url] system newaccount waxdappacct1 HelloWorld10 EOS7jEb46pDiWvA39faCoFn3jUdn6LfL51irdXbvfpuSko86iNU5x --stake-net '0.50000000 WAX' --stake-cpu '0.50000000 WAX' --buy-ram-kbytes 32
    ```

    <strong>Nota:</strong> Tendrás que repetir los pasos 1 y 2 en cada uno de tus contratos. 
    {: .label .label-yellow }

4. **Despliegue.** Desde la línea de comandos, establece tu contrato con el comando `cleos set contract`: 

    | Parámetro | Ejemplo | Descripción
    | --- | ----------- | -------------------------- |
    | -u | -u https://[chain-api-url](/en/wax-infra/#public-and-free-api-service-providers) | Esta es la URL de la Blockchain de WAX. |
    | contractAccount| HelloWorld10 | La cuenta de tu contrato inteligente (creada en el paso 2). |
    | fullPath | d/wax-blockchain/wax-cdt/mycontracts/wax/build | La ruta completa de tus archivos WASM y ABI. |
    | wasmName | wax | Nombre de tu archivo WASM. |
    | abiName | wax | Nombre de tu archivo ABI. |

    ```shell
    cleos -u [chain-api-url] set contract HelloWorld10 d/wax-blockchain/wax-cdt/mycontracts/wax/build wax.wasm wax.abi
    ```

¡Tu dApp ya está en WAX! 

<strong>Nota:</strong> Dependiendo de cómo esté construido el proceso de incorporación de tu dApp, es posible que tus clientes tengan que crear una cuenta de WAX para usar tu dApp en WAX.
{: .label .label-yellow }