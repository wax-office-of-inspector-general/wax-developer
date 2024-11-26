import nav from './components/nav'
import sidebar from './components/sidebar'
import footer from './components/footer'

export default {
  label: 'English',
  lang: 'en-EN',
  title: 'WAX Developer Portal',
  description: "WAX Blockchain Documentation - Resources for developers building on WAX",
  themeConfig: {
    nav,
    sidebar,
    footer: {
      navigation: footer
    }  
  }
}