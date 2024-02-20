---
title: boost.wax
---

# boost.wax

Este contrato registra otros contratos que desean que WAX aplique una gestión extendida sobre CPU y Net para sus usuarios de Cloud Wallet.

Desplegado en: [boost.wax](https://wax.bloks.io/account/boost.wax)

## Modelo de Recursos de Cloud Wallet

El modelo de asignación de recursos para las cuentas de Cloud Wallet se diseñó basándose en la actividad de la cuenta. En lugar de asignar recursos a cada cuenta de Cloud Wallet en el momento de su creación, el nuevo modelo de recursos asigna los recursos necesarios a cada cuenta en el momento de ejecutar y firmar una transacción. Luego, estos recursos se recuperan. Este nuevo modelo permite agrupar recursos de cuentas que son menos activas en el momento y usar esos recursos para impulsar la actividad de cuentas activas. Este nuevo sistema de impulso está diseñado como un sistema de agrupación de recursos en niveles con dos niveles de recursos que se verifican primero para disponibilidad de ancho de banda antes de que un usuario necesite proporcionar recursos para completar una transacción desde su propio stake de WAXP.

### Nivel de Agrupación de Recursos de Impulso dApp

Cloud Wallet asignará hasta 5 segundos de CPU y 5M de palabras de NET de ancho de banda por dApp en un período de 24h; Esto equivale a aproximadamente 10000 acciones impulsadas por dApp en ese período de tiempo asumiendo un costo promedio de recurso de acción de 0.5 ms. Los parámetros de la agrupación de recursos de impulso dApp pueden ajustarse con el tiempo a medida que se disponga de más datos de utilización.

Además, cada dApp puede contribuir con su propio WAXP para extender su agrupación de recursos de impulso dApp. El contrato inteligente de la dApp debe tener un permiso llamado paybw, y debe estar vinculado a la acción boost.wax#noop. Además, debe tener una autoridad 1 de 1 usando la cuenta@permiso boost.wax@paybw. Como ejemplo, vea el [permiso test.wax@paybw](https://wax.bloks.io/account/test.wax#keys).

Cuando se supera el nivel inicial de agrupación de recursos de impulso dApp, Cloud Wallet firmará para los usuarios de dApps usando este permiso si tiene suficiente CPU y NET asignado a la cuenta de su contrato. Cada dApp también necesita configurar su asignación de agrupación de recursos de impulso dApp por usuario a través del contrato inteligente boost.wax a través de [esta acción](https://wax.bloks.io/account/boost.wax?loadContract=true&tab=Actions&account=boost.wax&scope=boost.wax&limit=100&action=reg).

Si la agrupación dApp tiene recursos disponibles, entonces Cloud Wallet impulsará las transacciones de los usuarios desde esa agrupación dApp y disminuirá la medición de la agrupación en consecuencia.

El equipo de Cloud Wallet se reserva el derecho de deshabilitar la Agrupación de Recursos de Impulso dApp para una dApp dada.

### Nivel de Agrupación de Recursos de Impulso Usuario

Cloud Wallet asignará hasta 5 ms de CPU y 5k palabras de NET de ancho de banda por cada usuario en un período de 24h. Esto equivale a aproximadamente 10 acciones impulsadas por usuario en ese período de tiempo asumiendo un costo promedio de recurso de acción de 0.5 ms. Los parámetros de la Agrupación de Recursos de Impulso Usuario pueden ajustarse con el tiempo a medida que se disponga de más datos de utilización.

Ambos, el Nivel de Agrupación de Recursos de Impulso dApp y el Nivel de Agrupación de Recursos de Impulso Usuario, deben tener recursos para que una acción sea impulsada por el nuevo mecanismo de recursos de Cloud Wallet. Si se agota la Agrupación de Recursos de Impulso dApp o la Agrupación de Recursos de Impulso Usuario, Cloud Wallet cambiará a usar los recursos apostados propios de la dApp, y si el usuario ha superado el límite de ancho de banda de 24 horas configurado por la dApp, WCW cambiará a usar los recursos apostados del usuario.

::: info
![alt text](https://github.com/worldwide-asset-exchange/boost.wax/blob/master/BoostDecisionTree.png?raw=true)
::

:

Este sistema de impulso permite un control de la medición de recursos, asegurando que cada usuario tenga una línea base de recursos necesaria que le permita participar en actividades basadas en NFT como drops de paquetes, apertura de paquetes, crafting, compra y venta de NFT, e intercambio, independientemente del costo actual de recursos en la red.

### Impulso de RAM

WCW crea nuevas cuentas con el mínimo de RAM necesario para crear cada cuenta exitosamente. Para que los usuarios aún puedan ejecutar transacciones que requieran RAM, WCW impulsa la RAM para cualquier transacción que se impulse exitosamente para el ancho de banda bajo el nivel pagado por WAX. Actualmente, WAX financiará hasta 4096 bytes de RAM total de la cuenta incluyendo lo requerido para la creación de la cuenta para cualquiera de estas transacciones. En el futuro, los impulsos de RAM estarán disponibles para los niveles pagados por dApp, que serán pagados por las dApps relevantes si una transacción no califica para el impulso bajo el nivel pagado/usuário impulso de WAX.

## API

* [`reg(name contract, uint64_t cpu_us_per_user, uint64_t net_words_per_user, bool use_allow_list, vector<name> allowed_contracts)`](https://wax.bloks.io/account/boost.wax?loadContract=true&tab=Actions&account=boost.wax&scope=boost.wax&limit=100&action=reg)

   Registra tu contrato para la gestión de ancho de banda.  
   * `contract`: la cuenta de contrato a registrar. También debe ser la cuenta que llama a esta acción.  
   * `cpu_us_per_user`: cantidad de cpu en microsegundos para proporcionar a tus usuarios durante un período de 24 horas.  
   * `net_words_per_user`: cantidad de net en palabras para proporcionar a tus usuarios durante un período de 24 horas.  
   * `use_allow_list`: activa o desactiva la aplicación de la lista de permitidos.
   * `allowed_contracts`: vector de nombre de contrato que están permitidos para estar en transacciones que acompañan a tu contrato. Debe tener use_allow_list == true para que se apliquen. La idea es prevenir abusos por parte de dapps que podrían incluir una de las acciones de tu contrato en sus transacciones para aprovechar tu cuota de ancho de banda. Al listar los contratos que aceptas en las transacciones de tu contrato, solo pagarás con tu propio cpu+net si todos los contratos de la transacción están contenidos en esta lista.  
   
  ::: info Nota
    tu contrato debe tener un permiso llamado **paybw**, y debe estar vinculado a la acción **boost.wax**#**noop**. Además, debe tener una autoridad 1 de 1 usando la cuenta@permiso `boost.wax@paybw`. Como ejemplo, vea el [permiso test.wax@paybw](https://wax.bloks.io/account/test.wax#keys). Cuando se supera el nivel gratuito, el backend de WAX firmará para tus usuarios usando este permiso si tienes suficiente CPU y Net asignados a la cuenta de tu contrato.
  :::
   
* **[`dereg(name contract`)](https://wax.bloks.io/account/boost.wax?loadContract=true&tab=Tables&account=boost.wax&scope=boost.wax&limit=100&action=dereg)**: 

   Cancela el registro de tu contrato para la gestión de ancho de banda.  
   
* **[`noop()`](https://wax.bloks.io/account/boost.wax?loadContract=true&tab=Tables&account=boost.wax&scope=boost.wax&limit=100&action=noop)**: 

   Acción de no operación insertada en transacciones de Cloud Wallet que satisfacen los criterios de gestión de ancho de banda.  

* **`boost(name from, name to, asset cpu, asset net)`**: *Obsoleto*
* **`updateboost(name from, name to, asset cpu_to, asset net_to)`**: *Obsoleto*
* **`unboost(name from, name to)`**: *Obsoleto*
* **`boosterdel (name booster)`**: *Obsoleto*
