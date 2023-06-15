<template>
  <div v-if="!isFrontPage" class="bread-crumbs">
    <span v-for="(crumb, index) in bread" :key="crumb.path">
      <router-link
        :to="crumb.path"
        :class="
          crumb.path === '' ? 'bread-crumb bread-crumb-nolink' : 'bread-crumb'
        "
        >{{ crumb.title }}</router-link
      >
      <span v-if="index !== bread.length - 1" class="bread-crumb-separator">
        &raquo;
      </span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumbs',
  computed: {
    isFrontPage() {
      return this.$page.path === '/'
    },
    bread() {
      const parts = this.$page.path.split('/');

      if (!parts[parts.length - 1].length) {
        parts.pop();
      }

      let link = '';
      
      const crumbs = parts.map((slug) => {
        link += slug;
        const page = this.$site.pages.find(
          (el) => el.path === link || el.path === link + '/'
        );
        link += '/';

        if (page) {
          return {
            path: page.path,
            title: page.frontmatter.breadcrumb || page.title,
          };
        } else {
          return {
            path: '',
            title: this.titleCase(slug),
          };
        }
      });

      return crumbs;
    },
  },
  methods: {
    titleCase: function (str) {
      return str
        .toLowerCase()
        .split(' ')
        .map(function (word) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
    },
  },
};
</script>
