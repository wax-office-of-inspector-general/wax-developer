---
title: Einrichten eines WAX-Testnet-Blockproducer
nav_order: 144
layout: default
parent: WAX Infrastructure/APIs
lang-ref: Set Up a WAX Testnet Block Producer Node
lang: de
---

Die Bereitstellung von API- und Seed-Diensten ist der Schlüssel zur Zugehörigkeit zum WAX-Dienstleister-Ökosystem. Um jedoch für Ihre Bemühungen belohnt zu werden und an der Verwaltung der Chain teilzunehmen, müssen Sie ein **WAX Testnet Block Producer** werden.


Diese Anleitung zeigt Ihnen, wie Sie einen WAX Testnet Block Production Node konfigurieren und Ihr Konto als WAX Testnet Block Producer registrieren.


Dieser Artikel wurde aktualisiert, um den [_Antelope_](https://antelope.io/) _Leap Software-Build-Prozess einzubeziehen.


# So richten Sie einen WAX Testnet Block Producer-Node ein


In diesem Beispiel wird derselbe WAX-Software-Erstellungsprozess für den Block-Producer-Node und den Cleos-Schnittstellenknoten verwendet wie in der Anleitung **Einrichten einer WAX-Testnet-Node**.


Die Block-Producer-Node muss ebenfalls genauso konfiguriert und mit dem WAX Testnet synchronisiert werden wie in der ersten WAX-Anleitung; zusätzliche Konfigurationen werden in diesem Beispiel später vorgenommen.


## Umgebung


Es besteht ein Konsens unter den Blockproduzenten, dass die beste Praxis für jeden Antelope-Produktionseinsatz darin besteht, dass jede Node eine bestimmte Funktion erfüllt. Insbesondere sollte der Block-Producer-Node nicht öffentlich zugänglich sein oder als öffentliche API oder Peer verwendet werden.


**In diesem Beispiel haben wir drei verschiedene Nodes, die bestimmte Funktionen erfüllen:**


**Öffentlicher API- und Peer-Node**

Dies ist die Node, der im ersten WAX-Anleitungsartikel erstellt wurde und für die Bereitstellung öffentlicher API- und Peer-Dienste verwendet wird.

Er muss mit dem aktuellen WAX Testnet Headblock synchronisiert werden.


**Blockproduzenten-Node**

Dies ist die Node, der zum sicheren Signieren von Blöcken im WAX Testnet verwendet wird, und der wichtigste zusätzliche Produktionsknoten in diesem Beispiel.

Er muss mit dem aktuellen WAX Testnet Headblock synchronisiert werden.

Zusätzlich zur Konfiguration der neuesten verfügbaren [Peer-Liste] (https://validate.eosnation.io/waxtest/reports/config.html) von vertrauenswürdigen Gilden, die von EOSNation veröffentlicht wurde, ist es eine gute Idee, ihm zu erlauben, sich mit Ihrem eigenen öffentlichen Peer-Node oder Nur-Blöcke-Node zu verbinden.


**Cleos-Schnittstellennode**

Diese Node ist völlig privat und dient der Interaktion mit dem öffentlichen Testnet-Netzwerk über die Kommandozeile. Ubuntu Terminal / MacOS Terminal / Windows Ubuntu Shell sind großartige, leichtgewichtige Betriebssysteme für den Betrieb dieser privaten Schnittstelle.

Es werden zwei in der WAX-Software enthaltene Anwendungen verwendet:  `cleos` ist die Kommandozeilenschnittstelle für die WAX Software und `keosd` ist im Wesentlichen ein Wallet / Key Manager Service Daemon zum Speichern privater Schlüssel und zum Signieren digitaler Nachrichten. Sie finden die WAX-Software-Binarys hier:  `~/wax-leap/build/programs/`

Da Sie Ihre privaten Schlüssel in `keosd` importieren werden, ist es wichtig, dass diese Node gesichert und als privat behandelt wird.

`cleos` verwendet Ihre in `keosd` importierten Schlüssel als Autorität, um privilegierte Aktionen im Netzwerk über eine API auszuführen, die in `nodeos` läuft

![](https://miro.medium.com/max/700/0*kTx5FtBH8o4Vxshw.png)

Das obige Diagramm zeigt die Beziehung zwischen WAX-Software-Anwendungen.

Es ist anzumerken, dass es einige wenige gemeldete Fälle gab, in denen API-Abfragen/Aktionen nicht wie vorgesehen funktionierten, wenn versucht wurde, ältere Versionen von `_cleos_` und `_keosd_` mit einer aktualisierten Leap 3.x Node zu verwenden. Es wird empfohlen, die 3.x Version von `_cleos_` _und_ `_keosd_` _mit Leap 3.x Nodes zu verwenden._

## Ein Testnet-Konto erhalten
Für einen WAX Testnet Block Producer muss ein Konto erstellt werden, mit dem die Absicht registriert werden kann, ein Producer zu werden, für den Token-Inhaber abstimmen können.

Die Registrierung eines Kontos ist mit Kosten in Form von WAX-Testnet-Tokens verbunden, aber Sie benötigen ein Konto, um Token zu halten. Das wäre problematisch... aber es gibt einen sehr praktischen [WAX Testnet Account Creator and Faucet] (https://waxsweden.org/create-testnet-account/), der von [WAX Sweden] (https://waxsweden.org/) zur Verfügung gestellt wird und mit dem Sie ganz einfach Ihr erstes Konto erstellen und mit WAX Testnet Tokens füllen können.

Führen Sie die folgenden Curl-Requests auf Ihrem on Cleos Node aus, um Ihr Konto zu erstellen und aufzufüllen, natürlich mit dem gewünschten Kontonamen ergänzt:
```
> curl https://faucet.waxsweden.org/create_account?eospherewoot

{"msg": "succeeded", "keys": {"active_key": {"public": "EOS8PSfvq342YTVtogNVskjCttpx1rQX9JT59wQuLt2Nkz16ZmsL4", "private": "5JZsTE4LzwbHKLX25n3D4gSYVtB5AxyDgGGrUPaMWpAmbWveu72"}, "owner_key": {"public": "EOS7gjEzaYfd9FeSU8BzREgrLQz4QwizFfsKDJtgswCwwyhgX6dqa", "private": "5J7zm5kfBkhhuSnzxxxxxxxxxxxxxxxxxxxxxxnmi73eh8ANLzpB"}}, "account": "eospherewoot"}

> curl https://faucet.waxsweden.org/get_token?eospherewoot

{"msg": "succeeded"}
```
Sie erhalten zwei Schlüsselpaare, _active_key_ und _owner_key_ ... Bewahren Sie beide Paare sicher auf, in diesem Beispiel werden wir den _active_key_ verwenden.

## Importieren Sie Ihren Kontoschlüssel in keosd
Nun, da wir einen Account haben, importieren wir ihn in eine "keosd"-Wallet, damit wir ihn mit "Cleos" verwenden können

Erstellen Sie auf Ihrem Cleos-Knoten eine WAX-Testnet-Wallet und importieren Sie Ihren Account-Schlüssel:

```
> cleos wallet create -n waxtestnet --to-console
create wallet: waxtestnet

Speichern Sie das Passwort, um diese Wallet in Zukunft zu entsperren.  

Ohne Passwort können importierte Schlüssel nicht abgerufen werden.
"PW5JoPmniazjAH3RTx4gcR5njKvPP6or8k7VzXu8ffGwwsFxqSGYN"
```

`keosd` wird automatisch gestartet (ggf. müssen Sie sicherstellen, dass es sich im lokalen Pfad befindet) ... die Wallet wird dann erstellt. Dieses Passwort ist für Ihr lokales Wallet namens waxtestnet, bewahren Sie es sicher auf. Standardmäßig werden die Wallets hier gespeichert:  `~/eosio-wallet`

Importieren Sie Ihren aktiven Kontoschlüssel:

```
#Entsperren Sie Ihre Wallet mit dem Passwort von vorher.  
> cleos wallet unlock -n waxtestnet  
password: Unlocked: waxtestnet

#Importieren Sie Ihren active_key : private  
> cleos wallet import -n waxtestnet  
private key: imported private key for: EOS8PSfvq342YTVtogNVskjCttpx1rQX9JT59wQuLt2Nkz16ZmsL4
```

## Konfigurieren Sie den Block-Producer-Node
Wie bereits erwähnt, benötigt der Block Producer Node einige spezifische Konfigurationen, die das Blocksignieren ermöglichen.

Zunächst benötigen wir ein Schlüsselpaar speziell für die Signierung, was mit dem Cleos-Node erreicht werden kann:

```
> cleos create key --to-console  
Private key: 5JVfLEuHuoVkEX6CyScPHNLgxtRdUcdLp3hqzrXC54xVjtESFXX  
Public key: EOS6HWBC39JAXaRo5aG5yAcAjgQYhQ44T5GtcxJVbZFZox6FFa15k
```

Als Nächstes konfigurieren Sie die `config.ini` auf Ihrem Block Producer Node mit den folgenden, für Ihren Einsatz spezifischen Blockproduktionszusätzen:

```
#Block Producer name  
producer-name = eospherewoot

#Schlüsselpaar für die Blocksignatur
signature-provider = EOS6HWBC39JAXaRo5aG5yAcAjgQYhQ44T5GtcxJVbZFZox6FFa15k=KEY:5JVfLEuHuoVkEX6CyScPHNLgxtRdUcdLp3hqzrXC54xVjtESFXX

#Optimiert die Übergabe durch etwas frühere Produktion  
last-block-time-offset-us = -200000

#Verringert die verfügbare CPU-Zeit beim letzten Block für eine bessere Übergabe  
last-block-cpu-effort-percent = 20

#Aktiviert die Blockproduktion auf diesem Knoten  
plugin = eosio::producer_plugin
```

Starten Sie nun `nodeos` auf Ihrer Block Producer Node neu und stellen Sie sicher, dass er den Headblock wieder einholt.

Sie können beide `nodeos`-Nodes überprüfen, indem Sie sie von Ihrem Cleos-Node aus abfragen, um sicherzustellen, dass sie sich in einem guten Zustand und in der richtigen Chain befinden:

```
> cleos -u https://wax-testnet.eosphere.io get info

{  
  "server_version": "b5344cde",  
  "chain_id": "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12",  
  "head_block_num": 111813838,  
  "last_irreversible_block_num": 111813507,  
  "last_irreversible_block_id": "06aa23838410642de5d297e95a410d68ab9076028fa444c464c48172031f364d",  
  "head_block_id": "06aa24cea654e6250d87e41872f6754000c60226e9a490803186497e0ad70609",  
  "head_block_time": "2021-09-16T05:17:33.000",  
  "head_block_producer": "blacklusionx",  
  "virtual_block_cpu_limit": 200000000,  
  "virtual_block_net_limit": 1048576000,  
  "block_cpu_limit": 199900,  
  "block_net_limit": 1048576,  
  "server_version_string": "v2.0.12wax01",  
  "fork_db_head_block_num": 111813838,  
  "fork_db_head_block_id": "06aa24cea654e6250d87e41872f6754000c60226e9a490803186497e0ad70609",  
  "server_full_version_string": "v2.0.12wax01-b5344cde06837726fef9e384fcedc207dcf6b160"  
}
```
## Registrierung Ihres Blockproduzenten-Kontos

Nachdem Sie sich vergewissert haben, dass alles korrekt konfiguriert ist und Ihre Nodes mit dem Netzwerk synchronisiert sind, können Sie Ihre Absicht registrieren, Blöcke zu signieren und Token-Inhabern zu erlauben, für Sie zu stimmen.

Bevor Sie die Aktion `regproducer` ausführen, ist jetzt wahrscheinlich ein guter Zeitpunkt, um Ihre Absicht dem Rest der WAX Testnet Community mitzuteilen.

Es gibt eine [WAX Testnet Telegram Group] (https://t.me/waxtestnet), in der Sie sich mit anderen Blockproduzenten, Service Providern und DApp-Erstellern austauschen können.

In letzter Zeit wurden einige Tests in Bezug auf die optimale Pfadübergabe zwischen Blockproduktionsknoten auf der ganzen Welt durchgeführt. Wenn Sie im Telegramm mitteilen, wo sich Ihr Knoten auf der Welt befindet, wird Ihnen einer der Testnet-BP eine Standortnummer zuweisen, die dem Netzwerk hilft.

Außerdem müssen Sie in die #21 gewählt werden, um Blöcke produzieren zu können. Die Telegram-Gruppe ist der richtige Ort, um diese Stimmen zu erhalten.

![](https://miro.medium.com/max/700/1*laC7JQ7-9kSxeqP9yi9Ffg.png)

Führen Sie die Aktion `regproducer` wie unten angegeben mit Ihren spezifischen Details aus:

```
#Die letzte Zahl ist Ihr zugewiesener Standort.
> cleos -u [https://wax-testnet.eosphere.io](https://wax-testnet.eosphere.io/) system regproducer eospherewoot EOS6HWBC39JAXaRo5aG5yAcAjgQYhQ44T5GtcxJVbZFZox6FFa15k [https://www.eosphere.io](https://www.eosphere.io/) 21
```
Da die Aktion auf der Blockchain-Ebene ausgeführt wird, können Sie Ihre Anfrage auf eine beliebige synchronisierte Testnet-API richten, d.h. Sie müssen diese Aktion nicht auf Ihre eigene Node ausführen.

Wenn Sie in die Top 21 gewählt wurdest, wird deine "Nodeos"-Ausgabe für 12 Blöcke in einer Runde ungefähr so aussehen:
```
info  2021-09-16T05:36:01.541 nodeos    producer_plugin.cpp:377       on_incoming_block    ] Received block e23bca90f0e6bc3d... #111816053 @ 2021-09-16T05:36:01.500 signed by eospherewoot [trxs: 0, lib: 111815725, conf: 0, latency: 41 ms]  
info  2021-09-16T05:36:02.042 nodeos    producer_plugin.cpp:377       on_incoming_block    ] Received block c6d4ac08300ed117... #111816054 @ 2021-09-16T05:36:02.000 signed by eospherewoot [trxs: 0, lib: 111815725, conf: 0, latency: 42 ms]
```

---

Diese **WAX Developer Technical Guides** wurden unter Verwendung von Quellmaterial aus der [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home) erstellt.

Stellen Sie Ihre Fragen im [EOSphere Telegram](https://t.me/eosphere_io)
