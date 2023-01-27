---
title: Desarrollo de un smart contract para llamadas a WAX RNG
layout: default
nav_order: 84
parent: Utilizar WAX RNG desde smart contract
grand_parent: Tutoriales
lang-ref: Build Your Contract to call WAX RNG contract
lang: es
---

En este ejemplo, crearemos un smart contract que utiliza el servicio WAX RNG para generar un número aleatorio no mayor que 100. Este número se escribe en una tabla multi_index, junto con un ID de cliente interno, el *singning_value* del cliente y el checksum256 *random_value* devuelto por el oráculo WAX RNG.

Para garantizar la imparcialidad, la comprobabilidad y la confianza del usuario, se recomienda permitir que el cliente vea o incluso edite el valor de firma del lado del cliente. Si prefieres generar el signing_value en el back-end o tu aplicación no requiere un signing_value en el front-end, puedes utilizar el hash de la transacción del usuario enviado desde su monedero. Este valor es un hash sha256 firmado por el cliente que deberá ser reducido a un dato de 64 bits.

Al reducir el hash de 256 bits a una porción de 64 bits nos podemos encontrar con que no sea un código único. El número que enviamos como semilla para la generación del número aleatorio debe de ser único, esto es, no debe de haber sido utilizado anteriormente para otra solicitud de números aleatorios. Para esto podemos realizar una consulta al smart contract WAX RNG y comprobar si nuestra semilla candidata es única o ya ha sido utilizada.

Para realizar esta comprobación necesitaremos acceder a la tabla _signvals.a_ del smart contract WAX RNG. Para facilitarlo añadiremos a nuestro smart contract el archivo _wax-orng-interface.hpp_ y lo enlazaremos en nuestro archivo cabecera.

## Crear el smart contract

1. En la consola nos desplazamos a la carpeta donde desarrollamos nuestros smart contracts. Por ejemplo _mycontracts_

2. Usamos el comando **eosio-init** con el parámetro `-project` para crear la plantilla del smart contract.

   `$ eosio-init -project rngtest`

3. Con nuestro editor de código abrimos el archivo recién creado **rngtest/include/rngtest.hpp** e incluímos lo siguiente:

```c++
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

      // actions available
      ACTION getrnd( name& customer_id );
      ACTION receiverand(uint64_t signing_value, const checksum256& random_value);

      //table structure
      TABLE rngcustomers_table{
         uint64_t signing_value;
         name customer_id;
         checksum256 random_value;
         uint8_t final_number;

         uint64_t primary_key() const { return signing_value; }
      };
      //define table based on table structure
      typedef multi_index<"rngcustomers"_n, rngcustomers_table> rngcustomers_index;

      // action wrappers
      using getrnd_action = action_wrapper<"getrnd"_n, &rngtest::getrnd>;
      using receiverand_action = action_wrapper<"receiverand"_n, &rngtest::receiverand>;

      // Set table 'rngcustomers'
      rngcustomers_index _customers = rngcustomers_index(get_self(), get_self().value);
};
```

Trabajaremos con funciones criptográficas y datos checksum256, por lo que incluímos la librería `crypto.hpp`

Capturaremos *transaction_id* de la transacción de llamada al smart contract, por lo que incluímos la librería `transaction.hpp`

Como ya hemos comentado, para acceder a la tabla de valores utilizados por WAX RNG para generar los números aleatorios, incluiremos el archivo de definición `wax-orng-interface.hpp`. Incluímos el código fuente del archivo en `rngtest/include/wax-rng-interface.hpp`

```c++
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

Declaramos `rngcustomers` como estructura de datos de tipo multi-index para almacenar de forma temporal los datos requeridos para realizar la llamada a WAX RNG y para almacenar el número aleatorio devuelto para su posterior uso en aquella tarea para la cual lo hemos solicitado.

Declaramos las acciones que vamos a emplear en nuestro ejemplo y que explicaremos más adelante.

4. Comenzamos a editar el código del smart contract en el archivo **src/rngtest.cpp**

Comenzamos con la inclusión del archivo cabecera

```c++
#include <rngtest.hpp>
```
Y agregaremos las siguientes funciones:

4.1. ACTION getrnd

Esta acción captura *transaction_id* de la transacción que ha llamado al smart contract para generar un número único que servirá como semilla para la llamada a WAX RNG.

Además, guardará en la tabla `rngcustomers` los datos auxiliares para poder recibir el número aleatorio desde WAX RNG y poder reconocerlo entre diferentes peticiones.

**Parámetros**

| Parámetro   | Tipo | Ejemplo      | Descripción                                          |
| ----------- | ---- | ------------ | ---------------------------------------------------- |
| customer_id | name | arpegiator21 | Nombre de la cuenta que solicita el número aleatorio |

```c++
ACTION rngtest::getrnd( name& customer_id ) {
   require_auth(customer_id);

   // Read transaction_id
   size_t size = transaction_size();
   char buf[size];
   uint32_t read = read_transaction(buf, size);
   check(size == read, "Signing value generation: read_transaction() has failed.");
   checksum256 tx_id = eosio::sha256(buf, read);

   // Get first 64 bits from transaction_id
   uint64_t signing_value;
   memcpy(&signing_value, tx_id.data(), sizeof(signing_value));

   // Check if signing_value is valid...
   auto iSigningValue = orng::signvals.begin();
   uint8_t c = 0;

   while( iSigningValue != orng::signvals.end() && c < 64){
      iSigningValue = orng::signvals.find(signing_value);

      // If signing_value exists, we rotate 1 bit to modify the hash. There are 64 possible variations...
      if(iSigningValue != orng::signvals.end()){
         signing_value <<= 1;
         c++;
      }
   }

   // Ok, I don't think this will happen but... what if it does?
   check(c < 64, "No combination was valid? Inconceivable!");

   // Prepare the table where the random value will be received.
   _customers.emplace(get_self(), [&](auto& rec) {
      rec.signing_value = signing_value;
      rec.customer_id = customer_id;
   });

   // Call to orng.wax smart contract
   action(
      { get_self(), "active"_n },
      "orng.wax"_n,
      "requestrand"_n,
      std::tuple{ signing_value, signing_value, get_self() })
      .send();
}
```

*transaction_id* es un número único pero al tener que seleccionar solo una porción de 64 bits es posible que el valor resultante no sea único. Por ese motivo realizamos la comprobación contra la tabla `signvals.a` y, en caso de resultar un número ya escogido, realizamos una rotación de 1 bit para volver a intentarlo.

Cuando tenemos la certeza de haber encontrado un número único, almacenamos el número, junto con el nombre del usuario, y llamamos a WAX RNG enviándole la semilla (*signing_value*) y el mismo valor como identificador de la llamada. Podríamos utilizar el propio nombre del usuario como identificador (*customer_id.value*) pero esto nos complicaría el código en caso de que un usuario solicitara varios números aleatorios y sus peticiones estuvieran simultáneamente almacenadas en la tabla `rngcustomers` cuya clave primaria es *signing_value*.

4.2. ACTION receiverand

Acción callback que será llamada desde WAX RNG para devolvernos, en caso de éxito, el número aleatorio, junto con el código que aportamos como identificador de la petición (*signing_value*).

## Parámetros

| Parámetro     | Tipo        | Descripción                                                         |
| ------------- | ----------- | ------------------------------------------------------------------- |
| signing_value | uint64_t    | Código enviado como identificador.                                  |
| random_value  | checksum256 | Código hash generado por WAX RNG que usaremos como número aleatorio |

```c++
ACTION rngtest::receiverand(uint64_t signing_value, const checksum256& random_value) {
   require_auth(ORNG_CONTRACT);

   //cast the random_value to a smaller number
   uint64_t max_value = 100;
   auto byte_array = random_value.extract_as_byte_array();

   uint64_t random_int = 0;
   for (int i = 0; i < 8; i++) {
      random_int <<= 8;
      random_int |= (uint64_t)byte_array[i];
   }

   uint64_t num1 = random_int % max_value;

   auto iCustomers = _customers.require_find(signing_value, "Error: Petition not found!");

   // update table with random_value
   _customers.modify(iCustomers, get_self(), [&](auto& rec) {
      rec.random_value = random_value;
      rec.final_number = num1;
   });
}
```

Nos aseguramos que solo WAX RNG podrá llamar a esta acción con *require_auth*

Extraemos los primeros 8 bits del número aleatorio devuelto y lo utilizamos para obtener un número no mayor de 100. 

**Nota:** !Aún nos quedan muchos bits disponibles por si necesitamos obtener más números aleatorios!
{: .label .label-yellow }

Localizamos el registro asociado con el identificador de la solicitud y actualizamos su contenido para guardar el código hash devuelto.

Ya podemos utilizar desde el cliente el valor aleatorio para realizar aquella función para la cual lo solicitamos.

## Compilar el smart contract

1. Desde la consola nos desplazamos a la carpeta **rngtest/build** y ejecutamos los siguientes comandos:

```shell
cmake ..
make
```

Encontraremos los archvios **rngtest.wasm** y **rngtest.abi** en la carpeta **rngtest/build/rngtest**.
