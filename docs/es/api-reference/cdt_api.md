---
title: API WAX-CDT
layout: default
nav_order: 25
parent: WAX API Reference
lang: es
lang-ref: WAX-CDT API
---

Todos tus contratos inteligentes (smart contracts) heredan de los archivos API C++ disponibles en el [kit de herramientas para la creación de contratos en WAX (WAX Contract Development Toolkit-CDT)](/es/dapp-development/wax-cdt/). Estos archivos se utilizan para definir las acciones, estructuras y tipos de datos de tu contrato inteligente. 

Esta API puede agruparse en tres módulos principales:

* **Contratos:** Esta es la principal API de contratos C++ utilizada para comunicarse con la blockchain de WAX. Esta biblioteca define acciones, controladores, permisos y más. 
* **Núcleo:** Esta biblioteca maneja los flujos de datos, los tipos de datos **nombre**, los objetos de serialización y muchos otros recursos. 
* **Tipos:** Esta biblioteca define el contrato base, la organización y estructura de datos y mucho más. 

Todas estas librerías se encuentran en la carpeta **wax-cdt/libraries/eosiolib**. La mayor parte de esta funcionalidad está disponible una vez que se incluye **<eosio/eosio.hpp>** en el smart contract. Se recomienda revisar estos archivos para entender cómo se crea un contrato inteligente.

## Sobrecarga y personalización de la API de WAX 

### Nombre del método: verify_rsa_sha256_sig

**Código fuente:** <a href="https://github.com/worldwide-asset-exchange/wax-cdt/blob/master/libraries/eosiolib/core/eosio/crypto.hpp#L283" target="_blank">Repositorio WAX GitHub</a>

**Descripción:** Utiliza el algoritmo RSA 256 para verificar las firmas. Este método es unas 15 veces más rápido que la verificación estándar de WASM, al estar implementado en código nativo. Para más información, consulta el <a href="https://www.emc.com/collateral/white-papers/h11300-pkcs-1v2-2-rsa-cryptography-standard-wp.pdf" target="_blank">Estándar de criptografía RSA</a>.

**Parámetros de entrada:**

| Parámetro | Descripción
| --- | -------------------------- |
| message | Búfer de mensajes a verificar. |
| message_len | Longitud del búfer de mensajes. |
| signature | Firma como cadena hexadecimal. |
| exponent | Exponente de clave pública como cadena hexadecimal. |
| modulus  | Módulo como cadena hexadecimal (no se permiten ceros a la izquierda). |

**Ejemplo de uso:** Este método se utiliza en nuestro servicio WAX RNG para verificar que la firma RSA (valor aleatorio) devuelta por el oráculo WAX RNG es válida.

```
 eosio_assert(verify_rsa_sha256_sig(&signing_value, sizeof(signing_value), 
    random_value, pub_key->exponent, pub_key->modulus),
    "Could not verify signature.");
```


**Valor de retorno:** Booleano. Verdadero, si la verificación tiene éxito, Falso, si no.

## Tipos de datos

Tus contratos inteligentes pueden utilizar los siguientes tipos de datos:

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

Para más información, consulta los <a href="https://eosio.github.io/eosio.cdt/1.6.0/group__types.html" target="_blank">tipos</a> de EOSIO.

## Definiciones de los tipos

El WAX-CDT incluye también un glosario personalizado con las definiciones de los tipos:

* typedef uint64_t account_name;
* typedef uint64_t action_name;
* typedef uint64_t permission_name;
* typedef uint64_t scope_name;
* typedef uint64_t table_name;
* typedef uint32_t time;
* typedef uint16_t weight_type;
* typedef struct checksum256 transaction_id_type;
* typedef struct checksum256 block_id_type;

## Información adicional

Para obtener una lista completa de las funciones disponibles en la API C++ de los contratos inteligentes, haz click en el enlace de esta <a href="https://eosio.github.io/eosio.cdt" target="_blank">API C/C++</a> de EOSIO.