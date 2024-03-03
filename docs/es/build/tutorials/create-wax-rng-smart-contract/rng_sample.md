---
title: Construye Tu Contrato para llamar al Contrato WAX RNG
order: 84
---

# Construye Tu Contrato para llamar al Contrato WAX RNG

En este ejemplo, crearemos un contrato inteligente que usa el servicio WAX RNG para generar un número aleatorio no mayor a 100. Este número se escribe en una tabla multi_index, junto con un ID interno del Cliente, el *signing_value* del cliente, y el *checksum256 random_value* devuelto por el oráculo WAX RNG.

Para proporcionar justicia, comprobabilidad y confianza del usuario, se recomienda permitir que el cliente vea o incluso edite el *signing_value* del lado del cliente. Si prefieres generar el *signing_value* en el backend o tu aplicación no requiere un *signing_value* en el frontend, podrías usar el hash de la transacción enviada desde su billetera. Este valor es un hash sha256 firmado por el cliente que debe ser reducido a un dato de 64 bits.

Al reducir el hash de 256 bits a una porción de 64 bits, podríamos encontrar que no es un código único. El número que enviamos como semilla para la generación de números aleatorios debe ser único, es decir, no debe haberse utilizado antes para otra solicitud de número aleatorio. Para esto, podemos consultar el contrato inteligente WAX RNG y verificar si nuestra semilla candidata es única o ya ha sido utilizada.

Para realizar esta verificación, necesitaremos acceder a la tabla _signvals.a_ del contrato inteligente WAX RNG. Para facilitar esto, agregaremos el archivo _wax-orng-interface.hpp_ a nuestro contrato inteligente y lo vincularemos en nuestro archivo de encabezado:

## Crea Tu Contrato

1. Desde la línea de comandos, navega a tu directorio de contratos inteligentes. Para este ejemplo, usaremos **mycontracts**.

2. Usa **eosio-init** con el parámetro `-project` para crear la plantilla de tu contrato inteligente.

   `$ eosio-init -project rngtest`

3. Desde tu carpeta de contratos inteligentes, abre **rngtest/include/rngtest.hpp** y pega lo siguiente:

```cpp
#include <eosio/eosio.hpp>

#include <eosio/crypto.hpp>
#include <eosio/transaction.hpp>

#include <wax-orng-interface.hpp>

#define ORNG_CONTRACT name("orng.wax")

using namespace eosio;
using namespace std;

CONTRACT rngtest : public contract {
   public:
      using contract::contract;

      // acciones disponibles
      ACTION getrnd( name& customer_id );
      ACTION receiverand(uint64_t signing_value, const checksum256& random_value);

      //estructura de la tabla
      TABLE rngcustomers_table{
         uint64_t signing_value;
         name customer_id;
         checksum256 random_value;
		 uint8_t final_number;

         uint64_t primary_key() const { return signing_value; }
      };
      //definir tabla basada en la estructura
      typedef multi_index<"rngcustomers"_n, rngcustomers_table> rngcustomers_index;

      // envolturas de acción
      using getrnd_action = action_wrapper<"getrnd"_n, &rngtest::getrnd>;
      using receiverand_action = action_wrapper<"receiverand"_n, &rngtest::receiverand>;

      // Establecer tabla 'rngcustomers'
      rngcustomers_index _customers = rngcustomers_index(get_self(), get_self().value);
};
```

Trabajaremos con funciones criptográficas y datos checksum256, por lo que incluimos la biblioteca `crypto.hpp`.

Capturaremos el *transaction_id* de la transacción que llama al contrato inteligente, por lo que incluimos la biblioteca `transaction.hpp`.

Como se mencionó anteriormente, para acceder a la tabla de valores utilizados por WAX RNG para generar los números aleatorios, incluimos el archivo de definición `wax-orng-interface.hpp`. Incluimos el código fuente del archivo en `rngtest/include/wax-rng-interface.hpp`.

```cpp
#include <eosio/eosio.hpp>

using namespace eosio;

namespace orng {

    static constexpr name ORNG_CONTRACT = name("orng.wax");

    TABLE signvals_a {
        uint64_t signing_value;

        auto primary_key() const { return signing_value; }
    };
    typedef multi_index <name("signvals.a"), signvals_a> signvals_t;

    signvals_t signvals = signvals_t(ORNG_CONTRACT, ORNG_CONTRACT.value);
}
```

Declaramos `rngcustomers` como una estructura de datos multi-index para almacenar

 temporalmente los datos requeridos para llamar a WAX RNG y para almacenar el número aleatorio devuelto para su uso posterior en la tarea para la que lo hemos solicitado.

Declaramos las acciones que vamos a usar en nuestro ejemplo y que explicaremos más adelante.

4. Comenzamos a editar el código del contrato inteligente en el archivo **src/rngtest.cpp**.

Comenzamos con la inclusión del archivo de encabezado

```cpp
#include <rngtest.hpp>
```
Y agregaremos las siguientes funciones:

4.1 ACCIÓN getrnd

Esta acción captura el *transaction_id* de la transacción que ha llamado al contrato inteligente para generar un número único que servirá como semilla para la llamada a WAX RNG.

Además, almacenará en la tabla `rngcustomers` los datos auxiliares para poder recibir el número aleatorio de WAX RNG y poder reconocerlo entre diferentes solicitudes.

**Parámetros**

| Parámetro    | Tipo | Ejemplo      | Descripción                                       |
| ----------- | ---- | ------------ | ---------------------------------------------------- |
| customer_id | name | arpegiator21 | Nombre del usuario que hace la solicitud|

```cpp
ACTION rngtest::getrnd( name& customer_id ) {
   require_auth(customer_id);

   // Leer transaction_id
   size_t size = transaction_size();
   char buf[size];
   uint32_t read = read_transaction(buf, size);
   check(size == read, "Generación de valor de firma: read_transaction() ha fallado.");
   checksum256 tx_id = eosio::sha256(buf, read);

   // Obtener los primeros 64 bits de transaction_id
   uint64_t signing_value;
   memcpy(&signing_value, tx_id.data(), sizeof(signing_value));

   // Verificar si signing_value es válido...
   auto iSigningValue = orng::signvals.begin();
   uint8_t c = 0;

   mientras (iSigningValue != orng::signvals.end() && c < 64) {
      iSigningValue = orng::signvals.find(signing_value);

      // Si signing_value existe, rotamos 1 bit para modificar el hash. Hay 64 variaciones posibles...
      si(iSigningValue != orng::signvals.end()) {
         signing_value <<= 1;
         c++;
      }
   }

   // Ok, no creo que esto suceda pero... ¿y si sucede?
   check(c < 64, "¿Ninguna combinación fue válida? ¡Inconcebible!");

   // Preparar la tabla donde se recibirá el valor aleatorio.
   _customers.emplace(get_self(), [&](auto& rec) {
      rec.signing_value = signing_value;
      rec.customer_id = customer_id;
   });

   // Llamada al contrato inteligente orng.wax
   action(
      { get_self(), "active"_n },
      "orng.wax"_n,
      "requestrand"_n,
      std::tuple{ signing_value, signing_value, get_self() })
      .send();
}
```

*transaction_id* es un número único pero como tenemos que seleccionar solo una porción de 64 bits es posible que el resultado no sea único. Por esa razón realizamos la verificación contra la tabla `signvals.a` y, si el resultado es un número ya elegido, realizamos una rotación de 1 bit para intentar de nuevo.

Cuando estamos seguros de que hemos encontrado un número único, almacenamos el número, junto con el nombre del usuario, y llamamos a WAX RNG enviándole la semilla (*signing_value*) y el mismo valor como identificador de la llamada. Podríamos usar el propio nombre del usuario como identificador (*customer_id.value*) pero esto complicaría el código en caso de que un usuario solicite varios números aleatorios y sus solicitudes se almacenen simultáneamente en la tabla `rngcustomers` cuya clave primaria es *signing_value*.

4.2. ACCIÓN receiverand

Acción de devolución de llamada que será llamada desde WAX RNG para devolvernos, en caso de éxito, el número aleatorio, junto con el código que proporcionamos como identificador de la solicitud (*signing_value*).

**Parámetros**

| Parámetro      | Tipo        | Descripción                                       |
| -------------- | ----------- | ---------------------------------------------------- |
| signing_value  | uint64_t    | Código enviado como identificador.                                   |
| random_value   | checksum256 | Código hash generado por WAX RNG que utilizaremos para obtener el número aleatorio |

```cpp
ACTION rngtest::receiverand(uint64_t signing_value, const checksum256& random_value) {
   require_auth(ORNG_CONTRACT);

   //convertir

 el random_value a un número más pequeño
   //COMENTARIO: max_value no es el valor máximo. Añadir +1 a num1 podría arreglar esto si quieres un número de 1 a 100.
   uint64_t max_value = 100;
   auto byte_array = random_value.extract_as_byte_array();

   //COMENTARIO: Esta es una mala práctica. VER: sesgo de módulo
   //  el sesgo de módulo muestra que el tamaño de 8 bits para random_int es una mala práctica debido a su tamaño relativo a max_value.
   //  Los primeros (2**8 % max_value) números (0-55) tendrán una probabilidad aumentada en +50% de ser elegidos en este ejemplo.
   uint8_t random_int = 0; 
   random_int = byte_array[0];

   uint8_t num1 = random_chunk % divisor;

   auto iCustomers = _customers.require_find(signing_value, "Error: Petición no encontrada!");

   // actualizar tabla con random_value
   _customers.modify(iCustomers, get_self(), [&](auto& rec) {
      rec.random_value = random_value;
      rec.final_number = num1;
   });
}
```
Nos aseguramos de que solo WAX RNG pueda llamar a esta acción con *require_auth*.

Extraemos los primeros 16 bits del número aleatorio devuelto y lo usamos para obtener un número no mayor a 100. Aunque se podría hacer con solo 1 byte, es preferible aumentar el número de bits del numerador antes de realizar la operación de reducción para evitar lo más posible el efecto del sesgo de módulo.

::: tip 📝 Nota
¡Todavía tenemos muchos bits disponibles en caso de que necesitemos obtener más números aleatorios!
:::

**COMENTARIO:** ¡Usar solo los primeros 8 bits es una mala práctica! Necesitamos más bits para la justicia. VER: Sesgo de módulo.

Localizamos el registro asociado con el identificador de la solicitud y actualizamos su contenido para almacenar el código hash devuelto.

Ahora podemos usar el valor aleatorio del cliente para realizar la función para la que lo solicitamos.

## Compilando el contrato inteligente

1. Desde la consola vamos a la carpeta **rngtest/build** y ejecutamos los siguientes comandos:

```shell
cmake ..
make
```

Encontraremos los archivos **rngtest.wasm** y **rngtest.abi** en la carpeta **rngtest/build/rngtest**.
