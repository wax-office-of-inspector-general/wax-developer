---
title: Manage Containers
nav_order: 24
layout: default
parent: Docker Setup
grand_parent: dApp Development
---

To exit your interactive bash session (without stopping your container), press `ctrl-p` + `ctrl-q` to send an escape sequence. The console prints:

```shell
read escape sequence
```

The command above returns you to your host's command prompt. You can verify that your container is still running by using the `docker ps` command:

```shell
docker ps
```

To re-attach to your bash session, use the `docker attach` command.

```shell
docker attach waxdev
```

To stop your container, use the `docker stop` command.

```shell
docker stop waxdev
```

To re-start your container, use the `docker start` command.

```shell
docker start waxdev
```

Now that you've set up your Docker environment, you're ready to follow the guides in this section. While it's not required to complete the [WAX Blockchain Setup](/docs\dapp-development\wax-blockchain-setup) in the next tutorial, we still recommend downloading the source code to access code samples and **make** scripts.




