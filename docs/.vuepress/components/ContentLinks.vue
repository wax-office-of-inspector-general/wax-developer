<template>
  <div class="content-links-wrapper">
    <div class="content-links-content">
      <slot name="content"></slot>
    </div>

    <div class="content-links-items">
      <slot name="items"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ltr: {
      type: Boolean,
      default: false
    },
  },
  // Add any additional logic or data properties here
  mounted() {
    // You can access props using `this.ltr`
    // You can access frontmatter using `this.$frontmatter`
    // You can access page data using `this.$page`
    /*
    console.log(this.ltr);
    console.log(this.$frontmatter);
    console.log(this.$page);
    */
  },
};
</script>

<style scoped lang="stylus">
.content-links-wrapper
  width: 100%
  padding: 0 0 3em 0

  align-items: center
  justify-content: space-between

  .content-links-content
    margin-bottom: 2.5em

  .content-links-items
    display: grid
    grid-gap: 8px 8px
    grid-template-columns: repeat(auto-fit, minmax(calc(50% - 8px), 1fr))

  &.reverse
    grid-template-columns: 1fr 2fr

    .grid-column.first
      order: 2

    .grid-column.second
      order: 1

</style>
