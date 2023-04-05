---
title: Build WAX Hyperion Software Components
nav_order: 157
layout: default
parent: WAX Infrastructure Guides
lang-ref: Build WAX Hyperion Software Components
lang: en
---

Following on from the Introduction to WAX Hyperion Full History guide, this next guide in the series will walk through the process to build each of the Hyperion Software Components.

EOS RIO have an excellent  [Hyperion Documentation Repository](https://hyperion.docs.eosrio.io/)  as well as an  **installation script**  for all components, however in this article a  **manual build**  process will be covered.

Once again this series will cover some of the EOS RIO same content and will add operational nuances from a practical stand point and our experience.

[Learn more about EOS RIO Hyperion](https://eosrio.io/hyperion/)

![](https://miro.medium.com/v2/resize:fit:598/0*QSOXBoNEcm0pWwSl.png)

# Build WAX Hyperion Software Components

The Hyperion Full History service is a collection of  **eight**  purpose built EOS RIO software and industry standard applications.

This walk through will install all components excluding the SHIP node on a single Ubuntu 20.04 server, please reference the previos Hyperion guide for infrastructure suggestions.

The process for building each of these primary building blocks is covered below:

## **WAX Software State-History (SHIP) Node**

The WAX Hyperion deployment requires access to a fully sync’d WAX State-History Node, the current recommend version is  `v3.1.4wax02`. This build process is extensively covered in previous guides.

## RabbitMQ

To install the latest RabbitMQ be sure to check their latest  [Cloudsmith Quick Start Script](https://www.rabbitmq.com/install-debian.html), this in our experience is the simplest way to ensure you are current and correctly built.

The summary process is below:
```
> sudo apt update

> sudo apt-get install curl gnupg apt-transport-https -y

#Team RabbitMQ's main signing key#
> curl -1sLf "https://keys.openpgp.org/vks/v1/by-fingerprint/0A9AF2115F4687BD29803A206B73A36E6026DFCA" | sudo gpg --dearmor | sudo tee /usr/share/keyrings/com.rabbitmq.team.gpg > /dev/null

#Cloudsmith: modern Erlang repository#
> curl -1sLf https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-erlang/gpg.E495BB49CC4BBE5B.key | sudo gpg --dearmor | sudo tee /usr/share/keyrings/io.cloudsmith.rabbitmq.E495BB49CC4BBE5B.gpg > /dev/null

#Cloudsmith: RabbitMQ repository#
> curl -1sLf https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-server/gpg.9F4587F226208342.key | sudo gpg --dearmor | sudo tee /usr/share/keyrings/io.cloudsmith.rabbitmq.9F4587F226208342.gpg > /dev/null

--------------------------------------------------------------------

#Add apt repositories maintained by Team RabbitMQ#
> sudo tee /etc/apt/sources.list.d/rabbitmq.list <<EOF

## Provides modern Erlang/OTP releases
##
deb [signed-by=/usr/share/keyrings/io.cloudsmith.rabbitmq.E495BB49CC4BBE5B.gpg] https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-erlang/deb/ubuntu bionic main
deb-src [signed-by=/usr/share/keyrings/io.cloudsmith.rabbitmq.E495BB49CC4BBE5B.gpg] https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-erlang/deb/ubuntu bionic main

## Provides RabbitMQ
##
deb [signed-by=/usr/share/keyrings/io.cloudsmith.rabbitmq.9F4587F226208342.gpg] https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-server/deb/ubuntu bionic main
deb-src [signed-by=/usr/share/keyrings/io.cloudsmith.rabbitmq.9F4587F226208342.gpg] https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-server/deb/ubuntu bionic main
EOF

--------------------------------------------------------------------

> sudo apt-get update -y

#Install Erlang packages#
> sudo apt-get install -y erlang-base erlang-asn1 erlang-crypto erlang-eldap erlang-ftp erlang-inets erlang-mnesia erlang-os-mon erlang-parsetools erlang-public-key erlang-runtime-tools erlang-snmp erlang-ssl erlang-syntax-tools erlang-tftp erlang-tools erlang-xmerl

#Install rabbitmq-server and its dependencies#
> sudo apt-get install rabbitmq-server -y --fix-missing
```

## Redis

Our current WAX Hyperion deployment is running on the latest Redis stable version  `v7.0.10`  which is built as below:

```
#Redis Signing Key#
> curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

#Latest Redis repository#
> echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
> sudo apt update

#Install Redis#
> sudo apt install redis-server

**Check Version**
> redis-server --version
```

## Node.js

Hyperion requires Node.js v18 , our WAX Hyperion deployment is running the current Redis LTS  `v18.12.1`  which is built below:

```
#Latest Node.js repository#
> curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

#Install Node.js#
> sudo apt-get install -y nodejs

**Check Version**
> node -v
```

## PM2

The latest public version is  `5.3.0`  and is built as below:

```
> sudo apt update

#Install PM2#  
> sudo npm install pm2@latest -g
```

## Elasticsearch

Currently our WAX Hyperion is using Elasticsearch  `8.5.2`  with great results, however the current recommended Elasticsearch version is  `8.7.0`  which I expect will work just as well or better. Build the latest Elasticsearch  `8.x`  as below:

```
> sudo apt install apt-transport-https

> sudo apt install gpg

#Elasticsearch signing key#
> wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -

#Latest Elasticsearch 8.x repository#
> echo "deb https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list

> sudo apt update

#Install Elasticsearch#
> sudo apt install elasticsearch

**Take note of the super-user password**
```

## Kibana

The utilised Kibana version should be paired with the installed Elasticsearch version, the process below will install the current  `8.7.0`  version:

```
> sudo apt-get install apt-transport-https

> sudo apt install gpg

#Elasticsearch signing key - Not needed if already added#
> wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -

#Latest Elasticsearch 8.x repository - Not needed if already added#
> echo "deb https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-8.x.list

> sudo apt update

#Install Kibana#
> sudo apt install kibana
```

## **EOS RIO Hyperion Indexer and API**

Currently the most robust and production ready version of Hyperion from our experience is  `3.3.9-4`  and is used in our WAX Hyperion Fully History Service. The EOS RIO Team are constantly developing and improving their code, the best way to stay on top of the current recommend version is to join the  [Hyperion Telegram Group](https://t.me/EOSHyperion). Hyperion  `3.3.9-4`  is built as below:

```
> git clone https://github.com/eosrio/hyperion-history-api.git

> cd hyperion-history-api

> git checkout v3.3.9-4

> npm install

> npm audit fix
```

After all Hyperion Software Components are built and provisioned you can now proceed to configuration.

---

These **WAX Developer Technical Guides** are created using source material from the [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home)

Be sure to ask any questions in the  [EOSphere Telegram](https://t.me/eosphere_io)
