---
title: Guide - Linking Wallet Connect with WAX Blockchain
order: 2
---

# Integration Guide: Linking Wallet Connect with WAX Blockchain

This guide walks you through the integration of Wallet Connect and WAX Blockchain, shedding light on the essential RPC interfaces and their intricacies. Whether you're a seasoned developer or a novice in the world of blockchain, this comprehensive overview will navigate you through the processes of setting up, signing, and pushing transactions seamlessly. 

![](/assets/images/build/wallet-connect/wallet-connect-integration.png)

## Setting up Wallet Connect <> WAX Blockchain

- JSON-RPC spec for Wallets: [https://docs.eosnetwork.com/apis/leap/latest/](https://docs.eosnetwork.com/apis/leap/latest/)
- CASA namespace spec: Antelope CAIP Entry ChainAgnostic/namespaces#93
- Namespaces: antelope
- Chains:
  - WAX Mainnet antelope:1064487b3cd1a897ce03ae5b6a865651
  - WAX Testnet antelope:f16b1833c747c43682f4386fca9cbb32
- RPC endpoints: [https://wax.validationcore.io/reports/nodes/api](https://wax.validationcore.io/reports/nodes/api)
- SLIP-0044 coin type: 14001

## RPC interface
<br>

### I. wax_get_available_keys

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

### II. wax_sign_message

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


### III. wax_sign_transaction

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
   <td>
    Object(Transaction)<br>
      {<br>
        expiration?: string;<br>
        ref_block_num?: number;<br>
        ref_block_prefix?: number;<br>
        max_net_usage_words?: number;<br>
        max_cpu_usage_ms?: number;<br>
        delay_sec?: number;<br>
        context_free_actions?: Action[];<br>
        context_free_data?: Uint8Array[];<br>
        actions: Action[];<br>
        transaction_extensions?: [number, string][];<br>
        resource_payer?: ResourcePayer;<br> 
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
        …,
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


### IV. wax_sign_push_transaction(Optional)


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
   <td>Object(Transaction)<br>
    {<br> 
      expiration?: string;<br>
      ref_block_num?: number;<br>
      ref_block_prefix?: number;<br>
      max_net_usage_words?: number;<br>
      max_cpu_usage_ms?: number;<br>
      delay_sec?: number;<br>
      context_free_actions?: Action[];<br>
      context_free_data?: Uint8Array[];<br>
      actions: Action[];<br>
      transaction_extensions?: [number, string][];<br>
      resource_payer?: ResourcePayer;<br> 
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
  required_keys: [
    "EOS5wMVefW4H11BbhQ7uqtojfrFG9tsXkXuiTNkBvzFhCbysQjjkp",
    "EOS6wigZhV8BEEdFLebPiiNGNKyPw8X3RqxLvDaoYAP7z4SkLKbYi"
  ],
  serialized_transaction: {
    0: 222,
    1: 159,
    …
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
        …,
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
