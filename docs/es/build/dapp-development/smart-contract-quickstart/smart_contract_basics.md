---
title: Fundamentos de Contratos Inteligentes
order: 61
---

# Fundamentos de Contratos Inteligentes

Un contrato inteligente de WAX incluye una colección de acciones, definiciones de tipos y almacenamiento persistente, permitiendo que tu dApp firme transacciones en la Blockchain de WAX. Cuando llamas a un contrato inteligente desde una aplicación de front-end:

- Se inicializa una ACCIÓN
- Se envía un mensaje a la mainnet de WAX
- La acción se completa y luego continúa con la siguiente acción (si es necesario)

## Cómo Funciona

Los contratos inteligentes típicamente incluyen archivos de cabecera, herencia de clases, acciones, permisos, datos persistentes, despachadores de acciones y definiciones de tipos.

### Archivos de Cabecera

Los archivos de cabecera de C++ contienen declaraciones globales. Dado que WAX utiliza una bifurcación de EOS (Antelope), todos tus contratos inteligentes de WAX heredarán de los contratos y clases de EOS. El archivo de cabecera <a href="https://github.com/worldwide-asset-exchange/wax-cdt/blob/master/libraries/eosiolib/eosio.hpp" target="_blank">eosio.hpp</a> debe ser incluido en cada contrato, y cada contrato debe extender la clase <a href="https://github.com/worldwide-asset-exchange/wax-cdt/blob/master/libraries/eosiolib/contract.hpp" target="_blank">eosio::contract</a>.

```
#include <eosio/eosio.hpp>
```

Esto le da a tu contrato inteligente acceso a la API de C/C++ de WAX, permitiéndote definir acciones y estructuras que habilitan a tu contrato inteligente para comunicarse con la Blockchain de WAX. Consulta la [API de WAX-CDT](/es/learn/api-reference/cdt_api) para más información.

### Acciones

Las acciones definen la funcionalidad central de tu contrato inteligente. Cuando una acción se ejecuta, los eventos se escriben en la Blockchain de WAX.

Las acciones incluyen las siguientes propiedades:

- **Nivel de Permiso:** Puedes asegurar cada acción con varios permisos.
- **Código:** Esta es la cuenta blockchain de tu contrato inteligente.
- **Acción:** Nombre de la acción.
- **Datos:** Las acciones admiten varios tipos de datos y estructuras.

#### Transacciones

Una transacción es una lista de una o más acciones ejecutadas en el mismo bloque.

Las acciones se ejecutan en un bloque de código aislado, típicamente llamado desde tu cliente de front-end. Si una de tus acciones necesita llamar a otra acción, puedes crear una **Transacción** de contrato inteligente.

Las transacciones se comunican utilizando dos modelos: en línea y diferido.

- **En Línea:** Una transacción en línea es un modelo de comunicación tipo síncrono que se ejecuta en el mismo ámbito de la transacción. Estas acciones están garantizadas para ejecutarse en orden y al mismo tiempo que se llama a la acción original. Si la transacción falla, puedes revertir los cambios en las acciones anteriores.

  Para un ejemplo de una transacción en línea, consulta la guía de EOS Network <a href="https://docs.eosnetwork.com/docs/latest/" target="_blank">Agregar Acciones en Línea</a>.

- **Diferido:** Una acción diferida es una acción que está programada para ejecutarse en el futuro, similar a una llamada asíncrona. Estas transacciones no están garantizadas para ejecutarse (existe la posibilidad de que sean descartadas por el nodo). La acción original (llamante) se aplica a la Blockchain de WAX cuando la acción se ejecuta, y no se puede revertir si la transacción diferida falla.

:::Warning
A partir de Leap 3.1, las transacciones diferidas están obsoletas.
:::

### Permisos

Un contrato inteligente y una Cuenta Blockchain de WAX se comunican utilizando las acciones definidas en tu contrato inteligente. Puedes asegurar tus acciones utilizando permisos de la Cuenta WAX. Al incluir el método `require_auth()` en tus acciones, puedes verificar que una llamada a una acción fue iniciada por la cuenta blockchain de tu contrato inteligente. También puedes usar el método `require_auth()` para asegurar acciones específicas de clientes de WAX, como actualizar un registro de usuario. Requerir autenticación en acciones específicas de usuarios puede garantizar que solo tu cliente pueda realizar esta acción, y no alguien más.

Los permisos también pueden permitir que tus contratos inteligentes manejen notificaciones y realicen llamadas a otros contratos inteligentes (usando el permiso `eosio.code`).

Consulta la guía de EOS Network <a href="https://docs.eosnetwork.com/docs/latest/" target="_blank">Cuentas y Permisos</a> para más información.

### Persistir Datos

Cada vez que llamas a una de las acciones de tu contrato inteligente desde tu aplicación, se crea una nueva instancia de tu contrato inteligente. Esta nueva instancia no sabe nada sobre los estados anteriores del contrato. Cuando la acción se completa, esta instancia se destruye.

Para persistir datos entre las acciones de uno o más de tus contratos inteligentes, necesitarás usar la funcionalidad de tabla **multi_index**.

:::tip 
Nota: 
Los datos persistentes se almacenan en la RAM del nodo WAX y afectan la cantidad de WAX que necesitarás apostar para tu contrato inteligente.
:::

Consulta la guía de EOS Network <a href="https://docs.eosnetwork.com/docs/latest/" target="_blank">Persistencia de Datos</a> para más información.

### Despachadores WAX

Una macro de despachador es el controlador de acción, escuchando solicitudes entrantes. Puedes usar esta macro para registrar todas las acciones de tu contrato inteligente.

### Estructura Básica

Aquí tienes una plantilla de contrato inteligente de muestra con elementos comunes.

```
#include <eosio/eosio.hpp>

using namespace eosio;

CONTRACT mycontract : public eosio::contract {
public:
	using contract::contract;

	ACTION action1(name user) {
		require_auth(user);
	}

private:
	TABLE customer {
		name key;
		std::string first_name;
		std::string last_name;

		uint64_t primary_key() const { return key.value; }
	};

	typedef eosio::multi_index<"customers"_n, customer> customer_index;

};
EOSIO_DISPATCH(mycontract, (action1))

```
