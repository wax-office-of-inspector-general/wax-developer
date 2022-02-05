---
title: Uninstall WAX-CDT
layout: default
nav_order: 95
parent: Tutorials
lang-ref: Uninstall WAX-CDT
lang: en
---

If you have a previous version of WAX-CDT installed (Version : wax-1.4.1-1.0.0), you'll need to uninstall it before you can install the latest version. 

## What's removed

This script will remove the following tools:

* eosio-cpp
* eosio-cc
* eosio-ld
* eosio-init
* eosio-abidiff
* eosio-wasm2wast
* eosio-wast2wasm
* eosio-ranlib
* eosio-ar
* eosio-objdump
* eosio-readelf

<strong>Tip:</strong> If you created folders or modified any files in this directory, they will remain intact after the uninstall script runs. This script only removes the WAX-CDT tools.
{: .label .label-yellow }


## Run the Uninstall Script

To uninstall the WAX-CDT:

1. From the command line, navigate to your WAX-CDT folder (e.g. wax-blockchain/wax-cdt).

2. Run the uninstall script.

    ```
    sudo ./uninstall.sh
    ```

    Enter your password, and then 1 to uninstall WAX-CDT. 

