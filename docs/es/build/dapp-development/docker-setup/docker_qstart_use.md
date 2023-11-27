---
title: Ejecutar Comandos
order: 23
---

# Ejecutar Comandos

Una vez que tu sesión de bash **waxdev** haya comenzado, puedes usar comandos comunes para interactuar con tu contenedor. Por ejemplo, para listar los contenidos de tu contenedor, usa el comando `ls`.

```shell
ls
```

La consola imprimirá:

```shell
bin  boot  dev  etc  home  lib  lib32  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var  wax
```

La lista anterior incluye el directorio **wax** que compartiste cuando iniciaste tu contenedor **waxdev**. Puedes usar `cd` para entrar en este directorio cuando estés listo para [Crear un Contrato Inteligente](/es/build/dapp-development/smart-contract-quickstart/dapp_hello_world).

:::tip
Compartir la carpeta de tu host local con tu contenedor Docker waxdev te permite crear directorios que existen tanto en tu host como en el contenedor Docker. Esto facilita la construcción y despliegue de tus contratos inteligentes usando Docker.
:::

## Usa Nuestras Guías

A lo largo de nuestra sección de Desarrollo de dApps, enumeraremos varios pasos requeridos para ejecutar comandos de blockchain y construir tus contratos inteligentes. Por ejemplo:

1. Desde la línea de comandos, utiliza el comando `cleos` para obtener información de blockchain del mainnet de WAX.

```shell
cleos -u https://wax-api-url get info
```
*Consulta https://validate.eosnation.io/wax/reports/endpoints.html para obtener una URL de punto final de API actualizada*

Cuando inicies una sesión interactiva de bash, la *línea de comandos* es tu indicador de bash del contenedor Docker:

![Docker Root](/assets/images/dapp-development/docker-setup/docker_root.jpg)

Cuando presiones `Enter` para ejecutar el comando, la consola imprimirá una respuesta JSON directamente en tu contenedor Docker:

![Docker Results](/assets/images/dapp-development/docker-setup/docker_results.jpg)
