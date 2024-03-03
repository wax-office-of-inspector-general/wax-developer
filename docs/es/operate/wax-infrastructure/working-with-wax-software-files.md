---
title: Trabajando con Archivos y Carpetas del Software WAX
order: 149
---

# Trabajando con Archivos y Carpetas del Software WAX

Muchas de nuestras guías han trabajado con la configuración e implementación del software WAX, sin embargo, me di cuenta de que puede que no haya explicado las funciones de archivos y carpetas. En particular, algunos de los matices con los tipos de nodos y la recuperación o sincronización exitosa con el bloque principal de la cadena.

Esta guía repasará las funciones de los archivos y carpetas del software WAX, los tipos de nodos determinados por los datos que contienen y los matices de cómo iniciar o recuperar con éxito un tipo de nodo.

_Este artículo ha sido actualizado para incorporar el_ [_proceso de construcción de software Antelope_](https://antelope.io/).

# Trabajando con Archivos y Carpetas del Software WAX

La estructura del directorio `data-dir` del Software WAX está compuesta por defecto por 5 directorios:

```
/state  
/blocks   
/state-history   
/snapshots  
/protocol_features
```

y 2 archivos:

```
config.ini  
genesis.json
```

La carpeta **/state** contiene el archivo `shared_memory.bin`, que es el archivo mapeado en memoria de la red WAX delgado también llamado base de datos de estado. Es este archivo el que se recupera al iniciar desde un snapshot.

La carpeta **/blocks** contiene el archivo `blocks.log`, que es una copia local de todos los bloques inmutables de la cadena WAX almacenados en el nodo. También contiene un archivo `blocks.index`, que es un índice del archivo `blocks.log` utilizado para encontrar la ubicación de un bloque específico rápidamente.

La carpeta **/state-history** contiene los archivos `chain_state_history.log`, `chain_state_history.index`, `trace_history.log` y `trace_history.index`. Estos archivos capturan datos históricos sobre el estado de la cadena de bloques (WAX Mainnet en este caso) y almacenan estos datos en los archivos haciéndolos externamente legibles en un formato de archivo plano.

La carpeta **/snapshots** es la ubicación predeterminada donde nodeos guarda archivos de snapshot.

La carpeta **/protocol_features** contiene archivos de configuración de características de red .json utilizados para iniciar una nueva red o realizar cambios significativos de características en la cadena existente. Típicamente, esto no sería utilizado por los Gremios de WAX en el Mainnet.

El archivo **config.ini** contiene la configuración de nodeos utilizada al ejecutar el binario nodeos.

El archivo **genesis.json** contiene los parámetros de estado inicial requeridos por cada nuevo nodo de inicio en el Mainnet de WAX.

## Tipos de Nodo

En general, hay 3 tipos de nodos proporcionados por el Software WAX: **productor/query/seed**:

-   productor: Nodo con clave de firma
-   query: Nodo que proporciona API HTTP(S) al público
-   seed: Nodo que proporciona acceso P2P al público

Sin embargo, los niveles de funcionalidad también están determinados por los datos que contiene el nodo. Por ejemplo: Es posible tener un nodo de consulta que no tenga un `blocks.index` completo para la búsqueda de números de bloque, también es posible tener un nodo seed que no tenga todos los bloques en el `blocks.log` y también es posible tener una base de datos de state-history que no se haya construido desde el primer bloque de la red. Todos estos ejemplos significan que cualquier consulta externa o conexión a este nodo parcial no tendrá los datos completos del Nodo Completo / Blockchain presentados.

Con esto en mente, dependiendo de tu caso de uso, puedes elegir un nodo parcial para cumplir la funcionalidad que requieres, sin embargo, para nodos de consulta y seed de cara al público, es más deseable asegurar que tengas la funcionalidad completa.

La construcción de un Nodo Completo y un Nodo Completo de State-History se explican a continuación:

**Nodo Completo:**

-   Completo desde el bloque 1 `blocks.log` (Necesita sincronizarse desde pares desde el génesis o copiado desde otro nodo)
-   `blocks.index` completo (Se construirá automáticamente a partir del `blocks.log` disponible existente)
-   Tener ambos elementos anteriores permitirá la búsqueda de bloques y proporcionará un servicio de pares de bloques completo desde el bloque 1.
-   `shared_memory.bin` actual (Se creará automáticamente al sincronizar desde el génesis, se puede copiar desde otro nodo o se puede recuperar con un [snapshot](https://link.medium.com/YZXqTwk5Gmb))
-   Es importante que al recuperarse de un [snapshot](https://link.medium.com/YZXqTwk5Gmb) se utilice un **snapshot de un número de bloque inferior** al disponible en el `blocks.log`

**Nodo Completo de State-History:**

-   Debe contener el mismo `blocks.log`, `block.index` completo y `shared_memory.bin` actual que un Nodo Completo.
-   Sin embargo, al igual que el `blocks.log`, los archivos `/state-history` deben estar **completos y construidos desde el bloque 1**.
-   Los archivos `/state-history` se pueden copiar desde otro nodo o deben construirse desde un replay o re-sync desde el bloque 1.
-   Es importante que al recuperarse de un [snapshot](https://link.medium.com/YZXqTwk5Gmb) se utilice un **snapshot de un número de bloque inferior**, al que está disponible en el `blocks.log`, así como al que está disponible en los archivos `/state-history`.

**Herramientas de Verificación**

El software WAX tiene una gran herramienta para administrar el `blocks.log` llamada `eosio-blocklog`, este binario se crea al construir.

Haz lo siguiente para consultar los bloques actuales de `blocks.log` y `blocks.index` para moneda y cualquier problema:

```bash
> ./eosio-blocklog --blocks-dir /home/eosphere/datavolume/blocks --smoke-test

Prueba de humo de blocks.log y blocks.index en el directorio "/home/eosphere/datavolume/blocks"
info  2022-01-10T04:59:07.720 eosio-blo block_log.cpp:1081            trim_data            ] block log version= 3
info  2022-01-10T04:59:07.724 eosio-blo block_log.cpp:1133            trim_data            ] first block= 1
info  2022-01-10T04:59:07.724 eosio-blo block_log.cpp:1134            trim_data            ] last block= 160670840
blocks.log y blocks.index están de acuerdo en el número de bloques
```

También

, si tienes alguna corrupción debido a un apagado incorrecto del nodo, es posible recortar limpiamente el final del `blocks.log` actual.

Por ejemplo, puedes recortar hasta el bloque 160670000 de la siguiente manera:

```bash
./eosio-blocklog --blocks-dir /home/eosphere/datavolume/blocks --trim-blocklog --last 160670000
```

---

Estas **Guías Técnicas para Desarrolladores de WAX** se crean utilizando material fuente de la [Serie Técnica de WAX de EOSphere](https://medium.com/eosphere/wax-technical-how-to/home)

Asegúrate de hacer cualquier pregunta en el [Telegram de EOSphere](https://t.me/eosphere_io)
