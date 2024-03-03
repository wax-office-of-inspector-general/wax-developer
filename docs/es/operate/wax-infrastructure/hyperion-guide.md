---
título: Nodos de Historia Completa/Parcial usando Hyperion
---

# Nodos de Historia Completa/Parcial usando Hyperion

Tener accesibilidad estable a datos consumibles es esencial para aplicaciones Web3 en una blockchain. Hay muchos casos de uso para datos históricos como contabilidad, impuestos, seguimiento de transacciones, gestión de carteras, etc.

Hoy en día, hay múltiples soluciones de historia que ofrecen diferentes características y funcionalidades, todas tienen diferentes requisitos en términos de infraestructura. La siguiente guía presenta los pasos necesarios para configurar una solución de historia basada en Hyperion escalable y resiliente.

### Prerrequisitos/Requerimientos:

- **Hardware de nodo API (especificaciones mínimas):** CPU multi-hilo con al menos 4gHZ de velocidad de CPU o superior, 64GB RAM, 14TB SSD (actualmente el tamaño del disco está aumentando alrededor de 25-30GB/día, así que planifica en consecuencia) - Para ElasticSearch [También se recomienda tener clústeres de ES multinodo para mayor rendimiento]
- **Hardware de nodo de Historia de Estado Completa (especificaciones recomendadas):** CPU i9, 128GB RAM, 6TB NVME SSD [Para una historia de estado parcial, puedes tener especificaciones más bajas o tenerlo en el mismo servidor que Hyperion. Esto también puede iniciarse desde un snapshot]
- **Versión de Hyperion:** v3.3.5 o superior
- **Dependencias:** Elasticsearch 7.17.X, RabbitMQ, Redis, Node.js v16, PM2
- **SO:** Ubuntu20.04 (recomendado)

#### Proveedores de Infraestructura Bare-Metal:

- [Hetzner](https://www.hetzner.com/dedicated-rootserver "Hetzner")
- [Leaseweb](https://www.leaseweb.us/dedicated-servers "Leaseweb")

### Configuración e Instalación:

Después de asegurar los servidores y configurar la configuración de arranque y los modos RAID apropiados, puedes iniciar sesión en el servidor y seguir los siguientes comandos a continuación:

[Recomendación - Solo configura la partición root en modos Raid1 o Raid5 por ahora. Vamos a particionar los discos más adelante después del arranque y asignarlos a un pool de ZFS]

##### 1. Actualiza los paquetes predeterminados e instala nuevos
```
apt-get update && apt-get install -y vim htop aptitude git lxc-utils zfsutils-linux netfilter-persistent sysstat ntp gpg screen zstd
```
##### 2. Para un mejor rendimiento de la CPU:
```
apt-get install -y cpufrequtils
echo 'GOVERNOR="performance"' | tee /etc/default/cpufrequtils
systemctl disable ondemand
systemctl restart cpufrequtils
```
##### 3. Crear particiones de disco
El primer paso es determinar los discos y sus nombres usando los comandos a continuación:
```
fdisk -l
```
Ahora, después de identificar los nombres de los discos, vamos a particionarlos usando el comando de ejemplo a continuación, necesitamos crear dos particiones Una para Swap y Una para el pool de almacenamiento ZFS.

```
cfdisk /dev/nvme0n1
```
Haz lo anterior para todos los discos en tu servidor.

##### 4. Aumenta el tamaño de Swap ya que suele ser pequeño en los servidores de Hetzner y Leaseweb.
```
mkswap /dev/nvme0n1p5
mkswap /dev/nvme1n1p5
```
Ahora vamos a añadir los pools de Swap a la tabla del Sistema de Archivos editando el archivo a continuación:
```
cat >>/etc/fstab <<'EOT'
/dev/nvme0n1p5     none            swap            defaults,pri=-2 0 0
/dev/nvme1n1p5     none            swap            defaults,pri=-2 0 0
/dev/nvme2n1p5     none            swap            defaults,pri=-2 0 0
EOT
```
Después de editar, vamos a habilitar el pool de Swap recién agregado usando el comando a continuación:
```
swapon -a
```

##### 5. Crea un pool de almacenamiento ZFS basado en tus requisitos con mod

os zraid o mirror, etc. Un buen recurso para hacer cálculos sobre tamaños de disco: http://www.raidz-calculator.com/

```
zpool create -o ashift=12 zfast raidz /dev/nvme0n1p6 /dev/nvme1n1p6 /dev/nvme2n1p6 [--> adapta los nombres de las particiones en consecuencia]
zfs set atime=off zfast
zfs set compression=lz4 zfast [-->no es realmente necesario ya que ES ya comprime los datos]
zfs create -o mountpoint=/home zfast/home [-->Crea un punto de montaje]
```

------------

Ahora que hemos configurado el servidor y el almacenamiento en disco de una buena manera, sigamos con los siguientes pasos para configurar las dependencias relacionadas con Hyperion.

https://hyperion.docs.eosrio.io/manual_installation/

##### 6. Configuración e Instalación de Elasticsearch v7.17.X:

Los siguientes pasos son para un clúster ES de un solo nodo, pero se recomienda tener un clúster ES multinodo para escalabilidad y resiliencia. Configura un mínimo de clúster ES de 3 nodos para que los shards de ES puedan distribuirse y se creen réplicas. Además, utiliza la replicación Cross-Cluster en diferentes centros de datos para la resiliencia geográfica.

Para la configuración del clúster multinodo ES, consulta:

https://www.elastic.co/guide/en/elasticsearch/reference/7.17/scalability.html
https://www.elastic.co/guide/en/elasticsearch/reference/current/add-elasticsearch-nodes.html

**Instalación de ES usando el paquete Apt:**

```
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
sudo apt-get install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-7.x.list
sudo apt-get update && sudo apt-get install elasticsearch
```
Ahora, vamos a crear nuevos directorios en el pool de almacenamiento ZFS para que los datos y registros de ES puedan almacenarse allí en lugar de en los directorios predeterminados:
```
cd /home
mkdir es-data
mkdir es-logs
chown -R elasticsearch:elasticsearch es-data/
chown -R elasticsearch:elasticsearch es-logs/
```
Después de crear los directorios y corregir los permisos de las carpetas, vamos a editar la configuración de ES editando el archivo a continuación:
```
vim /etc/elasticsearch/elasticsearch.yml
```

###### Reemplaza las siguientes secciones en el archivo de configuración de ES

```
# ---------------------------------- Cluster -----------------------------------
cluster.name: hyp-cluster
bootstrap.memory_lock: true
# ----------------------------------- Paths ------------------------------------
path.data: /home/es-data
# Path to log files:
path.logs: /home/es-logs
```
###### Configuración del Tamaño del Heap

Para un tamaño de heap optimizado, verifica cuánta RAM puede ser asignada por la JVM en tu sistema. Ejecuta el siguiente comando:
```
java -Xms16g -Xmx16g -XX:+UseCompressedOops -XX:+PrintFlagsFinal Oops | grep Oops
```
Comprueba si UseCompressedOops es verdadero en los resultados y cambia -Xms y -Xmx al valor deseado.

**Nota:** Elasticsearch incluye una versión empaquetada de OpenJDK de los mantenedores de JDK. Puedes encontrarlo en /usr/share/elasticsearch/jdk

Después de eso, cambia el tamaño del heap editando las siguientes líneas en

`vim /etc/elasticsearch/jvm.options`:

```
-Xms25g
-Xmx25g
```
**Nota:** Xms y Xmx deben tener el mismo valor.
**Advertencia:** Evita asignar más de 31GB al configurar el tamaño de tu heap, incluso si tienes suficiente RAM.

###### Permitir Bloqueo de Memoria

Sobreescribe la configuración de systemd ejecutando `sudo systemctl edit elasticsearch` y añade las siguientes líneas:
```
[Service]
LimitMEMLOCK=infinity
```
Ejecuta el siguiente comando para recargar las unidades:
```
sudo systemctl daemon-reload
```
###### Iniciar Elasticsearch
Inicia Elasticsearch y verifica los registros:
```
sudo systemctl start elasticsearch.service
sudo less /home/es-logs/hyp-cluster.log
```
Habilita el inicio automático:
```
sudo systemctl enable elasticsearch.service
```


Y finalmente, prueba la API REST:
```
curl -X GET "localhost:9200/?pretty" [Prueba si todo se ve bien]
```

###### Configurar Seguridad Mínima
Las características de seguridad de Elasticsearch están desactivadas por defecto. Para evitar problemas de seguridad, recomendamos habilitar el paquete de seguridad.

Para hacer eso, añade la siguiente línea al final del archivo: `vim /etc/elasticsearch/elasticsearch.yml`

```
xpack.security.enabled: true
```
Reinicia Elasticsearch y configura las contraseñas para el clúster:
```
sudo systemctl restart elasticsearch.service
sudo /usr/share/elasticsearch/bin/elasticsearch-setup-passwords auto
```
Guarda las contraseñas en un lugar seguro, serán necesarias para el futuro.

Ahora puedes probar la API REST usando el nombre de usuario y contraseña:
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

Ahora vamos a editar `vim /etc/kibana/kibana.yml`

Actualiza la dirección del host a 0.0.0.0 si es necesario para acceder a ella usando la IP en la red pública. Por defecto está configurado a localhost.

Si has habilitado el paquete de seguridad en Elasticsearch, necesitas configurar la contraseña en Kibana:
```
elasticsearch.username: "kibana_system"
elasticsearch.password: "contraseña"
```
###### Iniciar Kibana
Inicia Kibana y verifica los registros:
```
sudo systemctl start kibana.service
sudo less /var/log/kibana/kibana.log
```
Habilita el inicio automático:
```
sudo systemctl enable kibana.service
```

##### 8. Instalación de Node JS:
```
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
node  -v
```
##### 9. Instalación de Redis
```
sudo add-apt-repository ppa:redislabs/redis
sudo apt-get -y update
sudo apt-get -y install redis
redis-server -v
```
###### Actualizar Método de Supervisión de Redis
Cambia la configuración `supervised` de `supervised no` a `supervised systemd` en `/etc/redis/redis.conf`

###### Reiniciar Redis
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

Copia el script de shell desde aquí y ejecútalo en el servidor: https://www.rabbitmq.com/install-debian.html#installation-methods
```
cd builds
vim rabbit_install.sh
```
Después de copiar el script, ahora puedes ejecutarlo:
```
bash rabbit_install.sh
```
Vamos a crear directorios en nuestro pool de almacenamiento ZFS para RabbitMq:
```
cd /home
mkdir rabbitmq
chown -R rabbitmq:rabbitmq rabbitmq/
```

Añade un archivo env en `/etc/rabbitmq` para que podamos cambiar los directorios predeterminados:
```
cd /etc/rabbitmq
vim rabbitmq-env.conf
```
Añade las siguientes líneas al archivo de configuración:
```
RABBITMQ_MNESIA_BASE=/home/rabbitmq
RABBITMQ_LOG_BASE=/home/rabbitmq/log
```
Reinicia el servidor rabbit después de actualizar la configuración:
```
service rabbitmq-server restart
```
```
sudo rabbitmq-plugins enable rabbitmq_management
sudo rabbitmqctl add_vhost hyperion
sudo rabbitmqctl add_user hyper <<contraseña>>
sudo rabbitmqctl set_user_tags hyper administrator
sudo rabbitmqctl set_permissions -p hyperion hyper ".*" ".*" ".*"
sudo rabbitmqctl add_vhost /hyperion
sudo rabbitmqctl set_permissions -p /hyperion hyper "

.*" ".*" ".*"
```

------------
##### 12. Configuración e Instalación de Hyperion

Ahora hemos terminado la configuración de las dependencias, sigamos adelante y comencemos la instalación del software Hyperion propiamente dicho.

Ahora tenemos dos opciones:
1. Instalar y sincronizar todo desde cero
2. Usar snapshots de ES para sincronizar los datos y luego iniciar la instancia de Hyperion.

Nota: Si estás usando snapshots de ES de un proveedor de servicio de snapshots, ve a Kibana dev mode e ingresa los siguientes comandos:

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

Clona la base de código más reciente e instala hyperion:

```
git clone https://github.com/eosrio/hyperion-history-api.git
cd hyperion-history-api
npm install
```
Ahora que está instalado, tenemos que configurar las conexiones y la configuración de la cadena.

1. Sigue la guía [aquí](https://hyperion.docs.eosrio.io/connections/  "aquí") para configurar el archivo connections.json. o encuentra el ejemplo a continuación:
```
{
  "amqp": {
    "host": "127.0.0.1:5672",
    "api": "127.0.0.1:15672",
    "protocol": "http",
    "user": "hyper",
    "pass": "<Ingresa tu contraseña de RMQ>",
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
    "pass": "<Ingresa la contraseña del usuario elastic del paso 6>"
  },
  "redis": {
    "host": "127.0.0.1",
    "port": "6379"
  },
  "chains": {
    "wax": {
      "name": "Wax",
      "ship": "ws://<Ingresa aquí tu endpoint de nodo Ship>:8080",
      "http": "http://<Ingresa aquí tu endpoint de nodo API>:8888",
      "chain_id": "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4",
      "WS_ROUTER_HOST": "127.0.0.1",
      "WS_ROUTER_PORT": 7001
    }
  }
}
```
2. Sigue la guía [aquí]https://hyperion.docs.eosrio.io/chain/  "aquí") para configurar el archivo wax.config.json

###### Ejecutando Hyperion:

Hyperion tiene dos partes, una es Indexer y la otra es la API.

Cuando comienzas con Indexer, el primer paso es ejecutarlo con el modo de escaneo ABI. Y una vez que el escaneo ABI está hecho, puedes iniciar de nuevo sin él. El Indexador Hyperion está configurado para realizar un escaneo abi ("abi_scan_mode": true) por defecto.

Puedes usar los siguientes comandos para ejecutar y detener el indexador.
```
./start.sh wax-indexer
./stop.sh wax-indexer
```
Una vez que el indexador esté sincronizado, puedes iniciarlo con el modo en vivo y luego iniciar la API.

Para iniciar la API, puedes usar los siguientes comandos:
```
./start.sh wax-api
./stop.sh wax-api
```
**Nota:** Si tienes más preguntas sobre cómo usar Hyperion, por favor escribe aquí: https://t.me/EOSHyperion

------------

Para configurar la guía de historia parcial: https://medium.com/waxgalaxy/lightweight-wax-hyperion-api-node-setup-guide-f080a7d4a5b5