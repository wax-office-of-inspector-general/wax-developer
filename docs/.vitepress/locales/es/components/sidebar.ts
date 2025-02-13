export default [
  {
    text: 'Aprender',
    collapsed: false,
    sidebarDepth: 2,
    items: [
      {
        text: 'Acerca de WAX',
        link: '/es/learn/about-wax/',
        collapsed: true,
        sidebarDepth: 2,
        items: [
          {
            text: '¿Qué es WAX?',
            link: '/es/learn/about-wax/what-is-wax',
          },
          {
            text: '¿Por qué WAX?',
            link: '/es/learn/about-wax/why-wax',
          },
          {
            text: '¿Qué es el Token WAXP?',
            link: '/es/learn/about-wax/what-is-waxp-token',
          },
          {
            text: 'Cómo trabaja WAX?',
            link: '/es/learn/about-wax/wax-consensus',
          },
          {
            text: 'Interoperabilidad en WAX',
            link: '/es/learn/about-wax/wax-interoparability',
          }
        ],
      },
    ],
  },
  {
    text: 'Construir',
    collapsed: false,
    sidebarDepth: 4,
    items: [
      {
        text: 'Desarrollo de dApps',
        link: '/es/build/dapp-development/',
        collapsed: true,
        items: [
          {
            text: 'Configuración del entorno local',
            link: '/es/build/dapp-development/setup-local-dapp-environment/',
            collapsed: true,
            items: [
              { text: 'Iniciar un nodo local', link: '/es/build/dapp-development/setup-local-dapp-environment/dapp_local' },
              { text: 'Entornos de Blockchain', link: '/es/build/dapp-development/setup-local-dapp-environment/dapp_environments' },
              { text: 'Crear una Wallet', link: '/es/build/dapp-development/setup-local-dapp-environment/dapp_wallet' },
              { text: 'Acceso al API local', link: '/es/build/dapp-development/setup-local-dapp-environment/dapp_api' },
            ],
          },
          {
            text: 'Configuración de Docker',
            link: '/es/build/dapp-development/docker-setup/',
            collapsed: true,
            items: [
              { text: 'Crear contenedor WAX', link: '/es/build/dapp-development/docker-setup/docker_qstart_getstarted' },
              { text: 'Ejecutar comandos', link: '/es/build/dapp-development/docker-setup/docker_qstart_use' },
              { text: 'Gestionar contenedores', link: '/es/build/dapp-development/docker-setup/docker_qstart_manage' },
            ],
          },
          {
            text: 'Configuración de la cadena de bloques WAX',
            link: '/es/build/dapp-development/wax-blockchain-setup/',
            collapsed: true,
            items: [
              { text: 'Instalar WAX Blockchain', link: '/es/build/dapp-development/wax-blockchain-setup/blockchain_install' },
              { text: 'Desinstalar WAX', link: '/es/build/dapp-development/wax-blockchain-setup/blockchain_uninstall' },
              { text: 'Verificar la instalación', link: '/es/build/dapp-development/wax-blockchain-setup/blockchain_verify' },
            ],
          },
          {
            text: 'Desarrollo de contratos inteligentes',
            link: '/es/build/dapp-development/smart-contract-quickstart/',
            collapsed: true,
            items: [
              { text: 'Fundamentos básicos', link: '/es/build/dapp-development/smart-contract-quickstart/smart_contract_basics' },
              { text: 'Crear cuentas', link: '/es/build/dapp-development/smart-contract-quickstart/dapp_account' },
              { text: 'Crear un smart contract', link: '/es/build/dapp-development/smart-contract-quickstart/dapp_hello_world' },
              { text: 'Desplegar el smart contract', link: '/es/build/dapp-development/smart-contract-quickstart/dapp_dev_deploy' },
            ],
          },
          {
            text: 'WAX CDT',
            link: '/es/build/dapp-development/wax-cdt/',
            collapsed: true,
            items: [
              { text: 'Instalar WAX-CDT', link: '/es/build/dapp-development/wax-cdt/cdt_install' },
              { text: 'Desinstalar WAX-CDT', link: '/es/build/dapp-development/wax-cdt/cdt_uninstall' },
              { text: 'Contratos de muestra', link: '/es/build/dapp-development/wax-cdt/cdt_use' },
              { text: 'Herramientas de construcción', link: '/es/build/dapp-development/wax-cdt/cdt_cpp' },
            ],
          },
          {
            text: 'Implementación en WAX',
            link: '/es/build/dapp-development/deploy-dapp-on-wax/',
            collapsed: true,
            items: [
              { text: 'Despliegue con WAX-CDT', link: '/es/build/dapp-development/deploy-dapp-on-wax/deploy_source' },
              { text: 'Despliegue con Docker', link: '/es/build/dapp-development/deploy-dapp-on-wax/deploy_docker' },
              { text: 'Despliegue de una dApp EOS en WAX', link: '/es/build/dapp-development/deploy-dapp-on-wax/convert_eos' },
            ],
          },
        ],
      },
      {
        text: 'MyCloudWallet',
        link: '/es/build/cloud-wallet/',
        collapsed: true,
        sidebarDepth: 1,
        items: [
          {
            text: 'wax.js',
            link: '/es/build/cloud-wallet/waxjs/',
            collapsed: true,
            sidebarDepth: 1,
            items: [
              { text: 'Guía Rápida', link: '/es/build/cloud-wallet/waxjs/waxjs_qstart' },
              { text: 'Instalar waxjs', link: '/es/build/cloud-wallet/waxjs/waxjs_install' },
              { text: 'Guía de uso', link: '/es/build/cloud-wallet/waxjs/waxjs_use' },
              { text: 'Demostración', link: '/es/build/cloud-wallet/waxjs/waxjs_demo' },
              { text: 'Cuentas Temporales', link: '/es/build/cloud-wallet/waxjs/waxjs_tempaccounts' },
            ],
          },
          {
            text: 'boost.wax',
            link: '/es/build/cloud-wallet/boost-wax',
            collapsed: true,
            sidebarDepth: 1,
          },
        ],
      },
      {
        text: 'Tutoriales',
        link: '/es/build/tutorials/',
        collapsed: true,
        items: [
            {
              "text": "Cómo crear un juego de cultivo",
              "link": "/es/build/tutorials/howto-create_farming_game/",
              "collapsed": true,
              "items": [
                  {"text": "Cómo crear un juego en WAX. Conceptos generales", "link": "/es/build/tutorials/howto-create_farming_game/Part1"},
                  {"text": "Creación de un objeto o ítem cultivable en el estándar AtomicAssets", "link": "/es/build/tutorials/howto-create_farming_game/Part2"},
                  {"text": "Creación de NFT de cultivo en Atomic Hub", "link": "/es/build/tutorials/howto-create_farming_game/Part3"},
                  {"text": "Qué son los recursos y tokens en nuestro proceso de creación de juegos", "link": "/es/build/tutorials/howto-create_farming_game/Part4"},
                  {"text": "Staking de NFTs", "link": "/es/build/tutorials/howto-create_farming_game/Part5"},
                  {"text": "Tipos de cultivo y proceso de cultivo", "link": "/es/build/tutorials/howto-create_farming_game/Part6"},
                  {"text": "Creación de GUI para juegos en WAX, staking y cultivo", "link": "/es/build/tutorials/howto-create_farming_game/Part7"},
                  {"text": "Mejoras de ítems de juego en juegos de WAX", "link": "/es/build/tutorials/howto-create_farming_game/Part8"},
                  {"text": "Mezclas de NFTs para juegos de WAX", "link": "/es/build/tutorials/howto-create_farming_game/Part9"},
                  {"text": "Implementación de avatares en juegos de WAX", "link": "/es/build/tutorials/howto-create_farming_game/Part10"},
                  {"text": "UI para mezclas, mejoras y avatares", "link": "/es/build/tutorials/howto-create_farming_game/Part11"},
                  {"text": "Intercambios de tokens y recursos", "link": "/es/build/tutorials/howto-create_farming_game/Part12"},
                  {"text": "Staking de tokens y votación en juegos", "link": "/es/build/tutorials/howto-create_farming_game/Part13"},
                  {"text": "Gobernanza en juegos", "link": "/es/build/tutorials/howto-create_farming_game/Part14"},
                  {"text": "GUI para intercambios, staking y gobernanza", "link": "/es/build/tutorials/howto-create_farming_game/Part15"},
                  {"text": "Tablas de clasificación en juegos", "link": "/es/build/tutorials/howto-create_farming_game/Part16"},
                  {"text": "Sistemas de misiones en el juego", "link": "/es/build/tutorials/howto-create_farming_game/Part17"},
                  {"text": "GUI para misiones y tablas de clasificación", "link": "/es/build/tutorials/howto-create_farming_game/Part18"}
              ]
          },
          {
            text: 'Tic-Tac-Toe Game',
            link: '/es/build/tutorials/tic-tac-toe-game/',
            items: [
              { text: 'Game Client', link: '/es/build/tutorials/tic-tac-toe-game/client' },
              { text: 'Smart Contract', link: '/es/build/tutorials/tic-tac-toe-game/smart-contract' }
            ],
          },
          {
            text: 'Crear y acuñar FTs',
            link: '/es/build/tutorials/create-issue-token/'
          },
          {
            text: 'Guía de AtomicAssets',
            link: '/es/build/tutorials/howto_atomicassets/',
            collapsed: true,
            items: [
              { text: 'Estructura de la colección', link: '/es/build/tutorials/howto_atomicassets/collection_struct' },
              { text: 'Administrar colecciones de NFTs', link: '/es/build/tutorials/howto_atomicassets/collection_js' },
              { text: 'Esquemas', link: '/es/build/tutorials/howto_atomicassets/schemas_js' },
              { text: 'Plantillas', link: '/es/build/tutorials/howto_atomicassets/templates_js' },
              { text: 'Acuñar NFT', link: '/es/build/tutorials/howto_atomicassets/mint_nft' },
              { text: 'Transferir NFT', link: '/es/build/tutorials/howto_atomicassets/transfer_nft' },
              { text: 'Datos Mutables', link: '/es/build/tutorials/howto_atomicassets/mutabledata' },
            ],
          },
          {
            text: 'Guía de SimpleAssets',
            link: '/es/build/tutorials/howto_simpleassets/',
            collapsed: true,
            items: [
              { text: 'Inicio Rápido', link: '/es/build/tutorials/howto_simpleassets/nft_basics' },
              { text: 'Acuñar NFT desde smart contract', link: '/es/build/tutorials/howto_simpleassets/nft_use' },
              { text: 'Desplegar smart contract', link: '/es/build/tutorials/howto_simpleassets/nft_deploy' },
              { text: 'Test del smart contract', link: '/es/build/tutorials/howto_simpleassets/nft_test' },
            ],
          },
          {
            text: 'WAX RNG',
            link: '/es/build/tutorials/wax-rng/',
            items: ['/es/build/tutorials/wax-rng/rng_install'],
          },
          {
            text: 'Crear contrato RNG',
            link: '/es/build/tutorials/create-wax-rng-smart-contract/',
            collapsed: true,
            items: [
              { text: 'Conceptos básicos', link: '/es/build/tutorials/create-wax-rng-smart-contract/rng_basics' },
              { text: 'Construye tu smart contract', link: '/es/build/tutorials/create-wax-rng-smart-contract/rng_sample' },
              { text: 'Prueba el smart contract', link: '/es/build/tutorials/create-wax-rng-smart-contract/rng_test' },
              { text: 'Despliega el smart contract', link: '/es/build/tutorials/create-wax-rng-smart-contract/rng_deploy' },
            ],
          },
          {
            text: 'WharfKit',
            link: '/es/build/tutorials/wharfkit/',
            collapsed: true,
            items: [
              { text: 'Wharfkit React How To', link: '/es/build/tutorials/wharfkit/howto_react' },
              { text: 'Wharfkit Multi-Session', link: '/es/build/tutorials/wharfkit/multisession' },
            ],
          },
          {
            text: 'SS verification',
            link: '/es/build/tutorials/server-side-verification/',
          }
          //                 '/es/build/tutorials/howto_blockexplorer',
        ],
      },
      {
        text: 'Herramientas',
        link: '/es/build/tools/',
        collapsed: true,
        items: [
          { text: 'Herramientas Blockchain', link: '/es/build/tools/blockchain_tools' },
          { text: 'S.O. soportados', link: '/es/build/tools/os' },
          { text: 'Opciones de WAX-CDT', link: '/es/build/tools/cdt_options' },
          { text: 'Contratos Ricardianos', link: '/es/build/tools/ricardian_contract' },
          { text: 'Cláusulas Ricardianas', link: '/es/build/tools/ricardian_clause' },
        ],
      },
      {
        text: 'API de referencia',
        link: '/es/build/api-reference/',
        collapsed: true,
        items: [
          { text: 'API WAX-RPC', link: '/es/build/api-reference/rpc_api' },
          { text: 'API WAX-CDT', link: '/es/build/api-reference/cdt_api' },
          {
            text: 'dFuse',
            link: '/es/build/api-reference/dfuse/index',
            collapsed: true,
            items: [
              { text: 'Ejemplo dFuse', link: '/es/build/api-reference/dfuse/dfuse_example' }
            ],
          },
        ],
      },
    ],
  },
  {
    text: 'Operar',
    collapsed: false,
    sidebarDepth: 2,
    items: [
      {
        text: 'Conceptos básicos',
        link: '/es/operate/wax-bp/',
        collapsed: true,
        items: [
          { text: 'Crear chains.json', link: '/es/operate/wax-bp/chains-json' },
          { text: 'Crear bp.json', link: '/es/operate/wax-bp/bp-json' },
        ],
      },
      {
        text: 'API de Atomic Assets',
        link: '/es/operate/atomic-assets/',
        collapsed: true,
        items: [
          { text: 'Configurar API AA', link: '/es/operate/atomic-assets/setup-wax-atomic-api-node' },
          { text: 'Optimizar y Restaurar API AA', link: '/es/operate/atomic-assets/optimise-restore-wax-atomic-api-node' },
        ],
      },
      {
        text: 'Hyperion API',
        link: '/es/operate/wax-hyperion/',
        collapsed: true,
        items: [
          { text: 'Introducción', link: '/es/operate/wax-hyperion/wax-intro-to-hyperion-full-history' },
          { text: 'Componentes Hyperion', link: '/es/operate/wax-hyperion/wax-build-hyperion-software-components' },
          { text: 'Configurar Componentes', link: '/es/operate/wax-hyperion/wax-config-hyperion-software-components' },
          { text: 'Ejecutando Hyperion', link: '/es/operate/wax-hyperion/wax-running-hyperion' },
          { text: 'Configurar Cluster Hyperion', link: '/es/operate/wax-hyperion/wax-clustering-elasticsearch-for-hyperion' },
        ],
      },
      {
        text: 'Guías',
        link: '/es/operate/wax-infrastructure/',
        collapsed: true,
        items: [
          { text: 'Configurar Nodo testnet', link: '/es/operate/wax-infrastructure/wax-testnet-node' },
          { text: 'Uso de snapshots', link: '/es/operate/wax-infrastructure/wax-snapshots' },
          { text: 'Configurar Nodo Productor (testnet)', link: '/es/operate/wax-infrastructure/wax-testnet-block-producer' },
          { text: 'Configurar Nodo en mainnet', link: '/es/operate/wax-infrastructure/wax-mainnet-node' },
          { text: 'Configurar Balanceador de Carga', link: '/es/operate/wax-infrastructure/wax-mainnet-node-load-balancer' },
          { text: 'Visualizar Métricas Balanceador de Carga', link: '/es/operate/wax-infrastructure/wax-visualise-load-balancer-metrics' },
          { text: 'Mitigar Abuso sobre API', link: '/es/operate/wax-infrastructure/wax-mainnet-node-mitigate-abuse' },
          { text: 'Configurar Nodo Estado-Historial', link: '/es/operate/wax-infrastructure/wax-mainnet-ship-node' },
          { text: 'Estructura de Archivos de Nodos de WAX', link: '/es/operate/wax-infrastructure/working-with-wax-software-files' },
          { text: 'Optimización de RAM y Disco', link: '/es/operate/wax-infrastructure/wax-ram-disk-utilisation' },
          { text: 'Permisos Personalizados de Cuentas WAX', link: '/es/operate/wax-infrastructure/wax-account-custom-permissions' },
          { text: 'Configurar API Hyperion', link: '/es/operate/wax-infrastructure/hyperion-guide' },
          { text: 'Configurar API Atomic', link: '/es/operate/wax-infrastructure/atomic-api-guide' },
        ],
      },
      {
        text: 'Servicios de API de WAX',
        link: '/es/operate/wax-api-services/',
      },
    ],
  },
  {
    text: 'Crear',
    link: '/es/create/',
    collapsed: false,
    sidebarDepth: 1,
    items: [
      {
        text: 'Awesome WAX',
        link: '/es/create/awesome-wax/',
      },
      {
        text: 'Ayúdanos a mejorar la documentación',
        link: '/es/create/docs/',
      },
    ],
  },
];
