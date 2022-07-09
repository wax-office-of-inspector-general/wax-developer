---
title: Transfiriendo NFTs AtomicAssets
nav_order: 42
layout: default
parent: How-To AtomicAssets
grand_parent: Tutoriales
has_children: false
lang-ref: Transfer atomicassets NFTs
lang: es
---

Entre los atributos de un NFT, como hemos visto en el documento anterior, podemos encontrar el atributo "owner", el cual especifíca quién es el propietario actual del NFT.

```
"owner": "arpegiator21",
```
Transferir un NFT de una cuenta de usuario a otra consiste en modificar el valor de ese atributo por el nombre de la cuenta destinataria. Para ello, podemos hacer uso de una acción del smart contract atomicassets que, además, nos permite hacer la transacción de múltiples NFTs simultáneamente, siempre que sea con el mismo destinatario.

Para ello haremos una llamada a la acción "transfer" del smart contract atomicassets

![AtomicAsssets transfer](/assets/img/tutorials/howto_atomicassets/aa_transfer.png)

- from: Cuenta de origen y actual propietario del NFT. Debe firmar la transacción.
- to: Cuenta de destino.
- asset_ids: Array de ID de NFTs a transferir.
- memo: Mensaje adjunto a la transacción.

Preparamos los datos para la transacción:

```js
const from = 'arpegiator21';
const to = 'waxarena3dk1';
asset_ids = [1099532298240];
memo = 'deposit';

(async() => {
    const result = await transferNft(
        from,
        to,
        asset_ids,
        memo
    );
    console.log(result);
})();
```
Y llamamos a la acción

```js
/**
 * Transfer NFT
 */
const transferNft = async (from, to, asset_ids, memo) => {
  try {
    const result = await apiRpc.transact(
      {
        actions: [
          {
            account: "atomicassets",
            name: "transfer",
            authorization: [
              {
                actor: from,
                permission: "active",
              },
            ],
            data: {
              from: from,
              to: to,
              asset_ids: asset_ids,
              memo: memo
            },
          },
        ],
      }, TAPOS
    );
    return result;
  } catch (error) {
    console.log(error);
  }
}
```

Si no se ha producido ningún error obtendremos un resultado con la ID de la transacción entre otros datos:

```
{
  transaction_id: '79c4a2c191a2ad3df46897887c34f156aa90b5d7df4a7192fda6386f7d94f70c',
  processed: {
    id: '79c4a2c191a2ad3df46897887c34f156aa90b5d7df4a7192fda6386f7d94f70c',
    block_num: 157433271,
    block_time: '2022-06-07T09:29:22.500',
    producer_block_id: null,
    receipt: { status: 'executed', cpu_usage_us: 4636, net_usage_words: 16 },
    elapsed: 4636,
    net_usage: 128,
    scheduled: false,
    action_traces: [ [Object] ],
    account_ram_delta: null,
    except: null,
    error_code: null
  }
}
```