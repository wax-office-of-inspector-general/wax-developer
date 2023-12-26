export default [
  {
      text: 'Aprender',
      collapsable: false,
      sidebarDepth: 2,
      items: [
          {
              text: 'Acerca de WAX',
              link: '/es/learn/about-wax/',
              collapsable: true,
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
                      text: '¿Qué es el token WAXP?',
                      link: '/es/learn/about-wax/what-is-waxp-token',
                  },
                  {
                      text: 'Consenso en WAX',
                      link: '/es/learn/about-wax/wax-consensus',
                  },
                  {
                      text: 'Interoperabilidad en WAX',
                      link: '/es/learn/about-wax/wax-interoparability',
                  },
                  {
                      text: 'Gobernanza en WAX',
                      link: '/es/learn/about-wax/wax-governance',
                  },
              ],
          },
      ],
  },
  {
      text: 'Construir',
      collapsable: false,
      sidebarDepth: 4,
      items: [
  //         {
  //             text: 'Desarrollo de dApps',
  //             link: '/es/build/dapp-development/',
  //             collapsable: true,
  //             items: [
  //                 {
  //                     text: 'Configuración del entorno local',
  //                     link: '/es/build/dapp-development/setup-local-dapp-environment/',
  //                     items: [
  //                         '/es/build/dapp-development/setup-local-dapp-environment/dapp_local',
  //                         '/es/build/dapp-development/setup-local-dapp-environment/dapp_environments',
  //                         '/es/build/dapp-development/setup-local-dapp-environment/dapp_wallet',
  //                         '/es/build/dapp-development/setup-local-dapp-environment/dapp_api',
  //                     ],
  //                 },
  //                 {
  //                     text: 'Configuración de Docker',
  //                     link: '/es/build/dapp-development/docker-setup/',
  //                     items: [
  //                         '/es/build/dapp-development/docker-setup/docker_qstart_getstarted',
  //                         '/es/build/dapp-development/docker-setup/docker_qstart_use',
  //                         '/es/build/dapp-development/docker-setup/docker_qstart_manage',
  //                     ],
  //                 },
  //                 {
  //                     text: 'Configuración de la cadena de bloques WAX',
  //                     link: '/es/build/dapp-development/wax-blockchain-setup/',
  //                     items: [
  //                         '/es/build/dapp-development/wax-blockchain-setup/blockchain_install',
  //                         '/es/build/dapp-development/wax-blockchain-setup/blockchain_uninstall',
  //                         '/es/build/dapp-development/wax-blockchain-setup/blockchain_verify',
  //                     ],
  //                 },
  //                 {
  //                     text: 'Desarrollo de contratos inteligentes',
  //                     link: '/es/build/dapp-development/smart-contract-quickstart/',
  //                     items: [
  //                         '/es/build/dapp-development/smart-contract-quickstart/smart_contract_basics',
  //                         '/es/build/dapp-development/smart-contract-quickstart/dapp_account',
  //                         '/es/build/dapp-development/smart-contract-quickstart/dapp_hello_world',
  //                         '/es/build/dapp-development/smart-contract-quickstart/dapp_dev_deploy',
  //                         '/es/build/dapp-development/smart-contract-quickstart/custom_permission',
  //                     ],
  //                 },
  //                 {
  //                     text: 'WAX CDT',
  //                     link: '/es/build/dapp-development/wax-cdt/',
  //                     items: [
  //                         '/es/build/dapp-development/wax-cdt/cdt_install',
  //                         '/es/build/dapp-development/wax-cdt/cdt_uninstall',
  //                         '/es/build/dapp-development/wax-cdt/cdt_use',
  //                         '/es/build/dapp-development/wax-cdt/cdt_cpp',
  //                     ],
  //                 },
  //                 {
  //                     text: 'Implementación en WAX',
  //                     link: '/es/build/dapp-development/deploy-dapp-on-wax/',
  //                     items: [
  //                         '/es/build/dapp-development/deploy-dapp-on-wax/deploy_source',
  //                         '/es/build/dapp-development/deploy-dapp-on-wax/deploy_docker',
  //                         '/es/build/dapp-development/deploy-dapp-on-wax/convert_eos',
  //                     ],
  //                 },
  //             ],
  //         },
  //         {
  //             text: 'MyCloudWallet',
  //             link: '/es/build/cloud-wallet/',
  //             collapsable: true,
  //             sidebarDepth: 1,
  //             items: [
  //                 {
  //                     text: 'wax.js',
  //                     link: '/es/build/cloud-wallet/waxjs/',
  //                     collapsable: true,
  //                     sidebarDepth: 1,
  //                     items: [
  //                         '/es/build/cloud-wallet/waxjs/waxjs_qstart',
  //                         '/es/build/cloud-wallet/waxjs/waxjs_install',
  //                         '/es/build/cloud-wallet/waxjs/waxjs_use',
  //                         '/es/build/cloud-wallet/waxjs/waxjs_demo',
  //                     ],
  //                 },
  //                 {
  //                     text: 'boost.wax',
  //                     link: '/es/build/cloud-wallet/boost-wax',
  //                     collapsable: true,
  //                     sidebarDepth: 1,
  //                 },
  //             ],
  //         },
          {
              text: 'Tutoriales',
              link: '/es/build/tutorials/',
              collapsable: true,
              items: [
                  // {
  //                     text: 'Guía de AtomicAssets',
  //                     link: '/es/build/tutorials/howto_atomicassets/',
  //                     items: [
  //                         '/es/build/tutorials/howto_atomicassets/collection_struct',
  //                         '/es/build/tutorials/howto_atomicassets/collection_js',
  //                         '/es/build/tutorials/howto_atomicassets/schemas_js',
  //                         '/es/build/tutorials/howto_atomicassets/templates_js',
  //                         '/es/build/tutorials/howto_atomicassets/mint_nft',
  //                         '/es/build/tutorials/howto_atomicassets/transfer_nft',
  //                         '/es/build/tutorials/howto_atomicassets/mutabledata',
  //                     ],
  //                 },
  //                 {
  //                     text: 'Guía de SimpleAssets',
  //                     link: '/es/build/tutorials/howto_simpleassets/',
  //                     items: [
  //                         '/es/build/tutorials/howto_simpleassets/nft_basics',
  //                         '/es/build/tutorials/howto_simpleassets/nft_use',
  //                         '/es/build/tutorials/howto_simpleassets/nft_deploy',
  //                         '/es/build/tutorials/howto_simpleassets/nft_test',
  //                     ],
  //                 },
  //                 {
  //                     text: 'WAX RNG',
  //                     link: '/es/build/tutorials/wax-rng/',
  //                     items: ['/es/build/tutorials/wax-rng/rng_install'],
  //                 },
  //                 {
  //                     text: 'Crear contrato RNG',
  //                     link: '/es/build/tutorials/create-wax-rng-smart-contract/',
  //                     items: [
  //                         '/es/build/tutorials/create-wax-rng-smart-contract/rng_basics',
  //                         '/es/build/tutorials/create-wax-rng-smart-contract/rng_sample',
  //                         '/es/build/tutorials/create-wax-rng-smart-contract/rng_test',
  //                         '/es/build/tutorials/create-wax-rng-smart-contract/rng_deploy',
  //                     ],
  //                 },
                      {
                        text: 'WharfKit',
                        link: '/es/build/tutorials/wharfkit/',
                        items: [
                            '/es/build/tutorials/wharfkit/howto_react',
                        ],
                      },
  //                 '/es/build/tutorials/howto_blockexplorer',
              ],
          },
  //         {
  //             text: 'Herramientas',
  //             link: '/es/build/tools/',
  //             collapsable: true,
  //             items: [
  //                 '/es/build/tools/blockchain_tools',
  //                 '/es/build/tools/os',
  //                 '/es/build/tools/cdt_options',
  //                 '/es/build/tools/ricardian_contract',
  //                 '/es/build/tools/ricardian_clause',
  //             ],
  //         },
  //         {
  //             text: 'API de referencia',
  //             link: '/es/build/api-reference/',
  //             collapsable: true,
  //             items: [
  //                 '/es/build/api-reference/rpc_api',
  //                 '/es/build/api-reference/cdt_api',
  //                 {
  //                     text: 'dFuse',
  //                     link: '/es/build/api-reference/dfuse',
  //                     collapsable: true,
  //                     items: ['/es/build/api-reference/dfuse/dfuse_example'],
  //                 },
  //             ],
  //         },
      ],
  },
  // {
  //     text: 'Operar',
  //     collapsable: false,
  //     sidebarDepth: 2,
  //     items: [
  //         {
  //             text: 'Conceptos básicos',
  //             link: '/es/operate/wax-bp/',
  //             collapsable: true,
  //             items: [
  //                 '/es/operate/wax-bp/chains-json',
  //                 '/es/operate/wax-bp/bp-json',
  //             ],
  //         },
  //         {
  //             text: 'API de Atomic Assets',
  //             link: '/es/operate/atomic-assets/',
  //             collapsable: true,
  //             items: [
  //                 '/es/operate/atomic-assets/setup-wax-atomic-api-node',
  //                 '/es/operate/atomic-assets/optimise-restore-wax-atomic-api-node',
  //             ],
  //         },
  //         {
  //             text: 'Guías',
  //             link: '/es/operate/wax-infrastructure/',
  //             collapsable: true,
  //             items: [
  //                 '/es/operate/wax-infrastructure/wax-testnet-node',
  //                 '/es/operate/wax-infrastructure/wax-snapshots',
  //                 '/es/operate/wax-infrastructure/wax-testnet-block-producer',
  //                 '/es/operate/wax-infrastructure/wax-mainnet-node',
  //                 '/es/operate/wax-infrastructure/wax-mainnet-node-load-balancer',
  //                 '/es/operate/wax-infrastructure/wax-mainnet-node-mitigate-abuse',
  //                 '/es/operate/wax-infrastructure/wax-mainnet-ship-node',
  //                 '/es/operate/wax-infrastructure/working-with-wax-software-files',
  //                 '/es/operate/wax-infrastructure/wax-ram-disk-utilisation',
  //                 '/es/operate/wax-infrastructure/wax-account-custom-permissions',
  //                 '/es/operate/wax-infrastructure/hyperion-guide',
  //                 '/es/operate/wax-infrastructure/atomic-api-guide',
  //             ],
  //         },
  //         {
  //             text: 'Servicios de API de WAX',
  //             link: '/es/operate/wax-api-services/',
  //             collapsable: true,
  //         },
  //     ],
  // },
  // {
  //     text: 'Crear',
  //     link: '/es/create/',
  //     collapsable: false,
  //     sidebarDepth: 1,
  //     items: [
  //         {
  //             text: 'Awesome WAX',
  //             link: '/es/create/awesome-wax/',
  //             collapsable: true,
  //         },
  //         {
  //             text: 'Ayúdanos a mejorar la documentación',
  //             link: '/es/create/docs/',
  //             collapsable: true,
  //         },
  //     ],
  // },
];
