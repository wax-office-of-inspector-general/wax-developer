<template>
  <a :href="href" class="content-link-item">
    <span>{{ text }}</span>
  </a>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    href: {
      type: String,
      default: ''
    },
  },
  // Add any additional logic or data properties here
  mounted() {
    // You can access props using `this.text` and `this.href`
    // You can access frontmatter using `this.$frontmatter`
    // You can access page data using `this.$page`
    /*
    console.log(this.text);
    console.log(this.href);
    console.log(this.$frontmatter);
    console.log(this.$page);
    */
  },
};
</script>

<style scoped lang="stylus">
.content-link-item
  padding 2em 2.5em
  background-color #fff
  border-radius 0.5em
  
  margin-right: 1em
  margin-bottom 1em
  
  display inline-block

  color $accentColor
  filter drop-shadow(0px 12px 34px rgba(42, 13, 69, 0.08))

  &:hover
    filter drop-shadow(0px 12px 34px rgba(42, 13, 69, 0.18))
</style>
