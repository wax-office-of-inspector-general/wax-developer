---
título: Corregir Bloques Perdidos en WAX Hyperion Full History
---

Indexar inicialmente la red principal de WAX completa desde el bloque de génesis llevará tiempo y puede ser bastante pesado en términos de recursos de hardware, lo que puede causar pausas o interrupciones en el proceso de indexación. Además, si has seguido nuestra sugerencia de indexar rangos de bloques por lotes, es posible que te encuentres con una situación en la que hay huecos en tu conjunto de bloques indexados en el historial completo. 

Este artículo de la serie describirá el proceso para identificar los huecos en tu conjunto de bloques del historial completo y cómo corregirlos *manualmente*.

EOS RIO tiene un excelente [Repositorio de Documentación de Hyperion](https://hyperion.docs.eosrio.io/) que incluye detalles sobre cómo ejecutar su producto Hyperion Full History, sin embargo, este artículo amplía su documentación específicamente en relación con la operación de Hyperion utilizando Elasticsearch 8.x.

Una vez más, esta serie de Tutoriales Técnicos cubrirá parte del mismo contenido de EOS RIO y añadirá matices operativos desde un punto de vista práctico y basado en nuestra experiencia.

[Conoce más sobre EOS RIO Hyperion](https://eosrio.io/hyperion/)

![](https://miro.medium.com/v2/resize:fit:449/0*pY_GWzqlqGfAO7Kf.png)

_Este artículo ha sido actualizado para reflejar la implementación actual de Hyperion en diciembre de 2024._

## Corregir Bloques Perdidos en WAX Hyperion Full History

Primero debe identificarse si tu implementación efectivamente tiene bloques perdidos; esta información se muestra claramente en la consulta `health` de la API de Hyperion.
Los bloques o rangos específicos que faltan pueden identificarse detalladamente utilizando la biblioteca de visualización integrada de Kibana.

El archivo `wax.config.json` de Hyperion puede configurarse para llenar específicamente estos bloques o rangos perdidos.

Finalmente, puedes asegurarte mediante una consulta `health` de que tu conjunto de bloques de WAX Full History está completo.

_Hay un_ [_script automatizado de reparación de Hyperion_](https://github.com/eosrio/hyperion-history-api/tree/v3.3.5/scripts/fix_missing_blocks) _que realiza esta tarea, sin embargo, este artículo cubrirá el proceso manual. Esta herramienta será abordada en un artículo futuro._

### Identificar ###

Primero realiza una consulta `health` de tu API de Hyperion, ya sea a través de un navegador web o una solicitud curl.

```
> curl http://<DIRECCIÓN IP DE HYPERION>:7000/v2/health  
  
{"version":"3.3.9-8","version_hash":"b94f99d552a8fe85a3ab2c1cb5b84ccd6ded6af4","host":"wax.eosphere.io","health":[{"service":"RabbitMq","status":"OK","time":1695776754095},{"service":"NodeosRPC","status":"OK","service_data":{"head_block_num":268611130,"head_block_time":"2023-09-27T01:05:53.500","time_offset":552,"last_irreversible_block":268610794,"chain_id":"1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4"},"time":1695776754052},{"service":"Elasticsearch","status":"OK","service_data":{"active_shards":"100.0%","head_offset":0,"first_indexed_block":2,**"last_indexed_block":247081398**,**"total_indexed_blocks":162203179**,**"missing_blocks":84878217**,"missing_pct":"34.35%"},"time":1695776754053}],"features":{"streaming":{"enable":true,"traces":true,"deltas":true},"tables":{"proposals":true,"accounts":true,"voters":true},"index_deltas":true,"index_transfer_memo":true,"index_all_deltas":true,"deferred_trx":false,"failed_trx":false,"resource_limits":false,"resource_usage":false},"cached":true,"query_time_ms":0.208,"last_indexed_block":247081398,"last_indexed_block_time":"2023-09-27T01:05:59.500"}
```

Notarás que `“last_indexed_block”:247081398` y `“total_indexed_blocks”:162203179` tienen valores diferentes, como indica `“missing_blocks”:84878217`, lo que sugiere que hay bloques perdidos en este ejemplo de índice de Historial Completo.

Siempre habrá una diferencia de 2 bloques entre los indicadores totales y últimos, pero los bloques perdidos mostrarán el número real de bloques faltantes.

### Localizar ###

Ahora que se ha identificado que hay bloques perdidos, Kibana puede utilizarse para localizar visualmente los bloques o rangos perdidos.

Inicia sesión en Kibana usando un navegador:

```
http://<DIRECCIÓN IP DE KIBANA>:5601

```
Selecciona [Administración de Stack] -> [Vistas de Datos]:

![](https://miro.medium.com/v2/resize:fit:435/1*1jFNSMn-G_Fq-3GUXxmkzQ.jpeg)

Selecciona [Crear vista de datos] e introduce `wax-block*` en el campo [Nombre] para coincidir con el patrón de índice de bloques -> finalmente selecciona [Crear vista de datos]:

![](https://miro.medium.com/v2/resize:fit:525/1*Db-nzkD1ga-fcKTeT57d0w.jpeg)

Selecciona [Biblioteca de Visualización]:

![](https://miro.medium.com/v2/resize:fit:272/1*utzx7wMztfrYxA3mTK-weg.jpeg)

Selecciona [Crear visualización] -> [Lens]

![](https://miro.medium.com/v2/resize:fit:427/1*aUjWmss93W6SoDkfEQLZuw.jpeg)

Asegúrate de que la vista de datos `wax-block*` esté seleccionada:

![](https://miro.medium.com/v2/resize:fit:305/1*XY2hIt0pTT04FA_bsUf1WQ.jpeg)

En el [Eje horizontal], en [Campo] -> [Campos disponibles], selecciona [# block_num] -> [Cerrar]

![](https://miro.medium.com/v2/resize:fit:299/1*e0KlGRqJVHCuviBHNQshNA.jpeg)

En el eje vertical, en [Funciones], selecciona [Recuento] -> Cerrar

![](https://miro.medium.com/v2/resize:fit:294/1*cIQvJ2MwqONh_-Yz_RrxUA.jpeg)

Ajusta el rango de fechas para asegurarte de visualizar todo el rango de bloques desde el bloque de génesis.

En el siguiente ejemplo podemos observar múltiples huecos en nuestro conjunto de bloques del historial completo, el primero siendo desde **bloque 107,925,000 hasta bloque 130,000,000**:

![](https://miro.medium.com/v2/resize:fit:525/1*D-HF_UIWqC4BVosJlh6d4A.jpeg)

Ejemplo de Bloques Perdidos

### Corregir ###

El siguiente ejemplo cubrirá cómo completar los bloques perdidos para el primer rango identificado.

Primero detén el indizador de WAX Hyperion de manera elegante limpiando las colas:

```
> pm2 trigger wax-indexer stop  
1 procesos han recibido la orden de detenerse  
[wax-indexer:0:wax]={"ack":true}
```

Edita los ajustes del indizador en `wax.config.json` para cubrir el rango de bloques perdidos y permitir la reescritura de cualquier bloque existente:

```
> nano ~/hyperion-history-api/chains/wax.config.json  
  
  "indexer": {  
    "enabled": true,  
    "node_max_old_space_size": 4096,  
    "start_on": 107925000, #AJUSTAR#
    "stop_on": 130000000, #AJUSTAR#
    "rewrite": true, #HABILITAR REESCRITURA# 
    "purge_queues": false,  
    "live_reader": false, #DESACTIVADO PARA LA RECUPERACIÓN DE INDEXACIÓN#  
    "live_only_mode": false,  
    "abi_scan_mode": false,  
    "fetch_block": true,  
    "fetch_traces": true,  
    "disable_reading": false,  
    "disable_indexing": false,  
    "process_deltas": true,  
    "disable_delta_rm": true  
  },
```

Luego reinicia el indizador y monitorea el progreso en `pm2 logs`:

```
> pm2 start --only wax-indexer --update-env
```

Repite el proceso para cualquier otro bloque o rango perdido identificado.
Una vez que estés seguro de que los huecos han sido corregidos, reconfigura los ajustes del indizador en `wax.config.json` para el funcionamiento normal:

```
> nano ~/hyperion-history-api/chains/wax.config.json  
  
  "indexer": {  
    "enabled": true,  
    "node_max_old_space_size": 4096,  
    "start_on": 0, #RESTABLECER#
    "stop_on": 0, #RESTABLECER#
    "rewrite": false, #DESACTIVAR REESCRITURA#
    "purge_queues": false,  
    "live_reader": true, #HABILITADO PARA INDEXACIÓN NORMAL#  
    "live_only_mode": false,  
    "abi_scan_mode": false,  
    "fetch_block": true,  
    "fetch_traces": true,  
    "disable_reading": false,  
    "disable_indexing": false,  
    "process_deltas": true,  
    "disable_delta_rm": true  
  },
```

Reinicia el indizador, monitorea el progreso en `pm2 logs` y verifica nuevamente la API de WAX Hyperion con una consulta `health`:

```
> pm2 start --only wax-indexer --update-env  
  
> curl http://<DIRECCIÓN IP DE HYPERION>:7000/v2/health
```

Asegúrate de que `“last_indexed_block”:` y `“total_indexed_blocks”:` tengan el mismo valor.
![](https://miro.medium.com/v2/resize:fit:525/1*lu2Nio99aqpdgInYCh9-fg.jpeg)
Índice de WAX Hyperion Full History Completamente Indexado

¡Felicitaciones! Ahora tu WAX Hyperion Full History está saludable y tienes una práctica visualización de Kibana para verificar fácilmente el estado de tu oferta de Historial Completo.

---
Estas **Guías Técnicas para Desarrolladores de WAX** se crean utilizando material fuente de la [Serie Técnica Cómo Hacerlo de WAX de EOSphere](https://medium.com/eosphere/wax-technical-how-to/home)

No dudes en hacer cualquier pregunta en el [Telegram de EOSphere](https://t.me/eosphere_io)