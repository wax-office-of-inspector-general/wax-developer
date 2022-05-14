---
title: Fundamentos de los contratos inteligentes
layout: default
nav_order: 61
parent: Smart Contract Quickstart
grand_parent: dApp Development
lang-ref: Smart Contract Basics
lang: es
---

Un contrato inteligente (Smart Contract) de WAX incluye una recopilación de acciones, definiciones de tipos y almacenamiento persistente, lo que permite a tu dApp firmar transacciones en la Blockchain de WAX. Cuando llamas a un contrato inteligente desde una app front-end:

- Se inicializa una ACCIÓN
- Se envía un mensaje a la mainnet de WAX 
- La acción se completa y continúa con la siguiente acción (si es necesario)

## Cómo funciona

Los contratos inteligentes suelen incluir archivos de cabecera, herencia de clases, acciones, permisos, datos persistentes, despachadores de acciones y definiciones de tipos. 

### Archivos de cabecera

Los archivos de cabecera de C++ contienen declaraciones globales. Como WAX utiliza una rama de EOSIO, todos sus contratos inteligentes heredarán de los contratos y clases de EOSIO. El archivo <a href="https://github.com/worldwide-asset-exchange/wax-cdt/blob/master/libraries/eosiolib/eosio.hpp" target="_blank">eosio.hpp</a> debe incluirse en todos los contratos, y todo contrato debe incluir la clase <a href="https://github.com/worldwide-asset-exchange/wax-cdt/blob/master/libraries/eosiolib/contract.hpp" target="_blank">eosio::contract</a>. 

```
  #include <eosio/eosio.hpp>
```

Esto le da a tu contrato inteligente acceso a la API C/C++ de WAX, permitiéndote definir acciones y estructuras que le permitan comunicarse con la Blockchain de WAX. Para más información al respecto, visita la guía [API WAX-CDT](/es/api-reference/cdt_api).

### Acciones

Las acciones definen la funcionalidad central de tu contrato inteligente. Cuando una acción se ejecuta, los eventos se escriben en la Blockchain de WAX. 

Las acciones incluyen las siguientes propiedades:

- **Nivel de permiso:** Puedes asegurar cada acción con varios permisos.
- **Código:** Esta es la cuenta de blockchain de tu contrato inteligente.
- **Acción:** El nombre de la acción.
- **Datos:** Las acciones admiten varios tipos y estructuras de datos.

#### Transacciones

Una transacción es una lista de una o más acciones ejecutadas en el mismo bloque.

Las acciones se ejecutan en un bloque de código aislado, normalmente llamado desde tu cliente front-end. Si una de tus acciones necesita llamar a otra acción, puedes crear una **Transaction** de contrato inteligente. 
    
<!--```
//use eosio::transaction to call other actions from an existing action
eosio::transaction t{};
```-->

Las transacciones se comunican utilizando dos modelos: inline y diferido.

- **Inline:** Una transacción inline es un modelo de comunicación de tipo síncrono que se ejecuta en el mismo ámbito de la transacción. Se garantiza que estas acciones se ejecutan en orden y al mismo tiempo que se llama a la acción original. Si la transacción falla, se pueden revertir los cambios en las acciones anteriores.  

    Para ver un ejemplo de transacción inline, visita la guía de EOSIO <a href="https://developers.eos.io/welcome/v2.0/smart-contract-guides/adding-inline-actions" target="_blank">Añadir acciones inline</a>.

- **Diferido:** Una acción diferida es una acción que está programada para ejecutarse en el futuro, similar a una llamada asíncrona. No se garantiza que estas transacciones se ejecuten (existe la posibilidad de que el nodo las abandone). La acción original (de llamada) se aplica a la Blockchain de WAX cuando la acción se ejecuta, y no puede ser revertida si la transacción diferida falla. 
    
    Para ver un ejemplo, visita la guía de EOSIO <a href="https://developers.eos.io/manuals/eosio.cdt/v1.7/best-practices/deferred_transactions" target="_blank">Transacciones diferidas</a>.

**Advertencia:** A partir de EOSIO 2.0 RC1, las transacciones diferidas quedan obsoletas.
{: .label .label-yellow}

### Permisos

Un contrato inteligente y una cuenta de la Blockchain de WAX se comunican utilizando las acciones definidas en tu contrato inteligente. Puedes asegurar tus acciones usando los permisos de la cuenta WAX. Incluyendo el método `require_auth()` en tus acciones, puedes verificar que una llamada a una acción fue iniciada por la cuenta de blockchain de tu contrato inteligente. También puedes utilizar el método `require_auth()` para asegurar las acciones específicas del cliente de WAX, como la actualización de un registro de usuario. Requerir la autenticación en acciones específicas del usuario puede garantizar que sólo tu cliente (y nadie más) puede realizar esta acción.

Los permisos también pueden permitir que tus contratos inteligentes manejen notificaciones y hagan llamadas de acción a otros contratos inteligentes (usando el permiso `eosio.code`).

 Para más información, visita la guía de <a href="https://developers.eos.io/welcome/v2.0/protocol-guides/accounts_and_permissions" target="_blank">Cuentas y permisos</a> de EOSIO.

### Datos persistentes

Cada vez que llamas a una de las acciones de tu contrato inteligente desde tu aplicación, se crea una nueva instancia de tu contrato inteligente. Esta nueva instancia no sabe nada de los estados anteriores del contrato. Cuando la acción se completa, la instancia se destruye. 

Para persistir los datos entre las acciones de uno o más de sus contratos inteligentes, necesitará utilizar la funcionalidad de la tabla **multi_index**. 
    
<strong>Nota:</strong> Los datos persistentes se almacenan en la memoria RAM del nodo WAX y afectan a la cantidad de WAX que necesitarás para almacenar en tu contrato inteligente.
{: .label .label-yellow }


 Para más información, visita la guía <a href="https://developers.eos.io/welcome/v2.0/smart-contract-guides/data-persistence/" target="_blank">Persistencia de datos</a> de EOSIO.

### Despachadores de WAX

Una macro despachadora es el manejador de acciones, que escucha las solicitudes entrantes. Puedes utilizar esta macro para registrar todas las acciones de tu contrato inteligente.

### Estructura básica

Aquí tienes un ejemplo de plantilla de contrato inteligente con los elementos más comunes.

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
