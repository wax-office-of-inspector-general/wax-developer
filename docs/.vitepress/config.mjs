import { defineConfig } from 'vitepress'
import sidebarEN from './sidebar/en.js';
import esLocale from './locales/es/lang'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "WAX Developer Portal",
  description: "WAX Developer Portal - Inside the WAX Developer Portal, you'll find a wealth of resources to guide you on your development journey",
  lang: 'en-US',
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: sidebarEN,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    search: {
      provider: 'local'
    }
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en-US'
    },
    es: esLocale
  }
})
