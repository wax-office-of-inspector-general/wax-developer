---
title: boost.wax
layout: default
nav_order: 2
parent: WAX Cloud Wallet
lang-ref: boost.wax
lang: es-DE
---

Mit diesem Contract werden andere Contracts registriert, die für ihre WAX Cloud Wallet-Benutzer ein erweitertes CPU- und Net-management einrichten möchten.

Account: [boost.wax](https://waxblock.io/account/boost.wax)


## WAX-Cloud-Wallet-Ressourcenmodell

Das Modell der Ressourcenzuweisung für WAX Cloud Wallet-Konten wurde so konzipiert, dass es auf der Aktivität des Kontos basiert. Anstatt jedem WAX Cloud Wallet-Konto zum Zeitpunkt der Erstellung Ressourcen zuzuweisen, weist das neue Ressourcenmodell jedem Konto die erforderlichen Ressourcen zum Zeitpunkt der Ausführung und Unterzeichnung einer Transaktion zu. Diese Ressourcen werden dann zurückverlangt. Dieses neue Modell ermöglicht es, Ressourcen von Konten zu bündeln, die im Moment weniger aktiv sind, und diese Ressourcen zu nutzen, um die Aktivität aktiver Konten zu steigern. Dieses neue Boost-System ist als abgestuftes Ressourcenpoolsystem konzipiert, bei dem zunächst zwei Ressourcenstufen auf verfügbare Bandbreite geprüft werden, bevor ein Nutzer Ressourcen für den Abschluss einer Transaktion aus seinem eigenen WAXP-Ressourcenanteil bereitstellen muss.

### dApp Boost Resource Pool Tier

WAX Cloud Wallet wird bis zu 5 Sekunden CPU und 5M Worte NET-Bandbreite pro dApp in einem bestimmten Zeitraum von 24 Stunden zuweisen. Dies entspricht etwa 10000 Boost-Aktionen pro dApp in diesem Zeitraum, wenn man von durchschnittlichen Aktionsressourcenkosten von 0,5 ms ausgeht. Die Parameter des dApp-Boost-Ressourcenpools können im Laufe der Zeit angepasst werden, wenn mehr Nutzungsdaten verfügbar sind.
   
Darüber hinaus kann jede dApp ihr eigenes WAXP beisteuern, um ihren dApp Boost-Ressourcenpool zu erweitern. Der dApp Smart Contract muss über eine Berechtigung namens paybw verfügen und mit der boost.wax#noop-Aktion verknüpft sein. Außerdem muss er eine 1:1 Autorität mit der account@permission boost.wax@paybw haben. Ein Beispiel hierfür ist die [test.wax@paybw permission](https://waxblock.io/account/test.wax#keys).
   
Wenn die anfängliche dApp Boost-Ressourcenpool-Stufe überschritten wird, signiert die WAX Cloud Wallet für dApps-Benutzer mit dieser Berechtigung, wenn ihrem Vertragskonto ausreichend CPU und NET zugewiesen sind. Jede dApp muss außerdem die Zuweisung ihres dApp boost-Ressourcenpools pro Benutzer über den intelligenten Vertrag boost.wax über [diese Aktion] (https://waxblock.io/account/boost.wax?action=reg#contract-actions) konfigurieren.

Wenn der dApp-Pool über verfügbare Ressourcen verfügt, wird WAX Cloud Wallet die Transaktionen der Nutzer aus diesem dApp-Pool boosten und die Pool-Dosierung entsprechend verringern.
   
Das WAX Cloud Wallet-Team behält sich das Recht vor, den dApp Boost Resource Pool für eine bestimmte dApp zu deaktivieren.

### User Boost Resource Pool Tier

WAX Cloud Wallet weist jedem Nutzer in einem Zeitraum von 24 Stunden bis zu 5 ms CPU- und 5k Wörter NET-Bandbreite zu. Dies entspricht etwa 10 Boost-Aktionen pro Benutzer in diesem Zeitraum, wobei von durchschnittlichen Aktionsressourcenkosten von 0,5 ms ausgegangen wird. Die Parameter des Benutzer-Boost-Ressourcenpools können im Laufe der Zeit angepasst werden, wenn mehr Nutzungsdaten verfügbar sind.

Sowohl dApp Boost Resource Pool Tier als auch User Boost Resource Pool Tier müssen über Ressourcen verfügen, damit eine Aktion durch den neuen WAX Cloud Wallet-Ressourcenmechanismus geboostet werden kann. Wenn entweder der dApp Boost Resource Pool oder der User Boost Resource Pool erschöpft ist, schaltet WAX Cloud Wallet auf die Verwendung von Ressourcen aus den eigenen gestockten Ressourcen der dApp um, und wenn der Benutzer das konfigurierte 24-Stunden-Bandbreitenlimit der dApp überschritten hat, schaltet WCW auf die Verwendung der gestockten Ressourcen des Benutzers um.

![alt text](https://github.com/worldwide-asset-exchange/boost.wax/blob/master/BoostDecisionTree.png?raw=true){:class="img-responsive"}

Dieses Boost-System ermöglicht eine kontrollierte Ressourcendosierung, die sicherstellt, dass jeder Benutzer über die notwendigen Ressourcen verfügt, um an NFT-basierten Aktivitäten wie Pack-Drops, Pack-Öffnung, Crafting, NFT-Kauf und -Verkauf sowie Handel teilnehmen zu können, unabhängig von den aktuellen Ressourcenkosten im Netzwerk.

### RAM Boost

WCW erstellt neue Konten mit dem absoluten Minimum an RAM, um jedes Konto erfolgreich zu erstellen. Damit die Benutzer weiterhin Transaktionen durchführen können, die RAM benötigen, erhöht WCW den RAM für jede Transaktion, die erfolgreich für die Bandbreite unter der von WAX bezahlten Stufe erhöht wird. Gegenwärtig finanziert WAX bis zu 4096 Byte Gesamtspeicher für Konten, einschließlich des für die Kontoerstellung erforderlichen Speichers für jede dieser Transaktionen. Künftig werden RAM-Boosts für die kostenpflichtigen dApp-Tiers zur Verfügung stehen, die von den jeweiligen dApps bezahlt werden, wenn sich eine Transaktion nicht für ein Boosting unter dem WAX paid/user boost tier qualifiziert.

## API

* [reg(name contract, uint64_t cpu_us_per_user, uint64_t net_words_per_user, bool use_allow_list, vector<name> allowed_contracts)](https://waxblock.io/account/boost.wax?action=reg#contract-actions)
   Registrieren Sie Ihren Contract für die Bandbreitenverwaltung.  
   * `contract`: das zu registrierende Vertragskonto. Muss auch das Konto sein, das diese action ausführt.  
   * `cpu_us_per_user`: die Menge an Rechenleistung in Mikrosekunden, die Sie Ihren Benutzern über einen Zeitraum von 24 Stunden zur Verfügung stellen wollen.  
   * `net_words_per_user`: Menge der Netto-Wörter in Mikrosekunden, die Sie Ihren Nutzern über einen Zeitraum von 24 Stunden zur Verfügung stellen.  
   * `use_allow_list`: schaltet die Durchsetzung der Erlaubnisliste ein oder aus.
   * `allowed_contracts`: Vektor der Contractname, die in den zu Ihrem Contract gehörenden Transaktionen enthalten sein dürfen. Muss use_allow_list == true haben, damit diese erzwungen werden. Die Idee ist, Missbrauch durch Dapps zu verhindern, die eine Ihrer contract actions in ihre Transaktionen einschleusen könnten, um Ihre Bandbreitenquote auszunutzen. Durch die Auflistung der Verträge, die Sie in den Transaktionen Ihres Vertrages akzeptieren, werden Sie nur dann mit Ihrer eigenen CPU+Net bezahlen, wenn alle Transaktionsverträge in dieser Liste enthalten sind.  
   
Hinweis: Ihr Contract muss eine Berechtigung namens **paybw** haben, und er muss mit der Aktion **boost.wax**#**noop** verknüpft sein. Außerdem muss er eine 1:1-Berechtigung haben, die die account@Permission `boost.wax@paybw` verwendet. Ein Beispiel hierfür ist die [test.wax@paybw-Permission] (https://waxblock.io/account/test.wax#keys). Wenn das freie Kontingent überschritten ist, wird das WAX-Backend mit dieser Berechtigung für Ihre Benutzer unterschreiben, wenn Sie Ihrem Vertragskonto ausreichend CPU und Net zugewiesen haben.
   
**[dereg(name contract)](https://waxblock.io/account/boost.wax?action=dereg#contract-actions)**: 
   Deregistriert Ihren Contract von der Bandbreitenverwaltung.  
   
* **[noop()](https://waxblock.io/account/boost.wax?action=noop#contract-actions)**: 
   No-op-Aktion, die in WAX Cloud Wallet-Transaktionen eingefügt wird, die die Kriterien der Bandbreitenverwaltung erfüllen.  

* **boost(name from, name to, asset cpu, asset net)**: *Veralted*
* **updateboost(name from, name to, asset cpu_to, asset net_to)**: *Veralted*
* **unboost(name from, name to)**: *Veralted*
* **boosterdel (name booster)**: *Veralted*
