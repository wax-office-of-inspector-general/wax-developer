---
title: Securely Peer on the WAX Network with Wireguard
---

Operating a successful WAX Guild often will entail co-operating with other Guilds to ensure there is holistic network health on a technical level. One such time will be deploying secure low latency connections between other Guild’s networks to ensure blocks are sync’d and transactions flow without contention to the relevant block producers.

The WAX Mainnet has a backend network facilitated through the use of an Internal Wireguard VPN shared between Guilds.

[Wireguard](https://www.wireguard.com/)  is a free to use VPN solution that encapsulates IP Packets in UDP frames that enable the WAX Guilds to share a common secure and low latency network between relevant WAX Software Nodes.

Wireguard can also be used for your Guilds own internal peering depending on your topology you may have to securely traverse a public network.

This guide will show you the process to install and configure Wireguard on a WAX Node and then connect to the WAX Guild Internal VPN.

# Securely Peer on the WAX Network with Wireguard

Before kicking of the build and install process you should signal your Guilds intent to join the WAX Guild Internal VPN.

This can simply be done by messaging in the  **wax_guilds** Keybase Team (All Guilds should already be members). One of the existing Guilds will allocate you a private IP address for use on the Internal VPN Network, this IP is typically allocated by  [WAX Sweden](https://waxsweden.org/)  and captured in the Keybase shared Wireguard file.

This IP address will be used in your Wireguard configuration.

# Installation, Configuration and Connecting to the WAX Guild Internal VPN

In this guide the following steps using Ubuntu 22.04 will be walked through:

-   Install Wireguard
-   Generate a Private and Public Wireguard Key
-   Configure the Wireguard Network Interface
-   Configure Wireguard Peers
-   Enable the Wireguard Network Interface
-   Configure WAX Software Peers

## Install Wireguard

Wireguard is included from Ubuntu Server 20.04 by default however you mileage may vary, install as below:

```
$ sudo apt-get update  
  
$ sudo apt install wireguard

On previous Ubuntu versions install as below:

$ sudo add-apt-repository ppa:wireguard/wireguard  
  
$ sudo apt-get update  
  
$ sudo apt-get install wireguard-dkms wireguard-tools
```

## Generate a Private and Public Wireguard Key

Your public key will need to be shared with other Guilds that you will be connecting to and likewise you will need theirs. Keep you private key .. private.

```
#Change umask in current Shell only  
$ sudo umask 077  
  
#Generate and View Private Key  
$ wg genkey > privatekey  
  
$ cat privatekey  
sFIbU8HkegP6sK/35vdqlER9G3aK+Mxp8F1uDybuhnk=  
  
#Derive and View Public Key from Private Key  
$ wg pubkey < privatekey > publickey  
  
$ cat publickey  
oYXYVmIISGLYx+VZ8FWGa1GW4+K9Y0IYcrPeDiwKQHQ=
```

## Configure the Wireguard Network Interface

The first Wireguard Interface is  `wg0`  (however can be named something more relevant to your deployment)  and  can be configured in the  `wg0.conf`  file with your assigned Private IP address, Private Key and a Random High Port to listen on as below:

```
$ sudo nano /etc/wireguard/wg0.conf  
  
[Interface]  
Address = 10.0.0.88/24  
PrivateKey = sFIbU8HkegP6sK/35vdqlER9G3aK+Mxp8F1uDybuhnk=  
ListenPort = 51337
```

It’s import to understand that this Interface IP address is for the VPN overlay and is not the anchor point for the underlay VPN, however the ListenPort is used for the underlay connection.

Wireguard Peers that connect to this node will connect to the Public IP endpoint (Typically a DNS Name) of this node on Port 51337.

On most occasions there will be a firewall in front of the Public IP so be sure to allow  **UDP**  connections to the ListenPort in our case  **UDP Port 51337**.

## Configure Wireguard Peers

Hopefully by this point you would already have had some private conversations with other Guilds and have agreed to privately peer.

Exchange Public Keys and Public VPN anchor point IPs with the other Guild and configure as below:

```
$ sudo nano /etc/wireguard/wg0.conf  
  
# Awesome Guild X  
[Peer]  
PublicKey = 1sV1QHDi0RxS4bRe7yC6Qqkha7KQmMObc4tKO7jWej0=  
AllowedIPs = 10.0.0.77/32  
Endpoint = awesome-guild.org:54671  
PersistentKeepalive = 20  
  
# Great Guild Y  
[Peer]  
PublicKey = dA95tu3wenr9wTJzZDErGQmlPCslTQgyS7ICRZx1hhI=  
AllowedIPs = 10.0.0.99/32  
Endpoint = great-guild.io:47692  
PersistentKeepalive = 20
```

## Enable the Wireguard Network Interface

With your side and the remote Guild’s side successfully configured  `wg0`  can be brought up or down using  `wg-quick`  as below:
```
#Bring Interface Up  
$ wg-quick up wg0  
  
#Take Interface Down  
$ wg-quick down wg0  
  
#Enable Auto Startup  
$ sudo systemctl enable wg-quick@wg0
```

Check the operation of the newly created VPN:
```
$ sudo wg show  
  
interface: wg0  
  public key: sFIbU8HkegP6sK/35vdqlER9G3aK+Mxp8F1uDybuhnk=  
  private key: (hidden)  
  listening port: 51337  
  
peer: 1sV1QHDi0RxS4bRe7yC6Qqkha7KQmMObc4tKO7jWej0=  
  endpoint: 84.143.66.24:54671  
  allowed ips: 10.0.0.77/32  
  latest handshake: 1 minute, 46 seconds ago  
  transfer: 1.73 GiB received, 1.43 GiB sent  
  persistent keepalive: every 20 seconds  
  
peer: dA95tu3wenr9wTJzZDErGQmlPCslTQgyS7ICRZx1hhI=  
  endpoint: 64.146.78.101:47692  
  allowed ips: 10.0.0.99/32  
  latest handshake: 1 minute, 54 seconds ago  
  transfer: 1.76 GiB received, 1.81 GiB sent  
  persistent keepalive: every 20 seconds  
  
$ sudo wg show wg0 latest-handshakes  
  
1sV1QHDi0RxS4bRe7yC6Qqkha7KQmMObc4tKO7jWej0=    16856  
dA95tu3wenr9wTJzZDErGQmlPCslTQgyS7ICRZx1hhI=    17589  
```

You should also be able to ping the remote private IP if allowed, however check that there is transfer and received traffic which is a good sign and that handshakes are in fact taking place.

## Configure WAX Software Peers

Now that the underlay VPN is confirmed to be successfully operational, all that is left is to configure WAX Software  `nodeos`  peer addresses that use the new private overlay WAX Guild VPN network.
```
$ nano config.ini  
  
# Awesome Guild X  
p2p-peer-address = 10.0.0.77:9876  
  
# Great Guild Y  
p2p-peer-address = 10.0.0.99:9876
```

Restart nodeos and check that there is a successful node to node  `nodeos`  peering:

```
$ netstat -an | grep 10.0.0.  
  
tcp        0      0 10.0.0.88:9876        10.0.0.77:46348      ESTABLISHED  
tcp        0  19765 10.0.0.88:9876        10.0.0.99:56892      ESTABLISHED
```

---

These **WAX Developer Technical Guides** are created using source material from the [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home)

Be sure to ask any questions in the  [EOSphere Telegram](https://t.me/eosphere_io)
