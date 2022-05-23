---
title: Consolida la instalación
nav_order: 32
layout: default
parent: WAX Blockchain Setup
grand_parent: dApp Development
lang-ref: Verify Your Installation
lang: es
---

Para verificar la instalación, puedes usar **cleos** para llamar al endpoint `get info` en la API de la blockchain de WAX. 
<p>&nbsp;</p>

Introduce lo siguiente en la línea de comandos:

```shell
cleos -u https://wax-api-url get info
```
*Haz clic en https://validate.eosnation.io/wax/reports/endpoints.html para obtener una URL actualizada del endpoint de la API.*
<p>&nbsp;</p>

Si las [herramientas de la Blockchain](/en/tools/blockchain_tools) se instalaron correctamente, este endpoint nos devolverá los detalles de esta, incluyendo el `chain_id`, el productor de bloques y la altura del bloque más reciente.

![](/assets/img/dapp-development/docker-setup/docker_results.jpg){:class="img-responsive"}

<!-- 
```json
{
  "server_version": "e5e98906",
  "chain_id": "1064487b3cd1a897xx99xx9xx9x999999999e2e152090f99c1d19d44e01aea5a4",
  "head_block_num": 2900516,
  "last_irreversible_block_num": 2900186,
  "last_irreversible_block_id": "002c40da7e2ab89cb4aeecc4184bcae11afc5988cbc1ca9854a6345e00dbb378",
  "head_block_id": "002c42243899fe4bbe3907f5675b7254519d28bd901d9fe5682be7ebc047d6b8",
  "head_block_time": "2019-07-11T16:04:44.500",
  "head_block_producer": "strongblock1",
  "virtual_block_cpu_limit": 500000000,
  "virtual_block_net_limit": 1048576000,
  "block_cpu_limit": 500000,
  "block_net_limit": 1048576,
  "server_version_string": "wax-1.6.1-1.0.0"
}
```
 -->



