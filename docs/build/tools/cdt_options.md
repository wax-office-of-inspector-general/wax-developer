---
title: Opciones de WAX-CDT
order: 110
---

# Opciones de WAX-CDT

A continuación, se presenta una lista de herramientas y parámetros comunes de WAX-CDT. Puedes usar estas herramientas para generar archivos WASM y ABI para tus contratos inteligentes.

## eosio-abidiff
Compara las diferencias entre dos archivos ABI. Un informe se imprime en la consola.

```shell
USO: eosio-abidiff [opciones] [archivo de entrada1] ... [archivo de entrada2] ...
EJEMPLO: eosio-abidiff hello.abi old_hello.abi   

OPCIONES:

Opciones Genéricas:

  -help      - Muestra las opciones disponibles (-help-hidden para más)
  -help-list - Muestra la lista de opciones disponibles (-help-list-hidden para más)
  -version   - Muestra la versión de este programa
```

## eosio-cpp
Genera archivos WASM y ABI para tus contratos inteligentes.

```shell
USO: eosio-cpp [opciones] [archivo de entrada] ...
EJEMPLO: eosio-cpp -abigen wax.cpp -o wax.wasm

OPCIONES:
  -C                       - Incluir comentarios en la salida preprocesada
  -CC                      - Incluir comentarios de dentro de macros en la salida preprocesada
  -D=[string]              - Define [macro] a [valor] (o 1 si [valor] se omite)
  -E                       - Solo ejecutar el preprocesador
  -I=[string]              - Agregar directorio al camino de búsqueda de include
  -L=[string]              - Agregar directorio al camino de búsqueda de bibliotecas
  -O=[string]              - Nivel de optimización s, 0-3
  -S                       - Solo ejecutar pasos de preproceso y compilación
  -U=[string]              - Anular definición de macro [macro]
  -W=[string]              - Activar la advertencia especificada
  -c                       - Solo ejecutar pasos de preproceso, compilación y ensamblaje
  -dD                      - Imprimir definiciones de macro en modo -E además de la salida normal
  -dI                      - Imprimir directivas include en modo -E además de la salida normal
  -dM                      - Imprimir definiciones de macro en modo -E en lugar de la salida normal
  -emit-ast                - Emitir archivos AST de Clang para entradas de fuente
  -emit-llvm               - Usar la representación LLVM para archivos ensambladores y de objeto
  -faligned-allocation     - Habilitar funciones de asignación alineadas de C++17
  -fcoroutine-ts           - Habilitar soporte para el TS de Corrutinas de C++
  -finline-functions       - Inline funciones adecuadas
  -finline-hint-functions  - Inline funciones que están (explícita o implícitamente) marcadas inline
  -fmerge-all-constants    - Permitir fusión de constantes
  -fno-cfl-aa              - Desactivar Análisis de Alias CFL
  -fno-elide-constructors  - Desactivar elisión de constructor de copia de C++
  -fno-lto                 - Desactivar LTO
  -fstack-protector        - Habilitar protectores de pila para funciones potencialmente vulnerables al aplastamiento de pila
  -fstack-protector-all    - Forzar el uso de protectores de pila para todas las funciones
  -fstack-protector-strong - Usar una heurística fuerte para aplicar protectores de pila a las funciones
  -fstrict-enums           - Habilitar optimizaciones basadas en la definición estricta del rango de valores de un enum
  -fstrict-return          - Siempre tratar caminos de flujo de control que salen de una función no-void como inalcanzables
  -fstrict-vtable-pointers - Habilitar optimizaciones basadas en las reglas estrictas para sobrescribir objetos C++ polimórficos
  -include=[string]        - Incluir archivo antes de analizar
  -isysroot=[string]       - Establecer el directorio raíz del sistema (usualmente /)
  -l=[string]              - Nombre raíz de la biblioteca para enlazar
  -lto-opt=[string]        -

 Nivel de Optimización LTO (O0-O3)
  -o=[string]              - Escribir salida a [archivo]
  -std=[string]            - Estándar de lenguaje para compilar
  -v                       - Mostrar comandos a ejecutar y usar salida detallada
  -w                       - Suprimir todas las advertencias

Opciones Genéricas:

  -help                    - Muestra las opciones disponibles (-help-hidden para más)
  -help-list               - Muestra la lista de opciones disponibles (-help-list-hidden para más)
  -version                 - Muestra la versión de este programa
```

## eosio-init
Crea una plantilla de contrato inteligente y estructura de directorios. Incluye scripts de compilación CMake por defecto.

```shell
USO: eosio-init [opciones]
EJEMPLO: eosio-init -project wax

OPCIONES:

Opciones Genéricas:

  -help             - Muestra las opciones disponibles (-help-hidden para más)
  -help-list        - Muestra la lista de opciones disponibles (-help-list-hidden para más)
  -version          - Muestra la versión de este programa

eosio-init:
genera un proyecto de contrato inteligente eosio

  -bare             - produce solo un esqueleto de contrato inteligente sin soporte de CMake
  -path=[string]    - directorio para colocar el proyecto
  -project=[string] - nombre del proyecto de salida
```

## eosio-ld
Enlazador WebAssembly.

```shell
USO: eosio-ld [opciones] [archivo de entrada] ...

OPCIONES:

Opciones Genéricas:

  -help             - Muestra las opciones disponibles (-help-hidden para más)
  -help-list        - Muestra la lista de opciones disponibles (-help-list-hidden para más)
  -version          - Muestra la versión de este programa

opciones de eosio.ld:

  -L=[string]       - Agregar directorio al camino de búsqueda de bibliotecas
  -fno-cfl-aa       - Desactivar Análisis de Alias CFL
  -fno-lto          - Desactivar LTO
  -fno-post-pass    - No ejecutar paso de post procesamiento
  -fno-stack-first  - No establecer la pila primero en memoria
  -l=[string]       - Nombre raíz de la biblioteca para enlazar
  -lto-opt=[string] - Nivel de Optimización LTO (O0-O3)
  -o=[string]       - Escribir salida a [archivo]
