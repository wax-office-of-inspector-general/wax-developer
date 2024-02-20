---
title: Demostración de WaxJS
order: 4
---

# Demostración de WaxJS

A continuación se muestra un ejemplo básico de la funcionalidad de WaxJS. Para utilizar esta demostración, haz clic en Inicio de Sesión WAX (si no has iniciado sesión automáticamente), luego haz clic en Firmar Transacción.

**Función de Auto-inicio de Sesión**
Si tu información de blockchain se muestra a continuación, estás automáticamente conectado a WaxJS, y no necesitas hacer clic en Inicio de Sesión WAX. ¡Esto elimina la necesidad de múltiples clics y ventanas emergentes!

**Inicio de Sesión WAX**
Usa esto si no has iniciado sesión automáticamente. Ten en cuenta que si estás autoconectado, hacer clic en esto no abrirá una ventana emergente y el userAccount aún se devuelve.

```html
<button class="text-md mt-4 border-black border-solid border-2 rounded px-4 py-2 w-40" id="login" onclick="login()">WAX Login</button>
```

**Firmar Transacción**
Haz clic una vez que hayas iniciado sesión.

```html
<button class="mt-4 border-black border-solid border-2 rounded px-4 py-2 w-40" id="sign" onclick="sign()">Sign Transaction</button>
```

## Ejemplos de Código

Para utilizar estos ejemplos, descarga y guarda [WaxJS](https://raw.githubusercontent.com/worldwide-asset-exchange/waxjs/develop/dist-web/waxjs.js) desde GitHub.

**Inicio de Sesión Simple**

```js
const wax = new waxjs.WaxJS({
    rpcEndpoint: 'https://wax.greymass.com'
});

autoLogin();

// verifica si el auto-inicio de sesión está disponible y llama a la función de inicio de sesión normal si lo está
async function autoLogin() { 
    var isAutoLoginAvailable = await wax.isAutoLoginAvailable(); 
    if (isAutoLoginAvailable) { 
        login(); 
    } 
} 

// inicio de sesión normal. Activa una ventana emergente para dapps no incluidas en la lista blanca
async function login() { 
    try { 
        const userAccount = await wax.login();  
    } catch(e) { 

    } 
}
```

**Demostración Completa**

Para ejecutar la demostración anterior, copia el siguiente código en **index.html**:

```html
<!DOCTYPE html>
<html>
<script src='waxjs.js'></script>

<body>

Below is a basic example of WaxJS functionality. To use this demo, click WAX Login (if you're not automatically logged in), then click Sign Transaction.

<strong>Auto-login Feature</strong>
<p>If your blockchain information displays below, you're automatically logged in to WaxJS, and you don't need to click WAX Login. This eliminates the need for multiple clicks and popups!</p>
<p style="color:#ef9d47" id="autologin"></p>

<strong>WAX Login</strong>
<p>Use this if you're not automatically logged in. Note that if you are auto-logged in, clicking this does not open a popup and the userAccount is still returned.</p>
<button id="login" onclick="login()">WAX Login</button>
<p style="color:#ef9d47" id="loginresponse"></p>
<p>&amp;nbsp;</p>
<strong>Sign Transaction</strong>
<p>Click once you're logged in.</p>
<button id="sign" onclick="sign()">Sign Transaction</button>
<pre><code id="response">Transaction Response
</code></pre>

<script>
    const wax = new waxjs.WaxJS({
        rpcEndpoint: 'https://wax.greymass.com'
    });

    // automatically check for credentials
    autoLogin();

    // checks if autologin is available 
    async function autoLogin() {
        let isAutoLoginAvailable = await wax.isAutoLoginAvailable();
        if (isAutoLoginAvailable) {
            let userAccount = wax.userAccount;
            let pubKeys = wax.pubKeys;
            let str = 'AutoLogin enabled for account: ' + userAccount + '<br/>Active: ' + pubKeys[0] + '<br/>Owner: ' + pubKeys[1];
            document.getElementById('autologin').insertAdjacentHTML('beforeend', str);
        }
        else {
            document.getElementById('autologin').insertAdjacentHTML('beforeend', 'Not auto-logged in');
        }
    }

    // normal login. Triggers a popup for non-whitelisted dapps
    async function login() {
        try {
            // if autologged in, this simply returns the user

Account with no popup
            let userAccount = await wax.login();
            let pubKeys = wax.pubKeys;
            let str = 'Account: ' + userAccount + '<br/>Active: ' + pubKeys[0] + '<br/>Owner: ' + pubKeys[1];
            document.getElementById('loginresponse').insertAdjacentHTML('beforeend', str);
        } catch (e) {
            document.getElementById('loginresponse').append(e.message);
        }
    } 

    async function sign() {
    if(!wax.api) {
        return document.getElementById('response').append('* Login first *');
    }

    try {
        const result = await wax.api.transact({
        actions: [{
            account: 'eosio',
            name: 'delegatebw',
            authorization: [{
            actor: wax.userAccount,
            permission: 'active',
            }],
            data: {
            from: wax.userAccount,
            receiver: wax.userAccount,
            stake_net_quantity: '0.00000001 WAX',
            stake_cpu_quantity: '0.00000000 WAX',
            transfer: false,
            memo: 'This is a WaxJS/Cloud Wallet Demo.'
            },
        }]
        }, {
        blocksBehind: 3,
        expireSeconds: 30
        });
        document.getElementById('response').append(JSON.stringify(result, null, 2))
    } catch(e) {
        document.getElementById('response').append(e.message);
    }
    }

</script>
</body>
</html>
```