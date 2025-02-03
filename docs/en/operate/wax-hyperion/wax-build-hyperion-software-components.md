---
title: Build WAX Hyperion Software Components
---

Following on from our Introduction to WAX Hyperion Full History article, this next article in the series will walk through the process to build each of the Hyperion Software Components.

EOS RIO have an excellent  [Hyperion Documentation Repository](https://hyperion.docs.eosrio.io/)  as well as an  **installation script**  for all components, however in this article a  **manual build**  process will be covered.

Once again this Technical How To series will cover some of the EOS RIO same content and will add operational nuances from a practical stand point and our experience.

[Learn more about EOS RIO Hyperion](https://eosrio.io/hyperion/)

![](https://miro.medium.com/v2/resize:fit:598/0*QSOXBoNEcm0pWwSl.png)

_This article has been updated to reflect the current Hyperion deployment in December 2024._

# Build WAX Hyperion Software Components

The Hyperion Full History service is a collection of  **eight**  purpose built EOS RIO software and industry standard applications.

This walk through will install all components excluding the SHIP node on a single Ubuntu 22.04 server, please reference  [WAX Technical How To #15.1](https://medium.com/eosphere/wax-technical-how-to-15-1-d2936d3c58d4)  for infrastructure suggestions.

The process for building each of these primary building blocks is covered below:

## **WAX Software State-History (SHIP) Node**

The WAX Hyperion deployment requires access to a fully sync’d WAX State-History Node, the current recommend version is  `v5.0.1wax01`. This build process is extensively covered in  [WAX Technical How To #7](https://medium.com/eosphere/wax-technical-how-to-7-9ccc102efd9d).

## RabbitMQ

To install the latest RabbitMQ currently  `4.0.5` and Erlang `27.2` be sure to check their latest  [Cloudsmith Quick Start Script](https://www.rabbitmq.com/install-debian.html), this in our experience is the simplest way to ensure you are current and correctly built.

The summary process is below:

```
> sudo apt update

> sudo apt-get install curl gnupg apt-transport-https -y

#Team RabbitMQ's main signing key#
> curl -1sLf "https://keys.openpgp.org/vks/v1/by-fingerprint/0A9AF2115F4687BD29803A206B73A36E6026DFCA" | sudo gpg --dearmor | sudo tee /usr/share/keyrings/com.rabbitmq.team.gpg > /dev/null

#Cloudsmith: modern Erlang repository#
> curl -1sLf https://github.com/rabbitmq/signing-keys/releases/download/3.0/cloudsmith.rabbitmq-erlang.E495BB49CC4BBE5B.key | sudo gpg --dearmor | sudo tee /usr/share/keyrings/rabbitmq.E495BB49CC4BBE5B.gpg > /dev/null

#Cloudsmith: RabbitMQ repository#
> curl -1sLf https://github.com/rabbitmq/signing-keys/releases/download/3.0/cloudsmith.rabbitmq-server.9F4587F226208342.key | sudo gpg --dearmor | sudo tee /usr/share/keyrings/rabbitmq.9F4587F226208342.gpg > /dev/null

--------------------------------------------------------------------
#Add apt repositories maintained by Team RabbitMQ#
> sudo tee /etc/apt/sources.list.d/rabbitmq.list <<EOF

## Provides modern Erlang/OTP releases ##
deb [signed-by=/usr/share/keyrings/rabbitmq.E495BB49CC4BBE5B.gpg] https://ppa1.novemberain.com/rabbitmq/rabbitmq-erlang/deb/ubuntu jammy main
deb-src [signed-by=/usr/share/keyrings/rabbitmq.E495BB49CC4BBE5B.gpg] https://ppa1.novemberain.com/rabbitmq/rabbitmq-erlang/deb/ubuntu jammy main

## Provides RabbitMQ ##
deb [signed-by=/usr/share/keyrings/rabbitmq.9F4587F226208342.gpg] https://ppa1.novemberain.com/rabbitmq/rabbitmq-server/deb/ubuntu jammy main
deb-src [signed-by=/usr/share/keyrings/rabbitmq.9F4587F226208342.gpg] https://ppa1.novemberain.com/rabbitmq/rabbitmq-server/deb/ubuntu jammy main

EOF
--------------------------------------------------------------------
> sudo apt-get update -y

#Install Erlang packages#
> sudo apt-get install -y erlang-base \
  erlang-asn1 erlang-crypto erlang-eldap erlang-ftp erlang-inets \
  erlang-mnesia erlang-os-mon erlang-parsetools erlang-public-key \
  erlang-runtime-tools erlang-snmp erlang-ssl \
  erlang-syntax-tools erlang-tftp erlang-tools erlang-xmerl

#Install rabbitmq-server and its dependencies#
> sudo apt-get install rabbitmq-server -y --fix-missing

**Check Version**
> sudo rabbitmqctl version
```

If you performed an upgrade to RabbitMQ version 4 you may need to enable all stable feature flags as below:

```
> sudo rabbitmqctl enable_feature_flag all
```

## Redis

Our current WAX Hyperion deployment is running on the latest Redis stable version  `v7.3.1`  which is built as below:

```
> sudo apt install lsb-release curl gpg

#Redis Signing Key#  
> curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

#Latest Redis repository#  
> echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list> sudo apt update

#Install Redis#  
> sudo apt install redis

**Check Version**  
> redis-server --version
```

## Node.js

Hyperion requires Node.js v22 , our WAX Hyperion deployment is running the current LTS  `v22.12.0`  which is built below:

```
#Download and import the Nodesource GPG key#
> sudo apt update

> sudo apt install -y ca-certificates curl gnupg

> sudo mkdir -p /etc/apt/keyrings

> curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

#Create .deb repository#
> NODE_MAJOR=22

> echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

#Install Node.js#
> sudo apt update 

> sudo apt-get install -y nodejs

**Check Version**
> node -v
```

## PM2

The latest public version is  `5.4.3`  and is built as below:

```
> sudo apt update

#Install PM2#  
> sudo npm install pm2@latest -g

**Check Version**  
> pm2 -v
```

## Elasticsearch

Currently our WAX Hyperion is using Elasticsearch  `8.13.2`  with great results, however the current recommended Elasticsearch version is  `8.17.0`  which I expect will work just as well or better. Build the latest Elasticsearch  `8.x`  as below:

```
> sudo apt update

> sudo apt install apt-transport-https

> sudo apt install gpg

#Elasticsearch signing key#
> wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg

#Latest Elasticsearch 8.x repository#
> echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list

#Install Elasticsearch#
> sudo apt update && sudo apt install elasticsearch

**Take note of the super-user password**
```

## Kibana

The utilised Kibana version should be paired with the installed Elasticsearch version, the process below will install the current version:

```
> sudo apt update

> sudo apt-get install apt-transport-https

> sudo apt install gpg

#Elasticsearch signing key - Not needed if already added#
> wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg

#Latest Elasticsearch 8.x repository - Not needed if already added#
> echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list

#Install Kibana#
> sudo apt update && sudo apt install kibana
```

## **EOS RIO Hyperion Indexer and API**

Currently (December 2024) the most robust and production ready version of Hyperion from our experience is  `3.3.10-1`  and is used in our WAX Hyperion Fully History Service. The EOS RIO Team are constantly developing and improving their code, the best way to stay on top of the current recommend version is to join the  [Hyperion Telegram Group](https://t.me/EOSHyperion). Build Hyperion from  `main`  as below:

```
> git clone https://github.com/eosrio/hyperion-history-api.git

> cd hyperion-history-api

> git checkout main

> npm install

> npm audit fix
```

_Hyperion version '3.5.0' is expected to release in the next few weeks, this guide will be updated accordingly._

After all Hyperion Software Components are built and provisioned you can now proceed to configuration.

The next  **WAX Hyperion Full History**  sub article will walk through the technical configuration of each component.

---

These **WAX Developer Technical Guides** are created using source material from the [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home)

Be sure to ask any questions in the  [EOSphere Telegram](https://t.me/eosphere_io)
