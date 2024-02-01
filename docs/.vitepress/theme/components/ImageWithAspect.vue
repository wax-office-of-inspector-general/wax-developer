<template>
  <img :src="imgSrc" />
</template>

<script>
export default {
  props: {
    imgSrc: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped lang="stylus">

</style>
