---
título: Data Tiers en WAX Hyperion Full History
---

Proporcionar un historial completo para la red principal WAX es una tarea de infraestructura intensiva. Se necesitan abundantes recursos de CPU, memoria y, en particular, almacenamiento. Cualquier método para optimizar o incluso aliviar este desafío siempre será bienvenido.

Al monitorear el uso de una implementación de producción de WAX Hyperion Full History, se puede observar que la mayoría de las consultas y actividades ocurren en los bloques más recientes. Esto significa que podrían haberse asignado y utilizado recursos empresariales caros para datos de bloques antiguos que quizás sean accedidos muy rara vez.

Elasticsearch tiene una funcionalidad llamada Gestión del Ciclo de Vida de Índices (ILM) donde se pueden aplicar políticas a tus índices que cumplan con tus requisitos de resiliencia, rendimiento y retención de datos. En particular, **Capas de Datos** proporcionan un mecanismo a nivel de clúster para mover índices específicos a nodos configurados con un rol particular. Esto significa que uno o más de los nodos Elasticsearch utilizados para tu WAX Hyperion Full History pueden construirse con un almacenamiento más barato, menos RAM y una CPU más lenta... y luego configurarse para una capa inferior destinada a índices antiguos que no son accesados con frecuencia.

El siguiente artículo de esta serie cubrirá la configuración de una capa de datos "warm" (warm data tier) en un clúster Elasticsearch utilizado por Hyperion. Esta capa de datos se asignará a índices antiguos como un método para ahorrar en recursos de hardware empresarial costosos.

EOS RIO tiene un excelente [Repositorio de Documentación de Hyperion](https://hyperion.docs.eosrio.io/) que incluye detalles sobre cómo ejecutar su producto Hyperion Full History, sin embargo, este artículo ampliará su documentación actual.

Una vez más, esta serie de Tutoriales Técnicos cubrirá parte del mismo contenido de EOS RIO y añadirá matices operativos desde un punto de vista práctico y basado en nuestra experiencia.

[Conoce más sobre EOS RIO Hyperion](https://eosrio.io/hyperion/)

![imagen](https://github.com/user-attachments/assets/2ce31a7d-8a87-48a4-b85a-b5bb1e0685a8)

# Uso de Capas de Datos con WAX Hyperion Full History

**_Nota:_** _Inicialmente intenté crear un nodo con 6 discos mecánicos en una matriz ZFS vdev y luego asigné bloques y deltas antiguos a este nodo. El problema que encontré fue que debido a los requisitos de lectura aleatoria de Elasticsearch, cualquier consulta de estos datos era irrazonablemente lenta, decenas de segundos frente a milisegundos cuando se usaban SSD. También descubrí que cualquier consulta con comodines de datos de Hyperion afectaba a todo el clúster, incluido el nodo con disco mecánico, lo que ralentizaba la respuesta incluso para datos recientes._

**_El equipo de EOS RIO está trabajando en código que asignará inteligentemente las consultas a los nodos de capa apropiados en el clúster Elasticsearch. Actualizaré esta guía cuando esto se publique._**

Esta guía detallará la configuración de las capas de datos al agregar un nuevo nodo a un clúster Elasticsearch existente y luego mover índices antiguos a este nuevo nodo.

Este nuevo nodo se configurará para unirse a una capa de datos "warm". Este nodo utilizará SSDs de consumo más baratos ya que no habrá muchas escrituras afectando la durabilidad, una CPU antigua más lenta ya que no habrá tantas consultas y menos RAM ya que no se utilizará tanta caché.

Por favor, consulta nuestra guía previa [Clustering Elasticsearch para WAX Hyperion Full History](https://developer.wax.io/operate/wax-hyperion/wax-clustering-elasticsearch-for-hyperion.html) para obtener detalles sobre el clustering de Elasticsearch.

# Configuración del Nodo de Capa de Datos de Elasticsearch

Por defecto, Hyperion indexa todos los datos en Elasticsearch utilizando la capa `data_content`, los nodos existentes del clúster solo están configurados con esta capa `node.roles: [ data ]`. El nuevo nodo se configurará para usar la capa `data_warm` como se muestra a continuación.

```
> sudo nano /etc/elasticsearch/elasticsearch.yml
  
node.roles: [ data_warm ]
  
> sudo systemctl start elasticsearch.service
```

Como todos los índices de Hyperion existentes están configurados para indexar en `data_content`, cuando este nuevo nodo se inicie, no se le asignará ningún dato.

# Asignar Índices a la Capa de Datos "warm"

He encontrado que ver y asignar índices a capas de datos específicas es más sencillo usando la interfaz gráfica Kibana, aunque todas las acciones también se pueden realizar mediante la línea de comandos. Ambos métodos se detallan a continuación:

## Ver Índices

Los índices que nos interesan principalmente son los índices `wax-action` y `wax-delta`, cada uno de estos índices representa los datos de 10 millones de bloques en la red WAX. `wax-action-v1–000001` siendo el bloque 1–10,000,000 y `wax-action-v1–000002` siendo el bloque 10,000,001–20,000,000 y así sucesivamente.

```
> GET /_cat/indices/wax*
```

![imagen](https://github.com/user-attachments/assets/8c46dd0d-34d4-4a9c-a058-d09b8a071b07)

La configuración específica mostrada a continuación indica la capa de datos existente, como se esperaba `data_content` por defecto.

```
> GET /wax-action-v1-000023/_settings
```
![imagen](https://github.com/user-attachments/assets/82830550-359f-4129-94a3-403ff4803d1b)

## Establecer Capa de Índice

Establece el índice deseado en `data_warm`.
```
> PUT /wax-action-v1-000023/_settings  
{  
  "index.routing.allocation.include._tier_preference": "data_warm"  
}
```

![imagen](https://github.com/user-attachments/assets/c9ced417-bb61-4e37-9a66-27c623c36f47)

## Observar la Asignación de Índices

El clúster moverá entonces los fragmentos (shards) del índice deseado al nodo o nodos de la capa `data_warm`. Observa la asignación de índices mediante la línea de comandos o mediante el uso de disco en la GUI.

```
> GET _cat/shards/wax-action-v1-000023?v&s=index&h=index,node  
  
wax-action-v1-000023 wax-es-node-2 -> 10.125.0.90 _CmnnuMbQRqSEwX7rsSeaA wax-es-node-4  
wax-action-v1-000023 wax-es-node-2 -> 10.125.0.90 _CmnnuMbQRqSEwX7rsSeaA wax-es-node-4  
wax-action-v1-000023 wax-es-node-1 -> 10.125.0.89 fQeNr0UkSXuAnofq-rceoA wax-es-node-3  
wax-action-v1-000023 wax-es-node-1 -> 10.125.0.89 fQeNr0UkSXuAnofq-rceoA wax-es-node-3
```

![imagen](https://github.com/user-attachments/assets/e68130ee-7215-4272-8451-83331242f6e7)

El proceso de movimiento puede llevar algún tiempo y parece utilizar muy pocos recursos, lo cual es obviamente genial para un clúster en producción.

---
Estas **Guías Técnicas para Desarrolladores de WAX** se crean utilizando material fuente de la [Serie Técnica Cómo Hacerlo de WAX de EOSphere](https://medium.com/eosphere/wax-technical-how-to/home)

No dudes en hacer cualquier pregunta en el [Telegram de EOSphere](https://t.me/eosphere_io)