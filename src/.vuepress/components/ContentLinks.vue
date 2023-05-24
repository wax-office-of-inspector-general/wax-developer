<script setup lang="ts">
import { usePageFrontmatter, usePageData } from "@vuepress/client";

import "../styles/content-links.scss";

const props = defineProps({
  ltr: {
    type: Boolean,
    default: false
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
  <div
    class="content-links-wrapper"
  >
    <div class="content-links-content">
      <slot name="content"></slot>
    </div>
    
    <div class="content-links-items">
      <slot name="items"></slot>
    </div>
  </div>
</template>