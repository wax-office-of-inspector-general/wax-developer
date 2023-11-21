---
title: Crear Cuentas
order: 63
---

# Crear Cuentas

Una Cuenta WAX se almacena en la blockchain y se utiliza para identificar tus contratos inteligentes y los usuarios de tu dApp. Las cuentas de blockchain son necesarias para enviar o recibir transacciones válidas a la blockchain, tanto en tus entornos locales como en producción.

## Cómo Funciona

Existen varios tipos de cuentas que necesitarás para desplegar tus contratos inteligentes:

- **Cuenta Principal:** Esta es tu cuenta principal de la Blockchain WAX, utilizada para apostar WAX para CPU y RAM. Localmente, esta cuenta es simulada usando el usuario del sistema **eosio**. En tu entorno de desarrollo local, puedes utilizar este usuario del sistema para crear varias cuentas. En producción, todas las cuentas WAX son gratuitas.
- **Cuentas de Contratos Inteligentes:** Cada uno de tus contratos inteligentes necesitará una cuenta separada.
- **Cuentas de Clientes:** Estas son las cuentas utilizadas para interactuar con las acciones de tu contrato inteligente. En tu entorno de desarrollo local, puedes crear un número ilimitado de cuentas de clientes.

En esta guía, utilizarás **cleos** para crear una nueva Cuenta Blockchain WAX que puedas usar para desplegar tu contrato inteligente.

:::tip
<strong>Consejo:</strong> Para una lista completa de subcomandos y opciones de creación de cuentas de cleos, consulta la <a href="https://docs.eosnetwork.com/leap/latest/cleos/command-reference/create/account" target="_blank">Guía de Referencia Cleos: crear cuenta</a>.
:::

## Antes de Comenzar

- **nodeos** debe estar en ejecución
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
- Tu billetera debe estar Abierta y Desbloqueada
    ```shell
    cleos wallet open
    ```

    ```shell
    cleos wallet unlock --password PW5KRXKVx25yjL3FvxxY9YxYxxYY9Yxx99yyXTRH8DjppKpD9tKtVz
    ```

<!--"/usr/opt/eosio/1.7.3/bin/keosd" lanzado
No se pudo conectar a nodeos en http://127.0.0.1:8888/; ¿está nodeos ejecutándose?

Error 3120006: No hay billetera disponible
Asegúrate de haber creado una billetera y de tenerla abierta
Detalles del Error:
¡No tienes ninguna billetera!-->

## Crear Claves Públicas/Privadas

Cada Cuenta WAX debe tener al menos una clave pública. Hay dos tipos de claves públicas, basadas en los permisos de la cuenta:

- **Clave del Propietario:** Requerida. Esta es la clave pública principal, con todos los permisos y control completo. En una cuenta de producción, nunca debes dar esta clave para la mayoría de las transacciones. Esta clave tiene un registro de clave privada/pública en tu billetera local.
- **Clave Activa:** Opcional. Esta es una clave secundaria, que puede ser cambiada por la clave del propietario. Requiere un par adicional de clave privada/pública enumerado en tu billetera local. En producción, utiliza esta clave para votar, enviar y recibir transacciones.

Para crear una cuenta para tu contrato inteligente, necesitarás crear un par de claves pública y privada desde tu billetera de desarrollo local. Puedes hacerlo usando el comando `create_key` de tu billetera:

:::tip
Tu billetera debe estar abierta y desbloqueada para crear tus claves.
:::

```shell
cleos wallet create_key
```

La consola imprime tu clave pública:

```shell
warn  2019-07-16T23:16:23.435 thread-0  wallet.cpp:223                save_wallet_file     ] saving wallet to file /home/username/eosio-wallet/./default.wallet
Created new private key with a public key of: "EOS4yxqE5KYv5XaB2gj6sZTUDiGzKm42KfiRPDCeXWZUsAZZVXk1F"
```

Guarda esta clave en algún lugar de fácil acceso (necesitarás esta clave pública en el siguiente paso).

## Crear una Cuenta de Contrato Inteligente

Para crear una Cuenta WAX de Contrato Inteligente, utiliza el comando `create account`:

| Parámetro | Ejemplo | Descripción
| --- | ----------- | -------------------------- |
| creador | eosio | El nombre de la cuenta principal que crea la nueva cuenta. En producción, esta es tu Cuenta WAX. |
| nombre | waxsc1 | El nombre de la nueva cuenta. Los nombres de las cuentas deben tener menos de 13 caracteres y solo contener letras [a-z] y números [1-5]. |
| Clave del Propietario | EOS4yxqE5KYv5XaB2gj6sZTUDiGzKm42KfiRPDCeXWZUsAZZVXk1F | Clave pública, creada desde tu billetera de desarrollo local. |

### Ejemplo

```shell
cleos create account eosio waxsc1 EOS4yxqE5KYv5XaB2gj6sZTUDiGzKm42KfiRPDCeXWZUsAZZVXk1F 
```

**cleos** transmite el comando `create account` a tu blockchain local y tu billetera firma esta transacción con un HASH.

```shell
executed transaction: 4ebdc2eabcd545c7f26679e95d729893ebd0df919850791daa79a10e4865f702  200 bytes  15013 us
#         eosio <= eosio::newaccount            {"creator":"eosio","name":"waxsc1","owner":{"threshold":1,"keys":[{"key":"EOS4yxqE5KYv5XaB2gj6sZTUDi...
warning: transaction executed locally, but may not be confirmed by the network yet         ]
```

Ahora deberías tener una Cuenta Blockchain WAX para asociar con tu contrato inteligente.

## Verificar Tu Nueva Cuenta

Para ver la información de tu nueva cuenta, utiliza el comando `get account`:

```shell
cleos get account waxcustomer
```

La consola imprime los detalles de tu nueva cuenta. Observa que las claves del propietario y activa son las mismas porque no incluimos una clave pública activa cuando creamos la cuenta.

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
---