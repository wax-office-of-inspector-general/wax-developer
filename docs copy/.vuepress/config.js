import { defineUserConfig } from 'vuepress'
import * as theme from './theme.js';

export default defineUserConfig({

  theme: theme,

  locales: {
    '/': {
      lang: 'English 🇺🇸',
      title: 'WAX Developer',
      description: 'WAX developer documentation hosted by WAX OIG and the developer community.',
    },
    '/de/': {
      lang: 'Deutsch 🇩🇪',
      title: 'WAX Developer',
      description: 'WAX developer documentation hosted by WAX OIG and the developer community.',
    },
    '/es/': {
      lang: 'Español 🇪🇸',
      title: 'WAX Developer',
      description: 'WAX developer documentation hosted by WAX OIG and the developer community.',
    },
  },
})