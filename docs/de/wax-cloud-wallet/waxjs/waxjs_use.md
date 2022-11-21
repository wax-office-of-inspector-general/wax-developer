---
title: WaxJS benutzen
layout: default
parent: WaxJS Überblick
grand_parent: WAX Cloud Wallet
lang-ref: Use WaxJS
lang: de
---

Die **WaxJS**-Bibliothek stellt vier Hauptkomponenten zur Verfügung:

**wax.userAccount.** WAX Account-Benutzername, der bei einem Aufruf von `wax.login()` zurückgegeben wird.
**wax.pubKeys.** Active and owner Keys eines Benutzers. Verfügbar, sobald ein Benutzer eingeloggt ist oder wenn Sie die Schlüssel im WaxJS-Konstruktor übergeben.
* **wax.api.** Verwenden Sie dies, um Standard-Eosjs-Transaktionen auszuführen.
**wax.rpc.** Verwenden Sie dies, um API-Aufrufe an die WAX Blockchain zu tätigen. Siehe [WAX RPC API](/de/api-reference/) für weitere Informationen.

So verwenden Sie **WaxJS**: 

1. Importieren Sie die Bibliothek. React Anwendungen, die npm oder yarn verwenden, können die Bibliothek über importieren:

    ```js
    import * as waxjs from "@waxio/waxjs/dist";
    ```

    Sie können auch [WaxJS](https://raw.githubusercontent.com/worldwide-asset-exchange/waxjs/develop/dist-web/waxjs.js) von GitHub herunterladen und speichern und die Datei in eine Webseite einbinden:

    ```js
    <script src='waxjs.js'></script>
    ```

2. Es gibt mehrere Möglichkeiten, den WaxJS-Konstruktor zu instanziieren, je nachdem, welche Informationen Sie für Ihre Benutzer haben. Die Konstruktor-Parameter umfassen:

    * Die URL des RPC-Servers, mit dem Sie sich verbinden möchten (erforderlich)
    * Der Name des WAX-Blockchain-Kontos eines Benutzers (optional)
    * Ein Array mit public Keys für ein bestimmtes Konto (optional)
    * Autologin bool-Wert (optional)

    Um WaxJS die entsprechenden Benutzerwerte zuzuweisen, können Sie einfach eine RPC-URL übergeben:

    ```js
    const wax = new waxjs.WaxJS({
      rpcEndpoint: 'https://wax.greymass.com'
    });
    ```

    **Hinweis:** Der Konstruktor für WaxJS wurde mit Version 1.0 geändert. Wenn Sie von einer früheren Version aktualisieren, müssen Sie den Konstruktor ändern.
    {: .label .label-yellow }

    Die Bibliothek kann auch mit dem Benutzerkonto und den public keys instanziiert werden. Wenn Sie diese Informationen haben, können Sie sie an den WaxJS-Konstruktor übergeben.

    ```js
    const wax = new waxjs.WaxJS({
      rpcEndpoint: 'https://wax.greymass.com',
      userAccount: '3m1q4.wam',
      pubKeys: ['EOS6rjGKGYPBmVGsDDFAbM6UT5wQ9szB9m2fEcqHFMMcPge983xz9','EOS7wTCoctybwrQWuE2tWYGwdLEGRXE9rrzALeBLUhWfbHXysFr9W']
    });
    ```
    
    **Tipp:** Wenn Sie diese zusätzlichen Parameter übergeben, müssen Sie die autoLogin-Methode nicht aufrufen.
    {: .label .label-yellow }




3. Bevor Sie mit dem Signieren von Transaktionen aus Ihrer dApp beginnen können, muss ein Benutzer eingeloggt sein. WaxJS enthält eine Funktion "isAutoLoginAvailable", die:

    * Sicher nach WAX Cloud Wallet-Anmeldedaten sucht
    * Überprüft, ob Ihre dApp auf der Whitelist steht

    Wenn beide Bedingungen erfüllt sind, werden der userAccount und die öffentlichen Schlüssel eines Benutzers in Ihrem WaxJS-Objekt gesetzt, und Sie müssen die Funktion `login()` nicht aufrufen. Sie haben dann auch Zugriff auf wax.userAccount und wax.pubKeys.

    ```js
        //if true, popup won't be triggered; user is now logged in
        var isAutoLoginAvailable = await wax.isAutoLoginAvailable();
        var userAccount = wax.userAccount
        var pubKeys = wax.pubKeys
    ```

    Wenn die automatische Anmeldung nicht verfügbar ist, können Sie einfach die Funktion `login()` verwenden, damit sich die Benutzer mit WAX Cloud Wallet anmelden oder registrieren können.

    ```js
    //normal login. Triggers a popup for non-whitelisted dapps
    async function login() {
      try {
         const userAccount = await wax.login();
         const pubKeys = wax.pubKeys;
      } catch (e) {
         
      }
    }
    ```

    Die Funktion `login()` öffnet die WAX Cloud Wallet in einem neuen Browserfenster. Benutzer werden aufgefordert, dass Ihre dApp "Ihren WAX-Kontonamen kennen" möchte. Sobald er auf "Approve" klickt, wird er zurück zu Ihrer dApp weitergeleitet. 

    Eine erfolgreiche Anmeldung gibt den userAccount zurück (z.B. jq3ao.wam), und Sie können auch auf diese Eigenschaft zugreifen, indem Sie `wax.userAccount` aufrufen.

4. Eine Transaktion senden

    Jetzt, da Sie den WAX-Kontonamen eines Benutzers haben, können Sie das Objekt `wax.api` verwenden, um Ihre Transaktion zu erstellen.

    **Hinweis:** Die Methode `wax.api` wird erst dann initialisiert, wenn Sie einen Benutzer anmelden oder die Informationen eines Benutzers im WaxJS-Konstruktor übergeben. 
    {: .label .label-yellow }
    

    ```js
    const result = await wax.api.transact({
      actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
          actor: wax.userAccount,
          permission: 'active',
        }],
        data: {
          from: wax.userAccount,
          to: 'eosio',
          quantity: '0.00000001 WAX',
          memo: '',
        },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 1200,
    });
    ```

    **Tipp:** Die Methode "wax.api" ist eine Instanz des **eosjs**-Objekts und bietet die gleiche Funktionalität. Siehe die [eosjs](https://eosio.github.io/eosjs/latest) Doku für weitere Informationen.
    {: .label .label-yellow }

    Mit der Funktion `wax.api.transact()` wird WAX Cloud Wallet in einem neuen Browserfenster gestartet. Auf diesem Bildschirm können die Benutzer die Transaktionsdetails überprüfen und die Transaktion genehmigen oder ablehnen. Sobald die Nutzer auf "Approve" klicken, wird die Transaktion auf der WAX Blockchain signiert und die Nutzer kehren zu Ihrer dApp zurück.









