<template>
  <nav
    v-if="userLinks.length || repoLink"
    class="nav-links"
  >
    <!-- user links -->
    <div
      v-for="item in userLinks"
      :key="item.link"
      class="nav-item"
    >
      <DropdownLink
        v-if="item.type === 'links'"
        :item="item"
      />
      <NavLink
        v-else
        :item="item"
      />
    </div>

    <!-- repo link -->
    <a
      v-if="repoLink"
      :href="repoLink"
      class="repo-link"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ repoLabel }}
      <OutboundLink />
    </a>
  </nav>
</template>

<script>
import DropdownLink from '@theme/components/DropdownLink.vue'
import { resolveNavLinkItem } from '@parent-theme/util'
import NavLink from '@theme/components/NavLink.vue'

export default {
  name: 'NavLinks',

  components: {
    NavLink,
    DropdownLink
  },

  computed: {
    nav () {
      return this.$themeLocaleConfig.nav || this.$site.themeConfig.nav || []
    },

    userLinks () {
      return (this.nav || []).map(link => {
        return Object.assign(resolveNavLinkItem(link), {
          items: (link.items || []).map(resolveNavLinkItem)
        })
      })
    },

    repoLink () {
      const { repo } = this.$site.themeConfig
      if (repo) {
        return /^https?:/.test(repo)
          ? repo
          : `https://github.com/${repo}`
      }
      return null
    },

    repoLabel () {
      if (!this.repoLink) return
      if (this.$site.themeConfig.repoLabel) {
        return this.$site.themeConfig.repoLabel
      }

      const repoHost = this.repoLink.match(/^https?:\/\/[^/]+/)[0]
      const platforms = ['GitHub', 'GitLab', 'Bitbucket']
      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i]
        if (new RegExp(platform, 'i').test(repoHost)) {
          return platform
        }
      }

      return 'Source'
    }
  }
}
</script>

<style lang="stylus">
.nav-links
  display inline-block
  a
    line-height 1.4rem
    color inherit
    &:hover, &.router-link-active
      color $accentColor
  .nav-item
    position relative
    display inline-block
    margin-left 1.5rem
    line-height 2rem
    &:first-child
      margin-left 0
  .repo-link
    margin-left 1.5rem

@media (max-width: $MQMobile)
  .nav-links
    .nav-item, .repo-link
      margin-left 0

@media (min-width: $MQMobile)
  .nav-links a
    &:hover, &.router-link-active
      color $textColor
  .nav-item > a:not(.external)
    &:hover, &.router-link-active
      margin-bottom -2px
      border-bottom 2px solid lighten($accentColor, 8%)
</style>