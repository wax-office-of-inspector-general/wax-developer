---
title: Vollständige/Partielle History nodes mit Hyperion
nav_order: 141
layout: default
parent: WAX Infrastructure/APIs
lang-ref: Full/Partial History nodes using Hyperion
lang: es-DE
---

Ein stabiler Zugang zu deserialisierten Daten ist für Web3-Anwendungen auf einer Blockchain unerlässlich. Es gibt viele Anwendungsfälle für historische Daten wie Buchhaltung, Steuern, Transaktionsverfolgung, Portfolioverwaltung usw.

Es gibt aktuell mehrere Lösungen für "History Daten", die unterschiedliche Merkmale und Funktionen bieten und alle unterschiedliche Anforderungen an die Infrastruktur haben. Der folgende Leitfaden beschreibt die Schritte, die für die Einrichtung einer skalierbaren und stabilen Hyperion-basierten Historienlösung erforderlich sind.

### Vorraussetzungen:

- **API node Hardware(minimum specs):** Multi-threaded CPU mit mindestens 4gHZ CPU Taktfrequenz, 64GB RAM, 14TB SSD(Der benötigte Speicherplatz steigt derzeit um 25-30 GB/Tag, also planen Sie entsprechend) -  Für ElasticSearch [Ein multi-node ES clusters wird für verbesserte Performance empfohlen]
- **Volle State-History node Hardware(empfohlene specs):** i9 CPU, 128GB RAM, 6TB NVME SSD [Für eine partielle State-History können Sie niedrigere Specs verwenden oder sie auf demselben Server wie Hyperion laufen lassen. Diese kann auch von einem Snapshot gestartet werden]
- **Hyperion version:** v3.3.5 or höher
- **Dependencies:** Elasticsearch 7.17.X, RabbitMQ, Redis, Node.js v16, PM2
- **Betriebssystem:** Ubuntu20.04 (empfohlen)

#### Bare-Metal Infra provider:

- [Hetzner](https://www.hetzner.com/de/dedicated-rootserver?country=de "Hetzner")
- [Leaseweb](https://www.leaseweb.com/de/dedizierte-server#DE "Leaseweb")
- [OVH](https://www.ovhcloud.com/de/bare-metal/ "OVH")

### Setup and Installation:

Nachdem Sie die Server sicher aufgesetzt und die Boot-Konfiguration sowie die entsprechenden RAID-Modi eingerichtet haben, können Sie sich auf dem Server anmelden und die folgenden Befehle ausführen:

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
zfs set atime=off zfast
zfs set compression=lz4 zfast [-->not really needed as ES already compresses the data]
zfs create -o mountpoint=/home zfast/home [-->Creates mountpoint]
```

------------

Nachdem wir nun den Server und den Festplattenspeicher optimal eingerichtet haben, lassen Sie uns mit den nächsten Schritten fortfahren, um die Hyperion-bezogenen Anwendungen einzurichten.

https://hyperion.docs.eosrio.io/manual_installation/

##### 6. Elasticsearch v7.17.X Setup & Installation:

Die folgenden Schritte beziehen sich auf ein ES-Cluster mit einer Node, es wird jedoch empfohlen, aus Gründen der Skalierbarkeit und Ausfallsicherheit einen ES-Cluster mit mehreren Nodes einzurichten. Richten Sie einen ES-Cluster mit mindestens 3 Nodes ein, damit ES-Shards verteilt werden können und Replikas erstellt werden. Verwenden Sie außerdem die Cross-Cluster-Replikation in verschiedenen Rechenzentren für geografische Ausfallsicherheit.

Für die Einrichtung von ES-Clustern mit mehreren Nodes, siehe:

https://www.elastic.co/guide/en/elasticsearch/reference/7.17/scalability.html
https://www.elastic.co/guide/en/elasticsearch/reference/current/add-elasticsearch-nodes.html

**ES Installation mit Apt packages:**

```
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
sudo apt-get install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-7.x.list
sudo apt-get update && sudo apt-get install elasticsearch
```
Lassen Sie uns nun neue Verzeichnisse auf dem ZFS-Speicherpool erstellen, damit die ES-Daten und -Protokolle dort anstelle der Standardverzeichnisse gespeichert werden können:
```
cd /home
mkdir es-data
mkdir es-logs
chown -R elasticsearch:elasticsearch es-data/
chown -R elasticsearch:elasticsearch es-logs/
```
Nachdem wir die Verzeichnisse erstellt und die Ordnerrechte festgelegt haben, bearbeiten wir die ES-Konfiguration, indem wir die folgende Datei bearbeiten:
```
vim /etc/elasticsearch/elasticsearch.yml
```

###### Ersetzen Sie die folgenden Abschnitte in der ES-Konfigurationsdatei

```
# ---------------------------------- Cluster -----------------------------------
cluster.name: hyp-cluster
bootstrap.memory_lock: true
# ----------------------------------- Paths ------------------------------------
path.data: /home/es-data
# Path to log files:
path.logs: /home/es-logs
```
###### Konfiguration der Heap-Größe

Um die Heap-Größe zu optimieren, prüfen Sie, wie viel RAM von der JVM auf Ihrem System zugewiesen werden kann. Führen Sie den folgenden Befehl aus:
```
java -Xms16g -Xmx16g -XX:+UseCompressedOops -XX:+PrintFlagsFinal Oops | grep Oops
```
Prüfen Sie, ob UseCompressedOops in den Ergebnissen true ist, und ändern Sie -Xms und -Xmx auf den gewünschten Wert.

**Hinweis:** Elasticsearch enthält eine gebündelte Version von OpenJDK von den JDK-Maintainern. Sie finden sie unter /usr/share/elasticsearch/jdk

Danach ändern Sie die Heap-Größe, indem Sie die folgenden Zeilen in

`vim /etc/elasticsearch/jvm.options` anpassen:

```
-Xms25g
-Xmx25g
```
**Hinweis:** Xms und Xmx müssen den gleichen Wert haben.
**Warnung:** Vermeiden Sie es, mehr als 31 GB zuzuweisen, wenn Sie die Heap-Größe festlegen, selbst wenn Sie genügend RAM haben.

###### Memory Lock erlauben

Überschreiben Sie die systemd-Konfiguration, indem Sie `sudo systemctl edit elasticsearch` ausführen und die folgenden Zeilen hinzufügen:
```
[Service]
LimitMEMLOCK=infinity
```
Führen Sie den folgenden Befehl aus, um Einheiten neu zu laden:
```
sudo systemctl daemon-reload
```
###### Elasticsearch starten
Starten Sie Elasticsearch und prüfen Sie die Protokolle:
```
sudo systemctl start elasticsearch.service
sudo less /home/es-logs/hyp-cluster.log
```
Aktivieren Sie, dass es beim Start ausgeführt wird:
```
sudo systemctl enable elasticsearch.service
```
Testen der REST API
```
curl -X GET "localhost:9200/?pretty" [Test if everything looks good]
```

###### Minimale Sicherheit einrichten
Die Sicherheitsfunktionen von Elasticsearch sind standardmäßig deaktiviert. Um Sicherheitsprobleme zu vermeiden, empfehlen wir, das Sicherheitspaket zu aktivieren.

Fügen Sie dazu die folgende Zeile am Ende der Datei hinzu: `vim /etc/elasticsearch/elasticsearch.yml`

```
xpack.security.enabled: true
```
Starten Sie Elasticsearch neu und setzen Sie die Passwörter für das Cluster:
```
sudo systemctl restart elasticsearch.service
sudo /usr/share/elasticsearch/bin/elasticsearch-setup-passwords auto
```
Bewahren Sie die Passwörter an einem sicheren Ort auf, sie werden für zukünftige Zwecke benötigt.

Jetzt können Sie die REST-API mit Benutzernamen und Passwort testen:
```
curl -X GET "http://localhost:9200/?pretty" -u elastic:<password>
```

##### 7. Kibana Installation mit Apt packages:

```
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
sudo apt-get install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-7.x.list
sudo apt-get update && sudo apt-get install kibana
```
###### Konfiguration:

Bearbeiten wir nun die `vim /etc/kibana/kibana.yml`

Aktualisieren Sie die Host-Adresse auf 0.0.0.0, falls dies für den Zugriff über die IP im öffentlichen Netz erforderlich ist. Standardmäßig ist sie auf localhost eingestellt.

Wenn Sie das Sicherheitspaket auf Elasticsearch aktiviert haben, müssen Sie das Passwort auf Kibana einrichten:
```
elasticsearch.username: "kibana_system"
elasticsearch.password: "password"
```
###### Kibana starten
Kibana starten und die logs überprüfen
```
sudo systemctl start kibana.service
sudo less /var/log/kibana/kibana.log
```
Bei Systemstart automatisch ausführen
```
sudo systemctl enable kibana.service
```

##### 8. Node JS installation:
```
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
node  -v
```
##### 9.Redis installation
```
sudo add-apt-repository ppa:redislabs/redis
sudo apt-get -y update
sudo apt-get -y install redis
redis-server -v
```
###### Redis Supervision ändern
Ändern Sie die `supervised` Konfiguration von `supervised no` auf `supervised systemd` in `/etc/redis/redis.conf`

###### Redis neustarten
```
sudo systemctl restart redis-server
sudo systemctl enable --now redis-server
sudo systemctl status redis-server
sudo systemctl status redis-server
sudo systemctl unmask  redis-server.service
sudo systemctl restart redis-server
sudo systemctl status redis-server
```
##### 10. Pm2 installieren
```
npm install pm2@latest -g
pm2 startup
```

##### 11. RabbitMq installieren

Kopieren Sie das Shell-Skript von hier und führen Sie es auf dem Server aus: https://www.rabbitmq.com/install-debian.html#installation-methods
```
cd builds
vim rabbit_install.sh
```
Nachdem Sie das Skript kopiert haben, können Sie es nun ausführen:
```
bash rabbit_install.sh
```
Lassen Sie uns Verzeichnisse in unserem ZFS Storage Pool für RabbitMq erstellen:
```
cd /home
mkdir rabbitmq
chown -R rabbitmq:rabbitmq rabbitmq/
```

Fügen Sie eine env-Datei in `/etc/rabbitmq` hinzu, damit wir die Standardverzeichnisse laden können:
```
cd /etc/rabbitmq
vim rabbitmq-env.conf
```
Fügen Sie die folgenden Zeilen in die Konfigurationsdatei ein:
```
RABBITMQ_MNESIA_BASE=/home/rabbitmq
RABBITMQ_LOG_BASE=/home/rabbitmq/log
```
Starten Sie den Rabbit-Server nach dem Aktualisieren der Konfiguration neu:
```
service rabbitmq-server restart
```
```
sudo rabbitmq-plugins enable rabbitmq_management
sudo rabbitmqctl add_vhost hyperion
sudo rabbitmqctl add_user hyper << password >>
sudo rabbitmqctl set_user_tags hyper administrator
sudo rabbitmqctl set_permissions -p hyperion hyper ".*" ".*" ".*"
sudo rabbitmqctl add_vhost /hyperion
sudo rabbitmqctl set_permissions -p /hyperion hyper ".*" ".*" ".*"
```

------------
##### 12. Hyperion aufsetzen und installieren

Nachdem wir nun die Einrichtung der Dependencies abgeschlossen haben, können wir mit der eigentlichen Installation der Hyperion-Software fortfahren.

Wir haben jetzt zwei Möglichkeiten:
1. Alles von Grund auf zu installieren und zu synchronisieren
2. ES-Snapshots verwenden, um die Daten zu synchronisieren und dann die Hyperion-Instanz zu starten.

Hinweis: Wenn Sie ES-Snapshots von einem Snapshot-Dienstanbieter verwenden, gehen Sie in den Kibana-Entwicklungsmodus und geben Sie die folgenden Befehle ein:

```
PUT _snapshot/eosphere-repo
{
   "type": "url",
   "settings": {
       "url": "https://store1.eosphere.io/wax/hyperion/snapshot/"
   }
}


POST _snapshot/eosphere-repo/wax_snapshot_2022.02.01/_restore
{
  "indices": "*,-.*"
}
```
###### Setup:

Klonen Sie die aktuelle Codebasis und installieren Sie Hyperion:

```
git clone https://github.com/eosrio/hyperion-history-api.git
cd hyperion-history-api
npm install
```
Nach der Installation müssen wir nun die Verbindungen und die Konfiguration der Chain einrichten.

1. Folgen Sie der Anleitung [hier] (https://hyperion.docs.eosrio.io/connections/ "hier"), um die Datei connections.json einzurichten. oder finden Sie das Beispiel unten:
```
{
  "amqp": {
    "host": "127.0.0.1:5672",
    "api": "127.0.0.1:15672",
    "protocol": "http",
    "user": "hyper",
    "pass": "<Enter your RMQ password>",
    "vhost": "hyperion",
    "frameMax": "0x10000"
  },
  "elasticsearch": {
    "protocol": "http",
    "host": "127.0.0.1:9200",
    "ingest_nodes": [
      "127.0.0.1:9200"
    ],
    "user": "elastic",
    "pass": "<Enter the elastic user password from step 6>"
  },
  "redis": {
    "host": "127.0.0.1",
    "port": "6379"
  },
  "chains": {
    "wax": {
      "name": "Wax",
      "ship": "ws://<Enter your Ship node endpoint here>:8080",
      "http": "http://<Enter your API node endpoint here>:8888",
      "chain_id": "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4",
      "WS_ROUTER_HOST": "127.0.0.1",
      "WS_ROUTER_PORT": 7001
    }
  }
}
```
2. Folgen Sie der Anleitung [hier]https://hyperion.docs.eosrio.io/chain/ "hier") zur Einrichtung der Datei wax.config.json

###### Hyperion betreiben:

Hyperion besteht aus zwei Teilen: dem Indexer und der API.

Wenn Sie mit dem Indexer beginnen, ist der erste Schritt, ihn im ABI-Scan-Modus laufen zu lassen. Sobald der ABI-Scan abgeschlossen ist, können Sie ihn wieder ohne ihn starten. Der Hyperion Indexer ist standardmäßig so konfiguriert, dass er einen ABI-Scan durchführt ("abi_scan_mode": true).

Sie können die folgenden Befehle verwenden, um den Indexer zu starten und zu stoppen.
```
./start.sh wax-indexer
./stop.sh wax-indexer
```
Sobald der Indexer synchronisiert ist, können Sie ihn mit dem Live-Modus starten und dann die API starten.

Um die API zu starten, können Sie die folgenden Befehle verwenden:
```
./start.sh wax-api
./stop.sh wax-api
```
**Hinweis:** Wenn Sie weitere Fragen zur Nutzung von Hyperion haben, können Sie diese hier stellen: https://t.me/EOSHyperion

------------

Zum Einrichten der partiellen Historylösung: https://medium.com/waxgalaxy/lightweight-wax-hyperion-api-node-setup-guide-f080a7d4a5b5
