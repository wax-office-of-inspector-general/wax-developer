---
title: Desinstalar WAX-CDT
order: 95
---

# Desinstalar WAX-CDT

Si tienes una versión anterior de WAX-CDT instalada (Versión: wax-1.4.1-1.0.0), necesitarás desinstalarla antes de poder instalar la última versión.

## Qué se elimina

Este script eliminará las siguientes herramientas:

* eosio-cpp
* eosio-cc
* eosio-ld
* eosio-init
* eosio-abidiff
* eosio-wasm2wast
* eosio-wast2wasm
* eosio-ranlib
* eosio-ar
* eosio-objdump
* eosio-readelf

:::tip
Si creaste carpetas o modificaste algún archivo en este directorio, permanecerán intactos después de que se ejecute el script de desinstalación. Este script solo elimina las herramientas de WAX-CDT.
:::

## Ejecutar el Script de Desinstalación

Para desinstalar WAX-CDT:

1. Desde la línea de comandos, navega a tu carpeta WAX-CDT (por ejemplo, wax-blockchain/wax-cdt).

2. Ejecuta el script de desinstalación.

  ```
  sudo ./uninstall.sh
  ```

  Ingresa tu contraseña y luego presiona 1 para desinstalar WAX-CDT.

