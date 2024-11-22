---
title: Parte 7. Creación de GUI para el juego en WAX, staking y cultivo
order: 35
---

Este artículo te guiará en la conexión de una cartera a la blockchain de WAX, integrándola en una interfaz ReactJS y leyendo datos de una tabla de un contrato inteligente en WAX. También cubriremos el proceso de staking de NFT y cómo reclamar recompensas.

Empecemos con el procedimiento sobre cómo conectar tu aplicación web a la blockchain de WAX.

Comenzando con la conexión de la cartera WAX, utilizamos la Universal Authenticator Library (UAL) en nuestra aplicación ReactJS para una integración y autenticación fácil de la cartera. El componente `UALProvider` sirve como proveedor del contexto de autenticación, facilitando las interacciones fluidas entre la aplicación y varias carteras de blockchain, simplificando el proceso de integración para los desarrolladores.

Incorpora el `UALProvider` en tu aplicación React para agilizar el proceso de autenticación, ofreciendo una interfaz unificada para varios proveedores de cartera. Esta configuración es fundamental para conectar carteras de manera eficiente. Para una guía paso a paso y configuraciones, el [repositorio de GitHub de UAL](https://github.com/EOSIO/ual-reactjs-renderer) es un recurso invaluable, proporcionando documentación detallada y ejemplos para la integración en React.

Componente `UALProvider`:

- `chains={[waxChain]}`: Especifica la configuración de la blockchain.
- `authenticators={waxAuthenticators}`: Indica un array de autenticadores disponibles para la selección del usuario (e.g., Anchor y Wax).
- `appName={'AppName'}`: Define el nombre de la aplicación utilizado para la identificación durante la autenticación.

```js
<UALProvider
    chains={[waxChain]}
    authenticators={waxAuthenticators}
    appName={'AlchemySwap'}
  >
    <App />
</UALProvider>
```

A continuación, necesitamos configurar el archivo de configuración para conectar nuestras carteras a WAX.

- **El objeto `waxChain`**:
  
  *Contiene la configuración para conectarse a la red WAX, como la ID de la cadena y las direcciones del servidor RPC.*

- **Creación de instancias de Anchor y la cartera en la nube de WAX**:
  
  *`const anchor = new Anchor([waxChain], { appName: name })`*
  
  *Se crea una instancia de Anchor con la configuración de la red WAX y el nombre de la aplicación.*
  
  *`const waxCloudWallet = new Wax([waxChain], { appName: name })`*
  
  *Crea una instancia de Wax con la misma configuración.*

- **Array `waxAuthenticators`**:
  
  *Define un array de autenticadores que se utilizarán según una condición. Aquí podemos editar el estado de la red principal (mainnet) o de la red de prueba (testnet).*

A continuación se muestra un ejemplo de código del archivo `wax.config.js`:

```js
import { Anchor } from 'ual-anchor';
import { Wax } from '@eosdacio/ual-wax';

import {
  WAX_CHAIN_ID,
  WAX_RPC_ENDPOINTS_HOST,
  WAX_RPC_ENDPOINTS_PROTOCOL,
} from '../constants/wax.constants';

export const waxChain = {
  chainId: WAX_CHAIN_ID,
  rpcEndpoints: [
    {
      protocol: WAX_RPC_ENDPOINTS_PROTOCOL,
      host: WAX_RPC_ENDPOINTS_HOST,
      port: '',
    },
  ],
};

const anchor = new Anchor([waxChain], { appName: 'TestGame' });
const waxCloudWallet = new Wax([waxChain], { appName: 'TestGame' });

export const waxAuthenticators =
  process.env.REACT_APP_MAINNET === 'mainnet'
    ? [anchor, waxCloudWallet]
    : [anchor];
```

Después de activar el método `showModal()` en la interfaz de usuario, aparecerá una ventana modal que mostrará las carteras disponibles para la conexión. Este paso es crucial para que los usuarios elijan su cartera preferida para interactuar con la blockchain de WAX dentro de tu aplicación.

```js
import { UALContext } from 'ual-reactjs-renderer';
const { activeUser, showModal } = useContext(UALContext);
```

![Imagen del tutorial](/public/assets/images/tutorials/howto-create_farming_game/part7/image1.png)

Después de conectarse a la blockchain de WAX, el siguiente paso es leer datos de una tabla de un contrato inteligente en WAX.

Esto implica usar una función para obtener filas de datos de la tabla. La función `FetchRows` está diseñada específicamente para este propósito, permitiendo a la aplicación acceder y mostrar los datos requeridos desde la blockchain. Este proceso es esencial para integrar los datos de la blockchain en la interfaz de usuario de tu aplicación, proporcionando a los usuarios información en tiempo real directamente desde la blockchain de WAX.

```js
export const getTableData = async ({ contract, scope, table }) => {
  const pageSize = 1000;
  let lowerBound = 0;
  let fetchMore = true;

  const assets = [];

  while (fetchMore) {
    // eslint-disable-next-line no-await-in-loop
    const { rows, more, next_key } = await fetchRows({
      contract,
      scope,
      table,
      limit: pageSize,
      lowerBound,
    });

    assets.push(...rows);

    if (more) lowerBound = next_key;
    else fetchMore = false;
  }

  return assets;
};
```

### Función FetchRows para Leer Datos de la Blockchain WAX

La función `FetchRows`, integral para leer datos de la blockchain WAX, utiliza una configuración que emplea `rpc` y el método `get_table_rows`. Esta configuración facilita la recuperación de datos directamente de la tabla especificada, permitiendo que la interfaz muestre datos de la blockchain de manera dinámica.

```js
export const fetchRows = async ({
  contract,
  scope,
  table,
  limit,
  lowerBound = null,
  upperBound = null,
}) => {
  try {
    const config = {
      json: true,
      code: contract,
      scope,
      table,
      limit,
      lower_bound: lowerBound,
      upper_bound: upperBound,
    };

    if (!lowerBound) delete config['lower_bound'];

    if (!upperBound) delete config['upper_bound'];

    return await rpc.get_table_rows(config);
  } catch (e) {
    if (!e.message.includes('assertion failure')) {
      const isNewNetworkExist = reinitializeRcp();

      if (!isNewNetworkExist) throw new Error('NetworkError!');

      return await fetchRows({
        contract,
        scope,
        table,
        limit,
        lowerBound,
        upperBound,
      });
    } else {
      throw new Error(e.message);
    }
  }
};
```

**Ejemplo**: Recuperar todos los recursos del usuario.

Para hacer esto, se utiliza la función **getResources**.

- **activeUser**: el usuario activo.
- **table**: la tabla del contrato de la cual se desea extraer los datos de recursos.

```js
export const getResources = async ({ activeUser }) => {
    const { rows } = await fetchRows({
      contract: GAME_CONTRACT,
      scope: activeUser.accountName,
      table: 'resources',
      limit: 100,
    });

   return rows;
};
```

### Staking de NFTs

El análisis del proceso de staking implica comprender las herramientas y mecanismos específicos utilizados en el elemento de farming.

Este proceso es crucial para optimizar el uso de los NFTs dentro del juego, asegurando que los jugadores puedan stakear sus activos de manera eficiente y efectiva para el farming de recursos u otros beneficios.

![](/public/assets/images/tutorials/howto-create_farming_game/part7/image2.png)

Para stakear un "farmingItem" con tu contrato, comienza invocando la acción específica diseñada para staking, acompañada de la función auxiliar `signTransaction()` para ejecutar la transacción. Este método asegura la transacción y garantiza que el "farmingItem" se stakee como se pretende dentro del marco operativo de tu contrato inteligente.

```js
export const stakeFarmingTool = async ({ activeUser, selectItem }) => {
    return await signTransaction({
        activeUser,
        account: 'atomicassets',
        action: 'transfer',
        data: {
            from: activeUser.accountName,
            to: GAME_CONTRACT,
            asset_ids: [selectItem],
            memo: `stake farming item`
        }
    });
};
```

```js
export const signTransaction = async ({
  activeUser,
  account,
  action,
  data,
}) => {
  await activeUser.signTransaction(
    {
      actions: [
        {
          account,
          name: action,
          authorization: [
            {
              actor: activeUser.accountName,
              permission: 'active',
            },
          ],
          data,
        },
      ],
    },
    {
      blocksBehind: 3,
      expireSeconds: 30,
    }
  );
};
```

Una vez que tu "farmingItem" esté stakeado con éxito, el siguiente paso es stakear tus herramientas. Para esta acción, debes referirte a la función específica proporcionada en el contrato inteligente. Esta acción permite el staking de herramientas, involucrándose más con la mecánica del juego y mejorando la utilidad de los activos dentro del mismo.

Para instrucciones detalladas o ejecutar esta acción, normalmente puedes consultar el siguiente enlace al contrato inteligente:

<https://testnet.waxblock.io/account/atomicassets?action=transfer#contract-actions>

La acción para stakear herramientas implica especificar el `wpId`, que identifica el "farmingItem" en el cual se está haciendo el staking de la herramienta. Este parámetro es crucial para dirigir el proceso de staking al ítem correcto, asegurando que la herramienta mejore las capacidades o beneficios del "farmingItem" en el juego.

```js
export const stakeTool = async ({ activeUser, selectItem, wpId }) => {
    return await signTransaction({
        activeUser,
        account: 'atomicassets',
        action: 'transfer',
        data: {
            from: activeUser.accountName,
            to: GAME_CONTRACT,
            asset_ids: [selectItem],
            memo: `stake items:${wpId}`
        }
    });
};
```

El paso final consiste en reclamar los recursos obtenidos a través de tu "farming item" y herramientas stakeados.

Después de stakear tu "farming item" y utilizar herramientas de tu inventario, los recursos se acumulan con el tiempo, disponibles para reclamar cada hora desde cualquier granja equipada con herramientas. La interfaz de usuario muestra los recursos acumulados, indicando la cantidad que puedes reclamar, lo que facilita el seguimiento de tu progreso y recompensas dentro del juego.

![](/public/assets/images/tutorials/howto-create_farming_game/part7/image3.png)

La acción de reclamar tiene los siguientes campos:

- **action**: el nombre de la acción en el contrato.
- **owner**, **farmingitem**: campos que se envían al contrato.

```js
export const claimRes = async ({ activeUser }) => {
    return await signTransaction({
      activeUser,
      account: GAME_CONTRACT,
      action: 'claim',
      data: {
        owner: activeUser.accountName,
        farmingitem: 1,
      },
    });
};
```

Aquí hay un enlace a la acción en el contrato inteligente para reclamar recompensas:

<https://testnet.waxblock.io/account/dapplcminers?action=claim#contract-actions>

Este artículo ha descrito de manera exhaustiva los principios y objetos definidos a nivel de contrato inteligente, centándose en cómo implementar efectivamente una interfaz de usuario para estos elementos en ReactJS.

Al integrar componentes de interfaz de usuario, los desarrolladores pueden crear una experiencia interactiva y fluida que permita a los usuarios interactuar con las funcionalidades del contrato inteligente, como stakear elementos y reclamar recursos, directamente dentro de una aplicación ReactJS.

PS: El [siguiente enlace](https://github.com/dapplicaio/UIForFarmingandStaking) lleva a un repositorio que corresponde a todo lo descrito, para que puedas simplemente construir ese código y utilizarlo como desees.

