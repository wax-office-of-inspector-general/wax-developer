---
title: Introducción a WAX Hyperion Full History
---

# Introducción a WAX Hyperion Full History

Parte de la utilidad de una blockchain de alto rendimiento es la capacidad de consultar transacciones históricas de la red. Aunque por su propia naturaleza todas las blockchains tienen cada transacción grabada en la cadena, este registro típicamente no es fácilmente buscable o consultable.

El software de WAX no es diferente en este aspecto y originalmente tenía una provisión para un historial consultable llamado history_plugin o Historia V1. El plugin de historia fue de hecho desaprobado en 2018, lo que impulsó a la comunidad a construir alternativas.

Las alternativas de Historia Completa más populares siendo Dfuse de EOS Canada, ahora llamado [Streaming Fast](https://www.streamingfast.io/), y [Hyperion](https://github.com/eosrio/hyperion-history-api) de [EOS RIO](https://eosrio.io/). Una nueva opción para una solución de Historia Ligera también ha sido lanzada recientemente por cc32d9 llamada [Memento](https://github.com/cc32d9/eosio_memento) que ciertamente parece interesante.

EOSphere tiene una extensa experiencia en producción con la provisión de servicios de Historia Completa usando Hyperion en WAX Mainnet y Testnet así como en otras redes. Esta guía compartirá esta experiencia contigo, dividida en una serie que comienza con una introducción a los componentes de software y los requisitos de hardware de una solución de WAX Hyperion Full History lista para producción.

[Aprende más sobre EOS RIO Hyperion](https://eosrio.io/hyperion/)

![](https://miro.medium.com/v2/resize:fit:598/1*ATnQKunF5rVtPEsL-sP0JA.png)

_Este artículo ha sido actualizado para reflejar la implementación actual de Hyperion en diciembre de 2024._

# Introducción a WAX Hyperion Full History

_"Hyperion es una solución completa de historial para indexar, almacenar y recuperar datos históricos de la blockchain de Antelope."_

Hyperion fue construido por EOS RIO para ser una solución de Historia de Antelope de grado empresarial, de alto rendimiento y altamente escalable. Su [documentación](https://hyperion.docs.eosrio.io/) es excelente y ciertamente un buen punto de partida, esta serie Cómo Hacerlo Técnico cubrirá parte de su mismo contenido y añadirá matices operativos desde un punto de vista práctico y nuestra experiencia.

## Componentes de Software de Hyperion

El servicio de Historia Completa de Hyperion es una colección de software construido por EOS RIO y aplicaciones estándar de la industria. Los ocho bloques de construcción principales son los siguientes:

**Indexador y API de EOS RIO Hyperion**\
El **Indexador** procesa datos obtenidos del nodo State-History (SHIP) de WAX Software y permite que sean indexados en Elasticsearch. El Indexador Hyperion también hace uso de la funcionalidad de conversión de Binario a JSON de Antelope usando ABI llamada [abieos](https://github.com/EOSIO/abieos). El rendimiento de deserialización mejora significativamente al usar el código C++ de abieos a través del propio paquete NPM de EOS RIO [**node-abieos**](https://github.com/eosrio/node-abieos) que proporciona un enlace nativo para Node.js.

La **API** es el frente para consultas de clientes, responde a solicitudes V2 o V1 legadas y encuentra datos para estas respuestas consultando directamente el clúster de Elasticsearch.

**Nodo State-History (SHIP) de WAX Software**\
El plugin State-History es utilizado por nodeos para capturar datos históricos sobre el estado de la blockchain (WAX Mainnet y Testnet en este caso) y almacenar estos datos en un formato de archivo plano legible externamente. Este archivo legible es accedido por el Indexador Hyperion. Ver [WAX Technical How To #7](https://medium.com/eosphere/wax-technical-how-to-7-9ccc102efd9d) para más detalles sobre los nodos State-History.

**RabbitMQ**\
[RabbitMQ](https://www.rabbitmq.com/) es un broker de mensajes de código abierto utilizado por Hyperion para encolar mensajes y transportar datos durante las múltiples etapas de indexación a Elasticsearch.

**Redis**\
[Redis](https://redis.io/) es un almacén de estructuras de datos

 en memoria y es utilizado por Hyperion como una caché de base de datos temporal predictiva para consultas de clientes de API HTTP y como una caché de transacciones del Indexador.

**Node.js**\
El indexador y la API de Hyperion son aplicaciones [Node.js](https://nodejs.org/en/) y, por supuesto, utilizan Node.js como un entorno de ejecución de JavaScript de back-end de código abierto.

**PM2**\
[PM2](https://pm2.keymetrics.io/) es un gestor de procesos para Node.js y se utiliza para lanzar y ejecutar el Indexador y la API de Hyperion.

**Clúster de Elasticsearch**\
[Elasticsearch](https://www.elastic.co/) es un motor de búsqueda basado en la biblioteca Lucene, utilizado por Hyperion para almacenar y recuperar todos los datos indexados en formato de documento JSON sin esquema de alta eficiencia.

**Kibana**\
[Kibana](https://www.elastic.co/kibana/) es un componente del Elastic Stack, un tablero que permite visualizar datos y simplificar la operación y visión de un clúster de Elasticsearch. Todos los datos indexados de Hyperion residen en la base de datos Elasticsearch, Kibana ofrece una vista directa de estos datos y la salud del clúster de Elasticsearch.

## Topología de Hyperion

La topología de tu implementación de Hyperion depende de tu requerimiento de servicios de historial. Ya sea Público/Privado, WAX Mainnet/Testnet, Historia Completa/Parcial o incluso una cadena privada.

Este artículo discutirá WAX Mainnet y WAX Testnet con Historia Completa, en relación con lo que actualmente funciona en las Ofertas de Servicios Públicos de EOSphere.

**WAX Mainnet**\
Originalmente, EOSphere comenzó con un solo servidor ejecutando todos los Componentes de Software de Hyperion excepto el nodo State-History de WAX. Sin embargo, se descubrió un desafío en relación con el tamaño del montón JVM de Elasticsearch cuando el uso de la red WAX creció y nuestra API se utilizó ampliamente.

El tamaño del montón JVM es la cantidad de memoria asignada a la Máquina Virtual Java de un nodo Elasticsearch, cuanto más montón disponible, más memoria caché disponible para operaciones de indexación y búsqueda. Si es demasiado bajo, la indexación de Hyperion será lenta y las consultas de búsqueda serán muy latentes. Si el tamaño del montón JVM es más de 32GB (generalmente menos que esto) en un nodo Elasticsearch, el umbral para los punteros de objeto ordinario comprimido (OOP) se excederá y la JVM dejará de usar compresión. Esto será excepcionalmente ineficiente en términos de gestión de memoria y el nodo consumirá mucha más memoria.

El resultado de lo anterior es la necesidad de crear un clúster de más de un nodo Elasticsearch, ya que el límite es por instancia de nodo Elasticsearch. Dos nodos con montón JVM de 25GB resultan en 50GB de montón disponible para todo el clúster.

Otros beneficios de agrupar más de un nodo Elasticsearch son, por supuesto, más núcleos de CPU para procesamiento y más DISCO para los requisitos de almacenamiento de Historia Completa de WAX siempre en expansión. Elasticsearch almacena datos indexados en documentos, estos documentos se asignan a fragmentos, estos fragmentos se equilibran automáticamente entre los nodos en un clúster. Aparte de distribuir la utilización del DISCO a través de los nodos, cada fragmento es su propio índice Lucene y, como tal, distribuye la utilización del ancho de banda de la CPU a través del clúster también.

Recomiendo leer [Elasticsearch: The Definitive Guide](https://www.elastic.co/guide/en/elasticsearch/guide/current/index.html) como un excelente libro para ayudarte a entender los conceptos de Elasticsearch.

Tomando en cuenta lo anterior, nuestra topología recomendada actual para WAX Mainnet es ejecutar lógica o físicamente los siguientes nodos:

* **Balanceador de Carga**
  * Descarga SSL
  * Políticas de Uso
* **Servidor Hyperion 1**
  * API de Hyperion
  * Indexador de Hyperion
  * RabbitMQ
  * Redis
  * Node.js
  * PM2
  * Kibana
* **Servidor Hyperion 2**
  * Elasticsearch I (25GB JVM Heap)
* **Servidor Hyperion 3**
 

 * Elasticsearch II (25GB JVM Heap)
* **Servidor Hyperion 4**
  * Elasticsearch III (25GB JVM Heap)
* **WAX State-History**
  * nodo nodeos sincronizado con la red con el plugin state_history habilitado

**WAX Testnet**\
El WAX Testnet no es un entorno particularmente ocupado hasta la fecha. Ejecutar un servicio de historia completa aquí es bastante simple y un excelente lugar para comenzar tu viaje en el despliegue y ejecución de Hyperion.

Nuestra topología recomendada actual para WAX Testnet es ejecutar la mayoría de Hyperion en un solo nodo lógica o físicamente:

* **Balanceador de Carga**
  * Descarga SSL
  * Políticas de Uso
* **Servidor Hyperion 1**
  * API de Hyperion
  * Indexador de Hyperion
  * RabbitMQ
  * Redis
  * Node.js
  * PM2
  * Kibana
  * Elasticsearch (8GB JVM Heap)
* **WAX State-History**
  * nodo nodeos sincronizado con la red con el plugin state_history habilitado

## Hardware de Hyperion

Similar a la Topología de Hyperion, la elección de hardware variará según tu requerimiento de servicios de historial.

Las recomendaciones a continuación son para WAX Mainnet y WAX Testnet con Historia Completa, en relación con lo que actualmente funciona en las Ofertas de Servicios Públicos de EOSphere.

**WAX Mainnet**

* **Balanceador de Carga**
  * A elección, sin embargo, [HAProxy](https://medium.com/eosphere/wax-technical-how-to-5-14671fcc7122) es una gran opción
  * Internet de alta velocidad 100Mb/s+
* **Servidor Hyperion 1**
  * CPU moderna, 3Ghz+, 8 Núcleos+
  * 64GB RAM
  * 128GB DISCO _(SSD/NVMe de grado empresarial)_
  * LAN de 1Gb/s+
* **Servidor Hyperion 2–4**
  * CPU moderna, 3Ghz+, 8 Núcleos+
  * 64GB RAM
  * SSD/NVMe de grado empresarial
    _La base de datos Elasticsearch actual (diciembre de 202a) es de 32TB, sugiero provisionar 40–45TB a través del clúster para la longevidad del servicio de Historia Completa_
  * LAN de 1Gb/s+
* **WAX State-History**
  * CPU moderna, 4Ghz+, 4 Núcleos
  * 128GB RAM
  * 256GB DISCO 1 _(SSD/NVMe de grado empresarial)_
  * 18TB DISCO 2 _(SAS o SATA están bien)_
  * 1Gb/s+ LAN  

**WAX Testnet**

* **Balanceador de Carga**
  * A elección, sin embargo, [HAProxy](https://medium.com/eosphere/wax-technical-how-to-5-14671fcc7122) es una gran opción
  * Internet 1Mb/s+
* **Servidor Hyperion 1**
  * CPU moderna, 3Ghz+, 8 Núcleos+
  * 16GB RAM
  * 1TB DISCO _(SSD/NVMe de grado empresarial)_
  * LAN de 1Gb/s+
* **WAX State-History**
  * CPU moderna, 4Ghz+, 4 Núcleos
  * 8GB RAM
  * 64GB DISCO 1 _(SSD/NVMe de grado empresarial)_
  * 1TB DISCO 2 _(SAS o SATA están bien)_

Con esa introducción, ahora deberías tener un punto de partida informado para tu viaje de servicios de Hyperion.

---

Estas **Guías Técnicas para Desarrolladores de WAX** se crean utilizando material de origen de la [Serie Cómo Hacerlo Técnico de WAX de EOSphere](https://medium.com/eosphere/wax-technical-how-to/home)

Asegúrate de hacer cualquier pregunta en el [Telegram de EOSphere](https://t.me/eosphere_io).