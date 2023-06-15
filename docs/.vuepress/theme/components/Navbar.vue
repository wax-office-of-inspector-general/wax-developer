<template>
  <header class="navbar">
    <SidebarButton @sidebar-toggle="$emit('sidebar-toggle')" />

    <RouterLink
      :to="$localePath"
      class="home-link"
    >
      <img
        v-if="$site.themeConfig.logo"
        class="logo"
        :src="$withBase($site.themeConfig.logo)"
        :alt="$siteTitle"
      >
    </RouterLink>

    <div
      class="links"
      :style="linksWrapMaxWidth ? {
        'max-width': linksWrapMaxWidth + 'px'
      } : {}"
    > 
      <AlgoliaSearchBox
        v-if="isAlgoliaSearch"
        :options="algolia"
      />
      <SearchBox v-else-if="$site.themeConfig.search !== false && $page.frontmatter.search !== false" />
    </div>
  </header>
</template>

<script>
import AlgoliaSearchBox from '@AlgoliaSearchBox'
import SearchBox from '@SearchBox'
import SidebarButton from '@theme/components/SidebarButton.vue'
import NavLinks from '@theme/components/NavLinks.vue'

export default {
  name: 'Navbar',

  components: {
    SidebarButton,
    NavLinks,
    SearchBox,
    AlgoliaSearchBox,
  },

  data () {
    return {
      linksWrapMaxWidth: null
    }
  },

  computed: {
    algolia () {
      return this.$themeLocaleConfig.algolia || this.$site.themeConfig.algolia || {}
    },

    isAlgoliaSearch () {
      return this.algolia && this.algolia.apiKey && this.algolia.indexName
    }
  },

  mounted () {
    const MOBILE_DESKTOP_BREAKPOINT = 719 // refer to config.styl
    const NAVBAR_VERTICAL_PADDING = parseInt(css(this.$el, 'paddingLeft')) + parseInt(css(this.$el, 'paddingRight'))
    const handleLinksWrapWidth = () => {
      if (document.documentElement.clientWidth < MOBILE_DESKTOP_BREAKPOINT) {
        this.linksWrapMaxWidth = null
      } else {
        this.linksWrapMaxWidth = this.$el.offsetWidth - NAVBAR_VERTICAL_PADDING
          - (this.$refs.siteName && this.$refs.siteName.offsetWidth || 0)
      }
    }
    handleLinksWrapWidth()
    window.addEventListener('resize', handleLinksWrapWidth, false)
  }
}

function css (el, property) {
  // NOTE: Known bug, will return 'auto' if style value is 'auto'
  const win = el.ownerDocument.defaultView
  // null means not to return pseudo styles
  return win.getComputedStyle(el, null)[property]
}
</script>

<style lang="stylus">
$navbar-vertical-padding = 0.7rem
$navbar-horizontal-padding = 1.5rem

.navbar
  padding-left $navbar-horizontal-padding
  padding-right $navbar-horizontal-padding
  line-height $navbarHeight - 1.4rem

  a, span, img
    display inline-block
  .logo
    height $navbarHeight - 1.4rem
    min-width $navbarHeight - 1.4rem
    margin-right 0.8rem
    vertical-align top
    display none
  .site-name
    font-size 1.3rem
    font-weight 600
    color $textColor
    position relative
  .links
    box-sizing border-box
    white-space nowrap
    font-size 0.9rem
    position absolute
    right $navbar-horizontal-padding
    top $navbar-vertical-padding
    display flex
    justify-content: end
    width: 100%
    .nav-links
      padding-right 1.5em
    .search-box
      flex: 0 0 auto
      vertical-align top
      margin-left auto
      input
        background: #FFF
        background-position: 1em center
        height: 2.2rem
        padding: 0px 16px
        border: 1px solid #E1DFFA
        border-radius 12px
        filter drop-shadow(0px 8px 40px rgba(123, 97, 255, 0.24))
        background: #FFF
        height: 48px
        width 180px!important
        &.focused
          border-bottom-right-radius 0
          border-bottom-left-radius 0
          width 331px!important
      .suggestions
        right 0
        border-color #E1DFFA
        border-top-right-radius 0
        border-top-left-radius 0
        width 350px!important


@media (max-width: $MQMobile)
  .navbar
    padding-left 0
    padding-top 0!important
    top 0
    display flex
    justify-content space-around
    align-items center
    flex-direction row
    height 70px
    .logo
      display block
      max-width: 120px
      margin 0
    .can-hide
      display none
    .links
      padding-left 1.5rem
      max-width 100px
    .site-name
      width calc(100vw - 9.4rem)
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
    .search-box
      input
        background: #FFF
        left: auto
        width 60px !important
        &.focused
          width 211px!important
          border-bottom-right-radius 0
          border-bottom-left-radius 0
      .suggestions
        border-color #E1DFFA
        border-top-right-radius 0
        border-top-left-radius 0
        width 300px!important

@media (max-width: $MQNarrow)
  .search-box
    input
      background: #FFF
      left: auto
      width 60px !important
      &.focused
        width 231px!important
        border-bottom-right-radius 0
        border-bottom-left-radius 0
    .suggestions
      border-color #E1DFFA
      border-top-right-radius 0
      border-top-left-radius 0
      width 250px!important
</style>