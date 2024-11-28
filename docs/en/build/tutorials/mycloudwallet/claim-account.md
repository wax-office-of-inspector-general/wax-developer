---
title: Claim CloudWallet Account
order: 100
---

# User accounts, passwords and Wallets guarded

An account allows you to identify a user or entity, such as a smart contract. Accounts have permissions that authorize them, or not, to use actions from other smart contracts. Beads can be between 1 and 12 characters long and can only include the lowercase letters a-z, numbers 1-5, and the period.

If, for example, a smart contract allows an action to mint an NFT and a user wants to mint that NFT, the user must have the appropriate permission associated with it and must also be able to demonstrate it.

## Proving Possession

To prove the possession of the accounts and the rights to use the associated permissions are the account keys. The keys are managed in pairs having for each type of associated permission a public key and a private key.

## Basic Permissions

The basic permissions for an account are “Owner” and “Active”

- **Owner**: Authorizes account ownership operations, such as changing keys for any other permissions, creating permissions, etc. The keys associated with this permission should never be used in third-party applications to identify themselves or perform generic tasks.
- **Active**: Generic permission for the usual operations in the blockchain.

In addition to these permissions, it is possible to create more permissions associated with the account, with their own key pairs, to limit them to the use of specific actions against specific smart contracts.

## MyCloudWallet is a Custodial Wallet

MyCloudWallet is a custodial wallet, that is, the custody of the private keys is done by the wallet and the user has no control over them. This practice has its advantages and disadvantages:

### Advantages

- It frees the noob user from the task of guarding and managing the keys to avoid forgetting, losing or stealing them.
- It offers a method of identification and access to the applications more friendly and available anywhere since it only requires the login method used to create the account through a pop-up web window.

### Inconvenience

- Use of the account is limited to MyCloudWallet’s own options and features.
- If the MyCloudWallet service were hacked all the guarded keys could be exposed.

For most users the use of MyCloudWallet as a custodial wallet is sufficient, but if the user requires a higher level of usability, which implies the use of the private keys of the account, he can request the transfer of custody partially or completely.

# Claim your WAX Cloud Wallet account

The first thing we’re going to do before claiming a MyCloudWallet account is to generate two key pairs for the Owner and Active permissions. For this we can use the official WAX Blockchain Explorer ([The Official WAX Blockchain Explorer](https://waxblock.io/))

![WAX Blockchain Explorer](https://3dkrender.com/wp-content/uploads/2023/10/capture_martes-3-de-octubre-de-2023_11h05m31s_001_-768x376.png)

1. Navigate to the menu: **Wallet** (1), **Utilities** (2).
2. Click on the “Generate new keys” button (3). (Feel free to click several times to generate different keys, ensuring more randomness.)
3. Copy the public key (4) and private key (5) generated for the first permission, Owner. Repeat steps 2, 3, and 4 to generate another key pair for the Active permission.
4. Store the keys in a safe place, ensuring to correctly identify which keys are for Owner and which are for Active.

## Changing the key format

The WAX explorer uses a modern key system, but MyCloudWallet still uses the old system, necessitating a format change.

![WAX Blockchain Explorer](https://3dkrender.com/wp-content/uploads/2023/10/capture_martes-3-de-octubre-de-2023_11h43m51s_003_-1024x414.png)

1. In the same **Wallet**, **Utilities** section, navigate to **Format Keys**.
2. This tool allows for a format change from modern to old (retaining the same key value).
3. Change the format of the previously generated Owner and Active public keys.
4. Paste the public key in the text box (2) and click the button (3) to display the old format key, which should begin with “EOS…”

(No need to do this for private keys, but keep in mind for potential future wallet imports.)

## Claim your account from WAX Cloud Wallet

Prepared with the necessary keys, proceed to claim your account.

![WAX Cloud Wallet](https://3dkrender.com/wp-content/uploads/2023/10/capture_lunes-2-de-octubre-de-2023_16h55m06s_003_-1024x725.png)

1. Visit [WAX Cloud Wallet website](https://www.mycloudwallet.com) and log in.
2. Once inside the MyCloudWallet management panel, navigate to **Settings** (1), then **Account Claiming** (2).
3. Two account claim options are presented.
   - **Soft Claim** (3): Retains control and custody of the keys while keeping the account linked to MyCloudWallet for continued tool access. Touted as “The best of both worlds”.
   - **Hard Claim** (4): Similar key management as Soft Claim, but fully unlinks the MyCloudWallet account, necessitating third-party wallets like Anchor or Wombat for access. Re-association with MyCloudWallet is possible in future.

### Soft Claim

1. Under Soft Claim, enter the PUBLIC keys for Owner (1) and Active (2) permissions using the old key format (starting with EOS…). (If you’ve followed the preparation steps, these keys are readily available.)
2. Carefully read the displayed information, ensuring correct keys are used to avoid account access loss.
3. Select the compliance box (3) and sign the transaction to initiate the account claim request.

![WAX Cloud Wallet](https://3dkrender.com/wp-content/uploads/2023/10/capture_martes-3-de-octubre-de-2023_12h48m57s_001_.png)

In the next step, a security code is emailed for additional verification.

1. Enter the emailed numerical key (1) and click **Next** (2).
2. Wait for the claim process to complete, after which you can link the MyCloudWallet account to a third-party wallet such as Anchor or Wombat.

### Hard Claim

Accounts claimed through Soft Claim maintain the multisig system with MyCloudWallet so that the user can continue to use MyCloudWallet to log in and to access the interface tools of their website. The user will be able to log in to other applications using other wallets such as Anchor or Wombat, but will not be able to sign transactions due to the multisignature system.

With the Hard claim, the multisig is eliminated, so the account is completely disconnected from the MyCloudWallet service and controlled 100% by the user. You will no longer be able to log in through MyCloudWallet anywhere but you can link the account to a wallet such as Anchor or Wombat to do so and continue using your account as normal as do those users who have their own accounts.

The process to make Hard Claim is identical to the process for Soft Claim and can be done from the first moment or after having made Soft Claim.

If we regret having made Hard Claim (or need to link our account with MyCloudWallet again) we can relink the account by following the steps below in the next section.