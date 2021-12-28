---
title: Manage Containers
nav_order: 24
layout: default
parent: Docker Setup
grand_parent: dApp Development
---

To exit your interactive bash session (without stopping your container), press <span class="codeSample">ctrl-p</span> <span class="codeSample">ctrl-q</span> to send an escape sequence. The console prints:

```shellread escape sequence```

The command above returns you to your host's command prompt. You can verify that your container is still running by using the <span class="codeSample">docker ps</span> command:

```shell
docker ps
    ```

To re-attach to your bash session, use the <span class="codeSample">docker attach</span> command.

```shell
docker attach waxdev
```

To stop your container, use the <span class="codeSample">docker stop</span> command.

```shell
docker stop waxdev
    ```

To re-start your container, use the <span class="codeSample">docker start</span> command.

```shell
docker start waxdev
    ```

Now that you've set up your Docker environment, you're ready to follow the guides in this section. While it's not required to complete the [WAX Blockchain Setup](/wax-developer/docs\dapp-development\wax-blockchain-setup) in the next tutorial, we still recommend downloading the source code to access code samples and **make** scripts.




