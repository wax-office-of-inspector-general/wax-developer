---
title: Verify Your Installation
order: 32
lang: en
---

To verify your installation, you can use **cleos** to call the `get info` endpoint on the Wax Blockchain API. 
<p>&nbsp;</p>

From the command line, enter the following:

```shell
cleos -u https://wax-api-url get info
```
*Check https://validate.eosnation.io/wax/reports/endpoints.html to get an updated API endpoint URL*
<p>&nbsp;</p>

If the [Blockchain Tools](/docs/tools/blockchain_tools) installed successfully, this endpoint will return various details about the WAX Blockchain, including the `chain_id`, block producer, and most recent block height.

![](/img/dapp-development/docker-setup/docker_results.jpg){:class="img-responsive"}

