---
title: Desplegar a tu blockchain
layout: default
nav_order: 65
parent: Smart Contract Quickstart
grand_parent: dApp Development
lang-ref: Deploy to Your Blockchain
lang: es
---

<!--To deploy your smart contract to your local development blockchain, you'll need to:

- Compile your smart contract
- Create a blockchain account for your smart contract.-->

En esta guía, usarás **cleos** para desplegar y probar el contrato inteligente de WAX que creaste y compilaste en el tutorial [Crear un Smart Contract](/es/dapp-development/wax-cdt/cdt_use.html#compile-hello-world). 

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
- Tu wallet debe estar abierta y desbloqueada
    ```shell
    cleos wallet open
    ```

    ```shell
    cleos wallet unlock --password PW5KRXKVx25yjL3FvxxY9YxYxxYY9Yxx99yyXTRH8DjppKpD9tKtVz
    ```
- Debes crear una cuenta de WAX para tu contrato inteligente. Si aún no la has creado, visita la guía [Crear una cuenta de WAX](/es/dapp_account).

## Despliega tu contrato inteligente

Para desplegar el archivo WASM de tu contrato en la blockchain local, utiliza `cleos set contract` en la línea de comandos:

| Parámetro | Ejemplo | Descripción
| --- | ----------- | -------------------------- |
| account | waxsc1 | La cuenta de tu contrato inteligente. |
| path | /users/wax-blockchain/wax-cdt/mycontracts/wax | La ruta completa de tu archivo WASM. |
| permission | -p waxsc1@active | El permiso Active u Owner para la cuenta de tu contrato inteligente. |

```shell
cleos set contract waxsc1 /users/wax-blockchain/wax-cdt/mycontracts/wax -p waxsc1@active
```

La consola mostrará esta confirmación:

```shell
Reading WASM from /users/wax-blockchain/wax-cdt/mycontracts/wax/wax.wasm...
Publishing contract...
executed transaction: 8a79664a3f0457513fabaa5753c41b18588cb2994cd5e3164328eafc9663f7a8  2832 bytes  57440 us
#         eosio <= eosio::setcode               {"account":"waxsc1","vmtype":0,"vmversion":0,"code":"0061736d01000000013a0b60017f0060027f7f0060037f7...
#         eosio <= eosio::setabi                {"account":"waxsc1","abi":"0e656f73696f3a3a6162692f312e3100010567726565740000010000000080acd46505677...
warning: transaction executed locally, but may not be confirmed by the network yet         ]
```

Tu contrato ya debería estar disponible en tu blockchain local.

## Prueba tu Smart Contract

Para probar tu contrato inteligente, usa la acción `cleos push action` desde la línea de comandos:

| Parámetro | Ejemplo | Descripción
| --- | ----------- | -------------------------- |
| account | waxsc1 | La cuenta de tu contrato inteligente. |
| action | hi | Nombre de la acción. |
| datastream | '["YourName"]' | Introduce tu nombre o cualquier otra cadena. |
| permission | -p waxsc1@active | El permiso Active u Owner para la cuenta de tu contrato inteligente. |

```shell
cleos push action waxsc1 hi '["YourName"]' -p waxsc1@active
```

La consola mostrará lo siguiente:

```shell
executed transaction: 6a0b1489d903f2cacc6480830358f07aaf65b20bf1d7e855dc20097f4d64dc52  104 bytes  1727 us
#        waxsc2 <= waxsc2::hi                   {"nm":"YourName"}
>> Name : YourName
warning: transaction executed locally, but may not be confirmed by the network yet         ]
```

Si aparece un error que indica que la transacción ha tardado demasiado, vuelve a ejecutar `cleos push action`. Si el error persiste, prueba a reiniciar **nodeos**.

```shell
Error 3080006: Transaction took too long
Error Details:
deadline exceeded
pending console output:
```
