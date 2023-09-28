---
title: WharfKit
order: 100
---

# WharfKit - El Nuevo Estándar de Accesibilidad Blockchain

Uno de los principales desafíos al desarrollar aplicaciones en la blockchain Antelope, como la Blockchain WAX, es la comunicación entre las capas de usuario y de aplicación con la capa de blockchain.

## Problema Principal

Para comunicarse con la blockchain, es necesario:

- Iniciar una sesión asociada a una cuenta WAX.
- Usar herramientas para serializar, deserializar y firmar acciones para tareas de lectura o escritura.

Durante mucho tiempo, se utilizó la herramienta **UAL (Universal-Authenticator Library)**. Sin embargo, su última versión (V0.1.3) data del 11 de septiembre de 2019, y su escalabilidad con frameworks modernos es limitada.

La versión 1.0.0 de **Wharfkit/sesión** ha sido un paso significativo, posicionando a Wharf como el nuevo estándar de accesibilidad blockchain en entornos Antelope.

## WharfKit

WharfKit se describe como "Suite SDK de Javascript para blockchains Antelope". Aunque está en una fase temprana de desarrollo, consta de tres módulos:

- Kit de Cuenta
- Kit de Contrato
- Kit de Sesión

Hasta ahora, solo se ha lanzado el **Kit de Sesión**, pero ha generado grandes expectativas en la comunidad de desarrolladores.

### Kit de Sesión

Este kit incluye herramientas para crear y mantener sesiones (para aplicaciones back-end y front-end). En este tutorial, presentaremos cómo usar el kit de sesión en una aplicación front-end con React.

#### Componentes Principales

- **Kit de Sesión**: Crea instancias de sesión y ofrece herramientas para su gestión.
- **Sesión**: Instancias gestionadas por el Kit de Sesión.

Además, proporciona interfaces y plugins, como:

- **Plugin de Wallet**: Conexión con wallets externas.
- **Plugin de Login**: Modifica el flujo de acciones durante el inicio de sesión.
- **Plugin de Transacción**: Estructura lógica para agregar código personalizado.

Es esencial mencionar **Almacenamiento de Sesión**, que conserva las instancias de sesión entre cargas de página.

<ChildTableOfContents :max="2" title="Más contenidos en esta sección" />