---
title: Ejecutar Contenedor de WAX
nav_order: 22
layout: default
parent: Docker Setup
grand_parent: dApp Development
lang-ref: Run a WAX Container
lang: es
---

Para ejecutar la imagen Docker **waxteam/dev**:

1. Instala <a href="https://www.docker.com/get-started" target="_blank">Docker</a> (si aún no lo has hecho). 

    <strong>Usuarios de Linux:</strong> Se recomienda configurar Docker para que se ejecute sin sudo y así poder utilizar todos nuestros scripts <strong>make</strong> habilitados para Docker. Para más información, dirígete a <a href="https://docs.docker.com/install/linux/linux-postinstall/" target="_blank">Pasos posteriores a la instalación de Linux</a>.{: .label .label-yellow }

2. Crea un nuevo directorio llamado **wax**. Puedes usar esta carpeta para almacenar el código fuente de la Blockchain, muestras y tu directorio de contratos inteligentes. 

3. Desde la línea de comandos, inicia tus contenedores WAX en modo interactivo y comparte el directorio **wax** de tu host. Este comando abre una sesión bash dentro del contenedor.

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

    La consola mostrará algo similar a esto:

    ```shell
    root@b6e444e3cc33:/#
    ```

Ahora deberías tener un contenedor en funcionamiento con una sesión de bash activa. Puedes utilizar esta sesión de bash para seguir nuestras guías y tutoriales de inicio rápido.



