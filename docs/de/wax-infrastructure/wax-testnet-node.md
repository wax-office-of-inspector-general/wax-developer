---
title: WAX Testnet Node aufsetzen
nav_order: 142
layout: default
parent: WAX Infrastructure/APIs
lang-ref: Set Up a WAX Testnet Node
lang: de
---

Der Betrieb der Antelope-Infrastruktur zur Unterstützung des WAX-Protokoll-Netzwerks kann zu Beginn ziemlich entmutigend sein. Diese Reihe von Leitfäden soll die Infrastruktur- und Betriebsanforderungen entmystifizieren, die für den Betrieb von Rock Solid Services für das WAX Protocol Network erforderlich sind.

Dieser Leitfaden zeigt Ihnen, wie Sie mit dem Aufbau einer WAX-Node im Public WAX Testnet beginnen können.

Dieser Leitfaden wurde aktualisiert, um den [_Antelope_](https://antelope.io/) _Leap Software Build-Prozess zu berücksichtigen.

# Wie man eine WAX-Testnet-Node einrichtet

Das WAX Testnet hat im Vergleich zum Mainnet relativ niedrige Systemanforderungen, ist aber voll funktionsfähig mit frei erhältlichen WAX Token und daher ein idealer Ort, um sich mit der WAX Software und dem Netzwerk selbst vertraut zu machen.

## Testnet-Anforderungen

**Hardware**

-   4 Core CPU /  _4Ghz__+_ _empfohlen falls Blöcke produziert werden sollen_
-   128GB Disk /  _SSD or NVMe bevorzugt_
-   4GB RAM

**Betriebssystem**

-   Ubuntu 18.04
-   Ubuntu 20.04  **_(Empfohlen)_**
-   Ubuntu 22.04

**Internet**

- Moderne Breitband-/Glasfaserverbindung (1Mb/s und mehr)
- Statische öffentliche IP-Adresse (die entweder auf diesem Knoten endet oder mit NAT weitergeleitet wird)

## Software kompilieren

Die WAX-Software ist von der Open-Source-Software Antelope abgeleitet, wurde jedoch an die Bedürfnisse des WAX-Protokollnetzes angepasst.

Derzeit ist die vom WAX Block Producer akzeptierte Softwareversion `v3.1.0wax01`, erstellt von [cc32d9](https://cc32d9.medium.com/), der Mitglied der [EOS Amsterdam Guild](https://eosamsterdam.net/) ist.

Das neueste `wax`-Build-Tag ist derzeit auf dem [cc32d9 Github](https://github.com/cc32d9/wax-leap/tags) verfügbar.

**Bauprozess**

In diesem Beispiel wird [Ubuntu Linux](https://ubuntu.com/) verwendet, um die WAX-Software aus dem Quellcode zu erstellen, wobei der folgende Prozess befolgt wird:
```
> cd ~

> sudo apt install -y file

> git clone [https://github.com/cc32d9/wax-leap.git](https://github.com/cc32d9/wax-leap.git)

> cd wax-leap

> git checkout v3.1.0.wax01

> git submodule update --init --recursive

> sudo bash scripts/install_deps.sh

> mkdir build

# Falls nötig, ergänzen Sie $(nproc) unten mit der Anzahl der Jobs, die Ihr Server aushalten kann, z.B. 4GB RAM pro Job

> nice bash scripts/pinned_build.sh ~/wax-leap/build/leap-deps ~/wax-leap/build $(nproc)

# Binaries are located in ~/wax-leap/build/programs
```

## Konfiguration
Nachdem nun ein sauberer Build der WAX-Software kompiliert wurde, können wir mit der Konfiguration für den Betrieb beginnen.

Um die Node zu konfigurieren und zu starten, wird `nodeos` verwendet. `nodeos` ist der Kerndienst-Daemon, der auf jeder WAX Protocol Node läuft.

`nodeos` kann so konfiguriert werden, dass es Smart Contracts verarbeitet, Transaktionen validiert, Blöcke mit gültigen Transaktionen erzeugt und Blöcke bestätigt, um sie in der Blockchain aufzuzeichnen. Sie können mehr darüber lesen [hier](https://developers.eos.io/manuals/eos/latest/nodeos/index).

Die primären operativen Funktionen von "nodeos" sind: der Betrieb als Blockproduzent, Netzwerk-API-Endpunkt, P2P-Seed-Node oder State-History-Node. In einem stark ausgelasteten Netzwerk wie dem WAX Mainnet werden diese Funktionen in der Regel auf physisch getrennte Server verteilt.

In diesem WAX-Testnet-Beispiel werden Sie Ihre Node mit anderen Netzwerk-Peers verbinden, einen P2P-Seed-Node-Dienst anbieten und die Node als Netzwerk-API-Endpunkt zur Verfügung stellen.  Diese Node wird keine Unterstützung für die Abfrage historischer Daten bieten.

"nodeos" benötigt **zwei Dateien**, um sich mit Peers zu verbinden und im WAX Testnet zu laufen:


**config.ini**
Erstellen Sie eine Standard-"config.ini", indem Sie "nodeos" ohne "config" mit folgendem Befehl ausführen:

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
  
# 3dkrenderwax: FI, Finland  
p2p-peer-address = testnet-p2p.3dkrender.com:9876  
  
# amsterdamwax: DE, Falkenstein  
p2p-peer-address = waxtest.eu.eosamsterdam.net:9912  
  
# blokcrafters: US, Portland, Oregon  
p2p-peer-address = waxtest-peer-us.blokcrafters.io:19876  
  
# blokcrafters: FI, Helsinki, Uusimaa  
p2p-peer-address = waxtest-peer-eu.blokcrafters.io:19876  
  
# bountyblokbp: FR, France  
p2p-peer-address = p2p.wax-test.bountyblok.io:9874  
  
# bp.box: KY, Cayman Islands  
p2p-peer-address = waxtest.defibox.xyz:19876  
  
# eosdacserver: DE, Germany  
p2p-peer-address = waxtest-p2p.eosdac.io:49876  
  
# eosiodetroit: US, wax-testnet-bp  
p2p-peer-address = p2p.testnet.wax.detroitledger.tech:1337  
  
# eosphereiobp: AU, Sydney  
p2p-peer-address = peer1-wax-testnet.eosphere.io:9876  
  
# greeneosiobp: DE, Germany  
p2p-peer-address = p2p.waxtest.waxgalaxy.io:9878  
  
# guild.nefty: DE, Germany  
p2p-peer-address = p2p-testnet.neftyblocks.com:19876  
  
# ivote4waxusa: US, Greenville,SC,USA  
p2p-peer-address = test.wax.p2p.eosusa.io:19875  
  
# liquidgaming: DE, Germany  
p2p-peer-address = 138.201.23.118:9877  
  
# nation.wax: CA, Canada  
p2p-peer-address = waxtest.seed.eosnation.io:9876  
  
# oneinacilian: GB, United Kingdom  
p2p-peer-address = p2ptest.oiac.io:10877  
  
# pink.gg: DE, Germany  
p2p-peer-address = peer1.testnet.wax.pink.gg:16714  
  
# waxhiveguild: DE, Germany  
p2p-peer-address = peer-test.hivebp.io:9876  
  
# waxmadrid111: DE, SEED  
p2p-peer-address = wax-seed-testnet.eosiomadrid.io:9876  
  
# waxswedenorg: SE, Sweden  
p2p-peer-address = p2p.testnet.waxsweden.org:59676  
  
# wecan: DE, Berlin  
p2p-peer-address = seed1-wax-testnet.wecan.dev:9876  
  
# wecan: GB, London  
p2p-peer-address = seed2-wax-testnet.wecan.dev:9876

# EOSNation Provided PeerList - https://validate.eosnation.io/waxtest/reports/config.html

agent-name = "<yourname> WAX Testnet"

max-clients = 100

sync-fetch-span = 500

plugin = eosio::http_plugin  
plugin = eosio::chain_plugin  
plugin = eosio::chain_api_plugin
```
**genesis.json**
Dies sind die Parameter für den Anfangszustand, die jeder neue Node im WAX-Testnetz benötigt. Erstellen Sie die Datei wie unten beschrieben:

```
> cd ~/waxdata

> nano genesis.json
```

Fügen Sie die folgenden Parameter in die Datei `genesis.json` für das WAX Public Testnet ein:

```
{  
 "initial_timestamp": "2019–12–06T06:06:06.000",  
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

## Nodeos starten
Nachdem die `config.ini` konfiguriert und die anfänglichen WAX-Testnet-Chain parameter `genesis.json` erstellt wurden, können Sie nun dem Netzwerk beitreten und die Node synchronisieren.

Verwenden Sie screen, um Ihre Sitzung auch nach dem Trennen der Verbindung aufrechtzuerhalten, siehe unten:

```
screen session erstellen  
----------------------------  
> screen -US wax   
  
screen session trennen  
-------------------------  
> ctrl-a+d 

screen session wiederherstellen  
------------------------  
> screen -r wax
```

Führen Sie `nodeos` mit Zeigern auf die Konfigurations-, Daten- und Genesis-Datei aus:

```
> cd ~/wax-leap/build/programs/nodeos

> ./nodeos --data-dir ~/waxdata --config-dir ~/waxdata --genesis-json ~/waxdata/genesis.json
```

Die WAX Testnet-Node beginnt nun mit der Synchronisierung mit den konfigurierten Peers, bis er mit der WAX Testnet-Chain gleichzieht und auf dem neuesten Stand ist.

---

Diese **WAX Developer Technical Guides** wurden unter Verwendung von Quellmaterial aus der [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home) erstellt.

Stellen Sie Ihre Fragen im [EOSphere Telegram](https://t.me/eosphere_io)
