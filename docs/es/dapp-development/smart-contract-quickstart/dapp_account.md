---
title: Crear una cuenta de WAX
layout: default
nav_order: 63
parent: Smart Contract Quickstart
grand_parent: dApp Development
lang-ref: Create Accounts
lang: es
---

Una cuenta de WAX se almacena en la blockchain y se utiliza para identificar tus contratos inteligentes y los usuarios de la dApp. Las cuentas de la blockchain son necesarias para enviar o recibir transacciones válidas a la misma, tanto en tu entorno local como en el de producción. 

## Cómo funciona

Hay varios tipos de cuentas diferentes que necesitarás para desplegar tus contratos inteligentes:

- **Cuenta primaria:** Esta es tu cuenta principal de la blockchain de WAX, la cual se utiliza para acumular WAX para la CPU y la RAM. Localmente, esta cuenta se simula utilizando el usuario del sistema **eosio**. En un entorno de desarrollo local, puedes usarlo para crear varias cuentas. En producción, todas las cuentas de WAX son libres.
- **Cuentas de Smart Contract:** Cada contrato inteligente que crees necesitará tener su propia cuenta. 
- **Cuentas de cliente:** Estas son las cuentas que se utilizan para interactuar con las acciones de tu contrato inteligente. Puedes crear un número ilimitado de cuentas de cliente en el entorno de desarrollo local.

En esta guía, utilizarás **cleos** para crear una nueva cuenta en la Blockchain de WAX, que te permitirá desplegar tu contrato inteligente.

<strong>Consejo</strong> Para ver una lista completa de los subcomandos y opciones de creación de cuentas de cleos, visita la <a href="https://developers.eos.io/manuals/eos/v2.0/cleos/command-reference/create/account" target="_blank">Guía de referencia de Cleos: crear una cuenta</a> de EOSIO.
{: .label .label-yellow }

## Antes de empezar

- **nodeos** debe estar ejecutándose
    ```shell
    nodeos -e -p eosio \
        --plugin eosio::producer_plugin \
        --plugin eosio::chain_api_plugin \
        --plugin eosio::http_plugin \
        --access-control-allow-origin='*' \
        --contracts-console \
        --http-validate-host=false \
        --verbose-http-errors >> nodeos.log 2>&1 &
    ```
- Tu cartera debe estar abierta y desbloqueada
    ```shell
    cleos wallet open
    ```

    ```shell
    cleos wallet unlock --password PW5KRXKVx25yjL3FvxxY9YxYxxYY9Yxx99yyXTRH8DjppKpD9tKtVz
    ```

<!--"/usr/opt/eosio/1.7.3/bin/keosd" launched
Failed to connect to nodeos at http://127.0.0.1:8888/; is nodeos running?

Error 3120006: No available wallet
Ensure that you have created a wallet and have it open
Error Details:
You don't have any wallet!-->

## Crear claves públicas/privadas

Cada cuenta de WAX debe tener al menos una clave pública. Hay dos tipos de claves públicas, basadas en los permisos de la cuenta:

- **Clave del propietario:** Requerida. Esta es la clave pública principal, con todos los permisos y el control absoluto. En una cuenta de producción, nunca deberías proporcionarla para la mayoría de las transacciones. Esta clave tiene un registro de clave privada/pública en tu cartera local.
- **Clave activa:** Opcional. Esta es una clave secundaria, que puede ser cambiada por la clave del Propietario. Requiere un par de claves privadas/públicas adicionales en tu cartera local. En producción, usa esta clave para valorar, enviar y recibir transacciones.

Para crear una cuenta para tu contrato inteligente, necesitarás crear un par de claves públicas y privadas desde tu cartera de desarrollo local. Puedes hacerlo utilizando el comando `create_key` de tu cartera:

<strong>Nota:</strong> Tu cartera debe estar abierta y desbloqueada para crear las claves.
{: .label .label-yellow }

```shell
cleos wallet create_key
```

La consola te mostrará tu clave pública:

```shell
warn  2019-07-16T23:16:23.435 thread-0  wallet.cpp:223                save_wallet_file     ] saving wallet to file /home/username/eosio-wallet/./default.wallet
Created new private key with a public key of: "EOS4yxqE5KYv5XaB2gj6sZTUDiGzKm42KfiRPDCeXWZUsAZZVXk1F"
```

Ten a mano esta clave, la necesitarás para el siguiente paso.

## Crear una cuenta de Smart Contract

Para crear una cuenta WAX de contrato inteligente, utiliza el comando `create account`:

| Parámetro | Ejemplo | Descripción
| --- | ----------- | -------------------------- |
| creator | eosio | El nombre de la cuenta principal que crea la nueva cuenta. En producción, esta es tu cuenta de WAX. |
| name | waxsc1 | El nombre de la nueva cuenta. Los nombres de las cuentas deben tener menos de 13 caracteres y sólo contener letras [a-z] y números [1-5]. |
| OwnerKey | EOS4yxqE5KYv5XaB2gj6sZTUDiGzKm42KfiRPDCeXWZUsAZZVXk1F | Clave pública, creada a partir de tu cartera de desarrollo local. |

### Ejemplo

```shell
cleos create account eosio waxsc1 EOS4yxqE5KYv5XaB2gj6sZTUDiGzKm42KfiRPDCeXWZUsAZZVXk1F 
```

**cleos** transmite el comando `create account` a tu blockchain local y tu cartera firma esta transacción con un HASH.

```shell
executed transaction: 4ebdc2eabcd545c7f26679e95d729893ebd0df919850791daa79a10e4865f702  200 bytes  15013 us
#         eosio <= eosio::newaccount            {"creator":"eosio","name":"waxsc1","owner":{"threshold":1,"keys":[{"key":"EOS4yxqE5KYv5XaB2gj6sZTUDi...
warning: transaction executed locally, but may not be confirmed by the network yet         ]
```

Ahora deberías tener una cuenta en la Blockchain de WAX para asociarla a tu contrato inteligente.

## Verifica tu nueva cuenta

Para ver la información de tu nueva cuenta, usa el comando `get account`:

```shell
cleos get account waxcustomer
```

La consola muestra los detalles de tu nueva cuenta. Fíjate en que las claves de propietario y la activa son las mismas porque no incluimos una clave pública activa cuando creamos la cuenta.

```shell
created: 2019-07-22T20:22:16.000
permissions:
     owner     1:    1 EOS4yxqE5KYv5XaB2gj6sZTUDiGzKm42KfiRPDCeXWZUsAZZVXk1F
        active     1:    1 EOS4yxqE5KYv5XaB2gj6sZTUDiGzKm42KfiRPDCeXWZUsAZZVXk1F
memory:
     quota:       unlimited  used:      2.66 KiB

net bandwidth:
     used:               unlimited
     available:          unlimited
     limit:              unlimited

cpu bandwidth:
     used:               unlimited
     available:          unlimited
     limit:              unlimited
```



