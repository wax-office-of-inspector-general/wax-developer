---
título: Cómo Configurar un Nodo Principal WAX Sólido
orden: 145
---

# Cómo Configurar un Nodo Principal WAX Sólido

Los tokens disponibles gratuitamente y los requisitos de sistema relativamente bajos hacen que el Testnet de WAX sea un lugar ideal para aprender, sin embargo, ahora es el momento de graduarse al Mainnet de WAX.

Esta guía te proporcionará la información para construir nodos sólidos de Mainnet de WAX que manejarán las demandas de red e infraestructura que se requieren cumplir por las Guilds exitosas.

_Este artículo ha sido actualizado para incorporar el proceso de construcción de software_ [_Antelope_](https://antelope.io/) _Leap._

# Cómo Configurar un Nodo Principal WAX Sólido

El Mainnet de WAX, en lo que respecta a las cadenas de Antelope, tiene un requisito de infraestructura muy pesado. Por supuesto, el Mainnet de WAX está en constante crecimiento y hay numerosas formas de cumplir con estos requisitos.

Este artículo repasará un ejemplo que actualmente es válido (septiembre de 2022) y utilizado por la Guild de EOSphere, que está sirviendo a múltiples peers y millones de solicitudes de API por día.

# Requisitos del Mainnet

**Hardware**

-   CPU de 4 núcleos / _se recomienda 4Ghz+ si deseas producir bloques_
-   (1) Disco de 256GB+ / _SSD o NVMe de Grado Empresarial (_**_Alta Resistencia Req._**_)_
-   (2) Disco de 4TB+ / _SAS o SATA están bien, sin embargo, se prefieren SSD o NVMe_
-   128GB+ RAM

**Sistema Operativo**

-   Ubuntu 18.04
-   Ubuntu 20.04  **_(Recomendado)_**
-   Ubuntu 22.04

**Internet**

-   Conexión moderna de banda ancha / fibra (100Mb/s sincrónicos y superior)
-   Dirección IP Pública Estática (Ya sea terminando en este nodo o reenviada con NAT)

# Preparar el Entorno del Sistema Operativo

Antes de que el software de WAX sea construido y configurado, el entorno del sistema operativo, Ubuntu 20.04 en este caso, necesita ser configurado para el rendimiento y la carga que tomará.

## Sistema de Archivos Zettabyte (ZFS)

Esta construcción de nodo utiliza **2 Discos Discretos** para equilibrar la IO de disco y proporcionar una opción de almacenamiento más asequible para el archivo `blocks.log`, que actualmente es de 2.1TB y creciendo.

**Disco 1** es el SSD o NVMe de grado empresarial de alta velocidad que será el disco del SO utilizado para el software de WAX, todos los archivos de configuración y los archivos de estado. Los archivos de estado son extremadamente intensivos en IO, la vida útil de un SSD basado en consumidor será corta debido al alto número de escrituras, de ahí la necesidad de usar un SSD o NVMe empresarial de alta resistencia.

_Nota:_ _Es necesario mencionar que hay mecanismos para ejecutar estos archivos de estado en memoria si tienes suficiente disponible, este tema se cubrirá en un futuro artículo._

En este ejemplo, el Disco 1 ejecutará el **Sistema de Archivos Ext4** predeterminado del SO que ya se implementará durante la instalación de Ubuntu 20.04.

**Disco 2** es el disco grande de capacidad SATA o SAS que albergará el archivo `blocks.log`. Las demandas de IO en el directorio de bloques son mucho menores que los archivos de estado y los discos de husillo de mayor capacidad y más lentos aún son adecuados.

En este ejemplo, el Disco 2 ejecutará el **Sistema de Archivos ZFS** que nos dará dos beneficios principales. ZFS nos permitirá usar compresión LZ4 (que actualmente es una ganancia de 1.3x) y mejorará la IO de disco con **Cache de Reemplazo Adaptativo** (ARC)

Implementa ZFS en el Disco 2 con la siguiente configuración:

```
#Instalar ZFS  
> sudo apt-get install zfsutils-linux

#Localizar el nombre del dispositivo del Disco 2  
> lsblk

#Crear Pool ZFS llamado "datavolume" en el dispositivo "sdb"  
> sudo zpool create datavolume /dev/sdb

#Habilitar compresión

 LZ4  
> sudo zfs set compression=lz4 datavolume

#Deshabilitar actualizaciones de tiempo de acceso de ZFS  
> sudo zfs set atime=off datavolume

#Establecer ARC para solo cachear metadatos  
> sudo zfs set primarycache=all datavolume

#Establecer el punto de montaje a tu ubicación preferida  
> sudo zfs set mountpoint=/home/eosphere/datavolume datavolume

#Verificar configuraciones de ZFS  
> zfs get all
```

## Protocolo de Tiempo de Red (NTP)

Es crucial para una blockchain globalmente entrelazada tener un tiempo sincronizado en todos los nodos.

[Chrony](https://chrony.tuxfamily.org/) es un excelente cliente NTP y es bastante adecuado para las necesidades de Mainnet de WAX.

Instala, configura y verifica como se indica a continuación:

```
#Instalar Chrony  
> sudo apt install chrony

#Si es necesario, añade manualmente peers locales, estos son servidores AU  
> sudo nano /etc/chrony/chrony.conf  
  
server 0.pool.ntp.org  
server 1.pool.ntp.org  
server 2.pool.ntp.org  
server 3.pool.ntp.org

#Reiniciar Chrony  
> sudo /etc/init.d/chrony restart

#Verificar  
> chronyc sources -v  
> chronyc tracking

#Establecer tu zona horaria local si es necesario  
> sudo timedatectl set-timezone Australia/Perth
```

## Límites de Stack y Archivos Abiertos

El software de WAX para direccionamiento de memoria y el número de solicitudes de API que recibirá un Nodo Principal de Producción de Mainnet requerirá que los límites predeterminados de Stack y Número de Archivos Abiertos de Ubuntu 20.04 sean aumentados.

Configura y verifica los límites aumentados como se indica a continuación:

```
> sudo nano /etc/systemd/system.conf

#Añadir la siguiente configuración  
DefaultLimitNOFILE=64000   
DefaultLimitSTACK=65536000

#Reiniciar el servidor y verificar  
> ulimit -a
```

# Construir el Software

El software de WAX se deriva del software de código abierto de Antelope, sin embargo, ha sido modificado para adaptarse a las necesidades de la Red del Protocolo WAX.

Actualmente, la construcción y versión del software de WAX aceptada por el Productor de Bloques es `v3.1.0wax01` creada por [cc32d9](https://cc32d9.medium.com/), quien es miembro de la [Guild de EOS Amsterdam](https://eosamsterdam.net/)

La última etiqueta de construcción de `wax` está disponible actualmente en el [Github de cc32d9](https://github.com/cc32d9/wax-leap/tags)

**Proceso de Construcción**

Este ejemplo utiliza [Ubuntu Linux](https://ubuntu.com/) para construir el software de WAX desde la fuente siguiendo el proceso a continuación:

```
> cd ~

> sudo apt install -y file

> git clone https://github.com/cc32d9/wax-leap.git

> cd wax-leap

> git checkout v3.1.0.wax01 

> git submodule update --init --recursive

> sudo bash scripts/install_deps.sh

> mkdir build

# Si es necesario, sustituye $(nproc) abajo con el número de trabajos que tu servidor puede sostener, sugiero 4GB RAM requeridos / trabajo

> nice bash scripts/pinned_build.sh ~/wax-leap/build/leap-deps ~/wax-leap/build $(nproc)

# Los binarios se encuentran en ~/wax-leap/build/programs
```

# Configuración

Ahora que se ha compilado una construcción limpia del software de WAX, vamos a configurarlo para operar en el Mainnet de WAX.

Para configurar e iniciar el nodo se utilizará `nodeos`, `nodeos` es el daemon del servicio principal que se ejecuta en cada nodo de la Red del Protocolo WAX.

`nodeos` puede ser configurado para procesar contratos inteligentes, validar transacciones, producir bloques que contengan transacciones válidas y confirmar bloques para registrarlos en la blockchain.

Las funciones operativas principales de `nodeos` son; ejecutarlo como un Productor de Bloques, Punto Final de API de Red, Nodo Semilla P2P o Nodo de Historial de Estado. Típicamente en una red ocupada como el Main

net de WAX, separarías estas funciones en servidores físicamente discretos.

En este ejemplo de Mainnet de WAX, harás que tu nodo se conecte a otros peers de la red, ofrezca un servicio de Nodo Semilla P2P y haga que el nodo esté disponible como un Punto Final de API de Red. _Este nodo no proporcionará soporte de consulta de datos históricos._

`nodeos` requiere **dos archivos** para conectarse a peers y ejecutarse en el Mainnet de WAX:

**config.ini**

Crea un `config.ini` predeterminado ejecutando `nodeos` sin configuración según el comando a continuación:

```
> mkdir ~/waxdata

> cd ~/wax-leap/build/programs/nodeos

> ./nodeos --data-dir ~/waxdata --config-dir ~/waxdata
```

Luego podrás editar el recién creado `config.ini` y ver todos los parámetros disponibles:

```
> cd ~/waxdata

> nano config.ini
```
Ahora edita el `config.ini` y añade las siguientes configuraciones:

```
# the location of the blocks directory on Disk 2  
blocks-dir = /home/eosphere/datavolume/blocks

wasm-runtime = eos-vm-jit
chain-state-db-size-mb = 131072  
chain-state-db-guard-size-mb = 1024  
enable-account-queries = true  
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
  
# blacklusionx: DE, Germany  
p2p-peer-address = peer1.wax.blacklusion.io:4646  
  
# blokcrafters: US, Reston, Virginia  
p2p-peer-address = wax-seed1.blokcrafters.io:9876  
  
# blokcrafters: US, Reston, Virginia  
p2p-peer-address = wax-seed2.blokcrafters.io:9876  
  
# bountyblokbp: US, UnitedStates  
p2p-peer-address = p2p.wax.bountyblok.io:29876  
  
# cryptolions1: DE, Germany-Finland  
p2p-peer-address = wax.cryptolions.io:9876  
  
# csxcommunity: DE, Nuremberg,Bavaria  
p2p-peer-address = wax.csx.io:9876  
  
# dapplica: DE, Germany-Finland  
p2p-peer-address = wax.dapplica.io:9876  
  
# eosarabianet: DE, Munich  
p2p-peer-address = p2p-wax.eosarabia.net:9876  
  
# eosauthority: DE, Falkenstein  
p2p-peer-address = node-wax.eosauthority.com:10301  
  
# eosauthority: FI, Helsinki  
p2p-peer-address = node-wax-p2p.eosauthority.com:10301  
  
# eosdublinwow: FI, Finland  
p2p-peer-address = wax.p2p.eosdublin.io:9876  
  
# eoseouldotio: JP, Seoul  
p2p-peer-address = p2p.wax.eoseoul.io:29876  
  
# eosiodetroit: IN, wax-seed1-do-blr1  
p2p-peer-address = p2p.wax.eosdetroit.io:1337  
  
# eosphereiobp: AU, Sydney  
p2p-peer-address = peer1-wax.eosphere.io:9876  
  
# eosphereiobp: CA, Beauharnois  
p2p-peer-address = peer2-wax.eosphere.io:9876  
  
# greeneosiobp: DE, Germany  
p2p-peer-address = p2p1.wax.greeneosio.com:9876  
  
# ledgerwiseio: FI, LB  
p2p-peer-address = waxp2p.ledgerwise.io:21877  
  
# nation.wax: CA, Canada  
p2p-peer-address = wax.eosn.io:9876  
  
# niftylifewax: FI, Helsinki, Finland  
p2p-peer-address = p2p.niftylife.io:9876  
  
# niftylifewax: DE, Berlin, Germany  
p2p-peer-address = p2p2.niftylife.io:9876  
  
# oneinacilian: GB, United Kingdom  
p2p-peer-address = p2p.oiac.io:9896  
  
# teamgreymass: DE, FRA  
p2p-peer-address = wax.greymass.com:35777  
  
# wax.eastern: DE, Frankfurt  
p2p-peer-address = p2p.waxeastern.cn:9876  
  
# waxhiveguild: FI, Finnland  
p2p-peer-address = peer1.hivebp.io:9876  
  
# waxhiveguild: DE, Germany  
p2p-peer-address = peer2.hivebp.io:9876  
  
# waxswedenorg: SE, Sweden  
p2p-peer-address = p2p.waxsweden.org:35777  
  
# wizardsguild: US, wax-seed  
p2p-peer-address = wax-bp.wizardsguild.one:8876

# Always check for the latest PeerList - https://validate.eosnation.io/wax/reports/config.html

agent-name = "<yourname> WAX Mainnet"  
max-clients = 100  
sync-fetch-span = 500  

plugin = eosio::http_plugin  
plugin = eosio::chain_plugin  
plugin = eosio::chain_api_plugin
```

**genesis.json**

Estos son los parámetros de estado inicial requeridos por cada nodo nuevo al iniciar en el Mainnet de WAX. Crea el archivo de la siguiente manera:

```
> cd ~/waxdata

> nano genesis.json
```
Añade los siguientes parámetros al archivo `genesis.json` para el Mainnet Público de WAX:

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
# Ejecutando Nodeos

Ahora que el `config.ini` ha sido configurado y los parámetros iniciales de la cadena Mainnet de WAX `genesis.json` han sido creados, ahora puedes unirte a la red y sincronizar el nodo.

Usa screen para mantener tu sesión activa incluso cuando te desconectes, uso a continuación:

```
#Crea una nueva sesión de screen  
  
> screen -US wax 

#Desconecta la sesión de screen  
  
> ctrl-a+d 

#Reconecta la sesión de screen  
  
> screen -r wax
```

Ejecuta `nodeos` con indicaciones para el config, directorio de datos y archivo genesis:

```
> cd ~/wax-leap/build/programs/nodeos

> nodeos --data-dir ~/waxdata --config-dir ~/waxdata --genesis-json ~/waxdata/genesis.json
```

Tu nodo Mainnet de WAX ahora comenzará a sincronizarse con los peers configurados hasta que se ponga al día y esté actualizado con la cadena Mainnet de WAX.

Es posible acelerar el proceso de sincronización comenzando con una instantánea y un `blocks.log` válido, el proceso se explica en la **Guía de Snapshots de WAX**.

---

Estas **Guías Técnicas para Desarrolladores de WAX** se crean utilizando material fuente de la [Serie de Cómo Hacer Técnico de WAX de EOSphere](https://medium.com/eosphere/wax-technical-how-to/home)

Asegúrate de hacer cualquier pregunta en el [Telegram de EOSphere](https://t.me/eosphere_io)