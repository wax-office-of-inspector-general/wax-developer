---
title: Optimizar y restaurar un nodo de API atómica de WAX
order: 1
---

Puede que hayas notado que indexar un nuevo nodo desde el bloque 64000000 ciertamente llevará tiempo, así como que la velocidad actual del servicio de llenado indexando en postgres parecería ser pobre.

Esta guía discutirá cómo restaurar la base de datos de postgres desde una copia de seguridad del nodo preexistente, así como cómo optimizar la gestión de memoria de postgres.

# Optimizar y restaurar un nodo de API atómica de WAX

## **configuración optimizada de postgres**

La configuración predeterminada de [PostgreSQL](https://www.postgresql.org/) deja mucho que desear en lo que respecta a lo que un nodo de API atómica de WAX requiere para operar efectivamente en la Mainnet de WAX.

Me señalaron una excelente herramienta de ajuste de configuración llamada [PGTune](https://pgtune.leopard.in.ua/) que puede ayudar a encontrar algunas buenas configuraciones de postgres para adaptarse a tu implementación.

En este ejemplo tenemos un nodo con 64GB de RAM y 8 CPU Cores:

![](https://miro.medium.com/max/700/1*160Dd0q2PP4BKtbJBTmiAQ.png)

Configuración generada por PGTune

En el entorno de [EOSphere Public Atomic API](https://wax-atomic-api.eosphere.io/docs/), hemos tenido éxito cambiando solo seis de estas configuraciones que fueron derivadas de la guía del equipo [Pink.gg](https://pink.gg/)

**_shared_buffers_**, memoria directamente asignada al búfer interno del servicio de postgres.  
**_effective_cache_size_**, cuánta memoria de caché está disponible para la base de datos.  
**_maintenance_work_mem_**, cuánta memoria está disponible para tareas de mantenimiento como VACUUM y CREATE INDEX.  
**_random_page_cost_**, la estimación del planificador del costo de una página de disco no secuencialmente recuperada.  
**_effective_io_concurrency_**, el número de operaciones de disco I/O concurrentes que PostgreSQL espera que puedan ejecutarse simultáneamente.  
**_work_mem_**, cuánta memoria está disponible para operaciones de ordenación complejas.

Configura PostgreSQL 14 como a continuación:

```
***Detener los servicios PM2 de Atomic API***  
> pm2 stop all

***Se asume 64GB de RAM***
> sudo nano /etc/postgresql/14/main/postgresql.conf

shared_buffers = '32GB';  
effective_cache_size = '48GB';  
maintenance_work_mem = '2GB';  
random_page_cost = 1.1;  
effective_io_concurrency = 300;  
work_mem = '16MB';

> sudo service postgresql restart
```
## copia de seguridad y restauración de postgres

Tener acceso a una copia de seguridad de posgres de Atomic API existente puede ser una forma increíble de poner en marcha tu nodo lo antes posible.

Lo que puede ser aún **más increíble** es si puedes proporcionar una copia de seguridad para que otros la usen también.

Se utilizan dos herramientas de postgres para este proceso, `pg_dump` y `pg_restore`

EOSphere actualmente proporciona [copias de seguridad de la Mainnet de WAX Atomic API](https://store1.eosphere.io/wax/atomic/backups/) en nuestro servidor web de instantáneas. [https://snapshots.eosphere.io/](https://snapshots.eosphere.io/)

Para **crear** una copia de seguridad comprimida sigue el proceso a continuación:

```
> sudo su - postgres

> pg_dump -Fc api-wax-mainnet-atomic-1 > api-wax-mainnet-atomic-1_163Mil.dump

***Esto puede llevar algún tiempo***
```

Para **restaurar** una copia de seguridad comprimida sigue el proceso a continuación:

```
***Eliminar la base de datos existente si es necesario***
> sudo su - postgres
> psql

postgres=# \l+
postgres=# DROP DATABASE "api-wax-mainnet-atomic-1";
postgres=# \q

***Realizar la restauración***
> pg_restore -d api-wax-mainnet-atomic-1 api-wax-mainnet-atomic-1_218Mil.dump

***Esto puede llevar algún tiempo***
```

## Optimizaciones del servidor de API atómica

Recientemente, el equipo de Pink.gg agregó dos excelentes características al servidor de API que permiten que el servicio sea más resist

ente al uso público intensivo.

He copiado y pegado los detalles de la actualización de la comunidad del equipo de Pink sobre estas características a continuación:

**"bill_execution_time”: true**  // Esto cambia la limitación de tasa a un enfoque similar al de la CPU, por lo que las consultas costosas usarán más del límite de tasa disponible. Esto significa que las personas que envían muchas consultas costosas se limitarán más rápido, pero este cambio no debería afectar a quienes solo envían llamadas rápidas y optimizadas.

**“disable_v1_sales”: true**  // Esto dirigirá /v2/sales a /v1/sales porque es mucho más rápido. Este es un cambio importante porque /v1/sales no devolverá ventas canceladas, pero esto reducirá mucho la carga y no muchas personas están interesadas en ventas canceladas. Para aquellos que lo estén, hay un nuevo endpoint /v0/sales que aún sirve la API antigua.

Capturé estas características actualizadas en la [guía anterior](https://medium.com/eosphere/wax-technical-how-to-9-f7d22bfa4e2b), pero para completitud, la configuración está a continuación:

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

## Balanceo de carga y redundancia

Actualmente no hay una [eosio-contract-api](https://github.com/pinknetworkx/eosio-contract-api) de [Pink.gg](https://pink.gg/) disponible que permita múltiples servicios de llenado a un mismo clúster de db.

Como el servidor completo de API atómica sigue siendo de solo alrededor de 1.2TB (27 de diciembre de 2022), hemos tenido éxito y sugerimos que balancees la carga de tu servicio público de API a múltiples servidores de API atómica completamente sincronizados y autónomos.

---

Estas **Guías Técnicas para Desarrolladores de WAX** se crean utilizando material fuente de la [Serie de Cómo Hacer Técnico de WAX de EOSphere](https://medium.com/eosphere/wax-technical-how-to/home)

Asegúrate de hacer cualquier pregunta en [EOSphere Telegram](https://t.me/eosphere_io)
