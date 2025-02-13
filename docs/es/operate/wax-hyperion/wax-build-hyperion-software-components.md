---
title: Construyendo los Componentes del Software Hyperion de WAX
---

# Construyendo los Componentes del Software Hyperion de WAX

Tras nuestra Introducción al Artículo de Historia Completa de Hyperion de WAX, el siguiente artículo de la serie explicará el proceso para construir cada uno de los Componentes del Software Hyperion.

EOS RIO tiene un excelente [Repositorio de Documentación de Hyperion](https://hyperion.docs.eosrio.io/) así como un **script de instalación** para todos los componentes, sin embargo, en este artículo se cubrirá un proceso de **construcción manual**.

Una vez más, esta serie de Cómo Hacerlo Técnico cubrirá algunos de los mismos contenidos de EOS RIO y añadirá matices operativos desde un punto de vista práctico y nuestra experiencia.

[Aprende más sobre Hyperion de EOS RIO](https://eosrio.io/hyperion/)

![](https://miro.medium.com/v2/resize:fit:598/0*QSOXBoNEcm0pWwSl.png)

_Este artículo ha sido actualizado para reflejar el despliegue actual de Hyperion en diciembre de 2024._

# Construyendo los Componentes del Software Hyperion de WAX

El servicio de Historia Completa de Hyperion es una colección de **ocho** aplicaciones de software construidas con propósito específico por EOS RIO y aplicaciones estándar de la industria.

Este recorrido instalará todos los componentes, excluyendo el nodo SHIP en un solo servidor Ubuntu 22.04, por favor, consulta [WAX Technical How To #15.1](https://medium.com/eosphere/wax-technical-how-to-15-1-d2936d3c58d4) para sugerencias de infraestructura.

El proceso para construir cada uno de estos bloques de construcción principales se cubre a continuación:

## **Nodo de Historia del Estado (SHIP) del Software WAX**

El despliegue de Hyperion de WAX requiere acceso a un Nodo de Historia de Estado de WAX completamente sincronizado, la versión recomendada actual es `v5.0.1wax01`. Este proceso de construcción está cubierto extensamente en [WAX Technical How To #7](https://medium.com/eosphere/wax-technical-how-to-7-9ccc102efd9d).

## RabbitMQ

Para instalar la última versión de RabbitMQ actualmente `4.0.5` y Erlang `27.2` asegúrate de revisar su último [Script de Inicio Rápido de Cloudsmith](https://www.rabbitmq.com/install-debian.html), esto en nuestra experiencia es la forma más simple de asegurar que estás actualizado y construido correctamente.

El resumen del proceso está a continuación:

```
> sudo apt update

> sudo apt-get install curl gnupg apt-transport-https -y

#Clave de firma principal de Team RabbitMQ#
> curl -1sLf "https://keys.openpgp.org/vks/v1/by-fingerprint/0A9AF2115F4687BD29803A206B73A36E6026DFCA" | sudo gpg --dearmor | sudo tee /usr/share/keyrings/com.rabbitmq.team.gpg > /dev/null

#Cloudsmith: moderno repositorio de Erlang#
> curl -1sLf https://github.com/rabbitmq/signing-keys/releases/download/3.0/cloudsmith.rabbitmq-erlang.E495BB49CC4BBE5B.key | sudo gpg --dearmor | sudo tee /usr/share/keyrings/rabbitmq.E495BB49CC4BBE5B.gpg > /dev/null

#Cloudsmith: repositorio de RabbitMQ#
> curl -1sLf https://github.com/rabbitmq/signing-keys/releases/download/3.0/cloudsmith.rabbitmq-server.9F4587F226208342.key | sudo gpg --dearmor | sudo tee /usr/share/keyrings/rabbitmq.9F4587F226208342.gpg > /dev/null

--------------------------------------------------------------------
#Añade repositorios apt mantenidos por Team RabbitMQ#
> sudo tee /etc/apt/sources.list.d/rabbitmq.list <<EOF

## Proporciona versiones modernas de Erlang/OTP ##
deb [signed-by=/usr/share/keyrings/rabbitmq.E495BB49CC4BBE5B.gpg] https://ppa1.novemberain.com/rabbitmq/rabbitmq-erlang/deb/ubuntu jammy main
deb-src [signed-by=/usr/share/keyrings/rabbitmq.E495BB49CC4BBE5B.gpg] https://ppa1.november

ain.com/rabbitmq/rabbitmq-erlang/deb/ubuntu jammy main

## Proporciona RabbitMQ ##
deb [signed-by=/usr/share/keyrings/rabbitmq.9F4587F226208342.gpg] https://ppa1.novemberain.com/rabbitmq/rabbitmq-server/deb/ubuntu jammy main
deb-src [signed-by=/usr/share/keyrings/rabbitmq.9F4587F226208342.gpg] https://ppa1.novemberain.com/rabbitmq/rabbitmq-server/deb/ubuntu jammy main

EOF
--------------------------------------------------------------------
> sudo apt-get update -y

#Instala paquetes de Erlang#
> sudo apt-get install -y erlang-base \
  erlang-asn1 erlang-crypto erlang-eldap erlang-ftp erlang-inets \
  erlang-mnesia erlang-os-mon erlang-parsetools erlang-public-key \
  erlang-runtime-tools erlang-snmp erlang-ssl \
  erlang-syntax-tools erlang-tftp erlang-tools erlang-xmerl

#Instala rabbitmq-server y sus dependencias#
> sudo apt-get install rabbitmq-server -y --fix-missing

**Verificar Versión**
> sudo rabbitmqctl version
```

Si actualizaste a la versión 4 de RabbitMQ, es posible que necesites habilitar todas las feature flags estables como se muestra a continuación:

```
> sudo rabbitmqctl enable_feature_flag all
```

## Redis

Nuestro despliegue actual de Hyperion de WAX está funcionando en la última versión estable de Redis `v7.3.1` que se construye de la siguiente manera:

```
> sudo apt install lsb-release curl gpg

#Clave de firma de Redis#  
> curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

#Último repositorio de Redis#  
> echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list> sudo apt update

#Instalar Redis#  
> sudo apt install redis

**Verificar Versión**  
> redis-server --version
```

## Node.js

Hyperion requiere Node.js v22, nuestro despliegue de Hyperion de WAX está funcionando en la actual LTS `v22.12.0` que se construye a continuación:

```
#Descargar e importar la clave GPG de Nodesource#
> sudo apt update

> sudo apt install -y ca-certificates curl gnupg

> sudo mkdir -p /etc/apt/keyrings

> curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

#Crear repositorio .deb#
> NODE_MAJOR=22

> echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

#Instalar Node.js#
> sudo apt update 

> sudo apt-get install -y nodejs

**Verificar Versión**
> node -v
```

## PM2

La última versión pública es `5.4.3` y se construye como sigue:

```
> sudo apt update

#Instalar PM2#  
> sudo npm install pm2@latest -g

**Verificar Versión**  
> pm2 -v
```

## Elasticsearch

Actualmente, nuestro Hyperion de WAX está utilizando Elasticsearch `8.13.2` con excelentes resultados, sin embargo, la versión recomendada actual de Elasticsearch es `8.17.0` que espero funcione igual de bien o mejor. Construye la última versión de Elasticsearch `8.x` de la siguiente manera:

```
> sudo apt update

> sudo apt install apt-transport-https

> sudo apt install gpg

#Clave de firma de Elasticsearch#
> wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg

#Último repositorio de Elasticsearch 8.x#
> echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list

#Instalar Elasticsearch#
> sudo apt update && sudo apt install elasticsearch

**Toma nota de la contraseña del superusuario**
```

## Kibana

La versión de Kibana utilizada debe emparejarse con la versión instalada de Elasticsearch,

 el proceso a continuación instalará la versión actual:

```
> sudo apt update

> sudo apt-get install apt-transport-https

> sudo apt install gpg

#Clave de firma de Elasticsearch - No es necesario si ya se agregó#
> wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg

#Último repositorio de Elasticsearch 8.x - No es necesario si ya se agregó#
> echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list

#Instalar Kibana#
> sudo apt update && sudo apt install kibana
```

## **EOS RIO Hyperion Indexador y API**

Actualmente (diciembre de 2024), la versión más robusta y lista para producción de Hyperion desde nuestra experiencia es `3.3.10-1` y se utiliza en nuestro Servicio de Historia Completa de Hyperion de WAX. El equipo de EOS RIO está desarrollando y mejorando constantemente su código, la mejor manera de estar al tanto de la versión recomendada actual es unirse al [Grupo de Telegram de Hyperion](https://t.me/EOSHyperion). Construye Hyperion desde `main` de la siguiente manera:

```
> git clone https://github.com/eosrio/hyperion-history-api.git

> cd hyperion-history-api

> git checkout main

> npm install

> npm audit fix
```

_Se espera que la versión 3.5.0 de Hyperion se lance en las próximas semanas; esta guía se actualizará en consecuencia._

Después de que todos los Componentes del Software Hyperion estén construidos y aprovisionados, ahora puedes proceder a la configuración.

El siguiente subartículo de **WAX Hyperion Full History** guiará a través de la configuración técnica de cada componente.

---

Estas **Guías Técnicas para Desarrolladores de WAX** se crean utilizando material fuente de la [Serie de Cómo Hacerlo Técnico de EOSphere WAX](https://medium.com/eosphere/wax-technical-how-to/home)

Asegúrate de hacer cualquier pregunta en el [Telegram de EOSphere](https://t.me/eosphere_io)