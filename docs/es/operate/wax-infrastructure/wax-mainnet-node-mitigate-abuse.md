---
título: Cómo Mitigar el Abuso de API en un Balanceador de Carga WAX
orden: 147
---

Aunque puedas estar proporcionando un servicio de nivel de Guild WAX con un HAProxy de alto rendimiento, este servicio aún está abierto a ser explotado por usuarios codiciosos o maliciosos.

Esta guía te guiará a través de la configuración de políticas de respuesta de HAProxy para mitigar este tipo de amenazas.

# Cómo Mitigar el Abuso de API en un Balanceador de Carga WAX

En el ejemplo de HAProxy de la guía anterior, habrás notado que se configuró una variable `maxconn` en la sección **global** así como en la sección **backend**.

`maxconn` es un límite estricto que impedirá que se establezcan más de las conexiones especificadas al servicio de API cuando se alcance este umbral, sin embargo, es indiscriminado y detendrá a los buenos actores junto con los abusadores de API.

HAProxy tiene una manera más elegante de identificar y limitar el abuso, dos de estos mecanismos se discutirán en este artículo.

## Límite de Tasa de Ventana Deslizante

También conocido como la implementación de **listas de negación pegajosas** son una forma de limitar el número de solicitudes que un usuario de una dirección IP específica puede hacer de tus API’s durante un período de tiempo.

En este ejemplo de configuración hay un límite de **200 solicitudes de API** por dirección IP de origen permitidas durante un **período de 5 segundos**. Este período de tiempo es una ventana deslizante. Si se alcanza el umbral, el usuario es denegado y recibe un error 429.

_Error HTTP 429 es un código de estado de respuesta HTTP que indica_ **_que la aplicación cliente ha superado su límite de tasa_**_, o número de solicitudes que pueden enviar en un período de tiempo dado._

![image](https://user-images.githubusercontent.com/12730423/201574327-6544b9f4-209f-4da0-b833-00e76afe6531.png)

Sigue lo siguiente para configurar cada sección en el `haproxy.cfg`

```
> sudo nano /etc/haproxy/haproxy.cfg
```

**frontend**

```
frontend http-in  
    http-request track-sc0 src table wax_api_servers
```
Esta configuración crea una tabla específica en HAProxy.

**backend**
```
backend wax_api_servers  
    stick-table type ip size 50k expire 30s store http_req_rate(5s)  
    http-request deny deny_status 429 if { sc_http_req_rate(0) gt 200 }
```

Esta configuración aplica la política al backend específico.

Guarda y sal de `haproxy.cfg`, verifica tu configuración y reinicia el servicio.

```
> haproxy -c -V -f /etc/haproxy/haproxy.cfg  
El archivo de configuración es válido

> sudo service haproxy restart

> sudo service haproxy status  
Activo: activo (ejecutándose)
```
Si estás utilizando el panel de estadísticas con Prometheus, puedes ver el número de usuarios de API que alcanzan este umbral y son denegados con 429. **-Respuestas HTTP 4xx:**

![image](https://user-images.githubusercontent.com/12730423/201574775-18ee6c3d-0a3e-4148-960b-dc2059f8bacb.png)

## Foso de Alquitrán (Tarpit)

El ejemplo de lista de negación **deny** le da a los posibles abusadores una notificación inmediata de que han sido denegados, a menudo provocando un reintento en milisegundos. La política de respuesta Tarpit de HAProxy acepta la conexión del cliente, pero luego espera un tiempo predefinido (10 segundos en este ejemplo) antes de devolver una respuesta de denegación. Esto puede ocupar los recursos del usuario malicioso limitando su capacidad para continuar atacando tu API.

Esencialmente, el foso de alquitrán se configura en la política de lista de pegajosa reemplazando **deny** con **tarpit**

Sigue lo siguiente para configurar cada sección en el `haproxy.cfg` para enmendar la política anterior.

```
> sudo nano /etc/hapro

xy/haproxy.cfg
```

**backend**

```
backend wax_api_servers  
    stick-table type ip size 50k expire 30s store http_req_rate(5s)  
    http-request tarpit deny_status 429 if { sc_http_req_rate(0) gt 200 }  
    timeout tarpit 10s
```

Esta configuración aplica la política al backend específico y establece el retraso a 10 segundos.

Guarda y sal de `haproxy.cfg`, verifica tu configuración y reinicia el servicio.

```
> haproxy -c -V -f /etc/haproxy/haproxy.cfg  
El archivo de configuración es válido

> sudo service haproxy restart
> sudo service haproxy status  
Activo: activo (ejecutándose)
```

---

Estas **Guías Técnicas para Desarrolladores de WAX** se crean utilizando material fuente de la [Serie de Cómo Hacer Técnico de WAX de EOSphere](https://medium.com/eosphere/wax-technical-how-to/home)

Asegúrate de hacer cualquier pregunta en el [Telegram de EOSphere](https://t.me/eosphere_io)