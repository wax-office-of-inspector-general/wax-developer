---
title: Contratos Ricardianos
order: 111
---

# Contratos Ricardianos

Un contrato Ricardiano es un acuerdo digital legible tanto por máquinas como por humanos entre dos partes (por ejemplo, tu aplicación y tu cliente). Similar a un documento legal estándar, incluye las acciones, intenciones, términos y condiciones de tus contratos inteligentes.

Los contratos Ricardianos se definen por acción. Cada vez que la acción de tu contrato inteligente se ejecuta en la Blockchain de WAX, este acuerdo se firma y verifica criptográficamente con un HASH (por acción).

Para asociar un contrato Ricardiano con cada una de tus acciones, necesitarás crear un archivo en markdown.

* Este archivo debe tener el mismo nombre que tu contrato inteligente. Por ejemplo, si tu contrato inteligente se llama **wax.cpp**, tu archivo de markdown Ricardiano debe llamarse: wax.contracts.md.
* Cada etiqueta **```<h1>```** debe tener la clase "contract": ```<h1 class="contract"></h1>```.
* Para asociar una acción con tu archivo markdown, el contenido de la etiqueta **```<h1>```** debe coincidir con el nombre de la acción: ```<h1 class="contract">hi</h1>```.

También es importante dónde almacenas tu archivo de markdown Ricardiano (en relación con tu archivo C++ de contrato inteligente). Esto depende de cómo estés compilando tu contrato.

## Usa WAX-CDT

Si usas **eosio-init** para crear una plantilla de contrato inteligente, automáticamente se crea una carpeta para ti bajo tu directorio de proyecto (por ejemplo, wax/ricardian). Por defecto, esta carpeta contiene un contrato Ricardiano de muestra: wax.contracts.md.

Los scripts de CMake incluirán automáticamente los archivos listados en el directorio **ricardian**.

Consulta [Crear un Contrato Inteligente](/build/dapp-development/smart-contract-quickstart/dapp_hello_world/) para más información.

## Usa eosio-cpp

Si usas [eosio-cpp](/build/dapp-development/wax-cdt/) para compilar tu contrato, tu archivo de markdown Ricardiano debe estar en el mismo directorio que wax.cpp y debe tener el mismo nombre: wax.contracts.md.

```shell
eosio-cpp -abigen wax.cpp -o wax.wasm
```

## Ejemplo de Contrato Ricardiano

A continuación, se muestra un contrato inteligente, con una acción llamada: **hi**.

```cpp
ACTION wax::hi( name nm ) {
   /* rellenar el cuerpo de la acción */
   print_f("Nombre: %\n", nm);
}
```

Para asociar un contrato Ricardiano con esta acción:

1. Crea un archivo llamado **tu-contrato.contracts.md** (por ejemplo, wax.contracts.md).
2. Pega el markdown a continuación en tu archivo de contratos.

:::tip
Para cada una de tus acciones, usa la etiqueta ```<h1>``` con la clase "contract", y establece su contenido interno con el nombre de la acción.
:::

```html
<h1 class="contract"> hi </h1> 
```

Espacio reservado para el contrato ricardiano de la acción hi
