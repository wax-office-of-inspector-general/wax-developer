---
title: Nodos de archivo completo/parcial de la API
nav_order: 142
layout: default
parent: WAX Infrastructure/APIs
lang-ref: API Full/Partial Archive nodes
lang: es
---

WAX es una red distribuida de ordenadores que ejecutan software (conocidos como nodos) que pueden verificar bloques y datos de transacciones. Necesitarás el software de WAX en tu servidor para "ejecutar" un nodo. Con "nodo", se refiere a la ejecución del software de WAX. WAX verifica todas las transacciones de cada bloque, manteniendo la red segura y los datos precisos. 

Si quieres ejecutar tu propio nodo, debes entender que loa hay de diferentes tipos, que consumen y almacenan datos de manera diferente. De hecho, el software de WAX puede ser ejecutado en tres modos diferentes - nodos pares, de API y de archivo. Estas configuraciones también determinan la rapidez con la que el nodo puede obtener la información más actualizada.

Los nodos de archivo pueden ser parciales o completos en función de cómo se inicien. Estos nodos contienen el historial de bloques y estados de la blockchain. Los nodos de archivo parciales se inician principalmente a partir de instantáneas, por lo que no contienen el historial completo, sino que sólo tienen el historial de un bloque específico.

Los nodos de archivo también se denominan State-History o Ship nodes.

#### Aportes:
@cc32d9, Eosphere Team

### Requisitos previos:

- **Hardware del nodo State-History completo (especificaciones recomendadas):** 4Ghz+ CPU speed, 128GB RAM, 8TB SSD o NvME [para una State-History parcial, las especificaciones pueden ser menores, ya que se inicia desde una instantánea]
- **Dependencias:** v2.0.13wax01(versión recomendada del software de WAX)
- **SO:** Ubuntu18.04 (recomendado)

#### Proveedores de Bare-Metal Infra:

- [Hetzner](https://www.hetzner.com/dedicated-rootserver "Hetzner")
- [Leaseweb](https://www.leaseweb.us/dedicated-servers "Leaseweb")

### Instalación y configuración

Después de asegurar los servidores y establecer la configuración de arranque y los modos RAID apropiados, puedes iniciar sesión en el servidor y seguir los siguientes comandos: 

[Recomendación - Por ahora, configura sólo la partición madre en modo Raid1 o Raid5. Más adelante, particionaremos los discos tras el arranque y los asignaremos a un pool ZFS].

##### 1. Actualizar los paquetes por defecto e instalar los nuevos
```
apt-get update && apt-get install -y vim htop aptitude git lxc-utils zfsutils-linux netfilter-persistent sysstat ntp gpg screen zstd
```
##### 2. Para un mejor rendimiento de la CPU
```
apt-get install -y cpufrequtils
echo 'GOVERNOR="performance"' | tee /etc/default/cpufrequtils
systemctl disable ondemand
systemctl restart cpufrequtils
```
##### 3. Crear particiones del disco
El primer paso es determinar los discos y sus nombres utilizando los siguientes comandos:
```
fdisk -l
```
Tras identificar los nombres de los discos, vamos a particionarlos usando el comando de ejemplo que aparece a continuación. Necesitaremos crear dos particiones, una para Swap y otra para el pool de almacenamiento ZFS.

```
cfdisk /dev/nvme0n1
```
Repite este proceso con todos los discos de tu servidor.

##### 4. Aumenta el tamaño del Swap, que suele ser pequeño en los servidores de Hetzner y Leaseweb.
```
mkswap /dev/nvme0n1p5
mkswap /dev/nvme1n1p5
```
Ahora vamos a añadir los pools de intercambio a la tabla System's FileSystem editando el archivo de abajo:
```
cat >>/etc/fstab <<'EOT'
/dev/nvme0n1p5     none            swap            defaults,pri=-2 0 0
/dev/nvme1n1p5     none            swap            defaults,pri=-2 0 0
/dev/nvme2n1p5     none            swap            defaults,pri=-2 0 0
EOT
```
Después de editarlo, vamos a habilitar el nuevo Swap pool usando el siguiente comando:
```
swapon -a
```

##### 5. Crea un pool de almacenamiento ZFS según tus necesidades con los modos zraid, mirror, etc. Este es un buen recurso para hacer cálculos sobre el tamaño de los discos: http://www.raidz-calculator.com/

```
zpool create -o ashift=12 zfast raidz /dev/nvme0n1p6 /dev/nvme1n1p6 /dev/nvme2n1p6 [--> adopt the partition names accordingly]
#Disable ZFS access time Updates
> zfs set atime=off zfast
#Set ARC to only cache metadata
> sudo zfs set primarycache=all datavolume
#Enable LZ4 compression
zfs set compression=lz4 zfast
zfs create -o mountpoint=/home zfast/home [-->Creates mountpoint]
```

##### 6. Configura NTP para verificar que los relojes están sincronizados

Es importante configurar esto como una red blockchain peer-to-peer para tener la hora sincronizada en todos los nodos. Chrony es un excelente cliente NTP y es bastante adecuado para las necesidades de la mainnet de WAX.

Instala, configura y verifica como se indica a continuación:

```
#Install Chrony
> sudo apt install chrony
#If necessary manually add local peers, these are AU servers
> sudo nano /etc/chrony/chrony.conf

server 0.pool.ntp.org
server 1.pool.ntp.org
server 2.pool.ntp.org
server 3.pool.ntp.org
#Restart Chrony
> sudo /etc/init.d/chrony restart
#Verify
> chronyc sources -v
> chronyc tracking
#Set your local timezone if necessary
> sudo timedatectl set-timezone Europe/Stockholm
```

##### 7. Configura los límites de la pila y los Openfiles en tu servidor

Los límites de la pila y el número de Openfiles por defecto en Ubuntu 18.04 deben aumentarse para soportar los requisitos de memoria del software de WAX y el número de peticiones de la API en un nodo de producción de la mainnet.

Configura y verifica los límites aumentados como indicamos a continuación:
```
> sudo nano /etc/systemd/system.conf
#Append the following configuration
DefaultLimitNOFILE=64000 
DefaultLimitSTACK=65536000
#Restart server and verify
> ulimit -a
```

------------

Ahora que hemos configurado bien el servidor y el almacenamiento en disco, sigamos con los siguientes pasos para construir y configurar los nodos de State-History.

##### 8. Crear y configurar el software:

El software WAX es una versión modificada de código abierto del software Antelope para adaptarse a las necesidades de la red WAX. Actualmente, la versión del software WAX aceptada es la v2.0.13wax01, creada por [cc32d9](https://cc32d9.medium.com/), que es miembro del [Gremio de EOS Amsterdam](https://eosamsterdam.net/)

El último tag de waxbuild está siempre disponible en el [Github de WAX](https://github.com/worldwide-asset-exchange/wax-blockchain/tags).

**Construcción manual**
```
cd ~
git clone https://github.com/worldwide-asset-exchange/wax-blockchain.git
cd wax-blockchain
git checkout v2.0.13wax01
git submodule update --init --recursive
cd scripts > ./eosio_build.sh -P./eosio_install.sh 
#If you want to install. Binaries are in ~/wax2.0/build/programs
```
Como se utiliza la opción -P en el script de compilación, esta puede llevar algún tiempo, ya que se construirá con clang y libcxx fijados

**Paquetes Pre-Build**
El equipo de WAX Sweden ofrece paquetes Pre-Build que pueden ser instalados fácilmente. Los puedes encontrar aquí: https://eosswedenorg.github.io/apt/wax
Visita el enlace anterior y sigue sus instrucciones.

**Configuración**

Ahora que el software de WAX está instalado, vamos a configurar el State-History:

Hay distintos componentes en el software, como nodeos, cleos, keosd, etc. **Nodeos** es el servicio central que ejecuta el protocolo y se utiliza en todos los nodos. La configuración de nodeos se realiza mediante el archivo config.ini. La configuración de este archivo determina el tipo de nodo que se está ejecutando.

Sigue estos pasos para configurar los nodos:

```
mkdir /home/data
mkdir /home/conf

cd /home/data
nano config.ini
```
A continuación, se muestra un ejemplo de archivo config.ini, **mainnnet**, que se puede personalizar para configurar el nodo de State-History. Solo tienes que copiar y pegar:

```
wasm-runtime = eos-vm-jit
eos-vm-oc-compile-threads = 4
eos-vm-oc-enable = true
read-mode = head
contracts-console = true

chain-state-db-size-mb = 131072
chain-state-db-guard-size-mb = 1024
chain-threads = 4
http-threads = 8

# Safely shut down node when less free space
chain-state-db-guard-size-mb = 128
reversible-blocks-db-guard-size-mb = 2

disable-subjective-p2p-billing = false
http-server-address = 0.0.0.0:8888
access-control-allow-origin = *
access-control-allow-headers = Origin, X-Requested-With, Content-Type, Accept
http-max-response-time-ms = 100
verbose-http-errors = true
http-validate-host = false

#Peering endpoint config
p2p-listen-endpoint = 0.0.0.0:9876
p2p-server-address = 0.0.0.0:9876

# State History Settings (need add to start params --disable-replay-opts )
plugin = eosio::state_history_plugin
state-history-dir = state-history
trace-history = true
chain-state-history = true
state-history-endpoint = 0.0.0.0:8080

allowed-connection = any

max-clients = 150
connection-cleanup-period = 30
sync-fetch-span = 2000
enable-account-queries = true

# Core Blockchain plugins
plugin = eosio::chain_plugin
plugin = eosio::chain_api_plugin
plugin = eosio::http_plugin

#Peers list - Refer this link for mainnet latest peers: https://validate.eosnation.io/wax/reports/config.html

# alohaeosprod: US, Oregon
p2p-peer-address = peer.wax.alohaeos.com:9876

# blacklusionx: DE, Germany
p2p-peer-address = peer1.wax.blacklusion.io:4646

# blacklusionx: DE, Germany
p2p-peer-address = peer1-emea.wax.blacklusion.io:4646

# bp.wecan: US, NewYork
p2p-peer-address = seed3-wax-mainnet.wecan.dev:14998

# dapplica: DE, Germany-Finland
p2p-peer-address = wax.dapplica.io:9876

# eosarabianet: DE, Munich
p2p-peer-address = p2p-wax.eosarabia.net:9876

# eosdacserver: GB, United Kingdom
p2p-peer-address = wax-p2p.eosdac.io:29876

# eosdublinwow: FI, Finland
p2p-peer-address = wax.p2p.eosdublin.io:9876

# eoseouldotio: JP, Seoul
p2p-peer-address = p2p.wax.eoseoul.io:29876

# eosphereiobp: AU, Sydney
p2p-peer-address = peer2-wax.eosphere.io:9876

# guild.nefty: FI, Finland
p2p-peer-address = p2p-node2.neftyblocks.com:9876

# ledgerwiseio: FI, LB
p2p-peer-address = waxp2p.ledgerwise.io:21877

# waxhiveguild: FI, Finnland
p2p-peer-address = peer1.hivebp.io:9876
```
Si estás iniciando el nodo desde el primer bloque, también necesitas tener el archivo **genesis.json**:

```
cd /home/conf
nano genesis.json
```
Añade la siguiente configuración al archivo genesis.json. Esto es para el **WAX Mainnet**:
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
Para **WAX Testnet**, añade esta configuración al archivo genesis.json:
```
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
##### 9. Ejecutar el nodo:

Una vez que has realizado los pasos anteriores, el siguiente paso es iniciar los procedimientos para ejecutar el nodo y sincronizarlo con la Mainnet/Testnet de WAX:

Puedes iniciar los **nodos** utilizando el comando y los parámetros que se indican a continuación:

Para iniciar el nodo desde genesis:
```
nodeos --disable-replay-opts --data-dir /home/data/ --config-dir /home/data/ --genesis-json=/home/conf/genesis.json
```
Para iniciar el nodo desde una instantánea:
```
nodeos --disable-replay-opts --data-dir /home/data/ --config-dir /home/data/ --snapshot /home/data/snapshots/<replace with snapshot file name>
```
###### Ejecución y gestión de nodos mediante scripts:

Los siguientes scripts de inicio y detención te ayudarán a demonizar y gestionar el servicio nodeos.
```
cd /home/conf
vim start.sh
```
**start.sh**
```
#!/bin/bash
DATADIR="/home/data"

#change the directory path according to your configuration
NODEOSBINDIR="/usr/opt/wax/2013wax01-mv/bin/" 


$DATADIR/stop.sh
echo -e "Starting Nodeos \n";

ulimit -c unlimited
ulimit -n 65535
ulimit -s 64000

$NODEOSBINDIR/nodeos/nodeos --data-dir $DATADIR --config-dir $DATADIR "$@" > $DATADIR/stdout.txt 2> $DATADIR/stderr.txt &  echo $! > $DATADIR/nodeos.pid
```
**stop.sh**
```
#!/bin/bash
DIR="/home/data"
 if [ -f $DIR"/nodeos.pid" ]; then
        pid=`cat $DIR"/nodeos.pid"`
        echo $pid
        kill $pid


        echo -ne "Stoping Nodeos"

        while true; do
            [ ! -d "/proc/$pid/fd" ] && break
            echo -ne "."
            sleep 1
        done
        rm -r $DIR"/nodeos.pid"

        DATE=$(date -d "now" +'%Y_%m_%d-%H_%M')
        if [ ! -d $DIR/logs ]; then
            mkdir $DIR/logs
        fi
        tar -pcvzf $DIR/logs/stderr-$DATE.txt.tar.gz stderr.txt stdout.txt


        echo -ne "\rNodeos Stopped.    \n"
    fi
```

Ahora sólo tienes que iniciar el script y controlar los registros en stderr.txt en la carpeta /home/data.

```
tail -f stderr.tx
```
Tu nodo State-History empezará ahora la sincronización con los peers configurados y a ponerse al día con el headblock de la cadena. La sincronización completa de los bloques de genesis para la Mainnet de WAX puede tardar hasta 2-3 semanas. También es útil que elijas unos pocos peers muy cercanos para limitar la sobrecarga de los peers y conseguir una menor latencia.

Un ejemplo de cuando el nodo se sincroniza con éxito:

![image](https://user-images.githubusercontent.com/15923938/163224549-92f633fc-6ab5-4a15-adee-fe165ece874b.png)

A medida que tu nodo se sincroniza desde el inicio de la cadena, construirá los archivos de registro e índice en los directorios /blocks y /state-history en tu carpeta /home/data.

**Ya puedes consultar el endpoint de reposo del nodo en el puerto http 8888; para los websockets es el puerto 8080**
