---
title: Gestionar los contenedores
nav_order: 24
layout: default
parent: Configuración de Docker
grand_parent: Desarrollo de dApps
lang-ref: Manage Containers
lang: es
---

Para salir de la sesión interactiva de bash (sin detener tu contenedor), presiona `ctrl-p` + `ctrl-q` para enviar una secuencia de escape. La consola mostrará:

```shell
read escape sequence
```

El comando anterior te devuelve al prompt de comandos de tu host. Puedes verificar que tu contenedor sigue funcionando utilizando el comando `docker ps`:

```shell
docker ps
```

Para volver a acceder a tu sesión de bash, utiliza el comando `docker attach`.

```shell
docker attach waxdev
```

Para detener el contenedor, utiliza el comando `docker stop`.

```shell
docker stop waxdev
```

Para reiniciar tu contenedor, utiliza el comando `docker start`.

```shell
docker start waxdev
```

Ahora que has configurado tu entorno de Docker, estás listo para seguir el resto de guías de esta sección. Aunque no es necesario completar la [Configuración de la Blockchain de WAX](/docs\dapp-development\wax-blockchain-setup) en el siguiente tutorial, recomendamos descargar el código fuente para acceder a las muestras de códigos y a los scripts **make**.




