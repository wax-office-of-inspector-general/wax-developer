---
title: Desplegar en tu Blockchain
order: 65
---

# Desplegar en tu Blockchain

<!--Para desplegar tu contrato inteligente en tu blockchain de desarrollo local, necesitarás:

- Compilar tu contrato inteligente
- Crear una cuenta de blockchain para tu contrato inteligente.-->

En esta guía, usarás **cleos** para desplegar y probar el contrato inteligente wax que creaste y compilaste en el tutorial [Crear un Contrato Inteligente](/es/build/dapp-development/wax-cdt/cdt_use.html#compile-hello-world).

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
- Debes crear una Cuenta WAX para tu contrato inteligente. Consulta [Crear Cuentas](/es/build/dapp-development/smart-contract-quickstart/dapp_account) si aún no has completado este paso.

## Desplegar Tu Contrato Inteligente

Para desplegar el archivo WASM de tu contrato inteligente en tu blockchain local, utiliza `cleos set contract` desde la línea de comandos:

| Parámetro | Ejemplo | Descripción
| --- | ----------- | -------------------------- |
| cuenta | waxsc1 | La cuenta de tu contrato inteligente. |
| ruta | /users/wax-blockchain/wax-cdt/mycontracts/wax | Ruta completa a tu archivo WASM. |
| permiso | -p waxsc1@active | Permiso Activo o de Propietario para la cuenta de tu contrato inteligente. |

```shell
cleos set contract waxsc1 /users/wax-blockchain/wax-cdt/mycontracts/wax -p waxsc1@active
```

La consola imprime la siguiente confirmación:

```shell
Reading WASM from /users/wax-blockchain/wax-cdt/mycontracts/wax/wax.wasm...
Publishing contract...
executed transaction: 8a79664a3f0457513fabaa5753c41b18588cb2994cd5e3164328eafc9663f7a8  2832 bytes  57440 us
#         eosio <= eosio::setcode               {"account":"waxsc1","vmtype":0,"vmversion":0,"code":"0061736d01000000013a0b60017f0060027f7f0060037f7...
#         eosio <= eosio::setabi                {"account":"waxsc1","abi":"0e656f73696f3a3a6162692f312e3100010567726565740000010000000080acd46505677...
warning: transaction executed locally, but may not be confirmed by the network yet         ]
```

Tu contrato inteligente ahora debería estar en vivo en tu blockchain local.

## Probar Tu Contrato Inteligente

Para probar tu contrato inteligente, utiliza `cleos push action` desde la línea de comandos:

| Parámetro | Ejemplo | Descripción
| --- | ----------- | -------------------------- |
| cuenta | waxsc1 | La cuenta de tu contrato inteligente. |
| acción | hi | Nombre de la acción. |
| flujo de datos | '["YourName"]' | Introduce tu nombre o cualquier otra cadena. |
| permiso | -p waxsc1@active | Permiso Activo o de Propietario para la cuenta de tu contrato inteligente. |

```shell
cleos push action waxsc1 hi '["YourName"]' -p waxsc1@active
```

La consola imprime lo siguiente:

```shell
executed transaction: 6a0b1489d903f2cacc6480830358f07aaf65b20bf1d7e855dc20097f4d64dc52  104 bytes  1727 us
#        waxsc2 <= waxsc2::hi                   {"nm":"YourName"}


>> Name : YourName
warning: transaction executed locally, but may not be confirmed by the network yet         ]
```

Si recibes un error de que la transacción tomó demasiado tiempo, ejecuta `cleos push action` nuevamente. Si aún recibes un error, intenta reiniciar **nodeos**.

```shell
Error 3080006: Transaction took too long
Error Details:
deadline exceeded
pending console output:
```
