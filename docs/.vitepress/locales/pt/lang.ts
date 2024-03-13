import nav from './components/nav'
import sidebar from './components/sidebar'
import footer from './components/footer'

export default {
  label: 'Portuguese',
  lang: 'pt-BR',
  title: 'Portal do desenvolvedor WAX',
  description: 'Portal do desenvolvedor WAX - No Portal do desenvolvedor WAX, você encontrará uma grande variedade de recursos para orientá-lo em sua jornada de desenvolvimento',
  themeConfig: {
    nav,
    sidebar,
    footer: {
      navigation: footer
    }
  }
}
