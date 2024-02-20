---
title: Despliega Tu Contrato WAX RNG
order: 85
---

# Despliega Tu Contrato WAX RNG

En este ejemplo, utilizaremos las herramientas de WAX-CDT para desplegar tu contrato inteligente de Generador de Números de la Suerte. Consulta [Despliegue con WAX-CDT](/build/dapp-development/deploy-dapp-on-wax/deploy_source) para obtener más información.

1. Primero necesitaremos crear una cuenta autogestionada en testnet o mainnet para desplegar el contrato inteligente. Para nuestro ejemplo asumiremos que la cuenta se llama *mywaxrngtest*.

**Nota:** Puedes usar las herramientas del equipo de [WAXSweden](https://waxsweden.org/testnet/) para crear la cuenta de testnet y suministrarla con los fondos que necesitarás para comprar la RAM requerida para el despliegue del contrato inteligente.
:::

2. Desde Docker, abrimos y desbloqueamos la billetera que creamos en los tutoriales sobre [cómo crear el entorno de desarrollo](/build/dapp-development/setup-local-dapp-environment/dapp_wallet).

```shell
cleos wallet open -n mywallet && cleos wallet unlock -n mywallet --password {wallet.pwd}
```
e importamos la clave privada activa de mywaxrngtest

```shell
cleos wallet import --private-key {mywaxrngtest_active_private_key}
```

3. Para ejecutar la acción **requestrand** en línea en el contrato inteligente **orng.wax**, necesitarás dar a tu nueva permisión **mywaxrngtest@active** la permisión adicional **eosio.code**. Esta permisión mejora la seguridad y permite que tu contrato inteligente envíe acciones en línea. Desde la línea de comandos, ejecuta el comando `cleos set account permission`, e incluye el parámetro literal `--add-code`.

```shell
cleos -u [chain-api-url] set account permission mywaxrngtest active --add-code
```

Para verificar la nueva permisión, usa el comando `cleos get account`:

```shell
cleos -u [chain-api-url] get account mywaxrngtest
```

4. Compra algo de RAM para desplegar el contrato inteligente:

```shell
cleos -u [chain-api-url] push action eosio buyram '["mywaxrngtest", "mywaxrngtest", "200.00000000 WAX"]' -p mywaxrngtest@active  
```

5. Finalmente, establece tu contrato con el comando `cleos set contract`:

```shell
cleos -u [chain-api-url] set contract mywaxrngtest mycontracts/rngtest/build/rngtest -p mywaxrngtest@active
```
