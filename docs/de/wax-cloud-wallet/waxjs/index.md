---
title: WaxJS Überblick
layout: default
nav_order: 3
parent: WAX Cloud Wallet
has_children: true
has_toc: true
lang-ref: WaxJS Overview
lang: de
---

**WaxJS** ist eine Javascript-Bibliothek, die sich mit WAX Cloud Wallet verbindet, um Benutzer anzumelden und intelligente Vertragstransaktionen auszuführen, ohne dass eine externe Wallet (z. B. Scatter) erforderlich ist. Ähnlich wie beim standardmäßigen OAuth 2.0-Flow gestatten Benutzer Ihrer dApp einfach, auf ihren WAX Blockchain-Kontonamen zuzugreifen. Sobald Ihre dApp autorisiert wurde, können Benutzer Ihre Smart-Contract-Transaktionen von ihrem WAX Cloud Wallet-Konto genehmigen.

Um zu beginnen, müssen Sie lediglich unsere [WaxJS](https://github.com/worldwide-asset-exchange/waxjs)-Bibliothek einbinden und ein paar einfache Aufrufe von Ihrem Client aus tätigen. Wenn Sie direkt zum Code springen und unser Live-WaxJS-Beispiel ausführen möchten, lesen Sie [WaxJS Demo](/de/wax-cloud-wallet/waxjs/waxjs_demo).
## Wie es funktioniert

**WaxJS** verwendet die WAX ​​Cloud Wallet und die [EOSIO/eosjs](https://github.com/EOSIO/eosjs) Javascript API, um eine benutzerfreundliche Schnittstelle zwischen Ihren Benutzern und der WAX Blockchain bereitzustellen.

Um **WaxJS** zu verwenden, müssen Sie einfach:

1. Fügen Sie Ihrem Client die Bibliothek **WaxJS** hinzu
2. Verwenden Sie „wax.login“, um Benutzer bei WAX Cloud Wallet anzumelden (Auto-Login-Funktionen verfügbar)

![WaxJS-Anmeldung](/assets/img/wax-cloud-wallet/waxjs/waxjs_login.png){:class="img-responsive"}

3. Verwenden Sie `wax.api`, um Ihre Transaktionen an die WAX ​​Blockchain zu senden

![WaxJS-Zeichen](/assets/img/wax-cloud-wallet/waxjs/waxjs_sign.png){:class="img-responsive"}

In den nächsten Abschnitten erfahren Sie, wie Sie **WaxJS** installieren und verwenden.
