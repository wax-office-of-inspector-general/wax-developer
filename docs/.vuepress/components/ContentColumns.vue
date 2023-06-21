<template>
  <div
    class="content-columns-wrapper"
    :class="{'reverse': ltr}"
  >
    <div class="grid-column first">
      <slot name="first"></slot>
    </div>
    
    <div class="grid-column second">
      <slot name="second"></slot>
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
};
</script>

<style scoped lang="stylus">
.content-columns-wrapper
  width: 100%
  padding: 0 0 3em 0

  display: grid

  grid-gap: 1.5em 3em
  grid-template-columns: 1fr 1fr

  @media screen and (max-width: $MQNarrow)
    grid-gap: 1.5em 2em
    grid-template-columns: repeat(auto-fit, minmax(100%, 1fr))

  align-items: center
  justify-content: space-between

  &.reverse
    grid-template-columns: 1fr 2fr

    .grid-column.first
      order: 2

    .grid-column.second
      order: 1
</style>
