---
title: WAX-CDT API
order: 25
---

# API de WAX-CDT

Todos tus contratos inteligentes heredan de los archivos API de C++ disponibles en la biblioteca del [Kit de Desarrollo de Contratos de WAX (WAX-CDT)](/build/dapp-development/wax-cdt/). Estos archivos se utilizan para definir las acciones, estructuras y tipos de datos de tus contratos inteligentes.

Esta API de contrato inteligente se puede agrupar en tres módulos clave:

* **contracts:** Esta es la principal API de contratos de C++ utilizada para comunicarse con la Blockchain de WAX. Esta biblioteca define acciones, despachadores, permisos y más.
* **core:** Esta biblioteca maneja datastreams, el tipo de datos **name**, objetos de serialización y más.
* **types:** Esta biblioteca define el contrato base, diseños de datos, estructuras de datos y más.

Todas estas bibliotecas se encuentran en la carpeta **wax-cdt/libraries/eosiolib**. La mayoría de esta funcionalidad está disponible una vez que incluyes **<eosio/eosio.hpp>** en tu contrato inteligente. Se recomienda revisar estos archivos para ayudarte a entender cómo se construye un contrato inteligente.

## Sobrecargas y Personalizaciones de la API de WAX

### Nombre del Método: verify_rsa_sha256_sig

**Código Fuente:** <a href="https://github.com/worldwide-asset-exchange/wax-cdt/blob/master/libraries/eosiolib/core/eosio/crypto.hpp#L283" target="_blank">Repositorio de GitHub de WAX</a>

**Descripción:** Verifica una firma usando el algoritmo RSA 256. Implementado en código nativo, este método es aproximadamente 15 veces más rápido que la verificación WASM estándar. Consulta el <a href="https://www.emc.com/collateral/white-papers/h11300-pkcs-1v2-2-rsa-cryptography-standard-wp.pdf" target="_blank">Estándar de Criptografía RSA</a> para más información.

**Parámetros de Entrada:**

| Parámetro | Descripción
| --- | -------------------------- |
| message | Buffer del mensaje a verificar. |
| message_len | Longitud del buffer del mensaje. |
| signature | Firma como cadena hexadecimal. |
| exponent | Exponente de la clave pública como cadena hexadecimal. |
| modulus  | Módulo como cadena hexadecimal (no se permite un cero inicial). |

**Ejemplo de Uso:** Este método se utiliza en nuestro servicio WAX RNG para verificar que la firma RSA (valor aleatorio) devuelta por el oráculo WAX RNG sea válida.

```
 eosio_assert(verify_rsa_sha256_sig(&signing_value, sizeof(signing_value), 
    random_value, pub_key->exponent, pub_key->modulus),
    "No se pudo verificar la firma.");
```

**Valor Devuelto:** Booleano. Verdadero si la verificación tiene éxito, Falso si no.

## Tipos de Datos

Tus contratos inteligentes pueden usar los siguientes tipos de datos:

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

Consulta los <a href="https://eosio.github.io/eosio.cdt/1.6.0/group__types.html" target="_blank">Tipos</a> de EOSIO para más información.

## Definiciones de Tipos

WAX-CDT también incluye una biblioteca personalizada de definiciones de tipos:

* typedef uint64_t account_name;
* typedef uint64_t action_name;
* typedef uint64_t permission_name;
* typedef uint64_t scope_name;
* typedef uint64_t table_name;
* typedef uint32_t time;
* typedef uint16_t weight_type;
* typedef struct checksum256 transaction_id_type;
* typedef struct checksum256 block_id_type;

## Información Adicional

Para obtener una lista completa de las características disponibles desde la API de C++ de contrato inteligente, consulta la <a href="https://eosio.github.io/eosio.cdt" target="_blank">API de C/C++</a> de EOSIO.
