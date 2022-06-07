---
title: API Vollständige/Partielle Archiv nodes
nav_order: 142
layout: default
parent: WAX Infra Guides
lang-ref: API Full/Partial Archive nodes
lang: de
---

WAX ist ein verteiltes Netz von Computern, auf denen Software (sogenannte Nodes) läuft, die Blöcke und Transaktionsdaten überprüfen kann. Sie benötigen WAX-Software auf Ihrem Server, um eine Node zu "betreiben". Die WAX-Software verifiziert alle Transaktionen in jedem Block und sorgt so für die Sicherheit des Netzwerks und die Richtigkeit der Daten.

Wenn Sie Ihre eigene Node betreiben wollen, sollten Sie wissen, dass es verschiedene Arten von Nodes gibt, die Daten unterschiedlich verbrauchen und speichern. Tatsächlich kann WAX Software in 3 verschiedenen Modi betrieben werden - Peer-, API- und Archiv-Node. Diese Konfigurationen bestimmen auch, wie schnell die Node die aktuellsten Informationen abrufen kann.

Archivnodes können vollständig sein oder nur ein teil der blockchaindaten enthalten (je nachdem, wie sie gestartet werden). Diese Nodes enthalten die Blöcke und die "state history" der Blockchain. Partielle Archivnodes werden hauptsächlich aus snapshots gestartet, sodass sie nicht die gesamte History der Blockchain enthalten, sondern nur die History eines bestimmten Blocks.

Archivnodes werden auch als State-History- oder Ship-Nodes bezeichnet.


#### Credits:
@cc32d9, Eosphere Team

### Vorraussetzungen:

- **Full State-History node Hardware(empfohlene specs):** 4Ghz+ CPU speed, 128GB RAM, 8TB SSD or NvME [For a partial state-history, you can have lower specs as its started from a snapshot]
- **Dependencies:** v2.0.13wax01(WAX Software recommended version)
- **OS:** Ubuntu18.04 (recommended)

#### Bare-Metal Infra provider:

- [Hetzner](https://www.hetzner.com/de/dedicated-rootserver?country=de "Hetzner")
- [Leaseweb](https://www.leaseweb.com/de/dedizierte-server#DE "Leaseweb")
- [OVH](https://www.ovhcloud.com/de/bare-metal/ "OVH")

### Setup und Installation:

Nachdem Sie den Server sicher aufgesetzt und die Boot-Konfiguration sowie die entsprechenden RAID-Modi eingerichtet haben, können Sie sich auf dem Server anmelden und die folgenden Befehle ausführen:

[Empfehlung - Richten Sie vorerst nur die Root-Partition im Raid1- oder Raid5-Modus ein. Wir werden die Festplatten später nach dem Booten partitionieren und sie einem ZFS-Pool zuweisen]

##### 1. Packages updaten und weitere installieren
```
apt-get update && apt-get install -y vim htop aptitude git lxc-utils zfsutils-linux netfilter-persistent sysstat ntp gpg screen zstd
```
##### 2. Für bessere CPU performance:
```
apt-get install -y cpufrequtils
echo 'GOVERNOR="performance"' | tee /etc/default/cpufrequtils
systemctl disable ondemand
systemctl restart cpufrequtils
```
##### 3. Partitionen erstellen
Der erste Schritt besteht darin, die Festplatten und ihre Namen mit Hilfe der folgenden Befehle zu identifizieren:
```
fdisk -l
```
Nachdem wir die Festplattennamen identifiziert haben, partitionieren wir sie mit dem folgenden Beispielbefehl. Wir müssen zwei Partitionen erstellen, eine für Swap und eine für den ZFS-Speicherpool.

```
cfdisk /dev/nvme0n1
```
Führen Sie die obigen Schritte für alle Festplatten auf Ihrem Server durch.

##### 4. Swap vergrößern (standardmäßig sehr klein konfiguriert).
```
mkswap /dev/nvme0n1p5
mkswap /dev/nvme1n1p5
```
Nun können wir die Swap-Pools zum System FileSystem table hinzufügen, indem wir die folgende Datei bearbeiten:
```
cat >>/etc/fstab <<'EOT'
/dev/nvme0n1p5     none            swap            defaults,pri=-2 0 0
/dev/nvme1n1p5     none            swap            defaults,pri=-2 0 0
/dev/nvme2n1p5     none            swap            defaults,pri=-2 0 0
EOT
```
Nach der Bearbeitung aktivieren wir den neu hinzugefügten Swap-Pool mit dem folgenden Befehl:
```
swapon -a
```

##### 5. Erstellen Sie einen ZFS-Speicherpool entsprechend Ihren Anforderungen mit den Modi zraid, mirror usw. Eine gute Ressource zur Berechnung von Festplattengrößen: http://www.raidz-calculator.com/

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

##### 6. NTP einrichten, um die Systemzeit zu synchronisieren

Als Peer-to-Peer-Blockchain-Netzwerk ist es wichtig, dass die Zeit über alle Nodes hinweg synchronisiert ist. Chrony ist ein hervorragender NTP-Client und eignet sich gut für die Bedürfnisse des WAX Mainnet.

Installieren, konfigurieren und verifizieren Sie ihn wie unten beschrieben:

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

##### 7. Einrichten von Stack Limits und Openfiles auf Ihrem Server

Die standardmäßigen Stack-Limits und die Anzahl der offenen Dateien in Ubuntu 18.04 sollten erhöht werden, um die Speicheranforderungen der WAX-Software und die Anzahl der API-Anfragen auf einer Mainnet Node zu unterstützen.

Konfigurieren und überprüfen Sie die angehobenen Limits wie unten beschrieben:
```
> sudo nano /etc/systemd/system.conf
#Append the following configuration
DefaultLimitNOFILE=64000
DefaultLimitSTACK=65536000
#Restart server and verify
> ulimit -a
```

------------

Nachdem wir nun den Server und den Plattenspeicher optimal eingerichtet haben, können wir mit den nächsten Schritten fortfahren, um die State-History-Node zu erstellen und einzurichten.

##### 8. Software kompilieren und konfigurieren:

Die WAX-Software ist eine modifizierte Open-Source-Version der EOSIO-Software, die an die Bedürfnisse des WAX-Netzwerks angepasst wurde. v2.0.13wax01 wurde von [cc32d9](https://cc32d9.medium.com/), einem Mitglied der [EOS Amsterdam Guild](https://eosamsterdam.net/), erstellt und ist derzeit die akzeptierte WAX-Softwareversion.

Der neueste Waxbuild-Tag ist immer auf dem [WAX Github](https://github.com/worldwide-asset-exchange/wax-blockchain/tags) verfügbar.

**Manualles kompilieren**
```
cd ~
git clone https://github.com/worldwide-asset-exchange/wax-blockchain.git
cd wax-blockchain
git checkout v2.0.13wax01
git submodule update --init --recursive
cd scripts > ./eosio_build.sh -P./eosio_install.sh
#If you want to install. Binaries are in ~/wax2.0/build/programs
```
Da die Option -P im Build-Skript verwendet wird, kann die Kompilierung einige Zeit in Anspruch nehmen, da sie mit gepinntem clang und libcxx erstellt wird

**Vor-kompilierte Packages**
WAX Sweden bietet Vor-kompilierte-Packages an, die einfach installiert werden können. Sie können sie hier finden: https://eosswedenorg.github.io/apt/wax

**Konfiguration**

Nachdem die WAX-Software nun installiert ist, können wir mit der Konfiguration des State-History-Setups fortfahren:

Es gibt verschiedene Komponenten in der Software wie nodeos, cleos, keosd usw. **nodeos** ist der Kerndienst, der das Protokoll ausführt und auf allen Nodes verwendet wird. Die Konfiguration von nodeos erfolgt über die Datei config.ini. Die Einstellungen in dieser Datei bestimmen, welche Art von Node Sie betreiben.

Führen Sie die folgenden Schritte aus, um nodeos zu konfigurieren:

```
mkdir /home/data
mkdir /home/conf

cd /home/data
nano config.ini
```
Nachfolgend finden Sie ein Beispiel für eine **mainnnet** config.ini-Datei, die für die Einrichtung einer State-History-Node angepasst wurde. Sie können sie einfach kopieren und einfügen:

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
Wenn Sie die Node vom 1. Block aus starten, benötigen Sie auch die Datei **genesis.json**:

```
cd /home/conf
nano genesis.json
```
Fügen Sie die folgende Konfiguration in die Datei genesis.json ein. Dies ist für das **WAX Mainnet**:
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
Für **WAX Testnet** fügen Sie die folgende Konfiguration in die Datei genesis.json ein:
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
##### 9. Starten der Node:

Wenn Sie die vorangegangenen Schritte abgeschlossen haben, müssen Sie als Nächstes mit den Schritten zum Starten der Node und zur Synchronisierung mit dem WAX Mainnet/Testnet beginnen:

Sie können **nodeos** mit dem folgenden Befehl und den folgenden Parametern starten:

Zum Starten der Node von Genesis:
```
nodeos --disable-replay-opts --data-dir /home/data/ --config-dir /home/data/ --genesis-json=/home/conf/genesis.json
```
Zum Starten der Node aus einem Snapshot:
```
nodeos --disable-replay-opts --data-dir /home/data/ --config-dir /home/data/ --snapshot /home/data/snapshots/<replace with snapshot file name>
```
###### Betreiben und Verwaltung von Nodeos mithilfe von Skripten:

Die folgenden Start- und Stoppskripte helfen Ihnen, den nodeos-Dienst zu dämonisieren und zu verwalten.
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

Jetzt müssen Sie nur noch das Skript starten und die Protokolle in stderr.txt im Ordner /home/data überwachen.

```
tail -f stderr.tx
```
Ihre State-History-Node beginnt nun mit der Synchronisierung mit den konfigurierten Peers und holt den Headblock der Chain ein. Es kann bis zu 2-3 Wochen dauern, bis eine vollständige Blocksynchronisierung von genesis für WAX Mainnet erfolgt ist. Es kann auch hilfreich sein, wenn Sie einige nahe beieinander liegende Peers auswählen, um die Überlastung der Peers zu begrenzen und eine geringe Latenz zu gewährleisten.

Beispiel-Screenshot, wenn die Node erfolgreich synchronisiert:

![image](https://user-images.githubusercontent.com/15923938/163224549-92f633fc-6ab5-4a15-adee-fe165ece874b.png)

Wenn Ihre Node vom Anfang der Chain aus synchronisiert wird, erstellt sie die log und Indexdateien in den Verzeichnissen /blocks und /state-history in Ihrem Ordner /home/data.

**Sie können jetzt den Node Rest-Endpunkt an http Port 8888 und für Websockets an Port 8080 abfragen**
