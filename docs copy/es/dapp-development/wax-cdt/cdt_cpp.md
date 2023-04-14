---
title: Herramientas de construcción del WAX-CDT
layout: default
nav_order: 53
parent: WAX Contract Development Toolkit
grand_parent: dApp Development
lang-ref: WAX-CDT Build Tools
lang: es-ES
---

El WAX-CDT incluye varios comandos **eosio**, creados a partir de la infraestructura de front-end y herramientas de <a href="https://clang.llvm.org/" target="_blank">Clang</a>. Esta colección incluye varias herramientas para construir archivos WASM optimizados y de alto rendimiento. Si quieres saber más, consulta las [opciones de WAX-CDT](/es/tools/cdt_options).

Te recomendamos que uses **eosio-init** para [crear un contrato inteligente](/es/dapp-development/wax-cdt/cdt_use.html#compile-hello-world). Esta herramienta te proporciona scripts para organizar y construir tu proyecto fácilmente. 

Si estos scripts no se ajustan a tus necesidades, también puedes utilizar el comando **eosio-cpp** para compilar tus contratos inteligentes.

## Utiliza eosio-cpp

Para generar un archivo WASM y ABI para tu contrato inteligente:

1. Busca en la línea de comandos la carpeta con tus contratos.

2. Ejecuta el comando build **eosio-cpp** con el parámetro **-abigen**.

<strong>Consejo:</strong> El <strong>eosio-cpp</strong> también incluye algunos términos ricardianos en tu archivo ABI. Puedes consultar la página de [contratos](/es/tools/ricardian_contract) y [cláusulas ricardianas](/es/tools/ricardian_clause) si necesitas más información.
{: .label .label-yellow }

```
eosio-cpp -abigen wax.cpp -o wax.wasm
```

Esto generará dos archivos en el directorio de tu contrato:

* El archivo WASM binario compilado (wax.wasm)
* El archivo ABI generado (wax.abi)

<!--## Use eosio-abigen to Generate an ABI

If you only want to generate an ABI file, you can easily do so with the **eosio-abigen** command. 

To use **eosio-abigen**, include the following parameters:

- Your contract's C++ file name
- --contract (Your contract's name)
- --output (Desired ABI file name)

### Example

```
eosio-abigen hello.cpp --contract=hello --output=hello.abi
```-->




