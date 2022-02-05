---
title: Use WaxJS
layout: default
parent: WaxJS Overview
grand_parent: WAX Cloud Wallet
lang-ref: Use WaxJS
lang: en
---

The **WaxJS** library exposes four primary components:

* **wax.userAccount.** WAX Account user name, returned when you make a call to `wax.login()`.
* **wax.pubKeys.** A user's active and owner keys. Available once a user's logged in or if you pass the keys in the WaxJS constructor.
* **wax.api.** Use this to execute standard eosjs transactions.
* **wax.rpc.** Use this to make API calls to the WAX Blockchain. Refer to [WAX RPC API](/docs/en/api-reference/) for more information.

To use **WaxJS**: 

1. Import the Library. React style apps using npm or yarn can import the library via:

    ```js
    import * as waxjs from "@waxio/waxjs/dist";
    ```

    You can also download and save [WaxJS](https://raw.githubusercontent.com/worldwide-asset-exchange/waxjs/develop/dist-web/waxjs.js) from GitHub and include the file on a web page:

    ```js
    <script src='waxjs.js'></script>
    ```

2. There are several ways to instantiate the WaxJS constructor, depending on what information you have for your users. Constructor parameters include:

    * The URL for the RPC Server you wish to connect to (required)
    * A user's WAX Blockchain Account name (optional)
    * An Array of public keys for a specific account (optional)
    * Autologin bool value (optional)

    To let WaxJS to assign the appropriate user values, you can simply pass an RPC URL:

    ```js
    const wax = new waxjs.WaxJS({
      rpcEndpoint: 'https://wax.greymass.com'
    });
    ```

    **Notice:** The constructor for WaxJS changed with version 1.0. If you are updating from a previous version you will need to change the constructor.
    {: .label .label-yellow }

    The library can also be instantiated with the user account and public keys. If you have this information, you can pass it to the WaxJS constructor.

    ```js
    const wax = new waxjs.WaxJS({
      rpcEndpoint: 'https://wax.greymass.com',
      userAccount: '3m1q4.wam',
      pubKeys: ['EOS6rjGKGYPBmVGsDDFAbM6UT5wQ9szB9m2fEcqHFMMcPge983xz9','EOS7wTCoctybwrQWuE2tWYGwdLEGRXE9rrzALeBLUhWfbHXysFr9W']
    });
    ```
    
    **Tip:** If you pass these additional parameters, you won't need to call the autoLogin method.
    {: .label .label-yellow }




3. Before you can start signing transactions from your dApp, a user must be logged in. WaxJS includes an `isAutoLoginAvailable` function that:

    * Securely checks for WAX Cloud Wallet credentials
    * Checks to see if your dApp is whitelisted

    If both conditions are true, a user's userAccount and public keys are set in your WaxJS object, and you don't need to call the `login()` function. You'll also have access to wax.userAccount and wax.pubKeys.

    ```js
        //if true, popup won't be triggered; user is now logged in
        var isAutoLoginAvailable = await wax.isAutoLoginAvailable();
        var userAccount = wax.userAccount
        var pubKeys = wax.pubKeys
    ```

    If auto-login is not available, you can easily use the `login()` function to allows users to sign in or sign up using WAX Cloud Wallet.

    ```js
    //normal login. Triggers a popup for non-whitelisted dapps
    async function login() {
      try {
         const userAccount = await wax.login();
         const pubKeys = wax.pubKeys;
      } catch (e) {
         
      }
    }
    ```

    The `login()` function opens WAX Cloud Wallet in a new browser window. Users are prompted that your dApp would like to "Know your WAX Account Name." Once they click Approve, they're redirected back to your dApp 

    A successful login returns the userAccount (e.g., jq3ao.wam), and you can also access this property by calling `wax.userAccount`.

4. Send a Transaction

    Now that you have a user's WAX Account name, you can use the `wax.api` object to build your transaction.

    **Note:** The `wax.api` method is not initialized until you log a user in or pass a user's information in the WaxJS constructor. 
    {: .label .label-yellow }
    

    ```js
    const result = await wax.api.transact({
      actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
          actor: wax.userAccount,
          permission: 'active',
        }],
        data: {
          from: wax.userAccount,
          to: 'eosio',
          quantity: '0.00000001 WAX',
          memo: '',
        },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 1200,
    });
    ```

    **Tip:** The `wax.api` method is an instance of the **eosjs** object, and provides the same functionality. Refer to the [eosjs](https://eosio.github.io/eosjs/latest) docs for more information.
    {: .label .label-yellow }

    The `wax.api.transact()` function launches WAX Cloud Wallet in a new browser window. On this screen, users can review the transaction details and Approve or Deny the transaction. Once users click Approve, the transaction is signed on the WAX Blockchain and users are returned to your dApp.









