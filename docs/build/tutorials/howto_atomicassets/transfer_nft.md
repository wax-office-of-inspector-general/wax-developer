---
title: Transfer atomicassets NFTs
order: 42
lang: en
---
Among the attributes of an NFT, as we have seen in the previous document, we can find the "owner" attribute, which specifies who is the current owner of the NFT.

```
"owner": "arpegiator21",
```
Transferring an NFT from one user account to another is a matter of changing the value of that attribute to the name of the recipient account. To do this, we can make use of an action of the smart contract atomicassets that, in addition, allows us to make the transaction of multiple NFTs simultaneously, as long as it is with the same recipient.

To do so, we will call the "transfer" action of the smart contract atomicassets

![AtomicAsssets transfer](/assets/images/tutorials/howto_atomicassets/aa_transfer.png)

- from: Originating account and current owner of the NFT. Must sign the transaction.
- to: Destination account.
- asset_ids: Array of IDs of NFTs to be transferred.
- memo: Message attached to the transaction.

Prepare the data for the transaction:
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
Call to action:

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

If no error has occurred we will get a result with the transaction ID among other data:

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