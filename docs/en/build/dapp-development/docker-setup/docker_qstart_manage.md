---
title: Manage Containers
order: 24
---

# Manage Containers

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

If the `docker ps` command does not display your container, try running it with the `-a` key. This command will show everything, even containers that are not running

```shell
docker ps -a
```

Now that you've set up your Docker environment, you're ready to follow the guides in this section. While it's not required to complete the [WAX Blockchain Setup](/build/dapp-development/wax-blockchain-setup/) in the next tutorial, we still recommend downloading the source code to access code samples and **make** scripts.




