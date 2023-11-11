---
title: Herramientas de Construcción de WAX-CDT
order: 53
---

# Herramientas de Construcción de WAX-CDT

WAX-CDT incluye varios comandos **eosio**, construidos alrededor del front-end y la infraestructura de herramientas de <a href="https://clang.llvm.org/" target="_blank">Clang</a>. Esta colección incluye varias herramientas para construir archivos WASM optimizados y de alto rendimiento. Consulta [Opciones de WAX-CDT](/es/build/tools/cdt_options) para más información.

Se recomienda que utilices **eosio-init** para [Crear un Contrato Inteligente](/es/build/dapp-development/wax-cdt/cdt_use.html#compile-hello-world). Esta herramienta proporciona scripts para organizar y construir fácilmente tu proyecto.

Si estos scripts no satisfacen tus necesidades, también puedes usar el comando **eosio-cpp** para compilar tus contratos inteligentes.

## Uso de eosio-cpp

Para generar un archivo WASM y ABI para tu contrato inteligente:

1. Desde la línea de comandos, navega a la carpeta de tus contratos inteligentes.

2. Ejecuta el comando de construcción **eosio-cpp** con el parámetro **-abigen**.

:::tip
<strong>eosio-cpp</strong> también incluye términos ricardianos en tu archivo ABI. Consulta [Contratos Ricardianos](/es/build/tools/ricardian_contract) y [Cláusulas Ricardianas](/es/build/tools/ricardian_clause) para más información.
:::

```
eosio-cpp -abigen wax.cpp -o wax.wasm
```

Esto generará dos archivos en el directorio de tu contrato:

* El WASM binario compilado (wax.wasm)
* El archivo ABI generado (wax.abi)

## Uso de eosio-abigen para Generar un ABI

Si solo deseas generar un archivo ABI, puedes hacerlo fácilmente con el comando **eosio-abigen**.

Para usar **eosio-abigen**, incluye los siguientes parámetros:

- El nombre del archivo C++ de tu contrato
- --contract (El nombre de tu contrato)
- --output (Nombre deseado del archivo ABI)

### Ejemplo

```
eosio-abigen hello.cpp --contract=hello --output=hello.abi
```
