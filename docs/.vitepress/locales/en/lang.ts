import nav from './components/nav'
import sidebar from './components/sidebar'
import footer from './components/footer'

export default {
  label: 'English',
  lang: 'en-EN',
  title: 'WAX Developer Portal',
  description: "WAX Developer Portal - Inside the WAX Developer Portal, you'll find a wealth of resources to guide you on your development journey",
  themeConfig: {
    nav,
    sidebar,
    footer: {
      navigation: footer
    }  
  }
}