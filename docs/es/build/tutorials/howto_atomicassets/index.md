---
title: How-To AtomicAssets
---
AtomicAssets es el smart contract creado por Pink Network, importante Gremio validador para WAX Blockchain, para administrar el estándar NFT del mismo nombre y cuyo repositorio puede consultarse en GitHub: [AtomicAssets](https://github.com/pinknetworkx/atomicassets-contract)

Actualmente es el estándar NFT más ampliamente aceptado y utilizado en entornos WAX, tanto para crear NFTs de colecciones de arte como para el mundo de los videojuegos.

Durante las próximas entradas de este tutorial exploraremos sus carácterísticas y cómo podemos hacer uso de ellas, tanto desde un smart contract como desde aplicaciones basadas en JavaScript.

Entre las características más importantes a destacar podemos mencionar:

- El coste de la RAM es asumido por quien acuña el NFT y no por quien lo posea.
- Los datos son serializados para lograr un ahorro muy importante de memoria RAM
- Emplea un sistema de plantillas que, junto con la serialización, permite reducir el consumo de RAM.
- Disponde un API propio y de código abierto que permite agilizar el acceso a los datos de los NFTs sin tener que hacer lecturas de las tablas del smart contract.