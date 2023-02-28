---
title: WAX Software Dateien und Ordner
nav_order: 149
layout: default
parent: WAX Infrastructure/APIs
lang-ref: Working with WAX Software Files and Folders
lang: de
---

Viele unserer Leitfäden haben sich mit der Konfiguration und Bereitstellung von WAX-Software befasst, aber mir ist aufgefallen, dass ich die Datei- und Ordnerfunktionen vielleicht nicht erklärt habe. Insbesondere einige der Nuancen bei Knotentypen und der Wiederherstellung oder erfolgreichen Synchronisierung mit dem Headblock.

In diesem Leitfaden werden die Funktionen der Dateien und Ordner der WAX-Software, die Nodetypen, die durch die darin enthaltenen Daten bestimmt werden, und die Feinheiten beim erfolgreichen Starten oder Wiederherstellen eines Nodetypen erläutert.

Dieser Artikel wurde aktualisiert, um den [_Antelope_](https://antelope.io/) _Leap-Software-Build-Prozess einzubeziehen.

# Arbeiten mit WAX-Software-Dateien und -Ordnern

Die WAX Software `data-dir` Struktur besteht standardmäßig aus 5 Verzeichnissen:

```
/state  
/blocks   
/state-history   
/snapshots  
/protocol_features
```

und 2 dateien:

```
config.ini  
genesis.json
```

Der Ordner **/state** enthält die Datei `shared_memory.bin`, bei der es sich um die Thin Provisioned WAX Network Memory Mapped File handelt, die auch als Chain State Database bezeichnet wird. Diese Datei wird beim Starten von einem Snapshot wiederhergestellt.

Der Ordner **/blocks** enthält die Datei "blocks.log", eine lokale Kopie aller unveränderlichen Blöcke der auf der Node gespeicherten WAX-Kette. Außerdem enthält er die Datei "blocks.index", einen Index der Datei "blocks.log", der dazu dient, die Position einer bestimmten Blocknummer schnell zu finden.

Die **/state-history** enthält die Dateien `chain_state_history.log`, `chain_state_history.index`, `trace_history.log` und `trace_history.index`. Diese Dateien erfassen historische Daten über den Blockchain-Zustand (in diesem Fall WAX Mainnet) und speichern diese Daten in den Dateien, sodass sie von außen in einem flachen Dateiformat lesbar sind.

Der Ordner **/snapshots** ist der Standardspeicherort, in dem nodeos Snapshot-Dateien speichert.

Der Ordner **/protocol_features** enthält Konfigurationsdateien für Netzwerkfunktionen im .json-Format, die für den Start eines neuen Netzwerks oder für wesentliche Funktionsänderungen an einer bestehenden Chain verwendet werden. Normalerweise wird dieser Ordner nicht von WAX-Gilden im Mainnet verwendet.

Die Datei **config.ini** enthält die Nodeos-Konfiguration, die beim Ausführen der Nodeos-Binärdatei verwendet wird.

Die Datei **genesis.json** enthält die anfänglichen Zustandsparameter, die von jeder neuen Node im WAX-Mainnet benötigt werden.

## NodeTypen

Im Allgemeinen gibt es 3 Nodetypen, die von der WAX-Software bereitgestellt werden **Producer/Query/Seed**:

- Producer: Node mit Signierschlüssel
- Query: Node, der HTTP(S) APIs für die Öffentlichkeit bereitstellt
- Seed: Node, die P2P-Zugang für die Öffentlichkeit bietet

Die Funktionsebenen werden jedoch auch durch die Daten bestimmt, die die Node enthält. Zum Beispiel: Es ist möglich, eine QueryNode zu haben, die keinen vollständigen `blocks.index` für die Suche nach Blocknummern hat, es ist auch möglich, einen Seed-Node zu haben, die nicht alle Blöcke im `blocks.log` hat, und es ist auch möglich, eine State-History-Datenbank zu haben, die nicht aus dem ersten Block des Netzwerks aufgebaut wurde. All diese Beispiele bedeuten, dass jede externe Abfrage oder Verbindung zu diesem partiellen Node nicht die Daten der vollständigen Node / der Blockchain präsentiert bekommt.

In diesem Sinne können Sie je nach Anwendungsfall einen partielle Node wählen, um die von Ihnen benötigte Funktionalität zu erfüllen. Für öffentlich zugängliche Query- und Seed-Node ist es jedoch am wünschenswertesten, die volle Funktionalität sicherzustellen.

Das Konstrukt einer vollständigen Node und einer vollständigen State-History-Node wird im Folgenden erläutert:

**Vollständige Node:**
- Vollständig von Block 1 `blocks.log` (muss von Peers aus Genesis synchronisiert oder von einem anderen Nodes kopiert werden)
- Vollständiger `blocks.index` (wird automatisch aus dem vorhandenen `blocks.log` erstellt)
- Wenn beide oben genannten Komponenten vorhanden sind, können Blöcke nachgeschlagen werden und es wird ein vollständiger Block-Peer-Service von Block 1 angeboten.
- Aktuelle `shared_memory.bin` (wird automatisch bei der Synchronisierung von genesis erstellt, kann von einem anderen Node kopiert oder mit einem [snapshot](https://link.medium.com/YZXqTwk5Gmb) wiederhergestellt werden)
- Es ist wichtig, dass bei der Wiederherstellung von einem [snapshot] (https://link.medium.com/YZXqTwk5Gmb) ein **snap von einer niedrigeren Blocknummer** verwendet wird als in der `blocks.log` verfügbar ist.

**Vollständige State-History Node:**
- Muss die gleichen vollständigen "blocks.log"-, "block.index"- und aktuellen "shared_memory.bin"-Dateien enthalten wie bei einem vollständigen Node.
- Wie die "blocks.log"-Dateien müssen jedoch auch die "state-history"-Dateien **vollständig sein und aus Block 1** erstellt werden.
- Die "/state-history"-Dateien können von einem anderen Node kopiert werden oder müssen entweder durch eine erneute Wiedergabe oder eine erneute Synchronisierung von Block 1 erstellt werden.
- Es ist wichtig, dass bei der Wiederherstellung von einem [Snapshot] (https://link.medium.com/YZXqTwk5Gmb) ein **Snap von einer niedrigeren Blocknummer** verwendet wird, als in der Datei "blocks.log" und in den Dateien "/state-history" verfügbar ist.

**Überprüfen**

Die WAX-Software verfügt über ein großartiges Tool zur Verwaltung der `blocks.log` namens `eosio-blocklog`, das bei der Erstellung dieser Binärdatei erstellt wird.

Gehen Sie wie folgt vor, um die aktuellen `blocks.log`-Blöcke und `blocks.index` auf Aktualität und etwaige Probleme zu überprüfen:

```
> ./eosio-blocklog --blocks-dir /home/eosphere/datavolume/blocks --smoke-test

Smoke-Test von blocks.log und blocks.index im Verzeichnis "/home/eosphere/datavolume/blocks"
info  2022-01-10T04:59:07.720 eosio-blo block_log.cpp:1081            trim_data            ] block log version= 3
info  2022-01-10T04:59:07.724 eosio-blo block_log.cpp:1133            trim_data            ] first block= 1
info  2022-01-10T04:59:07.724 eosio-blo block_log.cpp:1134            trim_data            ] last block= 160670840
blocks.log und blocks.index stimmen bei der Anzahl der Blöcke überein
```

Auch wenn Sie aufgrund eines unsauberen Herunterfahrens der Node eine Beschädigung haben, ist es möglich, das Ende der aktuellen `blocks.log` sauber zu trimmen.

Zum Beispiel können Sie bis zum Block 160670000 wie unten trimmen:

```
./eosio-blocklog --blocks-dir /home/eosphere/datavolume/blocks --trim-blocklog --last 160670000
```

---

Diese **WAX Developer Technical Guides** wurden unter Verwendung von Quellmaterial aus der [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home) erstellt.

Stellen Sie Ihre Fragen im [EOSphere Telegram](https://t.me/eosphere_io)
