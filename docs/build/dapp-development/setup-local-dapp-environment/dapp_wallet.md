---
title: Create a Wallet
order: 43
lang: en
---

A WAX wallet is a named, encrypted repository of public and private key pairs that are stored in a file on your local server (not the blockchain). You'll need to create a development wallet to:

- Create local WAX Blockchain Accounts
- Sign actions performed on your local blockchain

## How it Works

To create an account on your local blockchain, you'll need to have a pre-generated **owner** public key (required) and an **active** public key (optional). You can use your local development wallet to create and store these keys. 

### Default Wallet Content - Public/Private Key Pairs
```shell
[[
    "EOS4yxqE5KYv5XaB2gj6sZTUDiGzKm42KfiRPDCeXWZUsAZZVXk1F",
    "5JTZaN1zabi5wyC3LcdeZG3AzF7sLDX4JFqMDe68ThLC3Q5nYez"
  ],[
    "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
    "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"
  ]
]
```

Your wallet will use these keys to sign your smart contract's actions and broadcast the signature to your local network. If the network confirms that the transaction is valid, it's included in a block on the blockchain. 

:::tip
Wallets do not store tokens - just the key pairs associated with a blockchain account. 
:::

In this guide, you'll use **cleos** to create, open, and unlock a new wallet.

:::warning
<strong>Note:</strong> <strong>nodeos</strong> does not need to be running to complete these steps. **kleos** will start automatically (if it's not running already).
:::


## Create a Default Wallet

To create a new wallet, use the `wallet create` command:

```shell
cleos wallet create --to-console
```

This command creates a wallet named **default**, saved to a local path (e.g. "/home/username/eosio-wallet/default.wallet"). 

:::tip
<strong>Tip:</strong> You can also include the --name parameter to name a wallet: `cleos wallet create --name mywallet --to-console`.
:::

The `--to-console` parameter prints your password to the console. Be sure to save this password someplace safe (you'll need it to unlock your wallet).

```shell
warn  2019-07-16T22:39:39.847 thread-0  wallet.cpp:223                save_wallet_file     ] saving wallet to file /home/username/eosio-wallet/./default.wallet
Creating wallet: default
Save password to use in the future to unlock this wallet.
Without password imported keys will not be retrievable.
"PW5KRXKVx25yjL3FvxxY9YxYxxYY9Yxx99yyXTRH8DjppKpD9tKtVz"
```

:::tip
<strong>Tip:</strong> For a complete list of cleos wallet subcommands and parameters, refer to <a href="https://docs.eosnetwork.com/leap/latest/cleos/command-reference/wallet/" target="_blank">Cleos Reference Guide</a>.
:::

## Open and Unlock Your Wallet

Wallets are closed by default (when starting a **keosd** instance). To open your wallet, use the `wallet open` command:

```shell
cleos wallet open
```

The console prints out that your **default** wallet is open: `Opened: default`.

:::tip
<strong>Tip:</strong> You can also include the --name parameter to open a wallet by name: `cleos wallet open --name named-wallet`.
:::

Now that your wallet is open, you'll need to unlock it. You can use the `cleos wallet open --name named-wallet` command to unlock it in one step. Use the password that was printed to the console when you created your wallet.

```shell
cleos wallet unlock --password PW5KRXKVx25yjL3FvxxY9YxYxxYY9Yxx99yyXTRH8DjppKpD9tKtVz
```

The console prints out that your **default** wallet is unlocked: `cleos wallet open --name named-wallet`.

:::tip
<strong>Tip:</strong> By default, **keosd** will auto-lock your wallets after 15 minutes of inactivity. To disable this feature, you'll need to modify the **/home/username/eosio-wallet/config.ini** flag to an extremely large number. Setting it to 0 will cause keosd to always lock your wallet.
:::


To determine if your wallet is Locked/Unlocked, you can use the following command:

```shell
cleos wallet list
```

The console prints your wallet names, with an asterisk (*) to indicate that your wallet is Unlocked:

```shell
Wallets:
[
  "default *"
]
```

:::tip
<strong>Tip:</strong> If you come back to this step later (after terminating your **kleos** instance) and your **default** wallet isn't listed: `cleos wallet open --name named-wallet`, you'll need to Open and Unlock your wallet again.
:::


## Import the Local Development Key

For development purposes, every WAX chain includes a default system user called **eosio**. This account is used to set up your local chain by loading system contracts that dictate the governance and consensus. 

In your local development environment, this **eosio** user will simulate your WAX Blockchain Account. You can use the **eosio** user to create new accounts and push your smart contracts to your local blockchain, without having to worry about staking any WAX. 

To sign transactions on behalf of the **eosio** system user, you'll need to import the **eosio** development key into your wallet. 

:::tip
<strong>Important:</strong> This development key is the **same for all WAX and Antelope developers**. Never use this key for a production WAX Account! Doing so will most certainly result in the loss of access to your account.
:::


```shell
cleos wallet import --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
```

The console prints that your development key has been imported for: (your private wallet key).

```shell
imported private key for: EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
```
