---
title: Cómo visualizar métricas de un balanceador de carga WAX
---

Proveer servicios públicos de API WAX significa que tu infraestructura recibirá una enorme cantidad de solicitudes globales. Obtener visibilidad sobre dónde, qué y cuántas solicitudes está recibiendo tu infraestructura puede ser invaluable.

Afortunadamente, existen soluciones poderosas y gratuitas que se pueden implementar fácilmente para proporcionar una ventana a lo que está sucediendo.

Esta guía te mostrará cómo usar una implementación existente de HAProxy para exportar métricas utilizando Filebeat a un clúster de Elasticsearch, donde los datos se pueden visualizar. Creando paneles increíbles y útiles como nuestro Panel de HAProxy de EOSphere WAX a continuación:

![image](https://github.com/Rossco99/wax-developer/assets/12730423/90e76d13-a955-422d-9012-db973e967984)

# Cómo visualizar métricas de un balanceador de carga WAX

HAProxy funciona muy bien con Filebeat para recopilar métricas y exportarlas a Elasticsearch, estas métricas luego se pueden visualizar en Kibana y usar para la investigación o para crear un panel de monitoreo en tiempo real.

Esta guía repasará los conceptos básicos para comenzar a usar el módulo HAProxy de Filebeat. La exportación, el análisis y la visualización personalizados se pueden configurar de manera muy granular.

Puedes leer más sobre [Filebeat en la Documentación de Elasticsearch](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-overview.html).

Se asume que ya estás usando HAProxy en tu entorno, puedes leer más sobre cómo desplegar HAProxy en nuestra [Guía de configuración de un balanceador de carga WAX confiable](https://developer.wax.io/operate/wax-infrastructure/wax-mainnet-node-load-balancer.html)

# Instalación, configuración y ejecución

En este ejemplo, el objetivo es:

- Instalar Elasticsearch
- Instalar Kibana
- Conectar Kibana al clúster de Elasticsearch
- Instalar Filebeat en el servidor HAProxy
- Configurar Filebeat
- Configurar HAProxy
- Ejecutar Filebeat
- Descubrir en Kibana
- Visualizar en Kibana

## **Instalar Elasticsearch**

Actualmente seguimos usando Elasticsearch `8.5.0` con excelentes resultados. Construye la última versión de Elasticsearch `8.x` como se indica a continuación:

```
> sudo apt install apt-transport-https  
> sudo apt install gpg  

# Clave de firma de Elasticsearch #
> wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -  

# Repositorio más reciente de Elasticsearch 8.x #
> echo "deb https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list  

> sudo apt update  

# Instalar Elasticsearch #
> sudo apt install elasticsearch  

**Toma nota de la contraseña de superusuario**

# Recargar unidades #
> sudo systemctl daemon-reload  

# Iniciar Elasticsearch #
> sudo systemctl start elasticsearch.service  

# Iniciar Elasticsearch automáticamente al arrancar #
> sudo systemctl enable elasticsearch.service
```

## Instalar Kibana

La versión de Kibana utilizada debe emparejarse con la versión instalada de Elasticsearch, el siguiente proceso instalará la versión actual:

```
> sudo apt-get install apt-transport-https  
> sudo apt install gpg  

# Clave de firma de Elasticsearch - No es necesario si ya se agregó #
> wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -  

# Repositorio más reciente de Elasticsearch 8.x - No es necesario si ya se agregó #
> echo "deb https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-8.x.list  
> sudo apt update  

# Instalar Kibana #
> sudo apt install kibana  

# En el servidor de Kibana, permitir acceso remoto #
> sudo nano /etc/kibana/kibana.yml  
server.host: "0.0.0.0"  

# Recargar unidades #
> sudo systemctl daemon-reload  

# Iniciar Kibana #
> sudo systemctl start kibana  

# Iniciar Kibana automáticamente al arrancar #
> sudo systemctl enable kibana.service  
```

## Conectar Kibana al clúster de Elasticsearch

Genera y copia un token de inscripción en el servidor de Elasticsearch para ser usado en Kibana:

```
> sudo /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s kibana
```

Conéctate a la interfaz de usuario web de Kibana utilizando un navegador y pega el token de acceso:

```
http://<DIRECCIÓN IP DEL SERVIDOR>:5601/
```
![image](https://github.com/Rossco99/wax-developer/assets/12730423/2fc7bf50-3aa8-42b4-8fbd-adfecb824935)

Introduce el token de inscripción de Kibana

Obtén el código de verificación de Kibana desde la línea de comandos del servidor de Kibana y introdúcelo en la GUI de Kibana:

```
> sudo /usr/share/kibana/bin/kibana-verification-code  
Tu código de verificación es:  XXX XXX
```

Kibana ahora está conectado a Elasticsearch, puedes iniciar sesión con el nombre de usuario “elastic” y la contraseña de “superusuario” de elastic.

## Instalar Filebeat en el servidor HAProxy

```
> sudo apt install curl  

> curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-8.5.3-amd64.deb  

> sudo dpkg -i filebeat-8.5.3-amd64.deb
```

## Configurar Filebeat en el servidor HAProxy

Una vez que tengas la huella digital SHA256 del servidor Elasticsearch, configura el `filebeat.yml` en el servidor HAProxy para que apunte a la IP de Elasticsearch con las credenciales relevantes.

```
# Obtener huella digital de CA de Elasticsearch #
> sudo openssl x509 -fingerprint -sha256 -in /etc/elasticsearch/certs/http_ca.crt  

SHA256 Huella Digital=E2:BA:EF:C1:47:60:D4:3C:C3:B9:D1:DE:11:87:B2:8F:4E:4C:77:65:02:83:10:D3:20:C7:9F:AF:8C:1A:DE:04  

> sudo nano /etc/filebeat/filebeat.yml  

output.elasticsearch:  
  # Array de hosts a los que conectarse.  
  hosts: ["https://10.0.0.82:9200"]  

  # Protocolo - ya sea `http` (predeterminado) o `https`.  
  protocol: "https"  

  # Credenciales de autenticación - ya sea clave API o nombre de usuario/contraseña.  
  #api_key: "id:api_key"  
  username: "elastic"  
  password: "TU_CONTRASEÑA_ELASTIC"  
  ssl:  
    enabled: true  
    ca_trusted_fingerprint: "E2BAEFC14760D43CC3B9D1DE1187B28F4E4C7765028310D320C79FAF8C1ADE04"  

  bulk_max_size: 15000  
  worker: 2  

setup.template.settings:  
  index.number_of_shards: 0
```

## Configurar el servidor HAProxy

Configura tu `haproxy.cfg` como se indica a continuación para un registro básico:

```
> sudo nano /etc/haproxy/haproxy.cfg  

global  
        log /dev/log    local0 info  
        log /dev/log    local1 notice  

frontend http-in  
    capture request header Referer len 128  
    capture response header Content-length len 9  
    capture response header Location len 15  

> sudo service haproxy restart
```

## Ejecutar Filebeat

Primero, instala el módulo HAProxy de Filebeat en el servidor HAProxy y luego asegúrate de que esté configurado para extraer del archivo `haproxy.log` correcto, finalmente carga la plantilla de índice recomendada y empieza Filebeat.

```
# Ver todos los módulos disponibles de Filebeat #
> filebeat modules list  

# Habilitar el módulo HAProxy #
> filebeat modules enable haproxy  

# Configurar los ajustes del archivo de registro #
> sudo nano /etc/filebeat/modules.d/haproxy.yml  

# Módulo: haproxy  
# Documentos: https://www.elastic.co/guide/en/beats/filebeat/8.3/filebeat-module-haproxy.html  

- module: haproxy  
  # Todos los registros  
  log:  
    enabled: true  

    # Establece qué entrada usar entre syslog (predeterminado) o archivo.  
    var.input: "file"  

    # Establece rutas personalizadas para los archivos de registro. Si se deja vacío,  
    # Filebeat elegirá las rutas dependiendo de tu SO.  
    var.paths: ["/var/log/haproxy.log"]  

# Cargar la plantilla de índice recomendada para escribir en Elasticsearch y desplegar los paneles de muestra para visualizar los datos en Kibana #
> filebeat setup -e  

# Iniciar Filebeat automáticamente al arrancar #
> sudo systemctl enable filebeat  

# In

iciar Filebeat #
> sudo systemctl start filebeat
```

## Kibana Discover

Ahora que Filebeat está funcionando, se puede verificar Kibana para asegurar que los datos están siendo indexados por Elasticsearch.

Inicia sesión en Kibana y haz clic en las [Tres Barras Horizontales] en la parte superior izquierda -> [Analytics] -> [Discover]

![image](https://github.com/Rossco99/wax-developer/assets/12730423/cee33d07-4d72-4853-b57f-18f1b1adcdc9)

La herramienta Discover de Kibana te dará una vista de todos los campos que se han indexado, estos campos luego se pueden usar para crear tus propias visualizaciones personalizadas que luego se pueden agregar a un panel.

Hacer clic en un documento y expandir te dará una idea de lo que está disponible.

![image](https://github.com/Rossco99/wax-developer/assets/12730423/a0696e32-443b-4b4e-bd76-61172882267b)

Los campos poblados significan que el exportador de Filebeat está funcionando como se esperaba.

## Kibana Visualize

La herramienta Visualize de Kibana toma los datos métricos y los muestra en un formato de gráfico/imagen/tabla, etc., que facilita su comprensión.

La herramienta Visualize de Kibana se puede acceder directamente desde un campo en la herramienta Discover,

![image](https://github.com/Rossco99/wax-developer/assets/12730423/1e7225b8-83bc-451f-848f-bbbef882ccfe)

o desde [Analytics] -> [Visualize Library]

![image](https://github.com/Rossco99/wax-developer/assets/12730423/37f51abb-131b-4148-b13c-1948a939f135)

El módulo HAProxy de Filebeat habría proporcionado algunas visualizaciones predeterminadas para ayudarte a comenzar. Simplemente busca "filebeat haproxy".

Lo mejor es hacer clic y jugar con los diversos tipos de visualización (Barra / Medidor / Línea / Mapa / Proporción, etc.) para tener una idea de cómo te gustaría presentar tus métricas capturadas.

A continuación se muestra un ejemplo de presentación de códigos de respuesta http del frontend de HAProxy en un gráfico de líneas durante los últimos 15 minutos. Se utilizó el campo `http.response.status_code`.

![image](https://github.com/Rossco99/wax-developer/assets/12730423/6c6613ef-ed8a-4f97-bdfd-afb30bec684c)

Estas visualizaciones luego se pueden guardar e importar a un panel para una vista clara y simple de todas las visualizaciones.

![image](https://github.com/Rossco99/wax-developer/assets/12730423/3fc0799b-112b-4614-9a6c-89b70d1e6ba2)

![image](https://github.com/Rossco99/wax-developer/assets/12730423/1f72a310-6b6b-4e19-8820-c306303a7cb7)

Kibana y Elasticsearch realmente son un sandbox para todas tus necesidades de visualización. Comenzar con una idea clara de qué datos te gustaría ver te ayudará realmente a familiarizarte con Kibana.

[Este es un excelente video](https://youtu.be/e1299MWyr98) de Elasticsearch que te ayudará a comenzar, ciertamente me ayudó a entender mejor Kibana.

---

Estas **Guías técnicas para desarrolladores de WAX** se crean utilizando material fuente de la [Serie técnica cómo hacer de EOSphere WAX](https://medium.com/eosphere/wax-technical-how-to/home)

Asegúrate de hacer cualquier pregunta en el [Telegram de EOSphere](https://t.me/eosphere_io)