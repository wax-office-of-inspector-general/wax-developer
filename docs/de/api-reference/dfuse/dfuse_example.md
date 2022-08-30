---
title: dfuse Beispiel
layout: default
nav_order: 121
parent: dfuse für WAX dApps
grand_parent: WAX API Referenz
lang-ref: dfuse Example
lang: de
---

In diesem Beispiel melden wir uns für ein kostenloses Konto an und erhalten das WAX RNG abi über dfuse REST. 

1. Einen <a href="https://dfuse.eosnation.io/" target="_blank">kostenlosen dfuse account</a> erstellen.

2. "Create New Key" klicken.

3. Einen kurzlebiges JWT Token anfordern

    ```
    curl -X POST \
  https://auth.eosnation.io/v1/auth/issue \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
	"api_key": "server_00d11abcd7e68f999d850c8efc6ab99"
}'
```

4. Verwenden Sie den Endpunkt "abi", um den WAX RNG Smart Contract Endpunkt zu erhalten. Setzen Sie im Header die Autorisierung auf Bearer und verwenden Sie Ihr JWT aus dem vorherigen Schritt.

    ```
    curl -X GET \
      'https://wax.dfuse.eosnation.io/v0/state/abi?account=orng.wax&json=true' \
      -H 'Authorization: Bearer Your.JWT.Token' \
      -H 'cache-control: no-cache'
    ```

### Beispiel Antwort

    ```json
    {
    "block_num": 9135393,
    "account": "orng.wax",
    "abi": {
        "version": "eosio::abi/1.1",
        "structs": [
            {
                "name": "config_a",
                "base": "",
                "fields": [
                    {
                        "name": "name",
                        "type": "uint64"
                    },
                    {
                        "name": "value",
                        "type": "int64"
                    }
                ]
            },
            {
                "name": "jobs_a",
                "base": "",
                "fields": [
                    {
                        "name": "id",
                        "type": "uint64"
                    },
                    {
                        "name": "assoc_id",
                        "type": "uint64"
                    },
                    {
                        "name": "signing_value",
                        "type": "uint64"
                    },
                    {
                        "name": "caller",
                        "type": "name"
                    }
                ]
            },
            {
                "name": "killjobs",
                "base": "",
                "fields": [
                    {
                        "name": "job_ids",
                        "type": "uint64[]"
                    }
                ]
            },
            {
                "name": "pause",
                "base": "",
                "fields": [
                    {
                        "name": "paused",
                        "type": "bool"
                    }
                ]
            },
            {
                "name": "requestrand",
                "base": "",
                "fields": [
                    {
                        "name": "assoc_id",
                        "type": "uint64"
                    },
                    {
                        "name": "signing_value",
                        "type": "uint64"
                    },
                    {
                        "name": "caller",
                        "type": "name"
                    }
                ]
            },
            {
                "name": "setrand",
                "base": "",
                "fields": [
                    {
                        "name": "job_id",
                        "type": "uint64"
                    },
                    {
                        "name": "random_value",
                        "type": "string"
                    }
                ]
            },
            {
                "name": "setsigpubkey",
                "base": "",
                "fields": [
                    {
                        "name": "exponent",
                        "type": "string"
                    },
                    {
                        "name": "modulus",
                        "type": "string"
                    }
                ]
            },
            {
                "name": "signvals_a",
                "base": "",
                "fields": [
                    {
                        "name": "signing_value",
                        "type": "uint64"
                    }
                ]
            },
            {
                "name": "sigpubkey_a",
                "base": "",
                "fields": [
                    {
                        "name": "id",
                        "type": "uint64"
                    },
                    {
                        "name": "exponent",
                        "type": "string"
                    },
                    {
                        "name": "modulus",
                        "type": "string"
                    }
                ]
            },
            {
                "name": "version",
                "base": ""
            }
        ],
        "actions": [
            {
                "name": "killjobs",
                "type": "killjobs",
                "ricardian_contract": ""
            },
            {
                "name": "pause",
                "type": "pause",
                "ricardian_contract": ""
            },
            {
                "name": "requestrand",
                "type": "requestrand",
                "ricardian_contract": ""
            },
            {
                "name": "setrand",
                "type": "setrand",
                "ricardian_contract": ""
            },
            {
                "name": "setsigpubkey",
                "type": "setsigpubkey",
                "ricardian_contract": ""
            },
            {
                "name": "version",
                "type": "version",
                "ricardian_contract": ""
            }
        ],
        "tables": [
            {
                "name": "config.a",
                "index_type": "i64",
                "type": "config_a"
            },
            {
                "name": "jobs.a",
                "index_type": "i64",
                "type": "jobs_a"
            },
            {
                "name": "signvals.a",
                "index_type": "i64",
                "type": "signvals_a"
            },
            {
                "name": "sigpubkey.a",
                "index_type": "i64",
                "type": "sigpubkey_a"
            }
        ]
    }
}
```
