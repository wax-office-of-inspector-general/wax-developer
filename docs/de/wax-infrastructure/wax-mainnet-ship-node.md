---
title: WAX State-History Node aufsetzen
nav_order: 148
layout: default
parent: WAX Infrastructure/APIs
lang-ref: How to Set Up a WAX State-History Node
lang: de
---

Es gibt einen Nodeos-Implementierungstyp, der für den Betrieb zahlreicher WAX-Mainnet-Dienste wie [Hyperion Full History] (https://github.com/eosrio/hyperion-history-api) und die [Atomic Assets API] (https://github.com/pinknetworkx/eosio-contract-api) von entscheidender Bedeutung ist, und das ist der State-History-Dienst.


Dieser Leitfaden zeigt Ihnen, wie Sie nodeos erstellen, konfigurieren und einsetzen, um die State-History-Funktionalität, auch bekannt als SHIP-Nodes (State History Protocol), bereitzustellen.


Dieser Artikel wurde aktualisiert, um den [_Antelope_](https://antelope.io/) _Leap-Softwareerstellungsprozess einzubeziehen.


# Wie man einen WAX State-History-Node einrichtet


Das State-History-Plugin wird von nodeos verwendet, um historische Daten über den Blockchain-Zustand (in diesem Fall WAX Mainnet) zu erfassen und diese Daten in einem extern lesbaren Flat-File-Format zu speichern.


Dieses Plugin öffnet eine Websocket-Schnittstelle, die von mehreren externen Diensten wie Hyperion und Atomic gleichzeitig genutzt werden kann, um diese Daten einfach und effektiv zu lesen.


In Anbetracht der Tatsache, dass externe Dienste auf SHIP-Nodes angewiesen sind, ist es von entscheidender Bedeutung, dass eine Gilde einen soliden, zuverlässigen Dienst bereitstellt, der skaliert werden kann, um den wachsenden Anforderungen des WAX Mainnet gerecht zu werden.


In diesem Artikel wird ein Beispiel erläutert, das derzeit (September 2022) gültig ist und von der Gilde EOSphere verwendet wird, die mehrere Websocket-Verbindungen sowohl für ihre eigenen Dienste als auch für Dienste anderer Gilden bereitstellt.
# Mainnet Anforderungen

**Hardware**

-   4 Core CPU /  _4Ghz+_
-   (1) 256GB+ Disk /  _Enterprise Grade SSD or NVMe (_**_High Endurance Req._**_)_
-   (2) 10TB+ Disk /  _SAS or SATA are OK however SSD or NVMe preferred_

Derzeit (September 2022) belegen die Verzeichnisse "blocks" und "state-history" knapp **8TB** Speicherplatz.

```
2.1T    ./blocks  
5.7T    ./state-history  
7.8T    .
```

-   128GB+ RAM

**Betriebssystem**

-   Ubuntu 18.04
-   Ubuntu 20.04  **_(Recommended)_**
-   Ubuntu 22.04

**Internet**

-   Moderner Breitband-/Glasfaseranschluss (100Mb/s synchron und mehr)

# Betriebssystemumgebung vorbereiten

Bevor die WAX-Software kompiliert und konfiguriert wird, muss die Betriebssystemumgebung - in diesem Fall Ubuntu 20.04 - für die Leistung und die zu erwartende Belastung konfiguriert werden.

# Zettabyte File System (ZFS)

Dieser Node-Build verwendet **2 diskrete SAS-Platten**, um die Festplatten-IO auszugleichen und eine kostengünstigere Speicheroption für die Verzeichnisse `/blocks` und `/state-history` zu bieten, die zusammen derzeit 8 TB groß sind und weiter wachsen.

**Festplatte 1** ist die Hochgeschwindigkeits-SSD oder NVMe der Enterprise-Klasse und wird als Betriebssystem-Festplatte für die WAX-Software, alle Konfigurations- und Statusdateien verwendet. Die Zustandsdateien sind extrem IO-intensiv, die Lebensdauer einer Consumer-basierten SSD wird aufgrund der hohen Anzahl von Schreibvorgängen kurz sein, weshalb eine Enterprise-SSD oder NVMe mit hoher Ausdauer verwendet werden muss.

Es muss erwähnt werden, dass es Mechanismen gibt, um diese Zustandsdateien im Arbeitsspeicher auszuführen, wenn genügend Speicherplatz vorhanden ist; dieses Thema wird in einem späteren Artikel behandelt.

In diesem Beispiel wird auf Platte 1 das Standard-Betriebssystem **Ext4 File System** ausgeführt, das bereits während der Installation von Ubuntu 20.04 implementiert wird.

**Platte 2** ist die SATA- oder SAS-Platte mit großer Kapazität, auf der die Verzeichnisse `/blocks` und `/state-history` liegen werden. Die IO-Anforderungen für diese Verzeichnisse sind weitaus geringer als für die Statusdateien, und langsamere, spindelbasierte Festplatten mit größerer Kapazität sind immer noch geeignet.

In diesem Beispiel wird auf Platte 2 das **ZFS-Dateisystem** laufen, das uns zwei wesentliche Vorteile bietet. ZFS ermöglicht uns die **LZ4-Komprimierung** und verbessert mit dem **Adaptive Replacement Cache** (ARC) die IO der Festplatte. Die Komprimierung wird nur für das /blocks-Verzeichnis verwendet (was derzeit einen Gewinn von 1,3x bedeutet), da die bereits optimierte flache State-History-Datei davon nicht profitiert.

Implementieren Sie ZFS auf Platte 2 mit der folgenden Konfiguration:

```
#ZFS installieren  
> sudo apt-get install zfsutils-linux

#Disk 2 name anzeigen  
> lsblk

#Create ZFS Pool called "datavolume" on device "sdb"  
> sudo zpool create datavolume /dev/sdb

#LZ4 Kompression aktivieren  
> sudo zfs set compression=lz4 datavolume

#ZFS-Zugriffszeit-Updates deaktivieren  
> sudo zfs set atime=off datavolume

#ARC so einstellen, dass nur Metadaten zwischengespeichert werden  
> sudo zfs set primarycache=all datavolume

#Mountpoint konfigurieren  
> sudo zfs set mountpoint=/home/eosphere/datavolume datavolume

#Spezifischen Ordner für /blocks und /state-history erstellen  
> mkdir /home/eosphere/datavolume/blocks

> mkdir /home/eosphere/datavolume/state-history

#Spezifischen Mountpoint für /blocks und /state-history setzen  
> sudo zfs create -o mountpoint=/home/eosphere/datavolume/blocks datavolume/blocks

> sudo zfs create -o mountpoint=/home/eosphere/datavolume/state-history datavolume/state-history

#Ausschalten der lz4-Komprimierung auf dem State-History-Mountpoint  
> sudo zfs set compression=none datavolume/state-history

#ZFS Settings verifizieren  
> zfs get all
```
# Network Time Protocol (NTP)

Für eine global vernetzte Blockchain ist es entscheidend, dass die Zeit über alle Nodes hinweg synchronisiert ist.

[Chrony](https://chrony.tuxfamily.org/) ist ein hervorragender NTP-Client und eignet sich gut für die Bedürfnisse von WAX Mainnet.

Installieren, konfigurieren und überprüfen Sie ihn wie unten beschrieben:

```
#Chrony installieren  
> sudo apt install chrony

#Fügen Sie bei Bedarf manuell lokale Peers hinzu, das sind AU-Server  
> sudo nano /etc/chrony/chrony.conf  
  
server 0.pool.ntp.org  
server 1.pool.ntp.org  
server 2.pool.ntp.org  
server 3.pool.ntp.org

#Chrony neustarten  
> sudo /etc/init.d/chrony restart

#Verifizieren
> chronyc sources -v  

> chronyc tracking

#Bei Bedarf die Zeitzone einstellen  
> sudo timedatectl set-timezone Australia/Perth
```

# Stack Limits und Openfiles

Die Adressierung des WAX-Softwarespeichers und die Anzahl der API-Anfragen, die ein Mainnet-Node erhält, machen es erforderlich, dass das standardmäßige Stack-Limit von Ubuntu 20.04 und die Anzahl der offenen Dateien erhöht werden.


Konfigurieren und überprüfen Sie die erhöhten Grenzwerte wie unten beschrieben:

```
> sudo nano /etc/systemd/system.conf

#Folgende Config hinzufügen
DefaultLimitNOFILE=64000   
DefaultLimitSTACK=65536000

#Neustarten und verifizieren  
> ulimit -a
```

# Software kompilieren

Die WAX-Software ist von der Open-Source-Software Antelope abgeleitet, wurde jedoch an die Bedürfnisse des WAX-Protokollnetzes angepasst.

Derzeit ist die vom WAX Block Producer akzeptierte Softwareversion `v3.1.0wax01`, erstellt von [cc32d9](https://cc32d9.medium.com/), der Mitglied der [EOS Amsterdam Guild](https://eosamsterdam.net/) ist.

Das neueste `wax`-Build-Tag ist derzeit auf dem [cc32d9 Github](https://github.com/cc32d9/wax-leap/tags) verfügbar.

**Bauprozess**


In diesem Beispiel wird [Ubuntu Linux](https://ubuntu.com/) verwendet, um die WAX-Software aus dem Quellcode zu erstellen, wobei der folgende Prozess befolgt wird:
```
> cd ~

> sudo apt install -y file

> git clone https://github.com/cc32d9/wax-leap.git

> cd wax-leap

> git checkout v3.1.0.wax01

> git submodule update --init --recursive

> sudo bash scripts/install_deps.sh

> mkdir build

# Falls nötig, ergänzen Sie $(nproc) unten mit der Anzahl der Jobs, die Ihr Server aushalten kann, ich schlage 4GB RAM pro Job vor.
> nice bash scripts/pinned_build.sh ~/wax-leap/build/leap-deps ~/wax-leap/build $(nproc)

# Dateien befinden sich in ~/wax-leap/build/programs
```

# Konfiguration

Nachdem nun ein sauberer Build der WAX Software kompiliert wurde, können wir mit der Konfiguration der State-History für den Betrieb des WAX Mainnet beginnen.

Zum Konfigurieren und Starten der Node wird `nodeos` verwendet. `nodeos` ist der Kerndienst-Daemon, der auf jeder WAX Protocol Network-Node läuft.

`nodeos` kann so konfiguriert werden, dass es Smart Contracts verarbeitet, Transaktionen validiert, Blöcke mit gültigen Transaktionen erzeugt und Blöcke bestätigt, um sie in der Blockchain zu speichern.

Die primären Betriebsfunktionen von "nodeos" sind der Betrieb als Blockproduzent, Netzwerk-API-Endpunkt, P2P-Seed-Nodes oder State-History-Nodes. In einem stark frequentierten Netzwerk wie dem WAX Mainnet werden diese Funktionen in der Regel auf physisch getrennte Server verteilt.

In diesem WAX-Mainnet-Beispiel werden Sie die Node mit anderen Netzwerk-Peers verbinden und für API- und Websocket-Verbindungen als State-History (SHIP)-Nodes zur Verfügung stellen.

`nodeos` benötigt **zwei Dateien**, um sich mit Peers zu verbinden und im WAX Mainnet zu laufen:

**config.ini**

Erstellen Sie eine Standard-"config.ini", indem Sie "nodeos" ohne "config" mit folgendem Befehl ausführen:

```
> mkdir ~/waxdata

> cd ~/wax-leap/build/programs/nodeos

> ./nodeos --data-dir ~/waxdata --config-dir ~/waxdata
```

Sie können dann die neu erstellte `config.ini` bearbeiten und alle verfügbaren Parameter sehen:

```
> cd ~/waxdata> nano config.ini
```

Bearbeiten Sie nun die Datei `config.ini` und fügen Sie die folgenden Konfigurationseinstellungen hinzu:

```
# den Speicherort des Blocks-Verzeichnisses auf Platte 2  
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
  
# sentnlagents: GB, United Kingdom  
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

# PeerList - https://validate.eosnation.io/wax/reports/config.html

agent-name = "<yourname> WAX Mainnet State-History"  
  
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

Dies sind die anfänglichen Zustandsparameter, die von jeder neuen Node im WAX Mainnet benötigt werden. Erstellen Sie die Datei wie unten beschrieben:

```
> cd ~/waxdata

> nano genesis.json
```

Fügen Sie die folgenden Parameter in die Datei "genesis.json" für das WAX Public Mainnet ein:

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

# Nodeos starten

Nachdem die `config.ini` konfiguriert und die anfänglichen Parameter der WAX-Mainnet-Chain `genesis.json` erstellt worden sind, können Sie nun dem Netzwerk beitreten und den Nodes synchronisieren.

Verwenden Sie screen, um Ihre Sitzung auch nach dem Trennen der Verbindung aufrechtzuerhalten, siehe unten:

```
#screen session erstellen
> screen -US wax 

#screen session beenden
> ctrl-a+d 

#screen session wiederherstellen
> screen -r wax
```

Führen Sie `nodeos` mit Zeigern auf die Konfigurations-, Daten- und Genesis-Datei aus:

```
> cd ~/wax-leap/build/programs/nodeos
> ./nodeos --data-dir ~/waxdata --config-dir ~/waxdata --genesis-json ~/waxdata/genesis.json --disable-replay-opts
```
Ihre WAX Mainnet-Node beginnt nun mit der Synchronisierung mit den konfigurierten Peers und holt den Headblock der WAX Mainnet-Chain ein.

Zum Zeitpunkt der Erstellung dieses Dokuments (September 2022) kann dies bis zu einem Monat für eine vollständige Blocksynchronisierung von Genesis dauern. Es kann auch hilfreich sein, wenn Sie einige nahe beieinander liegende Peers auswählen, um die Überlastung der Peers zu begrenzen und eine niedrige Latenz zu gewährleisten.

Wenn Ihre Node vom Anfang der Kette aus synchronisiert, erstellt er die Protokoll- und Indexdateien in den Verzeichnissen `/blocks` und `/state-history`.

Die Node ist über **http port 8888** für Abfragen und **ws port 8080** für State-History erreichbar.

---

Diese **WAX Developer Technical Guides** wurden unter Verwendung von Quellmaterial aus der [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home) erstellt.

Stellen Sie Ihre Fragen im [EOSphere Telegram](https://t.me/eosphere_io)
