<script setup lang="ts">
import "../styles/content-columns.scss";

const props = defineProps({
  imgSrc: {
    type: Boolean,
    default: false
  },
})

</script>

<template>
  <img :src="props.imgSrc" />
</template>