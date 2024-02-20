module.exports = [
    {
        title: '学习',
        collapsable: false,
        sidebarDepth: 2,
        children: [
            {
                title: '关于WAX',
                path: '/cn/learn/about-wax/',
                collapsable: true,
                sidebarDepth: 2,
                children: [
                    {
                        title: '什么是 WAX?',
                        path: '/cn/learn/about-wax/what-is-wax',
                    },
                    {
                        title: '为什么选择WAX?',
                        path: '/cn/learn/about-wax/why-wax',
                    },
                    {
                        title: '什么是WAXP代币?',
                        path: '/cn/learn/about-wax/what-is-waxp-token',
                    },
                    {
                        title: 'WAX的共识机制',
                        path: '/cn/learn/about-wax/wax-consensus',
                    },
                    {
                        title: 'WAX的互操作性',
                        path: '/cn/learn/about-wax/wax-interoparability',
                    },
                    {
                        title: 'WAX治理',
                        path: '/cn/learn/about-wax/wax-governance',
                    },
                ],
            },
        ],
    },
    /*
    {
        title: '建设',
        collapsable: false,
        sidebarDepth: 4,
        children: [
            {
                title: 'dApp的发展',
                path: '/cn/build/dapp-development/',
                collapsable: true,
                children: [
                    {
                        title: '设置本地环境',
                        path: '/cn/build/dapp-development/setup-local-dapp-environment/',
                        children: [
                            '/cn/build/dapp-development/setup-local-dapp-environment/dapp_local',
                            '/cn/build/dapp-development/setup-local-dapp-environment/dapp_environments',
                            '/cn/build/dapp-development/setup-local-dapp-environment/dapp_wallet',
                            '/cn/build/dapp-development/setup-local-dapp-environment/dapp_api',
                        ],
                    },
                    {
                        title: 'Docker设置',
                        path: '/cn/build/dapp-development/docker-setup/',
                        children: [
                            '/cn/build/dapp-development/docker-setup/docker_qstart_getstarted',
                            '/cn/build/dapp-development/docker-setup/docker_qstart_use',
                            '/cn/build/dapp-development/docker-setup/docker_qstart_manage',
                        ],
                    },
                    {
                        title: 'WAX链设置',
                        path: '/cn/build/dapp-development/wax-blockchain-setup/',
                        children: [
                            '/cn/build/dapp-development/wax-blockchain-setup/blockchain_install',
                            '/cn/build/dapp-development/wax-blockchain-setup/blockchain_uninstall',
                            '/cn/build/dapp-development/wax-blockchain-setup/blockchain_verify',
                        ],
                    },
                    {
                        title: '智能合约开发',
                        path: '/cn/build/dapp-development/smart-contract-quickstart/',
                        children: [
                            '/cn/build/dapp-development/smart-contract-quickstart/smart_contract_basics',
                            '/cn/build/dapp-development/smart-contract-quickstart/dapp_account',
                            '/cn/build/dapp-development/smart-contract-quickstart/dapp_hello_world',
                            '/cn/build/dapp-development/smart-contract-quickstart/dapp_dev_deploy',
                            '/cn/build/dapp-development/smart-contract-quickstart/custom_permission',
                        ],
                    },
                    {
                        title: 'WAX CDT',
                        path: '/cn/build/dapp-development/wax-cdt/',
                        children: [
                            '/cn/build/dapp-development/wax-cdt/cdt_install',
                            '/cn/build/dapp-development/wax-cdt/cdt_uninstall',
                            '/cn/build/dapp-development/wax-cdt/cdt_use',
                            '/cn/build/dapp-development/wax-cdt/cdt_cpp',
                        ],
                    },
                    {
                        title: '部署在WAX上',
                        path: '/cn/build/dapp-development/deploy-dapp-on-wax/',
                        children: [
                            '/cn/build/dapp-development/deploy-dapp-on-wax/deploy_source',
                            '/cn/build/dapp-development/deploy-dapp-on-wax/deploy_docker',
                            '/cn/build/dapp-development/deploy-dapp-on-wax/convert_eos',
                        ],
                    },
                ],
            },
            {
                title: '我的云钱包',
                path: '/cn/build/cloud-wallet/',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    {
                        title: 'wax.js',
                        path: '/cn/build/cloud-wallet/waxjs/',
                        collapsable: true,
                        sidebarDepth: 1,
                        children: [
                            '/cn/build/cloud-wallet/waxjs/waxjs_qstart',
                            '/cn/build/cloud-wallet/waxjs/waxjs_install',
                            '/cn/build/cloud-wallet/waxjs/waxjs_use',
                            '/cn/build/cloud-wallet/waxjs/waxjs_demo',
                        ],
                    },
                    {
                        title: 'boost.wax',
                        path: '/cn/build/cloud-wallet/boost-wax',
                        collapsable: true,
                        sidebarDepth: 1,
                    },
                    {
                        title: '连接钱包',
                        path: '/cn/build/cloud-wallet/wallet-connect/',
                        collapsable: true,
                        sidebarDepth: 1,
                        children: [
                            '/cn/build/cloud-wallet/wallet-connect/setting-up-walletconnect',
                            '/cn/build/cloud-wallet/wallet-connect/walletconnect-developer-guide',
                            '/cn/build/cloud-wallet/wallet-connect/walletconnect-integration-guide',
                        ],
                    },
                ],
            },
            {
                title: '教程',
                path: '/cn/build/tutorials/',
                collapsable: true,
                children: [
                    {
                        title: 'AtomicAssets指南',
                        path: '/cn/build/tutorials/howto_atomicassets/',
                        children: [
                            '/cn/build/tutorials/howto_atomicassets/collection_struct',
                            '/cn/build/tutorials/howto_atomicassets/collection_js',
                            '/cn/build/tutorials/howto_atomicassets/schemas_js',
                            '/cn/build/tutorials/howto_atomicassets/templates_js',
                            '/cn/build/tutorials/howto_atomicassets/mint_nft',
                            '/cn/build/tutorials/howto_atomicassets/transfer_nft',
                            '/cn/build/tutorials/howto_atomicassets/mutabledata',
                        ],
                    },
                    {
                        title: 'SimpleAssets指南',
                        path: '/cn/build/tutorials/howto_simpleassets/',
                        children: [
                            '/cn/build/tutorials/howto_simpleassets/nft_basics',
                            '/cn/build/tutorials/howto_simpleassets/nft_use',
                            '/cn/build/tutorials/howto_simpleassets/nft_deploy',
                            '/cn/build/tutorials/howto_simpleassets/nft_test',
                        ],
                    },
                    {
                        title: 'WAX RNG',
                        path: '/cn/build/tutorials/wax-rng/',
                        children: ['/cn/build/tutorials/wax-rng/rng_install'],
                    },
                    {
                        title: 'Create RNG Contract',
                        path: '/cn/build/tutorials/create-wax-rng-smart-contract/',
                        children: [
                            '/cn/build/tutorials/create-wax-rng-smart-contract/rng_basics',
                            '/cn/build/tutorials/create-wax-rng-smart-contract/rng_sample',
                            '/cn/build/tutorials/create-wax-rng-smart-contract/rng_test',
                            '/cn/build/tutorials/create-wax-rng-smart-contract/rng_deploy',
                        ],
                    },
                    {
                        title: 'WharfKit',
                        path: '/cn/build/tutorials/wharfkit/',
                        children: [
                            '/cn/build/tutorials/wharfkit/howto_react',
                            '/cn/build/tutorials/wharfkit/multissesion',
                        ],
                    },
                    {
                      title: '我的云钱包',
                      path: '/cn/build/tutorials/mycloudwallet/',
                      children: [
                          '/cn/build/tutorials/mycloudwallet/claim-account',
                          '/cn/build/tutorials/mycloudwallet/relink-account',
                      ],
                  },

                    '/cn/build/tutorials/howto_blockexplorer'
                ],
            },
            {
                title: '工具',
                path: '/cn/build/tools/',
                collapsable: true,
                children: [
                    '/cn/build/tools/blockchain_tools',
                    '/cn/build/tools/os',
                    '/cn/build/tools/cdt_options',
                    '/cn/build/tools/ricardian_contract',
                    '/cn/build/tools/ricardian_clause',
                ],
            },
            {
                title: 'API参考',
                path: '/cn/build/api-reference/',
                collapsable: true,
                children: [
                    '/cn/build/api-reference/rpc_api',
                    '/cn/build/api-reference/cdt_api',
                    {
                        title: 'dFuse',
                        path: '/cn/build/api-reference/dfuse',
                        collapsable: true,
                        children: [
                            '/cn/build/api-reference/dfuse/dfuse_example',
                        ],
                    }
                ],
            },
        ],
    },
    {
        title: '操作',
        collapsable: false,
        sidebarDepth: 2,
        children: [
            {
                title: '基础',
                path: '/cn/operate/wax-bp/',
                collapsable: true,
                children: [
                    '/cn/operate/wax-bp/chains-json',
                    '/cn/operate/wax-bp/bp-json'
                ],
            },
            {
                title: 'Atomic Assets的API',
                path: '/cn/operate/atomic-assets/',
                collapsable: true,
                children: [
                    '/cn/operate/atomic-assets/setup-wax-atomic-api-node',
                    '/cn/operate/atomic-assets/optimise-restore-wax-atomic-api-node'
                ],
            },
            {
                title: '指南',
                path: '/cn/operate/wax-infrastructure/',
                collapsable: true,
                children: [
                    '/cn/operate/wax-infrastructure/wax-testnet-node',
                    '/cn/operate/wax-infrastructure/wax-snapshots',
                    '/cn/operate/wax-infrastructure/wax-testnet-block-producer',
                    '/cn/operate/wax-infrastructure/wax-mainnet-node',
                    '/cn/operate/wax-infrastructure/wax-mainnet-node-load-balancer',
                    '/cn/operate/wax-infrastructure/wax-mainnet-node-mitigate-abuse',
                    '/cn/operate/wax-infrastructure/wax-mainnet-ship-node',
                    '/cn/operate/wax-infrastructure/working-with-wax-software-files',
                    '/cn/operate/wax-infrastructure/wax-ram-disk-utilisation',
                    '/cn/operate/wax-infrastructure/wax-account-custom-permissions',
                    '/cn/operate/wax-infrastructure/wax-route-specific-api-queries',
                    '/cn/operate/wax-infrastructure/wax-websocket-load-balancer',
                    '/cn/operate/wax-infrastructure/hyperion-guide',
                    '/cn/operate/wax-infrastructure/atomic-api-guide' 
                ],
            },
            {
                title: 'WAX Hyperion的历史',
                path: '/cn/operate/wax-hyperion/',
                collapsable: true,
                children: [
                    '/cn/operate/wax-hyperion/wax-intro-to-hyperion-full-history',
                    '/cn/operate/wax-hyperion/wax-config-hyperion-software-components',
                    '/cn/operate/wax-hyperion/wax-build-hyperion-software-components',
                    '/cn/operate/wax-hyperion/wax-running-hyperion',
                    '/cn/operate/wax-hyperion/wax-clustering-elasticsearch-for-hyperion',
                    '/cn/operate/wax-hyperion/wax-rectify-missing-blocks-in-hyperion',
                    '/cn/operate/wax-hyperion/wax-hyperion-indexer-scaling'
                ],
            },
            {
                title: 'WAX API服务',
                path: '/cn/operate/wax-api-services/',
                collapsable: true,
            },
        ],
    },
    {
        title: '创建',
        path: '/cn/create/',
        collapsable: false,
        sidebarDepth: 1,
        children: [
          {
            title: '很棒的WAX',
            path: '/cn/create/awesome-wax/',
            collapsable: true,
          },
          {
            title: '文档',
            path: '/cn/create/docs/',
            collapsable: true,
          },
        ],
    },
    */
];