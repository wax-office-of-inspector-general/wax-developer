---
title: Install WAX-CDT
order: 51
lang: en
---

The GitHub WAX-CDT Repository downloads to the **wax-cdt** directory. The download and build process can take several minutes to several hours, depending on your Internet connection, operating system, and hardware specifications.

To download the WAX-CDT Source Code Repository, paste the following into the command line:

```
git clone --recursive https://github.com/worldwide-asset-exchange/wax-cdt.git
```

## Build WAX-CDT

If you're using our Docker images, you do **not** need to complete these steps.

To build WAX-CDT from source, you can use the following steps. If you have a previous version installed, you'll need to uninstall it first. Refer to [Uninstall WAX-CDT](/docs/tutorials/cdt_uninstall) for more information.

:::warning
<strong>Important:</strong> Building from source is not supported. If you encounter an issue with the build, you can use our [Docker Images](/build/dapp-development/docker-setup/) instead (recommended).
:::

1. Change your directory to **wax-cdt**.

```
cd wax-cdt
```

2. Run the build script.

```
./build.sh
```

3. Run the install script.

```
sudo ./install.sh
```
