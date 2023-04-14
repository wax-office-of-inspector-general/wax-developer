---
title: WAX Mainnet Node aufsetzen
nav_order: 145
layout: default
parent: WAX Infrastructure/APIs
lang-ref: How to Set Up a Solid WAX Mainnet Node
lang: es-DE
---

Frei verfügbare Token und relativ niedrige Systemanforderungen machen das WAX Testnet zu einem idealen Lernort, doch nun ist es an der Zeit, das WAX Mainnet anzugehen.

Dieser Leitfaden vermittelt Ihnen das nötige Wissen, um solide WAX Mainnet-Nodes aufzusetzen, die den Anforderungen an das Netzwerk und die Infrastruktur gerecht werden, die erfolgreiche Gilden erfüllen müssen.

Dieser Artikel wurde aktualisiert, um den [_Antelope_](https://antelope.io/) _Leap-build-prozess zu berücksichtigen.

# Wie man eine soliden WAX-Mainnet-Node einrichtet

Das WAX Mainnet hat, was Antelope Chains angeht, sehr hohe Anforderungen an die Infrastruktur. Natürlich wächst das WAX Mainnet ständig und es gibt zahlreiche Möglichkeiten, diese Anforderungen zu erfüllen.

In diesem Artikel wird ein Beispiel vorgestellt, das derzeit (September 2022) gültig ist und von der EOSphere Gilde verwendet wird, die mehrere Peers und Millionen von API-Anfragen pro Tag bedient.

# Mainnet Anforderungen

**Hardware**

-   4 Core CPU /  _4Ghz+ empfohlen falls ebenfalls blöcke produzieren möchten_
-   (1) 256GB+ Disk /  _Enterprise Grade SSD oder NVMe (_**_Hohe Ausdaueranforderung._**_)_
-   (2) 4TB+ Disk /  _SAS or SATA sind OK aber SSD aber NVMe sind ist bevorzugt_
-   128GB+ RAM

**Betriebssystem*

-   Ubuntu 18.04
-   Ubuntu 20.04  **_(empfohlen)_**
-   Ubuntu 22.04

**Internet**

- Moderne Breitband-/Glasfaserverbindung (100Mb/s synchron und mehr)
- Statische öffentliche IP-Adresse (die entweder auf dieser Node endet oder mit NAT weitergeleitet wird)

# Betriebssystemumgebung vorbereiten

Bevor die WAX-Software erstellt und konfiguriert wird, muss das Betriebssystem - in diesem Fall Ubuntu 20.04 - für die Leistung und die zu erwartende Belastung konfiguriert werden.

## Zettabyte File System (ZFS)

Dieser Node-Build verwendet **2 separate Festplatten**, um die Festplatten-IO auszugleichen und eine kostengünstigere Speicheroption für die Datei `blocks.log` zu bieten, die derzeit 2,1 TB groß ist und weiter wächst.

**Festplatte 1** ist die Hochgeschwindigkeits-SSD oder NVMe der Enterprise-Klasse und wird als Betriebssystem-Festplatte für die WAX-Software, alle Konfigurations- und Statusdateien verwendet. Die Zustandsdateien sind extrem IO-intensiv, die Lebensdauer einer Consumer-basierten SSD wird aufgrund der hohen Anzahl von Schreibvorgängen kurz sein, weshalb eine Enterprise-SSD oder NVMe mit hoher Ausdauer verwendet werden muss.

Es muss erwähnt werden, dass es Mechanismen gibt, um diese Zustandsdateien im Arbeitsspeicher auszuführen, wenn genügend Speicherplatz vorhanden ist; dieses Thema wird in einem späteren Artikel behandelt.

In diesem Beispiel wird auf Platte 1 das Standard-Betriebssystem **Ext4 File System** ausgeführt, das bereits während der Installation von Ubuntu 20.04 implementiert wird.

**Platte 2** ist die SATA- oder SAS-Platte mit großer Kapazität, auf der die Datei "blocks.log" gespeichert wird. Die IO-Anforderungen an das Blocks-Verzeichnis sind weitaus geringer als die Statusdateien und langsamere, spindelbasierte Festplatten mit größerer Kapazität sind immer noch geeignet.

In diesem Beispiel wird auf Platte 2 das **ZFS-Dateisystem** laufen, das uns zwei wesentliche Vorteile bietet. ZFS ermöglicht uns die Verwendung der LZ4-Komprimierung (was derzeit einen Gewinn von 1,3 darstellt) und verbessert die Festplatten-IO mit **Adaptive Replacement Cache** (ARC)

Implementieren Sie ZFS auf Platte 2 mit der folgenden Konfiguration:

```
# ZFS installieren  
> sudo apt-get install zfsutils-linux

# Name der 2. Festplatte ermitteln  
> lsblk

# ZFS-Pool namens "datavolume" auf dem Gerät "sdb" erstellen  
> sudo zpool create datavolume /dev/sdb

# LZ4 kompression aktivieren  
> sudo zfs set compression=lz4 datavolume

# ZFS zeitupdates deaktivieren  
> sudo zfs set atime=off datavolume

# ARC: Nur metadaten cachen  
> sudo zfs set primarycache=all datavolume

# mountpoint definieren  
> sudo zfs set mountpoint=/home/eosphere/datavolume datavolume

# ZFS Einstellungen überprüfen  
> zfs get all
```

## Network Time Protocol (NTP)

Für eine global vernetzte Blockchain ist es von entscheidender Bedeutung, dass die Zeit über alle Nodes hinweg synchronisiert ist.

[Chrony](https://chrony.tuxfamily.org/) ist ein hervorragender NTP-Client und eignet sich gut für die Bedürfnisse des WAX Mainnet.

Installieren, konfigurieren und verifizieren Sie ihn wie unten beschrieben:

```
#Chrony installieren  
> sudo apt install chrony

# Fügen Sie bei Bedarf manuell lokale Peers hinzu, das sind AU-Server  
> sudo nano /etc/chrony/chrony.conf  
  
server 0.pool.ntp.org  
server 1.pool.ntp.org  
server 2.pool.ntp.org  
server 3.pool.ntp.org

# Chrony neustarten  
> sudo /etc/init.d/chrony restart

# Überprüfen
> chronyc sources -v  
> chronyc tracking

# ggf. Ihre lokale Zeitzone einstellen
> sudo timedatectl set-timezone Australia/Perth
```

## Stack Limits und Openfiles

Die Adressierung des WAX-Softwarespeichers und die Anzahl der API-Anfragen, die eine Mainnet-Producer-Node erhält, machen es erforderlich, dass das standardmäßige Stack-Limit von Ubuntu 20.04 und die Anzahl der offenen Dateien erhöht werden.

Konfigurieren und überprüfen Sie die erhöhten Grenzwerte wie unten beschrieben:

```
> sudo nano /etc/systemd/system.conf

#Fügen Sie die folgende Konfiguration hinzu    
DefaultLimitNOFILE=64000   
DefaultLimitSTACK=65536000

#Server neu starten und verifizieren    
> ulimit -a
```

# Software kompilieren


Die WAX-Software ist von der Open-Source-Software Antelope abgeleitet, wurde jedoch an die Bedürfnisse des WAX-Protokollnetzes angepasst.

Derzeit ist die vom WAX Block Producer akzeptierte Softwareversion `v3.1.0wax01`, erstellt von [cc32d9](https://cc32d9.medium.com/), der Mitglied der [EOS Amsterdam Guild](https://eosamsterdam.net/) ist.

Das neueste `wax`-Build-Tag ist derzeit auf dem [cc32d9 Github](https://github.com/cc32d9/wax-leap/tags) verfügbar.

**Build Prozess**

In diesem Beispiel wird [Ubuntu Linux](https://ubuntu.com/) verwendet, um die WAX-Software aus dem Quellcode zu erstellen, und zwar nach dem folgenden Verfahren:

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

# Binaries sind in ~/wax-leap/build/programs
```

# Konfiguration

Nachdem nun ein sauberer Build der WAX Software kompiliert wurde, können wir mit der Konfiguration für den Betrieb des WAX Mainnet beginnen.

Zum Konfigurieren und Starten der Node wird `nodeos` verwendet. `nodeos` ist der Kerndienst-Daemon, der auf jedem WAX Protocol Network-Node läuft.

"nodeos" kann so konfiguriert werden, dass es Smart Contracts verarbeitet, Transaktionen validiert, Blöcke mit gültigen Transaktionen erzeugt und Blöcke bestätigt, um sie in der Blockchain zu speichern.

Die primären Betriebsfunktionen von nodeos sind die eines Blockproduzenten, eines Netzwerk-API-Endpunkts, einer P2P-Seed-Node oder einer State-History-Node. In einem stark frequentierten Netzwerk wie dem WAX Mainnet werden diese Funktionen in der Regel auf physisch getrennte Server verteilt.

In diesem WAX-Mainnet-Beispiel werden Sie Ihre Node mit anderen Netzwerk-Peers verbinden, einen P2P Seed Node-Dienst anbieten und die Node als Netzwerk-API-Endpunkt zur Verfügung stellen. Diese Node wird keine Unterstützung für die Abfrage historischer Daten bieten.

nodeos" benötigt **zwei Dateien**, um sich mit Peers zu verbinden und im WAX Mainnet zu laufen:

**config.ini**

Erstellen Sie eine Standard-"config.ini", indem Sie "nodeos" ohne "config" mit dem unten stehenden Befehl ausführen:

```
> mkdir ~/waxdata

> cd ~/wax-leap/build/programs/nodeos

> ./nodeos --data-dir ~/waxdata --config-dir ~/waxdata
```

Sie können dann die neu erstellte `config.ini` bearbeiten und alle verfügbaren Parameter sehen:

```
> cd ~/waxdata

> nano config.ini
```
Bearbeiten Sie nun die Datei `config.ini` und fügen Sie die folgenden Konfigurationseinstellungen hinzu:

```
# Ort des Blocks-Verzeichnisses auf Festplatte 2  
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

Dies sind die anfänglichen Zustandsparameter, die von jeder neu gestarteten Node im WAX Mainnet benötigt werden. Erstellen Sie die Datei wie unten angegeben:

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

Nachdem die `config.ini` konfiguriert und die anfänglichen WAX Mainnet chainparameter `genesis.json` erstellt wurden, können Sie nun dem Netzwerk beitreten und die Node synchronisieren.

Verwenden Sie screen, um Ihre Sitzung auch dann aufrechtzuerhalten, wenn Sie die Verbindung trennen, wie unten beschrieben:

```
#Erstelle eine neue Screen-Sitzung  
  
> screen -US wax 

#Trennt die Screen-Sitzung  
  
> ctrl-a+d 

#Bildschirm-Sitzung wiederherstellen  
  
> screen -r wax
```

Führen Sie `nodeos` mit Zeigern auf die Konfigurations-, Daten- und Genesis-Datei aus:

```
> cd ~/wax-leap/build/programs/nodeos

> nodeos --data-dir ~/waxdata --config-dir ~/waxdata --genesis-json ~/waxdata/genesis.json
```

Ihre WAX Mainnet-Node beginnt nun mit der Synchronisierung mit den konfigurierten Peers, bis er die WAX Mainnet-Chain eingeholt hat und auf dem neuesten Stand ist.

Es ist möglich, den Synchronisierungsprozess zu beschleunigen, indem Sie mit einem Snapshot und einer gültigen `blocks.log` beginnen. Der Prozess wird im **WAX Snapshots Guide** erklärt.
---

Diese **WAX Developer Technical Guides** wurden unter Verwendung von Quellmaterial aus der [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home) erstellt.

Stellen Sie Ihre Fragen im [EOSphere Telegram](https://t.me/eosphere_io)
