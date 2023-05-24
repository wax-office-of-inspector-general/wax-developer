<script setup lang="ts">
import { usePageFrontmatter, usePageData } from "@vuepress/client";

import "../styles/content-link-item.scss";

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  href: {
    type: String,
    default: ''
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
  <a :href="props.href" class="content-link-item">
    <span>{{ props.text }}</span>
  </a>
</template>