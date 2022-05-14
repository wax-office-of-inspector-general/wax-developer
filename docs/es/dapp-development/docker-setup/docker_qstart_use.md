---
title: Ejecutar los comandos
nav_order: 23
layout: default
parent: Configuración de Docker
grand_parent: Desarrollo de dApps
lang-ref: Run Commands
lang: es
---

Una vez que tu sesión bash de **waxdev** se inicia, puedes usar comandos comunes para interactuar con tu contenedor. Por ejemplo, para listar el contenido de tu contenedor, utiliza el comando `ls`.

```shell
ls
```

La consola mostrará:

```shell
bin  boot  dev  etc  home  lib  lib32  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var  wax
```

La lista anterior incluye el directorio **wax** que compartiste cuando iniciaste tu contenedor **waxdev**. Puedes escribir `cd` en este directorio cuando estés listo para [Crear tu contrato inteligente](/es/dapp-development/smart-contract-quickstart/dapp_hello_world).

<strong>Consejo:</strong> Compartir la carpeta de tu host local con tu contenedor Docker waxdev te permite crear directorios que existen tanto en tu host como en el contenedor Docker. Esto facilita la construcción y el despliegue de tus contratos inteligentes usando Docker.
{: .label .label-yellow }

## Usa nuestras guías

A lo largo de nuestra sección de desarrollo de dApps, enumeraremos varios pasos necesarios para ejecutar comandos de blockchain y construir tus contratos inteligentes. Por ejemplo:

1. En la línea de comandos, introduce el comando `cleos` para obtener información sobre la blockchain de la mainnet de WAX.

```shell
cleos -u https://wax-api-url get info
```
*Consulta https://validate.eosnation.io/wax/reports/endpoints.html para obtener un listado actualizado de APIs disponibles*
<p>&nbsp;</p>

Cuando inicias una sesión interactiva de bash, la *línea de comandos* es el prompt de bash de tu contenedor Docker:

![](/assets/img/docker_root.jpg){:class="img-responsive"}

Al pulsar `Enter` para ejecutar el comando, la consola imprime una respuesta JSON directamente en tu contenedor Docker:

![](/assets/img/docker_results.jpg){:class="img-responsive"}

<!--You can use your interactive bash terminal to follow along in all of our guides and tutorials.-->

<!--```json
{
  "server_version": "7328c2db",
  "chain_id": "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4",
  "head_block_num": 20878276,
  "last_irreversible_block_num": 20877948,
  "last_irreversible_block_id": "013e927c4b6173b638f988024af4952fa7bef2e06e356b3c1a6ef0bc9e34ce89",
  "head_block_id": "013e93c480c99a55ecc17b9afb48eae8f9980b01f5779462b1cd0b2551719578",
  "head_block_time": "2019-10-23T19:40:01.500",
  "head_block_producer": "strongblock1",
  "virtual_block_cpu_limit": 500000000,
  "virtual_block_net_limit": 1048576000,
  "block_cpu_limit": 500000,
  "block_net_limit": 1048576,
  "server_version_string": "wax-1.8.4-1.0.0",
  "fork_db_head_block_num": 20878276,
  "fork_db_head_block_id": "013e93c480c99a55ecc17b9afb48eae8f9980b01f5779462b1cd0b2551719578"
}
    ```-->
