---
title: WharfKit
order: 100
---

# WharfKit - The New Blockchain Accessibility Standard

One of the main challenges when developing applications on the Antelope blockchain, such as the WAX Blockchain, is the communication between the user and application layers with the blockchain layer.

## Main Problem

To communicate with the blockchain, it's necessary to:

- Start a session associated with a WAX account.
- Use tools to serialize, deserialize, and sign actions for reading or writing tasks.

For a long time, the **UAL (Universal-Authenticator Library)** tool was used. However, its latest version (V0.1.3) dates back to September 11, 2019, and its scalability with modern frameworks is limited.

The 1.0.0 version of **Wharfkit/session** has been a significant step, positioning Wharf as the new blockchain accessibility standard in Antelope environments.

## WharfKit

WharfKit is described as the “Javascript SDK Suite for Antelope blockchains”. Although it's in an early development phase, it consists of three modules:

- Account Kit
- Contract Kit
- Session Kit

So far, only **Session Kit** has been released, but it has generated high expectations in the developer community.

### Session Kit

This kit includes tools to create and maintain sessions (for both back-end and front-end applications). In this tutorial, we will introduce how to use the session kit in a front-end application with React.

#### Main Components

- **SessionKit**: Creates session instances and offers tools for their management.
- **Session**: Instances managed by SessionKit.

Additionally, it provides interfaces and plugins, such as:

- **WalletPlugin**: Connection with external wallets.
- **LoginPlugin**: Modifies the action flow during login.
- **TransactPlugin**: Logical structure to add custom code.

It's essential to mention **SessionStorage**, which preserves session instances between page loads.

<ChildTableOfContents :max="2" title="More inside this section" />