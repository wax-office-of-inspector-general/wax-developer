---
title: Iniciar un Nodo Local
order: 41
---

# Iniciar un Nodo Local

Para iniciar un nodo local de WAX en tu servidor de desarrollo:

1. Desde la línea de comandos, ingresa lo siguiente para inicializar **keosd**.

    ```shell
    keosd &
    ```

    La consola muestra la siguiente información:

    ```shell
    info  2019-07-16T21:22:39.501 thread-0  wallet_plugin.cpp:42          plugin_initialize    ] initializing wallet plugin
    info  2019-07-16T21:22:39.513 thread-0  http_plugin.cpp:622           add_handler          ] add api url: /v1/keosd/stop
    info  2019-07-16T21:22:39.519 thread-0  http_plugin.cpp:622           add_handler          ] add api url: /v1/node/get_supported_apis
    info  2019-07-16T21:22:39.520 thread-0  wallet_api_plugin.cpp:73      plugin_startup       ] starting wallet_api_plugin
    info  2019-07-16T21:22:39.521 thread-0  http_plugin.cpp:622           add_handler          ] add api url: /v1/wallet/create
    info  2019-07-16T21:22:39.523 thread-0  http_plugin.cpp:622           add_handler          ] add api url: /v1/wallet/create_key
    info  2019-07-16T21:22:39.525 thread-0  http_plugin.cpp:622           add_handler          ] add api url: /v1/wallet/get_public_keys
    info  2019-07-16T21:22:39.527 thread-0  http_plugin.cpp:622           add_handler          ] add api url: /v1/wallet/import_key
    info  2019-07-16T21:22:39.544 thread-0  http_plugin.cpp:622           add_handler          ] add api url: /v1/wallet/list_keys
    info  2019-07-16T21:22:39.546 thread-0  http_plugin.cpp:622           add_handler          ] add api url: /v1/wallet/list_wallets
    info  2019-07-16T21:22:39.549 thread-0  http_plugin.cpp:622           add_handler          ] add api url: /v1/wallet/lock
    info  2019-07-16T21:22:39.552 thread-0  http_plugin.cpp:622           add_handler          ] add api url: /v1/wallet/lock_all
    info  2019-07-16T21:22:39.555 thread-0  http_plugin.cpp:622           add_handler          ] add api url: /v1/wallet/open
    info  2019-07-16T21:22:39.558 thread-0  http_plugin.cpp:622           add_handler          ] add api url: /v1/wallet/remove_key
    info  2019-07-16T21:22:39.561 thread-0  http_plugin.cpp:622           add_handler          ] add api url: /v1/wallet/set_timeout
    info  2019-07-16T21:22:39.563 thread-0  http_plugin.cpp:622           add_handler          ] add api url: /v1/wallet/sign_digest
    info  2019-07-16T21:22:39.565 thread-0  http_plugin.cpp:622           add_handler          ] add api url: /v1/wallet/sign_transaction
    info  2019-07-16T21:22:39.567 thread-0  http_plugin.cpp:622           add_handler          ] add api url: /v1/wallet/unlock
    ```

2. A continuación, pega lo siguiente para comenzar a producir bloques:

    ```shell
    nodeos -e -p eosio \
    --plugin eosio::producer_plugin \
    --plugin eosio::chain_api_plugin \
    --plugin eosio::http_plugin \
    --access-control-allow-origin='*' \
    --contracts-console \
    --http-validate-host=false \
    --verbose-http-errors >> nodeos.log 2>&1 &
    ```

    Esto inicializará todos los plugins básicos, establecerá la dirección del servidor (la tuya) y añadirá depuración

 y registro de contratos. 


:::warning
    Importante: El parámetro --access-control-allow-origin='*' habilita el uso compartido de recursos entre orígenes (CORS). Nunca habilites esto para un nodo público.     
:::

    Cuando el comando se complete, la consola imprimirá un número, similar al siguiente:

    ```shell
    [2] 4529.
    ```

3. Para verificar que **nodeos** esté produciendo bloques, desde la línea de comandos, usa el comando **tail** para ver el log:

    ```shell
    tail -f nodeos.log
    ```

    La consola muestra tu información de bloque:

    ```shell
    info  2019-07-16T21:36:14.501 thread-0  producer_plugin.cpp:1597      produce_block        ] Produced block 0000043f8f7c37a1... #1087 @ 2019-07-16T21:36:14.500 signed by eosio [trxs: 0, lib: 1086, confirmed: 0]
    info  2019-07-16T21:36:15.001 thread-0  producer_plugin.cpp:1597      produce_block        ] Produced block 00000440315e6c27... #1088 @ 2019-07-16T21:36:15.000 signed by eosio [trxs: 0, lib: 1087, confirmed: 0]
    ```


:::tip
Fíjate en la firma "firmado por eosio" - esta es la cuenta del sistema local.
:::

Ahora estás ejecutando un nodo local de WAX en tu servidor de desarrollo. Presiona Ctrl + c para cerrar el log (**nodeos** continuará corriendo en segundo plano). 

## Detener un Nodo Local

Para detener **nodeos** limpiamente:

1. Desde la línea de comandos, ejecuta `pkill`:

    ```shell
    pkill nodeos
    ```

2. Para verificar que **nodeos** ya no esté produciendo bloques, ejecuta el comando `tail` para ver el log:

    ```shell
    tail -f nodeos.log
    ```

    En la última línea, la consola muestra: "nodeos saliendo exitosamente."

    ```shell
    info  2019-07-16T21:45:43.501 thread-0  producer_plugin.cpp:1597      produce_block        ] Produced block 000008b10f51d1ae... #2225 @ 2019-07-16T21:45:43.500 signed by eosio [trxs: 0, lib: 2224, confirmed: 0]
    info  2019-07-16T21:45:44.001 thread-0  producer_plugin.cpp:1597      produce_block        ] Produced block 000008b26fca2675... #2226 @ 2019-07-16T21:45:44.000 signed by eosio [trxs: 0, lib: 2225, confirmed: 0]
    info  2019-07-16T21:45:44.450 thread-0  main.cpp:148                  main                 ] nodeos successfully exiting
    ```