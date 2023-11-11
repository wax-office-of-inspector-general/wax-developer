---
title: Crear una Cartera
order: 43
---

# Crear una Cartera

Una cartera WAX es un repositorio encriptado y nombrado de pares de claves públicas y privadas que se almacenan en un archivo en tu servidor local (no en la blockchain). Necesitarás crear una cartera de desarrollo para:

- Crear cuentas de la Blockchain de WAX locales
- Firmar acciones realizadas en tu blockchain local

## Cómo Funciona

Para crear una cuenta en tu blockchain local, necesitarás tener una clave pública **propietaria** pregenerada (obligatoria) y una clave pública **activa** (opcional). Puedes usar tu cartera de desarrollo local para crear y almacenar estas claves.

### Contenido Predeterminado de la Cartera - Pares de Claves Públicas/Privadas
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

Tu cartera usará estas claves para firmar las acciones de tu contrato inteligente y transmitir la firma a tu red local. Si la red confirma que la transacción es válida, se incluye en un bloque en la blockchain.

:::tip
Las carteras no almacenan tokens - solo los pares de claves asociados con una cuenta de blockchain.
:::

En esta guía, usarás **cleos** para crear, abrir y desbloquear una nueva cartera.

:::warning
<strong>Nota:</strong> <strong>nodeos</strong> no necesita estar en funcionamiento para completar estos pasos. **kleos** se iniciará automáticamente (si no está en funcionamiento ya).
:::


## Crear una Cartera Predeterminada

Para crear una nueva cartera, usa el comando `wallet create`:

```shell
cleos wallet create --to-console
```

Este comando crea una cartera llamada **default**, guardada en una ruta local (por ejemplo, "/home/username/eosio-wallet/default.wallet"). 

:::tip
También puedes incluir el parámetro --name para nombrar una cartera: `cleos wallet create --name mywallet --to-console`.
:::

El parámetro `--to-console` imprime tu contraseña en la consola. Asegúrate de guardar esta contraseña en un lugar seguro (la necesitarás para desbloquear tu cartera).

```shell
warn  2019-07-16T22:39:39.847 thread-0  wallet.cpp:223                save_wallet_file     ] guardando cartera en el archivo /home/username/eosio-wallet/./default.wallet
Creando cartera: default
Guarda la contraseña para usar en el futuro para desbloquear esta cartera.
Sin la contraseña, las claves importadas no podrán ser recuperadas.
"PW5KRXKVx25yjL3FvxxY9YxYxxYY9Yxx99yyXTRH8DjppKpD9tKtVz"
```

:::tip
Para obtener una lista completa de subcomandos y parámetros de la cartera cleos, consulta la <a href="https://docs.eosnetwork.com/leap/latest/cleos/command-reference/wallet/" target="_blank">Guía de Referencia de Cleos</a>.
:::

## Abrir y Desbloquear Tu Cartera

Las carteras están cerradas por defecto (al iniciar una instancia de **keosd**). Para abrir tu cartera, usa el comando `wallet open`:

```shell
cleos wallet open
```

La consola imprime que tu cartera **default** está abierta: `Opened: default`.

:::tip
También puedes incluir el parámetro --name para abrir una cartera por nombre: `cleos wallet open --name named-wallet`.
:::

Ahora que tu cartera está abierta

, necesitarás desbloquearla. Puedes usar el comando `cleos wallet open --name named-wallet` para desbloquearla en un solo paso. Utiliza la contraseña que se imprimió en la consola cuando creaste tu cartera.

```shell
cleos wallet unlock --password PW5KRXKVx25yjL3FvxxY9YxYxxYY9Yxx99yyXTRH8DjppKpD9tKtVz
```

La consola imprime que tu cartera **default** está desbloqueada: `cleos wallet open --name named-wallet`.

:::tip
Por defecto, **keosd** bloqueará automáticamente tus carteras después de 15 minutos de inactividad. Para desactivar esta función, necesitarás modificar la bandera **/home/username/eosio-wallet/config.ini** a un número extremadamente grande. Si la configuras en 0, keosd siempre bloqueará tu cartera.
:::


Para determinar si tu cartera está Bloqueada/Desbloqueada, puedes usar el siguiente comando:

```shell
cleos wallet list
```

La consola imprime los nombres de tus carteras, con un asterisco (*) para indicar que tu cartera está Desbloqueada:

```shell
Carteras:
[
  "default *"
]
```

:::tip
Si vuelves a este paso más tarde (después de terminar tu instancia de **kleos**) y tu cartera **default** no está en la lista: `cleos wallet open --name named-wallet`, necesitarás Abrir y Desbloquear tu cartera de nuevo.
:::


## Importar la Clave de Desarrollo Local

Para fines de desarrollo, cada cadena de WAX incluye un usuario del sistema predeterminado llamado **eosio**. Esta cuenta se utiliza para configurar tu cadena local cargando contratos del sistema que dictan la gobernanza y el consenso.

En tu entorno de desarrollo local, este usuario **eosio** simulará tu Cuenta Blockchain de WAX. Puedes usar el usuario **eosio** para crear nuevas cuentas y empujar tus contratos inteligentes a tu blockchain local, sin tener que preocuparte por apostar ningún WAX.

Para firmar transacciones en nombre del usuario del sistema **eosio**, necesitarás importar la clave de desarrollo **eosio** en tu cartera.

:::tip
Importante: ¡Esta clave de desarrollo es **la misma para todos los desarrolladores de WAX y Antelope**! Nunca uses esta clave para una Cuenta WAX de producción. Hacerlo resultará casi con seguridad en la pérdida de acceso a tu cuenta.
:::


```shell
cleos wallet import --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
```

La consola imprime que tu clave de desarrollo ha sido importada para: (tu clave privada de cartera).

```shell
clave privada importada para: EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
```