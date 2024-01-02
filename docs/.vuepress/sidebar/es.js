module.exports = [
    {
        title: 'Aprender',
        collapsable: false,
        sidebarDepth: 2,
        children: [
            {
                title: 'Acerca de WAX',
                path: '/es/learn/about-wax/',
                collapsable: true,
                sidebarDepth: 2,
                children: [
                    {
                        title: '¿Qué es WAX?',
                        lavel: '¿Qué es WAX?',
                        path: '/es/learn/about-wax/what-is-wax',
                    },
                    {
                        title: '¿Por qué WAX?',
                        path: '/es/learn/about-wax/why-wax',
                    },
                    {
                        title: '¿Qué es el token WAXP?',
                        path: '/es/learn/about-wax/what-is-waxp-token',
                    },
                    {
                        title: 'Consenso en WAX',
                        path: '/es/learn/about-wax/wax-consensus',
                    },
                    {
                        title: 'Interoperabilidad en WAX',
                        path: '/es/learn/about-wax/wax-interoparability',
                    },
                    {
                        title: 'Gobernanza en WAX',
                        path: '/es/learn/about-wax/wax-governance',
                    },
                ],
            },
        ],
    },
    {
        title: 'Construir',
        collapsable: false,
        sidebarDepth: 4,
        children: [
    //         {
    //             title: 'Desarrollo de dApps',
    //             path: '/es/build/dapp-development/',
    //             collapsable: true,
    //             children: [
    //                 {
    //                     title: 'Configuración del entorno local',
    //                     path: '/es/build/dapp-development/setup-local-dapp-environment/',
    //                     children: [
    //                         '/es/build/dapp-development/setup-local-dapp-environment/dapp_local',
    //                         '/es/build/dapp-development/setup-local-dapp-environment/dapp_environments',
    //                         '/es/build/dapp-development/setup-local-dapp-environment/dapp_wallet',
    //                         '/es/build/dapp-development/setup-local-dapp-environment/dapp_api',
    //                     ],
    //                 },
    //                 {
    //                     title: 'Configuración de Docker',
    //                     path: '/es/build/dapp-development/docker-setup/',
    //                     children: [
    //                         '/es/build/dapp-development/docker-setup/docker_qstart_getstarted',
    //                         '/es/build/dapp-development/docker-setup/docker_qstart_use',
    //                         '/es/build/dapp-development/docker-setup/docker_qstart_manage',
    //                     ],
    //                 },
    //                 {
    //                     title: 'Configuración de la cadena de bloques WAX',
    //                     path: '/es/build/dapp-development/wax-blockchain-setup/',
    //                     children: [
    //                         '/es/build/dapp-development/wax-blockchain-setup/blockchain_install',
    //                         '/es/build/dapp-development/wax-blockchain-setup/blockchain_uninstall',
    //                         '/es/build/dapp-development/wax-blockchain-setup/blockchain_verify',
    //                     ],
    //                 },
    //                 {
    //                     title: 'Desarrollo de contratos inteligentes',
    //                     path: '/es/build/dapp-development/smart-contract-quickstart/',
    //                     children: [
    //                         '/es/build/dapp-development/smart-contract-quickstart/smart_contract_basics',
    //                         '/es/build/dapp-development/smart-contract-quickstart/dapp_account',
    //                         '/es/build/dapp-development/smart-contract-quickstart/dapp_hello_world',
    //                         '/es/build/dapp-development/smart-contract-quickstart/dapp_dev_deploy',
    //                         '/es/build/dapp-development/smart-contract-quickstart/custom_permission',
    //                     ],
    //                 },
    //                 {
    //                     title: 'WAX CDT',
    //                     path: '/es/build/dapp-development/wax-cdt/',
    //                     children: [
    //                         '/es/build/dapp-development/wax-cdt/cdt_install',
    //                         '/es/build/dapp-development/wax-cdt/cdt_uninstall',
    //                         '/es/build/dapp-development/wax-cdt/cdt_use',
    //                         '/es/build/dapp-development/wax-cdt/cdt_cpp',
    //                     ],
    //                 },
    //                 {
    //                     title: 'Implementación en WAX',
    //                     path: '/es/build/dapp-development/deploy-dapp-on-wax/',
    //                     children: [
    //                         '/es/build/dapp-development/deploy-dapp-on-wax/deploy_source',
    //                         '/es/build/dapp-development/deploy-dapp-on-wax/deploy_docker',
    //                         '/es/build/dapp-development/deploy-dapp-on-wax/convert_eos',
    //                     ],
    //                 },
    //             ],
    //         },
    //         {
    //             title: 'MyCloudWallet',
    //             path: '/es/build/cloud-wallet/',
    //             collapsable: true,
    //             sidebarDepth: 1,
    //             children: [
    //                 {
    //                     title: 'wax.js',
    //                     path: '/es/build/cloud-wallet/waxjs/',
    //                     collapsable: true,
    //                     sidebarDepth: 1,
    //                     children: [
    //                         '/es/build/cloud-wallet/waxjs/waxjs_qstart',
    //                         '/es/build/cloud-wallet/waxjs/waxjs_install',
    //                         '/es/build/cloud-wallet/waxjs/waxjs_use',
    //                         '/es/build/cloud-wallet/waxjs/waxjs_demo',
    //                     ],
    //                 },
    //                 {
    //                     title: 'boost.wax',
    //                     path: '/es/build/cloud-wallet/boost-wax',
    //                     collapsable: true,
    //                     sidebarDepth: 1,
    //                 },
    //             ],
    //         },
            {
                title: 'Tutoriales',
                path: '/es/build/tutorials/',
                collapsable: true,
                children: [
                    // {
    //                     title: 'Guía de AtomicAssets',
    //                     path: '/es/build/tutorials/howto_atomicassets/',
    //                     children: [
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
    //                     title: 'Guía de SimpleAssets',
    //                     path: '/es/build/tutorials/howto_simpleassets/',
    //                     children: [
    //                         '/es/build/tutorials/howto_simpleassets/nft_basics',
    //                         '/es/build/tutorials/howto_simpleassets/nft_use',
    //                         '/es/build/tutorials/howto_simpleassets/nft_deploy',
    //                         '/es/build/tutorials/howto_simpleassets/nft_test',
    //                     ],
    //                 },
    //                 {
    //                     title: 'WAX RNG',
    //                     path: '/es/build/tutorials/wax-rng/',
    //                     children: ['/es/build/tutorials/wax-rng/rng_install'],
    //                 },
    //                 {
    //                     title: 'Crear contrato RNG',
    //                     path: '/es/build/tutorials/create-wax-rng-smart-contract/',
    //                     children: [
    //                         '/es/build/tutorials/create-wax-rng-smart-contract/rng_basics',
    //                         '/es/build/tutorials/create-wax-rng-smart-contract/rng_sample',
    //                         '/es/build/tutorials/create-wax-rng-smart-contract/rng_test',
    //                         '/es/build/tutorials/create-wax-rng-smart-contract/rng_deploy',
    //                     ],
    //                 },
                        {
                          title: 'WharfKit',
                          path: '/es/build/tutorials/wharfkit/',
                          children: [
                              '/es/build/tutorials/wharfkit/howto_react',
                              '/es/build/tutorials/wharfkit/multisession',
                          ],
                        },
    //                 '/es/build/tutorials/howto_blockexplorer',
                ],
            },
    //         {
    //             title: 'Herramientas',
    //             path: '/es/build/tools/',
    //             collapsable: true,
    //             children: [
    //                 '/es/build/tools/blockchain_tools',
    //                 '/es/build/tools/os',
    //                 '/es/build/tools/cdt_options',
    //                 '/es/build/tools/ricardian_contract',
    //                 '/es/build/tools/ricardian_clause',
    //             ],
    //         },
    //         {
    //             title: 'API de referencia',
    //             path: '/es/build/api-reference/',
    //             collapsable: true,
    //             children: [
    //                 '/es/build/api-reference/rpc_api',
    //                 '/es/build/api-reference/cdt_api',
    //                 {
    //                     title: 'dFuse',
    //                     path: '/es/build/api-reference/dfuse',
    //                     collapsable: true,
    //                     children: ['/es/build/api-reference/dfuse/dfuse_example'],
    //                 },
    //             ],
    //         },
        ],
    },
    // {
    //     title: 'Operar',
    //     collapsable: false,
    //     sidebarDepth: 2,
    //     children: [
    //         {
    //             title: 'Conceptos básicos',
    //             path: '/es/operate/wax-bp/',
    //             collapsable: true,
    //             children: [
    //                 '/es/operate/wax-bp/chains-json',
    //                 '/es/operate/wax-bp/bp-json',
    //             ],
    //         },
    //         {
    //             title: 'API de Atomic Assets',
    //             path: '/es/operate/atomic-assets/',
    //             collapsable: true,
    //             children: [
    //                 '/es/operate/atomic-assets/setup-wax-atomic-api-node',
    //                 '/es/operate/atomic-assets/optimise-restore-wax-atomic-api-node',
    //             ],
    //         },
    //         {
    //             title: 'Guías',
    //             path: '/es/operate/wax-infrastructure/',
    //             collapsable: true,
    //             children: [
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
    //             title: 'Servicios de API de WAX',
    //             path: '/es/operate/wax-api-services/',
    //             collapsable: true,
    //         },
    //     ],
    // },
    // {
    //     title: 'Crear',
    //     path: '/es/create/',
    //     collapsable: false,
    //     sidebarDepth: 1,
    //     children: [
    //         {
    //             title: 'Awesome WAX',
    //             path: '/es/create/awesome-wax/',
    //             collapsable: true,
    //         },
    //         {
    //             title: 'Ayúdanos a mejorar la documentación',
    //             path: '/es/create/docs/',
    //             collapsable: true,
    //         },
    //     ],
    // },
];
