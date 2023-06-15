<template>
  <aside class="sidebar">
    
    <div class="sidebar-logo">
      <RouterLink
        :to="$localePath"
        class="home-link"
      >
        <img
          v-if="$site.themeConfig.logo"
          class="logo can-hide"
          :src="$withBase($site.themeConfig.logo)"
          :alt="$siteTitle"
        >
        <span
          v-if="$siteTitle"
          ref="siteName"
          class="site-name"
          :class="{ 'can-hide': $site.themeConfig.logo }"
        >{{ $siteTitle }}</span>
      </RouterLink>
    </div>

    <slot name="top" />

    <SidebarLinks
      :depth="0"
      :items="items"
    />

    <!-- language switch -->
    <div class="sidebar-nav nav-links">
      <div
        v-if="navLinks.length"
        v-for="item in navLinks"
        :key="item.link"
        class="nav-item"
      >
        <DropdownLink
          v-if="item.type === 'links'"
          :item="item"
        />
      </div>
    </div>

    <slot name="bottom" />
  </aside>
</template>

<script>
import SidebarLinks from '@theme/components/SidebarLinks.vue'
import NavLinks from '@theme/components/NavLinks.vue'
import NavLink from '@theme/components/NavLink.vue'
import DropdownLink from '@theme/components/DropdownLink.vue'
import { resolveNavLinkItem } from '@parent-theme/util'

export default {
  name: 'Sidebar',

  components: { SidebarLinks, NavLinks, NavLink,  DropdownLink },

  props: ['items'],

  data () {
    return {
      isChecked: false
    }
  },

  computed: {
    navLinks () {
      return (this.languageNav || []).map(link => {
        return Object.assign(resolveNavLinkItem(link), {
          items: (link.items || []).map(resolveNavLinkItem)
        })
      })
    },

    languageNav () {
      const { locales } = this.$site
      if (locales && Object.keys(locales).length > 1) {
        const currentLink = this.$page.path
        const routes = this.$router.options.routes
        const themeLocales = this.$site.themeConfig.locales || {}
        const languageDropdown = {
          text: this.$themeLocaleConfig.selectText || 'Languages',
          ariaLabel: this.$themeLocaleConfig.ariaLabel || 'Select language',
          items: Object.keys(locales).map(path => {
            const locale = locales[path]
            const text = themeLocales[path] && themeLocales[path].label || locale.label
            let link
            // Stay on the current page
            if (locale.lang === this.$lang) {
              link = currentLink
            } else {
              // Try to stay on the same page
              link = currentLink.replace(this.$localeConfig.path, path)
              // fallback to homepage
              if (!routes.some(route => route.path === link)) {
                link = path
              }
            }
            return { text, link }
          })
        }
        return [languageDropdown]
      }
      return null
    },
  }
}
</script>

<style lang="stylus">

.sidebar 
  .nav-links
    width calc(100% - 3rem)
    margin-top auto
    background: #F8F8FF;
    border-top  1px solid $borderColor
    border-bottom 1px solid $borderColor
    padding 1rem 1.5rem
    
    a
      font-weight 600
    
    .nav-item 
      width calc(100% - 3em)
      display flex !important
      align-items center
    
      .dropdown-wrapper
        height auto
        padding 0.3em 0
        position relative
    
        .nav-dropdown
          background #fff
          border 1px solid $borderColor !important
          padding 0.5em
          min-width 200px
          border #eaecef
          top auto
          bottom 0
          right auto
          left 0

.sidebar
  display flex
  flex-direction column
  justify-content start
  padding-top 0px
  width 20rem !important
  border-right 1px solid $borderColor

  .sidebar-logo
    padding 1rem 1.5rem 1rem 1.5rem
    
    > a 
      display flex
      flex-direction coluns
      justify-content start
      align-items end
    
      .logo
        max-width 130px
        margin-bottom 0
    
      .site-name
        margin-left 0.5em
  
  > .sidebar-links > li > section > a
    font-size 1.35em
  
    > span:first-child
      &:after
        content ''
        display block
        margin-top 0.25em
        margin-bottom 0.25em
        width 1.5em
        border-bottom 2.5px solid $accentColor
    &.active
      font-weight bold
  
  .sidebar-links

    > li .sidebar-group
      > .sidebar-heading.open
        color $accentColor
        font-weight bold

    .sidebar-heading 
      display flex !important
      align-items center
      justify-content space-between

      .arrow
        top 0px !important
        border solid lighten($textColor, 30)
        border-width 0 1.5px 1.5px 0
        display inline-block
        padding 2.5px
        margin-left 0.3em
        &.right
          transform rotate(-45deg)
        &.down
          transform rotate(45deg)
        
    .sidebar-sub-headers
      display none

  .site-name
    display block
    font-size 14px
    font-weight 700

  ul
    padding 0
    margin 0
    list-style-type none

  a
    display inline-block

  & > .sidebar-links
    padding 1.5rem 0
    
    & > li > a.sidebar-link
      font-size 1em
      line-height 1.7
      font-weight bold
    
      &.active
        font-weight bold
    
    & > li:not(:first-child)
      margin-top .75rem

@media (max-width: $MQMobile)
  .sidebar
    .nav-links
      display block
      .dropdown-wrapper .nav-dropdown .dropdown-item a.router-link-active::after
        top calc(1rem - 2px)
    & > .sidebar-links
      padding 1rem 0
</style>