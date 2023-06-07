const { description } = require('../../package')
const { path } = require('@vuepress/utils');

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Developer Portal',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  locales: {
    /* This is where you place your general locale config */
    '/': {
      lang: 'en-US',
    },
    '/de/': {
      lang: 'de-DE',
      title: 'Deutsch'
    }
  },

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: "wax-office-of-inspector-general/wax-developer",
    repoDisplay: false,
    editLinks: true,
    docsDir: 'docs',
    editLinkText: '',
    lastUpdated: false,
    logo: "/logo.png",
    
    // display all links in sidebar
    displayAllHeaders: true,
    
    nav: [
      {
        text: 'Learn',
        link: '/learn/',
      },
      {
        text: 'Build',
        link: '/build/'
      },
      {
        text: 'Operate',
        link: '/operate/'
      }
    ],
    /*
    sidebar: {
      '/': [
        {
          title: 'Home',
          collapsable: true,
          children: [
            '/learn/',
            '/build/',
            '/operate/',
          ]
        }
      ],
      '/learn/': [
        {
          title: 'Learn',
          collapsable: true,
          children: [
            '',
          ]
        }
      ],
      '/build/': [
        {
          title: 'Build',
          collapsable: true,
          children: [
            '',
          ]
        }
      ],
      '/operate/': [
        {
          title: 'Operate',
          collapsable: true,
          children: [
            '',
          ]
        }
      ],
    }
    */
    sidebar: [
      {
        title: 'Learn',   // required
        path: '/learn/',      // optional, link of the title, which should be an absolute path and must exist
        collapsable: false, // optional, defaults to true
        sidebarDepth: 3,    // optional, defaults to 1
        children: [
          '/learn/'
        ]
      },
      {
        title: 'Build',   // required
        path: '/build/',      // optional, link of the title, which should be an absolute path and must exist
        collapsable: false, // optional, defaults to true
        sidebarDepth: 2,    // optional, defaults to 1
        children: [
          '/build/'
        ]
      },
      {
        title: 'Operate',   // required
        path: '/operate/',      // optional, link of the title, which should be an absolute path and must exist
        collapsable: false, // optional, defaults to true
        sidebarDepth: 1,    // optional, defaults to 1
        children: [
          '/operate/'
        ]
      },
      {
        title: 'Create',   // required
        path: '/create/',      // optional, link of the title, which should be an absolute path and must exist
        collapsable: false, // optional, defaults to true
        sidebarDepth: 1,    // optional, defaults to 1
        children: [
          '/create/'
        ]
      },
    ]
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    ['@vuepress/plugin-search', {
      searchMaxSuggestions: 10
    }],
  ]
}
