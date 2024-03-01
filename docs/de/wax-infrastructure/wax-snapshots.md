---
title: WAX Snapshots benutzen
nav_order: 143
layout: default
parent: WAX Infrastructure/APIs
lang-ref: Using WAX Snapshots
lang: de
---

Sie werden bemerkt haben, dass die Synchronisierung mit einer Blockchain, die bereits seit Millionen von Blöcken läuft, einige Zeit in Anspruch nehmen kann. Glücklicherweise kann die Synchronisierung beschleunigt werden, indem ein gültiger Snapshot der Datenbank des Kettenstatus verwendet wird.

In diesem Artikel erfahren Sie, wie Sie Snapshots verwenden und wie Sie sie selbst erstellen können.

## Wie man WAX-Snapshots verwendet
Ein gültiger Snapshot kann verwendet werden, um einen WAX ```Nodeos```-Prozess beim Start mit einem gewünschten Block zu synchronisieren, indem eine Snapshot-Datei verwendet wird, um eine gültige Chain State Datenbank neu zu erstellen.

Dadurch entfällt die Notwendigkeit, die Chain State Datenbank Block für Block von Block 1 an aufzubauen, was einige Zeit in Anspruch nimmt, um den Headblock einzuholen, der Millionen oder mehr betragen kann.

### Erklärung

Die Chain State Datenbank ```shared_memory.bin``` wird von ```nodeos``` benötigt, um zu laufen. Es handelt sich dabei um eine speicherverknüpfte Datei, die den mit jedem Block verbundenen Zustand enthält, einschließlich Smart Contract Daten, Kontodetails und aufgeschobene Transaktionen.

Es gibt jedoch einen Vorbehalt. Abhängig von der Funktion, die Sie von Ihrer Node erwarten, z.B. als P2P-Seed-Node oder voll funktionsfähiger API-Node, benötigen Sie auch die zugehörige vollständige ```Blocks.log``` von Block #1, um die "vollständige" Chain bereitstellen zu können.

Es sollte auch erwähnt werden, dass die nun veraltete V1 History-Funktionalität in einem Snapshot nicht erhalten bleibt und ein vollständiges Replay benötigt wird.

Es ist möglich, ```nodeos``` ohne ```blocks.log``` mit einer aktuellen Snapshot-Datei laufen zu lassen, aber diese Node würde nicht als "vollständig" angesehen werden und würde typischerweise nur zur Abfrage der aktuellen Chain informationen und für Push-Aktionen verwendet werden.

Idealerweise sollten Snapshots mit einer zugehörigen ```blocks.log``` verwendet werden, die eine höhere Headblock-nummer enthält. Also niedrigerer Block im Snapshot. höherer Block in ```blocks.log```, wenn Sie ```nodeos``` starten.

Übliches Szenario
Der häufigste Anwendungsfall für einen Snapshot ist die Wiederherstellung einer fehlerhaft gestoppten Node, z.B. Stromausfall, kein Speicher mehr, Prozessabbruch usw.

```nodeos``` muss ordnungsgemäß beendet werden, da sonst die Chain State Datenbank beschädigt werden kann und dieser unangenehme Fehler angezeigt wird:

“Database dirty flag set (likely due to unclean shutdown): replay required”

### Auffinden eines Snapshots

Zunächst einmal müssen Sie eine gültige Snapshot-Datei aus einer vertrauenswürdigen Quelle beziehen. Es gibt eine ganze Reihe von WAX-Snapshot-Diensten, die von den WAX-Gilden angeboten werden, darunter auch [EOSphere] (https://snapshots.eosphere.io/), aber nicht alle bieten Testnet-Snapshots an, so dass Sie sich vielleicht ein wenig umsehen müssen.

:::warning
Der [EOS Nation bp.json Validator](https://validate.eosnation.io/wax/reports/resources.html#chain) hat eine sehr praktische Liste von Snapshot-Diensten zusammengestellt, die von den Gilden beworben werden.
:::

![image](https://user-images.githubusercontent.com/12730423/187578145-07ba4f0d-8532-4a46-9e47-83347d5793a9.png)

### Verwendung

Unter Verwendung des Beispiels ```nodeos``` in der [previous](/de/wax-infrastructure/wax-testnet-node) WAX Technical How To, befinden sich alle relevanten Dateien in ```~/waxdata```.

Laden Sie die gewünschte Snapshot-Datei herunter und entpacken Sie sie:

```sh
sudo apt install zstd
cd ~/waxdata/snapshots
wget http://snapshots.eosphere.io/snapshots/wax/snapshot.bin.zst
unzstd snapshot.bin.zst
```

Löschen Sie die vorhandene Chain State Datenbank (falls vorhanden) und die reversiblen Blöcke:

```sh
rm -r ~/waxdata/state
rm -r ~/waxdata/blocks/reversible
```

Starten Sie ```Nodeos``` aus dem heruntergeladenen Snapshot (beachten Sie, dass die genesis.json nicht angegeben ist):

```
nodeos --data-dir ~/waxdata --config-dir ~/waxdata --snapshot ~/waxdata/snapshots/snapshot.bin
```

```nodeos``` wird nun von einem Snapshot starten und versuchen, die aktive Kette mit dem Kopfblock zu synchronisieren, der in der verwendeten Snapshot-Datei erfasst wurde. Die ````blocks.log`` wird ebenfalls von der Blocknummer des Snapshots fortgesetzt, deshalb ist es wichtig, einen niedrigeren Block im Snapshot sicherzustellen. höheren Block in ```blocks.log``, um Lücken zu vermeiden.

### Erzeugen von Snapshots

Die sicherste Art, Snapshots zu verwenden, ist die Erstellung und Verwendung eigener Snapshots. Vielleicht können Sie sogar einen Dienst zum Hosten von Snapshot-Dateien anbieten, den der Rest des WAX-Ökosystems nutzen kann.

```nodoes``` erfordert ein Producer-Api-Plugin, das so konfiguriert ist, dass die Erstellung von Snapshots möglich ist. Fügen Sie das Folgende am Ende Ihrer ```config.ini``` hinzu:

```ini
plugin = eosio::producer_api_plugin
```
:::warning
Das producer_api_plugin öffentlich zugänglich zu machen ist ein Sicherheitsrisiko und kann ausgenutzt werden, die Node, die zur Erstellung eines Snapshots verwendet wird, sollte nicht öffentlich abfragbar sein.
:::

Erzeugen Sie einen Snapshot lokal mit der folgenden Syntax, die Snapshot-Datei wird standardmäßig im Ordner snapshots gespeichert:

```sh
curl -X POST http://127.0.0.1:8888/v1/producer/create_snapshot
```
