---
title: Cómo Configurar un Nodo Productor de Bloques de WAX en la Red de Pruebas
order: 144
---

# Cómo Configurar un Nodo Productor de Bloques de WAX en la Red de Pruebas

Proporcionar servicios de API y de semilla son fundamentales para ser parte del Ecosistema de Proveedores de Servicios de WAX, sin embargo, para ser recompensado por tus esfuerzos y participar en la gobernanza de la cadena, necesitarás convertirte en un **Productor de Bloques de la Red de Pruebas de WAX**.

Esta guía te mostrará cómo configurar un Nodo Productor de Bloques de la Red de Pruebas de WAX y registrar tu cuenta como Productor de Bloques de la Red de Pruebas de WAX.

_Este artículo se ha actualizado para incorporar el_ [_proceso de construcción de software Leap de Antelope_](https://antelope.io/).

## Entorno

Existe un consenso entre los Productores de Bloques de que la mejor práctica para cualquier implementación de producción de Antelope es que cada nodo sirva una función específica. En particular, el Nodo Productor de Bloques no debe ser accesible públicamente ni utilizarse como una API o semilla pública.

**En este ejemplo, tendremos tres nodos diferentes que sirven funciones específicas:**

**Nodo de API Pública y Semilla**  
Este es el nodo creado en el Primer Artículo de Cómo Hacer de WAX y se utilizará para proporcionar servicios de API pública y semilla.  
Debe sincronizarse con el último bloque principal de la Red de Pruebas de WAX.

**Nodo Productor de Bloques**   
Este es el nodo utilizado para firmar bloques de forma segura en la Red de Pruebas de WAX y es el principal nodo de producción adicional en este ejemplo.  
Debe sincronizarse con el último bloque principal de la Red de Pruebas de WAX.

Además de configurar la última [lista de pares](https://validate.eosnation.io/waxtest/reports/config.html) confiables publicada por EOSNation, es una buena idea permitir que se conecte a tu propio Nodo de Semilla Pública o solo Bloques.

**Nodo de Interfaz Cleos**  
Este nodo es completamente privado y se utiliza para interactuar con la Red de Pruebas pública a través de la línea de comandos. Ubuntu Terminal / MacOS Terminal / Windows Ubuntu Shell son excelentes sistemas operativos livianos para ejecutar esta interfaz privada.

Se utilizan dos aplicaciones incluidas en el software de WAX: `cleos`, que es la interfaz de línea de comandos para el software de WAX, y `keosd`, que es básicamente un servicio demonio de billetera / gestor de claves para almacenar claves privadas y firmar mensajes digitales. Puedes encontrar los binarios del software de WAX aquí: `~/wax-leap/build/programs/`.

Dado que importarás tus claves privadas en `keosd`, es importante que este nodo esté seguro y se trate como privado.

`cleos` utiliza tus claves importadas en `keosd` como autoridad para ejecutar acciones privilegiadas en la red a través de una API que se ejecuta en `nodeos`.

La relación entre las aplicaciones del software de WAX se muestra en el diagrama anterior.

_Se debe tener en cuenta que ha habido algunos casos informados de consultas de API / acciones que no funcionan como se espera al intentar usar versiones antiguas de_ `cleos` _y_ `keosd` _con un nodo Leap 3.x actualizado. Se recomienda asegurarse de usar la versión 3.x de_ `cleos` _y_ `keosd` _con nodos Leap 3.x._

## Obtener una Cuenta de la Red de Pruebas

Un Productor de Bloques de la Red de Pruebas de WAX requiere una cuenta que se creará y usará para registrar la intención de convertirse en un productor que los titulares de tokens puedan votar.

Hay un costo en Tokens de la Red de Pruebas de WAX asociado con el registro de una cuenta, sin embargo, necesitas una cuenta para mantener los tokens. Esto podría ser problemático... pero hay un creador de cuentas y faucet de la Red de Pruebas de WAX muy útil proporcionado por [WAX Sweden](https://waxsweden.org/) que se puede utilizar para crear fácilmente tu primera cuenta y llenarla con Tokens de la Red de Pruebas de WAX.

Ejecuta las siguientes solicitudes curl en tu nodo Cleos para crear y financiar tu cuenta, obviamente suplementando con el nombre de cuenta deseado:

```
> curl https://faucet.waxsweden.org/create_account?eospherewoot

{"msg": "succeeded", "keys": {"active_key": {"public": "EOS8PSfvq342YTVtogNVskjCttpx1rQX9JT59wQuLt2Nkz16ZmsL4", "private": "5JZsTE4LzwbHKLX25n3D4gSYVtB5AxyDgGGrUPaMWpAmbWveu72"}, "owner_key": {"public": "EOS7gjEzaYfd9FeSU8BzREgrLQz4QwizFfsKDJtgswCwwyhgX6dqa", "private": "5J7zm5kfBkhhuSnzxxxxxxxxxxxxxxxxxxxxxxnmi73eh8ANLzpB"}}, "account": "eospherewoot"}

> curl https://faucet.waxsweden.org/get_token?eospherewoot

{"msg": "succeeded"}
```

Se te presentarán dos pares de claves, `active_key` y `owner_key`... guarda ambos pares de manera segura, en este ejemplo utilizaremos `active_key`.

## Importar tu clave de cuenta a keosd

Ahora que tenemos una cuenta, importémosla a una billetera `keosd` para que podamos usarla con `cleos`.

En tu nodo Cleos, crea una billetera de la Red de Pruebas de WAX e importa tu clave de cuenta:

```
> cleos wallet create -n waxtestnet --to-console

Creating wallet: waxtestnet

Save password to use in the future to unlock this wallet.  
Without password imported keys will not be retrievable.  
"PW5JoPmniazjAH3RTx4gcR5njKvPP6or8k7VzXu8ffGwwsFxqSGYN"
```

`keosd` se inicia automáticamente (es posible que debas asegurarte de que está en la ruta local)... luego se crea la billetera. Esta contraseña es para tu billetera local llamada `waxtestnet`, mantenla segura. Por defecto, las billeteras se almacenan aquí: `~/eosio-wallet`.

Importa tu clave de cuenta activa:

```
# Desbloquea tu billetera con la contraseña de antes
> cleos wallet unlock -n waxtestnet  
password: Unlocked: waxtestnet

# Importa tu active_key: private
> cleos wallet import -n waxtestnet  
private key: imported private key for: EOS8PSfvq342YTVtogNVskjCttpx1rQX9JT59wQuLt2Nkz16ZmsL4
```

## Configurar el Nodo Productor de Bloques

Como se mencionó anteriormente, el Nodo Productor de Bloques necesita una configuración específica que permita la firma de bloques.

En primer lugar, necesitamos un par de claves específicamente para el uso de firma, que se puede lograr utilizando el nodo Cleos:

```
> cleos create key --to-console  
Private key: 5JVfLEuHuoVkEX6CyScPHNLgxtRdUcdLp3hqzrXC54xVjtESFXX  
Public key: EOS6HWBC39JAXaRo5aG5yAcAjgQYhQ44T5GtcxJVbZFZox6FFa15k
```

A continuación, configura el archivo `config.ini` en tu Nodo Productor de Bloques con las siguientes adiciones específicas para la producción de bloques de tu implementación:

```
# Este es el nombre de tu cuenta de BP  
producer-name = eospherewoot

# Este es tu par de claves para firmar bloques  
signature-provider = EOS6HWBC39JAXaRo5aG5yAcAjgQYhQ44T5GtcxJVbZFZox6FFa15k=KEY:5JVfLEuHuoVkEX6CyScPHNLgxtRdUcdLp3hqzrXC54xVjtESFXX

# Optimiza el proceso de entrega anticipada produciendo un poco antes  
last-block-time-offset-us = -200000

# Reduce el es

fuerzo de la CPU disponible en el último bloque para una mejor entrega  
last-block-cpu-effort-percent = 20

# Habilita la producción de bloques en este nodo  
plugin = eosio::producer_plugin
```

Ahora reinicia `nodeos` en tu Nodo Productor de Bloques y asegúrate de que alcance el último bloque principal.

```
> cleos -u https://wax-testnet.eosphere.io get info

{  
  "server_version": "b5344cde",  
  "chain_id": "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12",  
  "head_block_num": 111813838,  
  "last_irreversible_block_num": 111813507,  
  "last_irreversible_block_id": "06aa23838410642de5d297e95a410d68ab9076028fa444c464c48172031f364d",  
  "head_block_id": "06aa24cea654e6250d87e41872f6754000c60226e9a490803186497e0ad70609",  
  "head_block_time": "2021-09-16T05:17:33.000",  
  "head_block_producer": "blacklusionx",  
  "virtual_block_cpu_limit": 200000000,  
  "virtual_block_net_limit": 1048576000,  
  "block_cpu_limit": 199900,  
  "block_net_limit": 1048576,  
  "server_version_string": "v2.0.12wax01",  
  "fork_db_head_block_num": 111813838,  
  "fork_db_head_block_id": "06aa24cea654e6250d87e41872f6754000c60226e9a490803186497e0ad70609",  
  "server_full_version_string": "v2.0.12wax01-b5344cde06837726fef9e384fcedc207dcf6b160"  
}
```

## Registrando tu Cuenta de Productor de Bloques

Ahora que estás seguro de que todo está correctamente configurado y tus nodos están sincronizados con la red, puedes registrar tu intención de firmar bloques y permitir que los titulares de tokens voten por ti.

Antes de ejecutar la acción `regproducer`, ahora probablemente sea un buen momento para publicar tu intención al resto de la Comunidad de la Red de Pruebas de WAX.

Hay un [Grupo de Telegram de la Red de Pruebas de WAX](https://t.me/waxtestnet) donde puedes interactuar con otros Productores de Bloques, Proveedores de Servicios y constructores de DApp.

Recientemente se ha realizado algunas pruebas en relación con la entrega óptima de bloques entre los nodos de producción de bloques en todo el mundo, si informas en el Telegram de dónde está ubicado tu Nodo en el mundo, uno de los BP de la Red de Pruebas te asignará un número de ubicación que ayuda a la red.

Además, necesitarás ser votado en el puesto #21 para poder producir bloques, el Grupo de Telegram es el lugar para solicitar estos votos también.

Ejecuta la acción `regproducer` como se muestra a continuación con tus detalles específicos:

```
# El último número es tu número de ubicación asignado
> cleos -u [https://wax-testnet.eosphere.io](https://wax-testnet.eosphere.io/) system regproducer eospherewoot EOS6HWBC39JAXaRo5aG5yAcAjgQYhQ44T5GtcxJVbZFZox6FFa15k [https://www.eosphere.io](https://www.eosphere.io/) 21
```

Como la acción se ejecuta a nivel de blockchain, en realidad puedes apuntar tu solicitud a cualquier API de la red de prueba sincronizada, es decir, no necesitas ejecutar esta acción en tus propios nodos.

Si/ cuando hayas sido votado en el top #21, la salida de tu `nodeos` se verá algo así durante 12 bloques en una ronda:

```
info  2021-09-16T05:36:01.541 nodeos    producer_plugin.cpp:377       on_incoming_block    ] Received block e23bca90f0e6bc3d... #111816053 @ 2021-09-16T05:36:01.500 signed by eospherewoot [trxs: 0, lib: 111815725, conf: 0, latency: 41 ms]
info  2021-09-16T05:36:02.042 nodeos    producer_plugin.cpp:377       on_incoming_block    ] Received block c6d4ac08300ed117... #111816054 @ 2021-09-16T05:36:02.000 signed by eospherewoot [trxs: 0, lib: 111815725, conf: 0, latency: 42 ms]
```

---

Estas **Guías Técnicas para Desarrolladores de WAX** se crean utilizando material fuente de la [Serie Técnica de WAX de EOSphere](https://medium.com/eosphere/wax-technical-how-to/home)

Asegúrate de hacer cualquier pregunta en el [Telegram de EOSphere](https://t.me/eosphere_io)
