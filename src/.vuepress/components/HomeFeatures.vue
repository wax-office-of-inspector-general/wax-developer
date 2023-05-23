<script setup lang="ts">
import { usePageFrontmatter, usePageData } from "@vuepress/client";

const props = defineProps({
  features: {
    type: Object,
    default: {}
  },
})

// const features = computed(() => getFeatures());

const frontmatter = usePageFrontmatter();
const page = usePageData();

console.log(props);

</script>

<template>
  <div class="home-features">
    <h3>jojojo</h3>
    <p>This is my custom component</p>
    <ul v-if="props.features">
      <li>{{ props.features }}</li>
    </ul>
  </div>
</template>