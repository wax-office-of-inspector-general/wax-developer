---
title: bp.json erstellen
nav_order: 142
layout: default
parent: WAX Block Producer
lang-ref: Creating a bp.json
lang: de
---

Hinweis: Der aktuelle bp.json-Standard wird in einem GitHub-Repository aktualisiert. In dieser Anleitung wird alles erklärt, was Sie für den Einstieg benötigen. Die neuesten Updates finden Sie im [Repository](https://github.com/eosrio/bp-info-standard)

## Was ist eine bp.json?

Die bp.json enthält die wichtigsten Informationen über den Blockproducer und seine Nodes, wie API-Endpunkte, geografische Lage, Notfallkontakte und mehr. Das standardisierte Format der bp.json macht es für Unternehmen und Privatpersonen einfach, die Nodes und Informationen des Blockproduzenten zu nutzen. Durch diese Methode können Seiten wie bloks.io z.B. das Profilbild für die Gilden erhalten. Hier sind einige Beispiele für eine bp.json für das WAX Mainnet:
- [https://eosnation.io/wax.json](https://eosnation.io/wax.json)
- [https://blacklusion.io/wax.json](https://blacklusion.io/wax.json)
- [https://waxsweden.org/wax.json](https://waxsweden.org/wax.json)

## Erstellen der bp.json

Sie können die [Vorlage bp.json] (https://github.com/eosrio/bp-info-standard/blob/master/bp.json) in den Texteditor Ihrer Wahl kopieren.
Alle Informationen, die Sie ausfüllen müssen, sollten ziemlich einfach sein, aber wir werden trotzdem die wichtigsten abdecken:

### Generelle Informationen:
- **producer_account_name**: <br>
Selbsterklärend. Es ist wichtig zu beachten, dass Sie den Namen verwenden müssen, den Sie auch für die Aktion "regproducer" verwendet haben (oder zu verwenden beabsichtigen). Das bedeutet, dass Ihr offizieller Gildenname von dem Gildennamen abweichen kann, den Sie auf der Chain verwenden.

- **candidate_name**:<br>
Dies ist das Feld, in das Sie den offiziellen Namen Ihrer Gilde eintragen können. Leerzeichen sind erlaubt.

- **github_user**:<br>
Wichtig! Geben Sie hier mindestens ein GitHub-Konto Ihres Teams an. Diese Konten können möglicherweise verwendet werden, um Ihnen Zugang zu privaten Repositories zu geben.

- **chain_resources**:<br>
Sie können hier eine Website aufführen, die Links zu Ihren Chainbezogenen Ressourcen enthält, z.B. Snapshot-Sites oder Backups. Ein Array ist hier nicht erlaubt.

- **other_resources**:<br>
Haben Sie irgendwelche tollen Tools oder Dienstleistungen, die Sie anbieten? Gut, dann können Sie in diesem Abschnitt ein Feld mit allen Links zu den Dienstleistungen auflisten.

- **Social accounts**:<br>
Ich denke, wir müssen hier nicht erklären, wie Sie Ihre Sozialdaten ausfüllen. Es ist jedoch wichtig, dass jemand aus eurer Gilde diese Konten regelmäßig überprüft, denn so kann euch jemand im Notfall kontaktieren.

### Nodes
- **Node location**:<br>
Wie erhält man die Koordinaten der Nodes? Der einfachste Weg ist die Verwendung von [Google Maps] (https://www.google.com/maps). Klicken Sie einfach mit der Maus auf die Karte, wo Sie den Standort der Node haben möchten. Es sollte ein kleines Popup-Fenster erscheinen, das zwei Zahlen enthält. Die erste Zahl ist der Breitengrad und die zweite der Längengrad.
- **Node type**:<br>
Wählen Sie **producer**, wenn Sie eine Producer-Node auflisten möchten. Wählen Sie **seed**, wenn Sie eine p2p-Node auflisten wollen. Wählen Sie **query**, wenn Sie eine API-Node auflisten wollen.

- **Features (nur für query node)**:<br>
Wahrscheinlich hosten Sie nicht nur eine "normale" Chain-Api, sondern auch zusätzliche Dienste wie z. B. Hyperion. Sie können angeben, welche Dienste Sie hosten, indem Sie den Abschnitt "Features" verwenden. Werfen Sie hier einen Blick auf die verfügbaren Features und listen Sie sie entsprechend auf. Ihr typisches Setup mit History v1 & Hyperion & Wallet Api hat die folgenden Features:
```json
["chain-api", "account-query", "history-v1", "hyperion-v2"]
```
Das Hosting einer Atomic Assets API würde die folgenden Merkmale aufweisen:
```json
["atomic-assets-api"]
```


- **Endpoints**:<br>
Selbsterklärend. Denken Sie jedoch daran, dass Sie vielleicht auf mehreren Chains produzieren wollen, daher ist die Wahl von Domains wie "peer.waxproducer.io" nicht geeignet. Verwenden Sie stattdessen eine Domain, die den Namen der Chain enthält. Zum Beispiel: "peer1.wax.waxproducer.io". Um eine Idee zu bekommen, welche Domains zu verwenden sind, schauen Sie sich die Endpunkte auf dem [Validationcore](https://wax.validationcore.io/reports/nodes/seed) oder [Validator](https://validate.eosnation.io/wax/reports/endpoints.html) anderer Blockproducer an.

## bp.json für Mainnet UND Testnet
Da viele Blockproducer auf mehreren Chains aktiv sind (dies ist sogar der Fall, wenn Sie sowohl auf dem Mainnet als auch auf dem Testnet produzieren), heißt die bp.json eigentlich nicht bp.json, sondern hat dem Namen der Chains (unterschiedliche Namen für Testnet und Mainnet). Für das WAX Mainnet wäre dies also "wax.json" und für das Testnet z.B. "wax-testnet.json" oder "waxtest.json".

## Hosten der bp.json
Alles, was noch zu tun ist, ist die bp.json auf Ihrer Website zu hosten. Dabei muss es sich um dieselbe URL handeln, die Sie für die Aktion "regproducer" verwendet haben (oder zu verwenden planen). Also im Grunde nur Ihre Standard-Domain. Bitte verwenden Sie nicht so etwas wie "resources.example.com", sondern bleiben Sie bei z.B. "example.com".

Hosten Sie die bp.json einfach im Stammverzeichnis dieser Domain. Also zum Beispiel "example.com/wax.json".

# bp.json auf die chain pushen

## Warum auf die chain pushen?
Bp.jsons, die auf der Chain veröffentlicht werden, bieten eine Reihe von Vorteilen gegenüber denen, die auf einer Website gehostet werden:

Die bp.json ist auch dann noch verfügbar, wenn die Website vorübergehend offline ist. Dapps können alle producerjsons leicht an einem einzigen Ort finden. Die Signatur vom Konto des Blockproduzenten bietet eine Verifizierung der bp.json und eine Historie mit mehr Einblicken in die Änderungen in einer producerjson wird bereitgestellt.

## 1. Pushen via Cleos
Wenn Sie Cleos auf Ihrem Rechner installiert haben und Sie entweder Ihren active Key oder Ihren Custom Key (mehr dazu später) zu Ihrer Wallet hinzugefügt haben, können Sie den producerjson mit einem einzigen Befehl pushen.

### Variablen:
- **URL** = (optional) Wenn Sie Probleme haben, eine Verbindung zu einer lokalen Node herzustellen oder keine Node lokal gehostet haben, verwenden Sie diese Option mit einem der öffentlich verfügbaren Endpunkte:
z.B. ```-u https://wax.blacklusion.io```
- **OWNER** = Kontoname des Producers:
e.g. ```blacklusionx```
- **FILE** = Dateiname von producerjson
z.B. ```wax.json```
- **KEY** = Der Name, den Sie für die Authentifizierung verwenden möchten:
z.B. ```active``` oder ```producerjson```

```bash
cleos URL push action producerjson set '{"owner":"OWNER", "json": "'printf %q $(cat FILE | tr -d "\r")'"}' -p OWNER@KEY
```

Ersetzen Sie einfach die Variablen durch Ihre Werte.


```bash
cleos -u https://wax.blacklusion.io push action producerjson set '{"owner":"blacklusionx", "json": "'printf %q $(cat wax.json | tr -d "\r")'"}' -p blacklusionx@producerjson
```

## 2. Pushen via bloks.io
Vor allem für Einsteiger ist bloks.io eine gute Option, da es einen benutzerfreundlicheren Weg als ein CLI-Befehl bietet.

### Zum producerjson contract navigieren:
[link](https://wax.bloks.io/account/producerjson?loadContract=true&tab=Actions&account=producerjson&scope=producerjson&limit=100&action=set).
![](/assets/img/wax-bp/bp-json/img01.png){:class="img-responsive"}

### Füllen Sie die Informationen aus und senden Sie sie ab
Wählen Sie "set" und geben Sie Ihre Informationen ein. Als Kontoname verwenden Sie einfach den Kontonamen, mit dem Sie den Producer registriert haben, und für das Feld "json" kopieren Sie einfach den aktuellen Inhalt Ihrer bp.json. Verwenden Sie hier nicht die URL zu Ihrer gehosteten bp.json. Klicken Sie abschließend auf "Submit Transaction" und wählen Sie die Wallet Ihrer Wahl.

![](/assets/img/wax-bp/bp-json/img02.png){:class="img-responsive"}

Wenn Sie alles richtig gemacht haben, wird bloks.io Ihre erfolgreiche Transaktion bestätigen. Sie können sich diese Beispieltransaktion ansehen [here](https://wax.bloks.io/transaction/4bfb8f1219abd7f5e231bf54100c35604c0a655d6ff50925a472afdcf6e4bfe9).

![](/assets/img/wax-bp/bp-json/img03.png){:class="img-responsive"}

## Erweiterte Sicherheit

Für zusätzliche Sicherheit oder wenn Sie die bp.json häufig pushen müssen, empfehlen wir dringend, einen eigenen Schlüssel für das Pushen der bp.json zu verwenden. Dies verhindert, dass der Schlüssel andere Aktionen ausführen kann.

Die folgenden Bilder zeigen Ihnen, welche Informationen Sie ausfüllen müssen, um die producerjson-Berechtigung einzurichten.

![](/assets/img/wax-bp/bp-json/img04.png){:class="img-responsive"}
![](/assets/img/wax-bp/bp-json/img05.png){:class="img-responsive"}

**Wichtig**: Vergessen Sie nicht, Ihre [chains.json] (/de/getting-started/chains-json) zu aktualisieren, damit sie den Namen Ihrer bp.json und die entsprechende chainId enthält.
