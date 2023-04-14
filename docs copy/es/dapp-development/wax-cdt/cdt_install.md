---
title: Instalar WAX-CDT
layout: default
nav_order: 51
parent: WAX Contract Development Toolkit
grand_parent: dApp Development
lang-ref: Install WAX-CDT
lang: es-ES
---

El repositorio de WAX-CDT de GitHub se descarga en el directorio **wax-cdt**. El proceso de descarga y compilación puede durar desde varios minutos hasta varias horas, dependiendo de la conexión a Internet, el sistema operativo y las especificaciones del hardware.

Para descargar el repositorio de código fuente de WAX-CDT, inserta lo siguiente en la línea de comandos:

```
git clone --recursive https://github.com/worldwide-asset-exchange/wax-cdt.git
```

## Crea el WAX-CDT

Si estás utilizando nuestras imágenes Docker, no es necesario que completes estos pasos.

Para construir WAX-CDT desde el código fuente, puedes seguir los siguientes pasos. Si tienes instalada una versión previa, necesitarás desinstalarla primero. Puedes consultar cómo [desinstalar WAX-CDT](/es/tutorials/cdt_uninstall) si es necesario.

<strong>Importante:</strong> No se admite la construcción desde el código fuente. Si te surge algún problema, en su lugar puedes usar nuestras [imágenes Docker](/es/dapp-development/docker-setup/) (recomendado).
{: .label .label-yellow }

1. Cambia tu directorio a **wax-cdt**.

```
cd wax-cdt
```

2. Ejecuta el script build.

```
./build.sh
```

3. Ejecuta el script de instalación.

```
sudo ./install.sh
```
