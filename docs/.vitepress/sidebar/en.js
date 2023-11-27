module.exports = [
    {
        text: 'Learn',
        link: '/learn/',
        collapsed: false,
        items: [
            {
                text: 'About WAX',
                link: '/learn/about-wax/',
                collapsed: true,
                sidebarDepth: 2,
                items: [
                    {
                        text: 'What is WAX?',
                        link: '/learn/about-wax/what-is-wax',
                    },
                    {
                        text: 'Why WAX?',
                        link: '/learn/about-wax/why-wax',
                    },
                    {
                        text: 'What is WAXP token?',
                        link: '/learn/about-wax/what-is-waxp-token',
                    },
                    {
                        text: 'Consensus on WAX',
                        link: '/learn/about-wax/wax-consensus',
                    },
                    {
                        text: 'WAX Interoparability',
                        link: '/learn/about-wax/wax-interoparability',
                    },
                    {
                        text: 'WAX Governance',
                        link: '/learn/about-wax/wax-governance',
                    },
                ],
            },
        ],
    },
    {
        text: 'Build',
        link: '/build/',
        collapsed: false,
        items: [
            {
                text: 'dApp Development',
                link: '/build/dapp-development/',
                collapsed: true,
                items: [
                    {
                        text: 'Setup local Environment',
                        link: '/build/dapp-development/setup-local-dapp-environment/',
                        items: [
                            '/build/dapp-development/setup-local-dapp-environment/dapp_local',
                            '/build/dapp-development/setup-local-dapp-environment/dapp_environments',
                            '/build/dapp-development/setup-local-dapp-environment/dapp_wallet',
                            '/build/dapp-development/setup-local-dapp-environment/dapp_api',
                        ],
                    },
                    {
                        text: 'Docker Setup',
                        link: '/build/dapp-development/docker-setup/',
                        items: [
                            '/build/dapp-development/docker-setup/docker_qstart_getstarted',
                            '/build/dapp-development/docker-setup/docker_qstart_use',
                            '/build/dapp-development/docker-setup/docker_qstart_manage',
                        ],
                    },
                    {
                        text: 'WAX Blockchain Setup',
                        link: '/build/dapp-development/wax-blockchain-setup/',
                        items: [
                            '/build/dapp-development/wax-blockchain-setup/blockchain_install',
                            '/build/dapp-development/wax-blockchain-setup/blockchain_uninstall',
                            '/build/dapp-development/wax-blockchain-setup/blockchain_verify',
                        ],
                    },
                    {
                        text: 'Smart Contract Development',
                        link: '/build/dapp-development/smart-contract-quickstart/',
                        items: [
                            '/build/dapp-development/smart-contract-quickstart/smart_contract_basics',
                            '/build/dapp-development/smart-contract-quickstart/dapp_account',
                            '/build/dapp-development/smart-contract-quickstart/dapp_hello_world',
                            '/build/dapp-development/smart-contract-quickstart/dapp_dev_deploy',
                            '/build/dapp-development/smart-contract-quickstart/custom_permission',
                        ],
                    },
                    {
                        text: 'WAX CDT',
                        link: '/build/dapp-development/wax-cdt/',
                        items: [
                            '/build/dapp-development/wax-cdt/cdt_install',
                            '/build/dapp-development/wax-cdt/cdt_uninstall',
                            '/build/dapp-development/wax-cdt/cdt_use',
                            '/build/dapp-development/wax-cdt/cdt_cpp',
                        ],
                    },
                    {
                        text: 'Deploy on WAX',
                        link: '/build/dapp-development/deploy-dapp-on-wax/',
                        items: [
                            '/build/dapp-development/deploy-dapp-on-wax/deploy_source',
                            '/build/dapp-development/deploy-dapp-on-wax/deploy_docker',
                            '/build/dapp-development/deploy-dapp-on-wax/convert_eos',
                        ],
                    },
                ],
            },
            {
                text: 'MyCloudWallet',
                link: '/build/cloud-wallet/',
                collapsed: true,
                items: [
                    {
                        text: 'wax.js',
                        link: '/build/cloud-wallet/waxjs/',
                        collapsed: true,
                        items: [
                            '/build/cloud-wallet/waxjs/waxjs_qstart',
                            '/build/cloud-wallet/waxjs/waxjs_install',
                            '/build/cloud-wallet/waxjs/waxjs_use',
                            '/build/cloud-wallet/waxjs/waxjs_demo',
                        ],
                    },
                    {
                        text: 'boost.wax',
                        link: '/build/cloud-wallet/boost-wax',
                        collapsed: true,
                    },
                    {
                        text: 'WalletConnect',
                        link: '/build/cloud-wallet/wallet-connect/',
                        collapsed: true,
                        items: [
                            '/build/cloud-wallet/wallet-connect/setting-up-walletconnect',
                            '/build/cloud-wallet/wallet-connect/walletconnect-developer-guide',
                            '/build/cloud-wallet/wallet-connect/walletconnect-integration-guide',
                        ],
                    },
                ],
            },
            {
                text: 'Tutorials',
                link: '/build/tutorials/',
                collapsed: true,
                items: [
                    {
                        text: 'AtomicAssets Guide',
                        link: '/build/tutorials/howto_atomicassets/',
                        items: [
                            '/build/tutorials/howto_atomicassets/collection_struct',
                            '/build/tutorials/howto_atomicassets/collection_js',
                            '/build/tutorials/howto_atomicassets/schemas_js',
                            '/build/tutorials/howto_atomicassets/templates_js',
                            '/build/tutorials/howto_atomicassets/mint_nft',
                            '/build/tutorials/howto_atomicassets/transfer_nft',
                            '/build/tutorials/howto_atomicassets/mutabledata',
                        ],
                    },
                    {
                        text: 'SimpleAssets Guide',
                        link: '/build/tutorials/howto_simpleassets/',
                        items: [
                            '/build/tutorials/howto_simpleassets/nft_basics',
                            '/build/tutorials/howto_simpleassets/nft_use',
                            '/build/tutorials/howto_simpleassets/nft_deploy',
                            '/build/tutorials/howto_simpleassets/nft_test',
                        ],
                    },
                    {
                        text: 'WAX RNG',
                        link: '/build/tutorials/wax-rng/',
                        items: ['/build/tutorials/wax-rng/rng_install'],
                    },
                    {
                        text: 'Create RNG Contract',
                        link: '/build/tutorials/create-wax-rng-smart-contract/',
                        items: [
                            '/build/tutorials/create-wax-rng-smart-contract/rng_basics',
                            '/build/tutorials/create-wax-rng-smart-contract/rng_sample',
                            '/build/tutorials/create-wax-rng-smart-contract/rng_test',
                            '/build/tutorials/create-wax-rng-smart-contract/rng_deploy',
                        ],
                    },
                    {
                        text: 'WharfKit',
                        link: '/build/tutorials/wharfkit/',
                        items: [
                            '/build/tutorials/wharfkit/howto_react',
                        ],
                    },
                    '/build/tutorials/howto_blockexplorer'
                ],
            },
            {
                text: 'Tools',
                link: '/build/tools/',
                collapsed: true,
                items: [
                    '/build/tools/blockchain_tools',
                    '/build/tools/os',
                    '/build/tools/cdt_options',
                    '/build/tools/ricardian_contract',
                    '/build/tools/ricardian_clause',
                ],
            },
            {
                text: 'API Reference',
                link: '/build/api-reference/',
                collapsed: true,
                items: [
                    '/build/api-reference/rpc_api',
                    '/build/api-reference/cdt_api',
                    {
                        text: 'dFuse',
                        link: '/build/api-reference/dfuse',
                        collapsed: true,
                        items: [
                            '/build/api-reference/dfuse/dfuse_example',
                        ],
                    }
                ],
            },
        ],
    },
    {
        text: 'Operate',
        link: '/operate/',
        collapsed: false,
        items: [
            {
                text: 'Basics',
                link: '/operate/wax-bp/',
                collapsed: true,
                items: [
                    '/operate/wax-bp/chains-json',
                    '/operate/wax-bp/bp-json'
                ],
            },
            {
                text: 'Atomic Assets API',
                link: '/operate/atomic-assets/',
                collapsed: true,
                items: [
                    '/operate/atomic-assets/setup-wax-atomic-api-node',
                    '/operate/atomic-assets/optimise-restore-wax-atomic-api-node'
                ],
            },
            {
                text: 'Guides',
                link: '/operate/wax-infrastructure/',
                collapsed: true,
                items: [
                    '/operate/wax-infrastructure/wax-testnet-node',
                    '/operate/wax-infrastructure/wax-snapshots',
                    '/operate/wax-infrastructure/wax-testnet-block-producer',
                    '/operate/wax-infrastructure/wax-mainnet-node',
                    '/operate/wax-infrastructure/wax-mainnet-node-load-balancer',
                    '/operate/wax-infrastructure/wax-mainnet-node-mitigate-abuse',
                    '/operate/wax-infrastructure/wax-mainnet-ship-node',
                    '/operate/wax-infrastructure/working-with-wax-software-files',
                    '/operate/wax-infrastructure/wax-ram-disk-utilisation',
                    '/operate/wax-infrastructure/wax-account-custom-permissions',
                    '/operate/wax-infrastructure/wax-route-specific-api-queries',
                    '/operate/wax-infrastructure/wax-websocket-load-balancer',
                    '/operate/wax-infrastructure/hyperion-guide',
                    '/operate/wax-infrastructure/atomic-api-guide' 
                ],
            },
            {
                text: 'WAX Hyperion History',
                link: '/operate/wax-hyperion/',
                collapsed: true,
                items: [
                    '/operate/wax-hyperion/wax-intro-to-hyperion-full-history'         
                ],
            },
            {
                text: 'WAX API Services',
                link: '/operate/wax-api-services/',
                collapsed: true,
            },
        ],
    },
    {
        text: 'Create',
        link: '/create/',
        collapsed: false,
        items: [
          {
            text: 'Awesome WAX',
            link: '/create/awesome-wax/',
            collapsed: true,
          },
          {
            text: 'Documentation',
            link: '/create/docs/',
            collapsed: true,
          },
        ],
    },
];
