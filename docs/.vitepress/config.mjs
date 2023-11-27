import { defineConfig } from 'vitepress'
import sidebarEN from './sidebar/en.js';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "WAX Developer Portal",
  description: "WAX Developer Portal - Inside the WAX Developer Portal, you'll find a wealth of resources to guide you on your development journey",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: sidebarEN,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
