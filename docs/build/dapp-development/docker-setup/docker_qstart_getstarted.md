---
title: Run a WAX Container
order: 22
lang: en
---

To run the **waxteam/dev** Docker image:

1. Install <a href="https://www.docker.com/get-started" target="_blank">Docker</a> (if you haven't done so already). 

:::tip
<strong>Linux Users:</strong> It's recommended that you configure Docker to run without sudo to utilize all of our Docker-enabled <strong>make</strong> scripts. Refer to <a href="https://docs.docker.com/install/linux/linux-postinstall/" target="_blank">Post-installation steps for Linux</a> for more information.
:::

2. Create a new directory named **wax**. You can use this folder to store WAX Blockchain source code, samples, and your WAX smart contracts directory. This directory will be shared between your operating system and the Docker container. You will be able to edit your source code with your favourite IDE in either environment.

3. From the command line, start your WAX containers in interactive mode and share your host's **wax** directory. This command starts a bash session inside the container.

    **Linux**

    ```shell
    docker run -it --name waxdev -v /c/wax:/wax waxteam/dev bash
    ```

    ```shell
    docker run -it --name waxcdt -v /c/wax:/wax waxteam/cdt bash
    ```

    **Windows 10**

    ```shell
    docker run -it --name waxdev -v c:\wax:/wax waxteam/dev bash
    ```

    ```shell
    docker run -it --name waxcdt -v c:\wax:/wax waxteam/cdt bash
    ```

    The console prints something similar to:

    ```shell
    root@b6e444e3cc33:/#
    ```

You should now have a running container with an active bash session. You can use this bash session to follow along with our Quickstart guides and tutorials.



