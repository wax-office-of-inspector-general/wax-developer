import { defineConfig } from 'vitepress';
import enLocale from './locales/en/lang';
import esLocale from './locales/es/lang';
import cnLocale from './locales/cn/lang';
import { resolve } from 'path';
import VitepressThemeOverride from 'vitepress-plugin-theme-override';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  
  title: "WAX Developer Portal",
  description: "WAX Developer Portal - Inside the WAX Developer Portal, you'll find a wealth of resources to guide you on your development journey",
  
  lastUpdated: true,

  sitemap: {
    hostname: 'https://developer.wax.io'
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      light: '/assets/images/logo.png',
      dark: '/assets/images/logo.svg',
    },
    
    siteTitle: 'Developer',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wax-office-of-inspector-general/wax-developer' },
      { icon: 'twitter', link: 'https://twitter.com/WAX_io' },
    ],

    editLink: {
      pattern: 'https://github.com/wax-office-of-inspector-general/wax-developer/edit/main/docs/:path',
      text: 'Improve this page on GitHub'
    },

    search: {
      provider: 'local'
    }
  },
  locales: {
    root: enLocale,
    es: esLocale,
    cn: cnLocale,
  },
  head: [
    [
      'meta',
      {
        name: 'viewport',
        content:
          'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,viewport-fit=cover',
      },
    ],
    [
      'meta',
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'lack-translucent',
      },
    ],
    [
      'meta',
      {
        name: 'applicable-device',
        content: 'pc,mobile',
      },
    ],
    [
      'meta',
      {
        name: 'google',
        content: 'notranslate',
      },
    ],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['meta', { name: 'color-scheme', content: 'dark light' }],
    [
      'link',
      {
        rel: 'alternate',
        hreflang: 'zh',
        href: 'https://developer.wax.io/cn',
      },
    ],
    [
      'link',
      {
        rel: 'alternate',
        hreflang: 'es',
        href: 'https://yuanshen.site/docs/es',
      },
    ],
    [
      'link',
      {
        rel: 'alternate',
        href: `https://developer.wax.io/docs/public/favicon.ico`,
        type: 'image/x-icon',
      },
    ],
    ['meta', { name: 'referrer', content: 'no-referrer-when-downgrade' }],
    ['meta', { property: 'og:site', content: 'website' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@wax_io' }],
    ['meta', { name: 'twitter:widgets:csp', content: 'on' }],
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=UA-178851075-4' }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'TAG_ID');`
    ]
  ],
  vite: {
    plugins: [
      VitepressThemeOverride({
        overridePath: resolve(__dirname, './theme/overrides'),
        defaultThemeAlias: '~theme',
      }),
    ],
    resolve: {
      alias: []
    }
  }
})
