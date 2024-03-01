---
title: Optimización del Uso de RAM y Disco
---

# Optimización del Uso de RAM y Disco

Ejecutar el software de WAX puede ser muy exigente en recursos informáticos, especialmente en la extremadamente ocupada WAX Mainnet. Además del requisito de una CPU rápida, el software de WAX ejecuta toda la red en la memoria residente y mapea esta memoria a un archivo mapeado en memoria delgado llamado base de datos de estado, lo que significa que también se deben cumplir algunos exigentes requisitos de RAM y E/S de disco.

Esta guía trabajará a través de un ejemplo de cómo manejar los requisitos de RAM y disco de manera efectiva y económica.

> Este artículo ha sido actualizado para incorporar el_ [_proceso de construcción de software Leap_](https://antelope.io/).

## Optimización del Uso de RAM y Disco

Este artículo abordará dos desafíos: gestionar el uso de RAM y manejar la cantidad de E/S de disco. La RAM es costosa y a menudo limitada en una plataforma de hardware específica, y los discos de estado sólido tienen una vida útil limitada basada en la cantidad de escrituras que ocurren (Endurance SSD).

En el momento de la escritura (27 de diciembre de 2022), la utilización de memoria del nodo de WAX Mainnet es de **85.6 GB** y fluctúa minuto a minuto.

Actualmente existen dos mecanismos efectivos para gestionar la RAM y la E/S de disco. El primero es usar el modo `heap` del software de WAX, que precarga la base de datos de estado en la RAM al iniciar el nodo. El segundo, y a través del cual este ejemplo del artículo pasará, es utilizar el mecanismo **tmpfs** del Kernel de Linux y una gran cantidad de **swap** en disco.

_tmpfs es un sistema de archivos de Linux que mantiene todos sus archivos en memoria virtual, el contenido de esta carpeta es temporal, lo que significa que si esta carpeta se desmonta o se reinicia el servidor, todos los contenidos se perderán._

Se ha descubierto a través de pruebas realizadas por la comunidad (Aaron Cox y Stan cc32d9) que gran parte de los datos de la memoria residente no se accede con mucha frecuencia y pueden ser intercambiados a disco. Este entendimiento significa que podemos ser mucho más eficientes en nuestra utilización de RAM y en las demandas de E/S de disco.

## Resumen de la estrategia de memoria tmpfs

Esta estrategia está funcionando actualmente para EOSphere en nuestro entorno de producción, incluso en nodos que tienen suficiente RAM. Compensar las escrituras constantes en disco parece estar salvando nuestros SSD. En el momento de escribir este artículo, un nodo de producción puede ejecutarse de manera efectiva configurado de esta manera con solo 64 GB de RAM.

En resumen, este ejemplo hará lo siguiente:

1. Montar una carpeta tmpfs
2. Crear un archivo de intercambio grande
3. Configurar nodeos para usar la carpeta tmpfs para el estado
4. Iniciar nodeos desde una instantánea

## tmpfs

Este ejemplo tendrá una Base de Datos de Estado de 128 GB que se colocará en la carpeta tmpfs, la cual será de 129 GB para asegurarse de que sea lo suficientemente grande.

Configure `fstab` como se muestra a continuación:

```bash
> sudo nano /etc/fstab
tmpfs   /home/eosphere/waxdata/state  tmpfs rw,nodev,nosuid,size=129G,x-systemd.after=zfs-mount.service 0

> sudo mount -a

**verificar que esté montado**
> df -h
```

## swap

Linux swap se puede configurar en su propia partición o como un archivo. Según nuestra experiencia utilizando SSD (discos no de husillo), no ha habido ningún problema utilizando un archivo y nos da la capacidad de ajustar fácilmente el tamaño del intercambio.

El intercambio se configurará como 128 GB de la siguiente manera:

```bash
***Desactivar el intercambio existente, que probablemente sería una partición***
> sudo swapoff -a

> sudo fallocate -l 128G /swap.img

> sudo chmod 600 /swap.img

> sudo mkswap /swap.img

> sudo swapon /swap.img

***Configurar fstab y comentar la antigua declaración de intercambio***
> sudo nano /etc/fstab
/swap.img   none    swap    sw    0   0
```

## nodeos y inicio de instantánea

Asegúrese de que la base de datos de estado sea al menos de 128 GB por ahora; esto deberá ser monitoreado ya que la memoria disponible en la red está en constante expansión.

Configure de la siguiente manera:

```bash
***Configurar Tamaño de la Base de Datos de Estado***  
> cd ~/waxdata  

> nano config.ini
chain-state-db-size-mb = 131072
```

Inicie `nodeos` desde una [instantánea](https://medium.com/eosphere/wax-technical-how-to-2-db45a339e735) disponible [aquí](https://snapshots.eosphere.io/), ya que la tmpfs montada es donde `nodeos` espera que se encuentre la carpeta de estado, el estado se construirá en memoria virtual.

Comience como se muestra a continuación:

```bash
> cd ~/wax-leap/build/programs/nodeos

> ./nodeos --data-dir ~/waxdata --config-dir ~/waxdata --snapshot ~/waxdata/snapshots/snapshot.bin
```

El inicio tomará más tiempo de lo habitual, ya que se crea un nuevo archivo de estado a partir de la instantánea, y aún más tiempo si la RAM física de los nodos se agota y se utiliza el intercambio. En el caso de 64 GB de RAM, esto tomó aproximadamente 45 minutos.

Los reinicios subsiguientes de nodeos no requerirán una instantánea para comenzar a menos que su nodo se reinicie o la tmpfs se desmonte.

Por supuesto, como ya se mencionó, los requisitos de memoria de WAX Mainnet están en constante expansión, por lo que se necesitará un monitoreo regular del uso y el rendimiento para guiar sus requisitos de hardware y configuración.

---

Estas **Guías Técnicas para Desarrolladores de WAX** se crean utilizando material fuente de la [Serie de Cómo Hacer Técnico de WAX de EOSphere](https://medium.com/eosphere/wax-technical-how-to/home)

Asegúrese de hacer cualquier pregunta en el [Telegram de EOSphere](https://t.me/eosphere_io)