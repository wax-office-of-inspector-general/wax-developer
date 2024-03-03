---
título: Resumen de WaxJS
---

# wax.js

**WaxJS** es una biblioteca de Javascript que se conecta a Cloud Wallet para iniciar sesión en usuarios y ejecutar transacciones de contratos inteligentes, sin necesidad de una billetera externa (por ejemplo, Scatter). De manera similar al flujo estándar OAuth 2.0, los usuarios simplemente permiten que tu dApp acceda a su nombre de Cuenta de Blockchain de WAX. Una vez que tu dApp ha sido autorizada, los usuarios pueden aprobar las transacciones de tu contrato inteligente desde su Cuenta de Cloud Wallet.

Para comenzar, simplemente necesitas incluir nuestra biblioteca [WaxJS](https://github.com/worldwide-asset-exchange/waxjs) y hacer unas pocas llamadas simples desde tu cliente. Si te gustaría ir directamente al código y ejecutar nuestro ejemplo en vivo de WaxJS, consulta [Demostración de WaxJS](waxjs_demo.md).
## Cómo Funciona

**WaxJS** utiliza Cloud Wallet y la API de Javascript [EOSIO/eosjs](https://github.com/EOSIO/eosjs) para proporcionar una interfaz fácil de usar entre tus usuarios y la Blockchain de WAX.

Para usar **WaxJS**, simplemente necesitas:

1. Añadir la biblioteca **WaxJS** a tu cliente
2. Usar `wax.login` para iniciar sesión en usuarios con Cloud Wallet (funciones de auto-inicio de sesión disponibles)

![Inicio de Sesión de WaxJS](/assets/images/wax-cloud-wallet/waxjs/waxjs_login.png)

3. Usar `wax.api` para enviar tus transacciones a la Blockchain de WAX

![Firma de WaxJS](/assets/images/wax-cloud-wallet/waxjs/waxjs_sign.png)

En las siguientes secciones, aprenderás cómo instalar y usar **WaxJS**.
