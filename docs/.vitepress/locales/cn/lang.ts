import nav from './components/nav'
import sidebar from './components/sidebar'
import footer from './components/footer'

export default {
  label: 'Chinese',
  lang: 'cn-CN',
  title: 'WAX Docs',
  description: '开发者门户在WAX区块链',
  editLink: {
    pattern: 'https://github.com/wax-office-of-inspector-general/wax-developer/edit/main/docs/:path',
    text: 'Improve this page on GitHub'
  },
  themeConfig: {
    nav,
    sidebar,
    footer: {
      navigation: footer
    }  
  }
}