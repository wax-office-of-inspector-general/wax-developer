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
        collapsed: true,
        items: [
            {
                text: 'dApp Development',
                link: '/build/dapp-development/',
                collapsed: true,
                items: [
                    {
                        text: 'Setup local Environment',
                        link: '/build/dapp-development/setup-local-dapp-environment/',
                        collapsed: true,
                        items: [
                            {text: 'Start a Local Node', link: '/build/dapp-development/setup-local-dapp-environment/dapp_local'},
                            {text: 'Blockchain Environments', link: '/build/dapp-development/setup-local-dapp-environment/dapp_environments'},
                            {text: 'Create a Wallet', link: '/build/dapp-development/setup-local-dapp-environment/dapp_wallet'},
                            {text: 'Access Local API', link: '/build/dapp-development/setup-local-dapp-environment/dapp_api'},
                        ],
                    },
                    {
                        text: 'Docker Setup',
                        link: '/build/dapp-development/docker-setup/',
                        collapsed: true,
                        items: [
                          {text: 'Run a WAX Container', link: '/build/dapp-development/docker-setup/docker_qstart_getstarted'},
                          {text: 'Run Commands', link: '/build/dapp-development/docker-setup/docker_qstart_use'},
                          {text: 'Manage Container', link: '/build/dapp-development/docker-setup/docker_qstart_manage'},
                        ],
                    },
                    {
                        text: 'WAX Blockchain Setup',
                        link: '/build/dapp-development/wax-blockchain-setup/',
                        collapsed: true,
                        items: [
                          {text: 'Install WAX Blockchain', link: '/build/dapp-development/wax-blockchain-setup/blockchain_install'},
                          {text: 'Uninstall WAX', link: '/build/dapp-development/wax-blockchain-setup/blockchain_uninstall'},
                          {text: 'Verify Your Install', link: '/build/dapp-development/wax-blockchain-setup/blockchain_verify'},
                        ],
                    },
                    {
                        text: 'Smart Contract Development',
                        link: '/build/dapp-development/smart-contract-quickstart/',
                        collapsed: true,
                        items: [
                          {text: 'Smart Contract Basics', link: '/build/dapp-development/smart-contract-quickstart/smart_contract_basics'},
                          {text: 'Create Accounts', link: '/build/dapp-development/smart-contract-quickstart/dapp_account'},
                          {text: 'Create a Smart Contract', link: '/build/dapp-development/smart-contract-quickstart/dapp_hello_world'},
                          {text: 'Deploy to Blockchain', link: '/build/dapp-development/smart-contract-quickstart/dapp_dev_deploy'},
                          {text: 'Custom Permissions', link: '/build/dapp-development/smart-contract-quickstart/custom_permission'},
                        ],
                    },
                    {
                        text: 'WAX CDT',
                        link: '/build/dapp-development/wax-cdt/',
                        collapsed: true,
                        items: [
                          {text: 'Install WAX-CDT', link: '/build/dapp-development/wax-cdt/cdt_install'},
                          {text: 'Uninstall WAX-CDT', link: '/build/dapp-development/wax-cdt/cdt_uninstall'},
                          {text: 'Sample Contracts', link: '/build/dapp-development/wax-cdt/cdt_use'},
                          {text: 'Build Tools', link: '/build/dapp-development/wax-cdt/cdt_cpp'},
                          {text: 'WAX-CDT Options', link: '/build/tools/cdt_options'},
                        ],
                    },
                    {
                        text: 'Deploy on WAX',
                        link: '/build/dapp-development/deploy-dapp-on-wax/',
                        collapsed: true,
                        items: [
                          {text: 'WAX-CDT Deploy', link: '/build/dapp-development/deploy-dapp-on-wax/deploy_source'},
                          {text: 'Docker Deploy', link: '/build/dapp-development/deploy-dapp-on-wax/deploy_docker'},
                          {text: 'Deploy an EOS dApp on WAX', link: '/build/dapp-development/deploy-dapp-on-wax/convert_eos'},
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
                            {text: 'Cloud Wallet Quickstart', link: '/build/cloud-wallet/waxjs/waxjs_qstart'},
                            {text: 'Install WaxJS', link: '/build/cloud-wallet/waxjs/waxjs_install'},
                            {text: 'Use WaxJS', link: '/build/cloud-wallet/waxjs/waxjs_use'},
                            {text: 'WaxJS Demo', link: '/build/cloud-wallet/waxjs/waxjs_demo'},
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
                            {text: 'Setting Up WalletConnect', link: '/build/cloud-wallet/wallet-connect/setting-up-walletconnect'},
                            {text: 'Developer Guide', link: '/build/cloud-wallet/wallet-connect/walletconnect-developer-guide'},
                            {text: 'Integration Guide', link: '/build/cloud-wallet/wallet-connect/walletconnect-integration-guide'},
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
                        collapsed: true,
                        items: [
                            {text: 'Collection Structure', link: '/build/tutorials/howto_atomicassets/collection_struct'},
                            {text: 'Collections', link: '/build/tutorials/howto_atomicassets/collection_js'},
                            {text: 'Schemas', link: '/build/tutorials/howto_atomicassets/schemas_js'},
                            {text: 'Templates', link: '/build/tutorials/howto_atomicassets/templates_js'},
                            {text: 'Mint NFT', link: '/build/tutorials/howto_atomicassets/mint_nft'},
                            {text: 'Transfer NFT', link: '/build/tutorials/howto_atomicassets/transfer_nft'},
                            {text: 'Mutable Data', link: '/build/tutorials/howto_atomicassets/mutabledata'},
                        ],
                    },
                    {
                        text: 'SimpleAssets Guide',
                        link: '/build/tutorials/howto_simpleassets/',
                        items: [
                            {text: 'Structure', link: '/build/tutorials/howto_simpleassets/nft_basics'},
                            {text: 'Mint NFT', link: '/build/tutorials/howto_simpleassets/nft_use'},
                            {text: 'Deploy NFT Smart Contract', link: '/build/tutorials/howto_simpleassets/nft_deploy'},
                            {text: 'Test NFT Smart Contract', link: '/build/tutorials/howto_simpleassets/nft_test'},
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
                            {text: 'RNG Basics', link: '/build/tutorials/create-wax-rng-smart-contract/rng_basics'},
                            {text: 'Calling RNG Contract', link: '/build/tutorials/create-wax-rng-smart-contract/rng_sample'},
                            {text: 'Test Your RNG Contract', link: '/build/tutorials/create-wax-rng-smart-contract/rng_test'},
                            {text: 'Deploy Your Smart Contract', link: '/build/tutorials/create-wax-rng-smart-contract/rng_deploy'},
                        ],
                    },
                    {
                        text: 'WharfKit',
                        link: '/build/tutorials/wharfkit/',
                        items: [
                          {text: 'Wharfkit in React', link: '/build/tutorials/wharfkit/howto_react'},
                        ],
                    },
                    {text: 'How To Explore WAX Blockchain', link: '/build/tutorials/howto_blockexplorer'}
                ],
            },
            {
                text: 'Tools',
                link: '/build/tools/',
                collapsed: true,
                items: [
                    {text: 'Blockchain Tools', link: '/build/tools/blockchain_tools'},
                    {text: 'Supported OS', link: '/build/tools/os'},
                    {text: 'WAX-CDT Options', link: '/build/tools/cdt_options'},
                    {text: 'Ricardian Contracts', link: '/build/tools/ricardian_contract'},
                    {text: 'Ricardian Clauses', link: '/build/tools/ricardian_clause'},
                ],
            },
            {
                text: 'API Reference',
                link: '/build/api-reference/',
                collapsed: true,
                items: [
                    {text: 'WAX-RPC API', link: '/build/api-reference/rpc_api'},
                    {text: 'WAX-CDT API', link: '/build/api-reference/cdt_api'},
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
        collapsed: true,
        items: [
            {
                text: 'Basics',
                link: '/operate/wax-bp/',
                collapsed: false,
                items: [
                    {text: 'chains.json', link: '/operate/wax-bp/chains-json'},
                    {text: 'bp.json', link: '/operate/wax-bp/bp-json'}
                ],
            },
            {
                text: 'Atomic Assets API',
                link: '/operate/atomic-assets/',
                collapsed: true,
                items: [
                    {text: '', link: '/operate/atomic-assets/setup-wax-atomic-api-node'},
                    {text: '', link: '/operate/atomic-assets/optimise-restore-wax-atomic-api-node'}
                ],
            },
            {
                text: 'Guides',
                link: '/operate/wax-infrastructure/',
                collapsed: true,
                items: [
                    {text: 'Set Up a Testnet Node', link: '/operate/wax-infrastructure/wax-testnet-node'},
                    {text: 'Set Up a Testnet Producer Node', link: '/operate/wax-infrastructure/wax-testnet-block-producer'},
                    {text: 'Set Up a Mainnet Node', link: '/operate/wax-infrastructure/wax-mainnet-node'},
                    {text: 'Set Up a State-Hisory Node', link: '/operate/wax-infrastructure/wax-mainnet-ship-node'},
                    {text: 'Using Snapshots', link: '/operate/wax-infrastructure/wax-snapshots'},
                    {text: 'Set Up a Load Balancer', link: '/operate/wax-infrastructure/wax-mainnet-node-load-balancer'},
                    {text: 'How To Mitigate API Abuse', link: '/operate/wax-infrastructure/wax-mainnet-node-mitigate-abuse'},
                    {text: 'WAX Files and Folders', link: '/operate/wax-infrastructure/working-with-wax-software-files'},
                    {text: 'Optimising RAM and Disk', link: '/operate/wax-infrastructure/wax-ram-disk-utilisation'},
                    {text: 'Custom Permissions', link: '/operate/wax-infrastructure/wax-account-custom-permissions'},
                    {text: 'How To Route API Queries', link: '/operate/wax-infrastructure/wax-route-specific-api-queries'},
                    {text: 'Set Up Websocket Support on a Load Balancer', link: '/operate/wax-infrastructure/wax-websocket-load-balancer'},
                    {text: 'Set Up Full/Partial History Nodes (Hyperion)', link: '/operate/wax-infrastructure/hyperion-guide'},
                    {text: 'Set Up an Atomic API Node', link: '/operate/wax-infrastructure/atomic-api-guide'} 
                ],
            },
            {
                text: 'WAX Hyperion History',
                link: '/operate/wax-hyperion/',
                collapsed: true,
                items: [
                    {text: 'Introduction', link: '/operate/wax-hyperion/wax-intro-to-hyperion-full-history'},
                    {text: 'Hyperion Conmponents', link: '/operate/wax-hyperion/wax-build-hyperion-software-components'},
                    {text: 'Configure Hyperion Components', link: '/operate/wax-hyperion/wax-config-hyperion-software-components'},
                    {text: 'Running Hyperion', link: '/operate/wax-hyperion/wax-running-hyperion'},
                    {text: 'Set Up Hyperion Cluster', link: '/operate/wax-hyperion/wax-clustering-elasticsearch-for-hyperion'},
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
        collapsed: true,
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
