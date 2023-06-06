---
title: Run Commands
order: 23
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

The list above includes the **wax** directory that you shared when you started your **waxdev** container. You can `cd` into this directory when you're ready to [Create a Smart Contract](/docs/dapp-development/smart-contract-quickstart/dapp_hello_world).

:::tip
<strong>Tip:</strong> Sharing your local host's folder with your waxdev Docker container allows you to create directories that exist on both your host and the docker container. This makes it easy to build and deploy your smart contracts using Docker.
:::

## Use Our Guides

Throughout our dApp Development section, we'll list various steps required to run blockchain commands and build your smart contracts. For example:

1. From the command line, use the `cleos` command to get blockchain information from the WAX mainnet.

```shell
cleos -u https://wax-api-url get info
```
*Check https://validate.eosnation.io/wax/reports/endpoints.html to get an updated API endpoint URL*
<p>&nbsp;</p>

When you start an interactive bash session, the *command line* is your Docker container bash prompt:

![](/img/dapp-development/docker-setup/docker_root.jpg){:class="img-responsive"}

When you press `Enter` to run the command, the console prints a JSON response directly in your Docker container:

![](/img/dapp-development/docker-setup/docker_results.jpg){:class="img-responsive"}

