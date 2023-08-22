---
title: WharfKit - React Tutorial
order: 101
---

# Using SessionKit

To install the kit in a JavaScript or TypeScript (React) application:

```bash
yarn add @wharfkit/session @wharfkit/web-renderer @wharfkit/wallet-plugin-anchor
```

For a complete React example, check [this link](https://github.com/3dkrender/WAX_CS_Template).

## Preparing the Session

The code to prepare the session would look like this:

```javascript
// ... (previous code)

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

// ... (rest of the code)
```
:::tip Note
For the example, some data is taken from environment files, and their values will vary depending on the blockchain. For instance, to differentiate between mainnet and testnet:

VITE_CHAIN=testnet  
VITE_RPC=http://tapiwax.3dkrender.com  
VITE_CHAINID=f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12

VITE_CHAIN=mainnet  
VITE_RPC=http://apiwax.3dkrender.com  
VITE_CHAINID=1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4
:::

[Sample Code](https://github.com/3dkrender/WAX_CS_Template/blob/main/Client/src/App.tsx)

# Login

To create our session instance, we need to call the login method from the session kit. We can use a button that, when pressed, triggers the call to the component. In the mentioned template, this component is called from the login button located in the main menu of the application 

[Sample Code](https://github.com/3dkrender/WAX_CS_Template/blob/main/Client/src/components/Menu/Menu.tsx).

The first step will be to retrieve the session kit instance that we have already created:

```javascript
import { sessionKit } from "../../App";
```

Every time a page of our application is reloaded, we can check if a user session already exists. If it does, we can retrieve it and avoid logging in again. This can be done using the useEffect hook:

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
If not session, then login:

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
          Login
      </Button>
    }
    {
      session &&
      <Button onPress={logout}>
          Logout
      </Button>
    }
  )
```

# Logout

To log out, it will be necessary to call the logout method from the session kit. This can be done through another button that is accessible, in this case, when there is an active session.

# Restore the Session

As we have seen, to retrieve the active session from any page of our application, we simply need to import the session kit instance and check if there is a session to restore.

For instance, in this component, we retrieve the session to know the username and request the server, using axios, for a list of available tokens in that user's wallet. To make the call, we need to pass the wallet name to the server as a parameter.

```javascript
export const GetUserTokens = () => {
  const [tokens, setTokens] = useState<TTokens>([]);

  useEffect(() => {
    sessionKit.getSessions().then((sessions) => {
      if (sessions.length) {
        const userName = String(sessions[0].actor);
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

The session kit can manage multiple sessions, but in our example, we will only have one session at a time, so it will be sufficient to retrieve the first element from the sessions array.
The account name in WAX is a 64-bit number. To get its string equivalent, we need to convert it using String().

[Sample Code](https://github.com/3dkrender/WAX_CS_Template/blob/main/Client/src/Pages/GetUserTokens/GetUserTokens.tsx)

# Sign and Send a Transaction

We've already seen how to retrieve the session from any component. Once retrieved, another operation of great interest to us is to send a transaction to the blockchain on behalf of the user.

:::warning Important
The operations that the user must sign should be requested from the client side. Our component will generate the transaction, thanks to the tools of the session kit, and this transaction will be sent to the user's wallet for signing. This means the user doesn't need to share their private key with the application at any time.

If we wanted to make a transaction on behalf of the application itself, we would need to have the private key of the application's account available, which carries inherent risks. This will never be done on the client side. If our application needs to use a password or private key, it should do so from the server side, always outside the user's context.
:::

To prepare the transaction and send it to the wallet to be signed the function is

```javascript
session.transact()
```

As a parameter, we can pass an action or an array of actions, in addition to other useful options such as the wait time before considering the transaction as expired (expireSeconds) or whether we want the transaction to be published on the blockchain or just simulated (broadcast) - useful for testing purposes.

In the analyzed sample code, it has been decided to assume that an array of actions (actions[]) will always be sent, with at least one action. Given that this might be a repetitive operation, the actions will be defined in the corresponding components and executed from a helper function.

Definition of the actions array:

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
          memo: 'WAX donation',
        },
      }]
    });
```
[Sample Code](https://github.com/3dkrender/WAX_CS_Template/blob/7b35853b5d7f44482b20a342fc27054989fff93d/Client/src/Pages/Transaction/PushTransaction.tsx#L31C10-L31C10)

Creation of the transaction, sending to the wallet, and receiving the result:

```javascript
export const TAPOS = {
  blocksBehind: 3,
  expireSeconds: 120,
  broadcast: false
};

export const InitTransaction = async (dataTrx: IBaseTransaction ) => {
  
  const session = await sessionKit.restore();
  if (!session) {
    console.log("No session found");
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
[Sample Code](https://github.com/3dkrender/WAX_CS_Template/blob/7b35853b5d7f44482b20a342fc27054989fff93d/Client/src/services/InitTransaction.ts#L15)

:::tip Note
The displayed code is for educational purposes and aims to be as simple and explanatory as possible. Each user should adapt it to their needs and optimize it according to their preferences.
:::

# Conclusion

Although WharfKit is in its early stages of development, it has great potential. I recommend following the [project on Github](https://github.com/wharfkit) and the [official documentation](https://wharfkit.com/docs).

