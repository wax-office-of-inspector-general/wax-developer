---
title: Publica tu smart contract
layout: default
nav_order: 85
parent: Utilizar WAX RNG desde smart contract
grand_parent: Tutoriales
lang-ref: Deploy Your WAX RNG Contract
lang: es
---

En este ejemplo, utilizaremos las herramientas WAX-CDT para desplegar tu contrato inteligente. Consulta [WAX-CDT Deploy](/es/dapp-development/deploy-dapp-on-wax/deploy_source) para más información.

1. En primer lugar tendremos que crear una cuenta autocustodiada en testnet o en mainnet para desplegar el smart contract. Para nuestro ejemplo vamos a suponer que la cuenta se llama *mywaxrngtest*

**Nota:** Puede utilizar las herramientas de equipo de [WAXSweden](https://waxsweden.org/testnet/) para crear la cuenta testnet y suplirla con fondos que necesitará para comprar la RAM necesaria para el despliegue del smart contract.
{: .label .label-yellow }

2. Desde Docker, abrimos y desbloqueamos la wallet que hemos creado en los tutoriales acerca de [cómo crear el entorno de desarrollo](/es/dapp-development/setup-local-dapp-environment/dapp_wallet).

```shell
cleos wallet open -n mywallet && cleos wallet unlock -n mywallet --password {wallet.pwd}
```
y agregamos la clave active (privada) para poder firmar las transacciones con esta nueva cuenta.

```shell
cleos wallet import --private-key {mywaxrngtest_active_private_key}
```

3. Para ejecutar la acción inline **requestrand** en el contrato inteligente **orng.wax**, necesitarás dar a tu permiso **mywaxrngtest@active** el permiso adicional **eosio.code**. Este permiso mejora la seguridad y permite a tu contrato inteligente enviar acciones en línea. Desde la línea de comandos, ejecuta el comando `cleos set account permission`, e incluye el parámetro  `--add-code`.

```shell
cleos -u [chain-api-url] set account permission mywaxrngtest active --add-code
```

Podemos verificar el nuevo permiso ejecutando el comando `cleos get account`: 

```shell
    cleos -u [chain-api-url] get account mywaxrngtest
```
4. Compramos RAM para alojar el smart contract:

```shell
cleos -u [chain-api-url] push action eosio buyram '["mywaxrngtest", "mywaxrngtest", "200.00000000 WAX"]' -p mywaxrngtest@active  
```

5. Finalmente, desplegamos el smart contract en la blockchain con el comando `cleos set contract`:

```shell
cleos -u [chain-api-url] set contract mywaxrngtest mycontracts/rngtest/build/rngtest -p mywaxrngtest@active
```
