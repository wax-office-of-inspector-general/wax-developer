---
title: WAX-CDT API
layout: default
nav_order: 25
parent: WAX API Referenz
lang: es-DE
lang-ref: WAX-CDT API
---

Alle Smart Contracts erben von den C++-API-Dateien, die in der Bibliothek [WAX Contract Development Toolkit (WAX-CDT)](/de/dapp-development/wax-cdt/) verfügbar sind. Diese Dateien werden verwendet, um die Aktionen, Strukturen und Datentypen Ihres Smart Contracts zu definieren. 

Diese Smart-Contract-API kann in drei Hauptmodule unterteilt werden:

* **contracts:** Dies ist die primäre C++-Vertrags-API, die für die Kommunikation mit der WAX-Blockchain verwendet wird. Diese Bibliothek definiert Aktionen, Dispatcher, Berechtigungen und mehr. 
**core:** Diese Bibliothek verwaltet Datenströme, den Datentyp **name**, Serialisierungsobjekte und vieles mehr. 
* **types:** Diese Bibliothek definiert den Basisvertrag, Datenlayouts, Datenstrukturen und mehr. 

Alle diese Bibliotheken befinden sich im Ordner **wax-cdt/libraries/eosiolib**. Die meisten dieser Funktionen sind verfügbar, sobald Sie **<eosio/eosio.hpp>** in Ihren Smart Contract einbinden. Es wird empfohlen, dass Sie sich diese Dateien ansehen, um zu verstehen, wie ein Smart Contract aufgebaut ist.

## WAX API Overloads and Anpassungen 

### Methoden Name: verify_rsa_sha256_sig

**Source Code:** <a href="https://github.com/worldwide-asset-exchange/wax-cdt/blob/master/libraries/eosiolib/core/eosio/crypto.hpp#L283" target="_blank">WAX GitHub Repository</a>

**Beschreibung:** Verifizierung einer Unterschrift mit dem RSA-256-Algorithmus. Diese in nativem Code implementierte Methode ist etwa 15-mal schneller als die standardmäßige WASM-Verifizierung. Siehe <a href="https://www.emc.com/collateral/white-papers/h11300-pkcs-1v2-2-rsa-cryptography-standard-wp.pdf" target="_blank">RSA Cryptography Standard</a> für mehr Informationen.

**Input Parameter:**

| Parameter | Beschreibung
| --- | -------------------------- |
| message | Message buffer der verifiziert werden soll. |
| message_len | Message buffer Länge. |
| signature | Signature als hex string. |
| exponent | Public key Exponent als hex string. |
| modulus  | Modulus als hex string (eine führende Null ist nicht erlaubt). |

**Beispiel Verwendung:** Diese Methode wird in unserem WAX RNG-Dienst verwendet, um zu überprüfen, ob die vom WAX RNG-Orakel zurückgegebene RSA-Signatur (Zufallswert) gültig ist.

```
 eosio_assert(verify_rsa_sha256_sig(&signing_value, sizeof(signing_value), 
    random_value, pub_key->exponent, pub_key->modulus),
    "Could not verify signature.");
```


**Rückgabewert:** Boolean. True, wenn die Überprüfung erfolgreich war, False, wenn nicht.

## Datentypen

Ihre Smart Contracts können die folgenden Datentypen verwenden:

* bool
* string
* int8
* int16
* int32
* int64
* int128
* uint8
* uint16
* uint32
* uint64
* uint128
* varint32
* varuint32
* float32
* float64
* float128
* time_point
* time_point_sec
* block_timestamp_type
* bytes
* checksum160
* checksum256
* checksum512
* name
* public_key
* private_key
* signature
* symbol
* symbol_code
* asset

Siehe EOSIO's <a href="https://eosio.github.io/eosio.cdt/1.6.0/group__types.html" target="_blank">Types</a> für mehr Informationen.

## Typendefinitionen

WAX-CDT enthält auch eine eigene Bibliothek mit Typdefinitionen:

* typedef uint64_t account_name;
* typedef uint64_t action_name;
* typedef uint64_t permission_name;
* typedef uint64_t scope_name;
* typedef uint64_t table_name;
* typedef uint32_t time;
* typedef uint16_t weight_type;
* typedef struct checksum256 transaction_id_type;
* typedef struct checksum256 block_id_type;

## Weitere Informationen

Eine vollständige Liste der Funktionen, die über die C++-API für Smart Contracts verfügbar sind, finden Sie in der <a href="https://eosio.github.io/eosio.cdt" target="_blank">C/C++-API</a> von EOSIO.