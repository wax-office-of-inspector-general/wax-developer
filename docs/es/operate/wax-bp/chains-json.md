---
title: Creando el archivo chains.json
order: 141
---

# Creando el archivo chains.json

## ¿Por qué chains.json?

Dado que se necesita un [bp.json](/operate/wax-bp/bp-json) para cada cadena (esto incluye un producerjson separado para Mainnet y Testnet), existe la necesidad de listar todos los producerjson asociados con un productor de bloques y cadena. El chains.json simplemente lista y enlaza el bp.json a un chain-id.

## Creando el archivo chains.json

Simplemente comienza usando [esta](https://github.com/Blacklusion/chains.json) plantilla. Ya contiene todas las cadenas que probablemente necesitarás y más. Si no deseas usar este repositorio, alternativamente podemos sugerir usar la Información de la Red del [Validationcore](https://wax.validationcore.io/services/network-info) o [EOS Nation Validator](https://validate.eosnation.io/wax/info/).
En el siguiente paso, elimina todas las cadenas que no necesites de la plantilla. No olvides ajustar los nombres de los producerjson de las cadenas que no has eliminado. Estos deben coincidir con el .json y URL correspondientes para esa cadena. Los nombres proporcionados en el repositorio no son vinculantes, sin embargo, así es como nosotros (nombraríamos) los producerjsons.

Ejemplo de chains.json para WAX Mainnet & Testnet:
```json
{
  "chains": {
    "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4": "/wax.json",
    "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12": "/wax-testnet.json"
  }
}
```

## Encabezado Access Control Allow Origin

Ten en cuenta que tendrás que configurar correctamente el encabezado Access-Control-Allow-Origin. Puedes encontrar más información sobre este encabezado [aquí](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers).

Si estás usando Nginx, puedes lograr esto fácilmente agregando la siguiente línea a tu configuración que maneja la ruta para el chains.json.

```nginx
add_header Access-Control-Allow-Origin *;
```

```nginx
# Ejemplo de configuración
location ~ \.json {
        add_header Access-Control-Allow-Origin *;
        root /var/website/resources;
    }
```

## Enlaces útiles
- Plantilla chains.json con ChainIds: [https://github.com/Blacklusion/chains.json](https://github.com/Blacklusion/chains.json)
- Herramientas para validar tu chains.json: [Validationcore](https://wax.validationcore.io/validations) [EOS Nation Validator](https://validate.eosnation.io/wax/producers/)
- [Tutorial de bp.json](/operate/wax-bp/bp-json)