---
title: Crear un NFT de WAX
order: 89
---

# Crear un NFT de WAX

En este ejemplo, escribiremos un contrato inteligente que crea un NFT de Pegatina de WAX utilizando el contrato inteligente **simpleassets**.

**Pegatina NFT de WAX (Ejemplo)**

![Pegatina NFT de WAX](/assets/images/logo.png)

## Configuración Inicial

1. Utiliza nuestro [Inicio Rápido con Docker](/build/dapp-development/docker-setup/) para comenzar una nueva sesión interactiva de bash. Desde la línea de comandos, navega al directorio **wax** (o el directorio local que compartiste con tu contenedor Docker).

   ```shell
   cd wax
   ```

2. Si aún no lo has hecho, crea un directorio para contratos inteligentes. Para este tutorial, usaremos una carpeta llamada **mycontracts**.

   ```shell
   mkdir mycontracts
   ```

   Navega a este nuevo directorio:

   ```shell
   cd mycontracts
   ```

3. Desde la línea de comandos, crea una carpeta llamada **waxnft** y navega a este nuevo directorio.

   ```shell
   mkdir waxnft && cd waxnft
   ```

## Crear y Compilar Tu Contrato Inteligente NFT

1. En la carpeta **waxnft**, crea un archivo llamado **waxnft.cpp** y pega el siguiente código en tu contrato inteligente NFT:

   ```
   #include <eosio/eosio.hpp>

   using namespace eosio;

   CONTRACT waxnft : public eosio::contract{
   public:
       using contract::contract;

       ACTION createnft() {

           //asignar atributos del activo
   	    name author = get_self();
   	    name category = "sticker"_n;
   	    name owner = "waxnftowner1"_n;
   	    std::string idata = R"json({"name": "Colmena de Desarrolladores de WAX", "desc" : "Pegatina de la Colmena de Desarrolladores de WAX" })json";
   	    std::string mdata = R"json({"color": "negro", "img" : "https://developer.wax.io/images/wax_sticker.png" })json";
   	    bool requireClaim = false;

           //llamar a la acción create de simpleassets
   	    action(
   		    { author, "active"_n },
   		    "simpleassets"_n,
   		    "create"_n,
   		    std::tuple(author, category, owner, idata, mdata, requireClaim)
   	    )
   	    .send();

       }
   };

   EOSIO_DISPATCH(waxnft, (createnft))
   ```

   Guarda tus cambios. Este contrato crea una Pegatina NFT de WAX con la misma cuenta de autor y propietario. Debido a que la bandera `requireClaim` está establecida en falso, tu cuenta de contrato inteligente es cargada con la RAM y el activo se asigna instantáneamente al propietario (tú).

   - **idata** incluye pares clave/valor que no pueden cambiar.
   - **mdata** incluye pares clave/valor que puedes actualizar.

2. Desde la línea de comandos, utiliza WAX-CDT para construir tu contrato inteligente NFT:

   ```shell
   eosio-cpp -abigen waxnft.cpp -o waxnft.wasm
   ```

Tu contrato inteligente NFT está ahora listo para ser desplegado en la red principal de WAX.
