<script setup>
import VPHomeHero from '~theme/components/VPHomeHero.vue';
import { useData } from '~theme/composables/data';

const { frontmatter } = useData()
</script>

<template>
  <div class="VPHome">
    <slot name="home-hero-before" />
    <VPHomeHero>
      <template #home-hero-info-before><slot name="home-hero-info-before" /></template>
      <template #home-hero-info><slot name="home-hero-info" /></template>
      <template #home-hero-info-after><slot name="home-hero-info-after" /></template>
      <template #home-hero-actions-after><slot name="home-hero-actions-after" /></template>
      <template #home-hero-image><slot name="home-hero-image" /></template>
    </VPHomeHero>
    <slot name="home-hero-after" />

    <div class="home-content">
      <Content />
    </div>
  </div>
</template>

<style scoped>
.VPHome {
  margin-bottom: 96px;
}

@media (min-width: 768px) {
  .VPHome {
    margin-bottom: 128px;
  }
}

.home-content {
  padding: 48px 24px;
}

@media (min-width: 640px) {
  .home-content {
    padding: 64px 48px;
  }
}

@media (min-width: 960px) {
  .home-content {
    padding: 64px 64px;
  }
}
</style>