---
título: Cómo Configurar un Balanceador de Carga Confiable para WAX
orden: 146
---

Nuestras guías anteriores se han centrado principalmente en construir y ejecutar el software de WAX, pero eso es solo una parte del panorama al proporcionar servicios confiables para el Ecosistema WAX.

Esta guía te guiará a través del proceso de construcción y ejecución de un servicio de Balanceador de Carga para escalar de manera confiable las demandas de seguridad y rendimiento de WAX.

# Cómo Configurar un Balanceador de Carga Confiable para WAX

Escalar tus servicios de API de la Red del Protocolo WAX a millones de solicitudes por día puede ser un desafío si no planeaste con anticipación las necesidades de carga y disponibilidad para proporcionar una entrega de servicio a nivel de Guild.

Implementar Balanceadores de Carga en el lado público de tu infraestructura es una forma fantástica de escalar de manera confiable tu oferta de servicio de API.

Un Balanceador de Carga se implementa principalmente por los siguientes beneficios:

-   Para equilibrar las solicitudes de los usuarios entre varios servidores backend.
-   Descarga el handshake SSL y el cifrado/descifrado.
-   Disminuye la carga de los servidores backend al tener que gestionar sesiones de usuarios de aplicaciones y de red.
-   Crea un punto de demarcación de seguridad para tu oferta de servicio WAX a los usuarios en internet.

[EOSphere](https://eosphere.io/) ha tenido un tremendo éxito utilizando el software [HAProxy](https://www.haproxy.org/) para satisfacer nuestras necesidades de Balanceador de Carga.

_HAProxy es una solución gratuita, **muy** rápida y confiable que ofrece_ [_alta disponibilidad_](http://en.wikipedia.org/wiki/High_availability)_,_ [_balanceo de carga_](http://en.wikipedia.org/wiki/Load_balancer)_, y proxy para aplicaciones basadas en TCP y HTTP. Es particularmente adecuado para sitios web de muy alto tráfico y alimenta a un buen número de los más visitados del mundo. A lo largo de los años se ha convertido en el estándar opensource de facto para balanceadores de carga, ahora se incluye con la mayoría de las distribuciones de Linux y a menudo se implementa por defecto en plataformas en la nube._

Esta guía proporcionará un ejemplo de cómo construir y configurar HAProxy para su uso en la Red del Protocolo WAX basado en nuestra propia experiencia y recomendaciones.

# Requisitos

**Hardware (Funcionar en un entorno virtual es genial)  
**_Nota: Dependiendo del tráfico que recibas, es posible que necesites escalar según sea necesario_

-   CPU de 2 núcleos o más
-   32GB+ de Disco
-   1GB+ de RAM
-   Interfaz de Red Pública
-   Interfaz de Red Privada

**Sistema Operativo**

-   [Ubuntu](https://ubuntu.com/) 18.04
-   [Ubuntu](https://ubuntu.com/) 20.04 **_(Recomendado)_**
-   [Linux 2.4](http://www.kernel.org/) en x86, x86_64, Alpha, Sparc, MIPS, PARISC
-   [Linux 2.6–5.x](http://www.kernel.org/) en x86, x86_64, ARM, AARCH64, MIPS, Sparc, PPC64
-   [Solaris 8/9](http://www.sun.com/software/solaris/) en UltraSPARC 2 y 3
-   [Solaris 10](http://www.sun.com/software/solaris/) en Opteron y UltraSPARC
-   [FreeBSD 4.10 — actual](http://www.freebsd.org/) en x86
-   [OpenBSD 3.1 a -current](http://www.openbsd.org/) en i386, amd64, macppc, alpha, sparc64 y VAX (verifica los ports)
-   [AIX 5.1–5.3](http://www-03.ibm.com/systems/power/software/aix/about.html) en arquitectura Power™

**Internet**

-   Conexión moderna de banda ancha / fibra (100Mb/s sincrónicos y superior)
-   Dirección IP Pública Estática (Ya sea terminando en este nodo o reenviada con NAT)
-   Nombre de Dominio y Proveedor de DNS
-   Certificado SSL

# Instalar el Software

En

 este ejemplo, instalaremos HAProxy desde un Personal Package Archive (PPA) de edición comunitaria recomendado, mantenido por [Vincent Berant](https://launchpad.net/~vbernat) y utilizando la última versión LTS de HAProxy [v2.6.0](https://github.com/haproxy/haproxy/releases/tag/v2.6.0) (Soportado hasta el segundo trimestre de 2027) al momento de octubre de 2022.

Esta compilación tiene soporte nativo para **Prometheus**, lo que te permite ver y exportar métricas y habilita una observabilidad, así como registros y seguimiento geniales.

**Proceso de Instalación**

Usa el siguiente proceso para instalar HAProxy v2.6.0:

```
> sudo apt install --no-install-recommends software-properties-common

> sudo add-apt-repository ppa:vbernat/haproxy-2.6

> sudo apt update> apt install haproxy=2.6.\*
```

Puedes verificar la versión instalada como se muestra a continuación, asegúrate de ver el soporte de Prometheus:

```
> haproxy -vv

Construido con el exportador de Prometheus como servicio
```

# Configuración

Ahora que tienes una instalación fresca de HAProxy, vamos a configurar la instancia para producción. En este ejemplo, el objetivo es:

-   Balancear las solicitudes entrantes a dos servidores WAX API `nodeos`.
-   Descargar el cifrado/descifrado SSL de las sesiones HTTPS.
-   Observar las métricas de HAProxy utilizando el servicio Prometheus.

Este ejemplo tiene una **interfaz de internet pública** que enfrenta a los clientes, así como una **interfaz LAN privada** separada donde se alojan los servidores.

Toda la configuración de HAProxy se encuentra en `haproxy.cfg`. La configuración se divide en 4 secciones.

```
global      
# configuraciones globales van aquí 

defaults      
# valores predeterminados van aquí 

frontend      
# el frontend acepta solicitudes de clientes 

backend      
# servidores para cumplir con la solicitud del cliente van aquí
```

Hay un `haproxy.cfg` predeterminado del que puedes hacer una copia para futuras referencias:

```
> sudo mv /etc/haproxy/haproxy.cfg /etc/haproxy/old_haproxy.cfg
```

Sigue lo siguiente para configurar cada sección en el nuevo `haproxy.cfg`:

```
> sudo nano /etc/haproxy/haproxy.cfg
```

**global**

```
global  
        log /dev/log    local0  
        log /dev/log    local1 notice  
        maxconn 100000  
        chroot /var/lib/haproxy  
        stats socket /run/haproxy/admin.sock mode 660 level admin expose-fd listeners  
        stats timeout 30s  
        tune.ssl.default-dh-param 2048  
        user haproxy  
        group haproxy  
        daemon
        
        # Ubicaciones predeterminadas del material SSL  
        ca-base /etc/ssl/certs  
        crt-base /etc/ssl/private
        
        # Cifras predeterminadas a usar en sockets escuchando SSL.  
        ssl-default-bind-ciphers ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:RSA+AESGCM:RSA+AES:!aNULL:!MD5:!DSS  
        ssl-default-bind-options no-sslv3 no-tlsv10 no-tlsv11
```

**defaults**

```
defaults  
        log     global  
        mode    http  
        http-reuse always  
        option  httplog  
        option  dontlognull  
        timeout connect 10000  
        timeout client  25000  
        timeout server  25000  
        errorfile 400 /etc/haproxy/errors/400.http  
        errorfile 403 /etc/haproxy/errors/403.http  
        errorfile 408 /etc/haproxy/errors/408.http  
        errorfile 500 /etc/haproxy/errors/500.http  
        errorfile 502 /etc/haproxy/errors/502.http  
        errorfile 503 /etc/haproxy/errors/503.http  
        errorfile 504 /etc/haproxy/errors/504.http
```

**frontend**

En esta sección habilitarás tu interfaz pública de internet para aceptar solicitudes entrantes de clientes, también vincularás tu Certificado SSL para poder aceptar HTTPS y proporcionar Descarga de SSL.

```
frontend http-in  
    bind <DIRE

CCIÓN IP PÚBLICA>:80  
    bind <DIRECCIÓN IP PÚBLICA>:443 ssl crt /etc/ssl/certs/eosphere-local-cert-key-2021.pem alpn h2,http/1.1  
    http-response set-header Access-Control-Allow-Origin "*"  
    http-response set-header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization, JSNLog-RequestId, activityId, applicationId, applicationUserId, channelId, senderId, sessionId"
```

EOSphere utiliza certificados SSL wildcard proporcionados por [Comodo](https://comodosslstore.com/), tus resultados pueden variar pero la estructura del `eosphere-local-cert-key-2021.pem` en este ejemplo es la siguiente y en el orden a continuación:

```
your_company.key

your_company.crt

SectigoRSADomainValidationSecureServerCA.crt

USERTrustRSAAAACA.crt
```

Copia y pega el texto en los archivos anteriores en el nuevo archivo único y guarda este archivo creado en `/etc/ssl/certs/<tuempresa_key>.pem`

Además de una configuración típica de frontend, este ejemplo utilizará una lista de acceso para reconocer el tráfico basado en el dominio de destino solicitado. Esto es útil si estabas apoyando otros servicios de API con solicitudes de backend similares pero con diferentes nombres de dominio. Por ejemplo, WAX Mainnet (wax.eosphere.io) y WAX Testnet (wax-testnet.eosphere.io).

Agrega lo siguiente a la sección `frontend http-in` para cubrir las listas de acceso:

```
acl wax_acl hdr(host) -i wax.eosphere.io

use_backend wax_api_servers if wax_acl { path_beg /v1/chain }  
use_backend wax_api_servers if wax_acl { path_beg /v1/node/get_supported_apis }
```

Este ejemplo coincide con solicitudes a wax.eosphere.io

Como nuestros servidores backend no soportan historia, no hemos reenviado `/v1/history` .. ahora estás comenzando a ver el control granular que HAProxy puede proporcionar.

**backend**

Aquí es donde se especificarán los dos servidores WAX `nodeos` y se configurará el algoritmo de balanceo de carga roundrobin en este caso:

```
backend wax_api_servers  
    balance roundrobin  
    default-server check maxconn 3000  
    server wax-pn-1 <IP LAN PRIVADA>:8888 cookie server1  
    server wax-pn-2 <IP LAN PRIVADA>:8888 cookie server2
```

**Prometheus**

Habilita el servicio Prometheus con la siguiente sección adicional de frontend:

```
frontend stats  
        mode http  
        bind <IP PRIVADA>:8404  
        http-request use-service prometheus-exporter if { path /metrics }  
        stats enable  
        stats uri /stats  
        stats refresh 10s
```

# Guardar y Comenzar

Ahora que el archivo `haproxy.cfg` está configurado con éxito, guarda y sal.

Verifica la configuración para errores:

```
> haproxy -c -V -f /etc/haproxy/haproxy.cfg  
El archivo de configuración es válido
```

Reinicia el Servicio HAProxy

```
> sudo service haproxy restart> sudo service haproxy status  
Activo: activo (ejecutándose)
```

El servidor HAProxy ahora aceptará solicitudes al panel de estadísticas alimentado por Prometheus donde puedes observar la operación de tu recién construido Balanceador de Carga HAProxy WAX.

![](https://miro.medium.com/max/700/1*jCwHJe48TawgDX3YpDyosQ.png)

Panel de Estadísticas de HAProxy

```
http://<IP PRIVADA>:8404/stats
```
Y por supuesto, prueba una solicitud externa a tus servidores WAX `nodeos` balanceados después de haber apuntado tu registro A DNS a la dirección IP pública configurada de HAProxy. _NB: Como tenemos una lista de acceso configurada para coincidir con solicitudes interesantes, la solicitud de prueba tendrá que hacerse usando el nombre DNS y no una dirección IP._

```
https://<Tu Nombre de Dominio de la Compañía>/v1/chain/get_info
```

---

Estas **Guías Técnicas para Desarrolladores de WAX** se crean utilizando material fuente de la [Serie de Cómo Hacer Técnico de WAX de EOSphere](https://medium.com/eosphere/wax-technical-how-to/home)

Asegúrate de hacer cualquier pregunta en

 el [Telegram de EOSphere](https://t.me/eosphere_io)