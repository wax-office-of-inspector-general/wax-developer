<script setup lang="ts">
import "../styles/content-columns.scss";

const props = defineProps({
  ltr: {
    type: Boolean,
    default: false
  },
});

</script>

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