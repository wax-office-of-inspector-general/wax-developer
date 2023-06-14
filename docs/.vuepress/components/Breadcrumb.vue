<template>
  <div class="bread-crumbs">
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
  name: "Breadcrumbs",
  computed: {
    bread() {
      const parts = this.$page.path.split("/");

      // Bascially if there's a trailing slash then get rid of the blank
      if (!parts[parts.length - 1].length) {
        parts.pop();
      }

      let link = "";
      // Loop through the crumbs
      const crumbs = parts.map((slug) => {
        link += slug;
        const page = this.$site.pages.find(
          (el) => el.path === link || el.path === link + "/"
        );
        link += "/";
        // if a page is found
        if (page) {
          return {
            path: page.path,
            title: page.title || page.frontmatter.breadcrumb,
          };
        } else {
          return {
            path: "",
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
        .split(" ")
        .map(function (word) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    },
  },
};
</script>

<style lang="stylus" scoped>
.bread-crumbs {
  .bread-crumb {
    font-size: 0.7em;
    color: #999;

    &:hover {
      color: $accentColor;
    }

    &:last-child {
      color: #666;
    }
  }

  .bread-crumb-separator {
    color: #ccc;
  }

  .bread-crumb-nolink:hover {
    color: #999;
    cursor: default;
    text-decoration: none;
  }
}
</style>