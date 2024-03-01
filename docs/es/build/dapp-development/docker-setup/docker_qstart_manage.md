---
title: Gestionar Contenedores
order: 24
---

# Gestionar Contenedores

Para salir de tu sesión interactiva de bash (sin detener tu contenedor), presiona `ctrl-p` + `ctrl-q` para enviar una secuencia de escape. La consola imprimirá:

```shell
read escape sequence
```

El comando anterior te devuelve al símbolo del sistema de tu host. Puedes verificar que tu contenedor todavía está en ejecución utilizando el comando `docker ps`:

```shell
docker ps
```

Para volver a adjuntarte a tu sesión de bash, usa el comando `docker attach`.

```shell
docker attach waxdev
```

Para detener tu contenedor, utiliza el comando `docker stop`.

```shell
docker stop waxdev
```

Para reiniciar tu contenedor, utiliza el comando `docker start`.

```shell
docker start waxdev
```

Si el comando `docker ps` no muestra tu contenedor, intenta ejecutarlo con la clave `-a`. Este comando mostrará todo, incluso los contenedores que no están en funcionamiento.

```shell
docker ps -a
```

Ahora que has configurado tu entorno Docker, estás listo para seguir las guías en esta sección. Aunque no es necesario completar la [Configuración de la Blockchain de WAX](/es/build/dapp-development/wax-blockchain-setup/) en el siguiente tutorial, todavía recomendamos descargar el código fuente para acceder a ejemplos de código y scripts de **make**.
