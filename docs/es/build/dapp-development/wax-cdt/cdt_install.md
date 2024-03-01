---
title: Instalar WAX-CDT
order: 51
---

# Instalar WAX-CDT

El Repositorio WAX-CDT en GitHub se descarga en el directorio **wax-cdt**. El proceso de descarga y construcción puede tardar desde varios minutos hasta varias horas, dependiendo de tu conexión a Internet, sistema operativo y especificaciones de hardware.

Para descargar el Repositorio de Código Fuente de WAX-CDT, pega lo siguiente en la línea de comandos:

```
git clone --recursive https://github.com/worldwide-asset-exchange/wax-cdt.git
```

## Construir WAX-CDT

Si estás utilizando nuestras imágenes Docker, **no** necesitas completar estos pasos.

Para construir WAX-CDT desde el código fuente, puedes usar los siguientes pasos. Si tienes una versión anterior instalada, primero tendrás que desinstalarla. Consulta [Desinstalar WAX-CDT](/es/build/dapp-development/wax-cdt/cdt_uninstall) para más información.

:::warning
Importante: La construcción desde el código fuente no está soportada. Si encuentras un problema con la construcción, puedes usar nuestras [Imágenes Docker](/es/build/dapp-development/docker-setup/) en su lugar (recomendado).
:::

1. Cambia tu directorio a **wax-cdt**.

```
cd wax-cdt
```

2. Ejecuta el script de construcción.

```
./build.sh
```

3. Ejecuta el script de instalación.

```
sudo ./install.sh
```
