---
title: Cuentas temporales de WaxJS
order: 5
---

**MyCloudWallet** permite la creación de cuentas temporales que no requieren el pago de la comisión de creación de cuenta. Sin embargo, estas cuentas no existen en la blockchain hasta que se realiza dicho pago. Este sistema es muy útil para que las aplicaciones puedan crear cuentas de usuario sin que los usuarios tengan que pagar la comisión de creación de cuenta directamente o tener conocimientos previos sobre la compra de criptomonedas, transacciones, etc.

Los usuarios pueden seguir el proceso normal de creación de cuenta, pero al llegar al paso de pagar la cuota de creación, pueden cancelar y cerrar el popup. A partir de ese momento, la cuenta existirá en el contexto de **MyCloudWallet**, pero no en la blockchain. Esta cuenta temporal podrá utilizarse para iniciar sesión en aplicaciones que tengan integrado **MyCloudWallet** y que permitan el uso de cuentas temporales.

Se recomienda leer los tutoriales anteriores para comprender el funcionamiento de la librería `waxjs.js` y cómo integrar **MyCloudWallet** en una aplicación.

## Configuración de la App para Permitir Cuentas Temporales

Para permitir cuentas temporales en una aplicación, el desarrollador debe configurar el método de inicio de sesión de **MyCloudWallet** para permitir dichas cuentas. Esto se hace añadiendo el parámetro `returnTempAccounts` con el valor `true` en la configuración del método de inicio de sesión usando la librería `waxjs.js`.

```javascript
  const wax = new waxjs.WaxJS({
    rpcEndpoint: "https://apiwax.3dkrender.com",
    returnTempAccounts: true,
  });
```

## Creación de Cuentas Temporales por Parte del Usuario

A continuación, se muestra un ejemplo sencillo que ilustra el proceso de inicio de sesión y la verificación de si la cuenta es temporal o no.

```javascript
  const wax = new waxjs.WaxJS({
    rpcEndpoint: "https://apiwax.3dkrender.com",
    returnTempAccounts: true,
  });

  let userAccount = await wax.login();
  if (wax.isTemp) {
    console.log("La cuenta es temporal");
  } else {
    console.log("La cuenta no es temporal");
  }
```

::: tip Nota
El método `login()` de la librería `waxjs.js` devuelve un objeto con la información de la cuenta del usuario y un booleano `isTemp` que indica si la cuenta es temporal o no, además de otros datos, como se ha explicado en tutoriales anteriores.
:::

En nuestro ejemplo, hay un botón de "login" que, al hacer clic, ejecuta el código anterior. Si no hay datos en caché de una cuenta previamente creada o no se ha creado ninguna cuenta, se abrirá el popup de **MyCloudWallet** para que el usuario pueda iniciar sesión. Si el usuario cancela el pago de la comisión de creación de cuenta, la cuenta será temporal.

![Login](https://3dkrender.com/wp-content/uploads/2024/08/login_01.png)
(Figura 1: Popup de MyCloudWallet para iniciar sesión o crear cuenta)

![Login](https://3dkrender.com/wp-content/uploads/2024/08/create_01.png)
(Figura 2: Aceptar los términos y condiciones)

![Login](https://3dkrender.com/wp-content/uploads/2024/08/create_02.png)
(Figura 3: Paso previo al pago de la comisión de creación de cuenta. En este punto, el usuario puede cancelar el proceso)

Si la cuenta ya existe, la llamada a **MyCloudWallet** mostrará un popup solicitando al usuario que inicie sesión, siempre que no esté activado el auto-login.

![Login](https://3dkrender.com/wp-content/uploads/2024/08/login_03.png)
(Figura 4: Popup de MyCloudWallet para iniciar sesión)

::: warning Importante
Esto solo es posible si al crear el objeto `wax` se ha configurado el parámetro `returnTempAccounts` con el valor `true`. De lo contrario, el modal siempre mostrará la pantalla de pago de la comisión de creación de cuenta (si es una cuenta temporal).
:::

![Login](https://3dkrender.com/wp-content/uploads/2024/08/login_02.png)
(Figura 5: Modal para pagar la comisión de creación de cuenta)

Una vez completado el login, si la cuenta es temporal, se mostrará un mensaje en la consola indicando que la cuenta es temporal. Si no lo es, se mostrará un mensaje indicando que la cuenta no es temporal. Además, se puede acceder a otros datos de la cuenta, como el nombre que ya le ha sido asignado y las claves públicas `Owner` y `Active`.

![Login](https://3dkrender.com/wp-content/uploads/2024/08/final.png)
(Figura 6: Ejemplo de consola mostrando la verificación de una cuenta temporal)

Este es el código de ejemplo completo:

```javascript
<!DOCTYPE html>
<html>
  <script src="waxjs.js"></script>

  <body>
    Below is a basic example of WaxJS functionality to check temp accounts. To use this demo, click WAX
    Login (if you're not automatically logged in).

    <strong>Auto-login Feature</strong>
    <p>
      If your blockchain information displays below, you're automatically logged
      in to WaxJS, and you don't need to click WAX Login. This eliminates the
      need for multiple clicks and popups!
    </p>
    <p style="color: #ef9d47" id="autologin"></p>

    <strong>WAX Login</strong>
    <p>
      Use this if you're not automatically logged in. Note that if you are
      auto-logged in, clicking this does not open a popup and the userAccount is
      still returned.
    </p>
    <button id="login" onclick="login()">WAX Login</button>
    <p style="color: #ef9d47" id="loginresponse"></p>

    <script>
      const wax = new waxjs.WaxJS({
        rpcEndpoint: "https://apiwax.3dkrender.com",
        returnTempAccounts: true,
      });

      // automatically check for credentials
      autoLogin();

      // checks if autologin is available
      async function autoLogin() {
        let isAutoLoginAvailable = await wax.isAutoLoginAvailable();
        if (isAutoLoginAvailable) {
          let userAccount = wax.userAccount;
          let pubKeys = wax.pubKeys;
          let str =
            "AutoLogin enabled for account: " +
            userAccount +
            "<br/>Is Temp: " +
            wax.isTemp +
            "<br/><br/><strong>Public Keys:</strong><br/>Active: " +
            pubKeys[0] +
            "<br/>Owner: " +
            pubKeys[1];
          document
            .getElementById("autologin")
            .insertAdjacentHTML("beforeend", str);
        } else {
          document
            .getElementById("autologin")
            .insertAdjacentHTML("beforeend", "Not auto-logged in");
        }
      }

      // normal login. Triggers a popup for non-whitelisted dapps
      async function login() {
        try {
          // if autologged in, this simply returns the user Account with no popup
          let userAccount = await wax.login();
          let pubKeys = wax.pubKeys;
          let str =
            "Account: " +
            userAccount +
            "<br/>Is Temp: " +
            wax.isTemp +
            "<br/><br/><strong>Public Keys:</strong><br/>Active: " +
            pubKeys[0] +
            "<br/>Owner: " +
            pubKeys[1];
          document
            .getElementById("loginresponse")
            .insertAdjacentHTML("beforeend", str);
        } catch (e) {
          document.getElementById("loginresponse").append(e.message);
        }
      }
    </script>
  </body>
</html>
```

## Pago de la Comisión de Creación de Cuenta por Parte de la Aplicación

Como hemos mencionado, este sistema es muy práctico para facilitar la creación de cuentas a los usuarios de aplicaciones descentralizadas. Sin embargo, es importante recordar que la cuenta temporal no existe en la blockchain hasta que no se realice el pago de la comisión de creación de cuenta. Por lo tanto, es responsabilidad de la aplicación realizar el pago de esta comisión en nombre del usuario.

Aunque el coste de la creación de la cuenta es pequeño, la aplicación puede aprovechar la realización de alguna venta a través de canales más convencionales, como pasarelas de pago con tarjeta de crédito, PayPal, etc.

Por ejemplo, en un videojuego que vende packs de cartas, podría vender las cartas a través de una pasarela de pago convencional y, al realizar la compra, la aplicación podría crear la cuenta del usuario en la blockchain y asociar las cartas compradas a esa cuenta. De esta forma, el usuario no tendría que preocuparse por la creación de la cuenta ni por la compra de criptomonedas.

Para esto, la aplicación debe estar estructurada con una arquitectura cliente-servidor, donde el servidor se encargue de realizar la transacción en la blockchain. La aplicación debe enviar el nombre de la cuenta temporal al servidor, para que este realice la transacción en la blockchain y convierta la cuenta temporal en una cuenta permanente.

::: warning Importante
Es importante separar la lógica de la aplicación en cliente y servidor para garantizar la seguridad de las claves privadas de la aplicación, necesarias para realizar transacciones en la blockchain. Estas transacciones deben realizarse en el servidor, donde las claves privadas estén protegidas y no puedan ser accedidas.
:::

El servidor puede realizar el pago utilizando la librería `waxjs.js`, realizando una transacción como se ha explicado en tutoriales anteriores. El coste actual de la creación de una cuenta en la blockchain de WAX es de 5 WAX, que puede consultarse [aquí](https://waxblock.io/account/newuser.wax?code=newuser.wax&scope=newuser.wax&table=settings&lower_bound=createval&upper_bound=createval&limit=10&reverse=false#contract-tables).

La transacción debe hacerse a la cuenta `newuser.wax`, con el nombre de la cuenta temporal en el

 memo y el coste de la creación de la cuenta en WAX. Una vez realizada la transacción, la cuenta temporal se convertirá en una cuenta permanente y el usuario podrá utilizarla para realizar transacciones en la blockchain con total normalidad.

```javascript
  const result = await wax.api.transact(
    {
      actions: [
        {
          account: "eosio",
          name: "transfer",
          authorization: [
            {
              actor: appAccount,
              permission: "active",
            },
          ],
          data: {
            from: appAccount,
            to: "newuser.wax",
            quantity: "5.00000000 WAX",
            memo: tempUserAccountName
          },
        },
      ],
    },
    {
      blocksBehind: 3,
      expireSeconds: 30,
    }
  );
```

- **appAccount**: Cuenta de la aplicación que realiza la transacción.
- **tempUserAccountName**: Nombre de la cuenta temporal que se quiere convertir en permanente.

## Conclusión

**MyCloudWallet** permite la creación de cuentas temporales que no requieren el pago de la comisión de creación de cuenta. Este sistema es muy útil para que las aplicaciones puedan crear cuentas de usuario sin que estos tengan que pagar la comisión de creación de cuenta directamente o tener conocimientos previos sobre la compra de criptomonedas, transacciones, etc. Sin embargo, es importante recordar que la cuenta temporal no existe en la blockchain hasta que se realice el pago de la comisión. Por lo tanto, es responsabilidad de la aplicación realizar dicho pago en nombre del usuario.
