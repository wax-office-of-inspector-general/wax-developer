---
title: Configurar Soporte Websocket en un Balanceador de Carga de WAX
---



Los servicios ofrecidos por la red WAX, como la API Atómica y Hyperion, dependen en gran medida de un servicio de Historial de Estado resiliente, también conocido como nodo de Protocolo de Historial de Estado (SHIP). A diferencia de otras API HTTP de software WAX, State-History hace uso de un protocolo de comunicación bidireccional llamado websocket, que afortunadamente es compatible con HAProxy.

Esta guía explicará cómo configurar HAProxy para admitir la resiliencia y el equilibrio de carga de websockets entre múltiples nodos de Historial de Estado.

## Cómo Configurar Soporte Websocket en un Balanceador de Carga de WAX

Los websockets crean una conexión full-duplex entre cliente y servidor sobre una sola conexión TCP, que es utilizada por el servicio de Historial de Estado del software WAX. Para proporcionar equilibrio de carga y redundancia de este servicio SHIP, se necesita un proxy inverso que admita websockets.

HAProxy tiene una capacidad automatizada muy útil para actualizar una conexión HTTP existente a un websocket TCP utilizando **Connection: Upgrade** y **Upgrade: websocket** **encabezados HTTP**, también se puede configurar para reconocer simplemente una **URL** específica que apuntará directamente al servidor websocket o SHIP en este caso.

Una vez que se establece la conexión del túnel TCP websocket, permanecerá activa hasta que uno de los nodos se desconecte o hasta que se alcance el tiempo de espera de la sesión. A continuación, se muestra un diagrama que tomé prestado de HAPrroxy para visualizar el flujo de configuración.

![](https://miro.medium.com/max/700/1*BRDEW0nrF7LAjDRP3Nqyeg.png)

El diagrama anterior muestra el flujo de websocket y los tiempos de espera de cada fase.

Puedes leer más sobre [Equilibrio de Carga de Websockets con HAProxy](https://www.haproxy.com/blog/websockets-load-balancing-with-haproxy/) en el sitio web de HAProxy.

En mi investigación, también leí un buen artículo sobre la solución de problemas de [tiempos de espera de Websocket/HAProxy](https://lucjan.medium.com/investigating-websocket-haproxy-reconnecting-and-timeouts-6d19cc0002a1), tu experiencia puede variar al usar nodos de Historial de Estado, pero puede ser ventajoso configurar un tiempo de espera de túnel específico. El nuestro está establecido en 35 segundos en la sección de valores predeterminados de HAProxy como se muestra a continuación.

```bash
defaults  
timeout tunnel  35000
```

En este ejemplo, HAProxy se configurará para reconocer un encabezado de conexión+actualización de websocket y para equilibrar estas solicitudes entre un grupo de nodos de Historial de Estado de WAX.

Asegúrate de revisar nuestras guías anteriores sobre Balanceador de Carga de WAX para obtener detalles sobre cómo construir y configurar HAProxy en su totalidad.

# Configuración

Toda la configuración de HAProxy se encuentra en `haproxy.cfg`.

En este ejemplo, el objetivo es:

- Configurar el frontend de HAProxy para reconocer el tráfico basado en URL y el encabezado HTTP Connect+Upgrade (el frontend es una IP pública y el backend es una LAN privada).
- Configurar el frontend para enrutar el tráfico a los servidores backend apropiados basados en tráfico HTTP o websocket.
- Configurar el frontend para aceptar conexiones tanto websocket `ws:` como websocket seguro `wss:`. _El protocolo_ `_wss:_` _establece un WebSocket sobre una conexión TLS cifrada, mientras que el protocolo_ `_ws:_` _utiliza una conexión no cifrada._
- Configurar servidores backend, algoritmo de balanceo y umbrales.

Sigue el ejemplo a continuación para configurar cada sección en el nuevo `haproxy.cfg`:

```bash
> sudo nano /etc/haproxy/haproxy.cfg
```

**frontend**

Configura una lista de acceso llamada `wax_acl` para reconocer las solicitudes HTTP normales para tu URL, en este caso `wax.eosphere.io`. Luego, configura dos listas de acceso, una para reconocer una solicitud de actualización de conexión `wax_con_upg_acl` y otra para reconocer una actualización a una solicitud de websocket `wax_ws_upg_acl`.

```bash
frontend http-in  
acl wax_acl hdr(host) -i wax.eosphere.io

acl wax_con_upg_acl hdr(Connection)  -i upgrade  
acl wax_ws_upg_acl  hdr(Upgrade)     -i websocket

##Alternativamente, se puede utilizar una URL websocket específica en lugar de una actualización dinámica para dirigir todo el tráfico a tus servidores de Historial de Estado##

acl wax_acl hdr(host) -i ws-wax.eosphere.io
```

Vincula la lista de acceso anterior a un grupo de servidores backend especificando los grupos de servidores websocket y de API HTTP normales. En este ejemplo, se configura lo siguiente:

- Las consultas API v1 normales se envían al backend `wax_api_servers`.
- El tráfico websocket se envía al backend `wax_ship_servers`.

```bash
use_backend wax_api_servers if wax_acl { path_beg /v1/chain } 
use_backend wax_api_servers if wax_acl { path_beg /v1/node/get_supported_apis }

use_backend wax_ship_servers if wax_con_upg_acl wax_ws_upg_acl
```

Si has configurado tu HAProxy para aceptar HTTPS en el puerto :443 y proporcionar Descarga de SSL (revisa nuestras guías anteriores para obtener detalles), tu proxy inverso aceptará conexiones `wss:` así como `ws:`. ¿Más fácil de lo que pensabas, verdad?

**backend**

Configura los grupos de servidores backend para que coincidan con tu infraestructura y aplique polít

icas específicas para cada grupo de servidores, en este caso servidores de API HTTP y servidores SHIP websocket.

La configuración a continuación proporciona ejemplos de servidores y políticas para que coincidan con la configuración anterior. En particular, los `wax_ship_servers` están configurados para ser verificados si están disponibles (se marcarán como inactivos y no se utilizarán si no están disponibles) con un máximo de 200 conexiones especificadas.

```bash
backend wax_api_servers  
    balance roundrobin  
    default-server check maxconn 10000  
    server wax-pn-1 <IP LAN PRIVADA>:8888 cookie server1 weight 1              
    server wax-pn-2 <IP LAN PRIVADA>:8888 cookie server2 weight 1              
    server wax-pn-3 <IP LAN PRIVADA>:8888 cookie server3 weight 4backend wax_ship_servers  
    balance leastconn  
    default-server check maxconn 200  
    server wax-state-history-1 <IP LAN PRIVADA>:8080 cookie server1 weight 1             
    server wax-state-history-2 <IP LAN PRIVADA>:8080 cookie server2 weight 1
```

`balance leastconn` se usa para los servidores SHIP en este ejemplo, ya que parece ser un mejor método para equilibrar conexiones de larga duración desde mi perspectiva.

Además, también es posible monitorear/verificar el estado de los servidores de historial de estado de backend consultando su estado frente al bloque principal de la red. La comunidad ha desarrollado dos soluciones para su uso con comprobaciones de HAProxy.

- cc32d9 -> [eosio-haproxy](https://github.com/cc32d9/eosio-haproxy)
- EOS sw/eden -> [eosio-api-healthcheck](https://github.com/eosswedenorg/eosio-api-healthcheck)

Por supuesto, hay una multitud de formas de configurar el equilibrio de carga y la resiliencia de websocket para los servicios WAX, el ejemplo en este artículo es cómo estamos configurados en EOSphere.

Algo a tener en cuenta en mis pruebas usando la API Atómica y Hyperion, si el nodo SHIP no está en LAN, el rendimiento del indexado puede verse degradado. Así que asegúrate de mantener tus nodos SHIP cerca.

---

Estas **Guías Técnicas para Desarrolladores de WAX** se crean utilizando material fuente de la [Serie Técnica de WAX de EOSphere](https://medium.com/eosphere/wax-technical-how-to/home)

Asegúrate de hacer cualquier pregunta en el [Telegram de EOSphere](https://t.me/eosphere_io)
