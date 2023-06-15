const { description } = require('../../package')
const { path } = require('@vuepress/utils');
const sidebar = require('./sidebar/en');

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
      ariaLabel: 'English',
      label: 'English',
    },
    '/de/': {
      lang: 'de-DE',
      ariaLabel: 'Deutsch',
      label: 'Deutsch (WIP)',
    },
    '/es/': {
      lang: 'es-ES',
      ariaLabel: 'Spanish',
      label: 'Spanish (WIP)',
    }
  },

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: "wax-office-of-inspector-general/wax-developer",
    docsDir: 'docs',
    docsBranch: 'dev',
    repoLabel: 'Contribute',
    editLinks: true,
    editLinkText: 'Help us improve this page!',
    repoDisplay: false,
    lastUpdated: false,
    logo: "/logo.png",

    searchPlaceholder: 'Search…',
    
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

    sidebar: sidebar
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    ['@vuepress/plugin-search', {
      searchMaxSuggestions: 10,
      searchIcon: false,
    }],
  ]
}
