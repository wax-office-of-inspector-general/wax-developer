---
title: Cómo visualizar métricas de balanceador de carga
---

Proporcionar servicios API públicos de WAX significa que tu infraestructura recibirá una enorme cantidad de solicitudes globales. Obtener visibilidad sobre dónde, qué y cuántas solicitudes está recibiendo el front end de tu infraestructura puede ser invaluable.

Afortunadamente, existen soluciones poderosas y gratuitas que pueden implementarse fácilmente para proporcionar una ventana a lo que está sucediendo.

Esta guía te mostrará cómo utilizar una implementación existente de HAProxy para exportar métricas usando Filebeat a un clúster de Elasticsearch, donde los datos pueden visualizarse. Creando paneles asombrosos y útiles como nuestro panel de HAProxy WAX de EOSphere a continuación:

![image](https://github.com/Rossco99/wax-developer/assets/12730423/90e76d13-a955-422d-9012-db973e967984)

# Cómo visualizar métricas desde un balanceador de carga WAX

HAProxy funciona bastante bien con Filebeat para recopilar métricas y exportarlas a Elasticsearch, estas métricas pueden luego visualizarse en Kibana y usarse para investigación o para crear un panel de monitoreo en tiempo real.

Esta guía repasará los conceptos básicos para comenzar a utilizar el módulo HAProxy de Filebeat. La exportación personalizada, el análisis y la visualización pueden configurarse de manera muy detallada.

Puedes leer más sobre [Filebeat en la documentación de Elasticsearch](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-overview.html).

Se asume que ya estás usando HAProxy en tu entorno, puedes leer más sobre cómo desplegar HAProxy en nuestra [Guía para configurar un balanceador de carga confiable en WAX](https://developer.wax.io/operate/wax-infrastructure/wax-mainnet-node-load-balancer.html).

# Instalación, configuración y ejecución

En este ejemplo, el objetivo es:

-   Instalar Elasticsearch
-   Instalar Kibana
-   Conectar Kibana al clúster de Elasticsearch
-   Instalar Filebeat en el servidor HAProxy
-   Configurar Filebeat
-   Configurar HAProxy
-   Ejecutar Filebeat
-   Descubrir Kibana
-   Visualizar en Kibana

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
**Toma nota de la contraseña del superusuario**  
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
# Clave de firma de Elasticsearch - No es necesario si ya se añadió #
> wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -  
# Repositorio más reciente de Elasticsearch 8.x - No es necesario si ya se añadió #
> echo "deb https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-8.x.list  
> sudo apt update  
# Instalar Kibana #
> sudo apt install kibana  
# Permitir acceso remoto a IP en el servidor de Kibana #
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

Genera y copia un token de inscripción en el servidor de Elasticsearch para usarlo en Kibana:

```
> sudo /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s kibana
```

Conéctate a la interfaz de usuario web de Kibana usando un navegador y pega el token de acceso:

```
http://<DIRECCIÓN IP DEL SERVIDOR>:5601/
```
![image](https://github.com/Rossco99/wax-developer/assets/12730423/2fc7bf50-3aa8-42b4-8fbd-adfecb824935)

Introduce el token de inscripción de Kibana.

Obtén el código de verificación de Kibana desde la línea de comandos del servidor de Kibana e introdúcelo en la GUI de Kibana:

```
> sudo /usr/share/kibana/bin/kibana-verification-code  
Tu código de verificación es: XXX XXX
```

Kibana ahora está conectado a Elasticsearch, puedes iniciar sesión con el nombre de usuario "elastic" y la contraseña del "superusuario" elastic.

## Instalar Filebeat en el servidor HAProxy

```
> sudo apt install curl  
> curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-8.5.3-amd64.deb  
> sudo dpkg -i filebeat-8.5.3-amd64.deb
```

## Configurar Filebeat en el servidor HAProxy

Una vez que tengas la huella digital SHA256 del servidor de Elasticsearch, configura el `filebeat.yml` en el servidor HAProxy para que apunte a la IP de Elasticsearch con las credenciales correspondientes.

```
# Obtener la huella digital del CA desde Elasticsearch #
> sudo openssl x509 -fingerprint -sha256 -in /etc/elasticsearch/certs/http_ca.crt  
SHA256 Fingerprint=E2:BA:EF:C1:47:60:D4:3C:C3:B9:D1:DE:11:87:B2:8F:4E:4C:77:65:02:83:10:D3:20:C7:9F:AF:8C:1A:DE:04  
> sudo nano /etc/filebeat/filebeat.yml  

output.elasticsearch:  
  # Array de hosts a los que conectarse.
  hosts: ["https://10.0.0.82:9200"]  
  # Protocolo - ya sea `http` (por defecto) o `https`.  
  protocol: "https"  
  # Credenciales de autenticación - ya sea clave API o nombre de usuario/contraseña.  
  # api_key: "id:api_key"  
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

Configura tu `haproxy.cfg` como se indica a continuación para el registro básico:

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

Primero, instala el módulo HAProxy de Filebeat en el servidor HAProxy y luego asegúrate de que esté configurado para extraer del archivo `haproxy.log` correcto, finalmente, carga la plantilla de índice recomendada y ejecuta Filebeat.

```
# Ver todos los módulos disponibles de Filebeat #
> filebeat modules list  
# Habilitar el módulo HAProxy #
> filebeat modules enable haproxy  
# Configurar los ajustes del archivo de registro #
> sudo nano /etc/filebeat/modules.d/haproxy.yml  
# Módulo: haproxy
# Documentación: https://www.elastic.co/guide/en/beats/filebeat/8.3/filebeat-module-haproxy.html  
- module: haproxy  
  # Todos los registros
  log:  
    enabled: true  
    # Establecer qué entrada usar entre syslog (por defecto) o archivo.  
    var.input: "file"  
    # Establecer rutas personalizadas para los archivos de registro. Si se deja vacío,  
    # Filebeat elegirá las rutas dependiendo de tu sistema operativo.  
    var.paths: ["/var/log/haproxy.log"]  
# Cargar la plantilla de índice recomendada para escribir en Elasticsearch y desplegar los paneles de muestra para visualizar los datos en Kibana #
> filebeat setup -e  
# In

iciar Filebeat automáticamente al arrancar #
> sudo systemctl enable filebeat  
# Iniciar Filebeat #
> sudo systemctl start filebeat
```

## Descubrir Kibana

Ahora que Filebeat está en funcionamiento, se puede verificar Kibana para asegurarse de que los datos están siendo indexados por Elasticsearch.

Inicia sesión en Kibana y haz clic en las [Tres barras horizontales] en la parte superior izquierda -> [Analytics] -> [Discover]

![image](https://github.com/Rossco99/wax-developer/assets/12730423/cee33d07-4d72-4853-b57f-18f1b1adcdc9)

La herramienta Discover de Kibana te dará una vista de todos los campos que se han indexado, estos campos pueden luego usarse para crear tus propias visualizaciones personalizadas que luego pueden añadirse a un panel.

Al hacer clic en un documento y expandirlo, tendrás una idea de lo que está disponible.

![image](https://github.com/Rossco99/wax-developer/assets/12730423/a0696e32-443b-4b4e-bd76-61172882267b)

Los campos poblados significan que el exportador Filebeat está funcionando como se espera.

## Visualizar en Kibana

La herramienta Visualize de Kibana toma los datos de métricas y los muestra en un formato de gráfico/imagen/tabla, etc., que facilita su comprensión.

La herramienta Visualize de Kibana puede accederse directamente haciendo clic en un campo en la herramienta Discover,

![image](https://github.com/Rossco99/wax-developer/assets/12730423/1e7225b8-83bc-451f-848f-bbbef882ccfe)

o desde [Analytics] -> [Visualize Library]

![image](https://github.com/Rossco99/wax-developer/assets/12730423/37f51abb-131b-4148-b13c-1948a939f135)

El módulo HAProxy de Filebeat habría proporcionado algunas visualizaciones predeterminadas para ayudarte a comenzar. Solo busca "filebeat haproxy".

Lo mejor es hacer clic y jugar con los diversos tipos de visualización (Barra / Medidor / Línea / Mapa / Proporción, etc.) para tener una idea de cómo te gustaría presentar tus métricas capturadas.

A continuación, se muestra un ejemplo de presentación de los códigos de respuesta http del frontend de HAProxy en un gráfico de líneas durante los últimos 15 minutos. Se utilizó el campo `http.response.status_code`.

![image](https://github.com/Rossco99/wax-developer/assets/12730423/6c6613ef-ed8a-4f97-bdfd-afb30bec684c)

Estas visualizaciones luego pueden guardarse e importarse a un panel para una vista clara y sencilla de todas las visualizaciones.

![image](https://github.com/Rossco99/wax-developer/assets/12730423/3fc0799b-112b-4614-9a6c-89b70d1e6ba2)

![image](https://github.com/Rossco99/wax-developer/assets/12730423/1f72a310-6b6b-4e19-8820-c306303a7cb7)

Kibana y Elasticsearch realmente son un sandbox para todas tus necesidades de visualización. Comenzar con una idea clara de los datos que te gustaría ver te ayudará mucho mientras te familiarizas con Kibana.

[Este es un excelente video](https://youtu.be/e1299MWyr98) de Elasticsearch que te ayudará a comenzar, ciertamente me ayudó a entender mejor Kibana.

---

Estas **Guías técnicas para desarrolladores de WAX** se crean utilizando material de origen de la [Serie técnica de cómo hacerlo de EOSphere WAX](https://medium.com/eosphere/wax-technical-how-to/home).

Asegúrate de hacer cualquier pregunta en el [Telegram de EOSphere](https://t.me/eosphere_io).