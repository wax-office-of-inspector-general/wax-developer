---
title: Despliegue con Docker
order: 72
---

# Despliegue con Docker

En esta guía, aprenderás a personalizar los scripts de construcción **hello-world** para desplegar tus contratos inteligentes en la mainnet de WAX.

Antes de comenzar:

-   Asegúrate de que Docker esté configurado para ejecutarse sin sudo.
-   Descarga el [Código Fuente de la Blockchain de WAX](https://github.com/worldwide-asset-exchange/wax-blockchain). Consulta la [Configuración de la Blockchain de WAX](/build/dapp-development/wax-blockchain-setup/) para más información.
-   Ten disponibles las claves públicas/privadas de tu Cuenta de Blockchain de WAX.
-   Asegúrate de tener suficiente WAX apostado en tu cuenta para asignar recursos.

:::tip
No necesitas construir el código fuente de WAX para completar estos pasos.
:::

## Modifica los Scripts

Para modificar los scripts de **hello-world** y desplegar tu contrato inteligente:

1. Desde la línea de comandos, navega a la carpeta **hello-world** en el [Repositorio de Código Fuente de la Blockchain de WAX](https://github.com/worldwide-asset-exchange/wax-blockchain):

    ```shell
    cd wax-blockchain/samples/hello-world
    ```

2. Copia el contenido de **hello-world** al directorio de tu contrato inteligente. Para este ejemplo, usaremos **wax_deploy**.

3. Desde **wax_deploy**, abre **CMakeLists.txt**. Este archivo almacena el nombre de tu proyecto y el archivo de tu contrato inteligente.

    a. Escribe el nombre de tu contrato en la línea 25.

    ```shell
    project(waxcontract)
    ```

    b. Escribe el nombre del archivo de tu contrato en la línea 29.

    ```shell
    add_contract(${PROJECT_NAME} ${PROJECT_NAME} waxcontract.cpp)
    ```

    Guarda el archivo.

4. A continuación, abre **Makefile**. Este archivo contiene los scripts para ejecutar `cleos` y la imagen de desarrollo Docker de WAX.

    a. Escribe el nombre de tu contrato en la línea 23.

    ```shell
    CONTRACT_NAME = waxcontract
    ```

    b. Actualiza las asignaciones de WAX para tu contrato inteligente en la línea 87, si es necesario.

    ```shell
    --stake-net '0.50000000 WAX' --stake-cpu '0.50000000 WAX' --buy-ram-kbytes 32"
    ```

    c. Para probar tu contrato inteligente, puedes actualizar la línea 48 para ejecutar tu acción:

    ```shell
    push action ${CONTRACT_ACCOUNT} greet '[]' -p ${CONTRACT_ACCOUNT}@active"
    ```

    Guarda el archivo.

:::tip
`NODEOS_URL` es el único parámetro opcional. Su valor predeterminado es la dirección de despliegue de la mainnet [chain-api-url](/es/operate/wax-infrastructure/#public-and-free-api-service-providers/).  
:::

Una vez realizados estos cambios, estarás listo para usar los scripts de `make` para construir y desplegar tu contrato inteligente.

## Despliega Tu Contrato Inteligente

Para lanzar tu contrato inteligente de WAX en la Blockchain de WAX:

1. **Construye tu contrato inteligente.** En la línea de comandos, ejecuta el siguiente script desde la carpeta **wax_deploy**:

    ```shell
    make build
    ```

    Esto crea `wax.wasm` y `wax.abi` en la carpeta **wax_deploy**.

2. **Genera claves para la cuenta de tu contrato inteligente.** Desde la línea de comandos, ejecuta:

    ```shell
    make create-key
    ```

    Esto crea un par de claves privadas/públicas para la cuenta de tu contrato inteligente (guarda la respuesta de la consola en un lugar seguro, las necesitarás más tarde).

3. **Crea una Cuenta de Contrato en WAX.** Para crear una cuenta en la blockchain para tu contrato inteligente, ejecuta:

    | Parámetro       | Ejemplo                | Descripción                                   |
    | --------------- | ---------------------- | --------------------------------------------- |
    | WAX_ACCOUNT     | waxprimary             | Nombre de tu cuenta de desarrollador de dApp. |
    | WAX_PRIVATE_KEY | 5JTZaN1zabi5wyC3LcdeZG |

3AzF7sLDX4JFqMDe68ThLC3Q5nYez | Clave privada para tu cuenta de desarrollador de dApp. |
| CONTRACT_ACCOUNT | waxsc1 | Especifica un nuevo nombre para tu cuenta de contrato inteligente. Los nombres de cuenta deben tener menos de 13 caracteres y solo contener letras [a-z] y números [1-5]. |
| CONTRACT_PUBLIC_KEY | EOS4yxqE5KYv5XaB2gj6sZTUDiGzKm42KfiRPDCeXWZUsAZZVXk1F | Nueva clave pública que creaste en el Paso 2. |

    ```shell
    make create-account WAX_ACCOUNT=waxprimary WAX_PRIVATE_KEY=5JTZaN1zabi5wyC3LcdeZG3AzF7sLDX4JFqMDe68ThLC3Q5nYez CONTRACT_ACCOUNT=waxsc1 CONTRACT_PUBLIC_KEY=EOS4yxqE5KYv5XaB2gj6sZTUDiGzKm42KfiRPDCeXWZUsAZZVXk1F
    ```

5. **Despliega tu contrato.** Desde la línea de comandos, ejecuta:

    | Parámetro            | Ejemplo                                                | Descripción                                                                         |
    | -------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------- |
    | CONTRACT_ACCOUNT     | waxsc1                                                 | El nombre que especificaste para la cuenta de tu contrato inteligente.              |
    | CONTRACT_PRIVATE_KEY | 9X5KRXKVx25yjL3FvxxY9YxYxxYY9Yxx99yyXTRH8DjppKpD9tKtVz | Clave privada para la cuenta de tu contrato inteligente (que creaste en el Paso 2). |

    ```shell
    make deploy CONTRACT_ACCOUNT=waxsc1 CONTRACT_PRIVATE_KEY=9X5KRXKVx25yjL3FvxxY9YxYxxYY9Yxx99yyXTRH8DjppKpD9tKtVz
    ```

    Esto despliega tu contrato inteligente en la mainnet. Solo necesitas pasar el nombre de la cuenta de tu contrato inteligente y la clave privada.

6. **Prueba tu contrato inteligente.** Desde la línea de comandos, ejecuta:

    ```shell
    make test CONTRACT_ACCOUNT=waxsc1
    ```

¡Tu dApp ahora está en vivo en WAX!

:::tip
Dependiendo de cómo esté construido el proceso de incorporación de tu dApp, tus clientes pueden necesitar crear una Cuenta WAX para usar tu dApp en WAX.
:::
