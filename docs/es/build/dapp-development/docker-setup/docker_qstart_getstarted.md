---
title: Ejecutar un Contenedor WAX
order: 22
---

# Ejecutar un Contenedor WAX

Para ejecutar la imagen Docker **waxteam/dev**:

1. Instala <a href="https://www.docker.com/get-started" target="_blank">Docker</a> (si aún no lo has hecho).

:::tip
<strong>Usuarios de Linux:</strong> Se recomienda configurar Docker para ejecutar sin sudo para utilizar todos nuestros scripts de <strong>make</strong> habilitados para Docker. Consulta los <a href="https://docs.docker.com/install/linux/linux-postinstall/" target="_blank">pasos posteriores a la instalación para Linux</a> para más información.
:::

2. Crea un nuevo directorio llamado **wax**. Puedes utilizar esta carpeta para almacenar el código fuente de la Blockchain de WAX, ejemplos y tu directorio de contratos inteligentes de WAX. Este directorio se compartirá entre tu sistema operativo y el contenedor Docker. Podrás editar tu código fuente con tu IDE favorito en cualquiera de los dos entornos.

3. Desde la línea de comandos, inicia tus contenedores WAX en modo interactivo y comparte el directorio **wax** de tu host. Este comando inicia una sesión de bash dentro del contenedor.

    **Linux**

    ```shell
    docker run -it --name waxdev -v /c/wax:/wax waxteam/dev bash
    ```

    ```shell
    docker run -it --name waxcdt -v /c/wax:/wax waxteam/cdt bash
    ```

    **Windows 10**

    ```shell
    docker run -it --name waxdev -v c:\wax:/wax waxteam/dev bash
    ```

    ```shell
    docker run -it --name waxcdt -v c:\wax:/wax waxteam/cdt bash
    ```

    La consola imprimirá algo similar a:

    ```shell
    root@b6e444e3cc33:/#
    ```

Ahora deberías tener un contenedor en ejecución con una sesión de bash activa. Puedes utilizar esta sesión de bash para seguir nuestras guías de inicio rápido y tutoriales.
