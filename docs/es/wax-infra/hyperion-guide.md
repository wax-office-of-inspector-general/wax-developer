---
title: Hyperion y los nodos de historial
nav_order: 141
layout: default
parent: WAX Infrastructure/APIs
lang-ref: Full/Partial History nodes using Hyperion
lang: es
---

Tener una accesibilidad estable a los datos consumibles es esencial para las aplicaciones Web3 en una blockchain. Existen muchos ejemplos de utilidad que se les puede atribuir a los datos del historial, como la contabilidad, los impuestos, el seguimiento de las transacciones, la gestión de carteras, etc. 

Hoy en día existen múltiples soluciones del historial que ofrecen diferentes características y funcionalidades, todas ellas con sus diferentes requisitos en términos de infraestructura. La siguiente guía presenta los pasos necesarios para configurar una solución de historial escalable y resistente basada en Hyperion.

### Requisitos previos y requerimientos:

- **Hardware del nodo API (especificaciones mínimas):** CPU multihilo con al menos 4gHZ de velocidad de la CPU o superior, 64GB de RAM, 14TB SSD (actualmente el tamaño del disco está aumentando alrededor de 25-30GB/día, así que planifica en consecuencia) - para ElasticSearch (también se recomienda tener clusters ES multi-nodo para un mayor rendimiento).
- **Hardware de nodo con historial completo (especificaciones recomendadas):** CPU i9, 128GB RAM, 6TB NVME SSD (para un estado-historia parcial, puede tener especificaciones más bajas o tenerlo en el mismo servidor que Hyperion. También se puede iniciar desde una instantánea).
- **Versión de Hyperion:** v3.3.5 en adelante.
- **Dependencias:** ElasticSearch 7.17.X, RabbitMQ, Redis, Node.js v16, PM2.
- **Sistema Operativo:** Ubuntu20.04 (recomendado).

#### Proveedores de infraestructura "bare-metal":

- [Hetzner](https://www.hetzner.com/dedicated-rootserver "Hetzner")
- [Leaseweb](https://www.leaseweb.us/dedicated-servers "Leaseweb")

### Configuración e instalación:

Después de asegurar los servidores y establecer la configuración de arranque y los modos RAID apropiados, inicia sesión en el servidor y sigue los siguientes comandos: 

[Recomendación - Por ahora, configura únicamente la partición raíz en los modos Raid1 o Raid5. Más adelante particionaremos los discos tras el arranque y los asignaremos a un pool ZFS].

##### 1. Actualizar los paquetes por defecto e instalar los nuevos
```
apt-get update && apt-get install -y vim htop aptitude git lxc-utils zfsutils-linux netfilter-persistent sysstat ntp gpg screen zstd
```
##### 2. Para un mayor rendimiento de la CPU
```
apt-get install -y cpufrequtils
echo 'GOVERNOR="performance"' | tee /etc/default/cpufrequtils
systemctl disable ondemand
systemctl restart cpufrequtils
```
##### 3. Crear particiones de disco 
Lo primero es identificar los discos y sus nombres usando los siguientes comandos:
```
fdisk -l
```
Después de identificar los nombres de los discos, vamos a particionarlos usando el comando de ejemplo de abajo. Necesitamos crear dos particiones: una para Swap y otra para el pool de almacenamiento ZFS.

```
cfdisk /dev/nvme0n1
```
Sigue estos mismos pasos con todos los discos de tu servidor.

##### 4. Aumenta el tamaño del Swap, que suele ser pequeño en los servidores de Hetzner y Leaseweb.
```
mkswap /dev/nvme0n1p5
mkswap /dev/nvme1n1p5
```
Ahora vamos a añadir los Swap pools a la tabla System's FileSystem editando el siguiente archivo:
```
cat >>/etc/fstab <<'EOT'
/dev/nvme0n1p5     none            swap            defaults,pri=-2 0 0
/dev/nvme1n1p5     none            swap            defaults,pri=-2 0 0
/dev/nvme2n1p5     none            swap            defaults,pri=-2 0 0
EOT
```
Después de editarlo, activa el nuevo Swap pool usando el siguiente comando:
```
swapon -a
```

##### 5. Crea un pool de almacenamiento ZFS según tus necesidades con los modos zraid, mirror, etc. Este es un buen recurso para hacer cálculos sobre el tamaño de los discos: http://www.raidz-calculator.com/

```
zpool create -o ashift=12 zfast raidz /dev/nvme0n1p6 /dev/nvme1n1p6 /dev/nvme2n1p6 [--> Adopta los nombres de las particiones en consecuencia]
zfs set atime=off zfast
zfs set compression=lz4 zfast [--> No es realmente necesario, ya que ES ya comprime los datos]
zfs create -o mountpoint=/home zfast/home [--> Crea un punto de montaje]
```

------------

Ahora que hemos configurado bien el servidor y el almacenamiento en disco, sigamos con los siguientes pasos para configurar las dependencias relacionadas con Hyperion.

https://hyperion.docs.eosrio.io/manual_installation/

##### 6. Configuración e instalación de Elasticsearch v7.17.X:

Los siguientes pasos son para un clúster de ES de un solo nodo, pero se recomienda tener un clúster de ES de varios nodos para la escalabilidad y la resistencia. Configura un clúster de ES de 3 nodos como mínimo para que los fragmentos de ES puedan distribuirse y se creen réplicas. También deberás usar la replicación de clústeres cruzados en diferentes centros de datos para la resiliencia geográfica.

Para la configuración del clúster ES de varios nodos, consulta este enlace:

https://www.elastic.co/guide/en/elasticsearch/reference/7.17/scalability.html
https://www.elastic.co/guide/en/elasticsearch/reference/current/add-elasticsearch-nodes.html

**Instalación de ES con el paquete Apt:**

```
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
sudo apt-get install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-7.x.list
sudo apt-get update && sudo apt-get install elasticsearch
```
Ahora, vamos a crear nuevos directorios en el pool de almacenamiento ZFS para que los datos y registros de ES puedan ser almacenados allí en lugar de los directorios por defecto:
```
cd /home
mkdir es-data
mkdir es-logs
chown -R elasticsearch:elasticsearch es-data/
chown -R elasticsearch:elasticsearch es-logs/
```
Después de crear los directorios y arreglar los permisos de las carpetas, vamos a editar la configuración de ES modificando el siguiente archivo:
```
vim /etc/elasticsearch/elasticsearch.yml
```

###### Sustituye las siguientes secciones en el archivo de configuración del ES

```
# ---------------------------------- Clúster -----------------------------------
cluster.name: hyp-cluster
bootstrap.memory_lock: true
# ------------------------------- Rutas de acceso ---------------------------------
path.data: /home/es-data
# Ruta de acceso a los archivos de registro:
path.logs: /home/es-logs
```
###### Configuración del tamaño de la pila

Para optimizar el tamaño de la pila de archivos, comprueba cuánta RAM puede asignar la JVM en tu sistema. Ejecuta el siguiente comando:
```
java -Xms16g -Xmx16g -XX:+UseCompressedOops -XX:+PrintFlagsFinal Oops | grep Oops
```
Comprueba si UseCompressedOops marca "true" en los resultados y cambia -Xms y -Xmx por el valor deseado.

**Nota:** Elasticsearch incluye una versión de OpenJDK del mantenimiento del JDK. Puedes encontrarla en /usr/share/elasticsearch/jdk

Después, cambia el tamaño de la pila editando las siguientes líneas en:

`vim /etc/elasticsearch/jvm.options`:

```
-Xms25g
-Xmx25g
```
**Nota:** Xms y Xmx deben tener el mismo valor.
**Aviso:** Procura no asignar más de 31GB al establecer el tamaño de la pila, incluso si tienes suficiente RAM.

###### Permitir el bloqueo de la memoria

Anula la configuración de systemd ejecutando `sudo systemctl edit elasticsearch` y añade las siguientes líneas:
```
[Service]
LimitMEMLOCK=infinity
```
Ejecuta el siguiente comando para recargar las unidades:
```
sudo systemctl daemon-reload
```
###### Iniciar Elasticsearch
Inicia Elasticsearch y comprueba los registros:
```
sudo systemctl start elasticsearch.service
sudo less /home/es-logs/hyp-cluster.log
```
Habilítalo para que se ejecute al inicio:
```
sudo systemctl enable elasticsearch.service
```
Por último, prueba la API REST:
```
curl -X GET "localhost:9200/?pretty" [Comprueba si todo se ve correctamente]
```

###### Configura una seguridad mínima
Las funciones de seguridad de Elasticsearch están desactivadas por defecto. Para evitar problemas de seguridad, se recomienda habilitar el paquete de seguridad.

Para hacerlo, añade la siguiente línea al final del archivo: `vim /etc/elasticsearch/elasticsearch.yml`

```
xpack.security.enabled: true
```
Reinicia Elasticsearch y establece las contraseñas para el clúster:
```
sudo systemctl restart elasticsearch.service
sudo /usr/share/elasticsearch/bin/elasticsearch-setup-passwords auto
```
Guarda las contraseñas en algún lugar seguro, serán necesarias en el futuro.

Ahora puedes probar la API REST utilizando el nombre de usuario y la contraseña:
```
curl -X GET "http://localhost:9200/?pretty" -u elastic:<contraseña>
```

##### 7. Instalación de Kibana usando el paquete Apt:

```
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
sudo apt-get install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-7.x.list
sudo apt-get update && sudo apt-get install kibana
```
###### Configuración:

Ahora vamos a editar el archivo `vim /etc/kibana/kibana.yml`

Si es necesario, actualiza la dirección del host a 0.0.0.0 para acceder a él utilizando la IP de la red pública. Por defecto está configurado como localhost.

Si has habilitado el paquete de seguridad en Elasticsearch, necesitas configurar la contraseña en Kibana:
```
elasticsearch.username: "kibana_system"
elasticsearch.password: "contraseña"
```
###### Inicia Kibana
Inicia Kibana y comprueba los registros:
```
sudo systemctl start kibana.service
sudo less /var/log/kibana/kibana.log
```
Habilítalo para que se ejecute al inicio:
```
sudo systemctl enable kibana.service
```

##### 8. Instala el nodo JS:
```
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
node  -v
```
##### 9.Instala Redis
```
sudo add-apt-repository ppa:redislabs/redis
sudo apt-get -y update
sudo apt-get -y install redis
redis-server -v
```
###### Actualiza el método de supervisión de Redis
Cambia la configuración `supervised` de `supervised no` a `supervised systemd` en `/etc/redis/redis.conf`

###### Reinicia Redis
```
sudo systemctl restart redis-server
sudo systemctl enable --now redis-server
sudo systemctl status redis-server
sudo systemctl status redis-server
sudo systemctl unmask  redis-server.service
sudo systemctl restart redis-server
sudo systemctl status redis-server
```
##### 10. Instalación de Pm2
```
npm install pm2@latest -g
pm2 startup
```

##### 11. Instalación de RabbitMq

Copia el shell script desde aquí y ejecútalo en el servidor: https://www.rabbitmq.com/install-debian.html#installation-methods
```
cd builds
vim rabbit_install.sh
```
Vamos a crear directorios en nuestro pool de almacenamiento ZFS para RabbitMq:
```
cd /home
mkdir rabbitmq
chown -R rabbitmq:rabbitmq rabbitmq/
```

Crea un nuevo archivo en `/etc/rabbitmq` para poder cargar los directorios por defecto:
```
cd /etc/rabbitmq
vim rabbitmq-env.conf
```
Añade las siguientes líneas al archivo de configuración:
```
`RABBITMQ_MNESIA_BASE=/home/rabbitmq`
`RABBITMQ_LOG_BASE=/home/rabbitmq/log`
```
```
sudo rabbitmq-plugins enable rabbitmq_management
sudo rabbitmqctl add_vhost hyperion
sudo rabbitmqctl add_user hyper << password >>
sudo rabbitmqctl set_user_tags hyper administrator
sudo rabbitmqctl set_permissions -p hyperion hyper ".*" ".*" ".*"
sudo rabbitmqctl add_vhost /hyperion
sudo rabbitmqctl set_permissions -p /hyperion hyper ".*" ".*" ".*"
```

------------
##### 12. Instala y configura Hyperion

Ahora que hemos terminado la configuración de las dependencias, vamos a iniciar la instalación del software Hyperion.

Tenemos dos opciones:
1. Instalar y sincronizar todo desde cero
2. Usar las instantáneas de ES para sincronizar los datos y, después, iniciar la instancia de Hyperion.

Nota: Si estás usando las instantáneas de ES de un proveedor de servicios de instantáneas, entra en el modo Kibana dev e introduce los siguientes comandos:

```
PUT _snapshot/eosphere-repo
{
   "type": "url",
   "settings": {
       "url": "https://store1.eosphere.io/wax/hyperion/snapshot/"
   }
}


POST _snapshot/eosphere-repo/wax_snapshot_2022.02.01/_restore
{
  "indices": "*,-.*"
}
```
###### Configuración:

Clona el último código base e instala el hyperion:

```
git clone https://github.com/eosrio/hyperion-history-api.git
cd hyperion-history-api
npm install
```
Ahora que está instalado, tenemos que configurar las conexiones y la configuración de la cadena.

1. Sigue esta [guía](https://hyperion.docs.eosrio.io/connections/  "guía") para configurar el archivo connections.json file o usa los siguientes ejemplos:
```
{
  "amqp": {
    "host": "127.0.0.1:5672",
    "api": "127.0.0.1:15672",
    "protocol": "http",
    "user": "hyper",
    "pass": "<Introduce tu contraseña de RMQ>",
    "vhost": "hyperion",
    "frameMax": "0x10000"
  },
  "elasticsearch": {
    "protocol": "http",
    "host": "127.0.0.1:9200",
    "ingest_nodes": [
      "127.0.0.1:9200"
    ],
    "user": "elastic",
    "pass": "<Introduce la contraseña del usuario de elastic del paso 6>"
  },
  "redis": {
    "host": "127.0.0.1",
    "port": "6379"
  },
  "chains": {
    "wax": {
      "name": "Wax",
      "ship": "ws://<Introduce aquí la extensión del nodo de archivo>:8080",
      "http": "http://<Introduce aquí la extensión del nodo API>:8888",
      "chain_id": "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4",
      "WS_ROUTER_HOST": "127.0.0.1",
      "WS_ROUTER_PORT": 7001
    }
  }
}
```
2. Sigue esta [guía](https://hyperion.docs.eosrio.io/chain/  "guía") para configurar el archivo wax.config.json

###### Ejecutar Hyperion:

Hay dos partes en Hyperion, una es Indexer y la otra es la API.

Cuando empiezas con Indexer, el primer paso es ejecutarlo con el modo de escaneo ABI. Una vez que el escaneo ABI está hecho, puedes volver a arrancarlo sin él. El Hyperion Indexer está configurado para realizar un escaneo ABI ("abi_scan_mode": true) por defecto. 

Utiliza los siguientes comandos para ejecutar y detener el indexador.
```
./start.sh wax-indexer
./stop.sh wax-indexer
```
Una vez que el indexador está sincronizado, puedes iniciarlo con el modo en vivo y luego iniciar la API.

Para iniciar la API, utiliza los siguientes comandos:
```
./start.sh wax-api
./stop.sh wax-api
```
**Nota:** Si tienes dudas sobre cómo utilizar Hyperion, escríbelas aquí: https://t.me/EOSHyperion

------------

Para configurar la guía de historial parcial: https://medium.com/waxgalaxy/lightweight-wax-hyperion-api-node-setup-guide-f080a7d4a5b5
