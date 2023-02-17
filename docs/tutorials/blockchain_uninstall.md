---
title: Uninstall WAX
layout: default
nav_order: 92
parent: Tutorials
lang-ref: Uninstall WAX
lang: en
---

If you have a previous version of the WAX Blockchain installed (Version : 1.6.1), you'll need to uninstall it before you can install the latest version. 

## What's removed

This script will remove the following tools:

* nodeos
* keosd
* cleos

<strong>Tip:</strong> If you created folders or modified any files in this directory, they will remain intact after the uninstall script runs. This script only removes the WAX Blockchain tools.
{: .label .label-yellow }

## Run the Uninstall Script

To uninstall the WAX Blockchain:

1. From the command line, navigate to your wax-blockchain folder.

2. Run the uninstall script.

```
sudo ./uninstall.sh
```

Enter your password, and then 1 to uninstall the WAX Blockchain. 

