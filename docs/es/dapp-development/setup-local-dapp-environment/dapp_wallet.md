---
title: Crear una cartera
layout: default
nav_order: 43
parent: Set Up a Local dApp Environment
grand_parent: dApp Development
lang-ref: Create a Wallet
lang: es
---

Una cartera WAX es un repositorio cifrado y nominal de combinaciones de claves públicas y privadas que se almacenan en un archivo en su servidor local (no en la blockchain). Necesitarás crear una cartera de desarrollo para:

- Crear cuentas locales en la Blockchain de WAX
- Firmar las acciones realizadas en tu blockchain local

## Cómo funciona

Para crear una cuenta en tu blockchain local, necesitarás tener una clave pública pregenerada **owner** (obligatoria) y una clave pública **active** (opcional). Puedes utilizar tu cartera de desarrollo local para crear y almacenar estas claves. 

### Contenido predeterminado de la cartera - Combinaciones de claves públicas/privadas
```shell
[[
    "EOS4yxqE5KYv5XaB2gj6sZTUDiGzKm42KfiRPDCeXWZUsAZZVXk1F",
    "5JTZaN1zabi5wyC3LcdeZG3AzF7sLDX4JFqMDe68ThLC3Q5nYez"
  ],[
    "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
    "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"
  ]
]
```

Tu cartera utilizará estas claves para firmar las acciones de tu contrato inteligente y difundirá la firma a tu red local. Si la red confirma que la transacción es válida, se incluirá en un bloque de la cadena de bloques. 

<strong>Consejo:</strong> Las carteras no almacenan tokens, sólo la combinación de claves asociada a una cuenta de la blockchain. 
{: .label .label-yellow }

En esta guía, utilizarás **cleos** para crear, abrir y desbloquear una nueva cartera.

<strong>Nota:</strong> No es necesario ejecutar <strong>nodeos</strong> para completar estos pasos. **kleos** se iniciará automáticamente (si no se está ejecutando ya).
{: .label .label-yellow }


## Crear una cartera predeterminada

Para crear una cartera nueva, utiliza el comando `wallet create`:

```shell
cleos wallet create --to-console
```

Este comando crea una cartera llamada **default**, guardada en una ruta local (por ejemplo, "/home/nombredeusuario/eosio-wallet/default.wallet"). 

<strong>Consejo:</strong> También puedes incluir el parámetro --name para nombrar una cartera: `cleos wallet create --name mywallet --to-console`.
{: .label .label-yellow }

El parámetro `--to-console` muestra tu contraseña en la consola. Asegúrate de guardar esta contraseña en un lugar seguro (la necesitarás para desbloquear tu cartera).

```shell
warn  2019-07-16T22:39:39.847 thread-0  wallet.cpp:223                save_wallet_file     ] saving wallet to file /home/username/eosio-wallet/./default.wallet
Creating wallet: default
Save password to use in the future to unlock this wallet.
Without password imported keys will not be retrievable.
"PW5KRXKVx25yjL3FvxxY9YxYxxYY9Yxx99yyXTRH8DjppKpD9tKtVz"
```

<strong>Consejo:</strong> Para obtener una lista completa de los subcomandos y parámetros de la cartera cleos, consulta la <a href="https://developers.eos.io/manuals/eos/v2.0/cleos/command-reference/wallet/index" target="_blank">Guía de referencia Cleos</a> de EOSIO.
{: .label .label-yellow }

## Abrir y desbloquear tu cartera

Las carteras están cerradas por defecto (cuando se inicia una instancia de **keosd**). Para abrir tu cartera, utiliza el comando `wallet open`:

```shell
cleos wallet open
```

La consola muestra que tu cartera **default** está abierta: `Opened: default`.


<strong>Consejo:</strong> También puedes incluir el parámetro --name para abrir una cartera según su nombre: `cleos wallet open --name named-wallet`.
{: .label .label-yellow }

Ahora que tu cartera está abierta, necesitarás desbloquearla. Puedes utilizar el comando `cleos wallet open --name named-wallet` para desbloquearlo en un solo paso. Utiliza la contraseña que se mostró en la consola cuando creaste tu cartera.

```shell
cleos wallet unlock --password PW5KRXKVx25yjL3FvxxY9YxYxxYY9Yxx99yyXTRH8DjppKpD9tKtVz
```

La consola mostrará que tu cartera **default** está desbloqueada: `cleos wallet open --name named-wallet`.

<strong>Consejo:</strong> Por defecto, **keosd** bloqueará automáticamente tus carteras tras 15 minutos de inactividad. Para desactivar esta función, tendrás que ajustar el indicador **/home/username/eosio-wallet/config.ini** con un número muy elevado. Ponerlo a 0 hará que keosd mantenga tu cartera siempre bloqueada.
{: .label .label-yellow }


Para determinar si tu cartera está Bloqueada/Desbloqueada, puedes utilizar el siguiente comando:

```shell
cleos wallet list
```

La consola mostrará los nombres de tus carteras, con un asterisco (*) para indicar que tu cartera está desbloqueada:

```shell
Wallets:
[
  "default *"
]
```

<strong>Consejo:</strong> Si vuelves a este paso más tarde (después de terminar tu instancia de **kleos**) y tu cartera **default** no aparece en la lista: `cleos wallet open --name named-wallet`, tendrás que abrirla y desbloquearla de nuevo.
{: .label .label-yellow }


## Importar la clave de desarrollo local

Para fines de desarrollo, cada cadena WAX incluye un usuario del sistema por defecto llamado **eosio**. Esta cuenta se utiliza para configurar su cadena local cargando los contratos del sistema que dictan la dirección y los acuerdos. 

En tu entorno de desarrollo local, este usuario **eosio** simulará tu cuenta de WAX Blockchain. Puedes utilizar el usuario **eosio** para crear nuevas cuentas y enviar tus contratos inteligentes a tu blockchain local, sin tener que preocuparte de comprar WAX.

Para firmar las transacciones en nombre del usuario del sistema **eosio**, tendrás que importar la clave de desarrollo de EOSIO a tu cartera. 

<strong>Importante:</strong> Esta clave de desarrollo es **la misma para todos los desarrolladores de WAX y EOSIO**. Nunca uses esta clave para una cuenta WAX de producción. Si lo haces, es muy probable que pierdas el acceso a tu cuenta.
{: .label .label-yellow }


```shell
cleos wallet import --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
```

La consola mostrará que tu clave de desarrollo ha sido importada en: (tu clave privada de la cartera).

```shell
imported private key for: EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
```
