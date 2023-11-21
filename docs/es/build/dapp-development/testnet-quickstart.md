---
title: Guía de Inicio Rápido para Testnet de WAX
order: 66
---

En esta guía, aprenderás a crear cuentas Testnet y a desplegar tus contratos inteligentes en el Testnet de WAX.

:::tip
Cada contrato inteligente requiere una cuenta en la blockchain. Se recomienda que nombres tus cuentas basándote en la funcionalidad de tu contrato inteligente (por ejemplo, mywaxnftgame). Los nombres de cuenta deben tener 12 caracteres y solo contener letras [a-z] y números [1-5].
:::

## Crear y Financiar Cuentas Testnet

1. <a href="https://waxsweden.org/testnet/" target="_blank">Crea una Cuenta Testnet</a>. Guarda tus claves privadas y públicas en un lugar seguro.

2. Desde la página principal de Testnet, obtén Tokens WAX gratis para financiar tu nueva cuenta.

3. Para desplegar tus contratos inteligentes, necesitarás crear una billetera utilizando tus claves públicas y privadas. Puedes usar las características de billetera en <a href="https://local.bloks.io/wallet/transfer?nodeUrl=testnet.waxsweden.org&coreSymbol=WAX&corePrecision=8&systemDomain=eosio&hyperionUrl=https%3A%2F%2Ftestnet.waxsweden.org" target="_blank">Bloks.io</a>, o usar nuestras [imágenes de Docker](/build/dapp-development/docker-setup/) para gestionar tu billetera.

    Para crear una billetera desde un contenedor Docker, usa el comando `cleos wallet`:

    ```shell
    cleos rm -f ~/eosio-wallet/{account.name}.wallet &&
    cleos wallet create -n {account.name} --to-console &&
    cleos wallet import -n {account.name} --private-key {active.privatekey} &&
    cleos wallet import -n {account.name} --private-key {owner.privatekey}
    ```

    Guarda la contraseña de tu billetera en un lugar seguro - la necesitarás para ejecutar comandos en la blockchain.

4. Una vez que tengas una billetera configurada con tu cuenta Testnet, puedes apostar NET, CPU y RAM desde Bloks.io o tu contenedor Docker.

    Comprar RAM:

    ```shell
    cleos -u https://testnet.waxsweden.org system buyram {account.name} {account.name} "3.00000000 WAX"
    ```

    Apostar NET y CPU (a ti mismo, desde la misma cuenta):

    ```shell
    cleos -u https://testnet.waxsweden.org system delegatebw {account.name} {account.name} "4.00000000 WAX" "5.00000000 WAX"
    ```

## Desplegar Contratos Inteligentes en el Testnet de WAX

:::tip
Para completar estos pasos, asegúrate de que tu billetera esté abierta y desbloqueada. Consulta la sección de solución de problemas a continuación para más información.
:::

1. Desde una sesión interactiva de Docker bash, navega a tu directorio de contratos inteligentes y construye tu contrato inteligente.

    ```shell
    eosio-cpp -abigen waxnft.cpp -o waxnft.wasm 
    ```

2. Si estás llamando acciones de contratos externos desde tu contrato inteligente (por ejemplo, WAX RNG o Simple Assets), asegúrate de elevar los permisos de tu cuenta:

    ```shell
    cleos -u https://testnet.waxsweden.org set account permission {account.name} active --add-code
    ```

3. **Despliega.** Desde la línea de comandos, establece tu contrato con el comando `cleos set contract`: 

    ```shell
    cleos -u https://testnet.waxsweden.org set contract {account.name} $(pwd) waxnft.wasm waxnft.abi   
    ```

¡Tu contrato inteligente ya está activo en el Testnet de WAX!

## Solución de Problemas

Si recibes errores de billetera y/o autorización, es posible que necesites abrir y desbloquear tu billetera:

```shell
cleos wallet open -n {account.name} &&
cleos wallet unlock -n {account.name} --password {wallet.pwd}
```
