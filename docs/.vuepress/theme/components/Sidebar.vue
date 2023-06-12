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
        <!-- <NavLink
          v-else
          :item="item"
        /> -->
        <label class="switch">
          <input type="checkbox" v-model="isChecked">
          <span class="slider"></span>
        </label>
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
.switch
  position relative
  display inline-block
  width: 44px
  height: 24px

.switch input
  opacity 0
  width 0
  height 0

.slider
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  transition: 0.4s;
  border: 1px solid #B3AEDF;
  border-radius: 18px;

.slider:before
  position absolute
  content ""
  height 18px
  width 18px
  left 4px
  bottom 2px
  background-color #8549B6
  transition .4s
  border-radius: 50%;

input:checked + .slider
  background-color #2196F3

input:focus + .slider
  box-shadow 0 0 1px #2196F3

input:checked + .slider:before
  transform translateX(16px)

.nav-item 
  width: 100%;
  display: flex !important;
  justify-content: space-between;
  align-items: center;
  padding-right: 1.5rem !important;

.sidebar-logo
  padding 0.5rem 0 0.5rem 1.5rem

.sidebar
  padding-top 40px
  .sidebar-nav
    width 100%
    display flex
  .logo
    max-width 130px
    margin-bottom 1em
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
  .nav-links
    background: #F8F8FF;
    border-top  1px solid $borderColor
    border-bottom 1px solid $borderColor
    padding 0.5rem 0 0.75rem 0
    a
      font-weight 600
    .nav-item, .repo-link
      display block
      line-height 1.25rem
      font-size 1.1em
      padding 0.5rem 0 0.5rem 1.5rem
  & > .sidebar-links
    padding 1.5rem 0
    & > li > a.sidebar-link
      font-size 1.1em
      line-height 1.7
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