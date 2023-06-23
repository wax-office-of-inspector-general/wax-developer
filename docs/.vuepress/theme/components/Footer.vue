<template>
  <div class="footer">
    <div class="logo">
      <img
        v-if="$site.themeConfig.logo"
        class="logo can-hide"
        :src="$withBase($site.themeConfig.logo)"
        :alt="$siteTitle"
      >
    </div>
    <div v-if="hasFooterLinks" class="link-columns">
      <div v-for="(column, index) in footerColumns" class="link-column">
        <ul>
          <li>
            <span>{{ column.title }}</span>
          </li>
          <li
            v-if="column.links.length"
            v-for="link in column.links"
          >
            <a :href="link.href">
              {{ link.text }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  computed: {
    hasFooterLinks() {
      return this.$themeLocaleConfig.hasOwnProperty('footer')
    },
    footerColumns() {
      return this.$themeLocaleConfig.footer.columns
    },
  }
};
</script>
