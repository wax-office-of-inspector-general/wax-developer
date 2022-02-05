---
title: Docker Setup
nav_order: 21
layout: default
parent: dApp Development
has_children: true
lang-ref: Docker Setup
lang: en
---

<a href="https://www.docker.com/" target="_blank">Docker</a> is a *container* platform that's similar to a virtual machine. Docker allows you to run software, applications, and even operating systems like Ubuntu from an isolated environment. Refer to Docker's <a href="https://www.docker.com/why-docker" target="_blank">Overview</a> guide to learn more.

Our development and production Docker images provide a fast, easy way to run the WAX Blockchain in minutes. You can also use our Docker images to build and deploy smart contracts.

Using our Docker environment offers the following benefits:

* Adds convenience and speed to your development efforts
* Eliminates the need to manage source code 
* Eliminates the need to meet our [Supported Operating Systems](/docs/en/tools/os) requirements
* Doesn't overwrite an existing installation of EOSIO
* Makes it easy to upgrade and try out new features
* Makes it easy to switch between production and development environments

<!--<strong>Note:</strong> While it isn't required to build the source code from our <a href="https://github.com/worldwide-asset-exchange" target="_blank">WAX Git Repository</a>, we still recommend that you . 
{: .label .label-yellow }-->

## What's Included

Below is a list of our core Docker images. For a complete list, refer to <a href="https://hub.docker.com/u/waxteam" target="_blank">waxteam - Docker Repositories</a>.

<table>
<thead>
<tr>
<th style="width:25%">Docker Image</th>
<th>Description</th>
</tr>
</thead>

<tbody>
<tr>
<td><a href="https://hub.docker.com/r/waxteam/dev" target="_blank">waxteam/dev</a></td>
<td>This <strong>development</strong> image includes everything you need to get the WAX Blockchain up and running. You can use this image to run a WAX node, create a local development environment, and create and compile smart contracts using the [WAX Contract Development Toolkit (WAX-CDT)](/docs/en/dapp-development/wax-cdt/).</td>
</tr>

<tr>
<td><a href="https://hub.docker.com/r/waxteam/cdt" target="_blank">waxteam/cdt</a></td>
<td>Use this image to create and compile smart contracts using the [WAX Contract Development Toolkit (WAX-CDT)](/docs/en/dapp-development/wax-cdt/). This image does <strong>not</strong> allow you to run a WAX node or use [Blockchain Tools](/docs/en/tools/blockchain_tools).</td>
</tr>

    <tr>
<td><a href="https://hub.docker.com/r/waxteam/production" target="_blank">waxteam/production</a></td>
<td>It's recommended that you use our <a href="https://hub.docker.com/r/waxteam/production" target="_blank">production docker images</a> to run a production node. Refer to <a href="https://github.com/worldwide-asset-exchange/wax-blockchain/tree/develop/samples/mainnet" target="_blank">Running a WAX node</a> for more information.</td>
</tr>

</tbody>
</table>




