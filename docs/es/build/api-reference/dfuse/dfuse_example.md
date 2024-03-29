---
title: Ejemplo de dfuse
order: 121
---

# Ejemplo de dfuse

En este ejemplo, nos registraremos para obtener una cuenta gratuita y obtener el abi de WAX RNG usando dfuse REST.

1. Regístrate para obtener una <a href="https://dfuse.eosnation.io/" target="_blank">cuenta gratuita de dfuse</a>.

2. Haz clic en Crear Nueva Clave.

3. Obtén un JWT de corta duración usando tu clave API.

```
  curl -X POST \
  https://auth.eosnation.io/v1/auth/issue \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
	"api_key": "server_00d11abcd7e68f999d850c8efc6ab99"
}'
```

4. Usa el endpoint `abi` para obtener el endpoint del contrato inteligente WAX RNG. En el Encabezado, establece la Autorización a Bearer y usa tu JWT del paso anterior.

```
    curl -X GET \
      'https://wax.dfuse.eosnation.io/v0/state/abi?account=orng.wax&json=true' \
      -H 'Authorization: Bearer Tu.Token.JWT' \
      -H 'cache-control: no-cache'
```

### Ejemplo de Respuesta

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
                "

name": "requestrand",
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
