---
title: WharfKit - Multi Session
order: 110
---

# Multi Session with WharfKit

## Introduction

WharfKit allows logging in to multiple blockchains as well as using different user accounts. This is useful for applications that need to interact with, for example, an NFT marketplace that allows users to buy and sell NFTs.

Each time a user logs in to a blockchain, a session is created. A session contains user account information, such as the username, public key, and private key. It also contains blockchain information, such as the blockchain ID. This information is stored in the browser's local storage and is never sent to any server.

WharfKit can manage multiple sessions for easy switching between them. Let's see how to do it.

## Understanding the Session Kit

The session kit is responsible for managing sessions. To do this, it provides a series of methods that allow us to create, and restore sessions. To familiarize ourselves with the session kit, we recommend reading the article [WharfKit - How To React](/build/tutorials/wharfkit/howto_react) in this documentation.

## Retrieving Sessions

Thanks to the `getSessions()` method of the session kit, we can retrieve all the sessions that have been created. This method returns an array of sessions, which we can go through to obtain information about each one.

```javascript
sessionKit
    .getSessions()
    .then((globalSessions: SerializedSession[] | undefined) => {
        if (globalSessions) {
            console.log(
                'Total sessions retrieved: ',
                globalSessions.length
            );
        }
        // filter sessions by blockchain
        const sessionsThisChain = globalSessions?.filter(
            (session: SerializedSession) => {
                return session.chain === chainId;
            }
        );
        // filter sessions by wallet. In this case, Anchor
        const sessionsThisWallet = globalSessions?.filter(
            (session: SerializedSession) => {
                return session.walletPluguin.id === 'anchor';
            }
        );
    });
```

## Switching Sessions

To switch sessions, we simply need to call the `restore()` method of the session kit, passing the session we want to restore as a parameter. This method returns a promise that resolves with the restored session.

```javascript
// ....
const session: SerializedSession = sessionsThisChain[0];
// ....

sessionKit.restore(session).then((session: Session | undefined) => {
    if (session) {
        console.log('Session restored: ', session);
    }
});
```

The storage of sessions is done in an object of type `SerializedSession`.

```javascript
interface SerializedSession {
    actor: NameType;
    chain: Checksum256Type;
    default?: boolean;
    permission: NameType;
    walletPlugin: SerializedWalletPlugin;
}
```

It is worth noting that the `default` attribute indicates whether the session is the default session. This is useful for knowing which session is being used at any given time.

## Adding Sessions

To add a session, we simply need to call the `login()` method of the session kit. This method returns a promise that resolves with the added session.

```javascript
sessionKit.login().then((session: Session | undefined) => {
    if (session) {
        console.log('Session added: ', session);
    }
});
```

## Logging Out

To log out of a session, we simply need to call the `logout()` method of the session kit, passing the session we want to close as a parameter. If no parameter is passed, the default session will be closed.

```javascript
sessionKit.logout(session);
```
