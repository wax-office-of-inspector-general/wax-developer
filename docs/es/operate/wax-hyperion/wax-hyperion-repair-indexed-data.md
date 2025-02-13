---
título: Reparar Datos Indexados de WAX Hyperion
---

Cuando está correctamente configurado y operado, el historial completo de WAX Hyperion es una solución sólida para el historial de blockchains Antelope. Sin embargo, puede existir una condición en la que los bloques estén indexados pero falten datos transaccionales o incluso algunos bloques puedan estar completamente ausentes.

Los bloques perdidos pueden identificarse fácilmente a través de la API y suelen ocurrir debido a una variedad de situaciones, principalmente por iniciar y detener incorrectamente el indizador de Hyperion. La condición de datos transaccionales perdidos es un poco más oculta, ya que los bloques parecen estar indexados, aunque se ha observado principalmente con software antiguo del nodo WAX Antelope, especialmente debido a eventos de bifurcación de red y problemas con el complemento state-history.

Proporcionar un servicio de Historial Completo de WAX sin estar 100% seguro de que todo el historial ha sido capturado de manera precisa obviamente es un problema. Afortunadamente, el equipo de Hyperion en EOS RIO ha abordado esto con el lanzamiento de la [**Herramienta de Reparación de Índices de Hyperion**](https://hyperion.docs.eosrio.io/providers/repair/).

Este artículo de la serie cubrirá el proceso de uso de la herramienta de reparación de índices Hyperion en una implementación en ejecución o desde un indizador Hyperion independiente.

EOS RIO tiene un excelente [Repositorio de Documentación de Hyperion](https://hyperion.docs.eosrio.io/) que incluye detalles sobre cómo ejecutar su producto Hyperion Full History, sin embargo, este artículo ampliará su documentación actual.

Una vez más, esta serie de Tutoriales Técnicos cubrirá parte del mismo contenido de EOS RIO y añadirá matices operativos desde un punto de vista práctico y basado en nuestra experiencia.

[Conoce más sobre EOS RIO Hyperion](https://eosrio.io/hyperion/)

![](https://miro.medium.com/v2/resize:fit:598/0*GqDtvMh8QunDs6Mc.png)

_Este artículo ha sido actualizado para reflejar la implementación actual de Hyperion en diciembre de 2024._

# Reparar Datos Indexados de WAX Hyperion

La Herramienta de Reparación de Índices Hyperion ha sido incluida en el paquete de construcción de Hyperion desde la versión `v3.3.9–5`. Esta versión debe construirse para acceder a la funcionalidad de reparación. La herramienta de reparación, sin embargo, puede utilizarse en un clúster desde la versión `v3.3.5` y superiores utilizando un indizador independiente con el software más reciente.

En esta guía, se cubrirá el proceso de ejecutar la herramienta de reparación en una implementación operativa de Hyperion, así como cómo ejecutarla en un indizador independiente apuntando a la implementación operativa de Hyperion.

## Configuración de la Herramienta de Reparación

Asegúrate de haber actualizado o desplegado Hyperion `v3.3.9–5` o superior. Por favor, consulta nuestras guías previas sobre la construcción del software WAX Hyperion.

La herramienta `hyp-repair` se encuentra en el directorio `/hyperion-history-api`.

La herramienta utiliza tu configuración existente `connections.json` y requiere que el campo `control_port` esté configurado; el puerto predeterminado es el 7002, como se muestra en el ejemplo a continuación:

```
"chains": {  
    "wax": {  
      "name": "WAX Mainnet",  
      "chain_id": "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4",  
      "http": "https://wax.eosphere.io:443",  
      "ship": "wss://wax-ship.eosphere.io:443",  
      "WS_ROUTER_PORT": 7001,  
      "WS_ROUTER_HOST": "127.0.0.1",  
      "control_port": 7002
```

Además, como se mencionó antes, es posible ejecutar la herramienta de reparación desde un indizador independiente si, por ejemplo, observas un impacto operativo o tienes una implementación operativa v3.3.5 o superior que no deseas actualizar ahora. Para hacerlo, es necesario construir y configurar un nuevo indizador Hyperion v3.3.9–5 que apunte al clúster Elasticsearch existente. Luego, se ejecuta este indizador para permitir acceso al puerto de control :7002 sin realizar indexación en vivo. Configura `wax.config.json` como sigue:

```
"indexer": {  
  
    "start_on": 0,  
    "stop_on": 0,  
  
    "live_reader": false,  
   
    "disable_reading": true,
```

Básicamente, este indizador se convierte en una puerta de enlace de lectura y escritura hacia los índices Elasticsearch para que la herramienta de reparación pueda realizar su trabajo.

## Probar la Configuración
Antes de ejecutar la reparación, verifica que la herramienta tenga acceso al Indizador Hyperion:

```
> ./hyp-repair connect --host "ws://127.0.0.1:7002"  
  
✅  Indizador Hyperion en línea - ws://127.0.0.1:7002
```

## Ejecutar un Escaneo

Ejecutar un escaneo comprueba todos los bloques indexados en busca de enlaces rotos en la cadena. Si falta un bloque o si el ID anterior de un bloque no coincide con el ID del bloque anterior, la herramienta verificará `v1/chain/get_block` para confirmar si la versión indexada en Hyperion necesita ser reescrita.

Existen varias formas de ejecutar el escaneo, como se muestra a continuación:

```
# Escanear todos los bloques  
> ./hyp-repair scan wax  

# Escanear un rango  
> ./hyp-repair scan wax --first 2 --last 10000000  

# Escanear especificando una ruta de salida  
> ./hyp-repair scan wax -o ./xyz
```

Si no se especifica un rango, el escaneo comenzará en reversa, desde el último bloque indexado hasta el primer bloque indexado en Elasticsearch.

Si no se especifica una ruta de salida, la salida del escaneo se guarda en la carpeta `~/hyperion-history-api/.repair`.

## Verificar el Escaneo

Si se encuentran bloques perdidos o bifurcados, se creará un archivo que liste las discrepancias. Revisa lo encontrado según lo siguiente:

```
> ./hyp-repair view .repair/wax-4-250012558-bloques-bifurcados.json  
> ./hyp-repair view .repair/wax-4-250000861-bloques-perdidos.json
```

Por supuesto, es posible que no tengas problemas y en ese caso no se creará ningún archivo.

## Iniciar la Reparación

Ahora que se sabe que hay datos perdidos, se puede ejecutar una reparación.

Si se creó un archivo de bloques bifurcados, ejecuta la herramienta de la siguiente manera:

```
# Ejecución simulada para probar la reparación propuesta  
> ./hyp-repair repair wax .repair/wax-4-250012558-bloques-bifurcados.json --dry  
  
# Reparación real si la simulación parece correcta  
> ./hyp-repair repair wax .repair/wax-4-250012558-bloques-bifurcados.json
```

La reparación de índice eliminará estos bloques bifurcados y solicitará al indizador que complete específicamente estos bloques ahora perdidos nuevamente.

![](https://miro.medium.com/v2/resize:fit:700/1*JwZKKfU66UqSRcnY-NWY4Q.png)

Si se creó un archivo de bloques perdidos, ejecuta la herramienta de la siguiente manera:

```
> ./hyp-repair fill-missing wax .repair/wax-4-250000861-bloques-perdidos.json
```

Es una buena idea volver a ejecutar el escaneo para asegurarte de que se han corregido con éxito cualquier condición indeseable de datos perdidos y la herramienta de reparación de índices haya funcionado correctamente.

---
Estas **Guías Técnicas para Desarrolladores de WAX** se crean utilizando material fuente de la [Serie Técnica Cómo Hacerlo de WAX de EOSphere](https://medium.com/eosphere/wax-technical-how-to/home)

No dudes en hacer cualquier pregunta en el [Telegram de EOSphere](https://t.me/eosphere_io)