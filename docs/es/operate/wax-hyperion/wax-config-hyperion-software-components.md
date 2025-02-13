---
title: Configurar Componentes de Software Hyperion WAX
---

# Configurar Componentes de Software Hyperion WAX

Continuando con nuestro artículo sobre la construcción de componentes de software Hyperion WAX, este siguiente subartículo de la serie guiará a través de la configuración de cada uno de estos componentes.

EOS RIO tiene un excelente [Repositorio de Documentación Hyperion](https://hyperion.docs.eosrio.io/) que incluye detalles sobre cómo configurar todos los componentes de software de Hyperion, sin embargo, en este artículo se cubrirá el proceso de configuración manual para Hyperion usando Elasticsearch 8.x y los componentes de software asociados.

Una vez más, esta serie de Cómo Hacerlo Técnico cubrirá parte del mismo contenido de EOS RIO y agregará matices operacionales desde un punto de vista práctico y nuestra experiencia.

[Aprende más sobre EOS RIO Hyperion](https://eosrio.io/hyperion/)

![](https://miro.medium.com/v2/resize:fit:598/0*e9la30mQaOGWxfmM.png)

_Este artículo ha sido actualizado para reflejar la implementación actual de Hyperion en diciembre de 2024._

# Configurar Componentes de Software Hyperion WAX

El servicio de Historial Completo Hyperion es una colección de **ocho** aplicaciones de software construidas por EOS RIO y aplicaciones estándar de la industria.

Este ejemplo de paseo por la configuración tiene todos los componentes de software, excluyendo el nodo SHIP, instalados en un solo servidor Ubuntu 22.04 como por "Construir Componentes de Software Hyperion WAX".
Este ejemplo de servidor también está equipado con 16GB de RAM y un moderno CPU de 8 núcleos a 4Ghz, adecuado para ejecutar Historial Completo en el Testnet WAX. También se recomienda deshabilitar el espacio de intercambio del sistema.

Por favor, referencia "Introducción a Hyperion Full History WAX" para sugerencias de infraestructura, especialmente al considerar proporcionar el servicio en Mainnet WAX.

El proceso de configuración para cada uno de estos bloques de construcción primarios se cubre a continuación:

## Nodo de Estado-Historia (SHIP) del Software WAX

La implementación de Hyperion WAX requiere acceso a un Nodo de Estado-Historia WAX completamente sincronizado. Este proceso de configuración se cubre extensamente en [WAX Technical How To #7](https://medium.com/eosphere/wax-technical-how-to-7-9ccc102efd9d).

## RabbitMQ

Sigue el proceso de configuración a continuación:

```
#Habilita la Interfaz de Usuario Web
> sudo rabbitmq-plugins enable rabbitmq_management

#Añade Hyperion como un Host Virtual
> sudo rabbitmqctl add_vhost hyperion

#Crea un USUARIO y CONTRASEÑA (Suplanta con los tuyos)
> sudo rabbitmqctl add_user <USUARIO> <CONTRASEÑA>

#Establece tu USUARIO como Administrador
> sudo rabbitmqctl set_user_tags <USUARIO> administrator

#Establece los permisos de tu USUARIO al Host Virtual
> sudo rabbitmqctl set_permissions -p hyperion <USUARIO> ".*" ".*" ".*"
```

Verifica el acceso a la Interfaz de Usuario Web usando un navegador:

```
http://<DIRECCIÓN IP DEL SERVIDOR>:15672
```

## Redis

La versión 7.x de Redis tiene una política de memoria predeterminada complicada de _usar toda la memoria disponible sin expulsión_, lo que significa que usará toda la memoria disponible hasta que se agote y se bloquee.

Para manejar este desafío, es importante establecer la política de memoria a **allkeys-lru** (Mantiene las claves más recientemente usadas; elimina las claves menos recientemente usadas). Hemos asignado el 25% de la memoria del Nodo Hyperion a Redis con buenos resultados.

Configura como a continuación:

```
> sudo nano /etc/redis/redis.conf

###GENERAL###
daemonize yes
supervised systemd

###GESTIÓN DE MEMORIA###
maxmemory 4gb
maxmemory-policy allkeys-lru

> sudo systemctl restart redis-server

> sudo systemctl enable redis-server
```

Para ver la configuración y estadísticas de memoria de Redis:

```
> redis-cli  
-> info memory
```

Depura problemas de Redis en los logs:

```
> sudo tail -f /var/log/redis/redis-server.log
```

## Node.js

Aquí no hay nada que configurar

, sin embargo, asegúrate de estar ejecutando Node.js v22

```
> node -v  
v22.x.x
```

## PM2

Aquí no hay nada que configurar, verifica que estás ejecutando la última versión de PM2`5.4.3`

```
> pm2 --version  
5.4.3
```

## Elasticsearch

Configura Elasticsearch 8.x como a continuación:

```
> sudo nano /etc/elasticsearch/elasticsearch.yml

cluster.name: <TU NOMBRE DE CLÚSTER>
node.name: <TU NOMBRE DE NODO>
bootstrap.memory_lock: true
network.host: <Dirección IP LAN>
cluster.initial_master_nodes: ["<DIRECCIÓN IP LAN>"]
```

Además de la configuración anterior, también puede ser ventajoso cambiar el marcador de uso de disco de Elasticsearch (80% es el alto predeterminado) y el número máximo de fragmentos por nodo (1000 es el máximo predeterminado de fragmentos) dependiendo de tu implementación.

```
> sudo nano /etc/elasticsearch/elasticsearch.yml  
  
cluster.routing.allocation.disk.threshold_enabled: true  
cluster.routing.allocation.disk.watermark.low: 93%  
cluster.routing.allocation.disk.watermark.high: 95%  
  
cluster.max_shards_per_node: 3000
```

Configura la configuración de la Máquina Virtual Java como a continuación, no excedas el umbral OOP de 31GB, este ejemplo usará 8GB adecuado para Hyperion en el Testnet WAX y el 50% de la memoria del servidor:

```
> sudo nano /etc/elasticsearch/jvm.options

-Xms8g  
-Xmx8g
```

Permite que el servicio Elasticsearch bloquee la memoria jvm requerida en el servidor

```
> sudo systemctl edit elasticsearch

[Service]  
LimitMEMLOCK=infinity
```

Configuración de systemctrl a continuación:

```
#Recarga Unidades
> sudo systemctl daemon-reload

#Inicia Elasticsearch
> sudo systemctl start elasticsearch.service

#Inicia Elasticsearch automáticamente al arrancar
> sudo systemctl enable elasticsearch.service
```

Verifica que Elasticsearch esté corriendo:

```
> sudo systemctl status elasticsearch.service
```

Depura problemas de Elasticsearch en los logs:

```
> sudo tail -f /var/log/elasticsearch/gc.log

> sudo tail -f /var/log/elasticsearch/<TU NOMBRE DE CLÚSTER>.log
```

Prueba la API Rest que por defecto requerirá acceso al certificado del clúster Elasticsearch y se ejecutará como root para acceder al cert:

```
> sudo su -

root@>  curl --cacert /etc/elasticsearch/certs/http_ca.crt -u elastic https://<DIRECCIÓN IP LAN>:9200

**Ingresa la contraseña "superusuario" de "elastic"***
Enter host password for user 'elastic':
{
  "name" : "<TU NOMBRE DE NODO>",
  "cluster_name" : "<TU NOMBRE DE CLÚSTER>",
  "cluster_uuid" : "36T00kPBT6qq8Tb1JYUgCw",
  "version" : {
    "number" : "8.13.2",
    "build_flavor" : "default",
    "build_type" : "deb",
    "build_hash" : "16cc90cd2d08a3147ce02b07e50894bc060a4cbf",
    "build_date" : "2024-04-05T14:45:26.420424304Z",
    "build_snapshot" : false,
    "lucene_version" : "9.10.0",
    "minimum_wire_compatibility_version" : "7.17.0",
    "minimum_index_compatibility_version" : "7.0.0"
  },
  "tagline" : "You Know, for Search"
}
```

## Kibana

Elasticsearch 8.x trae algunas eficiencias en cuanto a conectar nodos adicionales y servicios de pila como Kibana al utilizar automáticamente certificados. Esto es genial, por supuesto, sin embargo, el Indexador y la API de Hyperion no tienen un mecanismo en este momento para utilizar un certificado para conectarse a la API REST de Elasticsearch y esta función parece estar vinculada al SSL.

_Tus resultados pueden variar, pero ha sido mi experiencia que la manera más segura de asegurar que el software de Hyperion pueda conectarse a Elasticsearch 8.x sin un certificado es deshabilitar el cifrado para las conexiones de clientes de la API HTTP. Como toda esta comunicación entre nodos ocurre de manera privada en tu

 centro de datos, no debería ser un problema._

**ACTUALIZACIÓN:** Utilizando una instalación fresca de la última versión de Elasticsearch, pude conectar Hyperion con SSL encriptado (HTTPS) dejando la configuración automática del certificado funcionando bien con Kibana. Dejaré ambas opciones en esta guía para ser completo.

Configura Kibana como a continuación:

```
> sudo nano /etc/kibana/kibana.yml

server.host: "0.0.0.0"
```

Configuración de systemctrl a continuación:

```
#Recarga Unidades  
> sudo systemctl daemon-reload

#Inicia Kibana  
> sudo systemctl start kibana

#Inicia Kibana automáticamente al arrancar  
> sudo systemctl enable kibana.service
```

Verifica que Kibana esté corriendo:

```
> sudo systemctl status kibana.service
```

A continuación, demostraré ambas formas de conectar Kibana a Elasticsearch 8.x, utilizando el método automático de certificados y luego utilizando un método local no encriptado con contraseña.

**Método de Certificado:**

Genera y copia un token de inscripción en el **Servidor Elasticsearch** para ser utilizado por Kibana:

```
> sudo /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s kibana
```

Conéctate a la Interfaz de Usuario Web de Kibana usando un navegador y pega el token de acceso:

```
http://<DIRECCIÓN IP DEL SERVIDOR>:5601/
```

![](https://miro.medium.com/v2/resize:fit:362/0*fPU_ArMH4YpmxpdZ.png)

Ingresa el Token de Inscripción de Kibana

Obtén el código de verificación de Kibana desde la línea de comandos del servidor Kibana e ingrésalo en la GUI de Kibana:

```
> sudo /usr/share/kibana/bin/kibana-verification-code  
Tu código de verificación es:  XXX XXX
```

Kibana ahora está conectado a Elasticsearch, puedes iniciar sesión con el nombre de usuario "elastic" y la contraseña de "superusuario" de elastic.

**Método de Contraseña:**

La cuenta kibana_system necesitará ser habilitada con una contraseña en Elasticsearch, copia la salida de la contraseña:

```
> sudo su - root@> /usr/share/elasticsearch/bin/elasticsearch-reset-password -u kibana_system
```

Luego agrega las credenciales + detalles del host al archivo de configuración de Kibana y si es necesario, comenta con HASH# la configuración SSL generada automáticamente en el fondo del archivo .yml:

```
> sudo nano /etc/kibana/kibana.yml

elasticsearch.hosts: ["http://<DIRECCIÓN IP DEL SERVIDOR>:9200"]

elasticsearch.username: "kibana_system"
elasticsearch.password: "<CONTRASEÑA>"
```

Deshabilita la seguridad xpack para clientes de la API HTTP en Elasticsearch:

```
#Habilita el cifrado para conexiones de clientes de la API HTTP, como Kibana, Logstash y Agentes

xpack.security.http.ssl:  
  enabled: false
```

Finalmente, reinicia Elasticsearch y Kibana:

```
> sudo systemctl restart elasticsearch.service

> sudo systemctl restart kibana.service
```

Depura problemas de Kibana en los logs del sistema:

```
> tail -f /var/log/syslog
```

**_Idealmente, sería mejor si se pudieran usar certificados para todo el acceso a la API REST, actualizaré este artículo cuando tenga conocimiento de una solución adecuada._**

## EOS RIO Hyperion Indexador y API

Hay dos archivos .json necesarios para ejecutar el Indexador y la API de Hyperion. `connections.json` y `.config.json`

**connections.json**

El siguiente ejemplo de `connections.json` está configurado para WAX Testnet, modifica la configuración y la red para tu propia implementación. Esta configuración utiliza un usuario y una contraseña para conectarse a Elasticsearch con HTTP.

```
> cd ~/hyperion-history-api

> cp example-connections.json connections.json

> sudo nano connections.json

{
  "amqp": {
    "host": "127.0.0.1:5672",
    "api": "127.0.0.1:15672",
    "protocol": "http",
    "user": "<USUARIO Rabbitmq>",
    "pass": "<CONTRASEÑA Rabbitmq>",
    "vhost": "hyperion",
    "frameMax

": "0x10000"
  },
  "elasticsearch": {
    "protocol": "http",
    "host": "<DIRECCIÓN IP DEL SERVIDOR>:9200",
    "ingest_nodes": [
      "<DIRECCIÓN IP DEL SERVIDOR>:9200"
    ],
    "user": "elastic",
    "pass": "<contraseña superusuario>"
  },
  "redis": {
    "host": "127.0.0.1",
    "port": "6379"
  },
  "chains": {
    "wax": {
      "name": "WAX Testnet", #ACTUALIZA#
      "chain_id": "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12",
      "http": "http://<DIRECCIÓN IP DE LA API DE NODEOS>:8888",
      "ship": "ws://<DIRECCIÓN IP DE SHIP DE NODEOS>:8080",
      "WS_ROUTER_HOST": "127.0.0.1",
      "WS_ROUTER_PORT": 7001,
      "control_port": 7002
    }
  }
}
```

**.config.json**

El archivo `.config.json` se nombra para reflejar el nombre de la cadena en este caso `wax.config.json`. La configuración, como antes, necesita ser ajustada para adaptarse a tu propia configuración e implementación utilizando el ejemplo proporcionado como base.

Hay tres fases al iniciar un nuevo Indexador Hyperion, la primera fase es lo que se llama el "Escaneo ABI", que es el modo predeterminado en el software proporcionado `example.config.json`.

La siguiente configuración (un servidor de EOSphere) preparará este ejemplo para estar listo para ejecutar la fase de Escaneo ABI de Indexación que se cubrirá en el siguiente artículo.

Configura como a continuación, toma nota de los parámetros **#ACTUALIZA#**

```
> cd ~/hyperion-history-api/chains

> cp example.config.json wax.config.json

> nano wax.config.json

{
  "api": {
    "enabled": true,
    "pm2_scaling": 1,
    "node_max_old_space_size": 1024,
    "chain_name": "WAX Testnet", #ACTUALIZA#
    "server_addr": "<DIRECCIÓN IP PARA LA API DEL SERVIDOR>", #ACTUALIZA#
    "server_port": 7000,
    "stream_port": 1234,
    "stream_scroll_limit": -1,
    "stream_scroll_batch": 500,
    "server_name": "<URL PÚBLICA DE TU SERVIDOR>", #ACTUALIZA#
    "provider_name": "<NOMBRE DE TU GUILD>", #ACTUALIZA#
    "provider_url": "<URL DE TU ORGANIZACIÓN>", #ACTUALIZA#
    "chain_api": "",
    "push_api": "",
    "chain_logo_url": "<URL DEL LOGO.jpg DE LA CADENA>", #ACTUALIZA#
    "enable_caching": false, #DESHABILITADO PARA INDEXACIÓN MASIVA#
    "cache_life": 1,
    "limits": {
      "get_actions": 1000,
      "get_voters": 100,
      "get_links": 1000,
      "get_deltas": 1000,
      "get_trx_actions": 200
    },
    "access_log": false,
    "chain_api_error_log": false,
    "custom_core_token": "",
    "enable_export_action": false,
    "disable_rate_limit": false,
    "rate_limit_rpm": 1000,
    "rate_limit_allow": [],
    "disable_tx_cache": true, #DESHABILITADO PARA INDEXACIÓN MASIVA#
    "tx_cache_expiration_sec": 3600,
    "v1_chain_cache": [
      {
        "path": "get_block",
        "ttl": 3000
      },
      {
        "path": "get_info",
        "ttl": 500
      }
    ]
  },
  "indexer": {
    "enabled": true,
    "node_max_old_space_size": 4096,
    "start_on": 0,
    "stop_on": 0,
    "rewrite": false,
    "purge_queues": false,
    "live_reader": false, #DESHABILITADO PARA INDEXACIÓN MASIVA#
    "live_only_mode": false,
    "abi_scan_mode": true, #ESTABLECIDO PARA MODO DE ESCANEO ABI#
    "fetch_block": true,
    "fetch_traces": true,
    "

disable_reading": false,
    "disable_indexing": false,
    "process_deltas": true,
    "disable_delta_rm": true
  },
  "settings": {
    "preview": false,
    "chain": "wax", #ESTABLECE EL ID DE LA CADENA#
    "eosio_alias": "eosio",
    "parser": "3.2", #ESTABLECE A 1.8 para SHIP < 3.1#
    "auto_stop": 0,
    "index_version": "v1",
    "debug": false,
    "bp_logs": false,
    "bp_monitoring": false,
    "ipc_debug_rate": 60000,
    "allow_custom_abi": false,
    "rate_monitoring": true,
    "max_ws_payload_mb": 256,
    "ds_profiling": false,
    "auto_mode_switch": false,
    "hot_warm_policy": false,
    "custom_policy": "",
    "index_partition_size": 10000000,
    "es_replicas": 0
  },
  "blacklists": {
    "actions": [],
    "deltas": []
  },
  "whitelists": {
    "actions": [],
    "deltas": [],
    "max_depth": 10,
    "root_only": false
  },
  "scaling": {
    "readers": 1,
    "ds_queues": 1,
    "ds_threads": 1,
    "ds_pool_size": 1,
    "indexing_queues": 1,
    "ad_idx_queues": 1,
    "dyn_idx_queues": 1,
    "max_autoscale": 4,
    "batch_size": 5000,
    "resume_trigger": 5000,
    "auto_scale_trigger": 20000,
    "block_queue_limit": 10000,
    "max_queue_limit": 100000,
    "routing_mode": "round_robin",
    "polling_interval": 10000
  },
  "features": {
    "streaming": {
      "enable": false,
      "traces": false,
      "deltas": false
    },
    "tables": {
      "proposals": true,
      "accounts": true,
      "voters": true
    },
    "index_deltas": true,
    "index_transfer_memo": true
    "index_all_deltas": true,
    "deferred_trx": false,
    "failed_trx": false,
    "resource_limits": false,
    "resource_usage": false
  },
  "prefetch": {
    "read": 50,
    "block": 100,
    "index": 500
  },
  "plugins": {}
}
```

Toda la configuración está ahora lista para pasar a ejecutar el Indexador y la API de Hyperion por primera vez, esto se cubrirá en el siguiente subartículo de **WAX Hyperion Full History**.

---

Estas **Guías Técnicas para Desarrolladores WAX** se crean utilizando material fuente de la [Serie Cómo Hacerlo Técnico de EOSphere WAX](https://medium.com/eosphere/wax-technical-how-to/home)

Asegúrate de hacer cualquier pregunta en el [Telegram de EOSphere](https://t.me/eosphere_io).