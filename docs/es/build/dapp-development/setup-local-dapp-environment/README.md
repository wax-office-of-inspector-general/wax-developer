---
title: Configurar un Entorno de dApp Local
order: 40
---

# Configurar un Entorno de dApp Local

Nuestra [Imagen de Desarrollo Docker](/es/build/dapp-development/docker-setup/) incluye todo lo que necesitas para configurar un entorno de desarrollo local. Esto reduce tus costos de desarrollo y ofrece un sandbox completamente funcional tanto para desarrolladores de dApps nuevos como experimentados. La red de pruebas local de WAX te permite fácilmente:

- Ejecutar un nodo de desarrollo local en tu servidor
- Crear cuentas locales gratuitas para asociar con tu contrato y simular clientes
- Desplegar y probar tus contratos inteligentes localmente
- Estimar el uso de CPU y RAM
- Realizar llamadas a la API de blockchain local 

## Cómo Funciona

Para configurar tu entorno de desarrollo local, necesitarás usar tres herramientas clave de [Blockchain Tools](/es/build/tools/blockchain_tools): keosd, nodeos y cleos.

- **nodeos:** Este es el demonio del nodo central de WAX, utilizado para ejecutar un nodo local en tu servidor. **nodeos** se puede configurar con varios complementos y opciones.
- **keosd:** Utilizado para almacenar claves privadas. Este programa se inicia automáticamente cuando inicias comandos **cleos** y puede iniciar varias instancias en tu servidor local.
- **cleos:** Utilizado para interactuar con tu blockchain local y gestionar carteras y cuentas locales.

Cuando inicies **nodeos** con varios complementos de desarrollo, lanzará un nodo de prueba local en tu servidor y comenzará a producir bloques. Estos bloques se escriben en un registro, lo que te permite ver transacciones firmadas iniciadas desde tus contratos inteligentes.

Usando una clave de desarrollo integrada y una cuenta del sistema, también puedes:

- **Crear una Cartera de Desarrollo.** Esto es necesario para crear cuentas.
- **Crear una Cuenta de Contrato.** Cada uno de tus contratos inteligentes debe estar asociado con una cuenta.
- **Crear Usuarios de Prueba.** Puedes crear tantas cuentas locales como necesites y financiarlas con tokens locales.

## Antes de Empezar

Antes de configurar tu entorno de desarrollo local:

- Deberás completar nuestro [Docker Quickstart](/es/build/dapp-development/docker-setup/) (recomendado) o usar la [Configuración de Blockchain de WAX](/es/build/dapp-development/wax-blockchain-setup/) para construir desde el código fuente.
- Ten a mano un documento de texto o un programa de notas. Necesitarás usar una contraseña de cartera y una clave pública para crear cuentas.

<ChildTableOfContents :max="2" title="Más contenidos en esta sección" />