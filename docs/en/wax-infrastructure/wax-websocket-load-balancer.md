---
title: Configure Websocket Support on a WAX Load Balancer
nav_order: 155
layout: default
parent: WAX Infrastructure Guides
lang-ref: Configure Websocket Support on a WAX Load Balancer
lang: en
---

WAX network offered services such as the Atomic API and Hyperion are quite reliant on a resilient State-History service also known as a State History Protocol (SHIP) node. Unlike other WAX Software HTTP API’s, State-History makes use of a bidirectional communication protocol called a websocket which is thankfully supported by HAProxy.

This guide will walk through how to configure HAProxy to support websocket resiliency and load balancing between multiple State History Nodes.
## How to Configure Websocket Support on a WAX Load Balancer

Websockets create a full duplex connection between client and server over a single TCP connection which is utilised by the WAX Software State-History Service. In order to provide load balancing and redundancy of this SHIP service a reverse proxy that supports websockets is needed.

HAProxy has a very neat automated ability to upgrade an existing HTTP connection to a TCP websocket using  **Connection: Upgrade**  and  **Upgrade: websocket**  **HTTP headers**  it can also be configured to simply recognise a specific  **URL**  that will point directly to the websocket server or SHIP is this case.

Once the websocket TCP tunnel connection is made, it will stay up until one of the nodes terminates or until the session timeout is reached. Below is a diagram I borrowed from HAPrroxy to visualise the setup flow.

![](https://miro.medium.com/max/700/1*BRDEW0nrF7LAjDRP3Nqyeg.png)

The above diagram shows websocket flow and timeouts of each phase

You can read more about  [Websockets Load Balancing with HAProxy](https://www.haproxy.com/blog/websockets-load-balancing-with-haproxy/)  on the HAProxy website.

In my research I also read a good article on troubleshooting  [Websocket/HAProxy timeouts](https://lucjan.medium.com/investigating-websocket-haproxy-reconnecting-and-timeouts-6d19cc0002a1), your mileage may vary when using State-History nodes but it may be advantageous to configure a specific tunnel timeout. Ours is set to 35 seconds in the HAProxy defaults section as below.

```
defaults  
timeout tunnel  35000
```

In this example HAProxy will be configured to recognise a websocket connection+upgrade header and to balance these requests to a group of WAX State-History nodes.

Be sure to review our previous WAX Load Balancer guides for details on how to build and configure HAProxy in it’s entirety.

# Configuration

All HAProxy configuration is found in  `haproxy.cfg`

In this example the goal is to:

-   Configure the HAProxy frontend to recognise traffic based on URL and Connect+Upgrade HTTP Header (frontend is a public IP and backend is a private LAN)
-   Configure the frontend to route traffic to the appropriate backend servers based on either HTTP or websocket traffic.
-   Configure the front end to accept either websocket  `ws:`  or websocket secure  `wss:`  connections.  _The_ `_wss:_` _protocol establishes a WebSocket over an encrypted TLS connection, while the_ `_ws:_` _protocol uses an unencrypted connection._
-   Configure backend servers, load balance algorithm and thresholds

Follow the example below to configure each section in the new  `haproxy.cfg`  :

```
> sudo nano /etc/haproxy/haproxy.cfg
```

**frontend**

Configure an access-list called  `wax_acl`  to recognise normal HTTP requests for your URL, in this case  `wax.eosphere.io`. And then configure two access-lists one for recognising a connection upgrade request  `wax_con_upg_acl`  and one to recognise an upgrade to websocket request  `wax_ws_upg_acl`.

```
frontend http-in  
acl wax_acl hdr(host) -i wax.eosphere.io

acl wax_con_upg_acl hdr(Connection)  -i upgrade  
acl wax_ws_upg_acl  hdr(Upgrade)     -i websocket

##Alternatively a websocket **specific URL** rather than a dynamic upgrade can be used to point all traffic to your state-history servers##

acl wax_acl hdr(host) -i ws-wax.eosphere.io
```

Bind the above access-list to a backend server group specifying the websocket and normal HTTP API’s server groups. In this example the following is configured.

-   Normal v1 API queries are sent to the  `wax_api_servers`  backend
-   Websocket traffic is sent to the  `wax_ship_servers`  backend

```
use_backend wax_api_servers if wax_acl { path_beg /v1/chain } 
use_backend wax_api_servers if wax_acl { path_beg /v1/node/get_supported_apis }

use_backend wax_ship_servers if wax_con_upg_acl wax_ws_upg_acl
```

If you have configured your HAProxy to accept HTTPS on port :443 and provide SSL Offloading (review our previous guides for details) your reverse proxy will accept  `wss:`  as well as  `ws:`  connections. Easier than you thought right?

**backend**

Configure the backend server groups to match your infrastructure and apply specific policies for each server group, in this case HTTP API servers and websocket SHIP servers.

The configuration below provides example servers and policy to match the above configuration. In particular the  `wax_ship_servers`  are configured to be checked if available (they will be marked as down and not used if unavailable) with a maximum of 200 connections specified.

```
backend wax_api_servers  
    balance roundrobin  
    default-server check maxconn 10000  
    server wax-pn-1 <PRIVATE LAN IP>:8888 cookie server1 weight 1              
    server wax-pn-2 <PRIVATE LAN IP>:8888 cookie server2 weight 1              
    server wax-pn-3 <PRIVATE LAN IP>:8888 cookie server3 weight 4backend wax_ship_servers  
    balance leastconn  
    default-server check maxconn 200  
    server wax-state-history-1 <PRIVATE LAN IP>:8080 cookie server1 weight 1             
    server wax-state-history-2 <PRIVATE LAN IP>:8080 cookie server2 weight 1
```

`balance leastconn`  is used for the SHIP servers in this example as it would seem to be better method to balance long lasting connections.. from my perspective.

Additionally it is also possible to monitor/check the health of backend state-history servers by querying their status against the network’s headblock. Two solutions have been developed by the community for use with HAProxy checks.

-   cc32d9 ->  [eosio-haproxy](https://github.com/cc32d9/eosio-haproxy)
-   EOS sw/eden ->  [eosio-api-healthcheck](https://github.com/eosswedenorg/eosio-api-healthcheck)

Of course there are a multitude of ways for you to setup websocket load balancing and resiliency for WAX services, the example in this article is how we are configured at EOSphere.

Something to note in my testing using Atomic API and Hyperion, if the SHIP node isn’t on LAN, indexing performance can be degraded. So be sure to keep your SHIP nodes close.

---

These **WAX Developer Technical Guides** are created using source material from the [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home)

Be sure to ask any questions in the  [EOSphere Telegram](https://t.me/eosphere_io)
