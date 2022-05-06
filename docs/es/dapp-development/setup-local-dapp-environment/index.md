---
title: Configura un entorno local para desarrollar tu dApp
layout: default
nav_order: 40
parent: Desarrollo de dApps
has_children: true
lang-ref: Set Up a Local dApp Environment
lang: es
---

Nuestra [Imagen de desarrollo Docker](/es/dapp-development/docker-setup/) incluye todo lo necesario para configurar un entorno de desarrollo local. Esto reduce tus costes de desarrollo y ofrece un sandbox totalmente funcional tanto para los desarrolladores de dApps nuevos como para los experimentados. La testnet local de WAX te permite fácilmente:

- Ejecutar un nodo de desarrollo local en tu servidor
- Crear cuentas locales gratuitas para asociarlas a tu contrato y simular clientes
- Implantar y probar tus contratos inteligentes a nivel local
- Estimar el uso de la CPU y la RAM
- Hacer llamadas a la API de la blockchain local 

## Cómo funciona

Para configurar tu entorno de desarrollo local, necesitarás utilizar tres  [herramientas clave de la Blockchain](/es/tools/blockchain_tools): keosd, nodeos, y cleos.

<!--To get started, you'll need to use three key tools included in the [WAX Blockchain Setup](/es/dapp-development/wax-blockchain-setup/):

- **nodeos:** This is the core WAX node daemon, used to run a local node on your server. **nodeos** can be configured with various plug-ins and options.
- **keosd:** Used to store private keys. This program is automatically started when you initiate **cleos** commands and can start several instances on your local server.
- **cleos:** Used to interact with your local blockchain and manage local wallets and accounts. -->

Cuando inicias **nodeos** con varios plug-ins de desarrollo, este lanza un nodo de prueba local en tu servidor y comienza a producir bloques. Estos bloques se escriben en un registro, permitiéndote ver las transacciones firmadas iniciadas a partir de tus contratos inteligentes. 

También puedes utilizar una clave de desarrollo y una cuenta del sistema incorporadas para: 

- **Crear una cartera de desarrollo.** Esto es necesario para crear cuentas.
- **Crear una cuenta de contratos.** Cada uno de tus contratos debe estar asociado a una cuenta.
- **Crear usuarios de prueba.** Puedes crear tantas cuentas locales como necesites y financiarlas con tokens locales.

## Antes de empezar

Antes de configurar tu entorno de desarrollo local:

- Tendrás que completar nuestro [Inicio rápido de Docker](/es/dapp-development/docker-setup/) (recomendado) o usar la [Configuración de la Blockchain de WAX](/es/dapp-development/wax-blockchain-setup/) para poder utilizar el código fuente.
- Ten a mano un documento de texto o una app de notas. Tendrás que utilizar una contraseña para tu cartera y una clave pública para crear cuentas. 
