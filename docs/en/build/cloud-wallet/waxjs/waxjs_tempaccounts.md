---
title: WaxJS Temporary Accounts
order: 5
---

# WaxJS Temporary Accounts

**MyCloudWallet** allows the creation of temporary accounts that do not require the payment of the account creation fee. However, these accounts do not exist on the blockchain until this payment is made. This system is very useful for applications to create user accounts without the users having to pay the account creation fee directly or have prior knowledge of cryptocurrency purchases, transactions, etc.

Users can follow the normal account creation process, but when they reach the step of paying the creation fee, they can cancel and close the popup. From that moment on, the account will exist within the **MyCloudWallet** context, but not on the blockchain. This temporary account can be used to log in to applications that have **MyCloudWallet** integrated and allow the use of temporary accounts.

It is recommended to read the previous tutorials to understand how the `waxjs.js` library works and how to integrate **MyCloudWallet** into an application.

## Configuring the App to Allow Temporary Accounts

To allow temporary accounts in an application, the developer must configure **MyCloudWallet**'s login method to permit these accounts. This is done by adding the `returnTempAccounts` parameter with the value `true` in the login method configuration using the `waxjs.js` library.

```javascript
  const wax = new waxjs.WaxJS({
    rpcEndpoint: "https://apiwax.3dkrender.com",
    returnTempAccounts: true,
  });
```

## Creating Temporary Accounts by the User

Below is a simple example that illustrates the login process and verifies whether the account is temporary or not.

```javascript
  const wax = new waxjs.WaxJS({
    rpcEndpoint: "https://apiwax.3dkrender.com",
    returnTempAccounts: true,
  });

  let userAccount = await wax.login();
  if (wax.isTemp) {
    console.log("The account is temporary");
  } else {
    console.log("The account is not temporary");
  }
```

::: tip Note
The `login()` method of the `waxjs.js` library returns an object with the user's account information and a boolean `isTemp` that indicates whether the account is temporary or not, in addition to other data, as explained in previous tutorials.
:::

In our example, there is a "login" button that, when clicked, executes the code above. If there is no cached data of a previously created account or if no account has been created, the **MyCloudWallet** popup will open for the user to log in. If the user cancels the account creation fee payment, the account will be temporary.

![Login](https://3dkrender.com/wp-content/uploads/2024/08/login_01.png)
(Figure 1: MyCloudWallet popup to log in or create an account)

![Login](https://3dkrender.com/wp-content/uploads/2024/08/create_01.png)
(Figure 2: Accept the terms and conditions)

![Login](https://3dkrender.com/wp-content/uploads/2024/08/create_02.png)
(Figure 3: Step before paying the account creation fee. At this point, the user can cancel the process)

If the account already exists, the **MyCloudWallet** call will display a popup asking the user to log in, provided auto-login is not enabled.

![Login](https://3dkrender.com/wp-content/uploads/2024/08/login_03.png)
(Figure 4: MyCloudWallet popup to log in)

::: warning Warning
This is only possible if the `returnTempAccounts` parameter was set to `true` when creating the `wax` object. Otherwise, the modal will always show the payment screen for the account creation fee (if it is a temporary account).
:::

![Login](https://3dkrender.com/wp-content/uploads/2024/08/login_02.png)
(Figure 5: Modal to pay the account creation fee)

Once the login is complete, if the account is temporary, a message will be displayed in the console indicating that the account is temporary. If it is not, a message will indicate that the account is not temporary. Additionally, you can access other account details, such as the assigned name and the `Owner` and `Active` public keys.

![Login](https://3dkrender.com/wp-content/uploads/2024/08/final.png)
(Figure 6: Console example showing the verification of a temporary account)

Here is the complete example code:

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

## Payment of the Account Creation Fee by the Application

As mentioned, this system is very practical for facilitating account creation for decentralized application users. However, it is important to remember that the temporary account does not exist on the blockchain until the account creation fee is paid. Therefore, it is the application's responsibility to pay the account creation fee on behalf of the user.

Although the account creation cost is small, the application can take advantage of selling something through more conventional channels, such as credit card payment gateways, PayPal, etc.

For example, in a video game that sells card packs, the game could sell the cards through a conventional payment gateway and, upon purchase, the application could create the user’s account on the blockchain and associate the purchased cards with that account. This way, the user wouldn't have to worry about account creation or cryptocurrency purchases.

To do this, the application should be structured with a client-server architecture, where the server handles the blockchain transaction. The application should send the temporary account name to the server so that it can perform the blockchain transaction and convert the temporary account into a permanent account.

::: warning Warning
It is important to separate the application's logic between the client and the server to ensure the security of the application's private keys, which are necessary to perform blockchain transactions. These transactions should be done on the server, where private keys are protected and cannot be accessed.
:::

The server can make the payment using the `waxjs.js` library, executing a transaction as explained in previous tutorials. The current cost of creating an account on the WAX blockchain is 5 WAX, which can be checked [here](https://waxblock.io/account/newuser.wax?code=newuser.wax&scope=newuser.wax&table=settings&lower_bound=createval&upper_bound=createval&limit=10&reverse=false#contract-tables).

The transaction should be made to the `newuser.wax` account, with the temporary account name in the memo and the account creation cost in WAX. Once the transaction is completed, the temporary account will be converted into a permanent account, and the user will be able to use it for blockchain transactions as normal.

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

- **appAccount**: Application account making the transaction.
- **tempUserAccountName**: Name of the temporary account to be converted into

 a permanent account.

## Conclusion

**MyCloudWallet** allows the creation of temporary accounts that do not require the payment of the account creation fee. This system is very useful for applications to create user accounts without requiring the users to pay the account creation fee directly or have prior knowledge of cryptocurrency purchases, transactions, etc. However, it is important to remember that the temporary account does not exist on the blockchain until the fee is paid. Therefore, it is the application’s responsibility to pay the account creation fee on behalf of the user.
