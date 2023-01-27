---
title: WAX RNG Básico
layout: default
nav_order: 82
parent: Utilizar WAX RNG desde smart contract
grand_parent: Tutoriales
lang-ref: WAX RNG Basics
lang: es
---

## Cómo funciona

- **WAX RNG Smart Contract.** El smart contract WAX RNG se ejecuta en WAX testnet y WAX mainnet bajo la propiedad de la cuenta **orng.wax**.
- **WAX RNG Oracle Service.** Custodiado desde la cuenta **oracle.wax**, este servicio externo monitoriza constantemente la blockchain WAX a la escucha de nuevas llamadas hacia el smart contract WAX RNG. Cuando se reclama un número aleatorio, el oráculo RNG cra unas firmas RSA que generarán un número confiablemente aleatorio.

Este es el proceso típico para obtener un número aleatorio:

1. El usuario o la aplicación cliente proporciona un número aleatorio de 64 bits (*signing-value*). Por ejemplo, puedes mostrar un botón que llame a una función javascript que genere un número pseudoaleatorio. Cuando el usuario esté satisfecho con su valor semilla, puede hacer clic en otro botón (por ejemplo, Empezar a jugar).
2. También debe proporcionar un número de seguimiento único (*assoc_id*). Puede ser un id de trabajo interno o un id de base de datos. Este número servirá como clave única para identificar la solicitud y recuperar el número aleatorio obtenido.
3. Tu smart contract llama al servicio WAX RNG para solicitar un número aleatorio, enviando tu *assoc_id* y el *signing_value* del usuario.
4. El oráculo WAX RNG acepta su solicitud, luego utiliza un par interno de claves pública y privada para crear una firma RSA basada en el número proporcionado por su cliente (*signing_value*). Esta firma se hash y se convierte en su número aleatorio. 
5. El servicio WAX RNG verifica la firma RSA devuelta por el oráculo WAX RNG, luego envía el número aleatorio a una acción callback de tu smart contract, junto con su número de seguimiento (*assoc_id*). 
6. Muestras el número aleatorio al cliente o implementas algún tipo de lógica de aleatorización, animación o función dentro del juego.
