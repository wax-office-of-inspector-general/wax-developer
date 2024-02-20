---
title: Prueba Tu Contrato WAX RNG
order: 86
---

# Prueba Tu Contrato WAX RNG

Para probar el contrato inteligente, haremos una llamada a la acción *getrnd* con los siguientes parámetros:

| Parámetro   | Tipo | Ejemplo      | Descripción                                      |
| ----------- | ---- | ------------ | ---------------------------------------------------- |
| customer_id | name | arpegiator21 | Nombre de cuenta del usuario solicitante |

**Nota:** Para ilustrar el caso uso la cuenta *arpegiator21* pero debes usar tu propia cuenta cuya clave ya ha sido importada a la billetera y con la que puedes firmar transacciones.

## Llamada a la acción

Desde la línea de comandos, usa el comando `cleos push action` para llamar a la acción **getrnd**.

```shell
cleos -u [chain-api-url] push action mywaxrngtest getrnd '["arpegiator21"]' -p arpegiator21@action
```

La consola imprime lo siguiente:

```shell
executed transaction: 06847ad5e939849a28f03685a6f959d59fac9ab265b7eeb4453157ab2b0c45a8  104 bytes  310 us
#  mywaxrngtest <= mywaxrngtest::getrnd         {"customer_id":"arpegiator21"}
#      orng.wax <= orng.wax::requestrand        {"assoc_id":"2949917703587584469","signing_value":"2949917703587584469","caller":"mywaxrngtest"}
warning: transaction executed locally, but may not be confirmed by the network yet         ]
```

En la respuesta podemos ver cómo la acción *getrnd* ha realizado una llamada *inline* a la acción *requestrand* del contrato inteligente *orng.wax* con los siguientes parámetros:

| Parámetro   | Tipo |  Descripción                                      |
| ----------- | ---- |  ---------------------------------------------------- |
| assoc_id | uint64_t | 2949917703587584469 | Código de 64 bits que el contrato inteligente ha generado a partir de *transaction_id* y que usamos para identificar la solicitud. |
| signing_value | uint64_t | 2949917703587584469 | Igual que el anterior. Esta vez servirá como semilla para generar el número aleatorio. |
|caller | name | Nombre del contrato inteligente que contiene la función de callback que recibirá la respuesta. |

Aunque hemos tomado muchas precauciones para generar una semilla única (*signing_value*), si aún así fallara, obtendríamos un mensaje de error como este:

```shell
Error 3050003: eosio_assert_message assertion failure
Error Details:
assertion failure with message: Signing value already used
pending console output:
```

## Verificar El Número Aleatorio

La función de callback guarda tu número aleatorio en la tabla **rngcustomers**. Para mostrar los valores de la tabla, usa el comando `cleos get table`.

```shell
cleos -u [chain-api-url] get table mywaxrngtest mywaxrngtest rngcustomers
```

La consola imprime los siguientes resultados JSON, incluyendo el **random_value** devuelto por el servicio WAX RNG y el **finalnumber** derivado del **random_value**:

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
