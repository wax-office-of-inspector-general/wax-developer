---
title: Verify Your Installation
nav_order: 32
layout: default
parent: WAX Blockchain Setup
grand_parent: dApp Development
---

To verify your installation, you can use **cleos** to call the `get info` endpoint on the Wax Blockchain API. 

From the command line, enter the following:

```
cleos -u https://chain.wax.io get info
```

If the [Blockchain Tools](/wax-developer/docs/blockchain_tools) installed successfully, this endpoint will return various details about the WAX Blockchain, including the `chain_id`, block producer, and most recent block height.


```json
{
  "server_version": "e5e98906",
  "chain_id": "1064487b3cd1a897xx99xx9xx9x999999999e2e152090f99c1d19d44e01aea5a4",
  "head_block_num": 2900516,
  "last_irreversible_block_num": 2900186,
  "last_irreversible_block_id": "002c40da7e2ab89cb4aeecc4184bcae11afc5988cbc1ca9854a6345e00dbb378",
  "head_block_id": "002c42243899fe4bbe3907f5675b7254519d28bd901d9fe5682be7ebc047d6b8",
  "head_block_time": "2019-07-11T16:04:44.500",
  "head_block_producer": "strongblock1",
  "virtual_block_cpu_limit": 500000000,
  "virtual_block_net_limit": 1048576000,
  "block_cpu_limit": 500000,
  "block_net_limit": 1048576,
  "server_version_string": "wax-1.6.1-1.0.0"
}
```




