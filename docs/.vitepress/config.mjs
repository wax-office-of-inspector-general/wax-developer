import { defineConfig } from 'vitepress';
import sidebarEN from './sidebar/en.js';
import footerEN from './footer/en.js';
import esLocale from './locales/es/lang';
import cnLocale from './locales/cn/lang';
import { resolve } from 'path';
import VitepressThemeOverride from 'vitepress-plugin-theme-override';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "WAX Developer Portal",
  description: "WAX Developer Portal - Inside the WAX Developer Portal, you'll find a wealth of resources to guide you on your development journey",
  lang: 'en-US',
  lastUpdated: true,
  sitemap: {
    hostname: 'https://developer.wax.io'
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/assets/images/logo.png',
    
    siteTitle: 'Developer',
    
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: sidebarEN,

    footer: {
      navigation: footerEN
    },

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
    root: {
      label: 'English',
      lang: 'en-US'
    },
    es: esLocale,
    cn: cnLocale,
  },
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
