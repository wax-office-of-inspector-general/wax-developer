---
title: Verificar Tu Instalación
order: 32
---

# Verificar Tu Instalación

Para verificar tu instalación, puedes utilizar **cleos** para llamar al punto final `get info` en la API de la Blockchain WAX. 
<p>&nbsp;</p>

Desde la línea de comandos, ingresa lo siguiente:

```shell
cleos -u https://wax-api-url get info
```
*Consulta https://validate.eosnation.io/wax/reports/endpoints.html para obtener una URL actualizada del punto final de la API*
<p>&nbsp;</p>

Si las [Herramientas de Blockchain](/es/build/tools/blockchain_tools) se instalaron correctamente, este punto final devolverá varios detalles sobre la Blockchain WAX, incluyendo el `chain_id`, el productor de bloques y la altura más reciente del bloque.

![](/assets/images/dapp-development/docker-setup/docker_results.jpg)
