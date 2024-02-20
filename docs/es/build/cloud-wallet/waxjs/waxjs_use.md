---
title: Uso de WaxJS
order: 2
---

# Uso de WaxJS

La biblioteca **WaxJS** expone cuatro componentes principales:

- **wax.userAccount.** Nombre de usuario de la cuenta WAX, devuelto cuando haces una llamada a `wax.login()`.
- **wax.pubKeys.** Las claves activas y de propietario de un usuario. Disponible una vez que un usuario ha iniciado sesión o si pasas las claves en el constructor de WaxJS.
- **wax.api.** Úsalo para ejecutar transacciones estándar de eosjs.
- **wax.rpc.** Úsalo para hacer llamadas API a la Blockchain de WAX. Consulta la [API RPC de WAX](/learn/api-reference/) para más información.

Para usar **WaxJS**:

1. Importar la Biblioteca. Aplicaciones estilo React que usan npm o yarn pueden importar la biblioteca mediante:

   ```js
   import * as waxjs from "@waxio/waxjs/dist";
   ```

   También puedes descargar y guardar [WaxJS](https://raw.githubusercontent.com/worldwide-asset-exchange/waxjs/develop/dist-web/waxjs.js) desde GitHub e incluir el archivo en una página web:

   ```html
   <script src="waxjs.js"></script>
   ```

2. Hay varias maneras de instanciar el constructor WaxJS, dependiendo de qué información tengas de tus usuarios. Los parámetros del constructor incluyen:

   - La URL del Servidor RPC al que deseas conectarte (requerido)
   - El nombre de la Cuenta de Blockchain de WAX de un usuario (opcional)
   - Un Array de claves públicas para una cuenta específica (opcional)
   - Valor bool de autoLogin (opcional)

   Para permitir que WaxJS asigne los valores de usuario apropiados, simplemente puedes pasar una URL RPC:

   ```js
   const wax = new waxjs.WaxJS({
     rpcEndpoint: "https://wax.greymass.com",
   });
   ```

   :::info Nota
   El constructor para WaxJS cambió con la versión 1.0. Si estás actualizando desde una versión anterior necesitarás cambiar el constructor.
   :::

   La biblioteca también puede ser instanciada con la cuenta de usuario y las claves públicas. Si tienes esta información, puedes pasarla al constructor de WaxJS.

   ```js
   const wax = new waxjs.WaxJS({
     rpcEndpoint: "https://wax.greymass.com",
     userAccount: "3m1q4.wam",
     pubKeys: [
       "EOS6rjGKGYPBmVGsDDFAbM6UT5wQ9szB9m2fEcqHFMMcPge983xz9",
       "EOS7wTCoctybwrQWuE2tWYGwdLEGRXE9rrzALeBLUhWfbHXysFr9W",
     ],
   });
   ```

   :::info Nota
   Si pasas estos parámetros adicionales, no necesitarás llamar al método autoLogin.
   :::

3. Antes de que puedas comenzar a firmar transacciones desde tu dApp, un usuario debe estar conectado. WaxJS incluye una función `isAutoLoginAvailable` que:

   - Verifica de manera segura las credenciales de Cloud Wallet
   - Checa si tu dApp está en la lista blanca

   Si ambas condiciones son verdaderas, la cuenta de usuario y las claves públicas se establecen en tu objeto WaxJS, y no necesitas llamar a la función `login()`. También tendrás acceso a wax.userAccount y wax.pubKeys.

   ```js
   //si es verdadero, no se activará la ventana emergente; el usuario ahora está conectado
   var isAutoLoginAvailable = await wax.isAutoLoginAvailable();
   var userAccount = wax.userAccount;
   var pubKeys = wax.pubKeys;
   ```

   Si el auto-inicio de sesión no está disponible, puedes usar fácilmente la función `login()` para permitir a los usuarios iniciar sesión o registrarse usando Cloud Wallet.

   ```js
   //inicio de sesión normal. Activa una ventana emergente para dapps no incluidas en la lista blanca
   async function login() {
     try {
       const userAccount = await wax.login();
       const pubKeys = wax.pubKeys;
     } catch (e) {}
   }
   ```

   La función `login()` abre Cloud Wallet en una nueva ventana del navegador. Se

 solicita a los usuarios que aprueben que tu dApp "Conozca tu Nombre de Cuenta WAX". Una vez que hacen clic en Aprobar, son redirigidos de vuelta a tu dApp

   Un inicio de sesión exitoso devuelve el userAccount (por ejemplo, jq3ao.wam), y también puedes acceder a esta propiedad llamando a `wax.userAccount`.

4. Enviar una Transacción

   Ahora que tienes el nombre de la Cuenta WAX de un usuario, puedes usar el objeto `wax.api` para construir tu transacción.

:::info Nota
El método `wax.api` no se inicializa hasta que inicies sesión de un usuario o pases la información de un usuario en el constructor de WaxJS.
:::

```js
const result = await wax.api.transact(
  {
    actions: [
      {
        account: "eosio.token",
        name: "transfer",
        authorization: [
          {
            actor: wax.userAccount,
            permission: "active",
          },
        ],
        data: {
          from: wax.userAccount,
          to: "eosio",
          quantity: "0.00000001 WAX",
          memo: "",
        },
      },
    ],
  },
  {
    blocksBehind: 3,
    expireSeconds: 1200,
  }
);
```

:::info Nota
El método `wax.api` es una instancia del objeto **eosjs**, y proporciona la misma funcionalidad. Consulta la documentación de [eosjs](https://eosio.github.io/eosjs/latest) para más información.
:::

La función `wax.api.transact()` lanza Cloud Wallet en una nueva ventana del navegador. En esta pantalla, los usuarios pueden revisar los detalles de la transacción y Aprobar o Denegar la transacción. Una vez que los usuarios hacen clic en Aprobar, la transacción se firma en la Blockchain de WAX y los usuarios son devueltos a tu dApp.
