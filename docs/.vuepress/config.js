import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  locales: {
    '/': {
      lang: 'en-US 🇺🇸',
      title: 'WAX Developer',
      description: 'WAX developer documentation hosted by WAX OIG and the developer community.',
    },
    '/de/': {
      lang: 'Deutsch 🇩🇪',
      title: 'VuePress',
      description: 'WAX developer documentation hosted by WAX OIG and the developer community.',
    },
    '/es/': {
      lang: 'Español 🇪🇸',
      title: 'VuePress',
      description: 'WAX developer documentation hosted by WAX OIG and the developer community.',
    },
  },
})