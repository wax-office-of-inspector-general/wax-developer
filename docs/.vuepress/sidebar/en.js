module.exports = [
  {
    title: 'Learn',
    path: '/learn/',
    collapsable: true,
    sidebarDepth: 2,
    initialOpenGroupIndex: 0,
    children: [
      {
        title: 'About WAX',
        path: '/learn/about-wax/',
        collapsable: true,
        sidebarDepth: 2,
        children: [
          {
            title: 'What is WAX?',
            path: '/learn/about-wax/what-is-wax',
          },
          {
            title: 'Why WAX?',
            path: '/learn/about-wax/why-wax',
          },
          {
            title: 'What is WAXP token?',
            path: '/learn/about-wax/what-is-waxp-token',
          },
          {
            title: 'Consensus on WAX',
            path: '/learn/about-wax/wax-consensus',
          },
          {
            title: 'Wax Interoparability',
            path: '/learn/about-wax/wax-interoparability',
          },
          {
            title: 'Wax Governance',
            path: '/learn/about-wax/wax-governance',
          },
        ]
      },
      {
        title: 'WAX Cloud Wallet',
        path: '/learn/wax-cloud-wallet/',
        collapsable: true,
        initialOpenGroupIndex: -1,
        sidebarDepth: 1,
        children: [
          {
            title: 'wax.js',
            path: '/learn/wax-cloud-wallet/waxjs/',
            collapsable: true,
            initialOpenGroupIndex: -1,
            sidebarDepth: 1,
            children: [
              '/learn/wax-cloud-wallet/waxjs/waxjs_qstart',
              '/learn/wax-cloud-wallet/waxjs/waxjs_install',
              '/learn/wax-cloud-wallet/waxjs/waxjs_use',
              '/learn/wax-cloud-wallet/waxjs/waxjs_demo',
            ]
          },
          {
            title: 'boost.wax',
            path: '/learn/wax-cloud-wallet/boost-wax',
            collapsable: true,
            initialOpenGroupIndex: -1,
            sidebarDepth: 1,
          }
        ]
      },
      /*
      {
        title: 'API Reference',
        path: '/learn/api-reference/',
        collapsable: false,
        sidebarDepth: 2,
      },
      {
        title: 'Release Notes',
        path: '/learn/release-notes/',
        collapsable: false,
        sidebarDepth: 2,
      },
      */
    ]
  },
  {
    title: 'Build',
    path: '/build/',
    collapsable: true,
    sidebarDepth: 4,
    children: [
      {
        title: 'dApp Development',
        path: '/build/dapp-development/',
        collapsable: true,
        children: [
          {
            title: 'Setup local Environment',
            path: '/build/dapp-development/setup-local-dapp-environment/',
          },
          {
            title: 'Docker Setup',
            path: '/build/dapp-development/docker-setup/',
          },
          {
            title: 'WAX Blockchain Setup',
            path: '/build/dapp-development/wax-blockchain-setup/',
          },
          {
            title: 'Smart Contract Development',
            path: '/build/dapp-development/smart-contract-quickstart/',
          },
          {
            title: 'WAX CDT',
            path: '/build/dapp-development/wax-cdt/',
            children: [
              '/build/dapp-development/wax-cdt/cdt_install',
              '/build/dapp-development/wax-cdt/cdt_uninstall',
              '/build/dapp-development/wax-cdt/cdt_use',
              '/build/dapp-development/wax-cdt/cdt_cpp',
            ]
          },
          {
            title: 'Deploy on WAX',
            path: '/build/dapp-development/deploy-dapp-on-wax/',
          },
        ]
      },
      {
        title: 'Tutorials',
        path: '/build/tutorials/',
        collapsable: true,
        children: [
          {
            title: 'AtomicAssets Guide',
            path: '/build/tutorials/howto_atomicassets/',
          },
          {
            title: 'SimpleAssets Guide',
            path: '/build/tutorials/howto_simpleassets/',
          },
          {
            title: 'WAX RNG',
            path: '/build/tutorials/wax-rng/',
          },
          {
            title: 'Create RNG Contract',
            path: '/build/tutorials/create-wax-rng-smart-contract/',
          },
        ]
      },
      {
        title: 'Tools',
        path: '/build/tools/',
        collapsable: true,
      },
    ]
  },
  {
    title: 'Operate',
    path: '/operate/',
    collapsable: false,
    sidebarDepth: 2,
    children: [
      '/operate/'
    ]
  },
  {
    title: 'Create',
    path: '/create/',
    collapsable: false,
    sidebarDepth: 1,
    children: [
      '/create/'
    ]
  },
]
