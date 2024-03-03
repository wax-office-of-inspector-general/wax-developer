---
title: WharfKit - Tutorial React
order: 101
---

# Usando SessionKit

Para instalar el kit en una aplicación JavaScript o TypeScript (React):

```bash
yarn add @wharfkit/session @wharfkit/web-renderer @wharfkit/wallet-plugin-anchor
```

Para un ejemplo completo en React, revisa [este enlace](https://github.com/3dkrender/WAX_CS_Template).

## Preparando la Sesión

El código para preparar la sesión se vería así:

```javascript
// ... (código anterior)

const chains = [
  {
    id: import.meta.env.VITE_CHAINID,
    url: import.meta.env.VITE_RPC,
  }
];

const walletPlugins = [];
walletPlugins.push(new WalletPluginAnchor());
if (import.meta.env.VITE_CHAIN === 'mainnet') {
  walletPlugins.push(new WalletPluginCloudWallet());
}

export const sessionKit = new SessionKit({
  appName: import.meta.env.VITE_SITE_TITLE,
  chains,
  ui: new WebRenderer(),
  walletPlugins,
});

// ... (resto del código)
```
:::tip 📝 Nota
Para el ejemplo, se toman algunos datos de archivos de entorno y sus valores variarán dependiendo de la blockchain. Por ejemplo, para diferenciar entre mainnet y testnet:

VITE_CHAIN=testnet  
VITE_RPC=http://tapiwax.3dkrender.com  
VITE_CHAINID=f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12

VITE_CHAIN=mainnet  
VITE_RPC=http://apiwax.3dkrender.com  
VITE_CHAINID=1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4
:::

[Código de Ejemplo](https://github.com/3dkrender/WAX_CS_Template/blob/main/Client/src/App.tsx)

# Inicio de Sesión

Para crear nuestra instancia de sesión, necesitamos llamar al método de inicio de sesión del kit de sesión. Podemos usar un botón que, al presionarse, active la llamada al componente. En la plantilla mencionada, este componente se llama desde el botón de inicio de sesión ubicado en el menú principal de la aplicación 

[Código de Ejemplo](https://github.com/3dkrender/WAX_CS_Template/blob/main/Client/src/components/Menu/Menu.tsx).

El primer paso será recuperar la instancia del kit de sesión que ya hemos creado:

```javascript
import { sessionKit } from "../../App";
```

Cada vez que se recarga una página de nuestra aplicación, podemos verificar si ya existe una sesión de usuario. Si es así, podemos recuperarla y evitar iniciar sesión nuevamente. Esto se puede hacer usando el hook useEffect:

```javascript
  const [session, setSession]: [Session | undefined, Dispatch<SetStateAction<Session | undefined>>] = useState<Session | undefined>(undefined);

  useEffect(() => {
    sessionKit.restore().then((session: Session | undefined) => {
      if (session) {
        setSession(session);
      }
    })
  }, []);
```
Si no hay sesión, entonces iniciar sesión:

```javascript
  const login = async () => {
    const response = await sessionKit.login()
    if (response.session) {
      setSession(response.session);
    }
  };

  const logout = async () => {
    sessionKit.logout()
    setSession(undefined);
  }

  return (
    {
      !session &&
      <Button onPress={login}>
          Iniciar Sesión
      </Button>
    }
    {
      session &&
      <Button onPress={logout}>
          Cerrar Sesión
      </Button>
    }
  )
```

# Cerrar Sesión

Para cerrar la sesión, será necesario llamar al método de cierre de sesión del kit de sesión. Esto se puede hacer a través de otro botón que sea accesible, en este caso, cuando hay una sesión activa.

# Restaurar la Sesión

Como hemos visto, para recuperar la sesión activa desde cualquier página de nuestra aplicación, simplemente necesitamos importar la instancia del kit de sesión y verificar si hay una sesión para restaurar.

Por ejemplo, en este componente, recuperamos la sesión para conocer el nombre de usuario y solicitar al servidor, usando axios, una lista de tokens disponibles en la billetera de ese usuario. Para hacer la llamada, necesitamos pasar el nombre de la billetera al servidor como parámetro.

```javascript
export const GetUserTokens = () => {
  const [tokens, setTokens] = useState

<TTokens>([]);

  useEffect(() => {
    sessionKit.restore().then((session: Session | undefined) => {
      if (session) {
        const userName = String(session.actor);
        ctGetUserTokens(userName)
          .then((res: any) => {
            setTokens(res);
          })
          .catch((err: any) => {
            console.log(err);
          });
      }
    });
  }, [])
```

El kit de sesión puede gestionar múltiples sesiones, pero en nuestro ejemplo, solo tendremos una sesión a la vez, por lo que será suficiente recuperar el primer elemento del array de sesiones. El nombre de la cuenta en WAX es un número de 64 bits. Para obtener su equivalente en cadena, necesitamos convertirlo usando String().

[Código de Ejemplo](https://github.com/3dkrender/WAX_CS_Template/blob/main/Client/src/Pages/GetUserTokens/GetUserTokens.tsx)

# Firmar y Enviar una Transacción

Ya hemos visto cómo recuperar la sesión desde cualquier componente. Una vez recuperada, otra operación que nos interesará mucho es enviar una transacción a la blockchain en nombre del usuario.

:::warning Importante
Las operaciones que el usuario debe firmar deben solicitarse desde el lado del cliente. Nuestro componente generará la transacción, gracias a las herramientas del kit de sesión, y esta transacción se enviará a la billetera del usuario para que la firme. Esto significa que el usuario no necesita compartir su clave privada con la aplicación en ningún momento.

Si quisiéramos hacer una transacción en nombre de la propia aplicación, necesitaríamos tener disponible la clave privada de la cuenta de la aplicación, lo que conlleva riesgos inherentes. Esto nunca se hará en el lado del cliente. Si nuestra aplicación necesita usar una contraseña o clave privada, deberá hacerlo desde el lado del servidor, siempre fuera del contexto del usuario.
:::

Para preparar la transacción y enviarla a la billetera para ser firmada, la función es

```javascript
session.transact()
```

Como parámetro, podemos pasar una acción o un array de acciones, además de otras opciones útiles como el tiempo de espera antes de considerar la transacción como expirada (expireSeconds) o si queremos que la transacción se publique en la blockchain o solo se simule (broadcast) - útil para propósitos de prueba.

En el código de ejemplo analizado, se ha decidido asumir que siempre se enviará un array de acciones (actions[]), con al menos una acción. Dado que esta podría ser una operación repetitiva, las acciones se definirán en los componentes correspondientes y se ejecutarán desde una función auxiliar.

Definición del array de acciones:

```javascript
    const trx: any = await InitTransaction({
      actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
          actor: userName,
          permission: 'active',
        }],
        data: {
          from: userName,
          to: '3dkrenderwax',
          quantity: `${value} WAX`,
          memo: 'Donación en WAX',
        },
      }]
    });
```
[Código de Ejemplo](https://github.com/3dkrender/WAX_CS_Template/blob/7b35853b5d7f44482b20a342fc27054989fff93d/Client/src/Pages/Transaction/PushTransaction.tsx#L31C10-L31C10)

Creación de la transacción, envío a la billetera y recepción del resultado:

```javascript
export const TAPOS = {
  blocksBehind: 3,
  expireSeconds: 120,
  broadcast: false
};

export const InitTransaction = async (dataTrx: IBaseTransaction ) => {
  
  const session = await sessionKit.restore();
  if (!session) {
    console.log("No se encontró sesión");
    return null;
  }
  
  const actions =  [
      ...dataTrx.actions
    ]

  try {
    const transaction = await session.transact({actions}, TAPOS);
    if(transaction) return {transactionId: String(transaction.resolved?.transaction.id), actions: actions};
  } catch (error) {
    console.log(error);
    return null;
  }
}
```
[Código de Ejemplo](https://github.com/3dkrender/WAX_CS_Template/blob/7b35853b5d7f44482b20a342fc27054989fff93d/Client/src/services/InitTransaction.ts#L15)

:::tip 📝 Nota
El código mostrado tiene carácter educativo y trata de ser lo más sencillo y explicativo posible. Cada usuario debe adaptarlo a sus necesidades y optimizarlo según sus preferencias.
:::

# Conclusión

Aunque WharfKit está en sus primeras etapas de desarrollo, tiene un gran potencial. Recomiendo seguir el [proyecto en Github](https://github.com/wharfkit) y la [documentación oficial](https://wharfkit.com/docs).