---
title: Despliega Tu Contrato Inteligente NFT
order: 90
---

# Despliega Tu Contrato Inteligente NFT

A continuación, utilizaremos las herramientas de WAX-CDT para desplegar tu contrato inteligente NFT en la red principal de WAX. Consulta [Despliegue con WAX-CDT](/build/dapp-development/deploy-dapp-on-wax/deploy_source) para obtener más información.

1. Desde Docker, abre y desbloquea tu billetera.

    ```shell
    cleos wallet open -n mywallet && cleos wallet unlock -n mywallet --password {wallet.pwd}
    ```

2. Usando **cleos** o una billetera compatible con EOSIO, crea un nuevo par de claves pública/privada para tu contrato inteligente.

    ```shell
    cleos wallet create_key -n mywallet
    ```

3. Desde la línea de comandos, usa `cleos system newaccount`. El ejemplo a continuación utiliza **waxdappacct1** como el titular principal de la cuenta WAX y crea una nueva cuenta de contrato inteligente llamada **waxnftowner1**. Para ejecutar este comando, necesitarás tener la autoridad adecuada. Esto significa que la billetera que contiene tu cuenta principal debe estar abierta y desbloqueada.

    ```shell
    cleos -u [chain-api-url] system newaccount waxdappacct1 waxnftowner1 EOS7jEb46pDiWvA39faCoFn3jUdn6LfL51irdXbvfpuSko86iNU5x --stake-net '5.00000000 WAX' --stake-cpu '5.00000000 WAX' --buy-ram-kbytes 32
    ```

4. Para ejecutar la acción **create** en línea en el contrato inteligente **simpleassets**, necesitarás dar a tu nueva permisión **waxnftowner1@active** la permisión adicional **eosio.code**. Esta permisión mejora la seguridad y permite que tu contrato inteligente envíe acciones en línea. Desde la línea de comandos, ejecuta el comando `cleos set account permission` e incluye el parámetro literal `--add-code`.

    ```shell
    cleos -u [chain-api-url] set account permission waxnftowner1 active --add-code
    ```

    Para verificar la nueva permisión, usa el comando `cleos get account`:

    ```shell
     cleos -u [chain-api-url] get account waxnftowner1
    ```

    La permisión **active** ahora muestra la nueva permisión **waxnftowner1@eosio.code**.

    ```shell
    created: 2019-12-02T16:13:29.500
    permissions:
     owner     1:    1 EOS7jEb46pDiWvA39faCoFn3jUdn6LfL51irdXbvfpuSko86iNU5x
     active    1:    1 EOS7jEb46pDiWvA39faCoFn3jUdn6LfL51irdXbvfpuSko86iNU5x, 1 waxnftowner1@eosio.code
    ```

5. Finalmente, establece tu contrato con el comando `cleos set contract` (asegúrate de estar en la carpeta **waxnft**):

    ```shell
    cleos -u [chain-api-url] set contract waxnftowner1 $(pwd) waxrng.wasm waxrng.abi
    ```
