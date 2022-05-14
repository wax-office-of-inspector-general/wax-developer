---
title: Inicio rápido de la Testnet de WAX
layout: default
nav_order: 66
parent: dApp Development
lang-ref: WAX Testnet Quickstart
lang: es
---

En esta guía, aprenderás a crear cuentas de Testnet y a desplegar tus contratos inteligentes en la Testnet de WAX.

<strong>Consejo:</strong> Cada contrato inteligente requiere una cuenta de blockchain. Recomendamos nombrar las cuentas basándose en la funcionalidad de su contrato inteligente (por ejemplo, "mywaxnftgame"). Los nombres de las cuentas deben tener 12 caracteres y sólo contener letras [a-z] y números [1-5].
{: .label .label-yellow }

## Crear y financiar cuentas Testnet

1. <a href="https://waxsweden.org/testnet/" target="_blank">Crea una cuenta de Testnet</a>. Guarda tus claves privadas y públicas en un lugar seguro. 

2. Desde la página de inicio de Testnet, consigue tokens de WAX gratuitos para financiar tu nueva cuenta. 

3. Para desplegar tus contratos inteligentes, necesitarás crear una cartera utilizando tus claves públicas y privadas. Puedes utilizar las funciones de cartera en <a href="https://local.bloks.io/wallet/transfer?nodeUrl=testnet.waxsweden.org&coreSymbol=WAX&corePrecision=8&systemDomain=eosio&hyperionUrl=https%3A%2F%2Ftestnet.waxsweden.org" target="_blank">Bloks.io</a>, o usar nuestras [imágenes de Docker](/es/dapp-development/docker-setup/) para controlar tu cartera. 

    Para crear una cartera desde un contenedor Docker, usa el comando `cleos wallet`:

    ```shell
    cleos rm -f ~/eosio-wallet/{account.name}.wallet &&
    cleos wallet create -n {account.name} --to-console &&
    cleos wallet import -n {account.name} --private-key {active.privatekey} &&
    cleos wallet import -n {account.name} --private-key {owner.privatekey}
    ```

    Guarda la contraseña de tu cartera en un lugar seguro: la necesitarás para ejecutar los comandos de la blockchain.

4. Una vez que tengas una cartera configurada con tu cuenta de Testnet, puedes apostar por NET, CPU y RAM desde Bloks.io o tu contenedor Docker.

    Comprar RAM:

    ```shell
    cleos -u https://testnet.waxsweden.org system buyram {account.name} {account.name} "3.00000000 WAX"
    ```

    Invertir en NET y CPU (para ti mismo, desde la misma cuenta):

    ```shell
    cleos -u https://testnet.waxsweden.org system delegatebw {account.name} {account.name} "4.00000000 WAX" "5.00000000 WAX"
    ```

## Despliegue de contratos inteligentes en la Testnet de WAX

<strong>Consejo:</strong> Para completar estos pasos, asegúrate de que tu cartera está abierta y desbloqueada. Consulta la sección de Resolución de problemas que hay más abajo para obtener más información al respecto.
{: .label .label-yellow }

1. Desde una sesión interactiva de Docker bash, navega a tu directorio de contratos inteligentes y crea tu contrato inteligente.

    ```shell
    eosio-cpp -abigen waxnft.cpp -o waxnft.wasm 
    ```

2. Si estás llamando a acciones de contratos externos desde tu contrato inteligente (por ejemplo, WAX RNG o Simple Assets), asegúrate de revisar los permisos de tu cuenta:

    ```shell
    cleos -u https://testnet.waxsweden.org set account permission {account.name} active --add-code
    ```

3. **Despliegue.** Desde la línea de comandos, usa `cleos set contract` para establecer tu contrato: 

    ```shell
    cleos -u https://testnet.waxsweden.org set contract {account.name} $(pwd) waxnft.wasm waxnft.abi   
    ```

¡Tu contrato inteligente ya está activo en la Testnet de WAX! 

## Resolución de problemas

Si recibes errores de cartera y/o autorización, es posible que tengas que abrir y desbloquear tu cartera:

```shell
cleos wallet open -n {account.name} &&
cleos wallet unlock -n {account.name} --password {wallet.pwd}
```