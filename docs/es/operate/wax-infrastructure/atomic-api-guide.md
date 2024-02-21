---
title: API de Atomic Assets/Market para WAX
---

# API de Atomic Assets/Market para WAX

La Blockchain de WAX está muy enfocada en NFTs y el estándar AtomicAssets se ha convertido en el estándar por defecto en WAX para los NFTs. Esta guía ayuda a los equipos de proyectos a configurar su propia infraestructura de API de AtomicAssets para acceder a datos específicos de NFTs y mercados. Estos datos de la API pueden ser útiles para diversos propósitos como:

- Construir Juegos
- Construir Mercados
- Acceder a NFTs en juegos
- Portafolio de NFTs de Usuarios
- Actividades Históricas de NFTs de Usuarios
- Para Contabilidad y Propósitos Fiscales

### Pre-requisitos/Requisitos:

- **Hardware mínimo para el nodo Atomic Filler:** CPU Multi-hilos con al menos 4gHZ de velocidad de CPU o superior, 64GB RAM, 2TB NvME SSD
- **Hardware mínimo para Atomic API:** CPU Multi-hilos con al menos 4gHZ de velocidad de CPU o superior, 128GB RAM, 2TB NvME SSD
- **Hardware recomendado para el nodo Full State-History:** CPU i9, 128GB RAM, 7TB NVME SSD [Para un state-history parcial, puedes tener especificaciones más bajas o tenerlo en el mismo servidor que Atomic Filler. Esto también se puede iniciar desde una instantánea]
- **Requisitos:** 
  - PostgreSQL >= 13.0
  - NodeJS >= 16.0
  - Redis >= 5.0
  - Nodeos >= 1.8.0 (solo probado con 2.0 y 2.1) El plugin de state history debe estar habilitado y las opciones: `trace-history = true`, `chain-state-history = true`
  - Motor de Hasura GraphQL >= 1.3 (si deseas permitir consultas GraphQL) [https://computingforgeeks.com/install-hasura-graphql-engine-on-ubuntu-18-04-centos-7/]
  - PGAdmin 4 (Interfaz para gestionar la base de datos postgres)

Puedes usar 1 nodo tanto para Atomic filler como para API en un servidor de 128GB RAM pero se recomienda tener una configuración de Alta Disponibilidad usando replicación de Postgres entre los servidores para un mejor rendimiento y manejo de solicitudes.

#### Proveedores de Infraestructura de Metal Desnudo:

- [Hetzner](https://www.hetzner.com/dedicated-rootserver "Hetzner")
- [Leaseweb](https://www.leaseweb.us/dedicated-servers "Leaseweb")

#### Proveedores de Infraestructura en la Nube:

- https://www.digitalocean.com/pricing/managed-databases

### Configuración e Instalación:

Después de asegurar los servidores o instancias en la nube y configurar la configuración de arranque y los modos RAID apropiados, puedes iniciar sesión en el servidor y seguir los siguientes comandos a continuación:

[Recomendación - Solo configura la partición raíz en modos Raid1 o Raid5 por ahora. Particionaremos los discos más adelante después del arranque y los asignaremos a un grupo de ZFS]

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
##### 3. Crea particiones de disco 
El primer paso es determinar los discos y sus nombres usando los comandos a continuación:
```
fdisk -l
```
Ahora, después de identificar los nombres de los discos, vamos a particionarlos usando el comando de ejemplo a continuación, necesitamos crear dos particiones, una para Swap y otra para el grupo de almacenamiento ZFS.

```
cfdisk /dev/nvme0n1
```
Haz lo anterior para todos los discos en tu servidor.

##### 4. Aumenta el tamaño de Swap ya que suele ser pequeño en los servidores de Hetzner y Leasew

eb.
```
mkswap /dev/nvme0n1p5
mkswap /dev/nvme1n1p5
```
Ahora, agreguemos los grupos de Swap a la tabla del sistema de archivos del sistema editando el archivo a continuación:
```
cat >>/etc/fstab <<'EOT'
/dev/nvme0n1p5     none            swap            defaults,pri=-2 0 0
/dev/nvme1n1p5     none            swap            defaults,pri=-2 0 0
EOT
```
Después de editar, activemos el grupo de Swap recién agregado usando el comando a continuación:
```
swapon -a
```

##### 5. Crea un grupo de almacenamiento ZFS basado en tus requisitos con modos zraid o espejo, etc. Un buen recurso para hacer cálculos sobre tamaños de disco: http://www.raidz-calculator.com/

```
zpool create -o ashift=12 zfast raidz /dev/nvme0n1p6 /dev/nvme1n1p6 [--> adopta los nombres de las particiones en consecuencia]
zfs set atime=off zfast
zfs set compression=lz4 zfast 
zfs create -o mountpoint=/home zfast/home [-->Crea punto de montaje]
```

------------

Ahora que hemos configurado el servidor y el almacenamiento de disco de una buena manera, procedamos con los siguientes pasos para configurar las dependencias relacionadas con Hyperion.

https://hyperion.docs.eosrio.io/manual_installation/


##### 6. Instalación de Node JS:
```
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
```
##### 7. Configuración e Instalación de PostgreSQL 14:

Los siguientes pasos son para una configuración de nodo único pero se recomienda tener un clúster de postgres de múltiples nodos con replicación para un mejor rendimiento y resiliencia.

Para la configuración del clúster de replicación de Postgres, consulta:

- [Replicación en Streaming](https://girders.org/postgresql/2021/11/05/setup-postgresql14-replication/)

**Instalación de PostgreSQL 14 usando el paquete Apt:**

Guía: https://techviewleo.com/how-to-install-postgresql-database-on-ubuntu/

```
sudo apt update && sudo apt -y upgrade
sudo apt -y install gnupg2 wget vim
sudo apt-cache search postgresql | grep postgresql
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt -y update
sudo apt -y install postgresql-14 postgresql-client-14
```
Tras una instalación exitosa, el servicio de PostgreSQL se inicia automáticamente y puede ser verificado de la siguiente manera.
```
$ systemctl status postgresql
● postgresql.service - PostgreSQL RDBMS
   Loaded: loaded (/lib/systemd/system/postgresql.service; enabled; vendor preset: enabled)
   Active: active (exited) since Mon 2021-10-25 16:15:55 CEST; 5s ago
  Process: 32506 ExecStart=/bin/true (code=exited, status=0/SUCCESS)
 Main PID: 32506 (code=exited, status=0/SUCCESS)

Okt 25 16:15:55 thor-KVM systemd[1]: Starting PostgreSQL RDBMS...
Okt 25 16:15:55 thor-KVM systemd[1]: Started PostgreSQL RDBMS.
```
También puedes verificar la versión de PostgreSQL instalada usando el siguiente comando:
```
sudo -u postgres psql -c "SELECT version();"
```
Después de verificar la instalación, actualicemos la contraseña del usuario postgres:
```
sudo su - postgres
psql -c "alter user postgres with password '<INGRESA TU CONTRASEÑA AQUÍ>'"
```

Ahora, vamos a crear nuevos directorios en el grupo de almacenamiento ZFS para que los datos de PG se puedan almacenar allí en lugar de en los directorios predeterminados:
```
cd /home
mkdir pg-data
chown -R postgres:postgres pg-data/
```
Después de crear los directorios y arreglar los permisos de las carpetas, vamos a editar la configuración de PG editando el archivo a continuación:
```
vim /etc/postgresql/14/main/postgresql.conf
```
###### Reemplaza las siguientes secciones en el archivo de configuración de PG

```
data_directory = '/var/lib/postgresql/14/main'
```


##### 8. Instalación de Redis
```
sudo add-apt-repository ppa:redislabs/redis
sudo apt-get -y update
sudo apt-get -y install redis
redis-server -v
```
###### Actualizar el Método de Supervisión de Redis
Cambia la configuración de `supervised` de `supervised no` a `supervised systemd` en `/etc/redis/redis.conf`

###### Reiniciar Redis
```
sudo systemctl restart redis-server
sudo systemctl enable --now redis-server
sudo systemctl status redis-server
sudo systemctl status redis-server
sudo systemctl unmask redis-server.service
sudo systemctl restart redis-server
sudo systemctl status redis-server
```
##### 9. Instalación de PGAdmin4

Guías:
  - https://computingforgeeks.com/how-to-install-pgadmin-4-on-ubuntu/
  - https://stackoverflow.com/questions/58239607/pgadmin-package-pgadmin4-has-no-installation-candidate

Comandos de instalación:
```
curl https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo apt-key add

sudo sh -c 'echo "deb https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list && apt update'

sudo apt -y install pgadmin4

Para configurar el servidor web: sudo /usr/pgadmin4/bin/setup-web.sh
```

##### 10. Instalación de Yarn y Pm2

Instalación de Yarn:
```
sudo apt remove -y cmdtest
sudo apt remove -y yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update -y
sudo apt-get install yarn -y
```
Instalación de Pm2:
```
yarn global add pm2
pm2 startup
```

------------
##### 11. Configuración e Instalación de Atomic Filler y API:

Ahora que hemos terminado la configuración de las dependencias, procedamos a iniciar la instalación real del software Atomic API.

Ahora tenemos dos opciones:
1. Instalar y sincronizar todo desde cero.
2. Usar instantáneas PG existentes para sincronizar los datos y luego iniciar las instancias de Atomic Filler y API.

Nota: Si estás utilizando instantáneas PG de un proveedor de servicios de instantáneas, descarga y extrae las instantáneas

###### Configuración:

Clona el código más reciente e instala Atomic Filler y API:

```
git clone https://github.com/pinknetworkx/eosio-contract-api.git
cd eosio-contract-api
yarn install
```
Una vez instalado, tenemos que configurar las conexiones y la configuración de la cadena.

Sigue la guía [aquí](https://github.com/pinknetworkx/eosio-contract-api/blob/master/README.md  "aquí") para configurar los archivos de configuración. o encuentra los ejemplos a continuación:

La carpeta de configuración contiene 3 archivos de configuración diferentes

#### connections.config.json
Este archivo contiene datos de conexión de Postgres / Redis / Nodeos para la cadena utilizada.

Notas
* Redis: Puede ser utilizado para múltiples cadenas sin más acción
* PostgreSQL: Cada cadena necesita su propia base de datos postgres (puede usar la misma instancia de postgres), pero múltiples lectores de la misma
cadena pueden usar la misma base de datos si no están en conflicto
* Nodeos: nodeos debe tener un historial de estado completo para el rango que estás intentando indexar

```json
{
  "postgres": {
    "host": "127.0.0.1",
    "port": 5432,
    "user": "username",
    "password": "cambiar",
    "database": "api-wax-mainnet-atomic-1"
  },
  "redis": {
    "host": "127.0.0.1",
    "port": 6379
  },
  "chain": {
    "name": "wax-mainnet",
    "chain_id": "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4",
    "http": "http://127.0.0.1:8888",
    "ship": "ws://127.0.0.1:8080"
  }
}
```

#### readers.config.json
Este archivo se utiliza para configurar el relleno

Para atomicassets / atomicmarket debes especificar los siguientes bloques de inicio
* `wax-mainnet`: `64000000`
* `wax-testnet`: `35795000` (Aquí necesitas usarlo, de lo contrario, se romperá)

```json5
[
  // Se pueden definir múltiples Lectores y cada uno se ejecutará en un hilo separado
  {
    "name": "atomic-1", // Nombre del lector. Debe ser único por cadena y no debe cambiar después de que se haya iniciado

    "start_block": 0, // comenzar en un bloque específico. Si ya se inició el listo, esto solo puede ser más alto que el último bloque indexado
    "stop_block": 0, // detenerse en un bloque específico
    "irreversible_only": false, // Si necesitas datos para muchos contratos y no necesitas datos en vivo, esta opción es más rápida

    "ship_prefetch_blocks": 50, // Cuántos bloques no confirmados enviará ship
    "ship_min_block_confirmation": 30, // Después de cuántos bloques el lector confirmará los bloques
    "ship_ds_queue_size": 20, // cuántos bloques debe pre serializar el lector los datos de acción / tabla
      
    "ds_ship_threads": 4, // Cuántos hilos se deben usar para deserializar rastros y deltas de tabla

    "db_group_blocks": 10, // En modo de captura, el lector agrupará esta cantidad de bl

    "contracts": [
      // Manejador de AtomicAssets que proporciona datos para el estándar NFT de AtomicAssets
      {
        "handler": "atomicassets",
        "args": {
          "atomicassets_account": "atomicassets", // Cuenta donde se despliega el contrato
          "store_logs": true, // almacenar registros
          "store_transfers": true // almacenar el historial de transferencias
        }
      }
    ]
  }
]
```

#### server.config.json

```json5
{
  "provider_name": "pink.network", // Proveedor que se muestra en la documentación del endpoint
  "provider_url": "https://pink.network",

  "server_addr": "0.0.0.0", // Dirección del servidor a la que enlazar
  "server_name": "wax.api.atomicassets.io", // Nombre del servidor que se muestra en la documentación
  "server_port": 9000, // Puerto del servidor

  "cache_life": 2, // Los endpoints GET se almacenan en caché durante esta cantidad de tiempo (en segundos)
  "trust_proxy": true, // Habilitar si usas un proxy inverso para tener una limitación de tasa correcta por ip

  "rate_limit": {
    "interval": 60, // Intervalo para restablecer el contador (en segundos)
    "requests": 240 // Cuántas solicitudes se pueden hacer en el intervalo definido
  },
    
  "ip_whitelist": [], // Estas IPs no tienen limitación de tasa o reciben solicitudes en caché
  "slow_query_threshold": 7500, // Si consultas específicas tardan más que este umbral, se crea una advertencia

  "max_query_time_ms": 10000, // tiempo máximo de ejecución para una consulta de base de datos
  "max_db_connections": 50, // número máximo de conexiones de db concurrentes / consultas de db
        
  "namespaces": [
    // namespace de atomicassets que proporciona una API para funcionalidades básicas
    {
      "name": "atomicassets", 
      "path": "/atomicassets", // Cada endpoint de API comenzará con este camino
      "args": {
        "atomicassets_account": "atomicassets" // Cuenta donde se despliega el contrato
      }
    }
  ]
}

```

###### Ejecutando Hyperion:
Este proyecto consta de dos procesos separados que necesitan ser iniciados y detenidos de manera independiente:
* La API, que proporcionará los puntos finales de socket y REST (o lo que se utilice)
* El rellenador (filler), que leerá los datos de la cadena de bloques y llenará la base de datos

El rellenador necesita ser iniciado antes que la API cuando se ejecute por primera vez:

Prerrequisitos:
- PostgreSQL
  - Crear una base de datos y un usuario que tenga permiso para leer y escribir en esa base de datos
    
- Nodo de archivo WAX
  - Plugin de Historial de Estado habilitado con las opciones `trace-history = true`, `chain-state-history = true`
  - Completamente sincronizado para el rango de bloques que quieras procesar
  - Socket abierto y API http

- Copiar y modificar los ejemplos de configuración con los parámetros de conexión correctos

Hay dos formas sugeridas para ejecutar el proyecto: Docker si quieres contenerizar la aplicación o PM2 si quieres ejecutarla a nivel de sistema

### Docker

1. `git clone && cd eosio-contract-api`
2. Se proporciona un ejemplo de archivo docker-compose
3. `docker-compose up -d`

Inicio
* `docker-compose start eosio-contract-api-filler`
* `docker-compose start eosio-contract-api-server`

Detener
* `docker-compose stop eosio-contract-api-filler`
* `docker-compose stop eosio-contract-api-server`

### PM2

1. `git clone && cd eosio-contract-api`
2. `yarn install`
3. `yarn global add pm2`

Inicio
* `pm2 start ecosystems.config.json --only eosio-contract-api-filler`
* `pm2 start ecosystems.config.json --only eosio-contract-api-server`

Detener
* `pm2 stop eosio-contract-api-filler`
* `pm2 stop eosio-contract-api-server`

**Nota:** Si tienes más preguntas, por favor escribe aquí: https://t.me/waxinfra

------------

## Conviene Saber: Contratos Actualmente Soportados

### Lectores (usados para llenar la base de datos)

Los lectores se utilizan para llenar la base de datos de un contrato específico.

#### atomicassets

```json5
{
  "handler": "atomicassets",
  "args": {
    "atomicassets_account": "atomicassets", // cuenta donde se ha desplegado el contrato de atomicassets
    "store_transfers": true, // guardar el historial de transferencias  
    "store_logs": true // guardar los registros de la estructura de datos
  }
}
```

#### atomicmarket
Este lector requiere un lector de atomicassets y un lector de delphioracle con el mismo contrato especificado aquí

```json5
{
  "handler": "atomicmarket",
  "args": {
    "atomicassets_account": "atomicassets", // cuenta donde se ha desplegado el contrato de atomicassets
    "atomicmarket_account": "atomicmarket", // cuenta donde se ha desplegado el contrato de atomicmarket
    "store_logs": true // Guardar los registros de ventas / subastas
  }
}
```

#### delphioracle

```json5
{
  "handler": "delphioracle",
  "args": {
    "delphioracle_account": "delphioracle" // cuenta donde se ha desplegado el contrato de delphioracle
  }
}
```

### Namespace (puntos finales de la API)

Un namespace proporciona una API para un contrato específico o caso de uso y se basa en los datos que un lector proporciona

#### atomicassets

```json5
{
  "handler": "atomicassets",
  "args": {
    "atomicassets_account": "atomicassets", // cuenta donde se ha desplegado el contrato de atomicassets
    "connected_reader": "atomic-1" // lector al cual se conecta la API para datos en vivo
  }
}
```

#### atomicmarket

```json5
{
  "handler": "atomicmarket",
  "args": {
    "atomicmarket_account": "atomicmarket", // cuenta donde se ha desplegado el contrato de atomicmarket
    "connected_reader": "atomic-1" // lector al cual se conecta la API para datos en vivo
  }
}
```