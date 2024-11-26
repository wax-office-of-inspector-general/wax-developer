---
title: Optimise & Restore a WAX Atomic API Node
---

You may have noticed that indexing a new node from block 64000000 will certainly take some time as well as the actual speed of the filler service indexing in postgres would appear to be poor.

This guide will discuss restoring the postgres database from a pre existing node’s backup as well as how to optimise postgres memory management.

# Optimise & Restore a WAX Atomic API Node

## **postgres optimised configuration**

The default  [PostgreSQL](https://www.postgresql.org/)  configuration leaves a lot to be desired in regards to what a WAX Atomic API Node requires to operate effectively on the WAX Mainnet.

I was actually pointed to an excellent config tuning tool call  [PGTune](https://pgtune.leopard.in.ua/)  which may help come up with some good postgres configuration settings to suit your deployment.

In this example we have a node with 64GB RAM and 8 CPU Cores:

![](https://miro.medium.com/max/700/1*160Dd0q2PP4BKtbJBTmiAQ.png)

Generated PGTune Configuration

In the  [EOSphere Public Atomic API](https://wax-atomic-api.eosphere.io/docs/)  environment we have had success in changing only six of these settings which were derived from guidance from the  [Pink.gg](https://pink.gg/)  Team

**_shared_buffers_**_,_ memory directly allocated the postgres service internal buffer.  
**_effective_cache_size_**, how much cache memory is available for the database.  
**_maintenance_work_mem_**, how much memory is available for maintenance tasks such as VACUUM and CREATE INDEX.  
**_random_page_cos_**_t_, the planner’s estimate of the cost of a non-sequentially-fetched disk page.  
**_effective_io_concurrency_**, the number of concurrent disk I/O operations that PostgreSQL expects can be executed simultaneously.  
**_work_mem_**, how much memory is available for complex sort operations.

Configure PostgreSQL 14 as below:

```
***Stop the Atomic API PM2 services***  
> pm2 stop all

***64GB RAM Assumed***
> sudo nano /etc/postgresql/14/main/postgresql.conf

shared_buffers = '32GB';  
effective_cache_size = '48GB';  
maintenance_work_mem = '2GB';  
random_page_cost = 1.1;  
effective_io_concurrency = 300;  
work_mem = '16MB';

> sudo service postgresql restart
```
## postgres backup and restoration

Having access to an existing Atomic API posgres backup can be awesome way to get your node up and running as soon as possible.

What can be even  **more awesome**  is if you can provide a backup for others to use as well.

Two postgres tools are used for this process  `pg_dump`  and  `pg_restore`

EOSphere currently provide  [WAX Mainnet Atomic API backups](https://store1.eosphere.io/wax/atomic/backups/)  on our snapshot webserver.  [https://snapshots.eosphere.io/](https://snapshots.eosphere.io/)

In order to  **create**  a compressed backup follow the process below:

```
> sudo su - postgres

> pg_dump -Fc api-wax-mainnet-atomic-1 > api-wax-mainnet-atomic-1_163Mil.dump

***This may take some time***
```

In order to  **restore**  a compressed backup follow the process below:

```
***Delete the existing database if necessary***
> sudo su - postgres
> psql

postgres=# \l+
postgres=# DROP DATABASE "api-wax-mainnet-atomic-1";
postgres=# \q

***Perfom the restore***
> pg_restore -d api-wax-mainnet-atomic-1 api-wax-mainnet-atomic-1_218Mil.dump

***This may take some time***
```

## Atomic API Server optimisations

Recently the Pink.gg Team added two excellent features to the API Server that enables the service to be more resilient to heavy public use.

I have copied and pasted the Pink Team community update details on these features below:

**"bill_execution_time”: true**  // This changes rate limiting to a CPU like approach, so expensive queries will use more from the available rate limit. This means people spamming a lot of expensive queries are rate limited faster but this change should not affect anyone that only sends fast and optimized calls

**“disable_v1_sales”: true**  // This will route /v2/sales to /v1/sales because its much faster. This is a breaking change because /v1/sales wont return cancelled sales anymore but this will reduce load a lot and not many people are interested in cancelled sales. For those who are, there is a new /v0/sales endpoint which still serves the old API

I captured these updated features in the  [previous guide](https://medium.com/eosphere/wax-technical-how-to-9-f7d22bfa4e2b)  , but for completeness the configuration is below:

```
> cd  ~/eosio-contract-api/config
> cp example-server.config.json server.config.json
> nano server.config.json
{
  "provider_name": "EOSphere Guild",
  "provider_url": "https://eosphere.io","server_addr": "0.0.0.0",
  "server_name": "wax-atomic-api.eosphere.io",
  "server_port": 9000,"cache_life": 5,
  "trust_proxy": true,"rate_limit": {
    "interval": 60,
    "requests": 240,
    "bill_execution_time": true
  },"ip_whitelist": [],
  "slow_query_threshold": 7500,"max_query_time_ms": 10000,
  "max_db_connections": 50,"namespaces": [
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

## Load Balancing and Redundancy

Currently there isn’t a  [Pink.gg](https://pink.gg/)  [eosio-contract-api](https://github.com/pinknetworkx/eosio-contract-api)  available feature that enables multiple filler services to the same db cluster.

As the complete Atomic API server is still only around 1.2TB (27th December 2022), we have had success and suggest that you load balance your public API service to multiple completely synced and self standing Atomic API servers.

---

These **WAX Developer Technical Guides** are created using source material from the [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home)

Be sure to ask any questions in the  [EOSphere Telegram](https://t.me/eosphere_io)
