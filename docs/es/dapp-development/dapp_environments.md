---
title: Entornos de la Blockchain
nav_order: 20
layout: default
parent: dApp Development
lang-ref: Blockchain Environments
lang: es
---

A continuación, encontrarás versiones de WAX, URLs e información sobre los entornos de desarrollo en blockchains.

<table>
<thead>
<tr>
<th style="width:20%">Servicio</th>
<th>Descripción</th>
</tr>
</thead>

<tbody>
        <tr>
        <td><a href="https://hub.docker.com/u/waxteam" target="_blank">Docker Images</a></td>
        <td>Utiliza las imágenes Docker de WAX para ejecutar un nodo local, utilizar herramientas de blockchain y compilar tus contratos inteligentes. Para más información, usa el [inicio rápido de Docker](/es/dapp-development/docker-setup/).</td>
</tr>
    <tr><td><a href="https://github.com/worldwide-asset-exchange/waxjs" target="_blank">waxjs</a></td>
        <td>Una API WaxJS de Javascript para la integración con WAX Cloud Wallet. Utilízala para registrar fácilmente a los usuarios y enviar transacciones a la Blockchain de WAX desde tu dApp. Para más información, usa el [inicio rápido de WAX Cloud Wallet](/es/waa_waxjs_qstart).</td>
    </tr>
<tr>
 <td><a href="https://github.com/worldwide-asset-exchange/wax-blockchain" target="_blank">wax-blockchain</a></td><td>Los archivos fuente de WAX Blockchain. Para empezar a trabajar con ellos, descárgalos desde la [configuración de la Blockchain de WAX](/es/dapp-development/wax-blockchain-setup/).</td> 
    </tr>
    <tr>
        <td><a href="https://github.com/worldwide-asset-exchange/wax-cdt" target="_blank">wax-cdt</a></td>
        <td>Kit de herramientas de desarrollo de contratos WAX. Empieza a usarlo desde este enlace: [WAX Contract Development Toolkit (WAX-CDT)](/es/dapp-development/wax-cdt/).</td>
</tr>
</tbody>
</table>

## WAX Mainnet

<table>
<thead>
<tr>
<th style="width:20%">Servicio</th>
<th style="width:36%">URL</th>
<th>Descripción</th>
</tr>
</thead>

<tbody>
<tr>
<td>URL de la Blockchain</td>
<td><a href="/en/wax-infra/#public-and-free-api-service-providers">[chain-api-url]</a></td>
<td>Se utiliza para hacer llamadas a la API y desplegar los contratos inteligentes en la red principal (mainnet) de WAX.</td>
</tr>

<tr>
<td>Blockchain P2P</td>
<td>peers.wax.io:9876</td>
<td>Endpoint de peering para sincronizar un nodo productor o completo (sin protocolo delante).</td>
</tr>
<tr>
<td>Explorador de la Blockchain</td>
<td><a href="https://wax.bloks.io/" target="_blank">https:<span></span>//wax.bloks.io</a></td>
<td>Explorador Bloks.io.</td>
</tr>

<tr>
<td>Cuenta de WAX</td>
<td>(e.g., Scatter)</td>
<td>Crea una cuenta en la blockchain de WAX.</td>
</tr>
</tbody>
</table>

## Testnet pública de WAX

<a href="https://waxsweden.org/" target="_blank">WAX sw/eden</a> proporciona una red de pruebas (testnet) de WAX que nos permite crear cuentas de prueba, probar contratos inteligentes, utilizar endpoints de la API y mucho más.

<!--<strong>Note:</strong> If you're making local requests, <strong>nodeos</strong> must be running.
{: .label .label-yellow }-->

<table>
<thead>
<tr>
<th style="width:20%">Servicio</th>
<th style="width:36%">URL</th>
<th>Descripción</th>
</tr>
</thead>

<tbody>
    <tr>
<td>Sitio de la Testnet</td>
<td><a href="https://waxsweden.org/testnet/" target="_blank">WAX Testnet</a></td>
<td>Utiliza el sitio de WAX sw/eden para crear cuentas de prueba, encontrar ejemplos de scripts, etc.</td>
</tr>
<tr>
<td>URL de la Blockchain</td>
<td><a href="https://testnet.waxsweden.org">https:<span></span>//testnet.waxsweden.org</a></td>
<td>Se utiliza para hacer llamadas a la API y desplegar los contratos inteligentes en la Testnet.</td>
</tr>

<tr>
<td>Endpoints públicos</td>
<td><a href="https://github.com/eosswedenorg/waxtestnet/tree/master/endpoints" target="_blank">endpoints.json</a></td>
<td>URLs adicionales de endpoints P2P y API.</td>
</tr>

<tr>
<td>Blockchain P2P</td>
<td>testnet.waxsweden.org:59876</td>
<td>Endpoint de peering para sincronizar un nodo productor o completo (sin protocolo delante).</td>
</tr>
<!--    <tr>
<td>Blockchain API</td>
<td><a href="https://api.waxsweden.org/" target="_blank">https:<span></span>//api.waxsweden.org</a></td>
<td>Used to make API calls to the WAX Testnet.</td>
</tr>-->
<tr>
<td>Explorador de la Blockchain</td>
<td><a href="https://local.bloks.io/?nodeUrl=testnet.waxsweden.org&amp;coreSymbol=WAX&amp;corePrecision=8&amp;systemDomain=eosio&amp;hyperionUrl=https%3A%2F%2Ftestnet.waxsweden.org" target="_blank">Testnet Bloks.io</a></td>
<td>Explorador de la Testnet.</td>
</tr>

<tr>
<td>Cuenta de prueba</td>
<td><a href="https://waxsweden.org/create-testnet-account/" target="_blank">https:<span></span>//waxsweden.org/create-testnet-account/</a></td>
<td>Utiliza la herramienta "Crear cuenta de testnet" en la <a href="https://waxsweden.org/testnet/" target="_blank">Testnet</a> o entra en el enlace directo.</td>
</tr>
</tbody>
</table>

## Testnet local de WAX

Cuando [configuras un entorno de dApp local](/es/dapp-development/), puedes hacer llamadas a tu API local utilizando la siguiente URL.

<table>
<thead>
<tr>
<th style="width:20%">Servicio</th>
<th style="width:36%">URL</th>
<th>Descripción</th>
</tr>
</thead>

<tbody>
<tr>
<td>URL de la Blockchain</td>
<td><a href="http://127.0.0.1:8888">http://127.0.0.1:8888</a></td>
<td>Se utiliza para realizar llamadas a la API en un entorno de desarrollo local.</td>
</tr>
</tbody>
</table>

## Entornos C++

Puedes escribir contratos inteligentes WAX utilizando el lenguaje de programación C++. No se requiere un lenguaje personalizado, aunque tendrás que familiarizarte con la biblioteca de la API de WAX C/C++. Esta biblioteca contiene los archivos centrales necesarios para comunicarse con la Blockchain de WAX. Cuando estés listo para empezar, haz clic en estos enlaces:

* [Kit de herramientas del desarrollador de contratos de WAX (WAX Contract Development Toolkit o WAX-CDT)](/es/dapp-development/wax-cdt)
* [API del WAX-CDT](/es/api-reference/cdt_api)
* [Inicio rápido del Smart Contract](/es/dapp-development/smart-contract-quickstart)

<!--The [WAX Contract Development Toolkit (WAX-CDT)](/es/dapp-development/wax-cdt/) includes everything you need to create and compile all of your smart contracts.-->

## Herramientas de desarrollo

Puedes utilizar cualquier editor o IDE de C++ de terceros para escribir tus contratos inteligentes, como Sublime Text, Atom, CLion, Eclipse o productos de Visual Studio. 

<a href="https://www.eosstudio.io/" target="_blank">EOS Studio</a> es un IDE gráfico construido para el desarrollo de dApps de EOSIO, disponible en Linux, Mac OS y Windows. Esta herramienta cuenta con un editor de código, un inspector de contratos y un gestor de red. Para integrar WAX con EOS Studio, consulta <a href="https://github.com/worldwide-asset-exchange/wax-blockchain/tree/develop/samples/eos-studio" target="_blank">Cómo usar EOS Studio con WAX </a>. Nuestro script proporciona una integración mínima, desarrollada y probada con Ubuntu 18.04.

<a href="https://github.com/EOSIO/eosjs" target="_blank">eosjs</a> es un SDK de la API de Javascript que puedes utilizar para comunicarte fácilmente con la API de WAX Blockchain. Para más información al respecto, consulta la [API WAX RPC](/es/api-reference/rpc_api).

<a href="https://www.dfuse.io" target="_blank">dfuse</a> es un potente conjunto de APIs que permite consultar la Blockchain de WAX y transmitir datos en tiempo real. Si quieres saber más, consulta la entrada [dfuse para WAX dApps](/es/api-reference/dfuse).
