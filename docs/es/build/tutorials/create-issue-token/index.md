---
title: Crear y acuñar un token de activo fungible
order: 10
---

# Crear y acuñar un token de activo fungible

En este tutorial, aprenderás cómo crear y acuñar un token de activo fungible en la red principal de WAX.

## Antes de Comenzar

* Necesitarás completar nuestro [Inicio Rápido con Docker](/es/build/dapp-development/docker-setup/) (recomendado) y usar la [Guía de desarrollo para la Blockchain de WAX](/es/build/dapp-development/) para construir desde el código fuente.

* Para compilar y desplegar tu contrato inteligente, necesitarás utilizar el [Kit de Desarrollo de Contratos de WAX (WAX-CDT)](/es/build/dapp-development/wax-cdt/).

* Para desplegar tu contrato inteligente en la red principal de WAX o en la red de pruebas de WAX, necesitarás crear una Cuenta de Blockchain de WAX autogestionada.

## Clonar el Contrato Inteligente desde GitHub

1. Clona el contrato inteligente de activo fungible desde el repositorio de GitHub de WAX:

    ```shell
    git clone https://github.com/worldwide-asset-exchange/wax-system-contracts.git
    ```

2. Navega al directorio del contrato inteligente:

    ```shell
    cd wax-system-contracts/contracts/eosio.token
    ```

:::warning IMPORTANTE
Para las acciones que vamos a realizar a continuación es necesario desbloquear la wallet
```shell
cleos wallet unlock
```
:::

:::tip NOTA
Sustituye estas variables por tus propios valores:
- `<TOKEN_ACCOUNT_NAME>`: Nombre de la cuenta del token de activo fungible (Será el propietario del token de activo fungible).
- `<OWNER_PUBLIC_KEY>`: Clave pública de la cuenta del token de activo fungible.
- `<ACTIVE_PUBLIC_KEY>`: Clave pública activa de la cuenta del token de activo fungible.
- `<ACTIVE_PRIVATE_KEY>`: Clave privada activa de la cuenta del token de activo fungible.
- `<MAX_ISSUE>`: Cantidad máxima de tokens de activo fungible a acuñar.
- `<SYMBOL>`: Símbolo del token de activo fungible.
- `<AMOUNT>`: Cantidad de tokens de activo fungible a acuñar (issue) o a enviar (transfer). El total de tokens acuñados no puede exceder el valor de `<MAX_ISSUE>`.
:::


3. Crea una cuenta para el token de activo fungible:

    ```shell
    cleos create account eosio <TOKEN_ACCOUNT_NAME> <OWNER_PUBLIC_KEY> <ACTIVE_PUBLIC_KEY>
    ```

4. Agrega la cuenta del token de activo fungible a la wallet:

    ```shell
    cleos wallet import --private-key <ACTIVE_PRIVATE_KEY>
    ```

5. Compila el contrato inteligente:

    ```shell
    mkdir build
    cd build
    cmake ..
    make
    ```
6. Despliega el contrato inteligente en la red principal de WAX:

    ```shell
    cleos set contract eosio.token ../ --abi eosio.token.abi -p <TOKEN_ACCOUNT_NAME>@active
    ```
7. Acuña el token de activo fungible:

    ```shell
    cleos push action <TOKEN_ACCOUNT_NAME> create '["<TOKEN_ACCOUNT_NAME>", "<MAX_ISSUE> <SYMBOL>"]' -p <TOKEN_ACCOUNT_NAME>@active
    ```

8. Verifica que el token de activo fungible se haya acuñado correctamente:

    ```shell
    cleos get currency stats <TOKEN_ACCOUNT_NAME> <SYMBOL>
    ```
9. Acuñar tokens de activo fungible adicionales:

    ```shell
    cleos push action <TOKEN_ACCOUNT_NAME> issue '["<TOKEN_ACCOUNT_NAME>", "<AMOUNT> <SYMBOL>", "memo"]' -p <TOKEN_ACCOUNT_NAME>@active
    ```
10. Verifica que los tokens de activo fungible adicionales se hayan acuñado correctamente:

    ```shell
    cleos get currency stats <TOKEN_ACCOUNT_NAME> <SYMBOL>
    ```

11. Transferir tokens de activo fungible a otra cuenta:

    ```shell
    cleos push action <TOKEN_ACCOUNT_NAME> transfer '["<TOKEN_ACCOUNT_NAME>", "<RECIPIENT_ACCOUNT_NAME>", "<AMOUNT> <SYMBOL>", "memo"]' -p <TOKEN_ACCOUNT_NAME>@active
    ```
  
12. Verifica que los tokens de activo fungible se hayan transferido correctamente:

    ```shell  
    cleos get currency balance <TOKEN_ACCOUNT_NAME> <RECIPIENT_ACCOUNT_NAME> <SYMBOL>
    ```

¡Felicidades! Has creado y acuñado un token de activo fungible en la red principal de WAX.