<script setup lang="ts">
import { usePageFrontmatter, usePageData } from "@vuepress/client";

import "../styles/grid-catalog.scss";

const props = defineProps({
  features: {
    type: Object,
    default: {}
  },
})

// const features = computed(() => getFeatures());

const frontmatter = usePageFrontmatter();
const page = usePageData();

/*
console.log(props);
console.log(frontmatter.value);
console.log(page.value);
*/
</script>

<template>
  <div class="content-columns-wrapper">
    <div>
      <slot name="first"></slot>
    </div>
    
    <div>
      <slot name="second"></slot>
    </div>
  </div>
</template>