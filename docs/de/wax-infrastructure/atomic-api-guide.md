---
title: Atomic Assets/Market API
nav_order: 143
layout: default
parent: WAX Infrastructure/APIs
lang-ref: Atomic Assets/Market API
lang: es-DE
---

WAX Blockchain konzentriert sich stark auf NFTs und der AtomicAssets-Standard ist der defacto-Standard auf WAX für NFTs geworden. Dieser Leitfaden hilft Projektteams bei der Einrichtung ihrer eigenen AtomicAssets-API-Infrastruktur, um auf NFTs und marktplatzspezifische Daten zuzugreifen. Diese API-Daten können für verschiedene Zwecke nützlich sein, wie zum Beispiel:

- Spiele entwickeln
- Aufbau von Marktplätzen
- Zugriff auf NFTs in Spielen
- NFT Portfolio eines Benutzers
- Historische NFT Aktivitäten eines Benutzers
- Für Buchhaltungs- und Steuerzwecke

### Voraussetzungen/Anforderungen:

- **Atomic Filler Node Hardware (Mindestanforderungen):** Multi-Thread-CPU mit mindestens 4gHZ CPU-Geschwindigkeit oder höher, 64GB RAM, 2TB NvME SSD
- **Atomic API Hardware (Mindestanforderungen):** Multi-threaded CPU mit mindestens 4gHZ CPU-Geschwindigkeit oder höher, 128GB RAM, 2TB NvME SSD
- Hardware (empfohlene Spezifikation):** i9 CPU, 128GB RAM, 7TB NVME SSD [Für eine partielle State-History können Sie niedrigere Spezifikationen verwenden oder sie auf demselben Server wie Atomic Filler betreiben. Es kann auch von einem Snapshot gestartet werden]
- **Anforderungen:** 
  - PostgreSQL >= 13.0
  - NodeJS >= 16.0
  - Redis >= 5.0
  - Nodeos >= 1.8.0 (nur mit 2.0 und 2.1 getestet) Das State History Plugin muss aktiviert sein und die Optionen: `trace-history = true`, `chain-state-history = true`
  - Hasura GraphQL Engine >= 1.3 (wenn Sie GraphQL-Abfragen erlauben wollen) [https://computingforgeeks.com/install-hasura-graphql-engine-on-ubuntu-18-04-centos-7/]
  - PGAdmin 4 (Schnittstelle zur Verwaltung der Postgres-Datenbank)

Sie können 1 node sowohl für Atomic Filler als auch für die API in einem 128GB RAM Server verwenden, aber es wird empfohlen, ein Hochverfügbarkeits-Setup mit Postgres-Replikation zwischen den Servern für eine bessere Leistung und Anfrageverarbeitung zu haben. 

#### Bare-Metal Infra provider:

- [Hetzner](https://www.hetzner.com/dedicated-rootserver "Hetzner")
- [Leaseweb](https://www.leaseweb.us/dedicated-servers "Leaseweb")

#### Cloud Infra provider:

- https://www.digitalocean.com/pricing/managed-databases

### Einrichtung und Installation:

Nachdem Sie die Server oder Cloud-Instanzen gesichert und die Boot-Konfiguration sowie die entsprechenden RAID-Modi eingerichtet haben, können Sie sich auf dem Server anmelden und die folgenden Befehle ausführen:

[Empfehlung - Richten Sie die Root-Partition vorerst nur im Raid1- oder Raid5-Modus ein. Wir werden die Festplatten später nach dem Booten partitionieren und sie einem ZFS-Pool zuweisen]

##### 1. Aktualisieren Sie die Standardpakete und installieren Sie neue Pakete

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
##### 3. Festplatten Partitionen erstellen
Der erste Schritt besteht darin, die Festplatten und ihre Namen mit Hilfe der folgenden Befehle zu bestimmen:
```
fdisk -l
```
Nachdem wir die Festplattennamen identifiziert haben, partitionieren wir sie mit dem folgenden Beispielbefehl. Wir müssen zwei Partitionen erstellen, eine für Swap und eine für den ZFS-Speicherpool.

```
cfdisk /dev/nvme0n1
```
Führen Sie die obigen Schritte für alle Festplatten auf Ihrem Server durch.

##### 4. Erhöhen Sie die Swap-Größe, da diese auf den Servern von Hetzner und Leaseweb normalerweise gering ist.
```
mkswap /dev/nvme0n1p5
mkswap /dev/nvme1n1p5
```
Fügen wir nun die Swap-Pools zur Tabelle System's FileSystem hinzu, indem wir die folgende Datei bearbeiten:
```
cat >>/etc/fstab <<'EOT'
/dev/nvme0n1p5     none            swap            defaults,pri=-2 0 0
/dev/nvme1n1p5     none            swap            defaults,pri=-2 0 0
EOT
```
Nach der Bearbeitung aktivieren wir den neu hinzugefügten Swap-Pool mit dem folgenden Befehl:
```
swapon -a
```

##### 5. Erstellen Sie einen ZFS-Speicherpool entsprechend Ihren Anforderungen mit den Modi zraid, mirror usw. Eine gute Quelle für Berechnungen von Festplattengrößen: http://www.raidz-calculator.com/

```
zpool create -o ashift=12 zfast raidz /dev/nvme0n1p6 /dev/nvme1n1p6 [--> adopt the partition names accordingly]
zfs set atime=off zfast
zfs set compression=lz4 zfast 
zfs create -o mountpoint=/home zfast/home [-->Creates mountpoint]
```

------------

Nachdem wir nun den Server und den Festplattenspeicher optimal eingerichtet haben, lassen Sie uns mit den nächsten Schritten fortfahren, um die Hyperion-bezogenen Abhängigkeiten einzurichten.

https://hyperion.docs.eosrio.io/manual_installation/

##### 6. Node JS installation:
```
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
node  -v
```
##### 7. PostgreSQL 14 Einrichtung und Installation:

Die folgenden Schritte gelten für die Einrichtung einer einzelnen Node, es wird jedoch empfohlen, einen Postgres-Cluster mit mehreren Nodes und Replikation einzurichten, um eine bessere Leistung und Ausfallsicherheit zu erzielen. 

Für die Einrichtung eines Postgres-Replikationsclusters, siehe:

- [Streaming Replikation](https://girders.org/postgresql/2021/11/05/setup-postgresql14-replication/)

**PostgreSQL 14 Installation mit Apt package:**

Guide: https://techviewleo.com/how-to-install-postgresql-database-on-ubuntu/

```
sudo apt update && sudo apt -y upgrade
sudo apt -y install gnupg2 wget vim
sudo apt-cache search postgresql | grep postgresql
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt -y update
sudo apt -y install postgresql-14 postgresql-client-14
```
Nach erfolgreicher Installation startet der PostgreSQL-Dienst automatisch und kann wie folgt überprüft werden.
```
$ systemctl status postgresql
● postgresql.service - PostgreSQL RDBMS
   Loaded: loaded (/lib/systemd/system/postgresql.service; enabled; vendor preset: enabled)
   Active: active (exited) since Mon 2021-10-25 16:15:55 CEST; 5s ago
  Process: 32506 ExecStart=/bin/true (code=exited, status=0/SUCCESS)
 Main PID: 32506 (code=exited, status=0/SUCCESS)

Okt 25 16:15:55 thor-KVM systemd[1]: Starting PostgreSQL RDBMS...
Okt 25 16:15:55 thor-KVM systemd[1]: Started PostgreSQL RDBMS.
```
Sie können die installierte PostgreSQL-Version auch mit dem folgenden Befehl überprüfen:
```
sudo -u postgres psql -c "SELECT version();"
```
Nachdem wir die Installation überprüft haben, aktualisieren wir das Passwort für den Benutzer postgres:
```
sudo su - postgres
psql -c "alter user postgres with password '<ENTER YOUR PASSWORD HERE>'
```

Lassen Sie uns nun neue Verzeichnisse auf dem ZFS-Speicherpool erstellen, damit PG-Daten dort anstelle der Standardverzeichnisse gespeichert werden können:
```
cd /home
mkdir pg-data
chown -R postgres:postgres pg-data/
```
Nachdem wir die Verzeichnisse erstellt und die Ordnerberechtigungen festgelegt haben, bearbeiten wir die PG-Konfiguration, indem wir die folgende Datei bearbeiten:
```
vim /etc/postgresql/14/main/postgresql.conf
```
###### Ersetzen Sie die folgenden Abschnitte in der PG-Konfigurationsdatei

```
data_directory = '/var/lib/postgresql/14/main'
```

##### 8. Redis installation
```
sudo add-apt-repository ppa:redislabs/redis
sudo apt-get -y update
sudo apt-get -y install redis
redis-server -v
```
###### Redis Supervision Methode aktualisieren
Ändern Sie die `supervised` Konfiguration von `supervised no` auf `supervised systemd` in `/etc/redis/redis.conf`

###### Redis Neustarten
```
sudo systemctl restart redis-server
sudo systemctl enable --now redis-server
sudo systemctl status redis-server
sudo systemctl status redis-server
sudo systemctl unmask  redis-server.service
sudo systemctl restart redis-server
sudo systemctl status redis-server
```
##### 9. PGAdmin4 installation

Guides:
  - https://computingforgeeks.com/how-to-install-pgadmin-4-on-ubuntu/
  - https://stackoverflow.com/questions/58239607/pgadmin-package-pgadmin4-has-no-installation-candidate

Installations Befehle
```
curl https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo apt-key add

sudo sh -c 'echo "deb https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list && apt update'

sudo apt -y install pgadmin4

For setting up the web server: sudo /usr/pgadmin4/bin/setup-web.sh
```

##### 10. Yarn and Pm2 installation

Yarn Installation:
```
sudo apt remove -y cmdtest
sudo apt remove -y yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update -y
sudo apt-get install yarn -y
```
Pm2 instllation:
```
yarn global add pm2
pm2 startup
```

------------
##### 11. Einrichten & Installieren von Atomic Filler & API:

Nachdem wir die Einrichtung der Abhängigkeiten abgeschlossen haben, können wir nun mit der eigentlichen Installation der Atomic API Software beginnen.

Wir haben jetzt zwei Möglichkeiten:
1. Wir installieren und synchronisieren alles von Grund auf. 
2. Vorhandene PG-Snapshots verwenden, um die Daten zu synchronisieren und dann die Atomic Filler & API-Instanzen zu starten.

Hinweis: Wenn Sie PG-Snapshots von einem Snapshot-Dienstanbieter verwenden, laden Sie die Snapshots herunter und extrahieren Sie sie

###### Einrichtung:

Klonen Sie die aktuelle Codebasis und installieren Sie den Atomic Filler & API:

```
git clone https://github.com/pinknetworkx/eosio-contract-api.git
cd eosio-contract-api
yarn install
```
Nach der Installation müssen wir die Verbindungen und die Konfiguration der Chain einrichten.

Folgen Sie der Anleitung [hier] (https://github.com/pinknetworkx/eosio-contract-api/blob/master/README.md "hier"), um die Konfigurationsdateien einzurichten. oder finden Sie die Beispiele unten:

Der Ordner config enthält 3 verschiedene Konfigurationsdateien

#### connections.config.json
Diese Datei enthält Postgres / Redis / Nodeos Verbindungsdaten für die verwendete Chain.

Hinweise
* Redis: Kann ohne weitere Maßnahmen für mehrere Chain verwendet werden
* PostgreSQL: Jede Chain benötigt ihre eigene Postgres-Datenbank (kann dieselbe Postgres-Instanz verwenden), aber mehrere Leser derselben
Chain können dieselbe Datenbank verwenden, wenn sie nicht in Konflikt stehen
* Nodeos: Nodeos sollte einen vollständigen Statusverlauf für den Bereich haben, den Sie zu indizieren versuchen.

```json
{
  "postgres": {
    "host": "127.0.0.1",
    "port": 5432,
    "user": "username",
    "password": "changeme",
    "database": "api-wax-mainnet-atomic-1"
  },
  "redis": {
    "host": "127.0.0.1",
    "port": 6379
  },
  "chain": {
    "name": "wax-mainnet",
    "chain_id": "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4",
    "http": "http://127.0.0.1:8888",
    "ship": "ws://127.0.0.1:8080"
  }
}
```

#### readers.config.json
Diese Datei wird zur Konfiguration des Füllers verwendet

Für atomicassets / atomicmarket sollten Sie die folgenden Startblöcke angeben
* Wax-Mainnet": "64000000
* `wax-testnet`: `35795000` (Hier müssen Sie es verwenden, sonst bricht es ab)

```json5
[
  // Mehrere Leser können definiert werden und jeder wird in einem separaten Thread ausgeführt
  {
    "name": "atomic-1", // Name des Lesers. Sollte pro Chain eindeutig sein und sich nach dem Start nicht mehr ändern

    "start_block": 0, // Start bei einem bestimmten Block. Wenn ready bereits gestartet wurde, kann dies nur höher als der letzte indizierte Block sein
    "stop_block": 0, // Anhalten bei einem bestimmten Block
    "irreversible_only": false, // Wenn Sie Daten für eine große Anzahl von Verträgen benötigen und keine Live-Daten brauchen, ist diese Option schneller

    "ship_prefetch_blocks": 50, // Wie viele unbestätigte Blöcke ship sendet
    "ship_min_block_confirmation": 30, // Nach wie vielen Blöcken wird der Leser die Blöcke bestätigen
    "ship_ds_queue_size": 20, // nach wie vielen Blöcken das Lesegerät die Aktions-/Tabellendaten preserialisieren soll
      
    "ds_ship_threads": 4, // Wie viele Threads für die Deserialisierung von Traces und Tabellendeltas verwendet werden sollen

    "db_group_blocks": 10, // Im Aufholmodus gruppiert der Leser diese Anzahl von Bl

    "contracts": [
      // AtomicAssets-Handler, der Daten für den AtomicAssets-NFT-Standard bereitstellt
      {
        "handler": "atomicassets",
        "args": {
          "atomicassets_account": "atomicassets", // Konto, auf dem der Vertrag bereitgestellt wird
          "store_logs": true, // speichert Protokolle
          "store_transfers": true // speichert die Übertragungshistorie
        }
      }
    ]
  }
]
```

#### server.config.json

```json5

  "provider_name": "pink.network", // Anbieter, der in der Endpunktdokumentation angegeben ist
  "provider_url": "https://pink.network",

  "server_addr": "0.0.0.0", // Serveradresse, an die gebunden werden soll
  "server_name": "wax.api.atomicassets.io", // Servername, der in der Dokumentation angegeben ist
  "server_port": 9000, // Server-Port

  "cache_life": 2, // GET-Endpunkte werden für diese Zeitspanne zwischengespeichert (in Sekunden)
  "trust_proxy": true, // Aktivieren Sie diese Option, wenn Sie einen Reverse-Proxy verwenden, um eine korrekte Ratenbegrenzung nach IP zu erhalten.

  "rate_limit": {
    "interval": 60, // Intervall zum Zurücksetzen des Zählers (in Sekunden)
    "requests": 240 // Wie viele Anfragen in dem festgelegten Intervall gestellt werden können
  },
    
  "ip_whitelist": [], // Diese IPs sind nicht geratelimited oder erhalten gecachte Anfragen
  "slow_query_threshold": 7500, // Wenn bestimmte Abfragen länger als dieser Schwellenwert dauern, wird eine Warnung ausgegeben

  "max_query_time_ms": 10000, // Maximale Ausführungszeit für eine Datenbankabfrage
  "max_db_connections": 50, // maximale Anzahl gleichzeitiger Datenbankverbindungen/Datenbankabfragen
        
  "namespaces": [
    // Namespace "atomicassets", der eine API für grundlegende Funktionalitäten bereitstellt
    {
      "name": "atomicassets", 
      "path": "/atomicassets", // Jeder API-Endpunkt wird mit diesem Pfad beginnen
      "args": {
        "atomicassets_account": "atomicassets" // Konto, auf dem der Vertrag eingesetzt wird
      }
    }
  ]
}

```

###### Atomic Api Starten:
Dieses Projekt besteht aus zwei getrennten Prozessen, die unabhängig voneinander gestartet und gestoppt werden müssen:
* Die API, die die Socket- und REST-Endpunkte (oder was auch immer verwendet wird) bereitstellt.
* Der Filler, der die Daten aus der Blockchain liest und die Datenbank füllt.

Der Filler muss vor der API gestartet werden, wenn er zum ersten Mal ausgeführt wird:

Voraussetzungen:
- PostgreSQL
  - Erstellen Sie eine Datenbank und einen Benutzer mit Lese- und Schreibrechten für diese Datenbank
    
- WAX-Archiv-Knoten 
  - State History Plugin aktiviert mit den Optionen `trace-history = true`, `chain-state-history = true`
  - Vollständig synchronisiert für den Blockbereich, den Sie verarbeiten wollen
  - Socket und http api öffnen

- Kopieren und ändern Sie die Beispielkonfigurationen mit den richtigen Verbindungsparametern

Es gibt zwei vorgeschlagene Möglichkeiten, das Projekt auszuführen: Docker, wenn Sie die Anwendung containerisieren wollen, oder PM2, wenn Sie sie auf Systemebene ausführen wollen

### Docker

1. `git clone && cd eosio-contract-api`
2. There is an example docker compose file provided
3. `docker-compose up -d`

Start
* `docker-compose start eosio-contract-api-filler`
* `docker-compose start eosio-contract-api-server`

Stop
* `docker-compose stop eosio-contract-api-filler`
* `docker-compose stop eosio-contract-api-server`

### PM2

1. `git clone && cd eosio-contract-api`
2. `yarn install`
3. `yarn global add pm2`

Start
* `pm2 start ecosystems.config.json --only eosio-contract-api-filler`
* `pm2 start ecosystems.config.json --only eosio-contract-api-server`

Stop
* `pm2 stop eosio-contract-api-filler`
* `pm2 stop eosio-contract-api-server`

**Hinweis:** Wenn Sie weitere Fragen haben, schreiben Sie sie bitte hier: https://t.me/waxinfra

------------

## Gut zu wissen: Derzeit unterstützte Contracts

### Leser (zum Füllen der Datenbank)

Leser werden verwendet, um die Datenbank für einen bestimmten Contracts zu füllen.

#### atomicassets

```json5
{
  "handler": "atomicassets",
  "args": {
    "atomicassets_account": "atomicassets", // Konto, auf dem der atomicassets-Contract deployed wurde
    "store_transfers": true, // speichert die Transferhistorie  
    "store_logs": true // speichert Datenstrukturprotokolle
  }
}
```

#### atomicmarket
Dieses Lesegerät erfordert ein atomicassets- und ein delphioracle-Lesegerät mit demselben Vertrag wie hier angegeben

```json5
{
  "handler": "atomicmarket",
  "args": {
    "atomicassets_account": "atomicassets", // Konto, auf dem der atomicassets-Contract deployed wurde
    "atomicmarket_account": "atomicmarket", // Konto, in dem der atomicmarket-Contract deployed wurde 
    "store_logs": true // Logs von Verkäufen/Auktionen speichern
  }
}
```

#### delphioracle

```json5
{
  "handler": "delphioracle",
  "args": {
    "delphioracle_account": "delphioracle" // Konto, auf dem der delphioracle-Contract deployed wurde
  }
}
```

### Namespace (API endpoints)

Ein Namespace bietet eine API für einen bestimmten Contract oder Anwendungsfall und basiert auf Daten, die ein Leser bereitstellt

#### atomicassets

```json5
{
  "handler": "atomicassets",
  "args": {
    "atomicassets_account": "atomicassets", // Konto, auf dem der atomicassets-Contract deployed wurde
    "connected_reader": "atomic-1" // Leser, mit dem sich die API für Live-Daten verbindet
  }
}
```

#### atomicmarket

```json5
{
  "handler": "atomicmarket",
  "args": {
    "atomicmarket_account": "atomicmarket", // Konto, auf dem der atomicmarket-Contract deployed wurde
    "connected_reader": "atomic-1" // Leser, mit dem sich die API für Live-Daten verbindet
  }
}
```
