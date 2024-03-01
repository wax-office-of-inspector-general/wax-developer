---
title: Agrupamiento de Elasticsearch para Hyperion Full History de WAX
---

Ejecutar Hyperion Full History en WAX Mainnet es muy intensivo en recursos, especialmente en términos de DISK y CPU, cuyos requisitos están en constante aumento.

Afortunadamente, Elasticsearch puede escalarse fácilmente mediante el agrupamiento (clustering) en múltiples nodos para expandir el almacenamiento disponible en DISK y equilibrar la utilización de CPU.

Este siguiente subartículo de la serie guiará a través de la configuración y habilitación del Clustering de Elasticsearch en un despliegue de Hyperion Full History de WAX.

EOS RIO tiene un excelente [Repositorio de Documentación de Hyperion](https://hyperion.docs.eosrio.io/) que incluye detalles sobre cómo configurar su producto Hyperion Full History, sin embargo, este artículo se expande en su documentación específicamente en relación a Elasticsearch 8.x

Una vez más, esta serie de Cómo Hacerlo Técnico puede cubrir algunos de los mismos contenidos de EOS RIO y agregará matices operacionales desde un punto de vista práctico y nuestra experiencia.

[Aprende más sobre EOS RIO Hyperion](https://eosrio.io/hyperion/)

![EOS RIO Hyperion](https://miro.medium.com/v2/resize:fit:598/0*SMEjl3XTe2BtL1W3.png)

_Este artículo ha sido actualizado para reflejar el despliegue actual de Hyperion en septiembre de 2023._

## Agrupamiento de Elasticsearch para Hyperion Full History de WAX

Como se discutió en la Introducción a Hyperion Full History de WAX, aparte de mitigar el desafío del tamaño del montón JVM OOP, los beneficios de agrupar más de un nodo Elasticsearch son más núcleos de CPU para el procesamiento y más DISK para los requisitos de almacenamiento de la Historia Completa de WAX en constante expansión.

Elasticsearch almacena datos indexados en documentos, estos documentos se asignan a shards, estos shards se equilibran automáticamente entre los nodos en un clúster. Aparte de distribuir la utilización de DISK a través de los nodos, cada shard es su propio índice Lucene y, como tal, distribuye la utilización del ancho de banda de CPU a través del clúster también.

En esta guía, se configurará un clúster de tres nodos Elasticsearch 8.x, sigue la guía **Construir los Componentes de Software de Hyperion de WAX** para instrucciones sobre cómo construir Elasticsearch 8.x y la guía **Configurar los Componentes de Software de Hyperion de WAX** para instrucciones sobre cómo aplicar la configuración independiente para Elasticsearch 8.x. Esta guía cubrirá el lado de la configuración de agrupamiento de Elasticsearch.

En el agrupamiento de Elasticsearch para Hyperion Full History de WAX, no hay cambios en ninguna de las configuraciones o componentes de software discutidos previamente, aparte de Elasticsearch.

## Configuración del Clúster

El Nodo-1 se configurará como un único maestro elegible para este ejemplo. Este nodo se utilizará para generar tokens de inscripción para que otros nodos se unan al clúster.

_Configura el Nodo-1 como se indica a continuación:_

**Nodo-1 (Maestro) | 10.0.0.1**

```
> sudo nano /etc/elasticsearch/elasticsearch.yml

cluster.name: wax-hyperion-cluster
node.name: wax-es-node-1
node.roles: [ data, ingest, remote_cluster_client, master ]
network.host: 10.0.0.1 
discovery.seed_hosts: ["10.0.0.1:9300", "10.0.0.2:9300", "10.0.0.3:9300"]
cluster.initial_master_nodes: ["10.0.0.1"]
transport.host: 0.0.0.0

> sudo systemctl restart elasticsearch.service
```

_Genera un nuevo token de inscripción en **Nodo-1** para que nuevos nodos se unan al clúster:_

```
> sudo /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s node

eyJ2ZXIiOiI4LjIuMCIsImFkciI6WyIxMC4wLjAuODY6OTIwMCJdLCJmZ3IiOiI0MjUzMWY5MmYwZjBlOGI0MDRhOWEzZWEwMDFiMzJkOWYwYj

IxZjI3YjNlODI1MGVmZmQwNzg0N2RhM2RlNjEwIiwia2V5IjoicFRtNXY0TUJWSXFRRUFCLW1YR0o6TFNsMUk5dHdTX0syLUhwMUdMbjFfUSJ9
```

En ambos **Nodo-2** y **Nodo-3** con el Servicio de Elasticsearch detenido instala el token de inscripción:

**Nota:** Es importante que el `elasticsearch.yml` en nodos adicionales se deje sin configurar hasta después de la inscripción.
Además, si has deshabilitado `xpack.security.http` en el nodo maestro, necesitarás habilitarlo temporalmente para la inscripción.

```
> sudo /usr/share/elasticsearch/bin/elasticsearch-reconfigure-node --enrollment-token <TOKEN GENERADO DESDE NODO-1>

This node will be reconfigured to join an existing cluster, using the enrollment token that you provided.
This operation will overwrite the existing configuration. Specifically: 
  - Security auto configuration will be removed from elasticsearch.yml
  - The [certs] config directory will be removed
  - Security auto configuration related secure settings will be removed from the elasticsearch.keystore
Do you want to continue with the reconfiguration process [y/N]y
```

La configuración de seguridad de xpack de Elasticsearch debería generarse y configurarse automáticamente en todos los archivos `elasticsearch.yml`.

Luego configura el Nodo-2 y Nodo-3 como se indica a continuación:

**Nodo-2 | 10.0.0.2**

```
> sudo nano /etc/elasticsearch/elasticsearch.yml

cluster.name: wax-hyperion-cluster
node.name: wax-es-node-2
node.roles: [ data, ingest, remote_cluster_client ]
network.host: 10.0.0.2
cluster.initial_master_nodes: ["10.0.0.1"]
discovery.seed_hosts: ["10.0.0.1:9300", "10.0.0.2:9300", "10.0.0.3:9300"]
transport.host: 0.0.0.0

> sudo systemctl restart elasticsearch.service
```

**Nodo-3 | 10.0.0.3**

```
> sudo nano /etc/elasticsearch/elasticsearch.yml

cluster.name: wax-hyperion-cluster
node.name: wax-es-node-3
node.roles: [ data, ingest, remote_cluster_client ]
network.host: 10.0.0.3
cluster.initial_master_nodes: ["10.0.0.1"]
discovery.seed_hosts: ["10.0.0.1:9300", "10.0.0.2:9300", "10.0.0.3:9300"]
transport.host: 0.0.0.0

> sudo systemctl restart elasticsearch.service
```

El clúster de Elasticsearch ahora se formará, si el Nodo-1 tenía datos existentes, los shards se equilibrarán automáticamente a través del clúster sin ninguna réplica.

## Operación

Ha sido nuestra experiencia que Hyperion funciona bien teniendo el Nodo Maestro configurado como el recurso de Elasticsearch en `connections.json`.

Puedes verificar la operación del clúster desde la GUI de Kibana en Administración -> Monitorización de la Pila

![Ejemplo de Clúster de EOSphere WAX Mainnet](https://miro.medium.com/v2/resize:fit:700/1*MWeuTdnREi7ubwbsPHKvWg.png)

Depura la formación del clúster si es necesario:

```
> sudo tail /var/log/elasticsearch/wax-hyperion-cluster.log -f
```

Consultas para verificar la operación del clúster:

```
> curl --user elastic:<CONTRASEÑA> -XGET 'http://10.0.0.1:9200/_cluster/stats?pretty' | more

> curl --user elastic:<CONTRASEÑA> -XGET 'http://10.0.0.1:9200/_cluster/health?pretty' | more

> curl --user elastic:<CONTRASEÑA> -XGET 'http://10.0.0.1:9200/_cluster/state?pretty' | more
```
Asegúrate de hacer cualquier pregunta en el [Telegram de EOSphere](https://t.me/eosphere_io)

---

Estas **Guías Técnicas para Desarrolladores de WAX** se crean utilizando material fuente de la [Serie de Cómo Hacerlo T

écnico de WAX de EOSphere](https://medium.com/eosphere/wax-technical-how-to/home)

Asegúrate de hacer cualquier pregunta en el [Telegram de EOSphere](https://t.me/eosphere_io)