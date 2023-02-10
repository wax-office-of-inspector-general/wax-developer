---
title: How to Route Specifc API Queries Between Nodes
nav_order: 154
layout: default
parent: WAX Infrastructure Guides
lang-ref: How to Route Specifc API Queries Between Nodes
lang: en
---

In a conversation with  [Anders|Anyobservation|Björk](https://twitter.com/anyobservation)  creator of  [Anyobservation | Crypto Fun Stuff](https://anyo.io/)  he advised that many new community members were attempting to run all of their public services on a single node, not being aware that this can have an impact on the speed and reliability of their offering.

This guide will discuss the process and configuration of separating specific public API queries between nodes using HAProxy.

## **How to route specific API queries between nodes**

_Before routing API queries are discussed it should be mentioned that easily one of the quickest wins to improve the performance/speed of WAX software_ `_nodeos_` _public services, is to provide separate nodes specifically for advertised public peers (P2P). 100+ Peers on a node can take up more than 50% of a_ `_nodeos_` _process leaving less for API queries._

`nodeos`  which is the core service daemon of WAX software, runs on every WAX Protocol Network node and is unfortunately primarily single threaded. This means that the more instances of the  `nodeos`  service available for public API queries the more performant and load balanced an API service offering can be. Also some WAX public services are offered using other software and have their own unique technical requirements such as a Hyperion, Atomic API or even a Website.

In this example HAProxy will be used to create policies allowing a public API service to be distributed between multiple nodes based on the requested query. Be sure to review our previous HAProxy guides for details on how to build and configure HAProxy in it’s entirety.

## Configuration

All HAProxy configuration is found in  `haproxy.cfg`

In this example the goal is to:

-   Configure the HAProxy frontend to recognise traffic based on URL (frontend is a public IP and backend is a private LAN)
-   Configure the frontend to route traffic to the appropriate backend servers based on specific query
-   Configure backend servers, load balance algorithm and thresholds

Follow the example below to configure each section in the new  `haproxy.cfg`  :

```
> sudo nano /etc/haproxy/haproxy.cfg
```
**frontend**

Configure an access-list called  `wax_acl`  to recognise requests for your URL, in this case  `wax.eosphere.io`  . Doing this will allow you to scale this loadbalancer to support multiple URL’s and networks.

```
frontend http-in  
acl wax_acl hdr(host) -i wax.eosphere.io
```

Bind the above access-list to a backend server group as well as specify where each specific query should be routed. The configuration example below does the following:

-   Normal v1 API queries are sent to the  `wax_api_servers`  backend
-   Normal v1 API block queries are sent to the  `wax_api_blocks_servers`  backend, these servers have the full  `block.log`
-   History v1 and v2 queries are sent to the  `wax_hyperion_servers`  backend, which is a Hyperion cluster
-   Hyperion Swagger and Block Explorer web portals are sent to the  `wax_hyperion_servers_web`  backend
-   Atomic API queries are sent to the  `wax_atomic_api_servers`backend, which is a atomic eosio-contract-api server

```
frontend http-in  
use_backend wax_hyperion_servers_web if wax_acl { path_beg /v2/docs }  
use_backend wax_hyperion_servers_web if wax_acl { path_beg /v2/explore }  
use_backend wax_hyperion_servers if wax_acl { path_beg /v2 }  
use_backend wax_hyperion_servers if wax_acl { path_beg /v1/history }  
use_backend wax_hyperion_servers if wax_acl { path_beg /socket.io }  
use_backend wax_api_block_servers if wax_acl { path_beg /v1/chain/get_block }  
use_backend wax_api_servers if wax_acl { path_beg /v1/chain }  
use_backend wax_api_servers if wax_acl { path_beg /v1/node }  
use_backend wax_atomic_api_servers if wax_acl { path_beg /health }  
use_backend wax_atomic_api_servers if wax_acl { path_beg /atomicassets }  
use_backend wax_atomic_api_servers if wax_acl { path_beg /atomictools }  
use_backend wax_atomic_api_servers if wax_acl { path_beg /atomicmarket }
```

_It is important to be aware that the_ **_frontend rules need to be ordered from most specific to least specific_**_, for example_ `_path_beg /_` _at the top of the list will superseded all the rules below it._

**backend**

Configure the backend server groups to match your infrastructure and apply specific policies for each server group.

The backend provides and excellent place to apply specific thresholds to mitigate abuse as discussed in our previous guides, along with specific query routing it should be clear that HAProxy can be leveraged for excellent policy granularity.

The configuration below provides example servers and policy to match the above configuration.

```
backend wax_hyperion_servers_web  
    balance roundrobin  
    default-server check maxconn 1000  
    server wax-hyperion-3 <PRIVATE LAN IP>:7000 cookie server1backend wax_hyperion_servers  
    balance roundrobin  
    default-server check maxconn 500  
    server wax-hyperion-1 <PRIVATE LAN IP>:7000 cookie server1  
    server wax-hyperion-2 <PRIVATE LAN IP>:7000 cookie server2backend wax_api_block_servers  
    balance roundrobin  
    default-server check maxconn 3000  
    server wax-pn-4 <PRIVATE LAN IP>:8888 cookie server1backend wax_api_servers  
    balance roundrobin  
    default-server check maxconn 3000  
    server wax-pn-1 <PRIVATE LAN IP>:8888 cookie server1  
    server wax-pn-2 <PRIVATE LAN IP>:8888 cookie server2  
    server wax-pn-3 <PRIVATE LAN IP>:8888 cookie server3backend wax_atomic_api_servers  
    balance leastconn  
    default-server check maxconn 800  
    server wax-atomic-1 <PRIVATE LAN IP>:9000 cookie server1  
    server wax-atomic-2 <PRIVATE LAN IP>:9000 cookie server2
 ```

Please note, this article isn’t a guide on how to set up your specific infrastructure or granular query routing policy. However knowing how HAProxy can be configured to optimise your public service offering will hopefully make you feel more confidant in scaling API’s on an extremely demanding and busy network such as the WAX Mainnet.

---

These **WAX Developer Technical Guides** are created using source material from the [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home)

Be sure to ask any questions in the  [EOSphere Telegram](https://t.me/eosphere_io)
