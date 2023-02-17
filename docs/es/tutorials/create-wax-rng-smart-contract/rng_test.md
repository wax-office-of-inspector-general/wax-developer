---
title: Testea tu smart contract
layout: default
nav_order: 86
parent: Utilizar WAX RNG desde smart contract
grand_parent: Tutoriales
lang-ref: Test Your WAX RNG Contract
lang: es-ES
---

Para probar el smart contract realizaremos una llamada a la acción *getrnd* con los siguientes parámetros:

| Parametro   | Tipo | Ejemplo      | Descripción                                       |
| ----------- | ---- | ------------ | ---------------------------------------------------- |
| customer_id | name | arpegiator21 | Nombre de cuenta del usuario que realiza la petición |

**Nota:** Para ilustrar el caso utilizo la cuenta *arpegiator21* pero el lector deverá utilizar una cuenta propia cuya clave ya haya sido importada a la wallet y con la que pueda firmar transacciones.

## Llamada a la acción

Desde nuestra consola ejecutamos el comando `cleos push action` para llamar a la acción *getrnd* del smart contract:

```shell
cleos -u [chain-api-url] push action mywaxrngtest getrnd '["arpegiator21"]' -p arpegiator21@action
```

Recibirás una respuesta similar a esta:

```shell
executed transaction: 06847ad5e939849a28f03685a6f959d59fac9ab265b7eeb4453157ab2b0c45a8  104 bytes  310 us
#  mywaxrngtest <= mywaxrngtest::getrnd         {"customer_id":"arpegiator21"}
#      orng.wax <= orng.wax::requestrand        {"assoc_id":"2949917703587584469","signing_value":"2949917703587584469","caller":"mywaxrngtest"}
warning: transaction executed locally, but may not be confirmed by the network yet         ]
```

En la respuesta podemos apreciar cómo la acción *getrnd* ha realizado una llamada *inline* a la acción *requestrand* del smart contract *orng.wax* con los siguientes parámetros:

| Parametro   | Tipo | Contenido      | Descripción                                      |
| ----------- | ---- | ------------ | ---------------------------------------------------- |
| assoc_id | uint64_t | 2949917703587584469 | Código de 64 bits que el smart contract ha generado desde *transaction_id* y que utilizamos para identificar la petición.|
| signing_value | uint64_t | 2949917703587584469 | Igual que el anterior. Esta vez servirá como semilla para generar el número aleatorio |
|caller | name | Nombre del smart contract que contiene la función callback que recibirá la respuesta. |

Si bien hemos tomado muchas precauciones para generar una semilla única (*signing_value*), si aún así fallara obtendríamos un mensaje de error como este:

```shell
Error 3050003: eosio_assert_message assertion failure
Error Details:
assertion failure with message: Signing value already used
pending console output:
```

## Verificar la recepción del número aleatorio

Si todo ha salido correctamente, la función callback habrá recibido el número aleatorio y habrá actualizado la tabla **rngcustomers**. Para poder consultar el contenido de la tabla podemos usar el comando `cleos get table`

```shell
cleos -u [chain-api-url] get table mywaxrngtest mywaxrngtest rngcustomers
```

La consola mostrará un JSON con el contenido de la tabla en la que podremos ver tanto el número aleatorio de 256 bits devuelto por WAX RNG (*random_value*) como el número aleatorio menor de 100 que queríamos obtener

```json
{
  "rows": [{
      "signing_value": "2949917703587584469",
      "customer_id": "arpegiator21",
      "random_value": "b3f4a264cdb0367db071c851b6bbb20b51a391cdb50b314d81f3705c0702c8d4",
      "final_number": 85
    }
  ],
  "more": false,
  "next_key": ""
}
```