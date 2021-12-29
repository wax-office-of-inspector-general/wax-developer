---
title: Blockchain Environments
nav_order: 20
layout: default
parent: dApp Development
---

Below you'll find WAX versions, URLs, and development environment information.

<table>
<thead>
<tr>
<th style="width:20%">Service</th>
<th>Description</th>
</tr>
</thead>

<tbody>
        <tr>
        <td><a href="https://hub.docker.com/u/waxteam" target="_blank">Docker Images</a></td>
        <td>Use WAX Docker images to run a local node, use blockchain tools, and compile your smart contracts. Refer to [Docker Quickstart](/wax-developer/docs/docker_qstart) for more information.</td>
</tr>
    <tr><td><a href="https://github.com/worldwide-asset-exchange/waxjs" target="_blank">waxjs</a></td>
        <td>WaxJS Javascript API for integration with the WAX Cloud Wallet. Use this to easily sign in users and send transactions to the WAX Blockchain from your dApp. Refer to [WAX Cloud Wallet Quickstart](/wax-developer/docs/waa_waxjs_qstart) for more information.</td>
    </tr>
<tr>
 <td><a href="https://github.com/worldwide-asset-exchange/wax-blockchain" target="_blank">wax-blockchain</a></td><td>WAX Blockchain source files. Refer to [WAX Blockchain Setup](/wax-developer/docs/blockchain_setup) to get started.</td> 
    </tr>
    <tr>
        <td><a href="https://github.com/worldwide-asset-exchange/wax-cdt" target="_blank">wax-cdt</a></td>
        <td>WAX Contract Development Toolkit. Refer to [WAX Contract Development Toolkit (WAX-CDT)](/wax-developer/docs/cdt) to get started.</td>
</tr>
</tbody>
</table>

## WAX Mainnet

<table>
<thead>
<tr>
<th style="width:20%">Service</th>
<th style="width:36%">URL</th>
<th>Description</th>
</tr>
</thead>

<tbody>
<tr>
<td>Blockchain URL</td>
<td><a href="https://chain.wax.io">https://chain.wax.io</a></td>
<td>Used to make API calls and deploy your smart contracts to the WAX mainnet.</td>
</tr>

<tr>
<td>Blockchain P2P</td>
<td>peers.wax.io:9876</td>
<td>Peering endpoint for synchronizing a producer or full node (with no protocol in front of it).</td>
</tr>
<tr>
<td>Blockchain Explorer</td>
<td><a href="https://wax.bloks.io/" target="_blank">https:<span></span>//wax.bloks.io</a></td>
<td>Bloks.io block explorer.</td>
</tr>

<tr>
<td>WAX Account</td>
<td>(e.g., Scatter)</td>
<td>Create a WAX Blockchain Account.</td>
</tr>
</tbody>
</table>

## WAX Public Testnet

<a href="https://waxsweden.org/" target="_blank">WAX sw/eden</a> provides a WAX Testnet allowing you to create test accounts, test smart contracts, use API endpoints, and more.

<!--<strong>Note:</strong> If you're making local requests, <strong>nodeos</strong> must be running.
{: .label .label-yellow }-->

<table>
<thead>
<tr>
<th style="width:20%">Service</th>
<th style="width:36%">URL</th>
<th>Description</th>
</tr>
</thead>

<tbody>
    <tr>
<td>Testnet Site</td>
<td><a href="https://waxsweden.org/testnet/" target="_blank">WAX Testnet</a></td>
<td>Use WAX sw/eden's site to create test accounts, find sample scripts, and more.</td>
</tr>
<tr>
<td>Blockchain URL</td>
<td><a href="https://testnet.waxsweden.org">https:<span></span>//testnet.waxsweden.org</a></td>
<td>Used to make API calls and deploy your smart contracts to the WAX Testnet.</td>
</tr>

<tr>
<td>Public Endpoints</td>
<td><a href="https://github.com/eosswedenorg/waxtestnet/tree/master/endpoints" target="_blank">endpoints.json</a></td>
<td>Additional P2P and API endpoint URLs.</td>
</tr>

<tr>
<td>Blockchain P2P</td>
<td>testnet.waxsweden.org:59876</td>
<td>Peering endpoint for synchronizing a producer or full node (with no protocol in front of it).</td>
</tr>
<!--    <tr>
<td>Blockchain API</td>
<td><a href="https://api.waxsweden.org/" target="_blank">https:<span></span>//api.waxsweden.org</a></td>
<td>Used to make API calls to the WAX Testnet.</td>
</tr>-->
<tr>
<td>Blockchain Explorer</td>
<td><a href="https://local.bloks.io/?nodeUrl=testnet.waxsweden.org&amp;coreSymbol=WAX&amp;corePrecision=8&amp;systemDomain=eosio&amp;hyperionUrl=https%3A%2F%2Ftestnet.waxsweden.org" target="_blank">Bloks.io Testnet</a></td>
<td>Testnet block explorer.</td>
</tr>

<tr>
<td>Test Account</td>
<td><a href="https://waxsweden.org/create-testnet-account/" target="_blank">https:<span></span>//waxsweden.org/create-testnet-account/</a></td>
<td>Use the "Create testnet account" tool on the <a href="https://waxsweden.org/testnet/" target="_blank">Testnet</a> homepage or visit the direct link.</td>
</tr>
</tbody>
</table>

## WAX Local Testnet

When you [Set Up a Local dApp Environment](/wax-developer/docs/local_dapp_dev), you can make calls to your local API using the following URL.

<table>
<thead>
<tr>
<th style="width:20%">Service</th>
<th style="width:36%">URL</th>
<th>Description</th>
</tr>
</thead>

<tbody>
<tr>
<td>Blockchain URL</td>
<td><a href="http://127.0.0.1:8888">http://127.0.0.1:8888</a></td>
<td>Used to make API calls in your local development environment.</td>
</tr>
</tbody>
</table>

## C++ Environment 

You can write WAX smart contracts using the C++ programming language. No custom language is required, although you'll need to familiarize yourself with the WAX C/C++ API library. This library contains the core files required to communicate with the WAX Blockchain. When you're ready to get started, refer to:

* [WAX Contract Development Toolkit (WAX-CDT)](/wax-developer/docs/dapp-development/wax-cdt)
* [WAX-CDT API](/wax-developer/docs/api-reference/cdt_api)
* [Smart Contract Quickstart](/wax-developer/docs/dapp-development/smart-contract-quickstart)

<!--The [WAX Contract Development Toolkit (WAX-CDT)](/wax-developer/docs/cdt) includes everything you need to create and compile all of your smart contracts.-->

## Development Tools

You can use any third party C++ editor or IDE to write your smart contracts, such as Sublime Text, Atom, CLion, Eclipse, or Visual Studio products. 

<a href="https://www.eosstudio.io/" target="_blank">EOS Studio</a> is a graphic IDE built for EOSIO dApp development, available on Linux, Mac OS, and Windows. This tool features a code editor, contract inspector, and a network manager. To integrate WAX with EOS Studio, refer to <a href="https://github.com/worldwide-asset-exchange/wax-blockchain/tree/develop/samples/eos-studio" target="_blank">How to use EOS Studio with WAX</a>. Our script provides a minimal integration, developed and tested with Ubuntu 18.04.

<a href="https://github.com/EOSIO/eosjs" target="_blank">eosjs</a> is a javascript API SDK you can use to easily communicate with the WAX Blockchain API. Refer to [WAX RPC API](/wax-developer/docs/api-reference/rpc_api) for more information.

<a href="https://www.dfuse.io" target="_blank">dfuse</a> is a powerful suite of APIs that allow you to query the WAX Blockchain and stream real-time data. Refer to [dfuse for WAX dApps](/wax-developer/docs/api-reference/dfuse) for more information.
