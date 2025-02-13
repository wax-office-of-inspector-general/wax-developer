---
título: WAX Hyperion Streaming con un Balanceador de Carga WAX
---

El historial completo de WAX Hyperion es excelente para ejecutar consultas ultrarrápidas en datos históricos indexados, sin embargo, ciertas dApps, aplicaciones y casos de uso específicos requieren una vista en vivo de los datos indexados. Hyperion está bastante capacitado para proporcionar esto a través de una función llamada transmisión (streaming).

La función de transmisión de Hyperion se habilita simplemente en el archivo `wax.config.json` y puede ser accedida y utilizada mediante el [Cliente de Transmisión de Hyperion de EOS RIO](https://github.com/eosrio/hyperion-stream-client).

Un problema común que se encuentra después de habilitar esta función de transmisión en un servicio de Historial Completo de WAX Hyperion en producción es que simplemente no funcionará cuando esté detrás de un balanceador de carga. La razón de esto es que la transmisión de Hyperion utiliza una conexión websocket en un puerto no estándar por defecto e, idealmente, requiere que el balanceador de carga esté configurado y escuchando solicitudes de actualización de websocket.

Este artículo de la serie describirá cómo habilitar y configurar la transmisión de Hyperion utilizando websockets en [HAProxy](http://www.haproxy.org/).

EOS RIO tiene un excelente [Repositorio de Documentación de Hyperion](https://hyperion.docs.eosrio.io/) que incluye detalles sobre cómo ejecutar su producto Hyperion Full History, sin embargo, este artículo ampliará su documentación actual.

Una vez más, esta serie de Tutoriales Técnicos cubrirá parte del mismo contenido de EOS RIO y añadirá matices operativos desde un punto de vista práctico y basado en nuestra experiencia.

[Conoce más sobre EOS RIO Hyperion](https://eosrio.io/hyperion/)

![](https://miro.medium.com/v2/resize:fit:598/0*VJM9YUUmYPzi9zEc.png)

_Este artículo ha sido actualizado para reflejar la implementación actual de Hyperion en diciembre de 2024._

# Transmisión de WAX Hyperion con un Balanceador de Carga WAX

Los websockets crean una conexión dúplex completa entre cliente y servidor a través de una sola conexión TCP, la cual es utilizada por la función de transmisión de Hyperion. Para proporcionar equilibrio de carga y redundancia de este servicio de transmisión, se necesita un proxy inverso que admita websockets.

HAProxy tiene una capacidad automatizada muy práctica para actualizar una conexión HTTP existente a un websocket TCP utilizando las **cabeceras HTTP** **Connection: Upgrade** y **Upgrade: websocket**, y también puede configurarse para simplemente reconocer una **URL específica** que apunte directamente al servidor websocket o al servicio de transmisión en este caso.

Una vez que se establece la conexión de túnel TCP del websocket, permanecerá activa hasta que uno de los nodos la termine o hasta que se alcance el tiempo de espera de la sesión. A continuación se muestra un diagrama que tomé de HAProxy para visualizar el flujo de configuración.

![](https://miro.medium.com/v2/resize:fit:700/0*6VaGcMEzPyrGnvwf.png)

Flujo y tiempos de espera de cada fase del websocket.

Puedes leer más sobre el [Equilibrio de Carga de Websockets con HAProxy](https://www.haproxy.com/blog/websockets-load-balancing-with-haproxy/) en el sitio web de HAProxy.

En mi investigación también leí un buen artículo sobre la solución de problemas de [tiempos de espera de Websocket/HAProxy](https://lucjan.medium.com/investigating-websocket-haproxy-reconnecting-and-timeouts-6d19cc0002a1), tu experiencia puede variar al usar nodos State-History, pero puede ser ventajoso configurar un tiempo de espera específico del túnel. El nuestro está configurado en 35 segundos en la sección de predeterminados de HAProxy, como se muestra a continuación.

```
defaults  
timeout tunnel  35000
```

En este ejemplo, HAProxy se configurará para reconocer una conexión+actualización de websocket y dirigir estas solicitudes a un servidor de transmisión de Hyperion; si tu implementación tiene más de una API de transmisión de Hyperion, estas solicitudes se equilibrarán la carga.

Asegúrate de revisar "Cómo Configurar un Balanceador de Carga WAX Confiable" para obtener detalles sobre cómo construir y configurar completamente HAProxy.

# Configuración

En este ejemplo, el objetivo es:

- Habilitar la transmisión en el servidor de API de Hyperion.
- Configurar el frontend de HAProxy para reconocer el tráfico basado en URL y las cabeceras HTTP Connect+Upgrade (el frontend es una IP pública y el backend es una red LAN privada).
- Configurar el frontend para enrutar el tráfico al backend de API de transmisión de Hyperion adecuado según el tráfico de websocket.
- Configurar el frontend para aceptar conexiones websocket `ws:` o websocket seguras `wss:`. _El protocolo `wss:` establece un WebSocket sobre una conexión TLS cifrada, mientras que el protocolo `ws:` utiliza una conexión no cifrada._
- Configurar servidores backend, algoritmo de equilibrio de carga y umbrales.

## Configuración de Hyperion

La transmisión se habilita en el archivo `wax.config.json` como se muestra a continuación:

```
> nano wax.config.json  
  
  "features": {  
    "streaming": {  
      "enable": true,  
      "traces": true,  
      "deltas": true  
    },
```

Por defecto, el puerto de websocket de transmisión es `:1234`, que es el que usamos, pero puede cambiarse manualmente como se muestra a continuación:

```
> nano wax.config.json  
  
"api":  
 "stream_port": 1234,  
 "stream_scroll_limit": -1,  
 "stream_scroll_batch": 500
```

Una vez configurado, reinicia el indizador de Hyperion y el proceso PM2 de la API de Hyperion:

```
> cd ~/hyperion-history-api  
> pm2 start --only wax-indexer --update-env  
> pm2 start --only wax-api --update-env
```

El servicio de transmisión se puede probar localmente ejecutando el siguiente comando:

```
> curl 127.0.0.1:1234/stream/  
  
{"code":0,"message":"Transport unknown"}
```

## Configuración de HAProxy

La configuración de HAProxy se encuentra en `haproxy.cfg`. Sigue lo siguiente para configurar cada sección:

```
> sudo nano /etc/haproxy/haproxy.cfg
```

**frontend**

Configura una lista de acceso llamada `wax_acl` para reconocer solicitudes HTTP normales para tu URL, en este caso `wax.eosphere.io`. Luego configura dos listas de acceso, una para reconocer una solicitud de conexión de actualización `wax_con_upg_acl` y otra para reconocer una actualización a una solicitud de websocket `wax_ws_upg_acl`.

```
frontend http-in  
acl wax_acl hdr(host) -i wax.eosphere.io  
  
acl wax_con_upg_acl hdr(Connection)  -i upgrade  
acl wax_ws_upg_acl  hdr(Upgrade)     -i websocket  
  
##Alternativamente, se puede usar una URL específica de websocket en lugar de una actualización dinámica para dirigir todo el tráfico a tus servidores state-history##  
  
acl wax_acl hdr(host) -i ws-wax.eosphere.io
```

Vincula la lista de acceso anterior a un grupo de servidores backend especificando el grupo de servidores websocket de transmisión de Hyperion y el grupo de servidores API HTTP normal. En este ejemplo, se configura lo siguiente:

- Las consultas de API v1 normales se envían al backend `wax_api_servers`.
- El tráfico de websocket se envía al backend `wax_hyperion_streaming_servers`.

```
use_backend wax_api_servers if wax_acl { path_beg /v1/chain }  
use_backend wax_api_servers if wax_acl { path_beg /v1/node/get_supported_apis }  
  
use_backend wax_hyperion_streaming_servers if wax_acl wax_con_upg_acl wax_ws_upg_acl
```

Si has configurado tu HAProxy para aceptar HTTPS en el puerto :443 y proporcionar descarga SSL (consulta "Cómo Configurar un Balanceador de Carga WAX Confiable" para más detalles), tu proxy inverso aceptará conexiones `wss:` además de `ws:`.

**backend**

Configura los grupos de servidores backend para que coincidan con tu infraestructura y aplique políticas específicas para cada grupo de servidores, en este caso servidores API HTTP y servidores websocket de transmisión de Hyperion.

La configuración a continuación proporciona ejemplos de servidores y políticas para coincidir con la configuración anterior. En particular, los `wax_hyperion_streaming_servers` están configurados para verificar si están disponibles (se marcarán como inactivos y no se utilizarán si no están disponibles) con un máximo de 200 conexiones especificadas.

```
backend wax_api_servers  
    balance roundrobin  
    default-server check maxconn 10000  
    server wax-pn-1 <IP PRIVADA DE LA RED LAN>:8888 cookie server1 weight 1              
    server wax-pn-2 <IP PRIVADA DE LA RED LAN>:8888 cookie server2 weight 1              
    server wax-pn-3 <IP PRIVADA DE LA RED LAN>:8888 cookie server3 weight 4  
  
backend wax_hyperion_streaming_servers  
    balance leastconn  
    default-server check maxconn 200  
    server wax-hyperion-api-1 <IP PRIVADA DE LA RED LAN>:1234 cookie server1 weight 1             
    server wax-hyperion-api-2 <IP PRIVADA DE LA RED LAN>:1234 cookie server2 weight 1
```

Se utiliza `balance leastconn` para los servidores de transmisión de Hyperion en este ejemplo, ya que parece ser un método mejor para equilibrar conexiones de larga duración según nuestra experiencia.

¡Y eso es todo! Tu servicio de transmisión de Hyperion está listo para su uso público.
Por supuesto, hay muchas maneras de configurar el equilibrio de carga y la resiliencia de websockets para servicios WAX. El ejemplo de este artículo es cómo estamos configurados actualmente en EOSphere y te proporcionará suficientes detalles para personalizarlo para tu propia implementación.

---
Estas **Guías Técnicas para Desarrolladores de WAX** se crean utilizando material fuente de la [Serie Técnica Cómo Hacerlo de WAX de EOSphere](https://medium.com/eosphere/wax-technical-how-to/home)

No dudes en hacer cualquier pregunta en el [Telegram de EOSphere](https://t.me/eosphere_io)