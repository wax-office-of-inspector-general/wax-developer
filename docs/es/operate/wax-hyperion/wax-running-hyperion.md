---
title: Ejecutando el Historial Completo de WAX Hyperion
---

# Ejecutando el Historial Completo de WAX Hyperion

Continuando con nuestro artículo sobre Configurar los Componentes del Software de WAX Hyperion, el siguiente subartículo de la serie abordará cómo ejecutar realmente un Servicio de Historial Completo de WAX Hyperion en WAX.

EOS RIO tiene un excelente [Repositorio de Documentación de Hyperion](https://hyperion.docs.eosrio.io/) que incluye detalles sobre cómo ejecutar su producto de Historial Completo de Hyperion. Sin embargo, en este artículo se cubrirá el proceso manual para ejecutar Hyperion utilizando Elasticsearch 8.x y los componentes de software asociados.

Una vez más, esta serie de Cómo Técnico cubrirá parte del mismo contenido de EOS RIO y agregará matices operativos desde un punto de vista práctico y nuestra experiencia.

[Aprende más sobre Hyperion de EOS RIO](https://eosrio.io/hyperion/)

![](https://miro.medium.com/v2/resize:fit:598/0*K8f_xpc-l5NSUL7H.png)

_Este artículo ha sido actualizado para reflejar la implementación actual de Hyperion en diciembre de 2024._

# Ejecutando el Historial Completo de WAX Hyperion

Hay tres fases de **Indexación** y una fase de habilitación de **API** al preparar tu servicio de Historial Completo de WAX Hyperion para producción.

**Fase de Escaneo de ABI:**

En esta fase de **abi_scan_mode**, Hyperion indexa todas las Interfaces Binarias de Aplicación (ABI) de los contratos. Esto ocurre en toda la blockchain para que el indexador esté al tanto de qué ABI usar para la deserialización en cualquier momento en la vida del contrato en cadena.

**Fase de Indexación:**

Esta fase realmente indexa datos en Elasticsearch, sin embargo, para asegurar que los datos completos sean ingestados sistemáticamente, **el lector en vivo está deshabilitado** y los bloques están configurados para ser **ingestados en lotes**.

**Fase de Captura de la Indexación:**

Esta fase transiciona al Indexador a un estado operacional, **el lector en vivo está habilitado**, la ingestión de bloques está **configurada al infinito** y **el caché está habilitado**.

**Fase de Habilitación de API**

Esta fase habilita las **consultas de API** de Hyperion.

En el cómo hacer anterior, la configuración de ejemplo dejó la guía lista para comenzar la Fase de Escaneo de ABI, que es donde este artículo continúa.

Recomiendo ejecutar los comandos de Hyperion PM2 usando `screen` en dos ventanas para los registros de PM2 y Comandos, esto proporciona una buena visibilidad de las fases.

```
#Crear una nueva sesión de screen
> screen -US Hyperion

#Mostrar registros de pm2
> pm2 logs

#Crear una nueva pantalla
ctrl-a+c

#Comprobar el estado de pm2
> pm2 status

#Avanzar una pantalla
ctrl-a+n

#Retroceder una pantalla
ctrl-a+p

#Desconectar la sesión de screen
ctrl-a+d

#Reconectar la sesión de screen
> screen -r Hyperion
```

## Ejecutando la Fase de Escaneo de ABI

A continuación se muestra la configuración inicial utilizada para `wax.config.json`:

```
> cd ~/hyperion-history-api/chains

> cp example.config.json wax.config.json

> nano wax.config.json

{
  {
  "api": {
    "enabled": true,
    "pm2_scaling": 1,
    "node_max_old_space_size": 1024,
    "chain_name": "WAX Testnet",
    "server_addr": "<IP ADDRESS FOR SERVER API>",
    "server_port": 7000,
    "stream_port": 1234,
    "stream_scroll_limit": -1,
    "stream_scroll_batch": 500,
    "server_name": "<YOUR PUBLIC SERVER URL>",
    "provider_name": "<YOUR GUILD NAME>",
    "provider_url": "<YOUR ORG URL>",
    "chain_api": "",
    "push_api": "",
    "chain_logo_url": "<CHAIN LOGO.jpg URL>",
    "enable_caching": false, #DISABLED FOR BULK INDEXING#
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
    "disable_tx_cache": true, #DISABLED FOR BULK INDEXING#
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
    "live_reader": false, #DISABLED FOR BULK INDEXING#
    "live_only_mode": false,
    "abi_scan_mode": true, #SET TO ABI_SCAN_MODE#
    "fetch_block": true,
    "fetch_traces": true,
    "disable_reading": false,
    "disable_indexing": false,
    "process_deltas": true,
    "disable_delta_rm": true
  },
  "settings": {
    "preview": false,
    "chain": "wax", #SET CHAINS ID#
    "eosio_alias": "eosio",
    "parser": "3.2", #SET TO 1.8 for < 3.1 SHIP#
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
Se recomienda encarecidamente que el nodo SHIP esté conectado en LAN.

Inicia el Escaneo de ABI como se muestra a continuación:

```
> cd ~/hyperion-history-api

> pm2 start --only wax-indexer --update-env
```

Comprueba que el Escaneo de ABI ha comenzado y que todos los componentes del software son accesibles y están funcionando según lo previsto observando la pantalla de registros de pm2. Remedia cualquier problema de conectividad o configuración.

Esta fase puede llevar muchas horas dependiendo de tu hardware y conectividad de red. Cuando termine, el indexador se detendrá y se mostrará `ABI SCAN COMPLETE`. Ahora puedes pasar con confianza a la Fase de Indexación.

## Ejecutando la Fase de Indexación

En esta fase, el `wax.config.json` necesita ser modificado para deshabilitar abi_scan_mode y configurar los lotes de bloques a

 ser ingestados. Mi recomendación es comenzar con lotes de 5000000 para asegurar que todo esté siendo ingestado sin problemas.

Asegúrate de que lo siguiente esté configurado o modificado en el `wax.config.json`:

```
"enable_caching": false, #DESACTIVADO PARA INDEXACIÓN MASIVA#
"disable_tx_cache": true, #DESACTIVADO PARA INDEXACIÓN MASIVA#
    
"start_on": 0,
"stop_on": 5000000, #PRIMER LOTE DE BLOQUES DE INDEXACIÓN#
"live_reader": false, #DESACTIVADO PARA INDEXACIÓN MASIVA#
"abi_scan_mode": false, #CONFIGURADO PARA FASE DE INDEXACIÓN#
"scaling": { #CONFIGURACIONES CONSERVADORAS#
    "readers": 1,
    "ds_queues": 1,
    "ds_threads": 2,
    "ds_pool_size": 2,
    "indexing_queues": 1,
    "ad_idx_queues": 1,
    "dyn_idx_queues": 1,
    "max_autoscale": 4,

```

Inicia el Indexador como se muestra a continuación:

```
> cd ~/hyperion-history-api

> pm2 start --only wax-indexer --update-env
```

Observa los registros de pm2 para asegurarte de que los documentos estén siendo indexados. Las colas pueden ser monitoreadas en la Interfaz de Usuario Web de RabbitMQ.

```
http://<DIRECCIÓN IP DEL SERVIDOR>:15672
```

![](https://miro.medium.com/v2/resize:fit:700/1*xmEJMSw1V6xR4ul2JJxBpg.png)

Cuando los primeros 5000000 bloques se hayan indexado con éxito, el indexador se detendrá y se mostrará un mensaje en los registros de pm2 avisando `BLOCK RANGE COMPLETED`.

El rango de bloques del indexador ahora puede ser ajustado en el `wax.config.json` para el siguiente lote y luego el indexador puede ser iniciado como antes. Dependiendo de cómo se haya manejado tu implementación, es posible que desees aumentar o disminuir este rango.

```
"start_on": 5000001,#CONTINUAR DESDE EL PRIMER LOTE#  
"stop_on": 1100000, #SEGUNDO LOTE DE BLOQUES DE INDEXACIÓN#
```

Continúa este proceso hasta que estés casi al corriente con el bloque de cabeza actual de la cadena.

La indexación masiva puede ser muy pesada en recursos de hardware y puede llevar días. Notarás que se han utilizado configuraciones bastante conservadoras para el escalado de índices en este ejemplo. Mi consejo es que menos a menudo puede ser más, comienza con estas configuraciones de ejemplo y ajusta incrementalmente si es necesario observando los registros de pm2 y la Interfaz de Usuario Web de RabbitMQ.

## Ejecutando la Fase de Captura de la Indexación

Cuando la indexación se haya completado lo más cerca posible del bloque de cabeza actual de la cadena, puedes hacer la transición a un modo normal de operación de índices. Esta fase habilitará el lector en vivo, la ingestión normal de bloques y el caché.

Asegúrate de que lo siguiente esté configurado o modificado en el `wax.config.json`:

```
"enable_caching": true,
"disable_tx_cache": false,
    
"start_on": 0,
"stop_on": 0,
"live_reader": true,
```

Inicia el Indexador como se muestra a continuación:

```
> cd ~/hyperion-history-api

> pm2 start --only wax-indexer --update-env
```

Si tu indexador de Hyperion estaba cerca del bloque de cabeza, esta fase no debería llevar mucho tiempo. Observa los registros de pm2 para verificar cuándo te has puesto al día con éxito y luego continúa iniciando la API.

Si por alguna razón necesitas detener el indexador, usa la opción `pm2 trigger` para asegurarte de que las colas actuales se completen antes de detener:

```
> pm2 trigger wax-indexer stop
```

## **Fase de Habilitación de la API**

Esta fase final está ejecutando la API de Hyperion, que ya ha sido configurada en los archivos de configuración anteriores de este ejemplo:

```
"api": {
    "enabled": true,
    "pm2_scaling": 1,
    "node_max_old_space_size": 1024,
    "chain_name": "WAX Testnet",
    "server_addr": "<DIRECCIÓN IP DEL SERVIDOR DE LA API>",
    "server_port": 7000, 
    "stream_port": 1234,
    "stream_scroll_limit": -1,
    "stream_scroll_batch": 500,
   

 "server_name": "<URL PÚBLICA DE TU SERVIDOR>",
    "provider_name": "<NOMBRE DE TU GUILD>",
    "provider_url": "<URL DE TU ORGANIZACIÓN>",
    "chain_api": "",
    "push_api": "",
    "chain_logo_url": "<URL DE LOGO DEL CHAIN.jpg>",
    "enable_caching": true,
    "cache_life": 1,
    "limits": {
      "get_actions": 1000,
      "get_voters": 100,
      "get_links": 1000,
      "get_deltas": 1000,
      "get_trx_actions": 200
```

Inicia la API de Hyperion como se muestra a continuación, permitiendo consultas en el puerto :7000

```
> pm2 start --only wax-api --update-env
```

Observa los registros de pm2 para verificar un inicio exitoso de la API. Luego, la API puede ser consultada para obtener información sobre su salud, lo que te dejará con una sensación de satisfacción de que todos los componentes están funcionando según lo previsto.

En particular, asegúrate de que `last_indexed_block` sea igual a `total_indexed_blocks`, mostrando que hemos indexado todos los bloques hasta el bloque de cabeza actual.

```
> curl [http://<DIRECCIÓN IP DEL SERVIDOR>:7000/v2/health](https://wax-testnet.eosphere.io/v2/health)

{"version":"3.3.10","version_hash":"3c24fea14d424eeef5fe2719238ef4e2ee65dc4e","host":"wax-testnet.eosphere.io","health":[{"service":"RabbitMq","status":"OK","time":1735014759377},{"service":"NodeosRPC","status":"OK","service_data":{"head_block_num":347074519,"head_block_time":"2024-12-24T04:32:39.500","time_offset":-165,"last_irreversible_block":347074187,"chain_id":"f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12"},"time":1735014759335},{"service":"Elasticsearch","status":"OK","service_data":{"active_shards":"100.0%","head_offset":3,"first_indexed_block":2,"last_indexed_block":347074516,"total_indexed_blocks":347074514,"missing_blocks":0,"missing_pct":"0.00%"},"time":1735014759338}],"features":{"streaming":{"enable":true,"traces":true,"deltas":true},"tables":{"proposals":true,"accounts":true,"voters":true},"index_deltas":true,"index_transfer_memo":true,"index_all_deltas":true,"deferred_trx":false,"failed_trx":false,"resource_limits":false,"resource_usage":false},"cached":true,"query_time_ms":0.323,"last_indexed_block":347074522,"last_indexed_block_time":"2024-12-24T04:32:41.000"}
```

Felicidades, ahora has construido, configurado y estás ejecutando un Servicio de Historial Completo de WAX Hyperion con éxito, listo para ser hecho públicamente disponible desde detrás de un Balanceador de Carga con descarga SSL como HAProxy.

El siguiente artículo de **Historial Completo de WAX Hyperion** cubrirá la solución de problemas de bloques faltantes, monitoreo de Elasticsearch, así como asegurando que los servicios web de Hyperion estén disponibles.

---

Estas **Guías Técnicas para Desarrolladores de WAX** se crean utilizando material fuente de la [Serie de Cómo Técnico de WAX de EOSphere](https://medium.com/eosphere/wax-technical-how-to/home)

Asegúrate de hacer cualquier pregunta en el [Telegram de EOSphere](https://t.me/eosphere_io)