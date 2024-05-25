---
title: API nodos de archivo completo/parcial-US
---

# API nodos de archivo completo/parcial-US

WAX es una red distribuida de computadoras que ejecutan software (conocido como nodos) que pueden verificar bloques y datos de transacciones. Necesitas el software WAX en tu servidor para "ejecutar" un nodo. "Nodo" se refiere a ejecutar el software WAX. El software WAX verifica todas las transacciones en cada bloque, manteniendo la red segura y los datos precisos.

Si deseas ejecutar tu propio nodo, debes entender que hay diferentes tipos de nodos que consumen y almacenan datos de manera diferente. De hecho, el software WAX se puede ejecutar en 3 tipos diferentes de modos: nodos de pares, API y archivo. Estas configuraciones también determinan la rapidez con la que el nodo puede obtener la información más actualizada.

Los nodos de archivo pueden ser parciales o completos según cómo se inicien. Estos nodos contienen los bloques y el historial del estado de la cadena de bloques. Los nodos de archivo parcial se inician principalmente desde instantáneas, por lo que no contienen el historial completo de la cadena de bloques, sino solo el historial desde un bloque específico.

Los nodos de archivo también se denominan nodos de historial de estado o nodos Ship.

#### Créditos:
@cc32d9, Equipo de Eosphere

### Prerrequisitos/Requisitos:

- **Nodo de historial de estado completo (especificaciones recomendadas):** CPU de velocidad 4Ghz+, 128GB de RAM, 8TB SSD o NvME [Para un historial de estado parcial, puedes tener especificaciones más bajas ya que se inicia desde una instantánea]
- **Dependencias:** v2.0.13wax01 (versión recomendada del software WAX)
- **Sistema operativo:** Ubuntu 18.04 (recomendado)

#### Proveedores de infraestructura bare-metal:

- [Hetzner](https://www.hetzner.com/dedicated-rootserver "Hetzner")
- [Leaseweb](https://www.leaseweb.us/dedicated-servers "Leaseweb")

### Configuración e instalación:

Después de asegurar los servidores y configurar la configuración de arranque y los modos RAID apropiados, puedes iniciar sesión en el servidor y seguir los siguientes comandos:

[Recomendación - Configura solo la partición raíz en modos Raid1 o Raid5 por ahora. Particionaremos los discos más adelante después del arranque y los asignaremos a un pool ZFS]

##### 1. Actualiza los paquetes predeterminados e instala nuevos
```
apt-get update && apt-get install -y vim htop aptitude git lxc-utils zfsutils-linux netfilter-persistent sysstat ntp gpg screen zstd
```
##### 2. Para un mejor rendimiento de la CPU:
```
apt-get install -y cpufrequtils
echo 'GOVERNOR="performance"' | tee /etc/default/cpufrequtils
systemctl disable ondemand
systemctl restart cpufrequtils
```
##### 3. Crear particiones de disco 
El primer paso es determinar los discos y sus nombres utilizando los siguientes comandos:
```
fdisk -l
```
Ahora, después de identificar los nombres de los discos, particiónalos utilizando el siguiente comando de ejemplo, necesitamos crear dos particiones, una para Swap y otra para el pool de almacenamiento ZFS.

```
cfdisk /dev/nvme0n1
```
Haz lo anterior para todos los discos en tu servidor.

##### 4. Aumenta el tamaño de Swap ya que usualmente es pequeño en los servidores de Hetzner y Leaseweb.
```
mkswap /dev/nvme0n1p5
mkswap /dev/nvme1n1p5
```
Ahora añadamos los pools de Swap a la tabla del sistema de archivos del sistema editando el siguiente archivo:
```
cat >>/etc/fstab <<'EOT'
/dev/nvme0n1p5     none            swap            defaults,pri=-2 0 0
/dev/nvme1n1p5     none            swap            defaults,pri=-2 0 0
/dev/nvme2n1p5     none            swap            defaults,pri=-2 0 0
EOT
```
Después de editar, habilita el nuevo pool de Swap utilizando el siguiente comando:
```
swapon -a
```

##### 5. Crea un pool de almacenamiento ZFS según tus necesidades con modos zraid o mirror, etc. Un buen recurso para hacer cálculos sobre tamaños de discos: http://www.raidz-calculator.com/

```
zpool create -o ashift=12 zfast raidz /dev/nvme0n1p6 /dev/nvme1n1p6 /dev/nvme2n1p6 [--> adopta los nombres de partición en consecuencia]
#Deshabilita las actualizaciones de tiempo de acceso de ZFS
> zfs set atime=off zfast
#Configura ARC para que solo almacene en caché los metadatos
> sudo zfs set primarycache=all datavolume
#Habilita la compresión LZ4
zfs set compression=lz4 zfast
zfs create -o mountpoint=/home zfast/home [-->Crea el punto de montaje]
```

##### 6. Configura NTP para asegurar que los relojes estén sincronizados

Es importante tener esto en una red blockchain de igual a igual para tener un tiempo sincronizado en todos los nodos. Chrony es un excelente cliente NTP y es bastante adecuado para las necesidades de WAX Mainnet.

Instala, configura y verifica como a continuación:

```
#Instala Chrony
> sudo apt install chrony
#Si es necesario, añade manualmente pares locales, estos son servidores de AU
> sudo nano /etc/chrony/chrony.conf

server 0.pool.ntp.org
server 1.pool.ntp.org
server 2.pool.ntp.org
server 3.pool.ntp.org
#Reinicia Chrony
> sudo /etc/init.d/chrony restart
#Verifica
> chronyc sources -v
> chronyc tracking
#Configura tu zona horaria local si es necesario
> sudo timedatectl set-timezone Europe/Stockholm
```

##### 7. Configura los límites de pila y archivos abiertos en tu servidor

Los límites de pila y el número de archivos abiertos en Ubuntu 18.04 deben aumentarse para soportar los requisitos de memoria del software WAX y el número de solicitudes API en un nodo de producción Mainnet.

Configura y verifica los límites aumentados como se indica a continuación:
```
> sudo nano /etc/systemd/system.conf
#Añade la siguiente configuración
DefaultLimitNOFILE=64000 
DefaultLimitSTACK=65536000
#Reinicia el servidor y verifica
> ulimit -a
```

------------

Ahora que hemos configurado el servidor y el almacenamiento de discos de una buena manera, sigamos con los siguientes pasos para construir y configurar los nodos de historial de estado.

##### 8. Construye y configura el software:

El software WAX es una versión de código abierto modificada del software Antelope para satisfacer las necesidades de la red WAX. Actualmente, la versión aceptada del software WAX es v2.0.13wax01 creada por [cc32d9](https://cc32d9.medium.com/) que es miembro del [EOS Amsterdam Guild](https://eosamsterdam.net/).

La última etiqueta de compilación de wax siempre está disponible en el [Github de WAX](https://github.com/worldwide-asset-exchange/wax-blockchain/tags).

**Compilación manual**
```
cd ~
git clone https://github.com/worldwide-asset-exchange/wax-blockchain.git
cd wax-blockchain
git checkout v2.0.13wax01
git submodule update --init --recursive
cd scripts > ./eosio_build.sh -P./eosio_install.sh 
#Si quieres instalar. Los binarios están en ~/wax2.0/build/programs
```
Como se utiliza la opción -P en el script de compilación, esto puede tardar un tiempo en compilarse ya que se compilará con clang y libcxx fijados.

**Paquetes precompilados**
El equipo de WAX Sweden ofrece paquetes precompilados que se pueden instalar fácilmente. Puedes encontrarlos aquí: https://eosswedenorg.github.io/apt/wax
Visita el enlace anterior y sigue las instrucciones proporcionadas.

**Configuración**

Ahora que el software WAX está instalado, configuremos el historial de estado:

Hay diferentes componentes en el software como nodeos, cleos, keosd, etc. **nodeos** es el servicio principal que ejecuta el protocolo y se usa en todos los nodos. La configuración de nodeos se realiza utilizando el archivo config.ini. Las configuraciones de este archivo determinan el tipo de nodo que estás ejecutando.

Sigue los pasos a continuación para configurar nodeos:

```
mkdir /home/data
mkdir /home/conf

cd /home/data
nano config.ini
```
A continuación se muestra un ejemplo de archivo config.ini de **mainnet** que está personalizado para configurar un nodo de historial de estado, puedes simplemente copiar y pegar:

```
wasm-runtime = eos-vm-jit
eos-vm-oc-compile-threads = 4
eos-vm-oc-enable = true
read-mode = head
contracts-console = true

chain-state-db-size

-mb = 131072
chain-state-db-guard-size-mb = 1024
chain-threads = 4
http-threads = 8

# Apagar el nodo de forma segura cuando haya menos espacio libre
chain-state-db-guard-size-mb = 128
reversible-blocks-db-guard-size-mb = 2

disable-subjective-p2p-billing = false
http-server-address = 0.0.0.0:8888
access-control-allow-origin = *
access-control-allow-headers = Origin, X-Requested-With, Content-Type, Accept
http-max-response-time-ms = 100
verbose-http-errors = true
http-validate-host = false

# Configuración del endpoint de peering
p2p-listen-endpoint = 0.0.0.0:9876
p2p-server-address = 0.0.0.0:9876

# Configuración del historial de estado (necesita agregar a los parámetros de inicio --disable-replay-opts )
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

# Plugins principales de la cadena de bloques
plugin = eosio::chain_plugin
plugin = eosio::chain_api_plugin
plugin = eosio::http_plugin

# Lista de peers - Consulta este enlace para los últimos peers de mainnet: https://validate.eosnation.io/wax/reports/config.html

# alohaeosprod: US, Oregón
p2p-peer-address = peer.wax.alohaeos.com:9876

# blacklusionx: DE, Alemania
p2p-peer-address = peer1.wax.blacklusion.io:4646

# blacklusionx: DE, Alemania
p2p-peer-address = peer1-emea.wax.blacklusion.io:4646

# bp.wecan: US, Nueva York
p2p-peer-address = seed3-wax-mainnet.wecan.dev:14998

# dapplica: DE, Alemania-Finlandia
p2p-peer-address = wax.dapplica.io:9876

# eosarabianet: DE, Múnich
p2p-peer-address = p2p-wax.eosarabia.net:9876

# eosdacserver: GB, Reino Unido
p2p-peer-address = wax-p2p.eosdac.io:29876

# eosdublinwow: FI, Finlandia
p2p-peer-address = wax.p2p.eosdublin.io:9876

# eoseouldotio: JP, Seúl
p2p-peer-address = p2p.wax.eoseoul.io:29876

# eosphereiobp: AU, Sídney
p2p-peer-address = peer2-wax.eosphere.io:9876

# guild.nefty: FI, Finlandia
p2p-peer-address = p2p-node2.neftyblocks.com:9876

# ledgerwiseio: FI, LB
p2p-peer-address = waxp2p.ledgerwise.io:21877

# waxhiveguild: FI, Finlandia
p2p-peer-address = peer1.hivebp.io:9876
```
Si estás iniciando el nodo desde el primer bloque, también necesitas tener el archivo **genesis.json**:

```
cd /home/conf
nano genesis.json
```
Agrega la siguiente configuración al archivo genesis.json. Esto es para la **WAX Mainnet**:
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
Para **WAX Testnet**, agrega la siguiente configuración al archivo genesis.json:
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

Una vez que hayas completado los pasos anteriores, el siguiente paso es comenzar con los pasos para ejecutar el nodo y sincronizarlo con WAX Mainnet/Testnet:

Puedes iniciar el **nodeos** usando el siguiente comando y parámetros:

Para iniciar el nodo desde el génesis:
```
nodeos --disable-replay-opts --data-dir /home/data/ --config-dir /home/data/ --genesis-json=/home/conf/genesis.json
```
Para iniciar el nodo desde una instantánea:
```
nodeos --disable-replay-opts --data-dir /home/data/ --config-dir /home/data/ --snapshot /home/data/snapshots/<reemplazar con el nombre del archivo de instantánea>
```
###### Ejecutar y gestionar nodeos usando scripts:

Los siguientes scripts de inicio y detención te ayudarán a demonizar y gestionar el servicio nodeos.
```
cd /home/conf
vim start.sh
```
**start.sh**
```
#!/bin/bash
DATADIR="/home/data"

#cambia la ruta del directorio según tu configuración
NODEOSBINDIR="/usr/opt/wax/2013wax01-mv/bin/" 


$DATADIR/stop.sh
echo -e "Iniciando Nodeos \n";

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


        echo -ne "Deteniendo Nodeos"

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


        echo -ne "\rNodeos detenido.    \n"
    fi
```

Todo lo que tienes que hacer ahora es iniciar el script y monitorear los registros en stderr.txt en la carpeta /home/data.

```
tail -f stderr.txt
```
Tu nodo de historial de estado ahora comenzará a sincronizarse con los peers configurados y se pondrá al día con el bloque principal de la cadena. Puede tomar hasta 2-3 semanas una sincronización completa de bloques desde el génesis para WAX Mainnet. También puede ayudar si eliges algunos peers ubicados cerca para limitar la sobrecarga de peers y asegurar baja latencia.

Captura de pantalla de ejemplo cuando el nodo se está sincronizando con éxito:

![image](https://user-images.githubusercontent.com/15923938/163224

549-92f633fc-6ab5-4a15-adee-fe165ece874b.png)

A medida que tu nodo se sincroniza desde el inicio de la cadena, construirá los archivos de registro e índice en los directorios /blocks y /state-history en tu carpeta /home/data.

**Ahora puedes consultar el nodo en el endpoint rest en el puerto http 8888 y para websockets es el puerto 8080**