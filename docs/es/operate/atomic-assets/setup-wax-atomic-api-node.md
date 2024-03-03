---
title: Cómo configurar un nodo de API atómica de WAX
order: 4
---

El estándar de NFT AtomicAssets desarrollado por [Pink.gg](https://pink.gg/) se ha vuelto sinónimo de la Red del Protocolo WAX y del ampliamente utilizado [WAX Atomic Hub](https://wax.atomichub.io/).

El estándar de NFT AtomicAssets se distingue de sus alternativas por no requerir RAM de los usuarios y ofrecer ofertas de intercambio bidireccionales nativas, así como respaldar NFTs con tokens. Puedes leer más sobre el estándar en [https://atomicassets.io/](https://atomicassets.io/).

Por supuesto, ningún marco de NFTs impresionante estaría completo sin la capacidad para que los usuarios y desarrolladores accedan a datos en tiempo real de manera simple y efectiva a través de una API escalable. Aquí es donde [Pink.gg](https://pink.gg/) desarrolló la [eosio-contract-api](https://github.com/pinknetworkx/eosio-contract-api) también conocida como la **API Atómica**.

Esta guía te guiará a través del proceso de construir y ejecutar un nodo de API atómica de WAX, lo que te permitirá, como gremio o desarrollador, ofrecer un servicio de API muy útil para el ecosistema... o tal vez solo para ti.

# Cómo configurar un nodo de API atómica de WAX

Los nodos públicos de API atómica son extremadamente utilizados en la Mainnet de WAX y son usados por usuarios y DApps para consultar el estado e historial de atomicassets y el atomicmarket.

Un nodo sólido de mainnet puede ejecutarse en docker si deseas contenerizar la instancia o a través de PM2 si prefieres ejecutarlo a nivel del sistema.

Esta guía pasa por el proceso de construir las dependencias de la aplicación y ejecutar el nodo con PM2.

# Requisitos de Mainnet

**Hardware**

- 8 CPU Core / 5_Ghz+ recomendado_
- 1TB+ Disco / _SSD de grado empresarial o NVMe_

Actualmente (noviembre de 2022) un nodo completo usa aproximadamente **859GB** de espacio en disco con la base de datos postgres actualmente en **849GB**.

- 64GB+ RAM

**Sistema Operativo**

- Ubuntu 20.04 **_(Recomendado)_**

**Nodo SHIP**

- Acceso a un nodo WAX State-History actualizado v2.0.12–13 o v3.1.x
- Nodo SHIP en la misma LAN **_(Altamente recomendado)_**

**Red**

- Conexión de banda ancha a Internet moderna / Fibra (100Mb/s sincrónicos y superior)
- LAN de 1Gb/s+

# Construir el Software

En el momento de escribir, la versión actual de la [eosio-contract-api](https://github.com/pinknetworkx/eosio-contract-api) es `v1.3.17`

Dependencias de la Aplicación **_(Algunas de nuestras recomendaciones)_**

- NodeJS >= 16.0
- PM2
- PostgreSQL >= 14.0
- Redis >= 5.0
- Yarn

## Proceso de Instalación y Configuración de la Aplicación

**NodeJS**

```
> curl -fsSL [https://deb.nodesource.com/setup_16.x](https://deb.nodesource.com/setup_16.x) | sudo -E bash - > sudo apt install -y nodejs

#Verificar Versión#  
> node -v
```

**PM2**

```
> sudo npm install pm2 -g

#Verificar Versión#  
> pm2 -v
```

**Postgres**

Instala Postgres como se indica a continuación:

```
> sudo apt-get install wget ca-certificates

> wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

> sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

> sudo apt update

> sudo apt install postgresql postgresql-contrib

#Verificar Versión#  
> apt show postgresql
```

Después de la instalación, es necesario crear una nueva base de datos y asignar permisos si es necesario, este ejemplo usará el usuario postgres predeterminado.

```
> sudo su

 - postgres

> psql

#Asignar una contraseña a la cuenta de postgres#  
postgres=# \password  
Ingresa nueva contraseña:  
Ingresa nuevamente:

#Crear la base de datos#  
postgres=# \l (lista las bases de datos)
postgres=# CREATE DATABASE "api-wax-mainnet-atomic-1";
postgres=# \l+ (lista las bases de datos - incluyendo tamaño)
postgres=# \q (salir)

> exit
```

**Redis**

```
> curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

> echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

> sudo apt update

> sudo apt install redis

#Verificar Versión#  
> redis-server --version

#Si hay un error de desenmascarar entonces#  
> sudo systemctl unmask redis-server.service
```

**Yarn**

```
> sudo npm install --global yarn

#Verificar Versión#  
> yarn --version
```

## API Atómica

Las últimas instrucciones de construcción siempre se pueden encontrar en el [Github de Pink.gg](https://github.com/pinknetworkx/eosio-contract-api)

**Instalación**

```
> git clone https://github.com/pinknetworkx/eosio-contract-api.git

> cd eosio-contract-api

> yarn install
```

**Configuración**

Hay tres archivos de configuración que deben ajustarse para tu implementación específica

```
connections.config.json  
server.config.json  
readers.config.json
```

A continuación se muestran configuraciones básicas para este ejemplo, por favor adapta a tu propia implementación:

_connections.config.json_

```
> cd  ~/eosio-contract-api/config

> cp example-connections.config.json connections.config.json

> nano connections.config.json
{
  "postgres": {
    "host": "127.0.0.1",
    "port": 5432,
    "user": "postgres",
    "password": "TU CONTRASEÑA DE POSTGRES",
    "database": "api-wax-mainnet-atomic-1"
  },
  "redis": {
    "host": "127.0.0.1",
    "port": 6379
  },
  "chain": {
    "name": "wax-mainnet",
    "chain_id": "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4",
    "http": "http://10.0.0.65:8888",
    "ship": "ws://10.0.0.65:8080"
  }
}
```

_server.config.json_

```
> cd  ~/eosio-contract-api/config

> cp example-server.config.json server.config.json

> nano server.config.json
{
  "provider_name": "Gremio EOSphere",
  "provider_url": "https://eosphere.io",
"server_addr": "0.0.0.0",
  "server_name": "wax-atomic-api.eosphere.io",
  "server_port": 9000,
"cache_life": 5,
  "trust_proxy": true,
"rate_limit": {
    "interval": 60,
    "requests": 240,
    "bill_execution_time": true
  },
"ip_whitelist": [],
  "slow_query_threshold": 7500,
"max_query_time_ms": 10000,
  "max_db_connections": 50,
"namespaces": [
    {
      "name": "atomicassets",
      "path": "/atomicassets",
      "args": {
        "atomicassets_account": "atomicassets",
        "connected_reader": "atomic-1",
        "socket_features": {
          "asset_update": false
        }
      }
    },
    {
      "name": "atomicmarket",
      "path": "/atomicmarket",
      "args": {
        "atomicmarket_account": "atomicmarket",
        "connected_reader": "atomic-1",
        "socket_features": {
          "asset_update": false
        },
       "api_features": {
          "disable_v1_sales": true
        }
      }
    },
    {
      "name": "atomictools",
      "path": "/atomictools",
      "args": {
        "atomictools_account": "atomictoolsx",
        "atomicassets_account": "atomicassets",
        "connected_reader": "atomic-1"
      }
    }
 

 ]
}
```

_readers.config.json_

El consejo del equipo de Pink fue que la indexación solo necesita comenzar desde el bloque 64000000

```
> cd  ~/eosio-contract-api/config

> cp example-readers.config.json readers.config.json

> nano readers.config.json
[
  {
    "name": "atomic-1",
"server_addr": "0.0.0.0",
    "server_port": 9001,
"start_block": 64000000,
    "stop_block": 0,
    "irreversible_only": false,
"ship_prefetch_blocks": 50,
    "ship_min_block_confirmation": 30,
    "ship_ds_queue_size": 20,
"db_group_blocks": 10,
"ds_ship_threads": 4,
"modules": [],
"contracts": [
      {
        "handler": "atomicassets",
        "args": {
          "atomicassets_account": "atomicassets",
          "store_transfers": true,
          "store_logs": true
        }
      },
      {
        "handler": "delphioracle",
        "args": {
          "delphioracle_account": "delphioracle"
        }
      },
      {
        "handler": "atomicmarket",
        "args": {
          "atomicmarket_account": "atomicmarket",
          "store_logs": true
        }
      },
      {
        "handler": "atomictools",
        "args": {
          "atomictools_account": "atomictoolsx",
          "store_logs": true
        }
      }
    ]
  }
]
```

## Iniciar/Detener el Servicio de API Atómica

En este ejemplo, el Servicio de API Atómica comenzará a indexar desde el bloque 64000000 y construirá una nueva base de datos postgres hasta el bloque actual.

Esto tomará algún tiempo y es aconsejable asegurarse de que la indexación se haya puesto al día antes de comenzar a ofrecer la API públicamente.

```
> cd ~/eosio-contract-api

#Iniciar el Filler de Indexación de Postgres#  
> pm2 start ecosystems.config.json --only eosio-contract-api-filler

#Iniciar el Servidor de API#  
> pm2 start ecosystems.config.json --only eosio-contract-api-server

#Monitorear el Filler y el Servidor#  
> pm2 log
```

**_NB:_** _Detener el servicio de filler puede ser problemático ocasionalmente donde reiniciar demasiado pronto puede causar que se ejecuten dos instancias del filler causando una corrupción de la DB. Para evitar esto, asegúrate de que el filler haya dejado de indexar a postgres monitoreando los servicios activos con top o htop antes de reiniciar._

```
#Detener el Filler de Indexación de Postgres#  
> pm2 stop eosio-contract-api-filler

#Detener el Servidor de API#  
> pm2 stop eosio-contract-api-server

#Detener Todo#  
> pm2 stop all

#Verificar usando top o htop#
```

Tu nodo será accesible a través del **puerto http 9000** que, cuando ofrezcas el servicio públicamente, se servirá mejor desde detrás de un balanceador de carga que descargue SSL como HAProxy o nginx.

Consulta el estado de tu nodo como se indica a continuación:

```
> curl http://x.x.x.x:9000/health
> curl http://x.x.x.x:9000/atomicassets/v1/config
> curl http://x.x.x.x:9000/atomicmarket/v1/config
> curl https://x.x.x.x:9000/atomictools/v1/config
```

---

Estas **Guías Técnicas para Desarrolladores de WAX** se crean utilizando material de origen de la [Serie de Cómo Hacerlo Técnico de WAX de EOSphere](https://medium.com/eosphere/wax-technical-how-to/home)

Asegúrate de hacer cualquier pregunta en el [Telegram de EOSphere](https://t.me/eosphere_io)
