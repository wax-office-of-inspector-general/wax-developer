---
title: Run Commands
nav_order: 23
layout: default
parent: Docker Setup
grand_parent: dApp Development
lang-ref: Run Commands
lang: en
---

Once your **waxdev** bash session starts, you can use common commands to interact with your container. For example, to list your container's contents, use the `ls` command.

```shell
ls
```

The console prints:

```shell
bin  boot  dev  etc  home  lib  lib32  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var  wax
```

The list above includes the **wax** directory that you shared when you started your **waxdev** container. You can `cd` into this directory when you're ready to [Create a Smart Contract](/en/dapp-development/smart-contract-quickstart/dapp_hello_world).

<strong>Tip:</strong> Sharing your local host's folder with your waxdev Docker container allows you to create directories that exist on both your host and the docker container. This makes it easy to build and deploy your smart contracts using Docker.
{: .label .label-yellow }

## Use Our Guides

Throughout our dApp Development section, we'll list various steps required to run blockchain commands and build your smart contracts. For example:

1. From the command line, use the `cleos` command to get blockchain information from the WAX mainnet.

```shell
cleos -u https://wax-api-url get info
```
*Check https://validate.eosnation.io/wax/reports/endpoints.html to get an updated API endpoint URL*
<p>&nbsp;</p>

When you start an interactive bash session, the *command line* is your Docker container bash prompt:

![](/assets/img/dapp-development/docker-setup/docker_root.jpg){:class="img-responsive"}

When you press `Enter` to run the command, the console prints a JSON response directly in your Docker container:

![](/assets/img/dapp-development/docker-setup/docker_results.jpg){:class="img-responsive"}

<!--You can use your interactive bash terminal to follow along in all of our guides and tutorials.-->

<!--```json
{
  "server_version": "7328c2db",
  "chain_id": "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4",
  "head_block_num": 20878276,
  "last_irreversible_block_num": 20877948,
  "last_irreversible_block_id": "013e927c4b6173b638f988024af4952fa7bef2e06e356b3c1a6ef0bc9e34ce89",
  "head_block_id": "013e93c480c99a55ecc17b9afb48eae8f9980b01f5779462b1cd0b2551719578",
  "head_block_time": "2019-10-23T19:40:01.500",
  "head_block_producer": "strongblock1",
  "virtual_block_cpu_limit": 500000000,
  "virtual_block_net_limit": 1048576000,
  "block_cpu_limit": 500000,
  "block_net_limit": 1048576,
  "server_version_string": "wax-1.8.4-1.0.0",
  "fork_db_head_block_num": 20878276,
  "fork_db_head_block_id": "013e93c480c99a55ecc17b9afb48eae8f9980b01f5779462b1cd0b2551719578"
}
    ```-->
