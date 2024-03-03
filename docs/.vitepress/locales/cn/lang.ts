import nav from './components/nav'
import sidebar from './components/sidebar'

export default {
  label: 'Chinese',
  lang: 'cn-CN',
  title: 'WAX Docs',
  description: 'Portal para desarrolladores en WAX Blockchain',
  editLink: {
    pattern: 'https://github.com/wax-office-of-inspector-general/wax-developer/edit/main/docs/:path',
    text: 'Improve this page on GitHub'
  },
  themeConfig: {
    nav,
    sidebar,
  }
}