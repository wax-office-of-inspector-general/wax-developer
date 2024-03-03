---
título: Permisos Personalizados de Cuentas WAX
---

Tu cuenta de WAX se utiliza para todas las interacciones con la blockchain, todas las acciones requieren una autoridad asociada que típicamente es tu permiso activo de cuenta.

Hay ocasiones en las que puedes requerir que una acción específica sea ejecutada desde un nodo externo u otra parte usando tu cuenta, donde no querrías compartir tu clave privada activa.

En esta guía se explicará un ejemplo práctico sobre la reclamación de recompensas.

_Este artículo ha sido actualizado para incorporar el proceso de construcción de software_ [_Antelope_](https://antelope.io/) _Leap._

## Permisos Personalizados de Cuentas WAX

Si buscas más detalles, las cuentas y permisos de Antelope están cubiertos extensamente en la documentación para desarrolladores de EOSIO aún vigente [EOSIO Developers Documentation](https://developers.eos.io/welcome/v2.0/protocol-guides/accounts_and_permissions), así como en el nuevo [Sitio de Documentación de Antelope](https://docs.eosnetwork.com/docs/latest/protocol/accounts_and_permissions).

Por defecto, una cuenta de WAX tiene dos permisos **owner** y **active**

_El permiso_ `_owner_` _se encuentra en la raíz de la jerarquía de permisos de cada cuenta. Por lo tanto, es el permiso relativo más alto que una cuenta puede tener dentro de su estructura de permisos. Aunque el permiso_ `_owner_` _puede hacer cualquier cosa que un permiso de nivel inferior pueda hacer, típicamente se utiliza para propósitos de recuperación cuando un permiso inferior ha sido comprometido. Como tal, las claves asociadas con el permiso_ `_owner_` _se mantienen típicamente en almacenamiento frío, no se utilizan para firmar operaciones regulares._

_El permiso predeterminado implícito vinculado a todas las acciones es_ `_active_`, _que se sitúa un nivel por debajo del permiso_ `_owner_` _dentro de la estructura jerárquica. Como resultado, el permiso_ `_active_` _puede hacer cualquier cosa que el permiso_ `_owner_` _pueda hacer, excepto cambiar las claves asociadas con el propietario. El permiso_ `_active_` _se utiliza típicamente para votar, transferir fondos y otras operaciones de cuenta._

En este artículo se explicará un ejemplo de permiso personalizado, este permiso personalizado caerá bajo el permiso `active` y proporcionará autorización para 3 acciones de reclamación de recompensas `claimgbmprod`, `claimgbmvote` y `claimgenesis`.

## Resumen de Configuración

1. Crear un nuevo par de claves
2. Crear un permiso personalizado
3. Asignar una acción al permiso personalizado
4. Ejecutar la acción con permiso

`cleos` y `keosd` se utilizarán para esta configuración como se discutió en nuestro artículo anterior, [Configurar un Nodo Productor de Bloques de Testnet de WAX](https://medium.com/eosphere/wax-technical-how-to-3-78d358c46146).

**Crear e importar un nuevo par de claves**

```
***Crear un nuevo par de claves***
> cleos create key --to-console  
Llave privada: 5KdtC99C9VoZoXscoQLe77zmnVAwj3PGSb1aJVQPZBEzcseaP5n  
Llave pública: EOS4tma83A8ocKsKsio2hpecJv16AZL4YxnoHpU2TK25r4E6UGE28

***Crear una nueva billetera para usar este par de claves***
> cleos wallet create -n waxclaim --to-console  
Creando billetera: waxclaim

Guarda la contraseña para usar en el futuro para desbloquear esta billetera.  
Sin contraseña las claves importadas no serán recuperables.  
"PW5JGHurUqfb2qf93Hynit3qFpkddiz6wpEWaWuqKTuGq5by4Fk7V"

***Desbloquea tu billetera con la contraseña anterior***
> cleos wallet unlock -n waxclaim  
contraseña: Desbloqueada: waxclaim

***Importa tu active_key : privada***
> cleos wallet import -n waxclaim  
clave priv

ada: clave privada importada para: EOS8PSfvq342YTVtogNVskjCttpx1rQX9JT59wQuLt2Nkz16ZmsL4
```

**Crear un permiso personalizado**

El siguiente comando creará un permiso personalizado llamado **waxclaimer**, la clave pública se utiliza del par de claves generado anteriormente y caerá bajo el permiso `active` de la cuenta `eosphereiobp` en este ejemplo.

Por supuesto, para tus propósitos utilizarías tu propia cuenta de Guild y asegurarías que tu permiso activo esté desbloqueado usando `cleos`.

```
> cleos -u https://wax.eosphere.io set account permission eosphereiobp waxclaimer '{"threshold":1,"keys":[{"key":"EOS4tma83A8ocKsKsio2hpecJv16AZL4YxnoHpU2TK25r4E6UGE28","weight":1}]}' "active" -p eosphereiobp@active
```

**Asignar acciones al permiso personalizado**

En el siguiente ejemplo, tres acciones serán asignadas bajo el permiso **waxclaimer**, `claimgbmprod` (Recompensas de Producción de Bloques), `claimgbmvote` (Recompensas de Votantes) y `claimgenesis` (Recompensas de Génesis).

Como antes, para tus propósitos usarías tu propia cuenta de Guild y asegurarías que tu permiso activo esté desbloqueado usando `cleos`.

```
> cleos -u https://wax.eosphere.io set action permission eosphereiobp eosio claimgbmprod waxclaimer

> cleos -u https://wax.eosphere.io set action permission eosphereiobp eosio claimgbmvote waxclaimer

> cleos -u https://wax.eosphere.io set action permission eosphereiobp eosio claimgenesis waxclaimer
```

**Ejecutar las acciones con permiso**

Usando el permiso **waxclaimer** y la billetera **waxclaim** desbloqueada asociada en este ejemplo _(asegúrate de desbloquear waxclaim antes de usar)_, estas acciones ahora pueden ejecutarse sin tener que desbloquear y usar el permiso activo.

El permiso personalizado se utiliza especificando `-p eosphereiobp@waxclaimer` en la acción.

```
> cleos -u https://wax.eosphere.io push action eosio claimgbmprod '{"owner":"eosphereiobp"}' -p eosphereiobp@waxclaimer

> cleos -u https://wax.eosphere.io push action eosio claimgbmvote '{"owner":"eosphereiobp"}' -p eosphereiobp@waxclaimer

> cleos -u https://wax.eosphere.io push action eosio claimgenesis '{"claimer":"eosphereiobp"}' -p eosphereiobp@waxclaimer
```

---

Estas **Guías Técnicas para Desarrolladores de WAX** se crean utilizando material de fuente de la [Serie de Cómo Hacer Técnico de WAX de EOSphere](https://medium.com/eosphere/wax-technical-how-to/home)

Asegúrate de hacer cualquier pregunta en el [Telegram de EOSphere](https://t.me/eosphere_io)