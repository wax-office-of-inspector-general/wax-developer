---
title: dfuse Example
order: 121
---

In this example, we'll sign up for a free account and get the WAX RNG abi using dfuse REST. 

1. Sign up for a <a href="https://dfuse.eosnation.io/" target="_blank">free dfuse account</a>.

2. Click Create New Key.

3. Get a short-lived JWT using your API key.

```
  curl -X POST \
  https://auth.eosnation.io/v1/auth/issue \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
	"api_key": "server_00d11abcd7e68f999d850c8efc6ab99"
}'
```

4. Use the `abi` endpoint to get the WAX RNG smart contract endpoint. In the Header, set the Authorization to Bearer and use your JWT from the previous step.

```
    curl -X GET \
      'https://wax.dfuse.eosnation.io/v0/state/abi?account=orng.wax&json=true' \
      -H 'Authorization: Bearer Your.JWT.Token' \
      -H 'cache-control: no-cache'
```

### Example Response

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
