---
title: Cómo configurar un nodo de Estado-Historial de WAX
order: 148
---

Existe un tipo de implementación de nodoos que es crucial para el funcionamiento de numerosos servicios principales de WAX, como [Hyperion Full History](https://github.com/eosrio/hyperion-history-api) y la [API de Activos Atómicos](https://github.com/pinknetworkx/eosio-contract-api), y ese es el servicio de Estado-Historial.

Esta guía te mostrará cómo construir, configurar y desplegar nodeos para proporcionar funcionalidad de Estado-Historial, también conocida como un nodo de Protocolo de Historial de Estado (SHIP).

> Este artículo ha sido actualizado para incorporar el proceso de construcción de software_ [_Antelope_](https://antelope.io/).

# Cómo configurar un nodo de Estado-Historial de WAX

El complemento de Estado-Historial es utilizado por nodeos para capturar datos históricos sobre el estado de la cadena de bloques (en este caso, WAX Mainnet) y almacenar estos datos en un formato de archivo plano legible externamente.

Este complemento abre una interfaz websocket que puede ser utilizada por múltiples servicios externos simultáneos, como Hyperion y Atomic, para leer estos datos de manera simple y efectiva.

Dado lo dependientes que son los servicios externos de los nodos SHIP, es crucial que un Gremio proporcione un servicio sólido y confiable que pueda escalar para satisfacer las demandas de los requisitos en expansión de WAX Mainnet.

Este artículo guiará a través de un ejemplo que es válido actualmente (septiembre de 2022) y que está en uso por el Gremio EOSphere, que está sirviendo múltiples conexiones websocket tanto para nuestros propios servicios como para servicios de otros Gremios.

# Requisitos de la Mainnet

**Hardware**

-   CPU de 4 núcleos / _4Ghz+_
-   (1) Disco de 256GB+ / _SSD de calidad empresarial o NVMe (_**_Requisito de Alta Resistencia_**_)_
-   (2) Disco de 10TB+ / _SAS o SATA son aceptables, sin embargo, se prefieren SSD o NVMe_

Actualmente (septiembre de 2022), los directorios `blocks` y `state-history` ocupan poco menos de **8TB** de espacio en disco.

```
2.1T    ./blocks  
5.7T    ./state-history  
7.8T    .
```

-   RAM de 128GB+

**Sistema Operativo**

-   Ubuntu 18.04
-   Ubuntu 20.04  **_(Recomendado)_**
-   Ubuntu 22.04

**Internet**

-   Conexión de banda ancha moderna / Fibra óptica (síncrona de 100Mb/s o superior)

# Preparar el Entorno del Sistema Operativo

Antes de que se construya y configure el software de WAX, es necesario configurar el entorno del sistema operativo, en este caso Ubuntu 20.04, para el rendimiento y la carga que va a soportar.

# Sistema de Archivos Zettabyte (ZFS)

Esta construcción de nodo utiliza **2 Discos SAS Discretos** para equilibrar la E/S del disco y proporcionar una opción de almacenamiento más asequible para los directorios `/blocks` y `/state-history`, que actualmente son 8TB y están en crecimiento.

**Disco 1** es el SSD o NVMe de grado empresarial de alta velocidad que será el disco del sistema operativo utilizado para el software de WAX, toda la configuración y los archivos de estado. Los archivos de estado son extremadamente intensivos en E/S, la vida útil de un SSD basado en consumidores será breve debido al alto número de escrituras, de ahí la necesidad de usar un SSD o NVMe de alta resistencia de grado empresarial.

_Nota:_ _Es necesario mencionar que existen mecanismos para ejecutar estos archivos de estado en memoria si se dispone de suficiente, este tema se tratará en un artículo futuro._

En este ejemplo, el Disco 1 ejecutará el sistema operativo predeterminado **Ext4 File System** que ya estará implementado durante la instalación de Ubuntu 20.04.

**Disco 2** es el disco SATA o SAS de gran capacidad que alojará los directorios `/blocks` y `/state-history`. Las demandas de E/S en estos directorios son mucho más bajas que los archivos de estado y los discos basados en husillos de mayor capacidad y más lentos siguen siendo adecuados.

En este ejemplo, el Disco 2 ejecutará el **Sistema de Archivos ZFS** que nos proporcionará dos beneficios principales. ZFS nos permitirá usar la **compresión LZ4** y mejorará la E/S del disco con **Adaptive Replacement Cache** (ARC). La compresión solo se utilizará para el directorio /blocks (que actualmente tiene una ganancia de 1.3x) ya que no hay beneficios en el archivo plano de state-history ya optimizado.

Implemente ZFS en el Disco 2 con la siguiente configuración:

```
# Instalar ZFS  
> sudo apt-get install zfsutils-linux

# Localizar el nombre del dispositivo del Disco 2  
> lsblk

# Crear un Pool ZFS llamado "datavolume" en el dispositivo "sdb"  
> sudo zpool create datavolume /dev/sdb

# Habilitar la compresión LZ4  
> sudo zfs set compression=lz4 datavolume

# Desactivar las actualizaciones de tiempo de acceso de ZFS  
> sudo zfs set atime=off datavolume

# Establecer ARC para cachear solo metadatos  
> sudo zfs set primarycache=all datavolume

# Establecer la ubicación del punto de montaje en su ubicación preferida  
> sudo zfs set mountpoint=/home/eosphere/datavolume datavolume

# Crear las carpetas específicas para /blocks y /state-history  
> mkdir /home/eosphere/datavolume/blocks

> mkdir /home/eosphere/datavolume/state-history

# Establecer un punto de montaje específico para /blocks y /state-history  
> sudo zfs create -o mountpoint=/home/eosphere/datavolume/blocks datavolume/blocks

> sudo zfs create -o mountpoint=/home/eosphere/datavolume/state-history datavolume/state-history

# Desactivar la compresión lz4 en el punto de montaje state-history  
> sudo zfs set compression=none datavolume/state-history

# Verificar la configuración de ZFS  
> zfs get all
```

# Protocolo de Tiempo de Red (NTP)

Es crucial para una cadena de bloques globalmente entrelazada tener tiempo sincronizado en todos los nodos.

[Chrony](https://chrony.tuxfamily.org/)  es un excelente cliente NTP y es bastante adecuado para las necesidades de la WAX Mainnet.

Instale, configure y verifique como se muestra a continuación:

```
# Instalar Chrony  
> sudo apt install chrony

# Si es necesario, agregue manualmente pares locales, estos son servidores AU  
> sudo nano /etc/chrony/chrony.conf  
  
server 0.pool.ntp.org  
server 1.pool.ntp.org  
server 2.pool.ntp.org  
server 3.pool.ntp.org

# Reiniciar Chrony  
> sudo /etc/init.d/chrony restart

# Verificar  
> chronyc sources -v  

> chronyc tracking

# Establecer su zona horaria local si es necesario  
> sudo timedatectl set-timezone Australia/Perth
```

# Límites de Pila y Archivos Abiertos

La dirección de memoria del software de WAX y el número de solicitudes de API que recibirá un Nodo Principal de Producción requieren que se aumenten los límites predeterminados de Pila y Número de Archivos Abiertos de Ubuntu 20.04.

Configure y verifique los límites aumentados de la siguiente manera:

```
> sudo nano /etc/systemd/system.conf

# Agregar la siguiente configuración  
DefaultLimitNOFILE=64000   
DefaultLimitSTACK=65536000

# Reiniciar el servidor y verificar  
> ulimit -a
```

# Compilar el Software

El software de WAX se deriva del software Antelope de código abierto, sin embargo, se ha modificado para adaptarse a las necesidades de la Red de Protocolo de WAX.

Actualmente, la versión y construcción de software de WAX Block Producer aceptada es `v3.

1.0wax01`  creada por  [cc32d9](https://cc32d9.medium.com/), miembro del  [EOS Amsterdam Guild](https://eosamsterdam.net/)

La última etiqueta de construcción de `wax` está disponible actualmente en [cc32d9 Github](https://github.com/cc32d9/wax-leap/tags)

**Proceso de Construcción**

Este ejemplo utiliza [Ubuntu Linux](https://ubuntu.com/)  para compilar el software de WAX desde el origen siguiendo el proceso a continuación:

```
> cd ~

> sudo apt install -y file

> git clone https://github.com/cc32d9/wax-leap.git

> cd wax-leap

> git checkout v3.1.0.wax01

> git submodule update --init --recursive

> sudo bash scripts/install_deps.sh

> mkdir build

# Si es necesario, suplemente $(nproc) a continuación con el número de trabajos que su servidor puede soportar, sugiero 4GB de RAM requeridos / trabajo
> nice bash scripts/pinned_build.sh ~/wax-leap/build/leap-deps ~/wax-leap/build $(nproc)

# Los binarios están ubicados en ~/wax-leap/build/programs
```

# Configuración

Ahora que se ha compilado una versión limpia del software de WAX, procedamos a configurar state-history para la operación de la WAX Mainnet.

Para configurar y iniciar el nodo se utilizará `nodeos`, que es el daemon del servicio principal que se ejecuta en cada nodo de la Red de Protocolo de WAX.

`nodeos`  puede configurarse para procesar contratos inteligentes, validar transacciones, producir bloques que contienen transacciones válidas y confirmar bloques para registrarlos en la cadena de bloques.

Las funciones operativas principales de `nodeos` son; ejecutarlo como Productor de Bloques, Punto Final de API de Red, Nodo Semilla P2P o Nodo de Estado-Historial. Típicamente, en una red concurrida como la WAX Mainnet, separaría estas funciones en servidores físicamente discretos.

En este ejemplo de la WAX Mainnet, hará que su nodo se conecte a otros pares de red y esté disponible para conexiones API y Websocket como un nodo de Estado-Historial (SHIP).

`nodeos`  requiere **dos archivos** para conectarse a pares y ejecutarse en la WAX Mainnet:

**config.ini**

Cree un `config.ini` predeterminado ejecutando `nodeos` sin configuración como se muestra a continuación:

```
> mkdir ~/waxdata

> cd ~/wax-leap/build/programs/nodeos

> ./nodeos --data-dir ~/waxdata --config-dir ~/waxdata
```

Luego podrá editar el `config.ini` recién creado y ver todos los parámetros disponibles:

```
> cd ~/waxdata> nano config.ini
```

Ahora edite el `config.ini` y agregue la siguiente configuración:

```
# la ubicación del directorio de bloques en el Disco 2  
blocks-dir = /home/eosphere/datavolume/blocks

wasm-runtime = eos-vm-jit  
chain-state-db-size-mb = 131072  
chain-state-db-guard-size-mb = 1024

read-mode = head

http-server-address = 0.0.0.0:8888  
access-control-allow-origin = *  
access-control-allow-headers = Origin, X-Requested-With, Content-Type, Accept  
http-max-response-time-ms = 100  
verbose-http-errors = true  
http-validate-host = false

p2p-listen-endpoint = 0.0.0.0:9876

# 3dkrenderwax: FI, wax-peer  
p2p-peer-address = peer.3dkrender.com:9880  
  
# 3dkrenderwax: FI, query  
p2p-peer-address = query.3dkrender.com:9880  
  
# amsterdamwax: NL, Amsterdam  
p2p-peer-address = wax.eu.eosamsterdam.net:9101  
  
# amsterdamwax: US, Washington, D.C.  
p2p-peer-address = waxp2p.us.eosamsterdam.net:9101  
  
# blokcrafters: CA, Montreal, Quebec  
p2p-peer-address = wax-peer-ca.blokcrafters.io:9876  
  
# blokcrafters: FI, Helsinki, Uusimaa  
p2p-peer-address = wax-peer-eu.blokcrafters.io:9876  
  
# bp.box: KY, Cayman Islands  
p2p-peer-address = wax.defibox.xyz:9966  
  
# bp.wecan: GB, London  
p2p-peer-address = seed2-wax-mainnet.wecan.dev:14998  
  
# bp.wecan: US, NewYork  
p2p-peer-address = seed3-wax-mainnet.wecan.dev:14998  
  
# cryptolions1: DE, Germany-Finland  
p2p-peer-address = wax.cryptolions.io:9876  
  
# dapplica: DE, Germany-Finland  
p2p-peer-address = wax.dapplica.io:9876  
  
# eosauthority: DE, Falkenstein  
p2p-peer-address = node-wax.eosauthority.com:10301  
  
# eosauthority: FI, Helsinki  
p2p-peer-address = node-wax-p2p.eosauthority.com:10301  
  
# eosdacserver: GB, United Kingdom  
p2p-peer-address = wax-p2p.eosdac.io:29876  
  
# eosdublinwow: FI, Finland  
p2p-peer-address = wax.p2p.eosdublin.io:9876  
  
# eoseouldotio: JP, Seoul  
p2p-peer-address = p2p.wax.eoseoul.io:29876  
  
# eosphereiobp: CA, Beauharnois  
p2p-peer-address = peer1-wax.eosphere.io:9876  
  
# eosphereiobp: CA, Beauharnois  
p2p-peer-address = peer2-wax.eosphere.io:9876  
  
# greeneosiobp: DE, Germany  
p2p-peer-address = p2p1.wax.greeneosio.com:9876  
  
# guild.nefty: DE, Germany  
p2p-peer-address = p2p-node1.neftyblocks.com:9876  
  
# guild.nefty: FI, Finland  
p2p-peer-address = p2p-node2.neftyblocks.com:9876  
  
# ledgerwiseio: FI, LB  
p2p-peer-address = waxp2p.ledgerwise.io:21877  
  
# nation.wax: CA, Canada  
p2p-peer-address = wax.seed.eosnation.io:9876  
  
# oneinacilian: GB, United Kingdom  
p2p-peer-address = p2p.oiac.io:9876  
  
# sentnlagents

: GB, United Kingdom  
p2p-peer-address = waxp2p.sentnl.io:9876  
  
# tokengamerio: DE, Germany  
p2p-peer-address = peer2.wax.tgg.gg:9876  
  
# waxhiveguild: FI, Finnland  
p2p-peer-address = peer1.hivebp.io:9876  
  
# waxhiveguild: DE, Germany  
p2p-peer-address = peer2.hivebp.io:9876  
  
# waxmadrid111: DE, SEED  
p2p-peer-address = wax-seed.eosiomadrid.io:9876  
  
# waxswedenorg: SE, Sweden  
p2p-peer-address = p2p.waxsweden.org:35777

# Lista de Pares - https://validate.eosnation.io/wax/reports/config.html

agent-name = "<su nombre> Nodo de Estado-Historial WAX Mainnet"  
  
sync-fetch-span = 500

state-history-dir = /home/eosphere/datavolume/state-history  
trace-history = true  
chain-state-history = true  
state-history-endpoint = 0.0.0.0:8080

plugin = eosio::http_plugin  
plugin = eosio::state_history_plugin  
plugin = eosio::chain_plugin  
plugin = eosio::chain_api_plugin
```

**genesis.json**

Estos son los parámetros de estado iniciales requeridos por cada nodo nuevo que comienza en la WAX Mainnet. Cree el archivo de la siguiente manera:

```
> cd ~/waxdata

> nano genesis.json
```

Agregue los siguientes parámetros al archivo `genesis.json` para la WAX Public Mainnet:

```
{  
  "initial_timestamp": "2019-06-05T12:00:00.000",  
  "initial_key": "EOS8i2pkwtv2JmdYWNJdcy5BcJ7wCE5q6mpE1hwT25HdgHMzeRday",  
  "initial_configuration": {  
    "max_block_net_usage": 1048576,  
    "target_block_net_usage_pct": 1000,  
    "max_transaction_net_usage": 524288,  
    "base_per_transaction_net_usage": 12,  
    "net_usage_leeway": 500,  
    "context_free_discount_net_usage_num": 20,  
    "context_free_discount_net_usage_den": 100,  
    "max_block_cpu_usage": 500000,  
    "target_block_cpu_usage_pct": 2000,  
    "max_transaction_cpu_usage": 150000,  
    "min_transaction_cpu_usage": 100,  
    "max_transaction_lifetime": 3600,  
    "deferred_trx_expiration_window": 600,  
    "max_transaction_delay": 3888000,  
    "max_inline_action_size": 4096,  
    "max_inline_action_depth": 4,  
    "max_authority_depth": 6  
  }  
}
```

# Ejecutar Nodeos

Ahora que se ha configurado el `config.ini` y se han creado los parámetros iniciales de la cadena de bloques de la WAX Mainnet en `genesis.json`, ahora puede unirse a la red y sincronizar el nodo.

Use screen para mantener viva su sesión incluso cuando se desconecte, el uso es el siguiente:

```
# Crear una nueva sesión de screen
> screen -US wax 

# Desconectar la sesión de screen
> ctrl-a+d 

# Reconectar la sesión de screen
> screen -r wax
```

Ejecute `nodeos` con punteros al archivo de configuración, directorio de datos y archivo de inicio de genesis:

```
> cd ~/wax-leap/build/programs/nodeos
> ./nodeos --data-dir ~/waxdata --config-dir ~/waxdata --genesis-json ~/waxdata/genesis.json --disable-replay-opts
```

Su nodo de la WAX Mainnet ahora comenzará a sincronizarse con los pares configurados y alcanzará el último bloque de la cadena de la WAX Mainnet.

En el momento de la escritura (septiembre de 2022), esto puede tomar hasta un mes para una sincronización completa de bloques desde el génesis. También puede ayudar si elige algunos pares ubicados cercanos para limitar la sobrecarga de los pares y garantizar una latencia baja.

A medida que su nodo sincroniza desde el inicio de la cadena, construirá los archivos de registro e índice en los directorios `/blocks` y `/state-history`.

Su nodo será accesible a través del puerto **http 8888** para consultas y **ws 8080** para state-history.

---

Estas **Guías Técnicas para Desarrolladores de WAX** se crean utilizando material fuente de la [Serie Técnica de Cómo Hacer de EOSphere WAX](https://medium.com/eosphere/wax-technical-how-to/home)

Asegúrese de hacer cualquier pregunta en el [Telegram de EOSphere](https://t.me/eosphere_io)