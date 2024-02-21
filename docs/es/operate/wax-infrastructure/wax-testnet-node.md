---
title: Configurar un Nodo de Prueba de WAX
order: 142
---

# Configurar un Nodo de Prueba de WAX

Ejecutar la infraestructura Antelope para admitir la Red de Protocolo WAX puede ser bastante desafiante al principio. Esta serie de guías tiene como objetivo desmitificar los requisitos de infraestructura y operativos necesarios para ejecutar servicios sólidos para la Red de Protocolo WAX.

Esta guía te mostrará cómo empezar a construir un nodo de WAX en la Red de Pruebas Pública de WAX.

_Esta guía se ha actualizado para incorporar el proceso de compilación de software_ _Antelope Leap_._

# Cómo Configurar un Nodo de Prueba de WAX

La Red de Pruebas de WAX tiene requisitos de sistema relativamente bajos en comparación con la Red Principal, sin embargo, es completamente funcional con Tokens de WAX disponibles libremente, por lo que es un lugar ideal para familiarizarse con el software y la red de WAX en sí.

## Requisitos de la Red de Pruebas

**Hardware**

-   CPU de 4 núcleos / _se recomienda 4GHz o más si deseas producir bloques_
-   Disco de 128GB / _preferiblemente SSD o NVMe_
-   4GB de RAM

**Sistema Operativo**

-   Ubuntu 18.04
-   Ubuntu 20.04 **_(Recomendado)_**
-   Ubuntu 22.04

**Internet**

-   Conexión de banda ancha moderna / fibra (1Mb/s y superior)
-   Dirección IP pública estática (ya sea terminando en este nodo o reenviada con NAT)

## Compilar el Software

El software de WAX se deriva del software Antelope de código abierto, sin embargo, se ha modificado para adaptarse a las necesidades de la Red de Protocolo WAX.

Actualmente, la versión y compilación de software aceptada para Productores de Bloques de WAX es `v3.1.0wax01`, creada por [cc32d9](https://cc32d9.medium.com/), miembro del [Gremio EOS Amsterdam](https://eosamsterdam.net/).

La última etiqueta de compilación `wax` está disponible actualmente en [Github de cc32d9](https://github.com/cc32d9/wax-leap/tags).

**Proceso de Compilación**

Este ejemplo utiliza [Ubuntu Linux](https://ubuntu.com/) para compilar el software de WAX desde el origen siguiendo el proceso a continuación:

```bash
> cd ~

> sudo apt install -y file

> git clone [https://github.com/cc32d9/wax-leap.git](https://github.com/cc32d9/wax-leap.git)

> cd wax-leap

> git checkout v3.1.0.wax01

> git submodule update --init --recursive

> sudo bash scripts/install_deps.sh

> mkdir build

# Si es necesario, suplementa $(nproc) abajo con el número de trabajos que tu servidor pueda sostener, sugiero 4GB de RAM requeridos / trabajo

> nice bash scripts/pinned_build.sh ~/wax-leap/build/leap-deps ~/wax-leap/build $(nproc)

# Los binarios se encuentran en ~/wax-leap/build/programs
```

## Configuración

Ahora que se ha compilado una versión limpia del software de WAX, vamos a configurarlo para su funcionamiento.

Para configurar y comenzar el nodo, se utilizará `nodeos`, que es el demonio de servicio principal que se ejecuta en cada nodo de la Red de Protocolo WAX.

`nodeos` puede configurarse para procesar contratos inteligentes, validar transacciones, producir bloques que contengan transacciones válidas y confirmar bloques para registrarlos en la cadena de bloques. Puedes leer más al respecto [aquí](https://developers.eos.io/manuals/eos/latest/nodeos/index).

Las funciones operativas principales de `nodeos` son; ejecutarlo como Productor de Bloques, Punto Final de API de Red, Nodo Semilla P2P o Nodo de Historial de Estado. Típicamente, en una red ocupada como la Red Principal de WAX, separarías estas funciones en servidores físicamente discretos.

En este ejemplo de la Red de Pruebas de WAX, harás que tu nodo se conecte con otros pares de red, ofrezca un servicio de Nodo Semilla P2P y haga que el nodo esté disponible como un Punto Final de API de Red. _Este nodo no proporcionará soporte para consultas de datos históricos._

`nodeos` requiere **dos archivos** para conectarse con los pares y ejecutarse en la Red de Pruebas de WAX:

**config.ini**

Crea un `config.ini` predeterminado ejecutando `nodeos` sin configuración como se muestra a continuación:

```bash
> mkdir ~/waxdata

> cd ~/wax-leap/build/programs/nodeos

> ./nodeos --data-dir ~/waxdata --config-dir ~/waxdata
```

Luego podrás editar el nuevo `config.ini` y ver todos los parámetros disponibles:

```bash
> cd ~/waxdata

> nano config.ini
```

Ahora edita el `config.ini` y agrega la siguiente configuración:

```ini
wasm-runtime = eos-vm-jit

chain-state-db-size-mb = 16384  
chain-state-db-guard-size-mb = 1024

enable-account-queries = true

http-server-address = 0.0.0.0:8888  
access-control-allow-origin = *  
access-control-allow-headers = Origin, X-Requested-With, Content-Type, Accept  
http-max-response-time-ms = 100  
verbose-http-errors = true  
http-validate-host = false

p2p-listen-endpoint = 0.0.0.0:9876  
  
# 3dkrenderwax: FI, Finlandia  
p2p-peer-address = testnet-p2p.3dkrender.com:9876  
  
# amsterdamwax: DE, Falkenstein  
p2p-peer-address = waxtest.eu.eosamsterdam.net:9912  
  
# blokcrafters: EE. UU., Portland, Oregón  
p2p-peer-address = waxtest-peer-us.blokcrafters.io:19876  
  
# blokcrafters: FI, Helsinki, Uusimaa  
p2p-peer-address = waxtest-peer-eu.blokcrafters.io:19876  
  
# bountyblokbp: FR, Francia  
p2p-peer-address = p2p.wax-test.bountyblok.io:9874  
  
# bp.box: KY, Islas Caimán  
p2p-peer-address = waxtest.defibox.xyz:19876  
  
# eosdacserver: DE, Alemania  
p2p-peer-address = waxtest-p2p.e

osdac.io:49876  
  
# eosiodetroit: EE. UU., wax-testnet-bp  
p2p-peer-address = p2p.testnet.wax.detroitledger.tech:1337  
  
# eosphereiobp: AU, Sídney  
p2p-peer-address = peer1-wax-testnet.eosphere.io:9876  
  
# greeneosiobp: DE, Alemania  
p2p-peer-address = p2p.waxtest.waxgalaxy.io:9878  
  
# guild.nefty: DE, Alemania  
p2p-peer-address = p2p-testnet.neftyblocks.com:19876  
  
# ivote4waxusa: EE. UU., Greenville, SC, EE. UU.  
p2p-peer-address = test.wax.p2p.eosusa.io:19875  
  
# liquidgaming: DE, Alemania  
p2p-peer-address = 138.201.23.118:9877  
  
# nation.wax: CA, Canadá  
p2p-peer-address = waxtest.seed.eosnation.io:9876  
  
# oneinacilian: GB, Reino Unido  
p2p-peer-address = p2ptest.oiac.io:10877  
  
# pink.gg: DE, Alemania  
p2p-peer-address = peer1.testnet.wax.pink.gg:16714  
  
# waxhiveguild: DE, Alemania  
p2p-peer-address = peer-test.hivebp.io:9876  
  
# waxmadrid111: DE, SEED  
p2p-peer-address = wax-seed-testnet.eosiomadrid.io:9876  
  
# waxswedenorg: SE, Suecia  
p2p-peer-address = p2p.testnet.waxsweden.org:59676  
  
# wecan: DE, Berlín  
p2p-peer-address = seed1-wax-testnet.wecan.dev:9876  
  
# wecan: GB, Londres  
p2p-peer-address = seed2-wax-testnet.wecan.dev:9876

# Lista de Pares Proporcionada por EOSNation - https://validate.eosnation.io/waxtest/reports/config.html

agent-name = "<tu nombre> WAX Testnet"

max-clients = 100

sync-fetch-span = 500

plugin = eosio::http_plugin  
plugin = eosio::chain_plugin  
plugin = eosio::chain_api_plugin
```

**genesis.json**

Estos son los parámetros de estado inicial requeridos por cada nodo nuevo que comienza en la Red de Pruebas de WAX. Crea el archivo de la siguiente manera:

```bash
> cd ~/waxdata

> nano genesis.json
```

Agrega los siguientes parámetros al archivo `genesis.json` para la Red de Pruebas Pública de WAX:

```json
{  
 "initial_timestamp": "2019-12-06T06:06:06.000",  
 "initial_key": "EOS7PmWAXLBaqCzSgbq8cyr2HFztQpwBpXk3djBJA8fyoyUnYM37q",  
 "initial_configuration": {  
 "max_block_net_usage": 1048576,  
 "target_block_net_usage_pct": 1000,  
 "max_transaction_net_usage": 524288,  
 "base_per_transaction_net_usage": 12,  
 "net_usage_leeway": 500,  
 "context_free_discount_net_usage_num": 20,  
 "context_free_discount_net_usage_den": 100,  
 "max_block_cpu_usage": 200000,  
 "target_block_cpu_usage_pct": 2500,  
 "max_transaction_cpu_usage": 150000,  
 "min_transaction_cpu_usage": 100,  
 "max_transaction_lifetime": 3600,  
 "deferred_trx_expiration_window": 600,  
 "max_transaction_delay": 3888000,  
 "max_inline_action_size": 4096,  
 "max_inline_action_depth": 6,  
 "max_authority_depth": 6  
 }  
}
```

## Ejecutando Nodeos

Ahora que se ha configurado `config.ini` y se han creado los parámetros iniciales de la cadena de la Red de Pruebas de WAX en `genesis.json`, ahora puedes unirte a la red y sincronizar el nodo.

Usa `screen` para mantener tu sesión activa incluso cuando te desconectas, el uso es el siguiente:

```bash
Crear una nueva sesión de screen  
----------------------------  
> screen -US wax   
  
Desconectar la sesión de screen  
-------------------------  
> ctrl-a+d 

Reconectar la sesión de screen  
------------------------  
> screen -r wax
```

Ejecuta `nodeos` con punteros al archivo de configuración, directorio de datos y archivo `genesis`:

```bash
> cd ~/wax-leap/build/programs/nodeos

> ./nodeos --data-dir ~/waxdata --config-dir ~/waxdata --genesis-json ~/waxdata/genesis.json
```

Tu nodo de la Red de Pruebas de WAX ahora comenzará a sincronizarse con los pares configurados hasta que se ponga al día y esté actualizado con la cadena de la Red de Pruebas de WAX.

---

Estas **Guías Técnicas para Desarrolladores de WAX** se crean utilizando material fuente de la [Serie Técnica de WAX de EOSphere](https://medium.com/eosphere/wax-technical-how-to/home)

Asegúrate de hacer cualquier pregunta en el [Telegram de EOSphere](https://t.me/eosphere_io)
