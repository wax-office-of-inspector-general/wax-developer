---
title: Guide - Linking Wallet Connect with WAX Blockchain
order: 2
---

# Integration Guide: Linking Wallet Connect with WAX Blockchain

This guide walks you through the integration of Wallet Connect and WAX Blockchain, shedding light on the essential RPC interfaces and their intricacies. Whether you're a seasoned developer or a novice in the world of blockchain, this comprehensive overview will navigate you through the processes of setting up, signing, and pushing transactions seamlessly.

![](/assets/images/build/wallet-connect/wallet-connect-integration.png)

## I. Setting up Wallet Connect < > WAX Blockchain
* JSON-RPC spec for Wallets: [https://docs.eosnetwork.com/apis/leap/latest/](https://docs.eosnetwork.com/apis/leap/latest/)
* CASA namespace spec: [Antelope CAIP Entry ChainAgnostic/namespaces#93](https://github.com/ChainAgnostic/namespaces/pull/93)
* Namespaces: antelope
* Chains:
    1. WAX Mainnet - antelope:1064487b3cd1a897ce03ae5b6a865651
    2. WAX Testnet - antelope:f16b1833c747c43682f4386fca9cbb32
* RPC endpoints: [https://wax.validationcore.io/reports/nodes/api](https://wax.validationcore.io/reports/nodes/api)
* [SLIP-0044](https://github.com/satoshilabs/slips/blob/master/slip-0044.md) coin type: 14001


## II. Login Session with WalletConnect

Utilize a socket-based login session to establish a connection between a decentralized application (Dapp) and WalletConnect.


**Parameters**

<table>
  <tr>
   <td>
requiredNamespaces
   </td>
   <td>{
<br>
        chains?: string[];
<br>
        methods: string[];
<br>
        events: string[];
<br>
}
   </td>
   <td>chain: list chain id support(Currently, only support one wax chain)
<br>
Method: list support method
<br>
Events: list support events
   </td>
  </tr>
  <tr>
   <td>pairingTopic
   </td>
   <td>string
   </td>
   <td>Pairing topic id
   </td>
  </tr>
</table>

**Example:**

```json
requiredNamespaces: {
  wax: {
    methods: [
      "wax_sign_transaction",
      "wax_sign_message",
      "wax_push_transaction",
      "wax_sign_push_transaction",
      "wax_sign_pushed_transaction",
      "wax_request_account",
      "wax_get_available_keys",
      "wax_get_required_keys"
    ],
      chains: [
        "antelope:1064487b3cd1a897ce03ae5b6a865651"
      ],
        events: []
  }
},
pairingTopic: '4738621948defd3bf860cd2a235f1d998ed7e136fd3c82f19f3cd6ce7f8abcc8'


```



**Response:**

If the request is rejected, a 4001 error will be returned.

**Example:**

```json
{
    "message": "User rejected methods.",
    "code": 5002
}
```


If the request is accepted, a WAX account string is returned.


**Example**


```json
{
  topic: "6907a4234c1f1cd21e668514997995c614bfe5c5cf7b87b4840e0135b77205aa",
  relay: {
    protocol: "irn"
  },
  expiry: 1692803184,
  namespaces: {
    wax: {
      accounts: [
        "antelope:1064487b3cd1a897ce03ae5b6a865651:qs.wam@active"
      ],
      methods: [
        "wax_sign_transaction",
        "wax_sign_message",
        "wax_push_transaction",
        "wax_sign_push_transaction",
        "wax_sign_pushed_transaction",
        "wax_request_account",
        "wax_get_available_keys",
        "wax_get_required_keys"
      ],
      events: []
    }
  },
  acknowledged: true,
  pairingTopic: "829b57ad756e90851f73880abec4495b1ae76ba25e4f1dd72dfd802d25088b66",
  requiredNamespaces: {
    wax: {
      methods: [
        "wax_sign_transaction",
        "wax_sign_message",
        "wax_push_transaction",
        "wax_sign_push_transaction",
        "wax_sign_pushed_transaction",
        "wax_request_account",
        "wax_get_available_keys",
        "wax_get_required_keys"
      ],
      chains: [
        "antelope:1064487b3cd1a897ce03ae5b6a865651"
      ],
      events: []
    }
  },
  optionalNamespaces: {},
  controller: "eb288c78fa542b94163d511d8742ae46ce2809d7512aa58b50965cea95fbe643",
  self: {
    publicKey: "18a1f6da1dfa6f4147c017d22a62ea86232ed90c3742324ae29cc8270b756373",
    metadata: {
      description: "React App for WalletConnect",
      url: "http://localhost:3000",
      icons: [
        "https://avatars.githubusercontent.com/u/37784886"
      ],
      name: "React App"
    }
  },
  peer: {
    publicKey: "eb288c78fa542b94163d511d8742ae46ce2809d7512aa58b50965cea95fbe643",
    metadata: {
      name: "Cloud Wallet",
      description: "Cloud Wallet is your all-inclusive custody wallet to access WAX blockchain and other web3 applications. Trusted by more than 13 millions of users worldwide.",
      url: "https://www.mycloudwallet.com/",
      icons: [
        "https://www.mycloudwallet.com/logo192.png"
      ]
    }
  }
}

```


## II. RPC interface


**RPC Specs**

- [wax_get_available_keys](#wax-get-available-keys)
- [wax_sign_message](#wax-sign-message)
- [wax_sign_push_transaction](#wax-sign-push-transaction-optional)
- [wax_push_transaction](#wax-push-transaction-optional)

<br>

:::tip
To provide context and information about the requesting DApp, Wallet can retrieve that data from the login session.
:::

<table>
  <tr>
   <td>name
   </td>
   <td>string
   </td>
   <td>Name of Dapp
   </td>
  </tr>
  <tr>
   <td>description
   </td>
   <td>string
   </td>
   <td>Description of Dapp
   </td>
  </tr>
  <tr>
   <td>icons
   </td>
   <td>string[]
   </td>
   <td>Array url of icon
   </td>
  </tr>
  <tr>
   <td>url
   </td>
   <td>string
   </td>
   <td>Url of Dapp
   </td>
  </tr>
  <tr>
   <td>chains
   </td>
   <td>string[]
   </td>
   <td>Array of the requested login chainIds
   </td>
  </tr>
</table>


**Example:**

```json
{
  name: "Atomic Assets",
  description: "NFT Marketplace on WAX",
  url: "https://atomicassets.io",
  icons: [
    "https://avatars.githubusercontent.com/u/37784886"
  ],
  chains: [
    "antelope:1064487b3cd1a897ce03ae5b6a865651"
  ]
}

```



## wax_get_available_keys


**Description**

Get public keys associated with the account, corresponding to the private keys held by the wallet.


**Parameters**

<table>
  <tr>
   <td>account
   </td>
   <td>string
   </td>
   <td>Public keys associated with the account
   </td>
  </tr>
</table>



**Return**

<table>
  <tr>
   <td>public_keys
   </td>
   <td>Array of strings (PublicKey)
   </td>
   <td>Public keys associated with the private keys that the wallet holds
   </td>
  </tr>
</table>



**Example**


```json
Request:
{
    account: 'qs.wam',
}


Return:
{
    public_keys: [
        "EOS5wMVefW4H11BbhQ7uqtojfrFG9tsXkXuiTNkBvzFhCbysQjjkp",
        "EOS6wigZhV8BEEdFLebPiiNGNKyPw8X3RqxLvDaoYAP7z4SkLKbYi"
    ]
}
```





## wax_sign_message


**Description**

Sign a message with the private keys specified via their public keys.


**Parameters**

<table>
  <tr>
   <td>required_keys
   </td>
   <td>Array of strings (PublicKey)
   </td>
   <td>the public key of the corresponding private key to sign the transaction with
   </td>
  </tr>
  <tr>
   <td>message
<br>
(Optional)
   </td>
   <td>Array of any 
   </td>
   <td>Message
   </td>
  </tr>
</table>



**Return**

<table>
  <tr>
   <td>signatures
   </td>
   <td>Array of strings (PublicKey) (Signature)
   </td>
   <td>Signature
   </td>
  </tr>
</table>



**Example**

```json
Request:
{
    public_keys: [
        "EOS5wMVefW4H11BbhQ7uqtojfrFG9tsXkXuiTNkBvzFhCbysQjjkp",
        "EOS6wigZhV8BEEdFLebPiiNGNKyPw8X3RqxLvDaoYAP7z4SkLKbYi"
    ],
    message: [
            {
              account: "eosio.token",
              name: "transfer",
              data: {
                from: account,
                to: "ac.wam",
                quantity: "0.12300001 WAX",
                memo: "",
              },
              authorization: [
                {
                  actor: account,
                  permission: "active",
                },
              ],
            },
            {
              account: "eosio.token",
              name: "transfer",
              data: {
                from: account,
                to: "ac.wam",
                quantity: "0.00000001 WAX",
                memo: "",
              },
              authorization: [
                {
                  actor: account,
                  permission: "active",
                },
              ],
            },
          ]

}


Return:
{
    "account": "qs.wam",
    "public_keys": [
        "EOS5wMVefW4H11BbhQ7uqtojfrFG9tsXkXuiTNkBvzFhCbysQjjkp",
        "EOS6wigZhV8BEEdFLebPiiNGNKyPw8X3RqxLvDaoYAP7z4SkLKbYi"
    ]
}
```





## wax_sign_transaction


**Description**

Sign a transaction with the private keys specified via their public keys.


**Parameters**


<table>
  <tr>
   <td>required_keys
   </td>
   <td>Array of strings (PublicKey)
   </td>
   <td>the public key of the corresponding private key to sign the transaction with
   </td>
  </tr>
  <tr>
   <td>serialized_transaction
   </td>
   <td>Array of Uint8
   </td>
   <td>Transaction to sign
   </td>
  </tr>
  <tr>
   <td>serialized_context_free_data(optional)
   </td>
   <td>Array of Uint8
   </td>
   <td>Context-free data to sign
   </td>
  </tr>
  <tr>
   <td>transaction (optional)
   </td>
   <td>Object(Transaction) 
<br>
{ 
<br>
expiration?: string;<br><br>ref_block_num?: number;<br><br>ref_block_prefix?: number;<br><br> max_net_usage_words?: number;<br><br>max_cpu_usage_ms?: number;<br><br>delay_sec?: number;<br><br>context_free_actions?: Action[];<br><br>context_free_data?: Uint8Array[];<br><br>actions: Action[];<br><br>transaction_extensions?: [number, string][];<br><br>resource_payer?: ResourcePayer; 
<br>
}
   </td>
   <td>
   </td>
  </tr>
</table>



**Return**


<table>
  <tr>
   <td>signatures
   </td>
   <td>Array of strings (PublicKey) (Signature)
   </td>
   <td>Signature
   </td>
  </tr>
  <tr>
   <td>serializedTransaction
   </td>
   <td>Array of Uint8
   </td>
   <td>Transaction to sign
   </td>
  </tr>
  <tr>
   <td>serializedContextFreeData
<br>
(Optional)
   </td>
   <td>Array of Uint8
   </td>
   <td>Context-free data to sign
   </td>
  </tr>
</table>



**Example**


```json
Request:
{
  required_keys: [
    "EOS5wMVefW4H11BbhQ7uqtojfrFG9tsXkXuiTNkBvzFhCbysQjjkp",
    "EOS6wigZhV8BEEdFLebPiiNGNKyPw8X3RqxLvDaoYAP7z4SkLKbYi"
  ],
  serialized_transaction: {
    0: 222,
    1: 159,
    146: 0,
    147: 0,
    148: 0,
    149: 0
  },
  transaction: {
    delay_sec: 0,
    max_cpu_usage_ms: 0,
    actions: [
      {
        account: "eosio.token",
        name: "transfer",
        data: {
          from: "qs.wam",
          to: "ac.wam",
          quantity: "0.00000001 WAX",
          memo: ""
        },
        authorization: [
          {
            actor: "qs.wam",
            permission: "active"
          }
        ]
      }
    ]
  }
}



Return:
{
    "signatures": [
        "SIG_K1_K8ZLhxdoMRGm9sAGWi4cqyH1kDcbJwxrcSHeW536W48rfZKsgdpNo7ucmUPUL5ALaC7pN9R7HgtbSeepjBu2AvodW7UuMj",
        "SIG_K1_K8EY9r7JHbnzNFTAD4A6LmDkPE1AaEjRNJykYVxU5DB2XUNjRkceAVro2VCcXYesDUgi159xG18QN4goBtTZLc9WtKZs5d"
    ],
    "serializedTransaction": [
        59,
        165,
        ...,
        0,
        0,
        0,
        8,
        87,
        65,
        88,
        0,
        0,
        0,
        0,
        0,
        0
    ],
    "estimatorWorking": true,
    "ram": 0,
    "cpu": 1194,
    "net": 27,
    "waxFee": 0,
    "ramFee": 0
}

```

## wax_sign_push_transaction(Optional)

**Description**

Sign and push a transaction with the private keys specified via their public keys.


**Parameters**

<table>
  <tr>
   <td>required_keys
   </td>
   <td>Array of strings (PublicKey)
   </td>
   <td>the public key of the corresponding private key to sign the transaction with
   </td>
  </tr>
  <tr>
   <td>serialized_transaction
   </td>
   <td>Array of Uint8
   </td>
   <td>Transaction to sign
   </td>
  </tr>
  <tr>
   <td>serialized_context_free_data
   </td>
   <td>Array of Uint8
   </td>
   <td>Context-free data to sign
   </td>
  </tr>
  <tr>
   <td>transaction (optional)
   </td>
   <td>Object(Transaction) 
<br>
{ 
<br>
expiration?: string;<br><br>ref_block_num?: number;<br><br>ref_block_prefix?: number;<br><br>max_net_usage_words?: number;<br><br>max_cpu_usage_ms?: number;<br><br>delay_sec?: number;<br><br>context_free_actions?: Action[];<br><br>context_free_data?: Uint8Array[];<br><br> actions: Action[];<br><br>transaction_extensions?: [number, string][]; <br><br>resource_payer?: ResourcePayer; 
<br>
}
   </td>
   <td>
   </td>
  </tr>
</table>



**Return**


<table>
  <tr>
   <td>signatures
   </td>
   <td>Array of strings (PublicKey) (Signature)
   </td>
   <td>Signature
   </td>
  </tr>
  <tr>
   <td>serialized_transaction
   </td>
   <td>Array of Uint8
   </td>
   <td>Transaction to sign
   </td>
  </tr>
  <tr>
   <td>serialized_context_free_data
   </td>
   <td>Array of Uint8
   </td>
   <td>Context-free data to sign
   </td>
  </tr>
</table>



**Example**


```json
Request:
{

}


Return:
{

}
```



## wax_push_transaction(optional)

[https://developers.eos.io/manuals/eos/v2.1/nodeos/plugins/chain_api_plugin/api-reference/index/#operation/push_transactions](https://developers.eos.io/manuals/eos/v2.1/nodeos/plugins/chain_api_plugin/api-reference/index/#operation/push_transactions)

This method expects a transaction in JSON format and will attempt to apply it to the blockchain.


**Parameters: application/json**


<table>
  <tr>
   <td>signatures
   </td>
   <td>Array of strings (Signature)
   </td>
   <td>array of signatures required to authorize transaction
   </td>
  </tr>
  <tr>
   <td>compression
   </td>
   <td>boolean
   </td>
   <td>Compression used, usually false
   </td>
  </tr>
  <tr>
   <td>packed_context_free_data
   </td>
   <td>string
   </td>
   <td>json to hex
   </td>
  </tr>
  <tr>
   <td>packed_trx
   </td>
   <td>string
   </td>
   <td>Transaction object json to hex
   </td>
  </tr>
</table>

