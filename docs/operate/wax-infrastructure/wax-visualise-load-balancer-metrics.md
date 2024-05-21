---
title: How to Visualise Metrics from a WAX Load Balancer
---

Providing Public WAX API services will mean your infrastructure will receive an enormous amount of global requests. Getting visibility on where, what and how many requests your infrastructure front end is receiving can be invaluable.

Thankfully there are powerful and free to use solutions that can simply be implemented to provide a window into what is going on.

This guide will show you how to use an existing HAProxy deployment to export metrics using Filebeat to an Elasticsearch Cluster where the data can be visualised. Creating amazing and useful dashboards like our EOSphere WAX HAProxy Dashboard below:

![image](https://github.com/Rossco99/wax-developer/assets/12730423/90e76d13-a955-422d-9012-db973e967984)

# How To Visualise Metrics from a WAX Load Balancer

HAProxy works quite well with Filebeat to collate metrics and export them to Elasticsearch, these metrics can then be visualised in Kibana and used for investigation or to create a dashboard for realtime monitoring.

This guide will go over the basics to get up and running using the Filebeat HAProxy Module. Custom exporting, analysis and visualisation can be configured to be very granular.

You can read more about  [Filebeat in the Elasticsearch Documentation](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-overview.html).

It is assumed that you are already using HAProxy in your environment, you can read more about how to deploy HAProxy in our  [Set Up a Reliable WAX Load Balancer Guide](https://developer.wax.io/operate/wax-infrastructure/wax-mainnet-node-load-balancer.html)

# Installation, Configuration and Running

In this example the goal is to:

-   Install Elasticsearch
-   Install Kibana
-   Connect Kibana to the Elasticsearch Cluster
-   Install Filebeat on the HAProxy Server
-   Configure Filebeat
-   Configure HAProxy
-   Run Filebeat
-   Kibana Discover
-   Kibana Visualize

## **Install Elasticsearch**

Currently we are still using Elasticsearch  `8.5.0`  with great results. Build the latest Elasticsearch  `8.x`  as below:

```
> sudo apt install apt-transport-https  
  
> sudo apt install gpg  
  
#Elasticsearch signing key#  
> wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -  
  
#Latest Elasticsearch 8.x repository#  
> echo "deb https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list  
  
> sudo apt update  
  
#Install Elasticsearch#  
> sudo apt install elasticsearch  
  
**Take note of the super-user password**  
  
#Reload Units  
> sudo systemctl daemon-reload  
  
#Start Elasticsearch  
> sudo systemctl start elasticsearch.service  
  
#Start Elasticsearch automatically on boot  
> sudo systemctl enable elasticsearch.service
```

## Install Kibana

The utilised Kibana version should be paired with the installed Elasticsearch version, the process below will install the current version:

```
> sudo apt-get install apt-transport-https  
> sudo apt install gpg  
  
#Elasticsearch signing key - Not needed if already added#  
> wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -  
  
#Latest Elasticsearch 8.x repository - Not needed if already added#  
> echo "deb https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-8.x.list  
> sudo apt update  
  
#Install Kibana#  
> sudo apt install kibana  
  
#On Kibana Server Allow Remote IP Access#  
> sudo nano /etc/kibana/kibana.yml  
server.host: "0.0.0.0"  
  
#Reload Units  
> sudo systemctl daemon-reload  
  
#Start Kibana  
> sudo systemctl start kibana  
  
#Start Kibana automatically on boot  
> sudo systemctl enable kibana.service  
```

## Connect Kibana to the Elasticsearch Cluster

Generate and copy an enrolment token on the Elasticsearch server to be used for Kibana:

```
> sudo /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s kibana
```

Connect to the Kibana Web User Interface using a browser and paste the access token:

```
http://<SERVER IP ADDRESS>:5601/
```
![image](https://github.com/Rossco99/wax-developer/assets/12730423/2fc7bf50-3aa8-42b4-8fbd-adfecb824935)

Enter Kibana Enrollment Token

Obtain the Kibana verification code from the Kibana server command line and enter in the Kibana GUI:

```
> sudo /usr/share/kibana/bin/kibana-verification-code  
Your verification code is:  XXX XXX
```

Kibana is now connected to Elasticsearch, you are able to log in with username “elastic” and the elastic “superuser” password.

## Install Filebeat on the HAProxy Server

```
> sudo apt install curl  

> curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-8.5.3-amd64.deb  

> sudo dpkg -i filebeat-8.5.3-amd64.deb
```

## Configure Filebeat on the HAProxy Server

Once you have the SHA256 fingerprint from the Elasticsearch server, configure the  `filebeat.yml`  on the HAProxy server to point to the Elasticsearch IP with relevant credentials.

```
#Get CA Fingerprint from Elasticsearch#  
> sudo openssl x509 -fingerprint -sha256 -in /etc/elasticsearch/certs/http_ca.crt  
  
SHA256 Fingerprint=E2:BA:EF:C1:47:60:D4:3C:C3:B9:D1:DE:11:87:B2:8F:4E:4C:77:65:02:83:10:D3:20:C7:9F:AF:8C:1A:DE:04  
  
> sudo nano /etc/filebeat/filebeat.yml  
  
output.elasticsearch:  
  # Array of hosts to connect to.  
  hosts: ["https://10.0.0.82:9200"]  
  
  # Protocol - either `http` (default) or `https`.  
  protocol: "https"  
  
  # Authentication credentials - either API key or username/password.  
  #api_key: "id:api_key"  
  username: "elastic"  
  password: "YOUR_ELASTIC_PASSWORD"  
  ssl:  
    enabled: true  
    ca_trusted_fingerprint: "E2BAEFC14760D43CC3B9D1DE1187B28F4E4C7765028310D320C79FAF8C1ADE04"  
  
  bulk_max_size: 15000  
  worker: 2  
  
setup.template.settings:  
  index.number_of_shards: 0
```

## Configure HAProxy Server

Configure your  `haproxy.cfg`  as below for basic logging:

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

## Run Filebeat

Firstly install the Filebeat HAProxy Module on the HAProxy Server and then ensure it is set to pull from the correct  `haproxy.log`  file, finally load the recommend index template and start Filebeat.

```
#View all available Filebeat modules#  
> filebeat modules list  
  
#Enable the HAProxy Module  
> filebeat modules enable haproxy  
  
#Configure the log file settings  
> sudo nano /etc/filebeat/modules.d/haproxy.yml  
  
# Module: haproxy  
# Docs: https://www.elastic.co/guide/en/beats/filebeat/8.3/filebeat-module-haproxy.html  
  
- module: haproxy  
  # All logs  
  log:  
    enabled: true  
  
    # Set which input to use between syslog (default) or file.  
    var.input: "file"  
  
    # Set custom paths for the log files. If left empty,  
    # Filebeat will choose the paths depending on your OS.  
    var.paths: ["/var/log/haproxy.log"]  
  
#Loads the recommended index template for writing to Elasticsearch and deploy the sample dashboards for visualizing the data in Kibana  
> filebeat setup -e  
  
#Start Filebeat automatically on boot  
> sudo systemctl enable filebeat  
  
#Start Filebeat  
> sudo systemctl start filebeat
```

## Kibana Discover

Now that Filebeat is running, Kibana can be checked to ensure data is being indexed by Elasticsearch.

Log into Kibana and click on the [Three Horizontal Bars] on the top left -> [Analytics] -> [Discover]

![image](https://github.com/Rossco99/wax-developer/assets/12730423/cee33d07-4d72-4853-b57f-18f1b1adcdc9)

The Kibana Discover Tool will give you a view on all fields that have been indexed, these fields can then be used to create your own custom visualisations which can then be added to a dashboard.

Clicking on a document an clicking expand will give you an idea of what is available.

![image](https://github.com/Rossco99/wax-developer/assets/12730423/a0696e32-443b-4b4e-bd76-61172882267b)

Populated fields mean the Filebeat exporter is working as expected.

## Kibana Visualise

The Kibana Visualize Tool takes the metric data and displays them in a graph/picture/table etc. format that makes it easier for us humans to ingest.

The Kibana Visualize Tool can be access directly from click on a field in the Discover Tool,

![image](https://github.com/Rossco99/wax-developer/assets/12730423/1e7225b8-83bc-451f-848f-bbbef882ccfe)

or from [Analytics] -> [Visualize Library]

![image](https://github.com/Rossco99/wax-developer/assets/12730423/37f51abb-131b-4148-b13c-1948a939f135)

The Filebeat HAProxy Module would have provided a few default visualisations to help get you started. Just search for “filebeat haproxy”

It’s best to click around and have a play with the various Visualization Types (Bar / Gauge / Line / Map / Proportion etc.) to get a feel for how you would like to present your captured metrics.

Below is an example of presenting HAProxy frontend http response codes in line graph over the last 15mins. The  `http.response.status_code`  field was used.

![image](https://github.com/Rossco99/wax-developer/assets/12730423/6c6613ef-ed8a-4f97-bdfd-afb30bec684c)

These visualisations can then be saved and imported into a Dashboard for a clear and simple single pane view of all visualisations.

![image](https://github.com/Rossco99/wax-developer/assets/12730423/3fc0799b-112b-4614-9a6c-89b70d1e6ba2)

![image](https://github.com/Rossco99/wax-developer/assets/12730423/1f72a310-6b6b-4e19-8820-c306303a7cb7)

Kibana and Elasticsearch really are a sandbox for all your visualisation needs. Starting with a clear idea of what data you would like to see will really help you as you familiarise yourself with Kibana.

[This is a great video](https://youtu.be/e1299MWyr98)  from Elasticsearch on helping you get started, it certainly helped me understand Kibana a bit better.

---

These **WAX Developer Technical Guides** are created using source material from the [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home)

Be sure to ask any questions in the  [EOSphere Telegram](https://t.me/eosphere_io)
