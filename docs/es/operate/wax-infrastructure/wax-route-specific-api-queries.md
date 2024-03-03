---
title: Cómo Enrutar Consultas de API Específicas Entre Nodos
---

# Cómo Enrutar Consultas de API Específicas Entre Nodos

En una conversación con [Anders|Anyobservation|Björk](https://twitter.com/anyobservation), creador de [Anyobservation | Crypto Fun Stuff](https://anyo.io/), él advirtió que muchos nuevos miembros de la comunidad estaban intentando ejecutar todos sus servicios públicos en un solo nodo, sin ser conscientes de que esto puede tener un impacto en la velocidad y la confiabilidad de su oferta.

Esta guía discutirá el proceso y la configuración para separar consultas de API públicas específicas entre nodos utilizando HAProxy.

## **Cómo enrutar consultas de API específicas entre nodos**

_Antes de discutir el enrutamiento de consultas de API, debe mencionarse que fácilmente una de las formas más rápidas de mejorar el rendimiento/velocidad del software WAX_ `_nodeos_` _para servicios públicos, es proporcionar nodos separados específicamente para pares públicos anunciados (P2P). Más de 100 pares en un nodo pueden ocupar más del 50% de un_ `_nodeos_` _dejando menos para consultas de API._

`nodeos`, que es el demonio del servicio principal del software WAX, se ejecuta en cada nodo de la Red del Protocolo WAX y desafortunadamente es principalmente de un solo hilo. Esto significa que cuantas más instancias del servicio `nodeos` estén disponibles para consultas de API públicas, más eficiente y equilibrado será el servicio de API. Además, algunos servicios públicos de WAX se ofrecen utilizando otro software y tienen sus propios requisitos técnicos únicos, como Hyperion, Atomic API o incluso un sitio web.

En este ejemplo, HAProxy se utilizará para crear políticas que permitan distribuir un servicio de API público entre múltiples nodos según la consulta solicitada. Asegúrese de revisar nuestras guías anteriores de HAProxy para obtener detalles sobre cómo construir y configurar HAProxy en su totalidad.

## Configuración

Toda la configuración de HAProxy se encuentra en `haproxy.cfg`.

En este ejemplo, el objetivo es:

-   Configurar el frontend de HAProxy para reconocer el tráfico basado en la URL (el frontend es una IP pública y el backend es una LAN privada)
-   Configurar el frontend para enrutar el tráfico a los servidores de backend apropiados según la consulta específica
-   Configurar los servidores de backend, el algoritmo de equilibrio de carga y los umbrales

Siga el ejemplo a continuación para configurar cada sección en el nuevo `haproxy.cfg`:

```
> sudo nano /etc/haproxy/haproxy.cfg
```
**frontend**

Configure una lista de acceso llamada `wax_acl` para reconocer solicitudes para su URL, en este caso `wax.eosphere.io`. Haciendo esto, podrá escalar este balanceador de carga para admitir múltiples URL y redes.

```
frontend http-in  
acl wax_acl hdr(host) -i wax.eosphere.io
```

Vincula la lista de acceso anterior a un grupo de servidores de backend y especifica dónde se debe enrutar cada consulta específica. El ejemplo de configuración a continuación hace lo siguiente:

-   Las consultas API v1 normales se envían al backend `wax_api_servers`.
-   Las consultas de bloques API v1 normales se envían al backend `wax_api_blocks_servers`, estos servidores tienen el `block.log` completo.
-   Las consultas de historial API v1 y v2 se envían al backend `wax_hyperion_servers`, que es un clúster Hyperion.
-   Los portales web de Hyperion Swagger y Block Explorer se envían al backend `wax_hyperion_servers_web`.
-   Las consultas de API atómicas se envían al backend `wax_atomic_api_servers`, que es un servidor atomic eosio-contract-api.

```
frontend http-in  
use_backend wax_hyperion_servers_web if wax_acl { path_beg /v2/docs }  
use_backend wax_hyperion_servers_web if wax_acl { path_beg /v2/explore }  
use_backend wax_hyperion_servers if wax_acl { path_beg /v2 }  
use_backend wax_hyperion_servers if wax_acl { path_beg /v1/history }  
use_backend wax_hyperion_servers if wax_acl { path_beg /socket.io }  
use_backend wax_api_block_servers if wax_acl { path_beg /v1/chain/get_block }  
use_backend wax_api_servers if wax_acl { path_beg /v1/chain }  
use_backend wax_api_servers if wax_acl { path_beg /v1/node }  
use_backend wax_atomic_api_servers if wax_acl { path_beg /health }  
use_backend wax_atomic_api_servers if wax_acl { path_beg /atomicassets }  
use_backend wax_atomic_api_servers if wax_acl { path_beg /atomictools }  
use_backend wax_atomic_api_servers if wax_acl { path_beg /atomicmarket }
```

_Es importante tener en cuenta que las_ **_reglas del frontend deben estar ordenadas de más específicas a menos específicas_**, _por ejemplo_ `_path_beg /_` _en la parte superior de la lista superará todas las reglas que estén debajo de ella._

**backend**

Configura los grupos de servidores de backend para que coincidan con tu infraestructura y aplique políticas específicas para cada grupo de servidores.

El backend proporciona un excelente lugar para aplicar umbrales específicos para mitigar abusos, como se discutió en nuestras guías anteriores, junto con el enrutamiento de consultas específicas, debería quedar claro que HAProxy se puede aprovechar para obtener una granularidad de políticas excelente.

La configuración a continuación proporciona ejemplos de servidores y políticas para que coincidan con la configuración anterior.

```
backend wax_hyperion_servers_web  
    balance roundrobin  
    default-server check maxconn 1000  
    server wax-hyperion-3 <PRIVATE LAN IP>:7000 cookie server1backend wax_hyperion_servers  
    balance roundrobin  
    default-server check maxconn 500  
    server wax-hyperion-1 <PRIVATE LAN IP>:7000 cookie server1  
    server wax-hyperion-2 <PRIVATE LAN IP>:7000 cookie server2backend wax_api_block_servers  
    balance roundrobin  
    default-server check maxconn 3000  
    server wax-pn-4 <PRIVATE LAN IP>:8888 cookie server1backend wax_api_servers  
    balance roundrobin  
    default-server check maxconn 3000  
    server wax-pn-1 <PRIVATE LAN IP>:8888 cookie server1  
    server wax-pn-2 <PRIVATE LAN IP>:8888 cookie server2  
    server wax-pn-3 <PRIVATE LAN IP>:8888 cookie server3backend wax_atomic_api_servers  
    balance leastconn  
    default-server check maxconn 800  
    server wax-atomic-1 <PRIVATE LAN IP>:9000 cookie server1  
    server wax-atomic-2 <PRIVATE LAN IP>:9000 cookie server2
 ```

Tenga en cuenta que este artículo no es una guía sobre cómo configurar su infraestructura específica o una política de enrutamiento de consultas granular. Sin embargo, saber cómo se puede configurar HAProxy para optimizar su oferta de servicios públicos debería hacer que se sienta más seguro al escalar API en una red extremadamente exigente y ocupada como la WAX Mainnet.