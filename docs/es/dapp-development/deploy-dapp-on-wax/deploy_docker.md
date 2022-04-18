---
title: Despliegue de Docker
layout: default
nav_order: 72
parent: Deploy Your dApp on WAX
grand_parent: dApp Development
lang-ref: Docker Deploy
lang: es
---

En esta guía, aprenderás a personalizar los scripts de construcción de **hello-world** para desplegar tus contratos inteligentes en la mainnet de WAX.

Antes de empezar:

* Asegúrate de que Docker está configurado para ejecutarse sin sudo.
* Descarga el <a href="https://github.com/worldwide-asset-exchange/wax-blockchain" target="_blank">Código Fuente de la Blockchain de WAX</a>. Para más información, revisa la [Configuración de la Blockchain de WAX](/es/dapp-development/wax-blockchain-setup/).
* Ten disponibles las claves públicas/privadas de tu cuenta en la WAX Blockchain.
* Asegúrate de tener suficiente WAX en tu cuenta para asignar los recursos. 

<strong>Nota:</strong> No es necesario construir código fuente de WAX para completar estos pasos. 
{: .label .label-yellow }

## Modifica los scripts

Para modificar los scripts **hello-world** y desplegar tu contrato inteligente:

1. Desde la línea de comandos, encuentra la carpeta **hello-world** en el <a href="https://github.com/worldwide-asset-exchange/wax-blockchain" target="_blank">Repositorio de código fuente de la WAX Blockchain</a>:

    ```shell
    cd wax-blockchain/samples/hello-world
    ```

3. Copia el contenido de **hello-world** al directorio de tu contrato inteligente. Para este ejemplo, usaremos **wax_deploy**. 

4. Desde **wax_deploy**, abre **CMakeLists.txt**. Este archivo almacena el nombre de tu proyecto y el nombre del archivo del contrato inteligente.

    a. Escribe el nombre de tu contrato en la línea 25.
    ```shell
    project(waxcontract)
    ```

    b. Escribe el nombre del archivo de tu contrato en la línea 29.

    ```shell
    add_contract(${PROJECT_NAME} ${PROJECT_NAME} waxcontract.cpp)
    ```

    Guarda el archivo.

5. A continuación, abre **Makefile**. Este archivo contiene los scripts para ejecutar `cleos` y la imagen WAX Docker Development.

    a. Escribe el nombre de tu contrato en la línea 23.
    ```shell
    CONTRACT_NAME = waxcontract
    ```

    b. Si es necesario, actualiza las asignaciones de WAX para tu contrato inteligente en la línea 87.
    ```shell
    --stake-net '0.50000000 WAX' --stake-cpu '0.50000000 WAX' --buy-ram-kbytes 32"
    ```

    c. Para probar tu contrato inteligente, puedes actualizar la línea 48 para ejecutar tu acción:

    ```shell
    push action ${CONTRACT_ACCOUNT} greet '[]' -p ${CONTRACT_ACCOUNT}@active"
    ```

    Guarda el archivo.


    <strong>Nota:</strong> `NODEOS_URL` es el único parámetro opcional. Su valor por defecto es la dirección de despliegue de la mainnet https://chain.wax.io/.  
    {: .label .label-yellow }

Una vez realizados estos cambios, ya tienes todo listo para utilizar los scripts `make` y crear y desplegar tu contrato inteligente.

## Despliega tu contrato inteligente

Para lanzar tu contrato inteligente en la Blockchain de WAX:

1. **Crea tu contrato inteligente.** En la línea de comandos, ejecuta el siguiente script desde la carpeta **wax_deploy**:

    ```shell
    make build
    ```

    Esto hará que se creen los archivos `wax.wasm` y `wax.abi` en la carpeta **wax_deploy**.

2. **Genera claves para la cuenta de tu contrato inteligente.** Desde la línea de comandos, ejecuta:

    ```shell
    make create-key
    ```

    Esto crea un par de claves privadas/públicas para la cuenta de tu contrato inteligente (guarda la respuesta de la consola en un lugar seguro, las necesitarás más tarde).

4. **Crea una cuenta de contrato WAX.** Para crear una cuenta de blockchain para tu contrato inteligente, ejecuta:

    <table>
    <thead>
    <tr>
    <th style="width:28%">Parameter</th>
    <th>Example</th>
    <th>Description</th>
    </tr>
    </thead>

    <tbody>
    <tr>
    <td>WAX_ACCOUNT</td>
    <td>waxprimary</td>
    <td>El nombre de tu cuenta de desarrollador de dApp.</td>
    </tr>

    <tr>
    <td>WAX_PRIVATE_KEY</td>
    <td>5JTZaN1zabi5wyC3LcdeZG3AzF7sLDX4JFqMDe68ThLC3Q5nYez</td>
    <td>Clave privada para tu cuenta de desarrollador de dApp.</td>
    </tr>

    <tr>
    <td>CONTRACT_ACCOUNT</td>
    <td>waxsc1</td>
    <td>Especifica un nuevo nombre para tu cuenta de contrato inteligente. Los nombres de las cuentas deben tener menos de 13 caracteres y sólo contener letras [a-z] y números [1-5].</td>
    </tr>

    <tr>
    <td>CONTRACT_PUBLIC_KEY</td>
    <td>EOS4yxqE5KYv5XaB2gj6sZTUDiGzKm42KfiRPDCeXWZUsAZZVXk1F</td>
    <td>Nueva clave pública creada en el paso 2.</td>
    </tr>
    </tbody>
    </table>
 
    ```shell
    make create-account WAX_ACCOUNT=waxprimary WAX_PRIVATE_KEY=5JTZaN1zabi5wyC3LcdeZG3AzF7sLDX4JFqMDe68ThLC3Q5nYez CONTRACT_ACCOUNT=waxsc1 CONTRACT_PUBLIC_KEY=EOS4yxqE5KYv5XaB2gj6sZTUDiGzKm42KfiRPDCeXWZUsAZZVXk1F
    ```

5. **Despliega tu contrato.** Desde la línea de comandos, ejecuta: 

    <table>
    <thead>
    <tr>
    <th style="width:28%">Parameter</th>
    <th>Example</th>
    <th>Description</th>
    </tr>
    </thead>

    <tbody>
    <tr>
    <td>CONTRACT_ACCOUNT</td>
    <td>waxsc1</td>
    <td>El nombre que especificaste para la cuenta de tu contrato inteligente.</td>
    </tr>

    <tr>
    <td>CONTRACT_PRIVATE_KEY</td>
    <td>9X5KRXKVx25yjL3FvxxY9YxYxxYY9Yxx99yyXTRH8DjppKpD9tKtVz</td>
    <td>Clave privada de la cuenta de tu contrato inteligente (que creaste en el paso 2).</td>
    </tr>
    </tbody>
    </table>

    ```shell
    make deploy CONTRACT_ACCOUNT=waxsc1 CONTRACT_PRIVATE_KEY=9X5KRXKVx25yjL3FvxxY9YxYxxYY9Yxx99yyXTRH8DjppKpD9tKtVz
    ```

    Esto desplegará tu contrato inteligente en la red principal. Solo tienes que pasar el nombre de la cuenta y la clave privada de tu contrato inteligente.

5. **Prueba tu contrato inteligente.** Desde la línea de comandos, ejecuta:

    ```shell
    make test CONTRACT_ACCOUNT=waxsc1
    ```

¡Tu dApp ya está publicada en WAX! 

<strong>Nota:</strong> Dependiendo de cómo esté construido el proceso de incorporación de tu dApp, es posible que tus clientes tengan que crear una cuenta de WAX para usar tu dApp en WAX.
{: .label .label-yellow }

